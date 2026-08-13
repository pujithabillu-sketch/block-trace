"""
BlockTrace - Deployment Configuration for AlgoKit deploy pipeline.
Deploys BlockTrace contract to LocalNet/TestNet and runs basic lifecycle validation.
"""
import logging
import algokit_utils
from algokit_utils import AlgoAmount

logger = logging.getLogger(__name__)


def deploy() -> None:
    from smart_contracts.artifacts.blocktrace.block_trace_client import (
        BlockTraceFactory,
        AuthorizeParticipantArgs,
        GetParticipantRoleArgs,
        RegisterProductArgs,
        TransferProductArgs,
        ReceiveProductArgs,
        VerifyProductArgs,
        RecallProductArgs,
        ReportCounterfeitArgs,
    )

    ROLE_MANUFACTURER = 1
    ROLE_DISTRIBUTOR = 2
    STATUS_REGISTERED = 0
    STATUS_AT_DISTRIBUTOR = 3
    STATUS_RECALLED = 7
    STATUS_COUNTERFEIT_REPORTED = 8

    algorand = algokit_utils.AlgorandClient.from_environment()
    admin = algorand.account.from_environment("DEPLOYER")

    logger.info("=== BlockTrace Deployment Starting ===")
    logger.info(f"Admin: {admin.address}")

    # 1. Deploy contract
    factory = algorand.client.get_typed_app_factory(
        BlockTraceFactory,
        default_sender=admin.address,
        default_signer=admin.signer,
    )
    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    logger.info(
        f"BlockTrace deployed: app_id={app_client.app_id}, "
        f"app_address={app_client.app_address}, "
        f"operation={result.operation_performed}"
    )

    # 2. Fund app for box MBR
    if result.operation_performed in [
        algokit_utils.OperationPerformed.Create,
        algokit_utils.OperationPerformed.Replace,
    ]:
        algorand.send.payment(
            algokit_utils.PaymentParams(
                amount=AlgoAmount(algo=5),
                sender=admin.address,
                receiver=app_client.app_address,
            )
        )
        logger.info("Funded app with 5 ALGO for box storage MBR")

    # 3. Create test accounts and fund them
    dispenser = algorand.account.localnet_dispenser()
    manufacturer_acct = algorand.account.random()
    distributor_acct = algorand.account.random()
    for acct in [manufacturer_acct, distributor_acct]:
        algorand.send.payment(
            algokit_utils.PaymentParams(
                sender=dispenser.address,
                receiver=acct.address,
                amount=AlgoAmount(algo=2),
            )
        )

    logger.info(f"Manufacturer: {manufacturer_acct.address}")
    logger.info(f"Distributor: {distributor_acct.address}")

    # Fund more MBR for box operations
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=app_client.app_address,
            amount=AlgoAmount(algo=3),
        )
    )

    # 4. Authorize manufacturer
    app_client.send.authorize_participant(
        args=AuthorizeParticipantArgs(
            account=manufacturer_acct.address, role=ROLE_MANUFACTURER
        )
    )
    logger.info(f"Authorized manufacturer: {manufacturer_acct.address}")

    # Verify role
    role_result = app_client.send.get_participant_role(
        args=GetParticipantRoleArgs(account=manufacturer_acct.address)
    )
    assert role_result.abi_return == ROLE_MANUFACTURER, "Manufacturer role not set correctly"
    logger.info(f"Manufacturer role confirmed: {role_result.abi_return}")

    # 5. Authorize distributor
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=app_client.app_address,
            amount=AlgoAmount(algo=1),
        )
    )
    app_client.send.authorize_participant(
        args=AuthorizeParticipantArgs(
            account=distributor_acct.address, role=ROLE_DISTRIBUTOR
        )
    )
    logger.info(f"Authorized distributor: {distributor_acct.address}")

    # 6. Register product
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=app_client.app_address,
            amount=AlgoAmount(algo=2),
        )
    )
    app_client_manufacturer = algorand.client.get_typed_app_client(
        BlockTraceFactory.get_client_class(),
        app_id=app_client.app_id,
        default_sender=manufacturer_acct.address,
        default_signer=manufacturer_acct.signer,
    )
    app_client_manufacturer.send.register_product(
        args=RegisterProductArgs(
            product_id="PROD-100001",
            batch_id="BATCH-2026-001",
            metadata_hash="sha256:cert-invoice-manufdoc-hash",
        )
    )
    logger.info("Product PROD-100001 registered by manufacturer")

    # 7. Verify registration
    verify_result = app_client.send.verify_product(
        args=VerifyProductArgs(product_id="PROD-100001")
    )
    record = verify_result.abi_return
    assert record.product_exists is True
    assert record.current_status == STATUS_REGISTERED
    logger.info(f"Product verified: status={record.current_status}, holder={record.current_holder}")

    # 8. Transfer to distributor
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=app_client.app_address,
            amount=AlgoAmount(algo=2),
        )
    )
    app_client_manufacturer.send.transfer_product(
        args=TransferProductArgs(
            product_id="PROD-100001",
            receiver=distributor_acct.address,
        )
    )
    logger.info("Transfer initiated: Manufacturer → Distributor")

    # 9. Distributor receives
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=app_client.app_address,
            amount=AlgoAmount(algo=2),
        )
    )
    app_client_distributor = algorand.client.get_typed_app_client(
        BlockTraceFactory.get_client_class(),
        app_id=app_client.app_id,
        default_sender=distributor_acct.address,
        default_signer=distributor_acct.signer,
    )
    app_client_distributor.send.receive_product(
        args=ReceiveProductArgs(product_id="PROD-100001")
    )
    verify_result = app_client.send.verify_product(
        args=VerifyProductArgs(product_id="PROD-100001")
    )
    assert verify_result.abi_return.current_status == STATUS_AT_DISTRIBUTOR
    logger.info(f"Distributor received product: status={verify_result.abi_return.current_status}")

    # 10. Register second product for recall demo
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=app_client.app_address,
            amount=AlgoAmount(algo=2),
        )
    )
    app_client_manufacturer.send.register_product(
        args=RegisterProductArgs(
            product_id="PROD-100002",
            batch_id="BATCH-2026-002",
            metadata_hash="sha256:prod2-cert-hash",
        )
    )
    logger.info("Product PROD-100002 registered")

    # 11. Recall PROD-100002
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=app_client.app_address,
            amount=AlgoAmount(algo=1),
        )
    )
    app_client.send.recall_product(
        args=RecallProductArgs(product_id="PROD-100002")
    )
    recall_verify = app_client.send.verify_product(
        args=VerifyProductArgs(product_id="PROD-100002")
    )
    assert recall_verify.abi_return.recalled is True
    assert recall_verify.abi_return.current_status == STATUS_RECALLED
    logger.info("PROD-100002 recalled: WARNING — PRODUCT RECALLED")

    # 12. Report counterfeit on a new product
    algorand.send.payment(
        algokit_utils.PaymentParams(
            sender=admin.address,
            receiver=app_client.app_address,
            amount=AlgoAmount(algo=2),
        )
    )
    app_client_manufacturer.send.register_product(
        args=RegisterProductArgs(
            product_id="PROD-100003",
            batch_id="BATCH-2026-003",
            metadata_hash="sha256:prod3-hash",
        )
    )
    app_client.send.report_counterfeit(
        args=ReportCounterfeitArgs(
            product_id="PROD-100003",
            report_hash="sha256:counterfeit-evidence-hash",
        )
    )
    cf_verify = app_client.send.verify_product(
        args=VerifyProductArgs(product_id="PROD-100003")
    )
    assert cf_verify.abi_return.counterfeit_reported is True
    assert cf_verify.abi_return.current_status == STATUS_COUNTERFEIT_REPORTED
    logger.info("PROD-100003 reported as counterfeit: SUSPICIOUS")

    logger.info("=== BlockTrace Deployment Validation COMPLETE ===")
    logger.info(f"App ID: {app_client.app_id}")
    logger.info("PROD-100001: AUTHENTIC / AT_DISTRIBUTOR")
    logger.info("PROD-100002: RECALLED")
    logger.info("PROD-100003: SUSPICIOUS / COUNTERFEIT_REPORTED")
