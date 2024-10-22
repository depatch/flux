import json
import os
import shutil

import deploy_config
from config import Config

import libroll as lib


####################################################################################################

def deploy(config: Config):
    """
    Deploy the rollup by deploying the contracts to L1 then generating the L2 genesis file, but does
    not start the software components.
    """
    os.makedirs(config.artifacts_dir, exist_ok=True)
    deploy_contracts_on_l1(config)
    _generate_l2_genesis(config)
    config.deployments = lib.read_json_file(config.addresses_path)

    if config.deployments.get("L2OutputOracleProxy") is None:
        raise Exception(
            "L2OutputOracleProxy address not found in addresses.json. "
            "Try redeploying the L1 contracts.")


####################################################################################################

def deploy_contracts_on_l1(config: Config, tmp_l1=False):
    """
    Deploy the L2 contracts to an L1. If `tmp_l1` is true, indicates we're deploying to a temporary
    node with the goal of dumping the contracts for inclusion in devnet L1 genesis.
    """

    if not tmp_l1:
        if os.path.exists(config.deploy_config_path) and os.path.exists(config.addresses_path):
            print("L2 contracts already deployed.")
            return
        deploy_config.generate_deploy_config(config)

    # Remove existing ABI files.
    shutil.rmtree(config.abi_dir, ignore_errors=True)
    shutil.rmtree(config.op_deployment_artifacts_dir, ignore_errors=True)

    # Copy the deploy config to where the deploy script can find it.
    shutil.copy(config.deploy_config_path, config.op_deploy_config_path)
    try:
        _deploy_contracts_on_l1(config, tmp_l1)
    finally:
        os.remove(config.op_deploy_config_path)


def _deploy_contracts_on_l1(config: Config, tmp_l1: bool):

    if tmp_l1:
        l1_rpc_protocol = "http"
        l1_rpc_host = "127.0.0.1"
        l1_rpc_port = config.temp_l1_rpc_listen_port
        l1_rpc_path = ""
        l1_rpc_url = f"http://{l1_rpc_host}:{l1_rpc_port}"
    else:
        l1_rpc_protocol = config.l1_rpc_protocol
        l1_rpc_host = config.l1_rpc_host
        l1_rpc_port = config.l1_rpc_port
        l1_rpc_path = config.l1_rpc_path
        l1_rpc_url = config.l1_rpc_url

    # wait for l1
    lib.wait_for_port(l1_rpc_host, l1_rpc_port)
    lib.wait_for_rpc_server(l1_rpc_host, l1_rpc_port, path=l1_rpc_path, protocol=l1_rpc_protocol)

    if tmp_l1:
        # The temporary allow does not fund dev addresses, instead it has "owned" accounts that
        # are randomly generated. We need to use those.
        host = f"{l1_rpc_host}:{l1_rpc_port}"  # can't have "http:// in here
        print(f"Fetch eth_accounts from {host}")
        res = lib.send_json_rpc_request(host, 2, "eth_accounts", [])
        response = json.loads(res)
        deployer_account = response["result"][0]
        private_key_arg = ""
        unlocked_arg = "--unlocked"
    else:
        deployer_account = config.contract_deployer_account
        private_key_arg = f"--private-key {config.contract_deployer_key}"
        unlocked_arg = ""

    if tmp_l1 or config.deploy_deterministic_deployment_proxy:
        lib.run("send some ether to the create2 deployer account", [
            "cast send",
            f"--from {deployer_account}",
            private_key_arg,
            f"--rpc-url {l1_rpc_url}",
            unlocked_arg,
            "--value 1ether",
            "0x3fAB184622Dc19b6109349B94811493BF2a45362"  # deployer of the proxy
        ])

        create2_deployer_deploy_tx \
            = "0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7" \
            + "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" \
            + "e03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba0" \
            + "2222222222222222222222222222222222222222222222222222222222222222" \
            + "a02222222222222222222222222222222222222222222222222222222222222222"

        lib.run("deploy the create2 deployer", [
            "cast publish",
            f"--rpc-url {l1_rpc_url}",
            create2_deployer_deploy_tx
        ])

    deploy_script = "scripts/Deploy.s.sol:Deploy"

    log_file = f"{config.logs_dir}/deploy_l1_contracts.log"
    print(f"Deploying contracts to L1 with {deployer_account}. Logging to {log_file}\n"
          f"Using deploy salt: '{config.deploy_salt}'")

    env = {**os.environ,
           "DEPLOYMENT_CONTEXT": config.deployment_name,
           "ETH_RPC_URL": l1_rpc_url,
           "DEPLOYMENT_OUTFILE": f"'{config.op_rollup_l1_contracts_addresses_path}'",
           'DEPLOY_CONFIG_PATH': f"'{config.deploy_config_path}'",
           "IMPL_SALT": f"'{config.deploy_salt}'"}

    if config.deploy_slowly:
        slow_arg = "--slow"
        print("Using slow deployment mode. You can speed this up with `deploy_slowly = false` "
              "if you are sure your RPC is reliable and can handle the load.")
    else:
        slow_arg = ""

    lib.run_roll_log(
        "deploy the L2 contracts on L1", [
            "forge script",
            "--legacy",
            "--offline",
            deploy_script,
            "--sig", "runWithStateDump",
            "--sender", deployer_account,
            private_key_arg,
            f"--gas-estimate-multiplier {config.l1_deployment_gas_multiplier} "
            f"--rpc-url {l1_rpc_url}",
            "--broadcast",
            slow_arg,
            unlocked_arg
        ],
        cwd=config.op_contracts_dir,
        env=env,
        log_file=log_file)

    shutil.copy(config.op_rollup_l1_contracts_addresses_path,
                config.addresses_path)
    # shutil.move(config.op_deployment_artifacts_dir, config.abi_dir)
    shutil.move(config.forge_l1_dump_path, config.l1_allocs_path)


