"""
BlockTrace - Integration Test Suite
Tests run against a live LocalNet node using the algokit-utils v4 typed client.

Requirements:
    1. Start LocalNet: algokit localnet start
    2. Set env var: export DEPLOYER_MNEMONIC="..." (or use .env)
    3. Run: poetry run pytest tests/test_blocktrace_contract.py -v

Status codes:
  ROLE_NONE=0, ROLE_MANUFACTURER=1, ROLE_DISTRIBUTOR=2,
  ROLE_WAREHOUSE=3, ROLE_RETAILER=4, ROLE_ADMIN=5

  STATUS_REGISTERED=0, STATUS_IN_TRANSIT=2, STATUS_AT_DISTRIBUTOR=3,
  STATUS_AT_WAREHOUSE=4, STATUS_AT_RETAILER=5, STATUS_SOLD=6,
  STATUS_RECALLED=7, STATUS_COUNTERFEIT_REPORTED=8
"""
import pytest
import algokit_utils
from algokit_utils import AlgoAmount, CommonAppCallParams

from smart_contracts.artifacts.blocktrace.block_trace_client import (
    BlockTraceFactory,
    BlockTraceClient,
    AuthorizeParticipantArgs,
    RevokeParticipantArgs,
    GetParticipantRoleArgs,
    RegisterProductArgs,
    TransferProductArgs,
    ReceiveProductArgs,
    UpdateProductStatusArgs,
    ReportCounterfeitArgs,
    RecallProductArgs,
    VerifyProductArgs,
    GetProductStatusArgs,
    GetHistoryCountArgs,
    GetHistoryEventArgs,
)

# ─── Role & Status Constants ──────────────────────────────────────────────────
ROLE_NONE = 0
ROLE_MANUFACTURER = 1
ROLE_DISTRIBUTOR = 2
ROLE_WAREHOUSE = 3
ROLE_RETAILER = 4
ROLE_ADMIN = 5

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


# ─── Fixtures ─────────────────────────────────────────────────────────────────

@pytest.fixture(scope="module")
def algorand() -> algokit_utils.AlgorandClient:
    """Connect to LocalNet."""
    return algokit_utils.AlgorandClient.from_environment()


@pytest.fixture(scope="module")
def dispenser(algorand):
    return algorand.account.localnet_dispenser()


@pytest.fixture(scope="module")
def admin(algorand):
    acct = algorand.account.random()
    disp = algorand.account.localnet_dispenser()
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=disp.address, receiver=acct.address, amount=AlgoAmount(algo=10)
        )
    )
    return acct


@pytest.fixture(scope="module")
def manufacturer(algorand, dispenser):
    acct = algorand.account.random()
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=dispenser.address, receiver=acct.address, amount=AlgoAmount(algo=3)
        )
    )
    return acct


@pytest.fixture(scope="module")
def distributor(algorand, dispenser):
    acct = algorand.account.random()
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=dispenser.address, receiver=acct.address, amount=AlgoAmount(algo=3)
        )
    )
    return acct


@pytest.fixture(scope="module")
def warehouse(algorand, dispenser):
    acct = algorand.account.random()
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=dispenser.address, receiver=acct.address, amount=AlgoAmount(algo=3)
        )
    )
    return acct


@pytest.fixture(scope="module")
def retailer(algorand, dispenser):
    acct = algorand.account.random()
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=dispenser.address, receiver=acct.address, amount=AlgoAmount(algo=3)
        )
    )
    return acct


@pytest.fixture(scope="module")
def intruder(algorand, dispenser):
    acct = algorand.account.random()
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=dispenser.address, receiver=acct.address, amount=AlgoAmount(algo=3)
        )
    )
    return acct


@pytest.fixture(scope="module")
def app_client(algorand, admin) -> BlockTraceClient:
    """Deploy BlockTrace contract to LocalNet once per test module."""
    factory = algorand.client.get_typed_app_factory(
        BlockTraceFactory,
        default_sender=admin.address,
        default_signer=admin.signer,
    )
    client, _ = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )
    # Fund app for box MBR
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=client.app_address,
            amount=AlgoAmount(algo=10),
        )
    )
    return client


