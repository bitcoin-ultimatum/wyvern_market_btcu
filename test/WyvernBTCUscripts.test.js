const { ethers } = require("hardhat")

const AddressZero = ethers.constants.AddressZero
const ZeroWord = "0x0000000000000000000000000000000000000000000000000000000000000000"

const sellRepl = "0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"

const buyRepl = "0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"


describe("Wyvern Protocol Test", () => {

    it("ecode ... ", async () => {

        const abiCoder = new ethers.utils.AbiCoder
        const deployer = "0xadbfd2f0b8892eac63b2fd1dc72b1139c41dcc29"
        const sender = "1GqhhMMEJqfr2uuYocW7TnU5KTMYp6mz3r"

        // interfaces
        const fWyvernProxyRegistry = [
            "function grantInitialAuthentication(address authAddress)",
            "function registerProxy()",
            "function proxies(address)"
        ]

        const iWyvernProxyRegistry = new ethers.utils.Interface(fWyvernProxyRegistry)

        const fERC1155 = [
            "function setApprovalForAll(address operator, bool approved)",
            "function isApprovedForAll(address account, address operator)",
            "function mint(address account, uint256 id, uint256 amount, string memory ipfsHash)",
            "function balanceOf(address account, uint256 id)",
            "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)"
        ]

        const iERC1155 = new ethers.utils.Interface(fERC1155)

        const fERC20 = [
            "function transfer(address recipient, uint256 amount)",
            "function approve(address spender, uint256 amount)",
            "function balanceOf(address account)",
            "function allowance(address owner, address spender)"
        ]

        const iERC20 = new ethers.utils.Interface(fERC20)

        const fExchange = [
            "function hashToSign_(address[7] addrs, uint256[9] uints, uint8 feeMethod, uint8 side, uint8 saleKind, uint8 howToCall,bytes calldata, bytes replacementPattern, bytes staticExtradata)",
            "function atomicMatch_(address[14] addrs, uint256[18] uints, uint8[8] feeMethodsSidesKindsHowToCalls, bytes calldataBuy, bytes calldataSell, bytes replacementPatternBuy, bytes replacementPatternSell, bytes staticExtradataBuy, bytes staticExtradataSell, uint8[2] vs, bytes32[5] rssMetadata)"
        ]

        const iExchange = new ethers.utils.Interface(fExchange)

        // 1
        const erc20encodedParametrs = abiCoder.encode(
            ['string', 'string', 'uint256'], [ "Tether USD", "USDT", "100000000000000000000000000" ]
        )

        const ERC20 = "0xb40e1b1819dbba41b8d2c2939db00ff1552e5842"

        // 2
        const erc1155encodedParametrs = abiCoder.encode(
            ['string'], 
            ["http://example.com/"]
        )

        const ERC1155 = "0x538a7581373c38445265c07428d53597ba22231d"

        // 3
        const WyvernProxyRegistry = "0x7aaa5dba689af262aecbed0b8e07798320759f8a"

        //4
        const wyvernTokenTransferProxyEncodedParametrs = abiCoder.encode(
            ['address'], 
            [WyvernProxyRegistry]
        )

        const WyvernTokenTransferProxy = "0x65cf9f3b2c32f5e20e24e90da98961dc1c2fd352"

        // 5
        const wyvernExchangeEncodedParametrs = abiCoder.encode(
            ['address', 'address', 'address', 'address'], 
            [WyvernProxyRegistry, WyvernTokenTransferProxy, ERC20, deployer]
        )

        const WyvernExchange = "0xa49ea85e6a6880533318a8a112e7283ee186de9c"

        console.log("erc20encodedParametrs:: " + erc20encodedParametrs)
        console.log("erc1155encodedParametrs:: " + erc1155encodedParametrs)
        console.log("wyvernTokenTransferProxyEncodedParametrs:: " + wyvernTokenTransferProxyEncodedParametrs)
        console.log("wyvernExchangeEncodedParametrs:: " + wyvernExchangeEncodedParametrs)

        // 6
        const grantInitialAuthentication = iWyvernProxyRegistry.encodeFunctionData("grantInitialAuthentication", [WyvernExchange])
        
        console.log("=================================================================================================")
        console.log("grantInitialAuthentication")
        console.log(`./bin/btcu-cli sendtocontract ${WyvernProxyRegistry.slice(2)} ${grantInitialAuthentication.slice(2)} 0 1000000 40 ${sender}`)
        
        // 7 
        const registerProxy = iWyvernProxyRegistry.encodeFunctionData("registerProxy", [])
        
        console.log("=================================================================================================")
        console.log("registerProxy")
        console.log(`./bin/btcu-cli sendtocontract ${WyvernProxyRegistry.slice(2)} ${registerProxy.slice(2)} 0 1000000 40 ${sender}`)
        
        // 8
        const proxies = iWyvernProxyRegistry.encodeFunctionData("proxies", [deployer])
      
        console.log("=================================================================================================")
        console.log("proxies")
        console.log(`./bin/btcu-cli callcontract ${WyvernProxyRegistry.slice(2)} ${proxies.slice(2)}`)
        
        // 9
        const personalProxy = "0x1de8467574ec11f9b15177725e201c95819e0fbd"

        const setApprovalForAll = iERC1155.encodeFunctionData("setApprovalForAll", [personalProxy, true])
        
        console.log("=================================================================================================")
        console.log("setApprovalForAll")
        console.log(`./bin/btcu-cli sendtocontract ${ERC1155.slice(2)} ${setApprovalForAll.slice(2)} 0 1000000 40 ${sender}`)

        const iCallData = iERC1155.encodeFunctionData("isApprovedForAll", [deployer, personalProxy])
      
        console.log("=================================================================================================")
        console.log("isApprovedForAll")
        console.log(`./bin/btcu-cli callcontract ${ERC1155.slice(2)} ${iCallData.slice(2)}`)

        // 10
        const tokenId = 0
        const mint = iERC1155.encodeFunctionData("mint", [deployer, 0, 1, "hash"])
        
        console.log("=================================================================================================")
        console.log("mint")
        console.log(`./bin/btcu-cli sendtocontract ${ERC1155.slice(2)} ${mint.slice(2)} 0 1000000 40 ${sender}`)

        const balanceOf = iERC1155.encodeFunctionData("balanceOf", [deployer, 0])
      
        console.log("=================================================================================================")
        console.log("balanceOf")
        console.log(`./bin/btcu-cli callcontract ${ERC1155.slice(2)} ${balanceOf.slice(2)}`)
        
        // 11
        const trader = "0x18ea672c1b94e3beb34ae1adb5277c78f24063ea"
        const traderSender = "13Gk2DF1Dq82a6ipYuHtYXy5hdh24CXAJg"
        const transfer = iERC20.encodeFunctionData("transfer", [trader, "1000000000000000000000"])
        
        console.log("=================================================================================================")
        console.log("transfer")
        console.log(`./bin/btcu-cli sendtocontract ${ERC20.slice(2)} ${transfer.slice(2)} 0 1000000 40 ${sender}`)

        const erc20balanceOf = iERC20.encodeFunctionData("balanceOf", [trader])

        console.log("=================================================================================================")
        console.log("erc20balanceOf")
        console.log(`./bin/btcu-cli callcontract ${ERC20.slice(2)} ${erc20balanceOf.slice(2)}`)

        // 12
        const approve = iERC20.encodeFunctionData("approve", [WyvernTokenTransferProxy, "1000000000000000000000"])

        console.log("=================================================================================================")
        console.log("approve")
        console.log(`./bin/btcu-cli sendtocontract ${ERC20.slice(2)} ${approve.slice(2)} 0 1000000 40 ${traderSender}`)

        const allowance = iERC20.encodeFunctionData("allowance", [trader, WyvernTokenTransferProxy])

        console.log("=================================================================================================")
        console.log("allowance")
        console.log(`./bin/btcu-cli callcontract ${ERC20.slice(2)} ${allowance.slice(2)}`)

        // 13 prepare sell hash and signature

        const sellFrom = deployer
        const sellTo = AddressZero
        const amount = "1"
        const data = "0x"
        
        const sellCalldata = iERC1155.encodeFunctionData("safeTransferFrom",  [sellFrom, sellTo, tokenId, amount, data])

        const hashToSign_sell = iExchange.encodeFunctionData("hashToSign_", [
            [WyvernExchange, deployer, AddressZero, deployer, ERC1155, AddressZero, ERC20],
            ["0", "0", "0", "0", "100000000000", "0", "1621439539", "0", "1"], 
            "1", 
            "1", 
            "0", 
            "0", 
            sellCalldata, 
            sellRepl, 
            "0x"
        ])

        console.log("=================================================================================================")
        console.log("hashToSign_ sell")
        console.log(`./bin/btcu-cli callcontract ${WyvernExchange.slice(2)} ${hashToSign_sell.slice(2)}`)

        const sellOrderHash = "225800306c7713a040005063f3dc9b4c857804369b8bc5bd9605f93f0a28fa8c"

        console.log("=================================================================================================")
        console.log("signmessage")
        console.log(`./bin/btcu-cli signmessage ${sender} ${sellOrderHash}`)

        // "signature": "H3IipWMTA/5PmQY+yBj9DYuSqvnp0SAcgW/SRK8uVXCEF/M5tIxpNWz+yNdRYKvhZ+59PAM61DfaDFV/UUjssjM=",

        const sellSig = "1f34386c5aac06d35691450021ba7447cbe84a7abb21018d3af6e86700f9377c2001ef3fc08e2ccddaec9ac02484fe395ab5ec7abb02521486138e5a0ca8ddf5e2"

        const sellR  =  "0x"  + sellSig.substring(2, 66)
        const sellS  =  "0x"  + sellSig.substring(66, 130)
        const sellV  =  parseInt(sellSig.substring(0, 2), 16)

        // 14 prepare buy hash and signature

        const buyFrom = AddressZero
        const buyTo = trader
        const buyCalldata = iERC1155.encodeFunctionData("safeTransferFrom",  [buyFrom, buyTo, tokenId, amount, data])

        const hashToSign_buy = iExchange.encodeFunctionData("hashToSign_", [
            [WyvernExchange, trader, AddressZero, AddressZero, ERC1155, AddressZero, ERC20],
            ["0", "0", "0", "0", "100000000000", "0", "1621439539", "0", "1"], 
            "1", 
            "0", 
            "0", 
            "0", 
            buyCalldata, 
            buyRepl, 
            "0x"
        ])

        console.log("=================================================================================================")
        console.log("hashToSign_ buy")
        console.log(`./bin/btcu-cli callcontract ${WyvernExchange.slice(2)} ${hashToSign_buy.slice(2)}`)

        const buyOrderHash = "2b900b61d1fe85023524717586a9fd0bafed2601340866551501cf0fbf2e5fd0"

        console.log("=================================================================================================")
        console.log("signmessage")
        console.log(`./bin/btcu-cli signmessage ${traderSender} ${buyOrderHash}`)

        // "signature": "H9acb58lQIBLeouMKAcjrfr5d9YM8DP1lYA/r2ZzFL5gD8haf/GMu2Cdyi/Y0pgqRGAbpkIkQQ4Y6vaqL90r8ao=",
        
        const buySig = "1f83d0b010e9cae0edb295f13d2bc950bcdac432c84250c9b1c48e5784ec0c52bb6ee8a45a8c08c62216eb6d2ac1f6ec3eb290bb3482896725966f80505f28f903"

        const buyR  =  "0x"  + buySig.substring(2, 66)
        const buyS  =  "0x"  + buySig.substring(66, 130)
        const buyV  =  parseInt(buySig.substring(0, 2), 16)

        // 15 atomic match

        const atomicMatch_ = iExchange.encodeFunctionData("atomicMatch_", [
            [
                WyvernExchange, trader, AddressZero, AddressZero, ERC1155, AddressZero, ERC20, // buy params
                WyvernExchange, deployer, AddressZero, deployer, ERC1155, AddressZero, ERC20 // sell params
            ],
            [
                "0", "0", "0", "0", "100000000000", "0", "1621439539", "0", "1",
                "0", "0", "0", "0", "100000000000", "0", "1621439539", "0", "1"
            ],
            [
                "1", "0", "0", "0",
                "1", "1", "0", "0"
            ],
            buyCalldata,
            sellCalldata,
            buyRepl,
            sellRepl,
            "0x",
            "0x",
            [buyV, sellV],
            [buyR, buyS, sellR, sellS, ZeroWord]
        ])

        console.log("=================================================================================================")
        console.log("atomicMatch_")
        console.log(`./bin/btcu-cli sendtocontract ${WyvernExchange.slice(2)} ${atomicMatch_.slice(2)} 0 10000000 40 ${sender}`)
        
    })
})
