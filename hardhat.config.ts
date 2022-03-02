import * as dotenv from 'dotenv'

dotenv.config()

import "@typechain/hardhat"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "hardhat-deploy"

const {
    INFURA_KEY,
    ALCHEMY_KEY,
    ETHERSCAN_API_KEY,
    MNEMONIC_TESTNET,
    MNEMONIC,
    PRIVATE_KEY,
    PRIVATE_KEY_TESTNET
} = process.env

const accountsTestnet = PRIVATE_KEY_TESTNET
    ? [PRIVATE_KEY_TESTNET]
    : { mnemonic: MNEMONIC_TESTNET }

const accountsMainnet = PRIVATE_KEY
    ? [PRIVATE_KEY]
    : { mnemonic: MNEMONIC }

module.exports = {
    defaultNetwork: "hardhat",
    solidity: {
        version: "0.8.10",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    namedAccounts: {
        owner: {
            default: 0
        },
    },
    networks: {
        hardhat: {
            forking: {
                url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
                blockNumber: Number(process.env.HARDHAT_FORKING_BLOCKNUMBER) || undefined,
                accounts: accountsTestnet
            }
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
            accounts: accountsMainnet,
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
            accounts: accountsTestnet,
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    allowUnlimitedContractSiz: true
}