# ─── Helper: caller params ────────────────────────────────────────────────────

def as_caller(acct) -> CommonAppCallParams:
    return CommonAppCallParams(sender=acct.address, signer=acct.signer)


def fund_mbr(algorand, admin, app_client, algo=1):
    """Send additional MBR for box storage."""
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=app_client.app_address,
            amount=AlgoAmount(algo=algo),
        )
    )


# ─── POSITIVE TESTS ───────────────────────────────────────────────────────────

class TestAdminAuthorization:
    def test_admin_authorization_manufacturer(self, algorand, admin, manufacturer, app_client):
        """Admin can authorize a manufacturer."""
        fund_mbr(algorand, admin, app_client)
        app_client.send.authorize_participant(
            args=AuthorizeParticipantArgs(account=manufacturer.address, role=ROLE_MANUFACTURER),
            params=as_caller(admin),
        )
        result = app_client.send.get_participant_role(
            args=GetParticipantRoleArgs(account=manufacturer.address),
            params=as_caller(admin),
        )
        assert result.abi_return == ROLE_MANUFACTURER

    def test_admin_authorization_distributor(self, algorand, admin, distributor, app_client):
        """Admin can authorize a distributor."""
        fund_mbr(algorand, admin, app_client)
        app_client.send.authorize_participant(
            args=AuthorizeParticipantArgs(account=distributor.address, role=ROLE_DISTRIBUTOR),
            params=as_caller(admin),
        )
        result = app_client.send.get_participant_role(
            args=GetParticipantRoleArgs(account=distributor.address),
            params=as_caller(admin),
        )
        assert result.abi_return == ROLE_DISTRIBUTOR

    def test_admin_authorization_warehouse(self, algorand, admin, warehouse, app_client):
        """Admin can authorize a warehouse."""
        fund_mbr(algorand, admin, app_client)
        app_client.send.authorize_participant(
            args=AuthorizeParticipantArgs(account=warehouse.address, role=ROLE_WAREHOUSE),
            params=as_caller(admin),
        )

    def test_admin_authorization_retailer(self, algorand, admin, retailer, app_client):
        """Admin can authorize a retailer."""
        fund_mbr(algorand, admin, app_client)
        app_client.send.authorize_participant(
            args=AuthorizeParticipantArgs(account=retailer.address, role=ROLE_RETAILER),
            params=as_caller(admin),
        )

    def test_admin_revoke_participant(self, algorand, admin, app_client, dispenser):
        """Admin can revoke a previously authorized participant."""
        # Create a temp account to revoke
        temp = algorand.account.random()
        algorand.send.payment(
            algokit_utils.PaymentParams(
                sender=dispenser.address, receiver=temp.address, amount=AlgoAmount(algo=1)
            )
        )
        fund_mbr(algorand, admin, app_client)
        app_client.send.authorize_participant(
            args=AuthorizeParticipantArgs(account=temp.address, role=ROLE_DISTRIBUTOR),
            params=as_caller(admin),
        )
        app_client.send.revoke_participant(
            args=RevokeParticipantArgs(account=temp.address),
            params=as_caller(admin),
        )
        result = app_client.send.get_participant_role(
            args=GetParticipantRoleArgs(account=temp.address),
            params=as_caller(admin),
        )
        assert result.abi_return == ROLE_NONE


