const { ethers } = require('ethers');

function generateEthereumAccount() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

const roles = [
    "contract_deployer",
    "batcher",
    "proposer",
    "admin",
    "p2p_sequencer"
];

const generatedKeys = {};

roles.forEach(role => {
    generatedKeys[role] = generateEthereumAccount();
});

const config = `
l2_chain_id = 1201101712

## Devnet

# (same as defaults)
l1_chain_id = 1201101711
l1_rpc_url = "http://127.0.0.1:8545"

## For Goerli

#l1_chain_id = 5

#l1_rpc_url = "https://ethereum-goerli.publicnode.com"
#l1_beacon_url = "https://ethereum-sepolia-beacon-api.publicnode.com"

## Keys

${roles.map(role => `
${role}_account = "${generatedKeys[role].address}"
${role}_key = "${generatedKeys[role].privateKey}"
`).join('\n')}
`;

console.log(config);