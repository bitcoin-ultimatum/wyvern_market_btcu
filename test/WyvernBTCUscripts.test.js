const { ethers } = require("hardhat")
const { setEmitFlags, ModifierFlags } = require("typescript")

const AddressZero = ethers.constants.AddressZero
const ZeroWord = "0x0000000000000000000000000000000000000000000000000000000000000000"

const sellRepl = "0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"

const buyRepl = "0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"


describe("Wyvern Protocol Test", () => {

    it("ecode ... ", async () => {

        const abiCoder = new ethers.utils.AbiCoder
        const deployer = "0x97e0697bce91f007bdb11c6e2785c367f039c1ee"
        const sender = "1Er3sPYTPoJEzzFMVBEGi86eoS11vSLH6N"

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
            "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",

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

        const ERC20 = "0xe136362bc62c817ce59fac7d93d7f38dd4ecc7d1"

        // 2
        const erc1155encodedParametrs = abiCoder.encode(
            ['string'], 
            ["http://example.com/"]
        )

        const ERC1155 = "0x2ffbbb074098fe875bbb594c4b5fb5bbfda1ea4a"

        // 3
        const WyvernProxyRegistry = "0xdc1a99e9ca3eba95bb214e1a34456c1fa777d651"

        //4
        const wyvernTokenTransferProxyEncodedParametrs = abiCoder.encode(
            ['address'], 
            [WyvernProxyRegistry]
        )

        const WyvernTokenTransferProxy = "0x304d7a988b6969c475b77a6e0ff89534cdf69cfa"

        // 5
        const wyvernExchangeEncodedParametrs = abiCoder.encode(
            ['address', 'address', 'address', 'address'], 
            [WyvernProxyRegistry, WyvernTokenTransferProxy, ERC20, deployer]
        )

        const WyvernExchange = "0xf900daaddf90e667ce49e9db41ea762f8eda324a"

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
        const personalProxy = "0x07b16ee184e7570e62ddb2042ab431a8740d09bb"

        const setApprovalForAll = iERC1155.encodeFunctionData("setApprovalForAll", [personalProxy, true])
        
        console.log("=================================================================================================")
        console.log("setApprovalForAll")
        console.log(`./bin/btcu-cli sendtocontract ${ERC1155.slice(2)} ${setApprovalForAll.slice(2)} 0 1000000 40 ${sender}`)

        const iCallData = iERC1155.encodeFunctionData("isApprovedForAll", [deployer, personalProxy])
      
        console.log("=================================================================================================")
        console.log("isApprovedForAll")
        console.log(`./bin/btcu-cli callcontract ${ERC1155.slice(2)} ${iCallData.slice(2)}`)

        // 10
        const tokenId = 111
        const mint = iERC1155.encodeFunctionData("mint", [deployer, tokenId, 1, "hash"])
        
        console.log("=================================================================================================")
        console.log("mint")
        console.log(`./bin/btcu-cli sendtocontract ${ERC1155.slice(2)} ${mint.slice(2)} 0 1000000 40 ${sender}`)

        const balanceOf = iERC1155.encodeFunctionData("balanceOf", [deployer, tokenId])
      
        console.log("=================================================================================================")
        console.log("balanceOf")
        console.log(`./bin/btcu-cli callcontract ${ERC1155.slice(2)} ${balanceOf.slice(2)}`)
        
        // 11
        const trader = "0x2c0d80225fd528613976cbfd167aba46cb7cfe65"
        const traderSender = "151vuUTc9rk9a8Hs62pmFTPwNpsX5UDzAc"
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

        const sellOrderHash = "acd662c4b905b3c835f758edf33144c9a88c8082eeabeacaf68dab8bf27386f1"

        console.log("=================================================================================================")
        console.log("signmessage")
        console.log(`./bin/btcu-cli signmessage ${sender} ${sellOrderHash}`)

        // "signature": "H5NfyZ9s1K2Bbv0cxd1mL8j9LfwskdSuhAD2z+FUhDY6Ll/g8L+FupOdssiVdUAKl5bYcp8VqLA15Y5kDgSCQ+U=",

        const sellSig = "1f9cc6deda408901ec433e698094a423f7a32b16a190c37a91d29236fd3063896a0ae53d0a0ad0b11c7bbea7c922b6281c5f07697be6dd709b389d1e90bd0f1972"

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

        const buyOrderHash = "b392720ba51e5bcf637d4ff2f93af1575497b52c219b39c4e374506c639d72ea"

        console.log("=================================================================================================")
        console.log("signmessage")
        console.log(`./bin/btcu-cli signmessage ${traderSender} ${buyOrderHash}`)

        const buySig = "1f35600fda8c3dcf9355223fc5c794956cd09b70a0a3ad3ad2a35129b85dbbc78c74ad498d830e097e694b8ab6a25cc58e6fc5ac858b4aeacbc82a89cf47b3a5c6"

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