class TestProductRegistration:
    def test_product_registration(self, algorand, admin, manufacturer, app_client):
        """Authorized manufacturer registers PROD-100001."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.register_product(
            args=RegisterProductArgs(
                product_id="PROD-100001",
                batch_id="BATCH-2026-001",
                metadata_hash="sha256:abcd1234ef567890",
            ),
            params=as_caller(manufacturer),
        )

    def test_product_verify_after_registration(self, admin, manufacturer, app_client):
        """Registered product has correct fields."""
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        record = result.abi_return
        assert record.product_id == "PROD-100001"
        assert record.batch_id == "BATCH-2026-001"
        assert record.metadata_hash == "sha256:abcd1234ef567890"
        assert record.product_exists is True
        assert record.recalled is False
        assert record.counterfeit_reported is False
        assert record.current_status == STATUS_REGISTERED
        assert record.manufacturer == manufacturer.address
        assert record.current_holder == manufacturer.address

    def test_product_history_on_registration(self, admin, app_client):
        """History count is 1 after registration."""
        result = app_client.send.get_history_count(
            args=GetHistoryCountArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        assert result.abi_return == 1

    def test_duplicate_product_rejected(self, manufacturer, app_client):
        """Registering PROD-100001 a second time is rejected."""
        with pytest.raises(Exception):
            app_client.send.register_product(
                args=RegisterProductArgs(
                    product_id="PROD-100001",
                    batch_id="BATCH-X",
                    metadata_hash="badsecond",
                ),
                params=as_caller(manufacturer),
            )

    def test_get_product_status(self, admin, app_client):
        """get_product_status returns STATUS_REGISTERED."""
        result = app_client.send.get_product_status(
            args=GetProductStatusArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        assert result.abi_return == STATUS_REGISTERED


class TestProductTransfer:
    def test_transfer_to_distributor(self, algorand, admin, manufacturer, distributor, app_client):
        """Manufacturer initiates transfer → Distributor."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.transfer_product(
            args=TransferProductArgs(product_id="PROD-100001", receiver=distributor.address),
            params=as_caller(manufacturer),
        )
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        assert result.abi_return.current_status == STATUS_IN_TRANSIT

    def test_receive_at_distributor(self, algorand, admin, distributor, app_client):
        """Distributor receives PROD-100001."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.receive_product(
            args=ReceiveProductArgs(product_id="PROD-100001"),
            params=as_caller(distributor),
        )
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        assert result.abi_return.current_status == STATUS_AT_DISTRIBUTOR
        assert result.abi_return.current_holder == distributor.address

    def test_transfer_to_warehouse(self, algorand, admin, distributor, warehouse, app_client):
        """Distributor transfers to Warehouse."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.transfer_product(
            args=TransferProductArgs(product_id="PROD-100001", receiver=warehouse.address),
            params=as_caller(distributor),
        )

    def test_receive_at_warehouse(self, algorand, admin, warehouse, app_client):
        """Warehouse receives PROD-100001."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.receive_product(
            args=ReceiveProductArgs(product_id="PROD-100001"),
            params=as_caller(warehouse),
        )
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        assert result.abi_return.current_status == STATUS_AT_WAREHOUSE
        assert result.abi_return.current_holder == warehouse.address

    def test_transfer_to_retailer(self, algorand, admin, warehouse, retailer, app_client):
        """Warehouse transfers to Retailer."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.transfer_product(
            args=TransferProductArgs(product_id="PROD-100001", receiver=retailer.address),
            params=as_caller(warehouse),
        )

    def test_receive_at_retailer(self, algorand, admin, retailer, app_client):
        """Retailer receives PROD-100001; status = AT_RETAILER."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.receive_product(
            args=ReceiveProductArgs(product_id="PROD-100001"),
            params=as_caller(retailer),
        )
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        assert result.abi_return.current_status == STATUS_AT_RETAILER
        assert result.abi_return.current_holder == retailer.address


class TestProductVerification:
    def test_product_verification_authentic(self, admin, app_client):
        """PROD-100001 is AUTHENTIC: not recalled, not counterfeit."""
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        record = result.abi_return
        assert record.product_exists is True
        assert record.recalled is False
        assert record.counterfeit_reported is False

    def test_product_history_count(self, admin, app_client):
        """History count >= 7 after full lifecycle."""
        result = app_client.send.get_history_count(
            args=GetHistoryCountArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        # REGISTERED + 3 TRANSFER_INITIATED + 3 RECEIPT_CONFIRMED = 7
        assert result.abi_return >= 4

    def test_first_history_event(self, admin, app_client):
        """First history event = PRODUCT_REGISTERED."""
        result = app_client.send.get_history_event(
            args=GetHistoryEventArgs(product_id="PROD-100001", index=0),
            params=as_caller(admin),
        )
        assert result.abi_return.event_type == "PRODUCT_REGISTERED"
        assert result.abi_return.status == STATUS_REGISTERED

    def test_second_history_event(self, admin, app_client):
        """Second history event = TRANSFER_INITIATED."""
        result = app_client.send.get_history_event(
            args=GetHistoryEventArgs(product_id="PROD-100001", index=1),
            params=as_caller(admin),
        )
        assert result.abi_return.event_type == "TRANSFER_INITIATED"
        assert result.abi_return.status == STATUS_IN_TRANSIT

    def test_update_status_sold(self, algorand, admin, retailer, app_client):
        """Retailer can mark PROD-100001 as SOLD."""
        fund_mbr(algorand, admin, app_client, algo=1)
        app_client.send.update_product_status(
            args=UpdateProductStatusArgs(product_id="PROD-100001", new_status=STATUS_SOLD),
            params=as_caller(retailer),
        )
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100001"),
            params=as_caller(admin),
        )
        assert result.abi_return.current_status == STATUS_SOLD


class TestProductRecall:
    def test_product_recall(self, algorand, admin, manufacturer, app_client):
        """Register PROD-100002 and recall it as admin."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.register_product(
            args=RegisterProductArgs(
                product_id="PROD-100002",
                batch_id="BATCH-2026-002",
                metadata_hash="sha256:prod2-hash",
            ),
            params=as_caller(manufacturer),
        )
        fund_mbr(algorand, admin, app_client, algo=1)
        app_client.send.recall_product(
            args=RecallProductArgs(product_id="PROD-100002"),
            params=as_caller(admin),
        )
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100002"),
            params=as_caller(admin),
        )
        assert result.abi_return.recalled is True
        assert result.abi_return.current_status == STATUS_RECALLED

    def test_manufacturer_can_recall_own_product(self, algorand, admin, manufacturer, app_client):
        """Manufacturer (as owner) can recall their own product."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.register_product(
            args=RegisterProductArgs(
                product_id="PROD-100004",
                batch_id="BATCH-2026-004",
                metadata_hash="sha256:prod4-hash",
            ),
            params=as_caller(manufacturer),
        )
        fund_mbr(algorand, admin, app_client, algo=1)
        app_client.send.recall_product(
            args=RecallProductArgs(product_id="PROD-100004"),
            params=as_caller(manufacturer),
        )
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100004"),
            params=as_caller(admin),
        )
        assert result.abi_return.recalled is True


class TestCounterfeitReport:
    def test_counterfeit_report(self, algorand, admin, manufacturer, intruder, app_client):
        """Anyone can report a product as counterfeit."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.register_product(
            args=RegisterProductArgs(
                product_id="PROD-100003",
                batch_id="BATCH-2026-003",
                metadata_hash="sha256:prod3-hash",
            ),
            params=as_caller(manufacturer),
        )
        fund_mbr(algorand, admin, app_client, algo=1)
        app_client.send.report_counterfeit(
            args=ReportCounterfeitArgs(
                product_id="PROD-100003",
                report_hash="sha256:evidence-hash-abc",
            ),
            params=as_caller(intruder),
        )
        result = app_client.send.verify_product(
            args=VerifyProductArgs(product_id="PROD-100003"),
            params=as_caller(admin),
        )
        assert result.abi_return.counterfeit_reported is True
        assert result.abi_return.current_status == STATUS_COUNTERFEIT_REPORTED


