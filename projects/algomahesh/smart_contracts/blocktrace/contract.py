from algopy import (
    ARC4Contract,
    Account,
    BoxMap,
    Bytes,
    Global,
    String,
    Txn,
    UInt64,
    op,
)
from algopy.arc4 import (
    Address as ARC4Address,
    Bool as ARC4Bool,
    String as ARC4String,
    Struct,
    UInt64 as ARC4UInt64,
    UInt8 as ARC4UInt8,
    abimethod,
)

# Participant Roles
ROLE_NONE = 0
ROLE_MANUFACTURER = 1
ROLE_DISTRIBUTOR = 2
ROLE_WAREHOUSE = 3
ROLE_RETAILER = 4
ROLE_ADMIN = 5

# Product States
STATUS_REGISTERED = 0
STATUS_MANUFACTURED = 1
STATUS_IN_TRANSIT = 2
STATUS_AT_DISTRIBUTOR = 3
STATUS_AT_WAREHOUSE = 4
STATUS_AT_RETAILER = 5
STATUS_SOLD = 6
STATUS_RECALLED = 7
STATUS_COUNTERFEIT_REPORTED = 8
STATUS_LOST = 9


class ParticipantInfo(Struct):
    role: ARC4UInt8
    is_authorized: ARC4Bool


class ProductRecord(Struct):
    product_id: ARC4String
    manufacturer: ARC4Address
    current_holder: ARC4Address
    pending_recipient: ARC4Address
    batch_id: ARC4String
    metadata_hash: ARC4String
    creation_timestamp: ARC4UInt64
    last_update_timestamp: ARC4UInt64
    current_status: ARC4UInt8
    product_exists: ARC4Bool
    recalled: ARC4Bool
    counterfeit_reported: ARC4Bool


class HistoryEvent(Struct):
    product_id: ARC4String
    previous_holder: ARC4Address
    new_holder: ARC4Address
    timestamp: ARC4UInt64
    event_type: ARC4String
    status: ARC4UInt8


