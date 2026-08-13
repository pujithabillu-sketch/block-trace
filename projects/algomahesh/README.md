# BlockTrace — Blockchain-Based Supply Chain Product Traceability & Anti-Counterfeit System

> Built on [Algorand](https://www.algorand.com/) using [AlgoKit](https://github.com/algorandfoundation/algokit-cli) · Python Smart Contracts · ARC-4 · Box Storage

---

## 1. Problem Statement

Traditional supply chains rely on centralized databases controlled by a single entity, creating risks of:

- **Data tampering** — records modified by insiders or hackers
- **Counterfeit products** — no independent way to verify product authenticity
- **Opaque custody chains** — customers cannot verify the full product journey
- **Recall inefficiency** — no reliable way to locate or flag affected batches

---

## 2. Proposed Solution

**BlockTrace** creates a **blockchain-backed digital identity** for every physical product. All critical supply-chain lifecycle events are recorded on the Algorand blockchain, creating a **tamper-resistant** and **independently verifiable** audit trail.

```
Manufacturer → Distributor → Warehouse → Retailer → Customer
     ↓               ↓             ↓           ↓          ↓
  [register]   [transfer/receive] ...      [sold]    [verify via QR]
```

---

## 3. Why Blockchain?

| Property | Centralized DB | Algorand Blockchain |
|---|---|---|
| Tamper resistance | ❌ Single point of control | ✅ Immutable, distributed |
| Verification | ❌ Trust organization | ✅ Verify independently |
| Transparency | ❌ Hidden | ✅ Publicly auditable |
| Counterfeit detection | ❌ Manual | ✅ On-chain state lookup |

---

## 4. Why Algorand?

- **Fast finality** — 4-second block times, instant confirmation
- **Low fees** — ~0.001 ALGO per transaction
- **Python-native smart contracts** — via `algorand-python` (Puya compiler)
- **Box storage** — efficient per-key on-chain storage for product records
- **ARC-4** — standardized ABI for typed method calls and client generation

---

## 5. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     BLOCKTRACE CONTRACT                      │
│                                                              │
│  Global State:                                               │
│    admin (address)                                           │
│                                                              │
│  Box Maps:                                                   │
│    participants[account] → ParticipantInfo{role, authorized} │
│    products[product_id]  → ProductRecord{...}               │
│    history_counts[id]    → UInt64                           │
│    history_events[id+i]  → HistoryEvent{...}                │
└──────────────────────────────────────────────────────────────┘
         ↑                              ↑
   algokit-utils v4               ARC-56 JSON spec
   Typed Python client            (auto-generated)
```

---

## 6. Product Lifecycle / State Machine

```
REGISTERED
    ↓  (register_product)
MANUFACTURED  ←→  IN_TRANSIT  ←→  AT_DISTRIBUTOR
                     ↓
                AT_WAREHOUSE
                     ↓
                 AT_RETAILER
                     ↓
                   SOLD

Any state → RECALLED           (admin/manufacturer only)
Any state → COUNTERFEIT_REPORTED (anyone with evidence hash)
Any state → LOST               (current holder)
```

### Status Codes

| Code | Status | Description |
|---|---|---|
| 0 | REGISTERED | Product just registered on-chain |
| 1 | MANUFACTURED | Confirmed by manufacturer |
| 2 | IN_TRANSIT | Custody transfer in-flight |
| 3 | AT_DISTRIBUTOR | Received by distributor |
| 4 | AT_WAREHOUSE | Received by warehouse |
| 5 | AT_RETAILER | Received by retailer |
| 6 | SOLD | Marked sold by retailer |
| 7 | RECALLED | Recalled — no further transfer allowed |
| 8 | COUNTERFEIT_REPORTED | Flagged as suspicious |
| 9 | LOST | Reported lost by holder |

---

## 7. Participant Roles

| Code | Role | Permissions |
|---|---|---|
| 0 | NONE | No access |
| 1 | MANUFACTURER | register_product, transfer, recall own products |
| 2 | DISTRIBUTOR | transfer, receive |
| 3 | WAREHOUSE | transfer, receive |
| 4 | RETAILER | transfer, receive, update_product_status (SOLD) |
| 5 | ADMIN | authorize/revoke participants, recall any product |

---

## 8. Smart Contract Methods

### Admin Methods
```python
create_application()                    # Deploy + set admin
authorize_participant(account, role)    # Grant supply-chain role
revoke_participant(account)             # Remove role
recall_product(product_id)             # Force recall (admin or manufacturer)
```

### Manufacturer Methods
```python
register_product(product_id, batch_id, metadata_hash)  # Create product record
```

### Authorized Participant Methods
```python
transfer_product(product_id, receiver)  # Initiate custody transfer
receive_product(product_id)             # Confirm receipt
update_product_status(product_id, new_status)  # Mark SOLD, LOST, etc.
```

### Anyone
```python
report_counterfeit(product_id, report_hash)  # Report suspicious product
```

### Read-only Verification
```python
verify_product(product_id)       → ProductRecord  # Full record lookup
get_product_status(product_id)   → uint8          # Current status
get_participant_role(account)    → uint8          # Role lookup
get_history_count(product_id)    → uint64         # Number of events
get_history_event(product_id, i) → HistoryEvent  # Individual event
```

---

## 9. Data Model

### ProductRecord (stored in Box Map)
```python
product_id          : String   # "PROD-100001"
manufacturer        : Address  # Original registrant
current_holder      : Address  # Current custody holder
pending_recipient   : Address  # Awaiting receipt confirmation
batch_id            : String   # "BATCH-2026-001"
metadata_hash       : String   # sha256 of off-chain documents
creation_timestamp  : UInt64   # Unix timestamp at registration
last_update_timestamp: UInt64  # Last modification time
current_status      : UInt8    # Status code (0–9)
product_exists      : Bool     # Existence flag
recalled            : Bool     # Recall flag
counterfeit_reported: Bool     # Counterfeit flag
```

### HistoryEvent (stored in Box Map, keyed by product_id+index)
```python
product_id      : String   # Product identifier
previous_holder : Address  # From
new_holder      : Address  # To
timestamp       : UInt64   # Unix timestamp
event_type      : String   # "PRODUCT_REGISTERED", "TRANSFER_INITIATED", etc.
status          : UInt8    # Status at time of event
```

---

## 10. On-Chain vs Off-Chain Architecture

```
ON-CHAIN (Algorand boxes)           OFF-CHAIN (IPFS / your storage)
─────────────────────────────       ─────────────────────────────────
product_id                          Product images
manufacturer address                Large descriptions
current holder                      PDF certificates
batch_id                            Invoices
metadata_hash (sha256)  ←────────── Manufacturing documents
creation/update timestamps          Shipping labels
product status                      Customer personal data
recall / counterfeit flags
supply-chain event log
```

### Document Integrity Verification
```
certificate.pdf  →  sha256("...") = "abcd1234..."
                                         ↓
                             Stored on Algorand blockchain
                                         ↓
Later: sha256(downloaded_file) == blockchain_hash?
   YES → Document unchanged ✅
   NO  → Document tampered ❌
```

---

## 11. Security Rules

| Rule | Enforcement |
|---|---|
| Only manufacturer registers products | `assert role == ROLE_MANUFACTURER` |
| No duplicate product IDs | `assert product_id not in self.products` |
| Only current holder transfers | `assert Txn.sender == record.current_holder` |
| Transfer only to authorized receivers | `assert receiver_role != ROLE_NONE` |
| No transfer of recalled products | `assert not record.recalled` |
| No transfer of sold products | `assert status != STATUS_SOLD` |
| No transfer of counterfeit-reported | `assert status != STATUS_COUNTERFEIT_REPORTED` |
| Only admin/manufacturer recalls | `assert sender == admin or sender == manufacturer` |
| Only admin authorizes participants | `assert Txn.sender == self.admin` |
| Recipient must accept transfer | Pending recipient pattern |
| Invalid status transitions rejected | Whitelist of valid status targets |

---

## 12. QR Code Verification Flow

```
Customer scans QR code
       ↓
Product ID extracted
       ↓
Query Algorand: verify_product(product_id)
       ↓
   ┌──────────────────────────────────┐
   │ product_exists == False?         │ → ⬜ NOT FOUND
   │ recalled == True?                │ → 🔴 RECALLED  
   │ counterfeit_reported == True?    │ → 🟡 SUSPICIOUS
   │ All clear                        │ → 🟢 AUTHENTIC
   └──────────────────────────────────┘
```

---

## 13. LocalNet Setup & Running Tests

### Prerequisites
```bash
# Install Docker Desktop
# Install AlgoKit
pip install algokit

# Start LocalNet (requires Docker)
algokit localnet start
```

### Build Smart Contracts
```bash
cd projects/algomahesh
poetry install
poetry run python -m smart_contracts build
```

Generated artifacts:
- `smart_contracts/artifacts/blocktrace/BlockTrace.arc56.json` — ARC-56 app spec
- `smart_contracts/artifacts/blocktrace/BlockTrace.approval.teal` — compiled TEAL
- `smart_contracts/artifacts/blocktrace/block_trace_client.py` — typed Python client

### Run Tests (requires LocalNet)
```bash
# Start LocalNet
algokit localnet start

# Run full test suite
poetry run pytest tests/test_blocktrace_contract.py -v

# Run specific test class
poetry run pytest tests/test_blocktrace_contract.py::TestProductTransfer -v
```

### Deploy to LocalNet
```bash
algokit localnet start
poetry run python -m smart_contracts deploy
```

### Deploy to TestNet
```bash
# Set your mnemonic
export DEPLOYER_MNEMONIC="word1 word2 ... word25"
algokit deploy testnet
```

---

## 14. Test Coverage

| Category | Tests |
|---|---|
| Admin authorization | 5 tests |
| Product registration | 5 tests |
| Product transfer lifecycle | 6 tests |
| Product verification | 5 tests |
| Product recall | 2 tests |
| Counterfeit reporting | 1 test |
| Security rejections | 12 tests |
| **Total** | **36 tests** |

---

## 15. Project Structure

```
Smart-Contracts/projects/algomahesh/
│
├── smart_contracts/
│   ├── __init__.py
│   ├── __main__.py                  # Build/deploy orchestrator
│   │
│   ├── blocktrace/
│   │   ├── contract.py             # BlockTrace ARC-4 smart contract
│   │   └── deploy_config.py        # Deployment + lifecycle validation
│   │
│   ├── hello_world/                # Original example (preserved)
│   │   ├── contract.py
│   │   └── deploy_config.py
│   │
│   └── artifacts/
│       ├── blocktrace/
│       │   ├── BlockTrace.arc56.json        # ARC-56 app spec
│       │   ├── BlockTrace.approval.teal     # Compiled TEAL
│       │   ├── BlockTrace.clear.teal
│       │   └── block_trace_client.py        # Auto-generated typed client
│       └── hello_world/
│           └── ...
│
├── tests/
│   ├── __init__.py
│   └── test_blocktrace_contract.py  # 36-test integration suite
│
├── pyproject.toml                   # Poetry deps + pytest config
├── .algokit.toml                    # AlgoKit project config
└── README.md                        # This file
```

---

## 16. Example Workflow

```python
# 1. Admin authorizes manufacturer
app_client.send.authorize_participant(
    args=AuthorizeParticipantArgs(account=manufacturer.address, role=1),
    params=CommonAppCallParams(sender=admin.address, signer=admin.signer),
)

# 2. Manufacturer registers product
app_client.send.register_product(
    args=RegisterProductArgs(
        product_id="PROD-100001",
        batch_id="BATCH-2026-001",
        metadata_hash="sha256:abcd1234...",
    ),
    params=CommonAppCallParams(sender=manufacturer.address, signer=manufacturer.signer),
)

# 3. Transfer: Manufacturer → Distributor
app_client.send.transfer_product(
    args=TransferProductArgs(product_id="PROD-100001", receiver=distributor.address),
    params=CommonAppCallParams(sender=manufacturer.address, signer=manufacturer.signer),
)

# 4. Distributor receives
app_client.send.receive_product(
    args=ReceiveProductArgs(product_id="PROD-100001"),
    params=CommonAppCallParams(sender=distributor.address, signer=distributor.signer),
)

# 5. Customer verifies via QR scan
result = app_client.send.verify_product(
    args=VerifyProductArgs(product_id="PROD-100001"),
)
# result.abi_return.recalled == False   → GREEN: AUTHENTIC ✅
```

---

## 17. Future Improvements

- **NFT-backed product identity** — mint ASA per product for wallet ownership
- **ZK proofs** — private supply-chain verification without exposing holders
- **Oracle integration** — IoT sensor data (temperature, location) on-chain
- **Multi-signature recalls** — require M-of-N admin consensus for recall
- **IPFS integration** — store document hashes + IPFS CIDs on-chain
- **Frontend DApp** — React + AlgoKit Utils browser QR scanner
- **Batch operations** — register/transfer multiple products atomically
- **Expiry / shelf-life** — automatic status update based on timestamp