####################################################################################################

def _generate_l2_genesis(config: Config):
    """
    Generate the L2 genesis file and rollup configs.
    """
    if os.path.exists(config.l2_genesis_path):
        print("L2 genesis and rollup configs already generated.")
    else:
        print("Generating L2 genesis and rollup configs.")
        try:
            fqn = 'scripts/L2Genesis.s.sol:L2Genesis'

            env = {**os.environ,
                   'CHAIN_ID': f"'{config.l2_chain_id}'",
                   'CONTRACT_ADDRESSES_PATH': f"'{config.addresses_path}'",
                   'DEPLOY_CONFIG_PATH': f"'{config.deploy_config_path}'"}

            log_file = f"{config.logs_dir}/generate_l2_allocs.log"
            lib.run_roll_log(
                "generate L2 allocs", [
                    "forge script",
                    "--legacy",
                    "--offline",
                    fqn,
                    "--sig", "runWithStateDump",
                    # "--sender", deployer_account,
                    # private_key_arg,
                    # f"--gas-estimate-multiplier {config.l1_deployment_gas_multiplier} "
                    # f"--rpc-url {l1_rpc_url}",
                    # "--broadcast",
                    # slow_arg,
                    # unlocked_arg
                ],
                cwd=config.op_contracts_dir,
                env=env,
                log_file=log_file)


            # For the previous forks, and the latest fork (default, thus empty prefix),
            # move the forge-dumps into place as .devnet allocs.
            shutil.move(config.forge_l2_dump_path, config.l2_allocs_path)
            print("Generated L2 alloc")

            lib.run(
                "generate L2 genesis and rollup configs", [
                    "go run cmd/main.go genesis l2",
                    f"--l1-rpc={config.l1_rpc_url}",
                    f"--deploy-config={config.deploy_config_path}",
                    f"--l2-allocs={config.l2_allocs_path}",
                    f"--l1-deployments={config.addresses_path}",
                    f"--outfile.l2={config.l2_genesis_path}",
                    f"--outfile.rollup={config.rollup_config_path}"
                ],
                cwd=config.op_node_dir)
        except Exception as err:
            raise lib.extend_exception(
                err, prefix="Failed to generate L2 genesis and rollup configs: ") from None


####################################################################################################