class BlockTrace(ARC4Contract):
    def __init__(self) -> None:
        self.admin = Account()
        self.participants = BoxMap(Account, ParticipantInfo)
        self.products = BoxMap(String, ProductRecord)
        self.history_counts = BoxMap(String, UInt64)
        self.history_events = BoxMap(Bytes, HistoryEvent)

    @abimethod(create="allow")
    def create_application(self) -> None:
        """Initialize smart contract and register deployer as admin."""
        self.admin = Txn.sender
        self.participants[Txn.sender] = ParticipantInfo(
            role=ARC4UInt8(ROLE_ADMIN),
            is_authorized=ARC4Bool(True),
        )

    @abimethod()
    def authorize_participant(self, account: Account, role: ARC4UInt8) -> None:
        """Authorize a supply-chain participant with a designated role."""
        assert Txn.sender == self.admin, "Only admin can authorize participants"
        assert (
            role.native >= ROLE_MANUFACTURER and role.native <= ROLE_ADMIN
        ), "Invalid participant role"
        self.participants[account] = ParticipantInfo(
            role=role,
            is_authorized=ARC4Bool(True),
        )

    @abimethod()
    def revoke_participant(self, account: Account) -> None:
        """Revoke participant authorization."""
        assert Txn.sender == self.admin, "Only admin can revoke participants"
        assert account in self.participants, "Participant not registered"
        self.participants[account] = ParticipantInfo(
            role=ARC4UInt8(ROLE_NONE),
            is_authorized=ARC4Bool(False),
        )

    @abimethod()
    def get_participant_role(self, account: Account) -> ARC4UInt8:
        """Get role of specified participant account."""
        if account in self.participants:
            info = self.participants[account].copy()
            if info.is_authorized.native:
                return info.role
        return ARC4UInt8(ROLE_NONE)

    @abimethod()
    def register_product(
        self, product_id: String, batch_id: String, metadata_hash: String
    ) -> None:
        """Register a new physical product on-chain by authorized manufacturer."""
        role = self.get_participant_role(Txn.sender).native
        assert (
            role == ROLE_MANUFACTURER or Txn.sender == self.admin
        ), "Caller is not an authorized manufacturer"

        assert bool(product_id), "Product ID cannot be empty"
        assert bool(batch_id), "Batch ID cannot be empty"
        assert bool(metadata_hash), "Metadata hash cannot be empty"
        assert product_id not in self.products, "Product ID already registered"

        now = Global.latest_timestamp
        sender_addr = ARC4Address(Txn.sender)
        zero_addr = ARC4Address(Account())

        record = ProductRecord(
            product_id=ARC4String(product_id),
            manufacturer=sender_addr,
            current_holder=sender_addr,
            pending_recipient=zero_addr,
            batch_id=ARC4String(batch_id),
            metadata_hash=ARC4String(metadata_hash),
            creation_timestamp=ARC4UInt64(now),
            last_update_timestamp=ARC4UInt64(now),
            current_status=ARC4UInt8(STATUS_REGISTERED),
            product_exists=ARC4Bool(True),
            recalled=ARC4Bool(False),
            counterfeit_reported=ARC4Bool(False),
        )
        self.products[product_id] = record.copy()

        self._record_history(
            product_id=product_id,
            previous_holder=sender_addr,
            new_holder=sender_addr,
            timestamp=now,
            event_type=String("PRODUCT_REGISTERED"),
            status=ARC4UInt8(STATUS_REGISTERED),
        )

    @abimethod()
    def transfer_product(self, product_id: String, receiver: Account) -> None:
        """Initiate product custody transfer to an authorized receiver."""
        assert product_id in self.products, "Product does not exist"
        record = self.products[product_id].copy()

        assert not record.recalled.native, "Cannot transfer recalled product"
        assert record.current_status.native != STATUS_SOLD, "Cannot transfer sold product"
        assert (
            record.current_status.native != STATUS_COUNTERFEIT_REPORTED
        ), "Cannot transfer counterfeit-reported product"
        assert (
            Txn.sender == record.current_holder.native
        ), "Only current holder can initiate transfer"

        receiver_role = self.get_participant_role(receiver).native
        assert receiver_role != ROLE_NONE, "Receiver is not an authorized participant"
        assert receiver != Txn.sender, "Cannot transfer product to yourself"

        now = Global.latest_timestamp
        updated_record = ProductRecord(
            product_id=record.product_id,
            manufacturer=record.manufacturer,
            current_holder=record.current_holder,
            pending_recipient=ARC4Address(receiver),
            batch_id=record.batch_id,
            metadata_hash=record.metadata_hash,
            creation_timestamp=record.creation_timestamp,
            last_update_timestamp=ARC4UInt64(now),
            current_status=ARC4UInt8(STATUS_IN_TRANSIT),
            product_exists=ARC4Bool(True),
            recalled=record.recalled,
            counterfeit_reported=record.counterfeit_reported,
        )
        self.products[product_id] = updated_record.copy()

        self._record_history(
            product_id=product_id,
            previous_holder=record.current_holder,
            new_holder=ARC4Address(receiver),
            timestamp=now,
            event_type=String("TRANSFER_INITIATED"),
            status=ARC4UInt8(STATUS_IN_TRANSIT),
        )

    @abimethod()
    def receive_product(self, product_id: String) -> None:
        """Confirm receipt of product transfer by the pending recipient."""
        assert product_id in self.products, "Product does not exist"
        record = self.products[product_id].copy()

        assert not record.recalled.native, "Cannot receive recalled product"
        assert record.current_status.native == STATUS_IN_TRANSIT, "Product is not in transit"
        assert Txn.sender == record.pending_recipient.native, "Caller is not designated recipient"

        role = self.get_participant_role(Txn.sender).native
        assert role != ROLE_NONE, "Recipient is not an authorized participant"

        # Use UInt64 for runtime-variable status selection (PuyaPy requires algopy types)
        new_status = UInt64(STATUS_IN_TRANSIT)
        if role == ROLE_MANUFACTURER:
            new_status = UInt64(STATUS_MANUFACTURED)
        if role == ROLE_DISTRIBUTOR:
            new_status = UInt64(STATUS_AT_DISTRIBUTOR)
        if role == ROLE_WAREHOUSE:
            new_status = UInt64(STATUS_AT_WAREHOUSE)
        if role == ROLE_RETAILER:
            new_status = UInt64(STATUS_AT_RETAILER)

        now = Global.latest_timestamp
        sender_addr = ARC4Address(Txn.sender)
        zero_addr = ARC4Address(Account())

        updated_record = ProductRecord(
            product_id=record.product_id,
            manufacturer=record.manufacturer,
            current_holder=sender_addr,
            pending_recipient=zero_addr,
            batch_id=record.batch_id,
            metadata_hash=record.metadata_hash,
            creation_timestamp=record.creation_timestamp,
            last_update_timestamp=ARC4UInt64(now),
            current_status=ARC4UInt8(new_status),
            product_exists=ARC4Bool(True),
            recalled=record.recalled,
            counterfeit_reported=record.counterfeit_reported,
        )
        self.products[product_id] = updated_record.copy()

        self._record_history(
            product_id=product_id,
            previous_holder=record.current_holder,
            new_holder=sender_addr,
            timestamp=now,
            event_type=String("RECEIPT_CONFIRMED"),
            status=ARC4UInt8(new_status),
        )

    @abimethod()
    def update_product_status(self, product_id: String, new_status: ARC4UInt8) -> None:
        """Update product lifecycle status by current holder (e.g. SOLD, LOST)."""
        assert product_id in self.products, "Product does not exist"
        record = self.products[product_id].copy()

        assert not record.recalled.native, "Cannot update status of recalled product"
        assert Txn.sender == record.current_holder.native, "Only current holder can update status"

        target_status = new_status.native
        assert (
            target_status == STATUS_SOLD
            or target_status == STATUS_LOST
            or target_status == STATUS_MANUFACTURED
            or target_status == STATUS_AT_DISTRIBUTOR
            or target_status == STATUS_AT_WAREHOUSE
            or target_status == STATUS_AT_RETAILER
        ), "Invalid status transition target"

        now = Global.latest_timestamp
        updated_record = ProductRecord(
            product_id=record.product_id,
            manufacturer=record.manufacturer,
            current_holder=record.current_holder,
            pending_recipient=record.pending_recipient,
            batch_id=record.batch_id,
            metadata_hash=record.metadata_hash,
            creation_timestamp=record.creation_timestamp,
            last_update_timestamp=ARC4UInt64(now),
            current_status=new_status,
            product_exists=ARC4Bool(True),
            recalled=record.recalled,
            counterfeit_reported=record.counterfeit_reported,
        )
        self.products[product_id] = updated_record.copy()

        self._record_history(
            product_id=product_id,
            previous_holder=record.current_holder,
            new_holder=record.current_holder,
            timestamp=now,
            event_type=String("STATUS_UPDATED"),
            status=new_status,
        )

    @abimethod()
    def report_counterfeit(self, product_id: String, report_hash: String) -> None:
        """Report a product as suspicious/counterfeit with evidence hash."""
        assert product_id in self.products, "Product does not exist"
        assert bool(report_hash), "Report hash cannot be empty"

        record = self.products[product_id].copy()
        now = Global.latest_timestamp

        updated_record = ProductRecord(
            product_id=record.product_id,
            manufacturer=record.manufacturer,
            current_holder=record.current_holder,
            pending_recipient=record.pending_recipient,
            batch_id=record.batch_id,
            metadata_hash=record.metadata_hash,
            creation_timestamp=record.creation_timestamp,
            last_update_timestamp=ARC4UInt64(now),
            current_status=ARC4UInt8(STATUS_COUNTERFEIT_REPORTED),
            product_exists=ARC4Bool(True),
            recalled=record.recalled,
            counterfeit_reported=ARC4Bool(True),
        )
        self.products[product_id] = updated_record.copy()

        self._record_history(
            product_id=product_id,
            previous_holder=record.current_holder,
            new_holder=record.current_holder,
            timestamp=now,
            event_type=String("COUNTERFEIT_REPORTED"),
            status=ARC4UInt8(STATUS_COUNTERFEIT_REPORTED),
        )

    @abimethod()
    def recall_product(self, product_id: String) -> None:
        """Recall product by admin or manufacturer."""
        assert product_id in self.products, "Product does not exist"
        record = self.products[product_id].copy()

        assert (
            Txn.sender == self.admin or Txn.sender == record.manufacturer.native
        ), "Only admin or product manufacturer can recall"

        now = Global.latest_timestamp
        updated_record = ProductRecord(
            product_id=record.product_id,
            manufacturer=record.manufacturer,
            current_holder=record.current_holder,
            pending_recipient=record.pending_recipient,
            batch_id=record.batch_id,
            metadata_hash=record.metadata_hash,
            creation_timestamp=record.creation_timestamp,
            last_update_timestamp=ARC4UInt64(now),
            current_status=ARC4UInt8(STATUS_RECALLED),
            product_exists=ARC4Bool(True),
            recalled=ARC4Bool(True),
            counterfeit_reported=record.counterfeit_reported,
        )
        self.products[product_id] = updated_record.copy()

        self._record_history(
            product_id=product_id,
            previous_holder=record.current_holder,
            new_holder=record.current_holder,
            timestamp=now,
            event_type=String("PRODUCT_RECALLED"),
            status=ARC4UInt8(STATUS_RECALLED),
        )

    @abimethod(readonly=True)
    def verify_product(self, product_id: String) -> ProductRecord:
        """Read-only method to fetch full product record for verification."""
        assert product_id in self.products, "Product does not exist"
        return self.products[product_id].copy()

    @abimethod(readonly=True)
    def get_product_status(self, product_id: String) -> ARC4UInt8:
        """Read-only method to query current status of a product."""
        assert product_id in self.products, "Product does not exist"
        return self.products[product_id].copy().current_status

    @abimethod(readonly=True)
    def get_history_count(self, product_id: String) -> UInt64:
        """Query number of history events recorded for a product."""
        if product_id in self.history_counts:
            return self.history_counts[product_id]
        return UInt64(0)

    @abimethod(readonly=True)
    def get_history_event(self, product_id: String, index: UInt64) -> HistoryEvent:
        """Fetch specific history event by index for a product."""
        key = self._history_key(product_id, index)
        assert key in self.history_events, "History event index out of bounds"
        return self.history_events[key].copy()

    def _history_key(self, product_id: String, index: UInt64) -> Bytes:
        return product_id.bytes + op.itob(index)

    def _record_history(
        self,
        product_id: String,
        previous_holder: ARC4Address,
        new_holder: ARC4Address,
        timestamp: UInt64,
        event_type: String,
        status: ARC4UInt8,
    ) -> None:
        count = UInt64(0)
        if product_id in self.history_counts:
            count = self.history_counts[product_id]

        key = self._history_key(product_id, count)
        event = HistoryEvent(
            product_id=ARC4String(product_id),
            previous_holder=previous_holder,
            new_holder=new_holder,
            timestamp=ARC4UInt64(timestamp),
            event_type=ARC4String(event_type),
            status=status,
        )
        self.history_events[key] = event.copy()
        self.history_counts[product_id] = count + UInt64(1)
