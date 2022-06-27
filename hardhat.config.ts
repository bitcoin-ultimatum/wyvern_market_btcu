import * as dotenv from 'dotenv'

dotenv.config()

import "@typechain/hardhat"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "hardhat-deploy"
import "@nomiclabs/hardhat-etherscan"

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
        compilers: [
            {
                version: "0.4.26",
                settings: {
                    optimizer: {
                      enabled: true,
                      runs: 200,
                    },
                }
            },
            {
                version: "0.5.0",
                settings: {
                    optimizer: {
                      enabled: true,
                      runs: 200,
                    },
                }
            },
            {
                version: "0.4.13",
                settings: {
                    optimizer: {
                      enabled: true,
                      runs: 200,
                    },
                }
            },
            {
                version: "0.8.14",
                settings: {
                    optimizer: {
                      enabled: true,
                      runs: 200,
                    },
                }
            },
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                      enabled: true,
                      runs: 200,
                    },
                }
            }
        ],
    },
    namedAccounts: {
        deployer: 0,
        trader1: 1,
        trader2: 2,
        trader3: 3,
        trader4: 4,
        treasury: 5,
        newOwner: 6
    },
    networks: {
        hardhat: {
            forking: {
                url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
                blockNumber: 11950089,
                accounts: accountsTestnet,
                enabled: true
            }
        },
        development: {
            url: `http://127.0.0.1:7545/`,
            accounts: accountsTestnet
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
            chainId: 1,
            accounts: accountsMainnet,
        },
        mumbai: {
            url: "https://rpc-mumbai.maticvigil.com",
            chainId: 80001,
            accounts: accountsTestnet
        },
        bsc: {
            url: "https://bsc-dataseed.binance.org/",
            chainId: 56,
            accounts: accountsMainnet
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
            accounts: accountsTestnet,
        },
        "fantom-testnet": {
            url: "https://rpc.testnet.fantom.network",
            accounts: accountsTestnet,
            chainId: 4002
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    allowUnlimitedContractSiz: true
}