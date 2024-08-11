# flux

An L3 blockchain on Base Mainnet built using OP Stack and op-reth for the consensus layer while allowing creators to make merit-based contributions while helping project owners. 

for testing purposes http://localhost:3000 redirects to https://7054-188-132-191-175.ngrok-free.app
https://1510-188-132-191-175.ngrok-free.app -> http://localhost:3001

[Snapshot commit]
There'll be 2,409,000 Flux tokens minted for the network which represents 1k tokens for each for each Ethglobal Hacker Pack NFT holders. They'll be eligible to claim their tokens by connecting their wallet to the network.
There'll be new deployments when new devs mint their Hacker Pack. and we'll update here for the new token mintings.
[Snapshot commit]

https://flux-network-75zy529pcm-06705d4a6c4239e0.testnets.rollbridge.app/
https://fluxerpc.d3patch.com/
https://fluxplorer.d3patch.com/

## Project Description

A dynamic platform connecting developers and entrepreneurs! Verify World ID, link GitHub, earn NFTs, and unlock prizes. Entrepreneurs can deploy ERC-721 drops, invite teams, and approve contributions. Join, attest, and earn merit.

Core components:
1. World ID integration for user verification
2. "Builder Passport" NFT as transaction prerequisite
3. EAS contracts for attestation management
4. Users' contribution tracking, first on GitHub repositories but expandable to other platforms through EAS schema registry
5. On-chain merit system on the web app

Participants:
1. Developers: Contribute to projects, earn verifiable merits
2. Entrepreneurs: Launch projects, approve contributions

Key features:
- Transparent, on-chain reputation building
- Extensible framework for diverse contribution types
- Project-specific EAS schemas


## Steps to complete the project:
✅

1. Deploy the Flux Network on the OP Stack chain through Conduit ✅
2. Build a web app to mint the nft after connecting the World ID and GitHub account. ✅ 
- Complete the connections below to become eligible ✅
  - Wallet Connect with Thirdweb Connect SDK ✅
  - World id integration ✅
  - GitHub's integration ✅
3. Deploy the drop ERC-721 contract on the Network** for people who'd want to join the network ✅
4. Member mint the NFT through the web app
5. Member has the capability to publish a project within the network by providing an NFT drop
6. Member receives an **Entrepreneur badge** attestation published by the protocols' Thirdweb backend wallet 
7. Member can contribute to other projects within the network through GitHub PRs 
8. Member can get an invitation through the Project Members content 
9. Backend wallet creates an Ethereum Attestation for the project schema on the Flux network 
10. Entrepreneur approves the contribution and the contributor receives a **Merit** published by the protocols' Thirdweb backend wallet

EAS preparation steps will be like this:
1. EAS schema registry transactions will be added to the Rollup chain for the added 3rd party -> (in our case it'll be github)
2. When any builder manually suggested something through the project and if the Project Owners will approve it's validity
3. There'll be merits on-chain which'll show you've been impactful
4. Based on the merits projects can do whatever they want.

and there'll be a general contribution object to enhance the capabilities of OP Stack chain which is adding more  EAS schema registries to the flux rollup. Which means to be

1. Register a schema for the 3rd party
2. Write the integration to how to measure the contribution backend logic (i.e. Discord integration and messages)
3. Your schema gets used by 100 times
4. Based on your schema and integration usage; you'll be receiving merits

Aim: Cultivate a Superchain ecosystem where value is measured by verified contributions and impactful projects.

## Applied prizes:

- Conduit 
- 🚀 Best use of Conduit ⸺ $5,000
  - We'll have the Entrepreneurs deploy the Flux Network on the OP Stack chain through Conduit.

- Thirdweb
  - 📲 Build the next big consumer crypto app ⸺ $2,500
    - We'll have the Entrepreneurs deploy Thirdweb Membership contracts for contributor to join projects

- Blockscout 
  - ⭐️ Use Blockscout Block Explorer! ⸺ $5,000

- Worldcoin
  - 🏊 Pool Prize ⸺ $2,000
  - 🆔 Best Use of World ID ⸺ $10,000

- Base Network
  - 🖼️ Best apps built for creators on Base ⸺ $5,000
    - We'll connect developers to develop solutions on Base project and earn Flux network merits for their contributions. 

- Ethereum Attestation Service
  - 🌎 Best Real World Use Cases for Attestations ⸺ $6,000
    - We'll connect entrepreneurs with developers to build a platform that connects developers and entrepreneurs.
  - ⚡ Best Attestation Developer Tool ⸺ $4,000
    - We'll have the schema registry for the Flux network and the Thirdweb backend wallet to attest the project schema on the Flux network.

### Depreciated prizes:

- Optimism
  - 🍴 Fork it! ⸺ $8,000
    - We'll have a Nftgated and Sybil resistant platform by connecting the World ID and GitHub account to the Flux network.
  - 🤘 Superchain Maxis ⸺ $2,500
    - We'll have the Entrepreneurs deploy ERC-721 drops to be living over Base and Flux network.

Plan was to ForkOP Stack  and manipulate the eth_sendRawTransaction endpoint of op-geth to check NFT requirements
- ref: https://github.com/ethereum-optimism/op-geth/blob/8af19cf20261c0b62f98cc27da3a268f542822ee/eth/api_backend.go#L295-L320
- currently following the https://github.com/celestiaorg/op-plasma-celestia/tree/main instructions to deploy the testnet L2 rollup chain
  - ./rollop --clean --name=flux-devnet --preset=dev --config=config.toml devnet