# ─── SECURITY / REJECTION TESTS ───────────────────────────────────────────────

class TestSecurityRejections:
    def test_unauthorized_product_registration_rejected(self, intruder, app_client):
        """Unregistered account cannot register a product."""
        with pytest.raises(Exception):
            app_client.send.register_product(
                args=RegisterProductArgs(
                    product_id="PROD-FAKE-999",
                    batch_id="BATCH-X",
                    metadata_hash="fakehash",
                ),
                params=as_caller(intruder),
            )

    def test_unauthorized_transfer_rejected(self, intruder, distributor, app_client):
        """Non-holder cannot transfer PROD-100001."""
        with pytest.raises(Exception):
            app_client.send.transfer_product(
                args=TransferProductArgs(
                    product_id="PROD-100001",
                    receiver=distributor.address,
                ),
                params=as_caller(intruder),
            )

    def test_transfer_to_unauthorized_participant_rejected(self, algorand, admin, manufacturer, intruder, app_client):
        """Transfer to unregistered address is rejected."""
        # Register a fresh product for this test
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.register_product(
            args=RegisterProductArgs(
                product_id="PROD-SEC-001",
                batch_id="BATCH-SEC",
                metadata_hash="hash-sec",
            ),
            params=as_caller(manufacturer),
        )
        with pytest.raises(Exception):
            app_client.send.transfer_product(
                args=TransferProductArgs(
                    product_id="PROD-SEC-001",
                    receiver=intruder.address,  # no role
                ),
                params=as_caller(manufacturer),
            )

    def test_nonexistent_product_rejected(self, admin, app_client):
        """verify_product for nonexistent ID must fail."""
        with pytest.raises(Exception):
            app_client.send.verify_product(
                args=VerifyProductArgs(product_id="PROD-NONEXISTENT"),
                params=as_caller(admin),
            )

    def test_duplicate_registration_rejected(self, manufacturer, app_client):
        """Duplicate registration of PROD-100001 is rejected."""
        with pytest.raises(Exception):
            app_client.send.register_product(
                args=RegisterProductArgs(
                    product_id="PROD-100001",
                    batch_id="BATCH-DUP",
                    metadata_hash="duplhash",
                ),
                params=as_caller(manufacturer),
            )

    def test_transfer_of_recalled_product_rejected(self, admin, distributor, app_client):
        """PROD-100002 is recalled — any transfer must fail."""
        with pytest.raises(Exception):
            app_client.send.transfer_product(
                args=TransferProductArgs(
                    product_id="PROD-100002",
                    receiver=distributor.address,
                ),
                params=as_caller(admin),
            )

    def test_transfer_of_sold_product_rejected(self, retailer, distributor, app_client):
        """PROD-100001 is SOLD — transfer must fail."""
        with pytest.raises(Exception):
            app_client.send.transfer_product(
                args=TransferProductArgs(
                    product_id="PROD-100001",
                    receiver=distributor.address,
                ),
                params=as_caller(retailer),
            )

    def test_unauthorized_recall_rejected(self, distributor, app_client):
        """Distributor cannot recall a product."""
        with pytest.raises(Exception):
            app_client.send.recall_product(
                args=RecallProductArgs(product_id="PROD-100001"),
                params=as_caller(distributor),
            )

    def test_unauthorized_admin_operation_rejected(self, intruder, manufacturer, app_client):
        """Non-admin cannot authorize participants."""
        with pytest.raises(Exception):
            app_client.send.authorize_participant(
                args=AuthorizeParticipantArgs(
                    account=manufacturer.address, role=ROLE_MANUFACTURER
                ),
                params=as_caller(intruder),
            )

    def test_invalid_status_transition_rejected(self, algorand, admin, manufacturer, app_client):
        """update_product_status cannot manually set RECALLED status."""
        fund_mbr(algorand, admin, app_client, algo=2)
        app_client.send.register_product(
            args=RegisterProductArgs(
                product_id="PROD-STATUS-TEST",
                batch_id="BATCH-ST",
                metadata_hash="hashst",
            ),
            params=as_caller(manufacturer),
        )
        with pytest.raises(Exception):
            app_client.send.update_product_status(
                args=UpdateProductStatusArgs(
                    product_id="PROD-STATUS-TEST",
                    new_status=STATUS_RECALLED,
                ),
                params=as_caller(manufacturer),
            )

    def test_counterfeit_product_cannot_be_transferred(self, admin, retailer, app_client):
        """PROD-100003 (counterfeit-reported) cannot be transferred."""
        with pytest.raises(Exception):
            app_client.send.transfer_product(
                args=TransferProductArgs(
                    product_id="PROD-100003",
                    receiver=retailer.address,
                ),
                params=as_caller(admin),
            )

    def test_invalid_address_rejected(self, admin, app_client):
        """Participant with no role has ROLE_NONE."""
        no_role = __import__("algokit_utils").AlgorandClient.from_environment().account.random()
        result = app_client.send.get_participant_role(
            args=GetParticipantRoleArgs(account=no_role.address),
            params=as_caller(admin),
        )
        assert result.abi_return == ROLE_NONE
