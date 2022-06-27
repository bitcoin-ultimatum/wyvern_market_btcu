const { ethers } = require("hardhat")
const { generateTokenId } = require('./utils')
const { Order, Asset } = require("./order")

const AddressZero = ethers.constants.AddressZero
const ZeroWord = "0x0000000000000000000000000000000000000000000000000000000000000000"

const ERC20Type = "0x8ae85d84"
const ERC1155Type = "0x973bb640"
const ETHType = "0xaaaebeba"

const abiCoder = new ethers.utils.AbiCoder

function enc(token, tokenId) {
	if (tokenId) {
		return abiCoder.encode(["address", "uint256"], [token, tokenId])
	} else {
		return abiCoder.encode(["address"], [token])
	}
}

describe("Rarible Protocol Test", () => {

    it("ecode ... ", async () => {

        const deployer = "0x97e0697bce91f007bdb11c6e2785c367f039c1ee"
        const sender = "1Er3sPYTPoJEzzFMVBEGi86eoS11vSLH6N"
        
        const ERC20 = "0xe136362bc62c817ce59fac7d93d7f38dd4ecc7d1"
        const ERC1155Rarible = "0x77db2a2898370ca0e44714eedd4c53eb15129af1"
        const TransferProxy = "0xa4edde5d5c3024e4aff7740ee7542cac9e197036"
        const ERC20TransferProxy = "0x4df3c4f986331ce6630a58b651bb24b93acce574"
        const RoyaltiesRegistry = "0xf6c393e3d13831f04579948e3d1342be4424b2ed"  
        const ExchangeV2 = "0xbc156dfa35e5384b8fcacd24c619c161aabf340b"

        // interfaces

        const fTransferProxy = [
            "function __TransferProxy_init()",
            "function addOperator(address operator)",
            "function owner()"
        ]

        const iTransferProxy = new ethers.utils.Interface(fTransferProxy)

        const fERC20TransferProxy = [
            "function __ERC20TransferProxy_init()",
            "function addOperator(address operator)",
            "function owner()"
        ]

        const iERC20TransferProxy = new ethers.utils.Interface(fERC20TransferProxy)

        const fERC1155Rarible = [
            "function setApprovalForAll(address operator, bool approved)",
            "function setDefaultApproval(address operator, bool hasApproval)",
            "function isApprovedForAll(address account, address operator)",
            "function balanceOf(address account, uint256 id)",
            "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
            "function __ERC1155Rarible_init(string memory _name, string memory _symbol, string memory baseURI, string memory contractURI)",
            "function name()",
            "function symbol()",
            "function mintAndTransfer(tuple(uint tokenId, string uri, uint supply, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures) data, address to, uint256 _amount)",
            "function uri(uint256 id)",

        ]
        
        const iERC1155Rarible = new ethers.utils.Interface(fERC1155Rarible)

        const fERC20 = [
            "function transfer(address recipient, uint256 amount)",
            "function approve(address spender, uint256 amount)",
            "function balanceOf(address account)",
            "function allowance(address owner, address spender)"
        ]

        const iERC20 = new ethers.utils.Interface(fERC20)

        const fExchangeV2 = [
            "function __ExchangeV2_init(address _transferProxy, address _erc20TransferProxy, uint newBuyerFee, uint newSellerFee, address newCommunityWallet, address newRoyaltiesProvider)",
            "function royaltiesRegistry()",
            "function orderHashToSign(tuple(address maker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint value) makeAsset, address taker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint value) takeAsset, uint salt, uint start, uint end, bytes4 dataType, bytes data) order)",
            "function matchOrders(tuple(address maker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint value) makeAsset, address taker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint value) takeAsset, uint salt, uint start, uint end, bytes4 dataType, bytes data) orderLeft, tuple(address maker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint value) makeAsset, address taker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint value) takeAsset, uint salt, uint start, uint end, bytes4 dataType, bytes data) orderRight, uint8[2] vs, bytes32[4] rssMetadata)"
        ]

        const iExchangeV2 = new ethers.utils.Interface(fExchangeV2)

        // 1

        const __TransferProxy_init = iTransferProxy.encodeFunctionData("__TransferProxy_init", [])
        const owner = iTransferProxy.encodeFunctionData("owner", [])

        console.log("=================================================================================================")
        console.log("__TransferProxy_init")
        console.log(`./bin/btcu-cli sendtocontract ${TransferProxy.slice(2)} ${__TransferProxy_init.slice(2)} 0 1000000 40 ${sender}`)
        console.log("owner")
        console.log(`./bin/btcu-cli callcontract ${TransferProxy.slice(2)} ${owner.slice(2)}`)

        // 2

        const __ERC20TransferProxy_init = iERC20TransferProxy.encodeFunctionData("__ERC20TransferProxy_init", [])
        
        console.log("=================================================================================================")
        console.log("__ERC20TransferProxy_init")
        console.log(`./bin/btcu-cli sendtocontract ${ERC20TransferProxy.slice(2)} ${__ERC20TransferProxy_init.slice(2)} 0 1000000 40 ${sender}`)
        console.log("owner")
        console.log(`./bin/btcu-cli callcontract ${ERC20TransferProxy.slice(2)} ${owner.slice(2)}`)

        // 3

        const __ExchangeV2_init = iExchangeV2.encodeFunctionData(
            "__ExchangeV2_init", 
            [TransferProxy, ERC20TransferProxy, 0, 0, deployer, RoyaltiesRegistry]
        )

        const royaltiesRegistry = iExchangeV2.encodeFunctionData("royaltiesRegistry", [])

        console.log("=================================================================================================")
        console.log("__ExchangeV2_init")
        console.log(`./bin/btcu-cli sendtocontract ${ExchangeV2.slice(2)} ${__ExchangeV2_init.slice(2)} 0 1000000 40 ${sender}`)
        console.log("royaltiesRegistry")
        console.log(`./bin/btcu-cli callcontract ${ExchangeV2.slice(2)} ${royaltiesRegistry.slice(2)}`)


        // 4 

        const addOperator = iTransferProxy.encodeFunctionData("addOperator", [ExchangeV2])
        console.log("=================================================================================================")
        console.log("addOperators:: ")

        console.log(`./bin/btcu-cli sendtocontract ${TransferProxy.slice(2)} ${addOperator.slice(2)} 0 1000000 40 ${sender}`)
        console.log(`./bin/btcu-cli sendtocontract ${ERC20TransferProxy.slice(2)} ${addOperator.slice(2)} 0 1000000 40 ${sender}`)

        // 5 

        const __ERC1155Rarible_init = iERC1155Rarible.encodeFunctionData("__ERC1155Rarible_init", ["Name", "Symbol", "uri", "curi"])
        const name = iERC1155Rarible.encodeFunctionData("name", [])
        const symbol = iERC1155Rarible.encodeFunctionData("symbol", [])
        
        console.log("=================================================================================================")
        console.log("__ERC1155Rarible_init")
        console.log(`./bin/btcu-cli sendtocontract ${ERC1155Rarible.slice(2)} ${__ERC1155Rarible_init.slice(2)} 0 1000000 40 ${sender}`)

        console.log(`./bin/btcu-cli callcontract ${ERC1155Rarible.slice(2)} ${name.slice(2)}`)
        console.log(`./bin/btcu-cli callcontract ${ERC1155Rarible.slice(2)} ${symbol.slice(2)}`)

        // 6 

        const setDefaultApproval = iERC1155Rarible.encodeFunctionData("setDefaultApproval", [TransferProxy, true])
        console.log("=================================================================================================")
        console.log("setDefaultApproval")
        console.log(`./bin/btcu-cli sendtocontract ${ERC1155Rarible.slice(2)} ${setDefaultApproval.slice(2)} 0 1000000 40 ${sender}`)

        const isApprovedForAll = iERC1155Rarible.encodeFunctionData("isApprovedForAll", [deployer, TransferProxy])
      
        console.log("=================================================================================================")
        console.log("isApprovedForAll")
        console.log(`./bin/btcu-cli callcontract ${ERC1155Rarible.slice(2)} ${isApprovedForAll.slice(2)}`)

        // 7

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

        // 8

        const approve = iERC20.encodeFunctionData("approve", [ERC20TransferProxy, "1000000000000000000000"])

        console.log("=================================================================================================")
        console.log("approve")
        console.log(`./bin/btcu-cli sendtocontract ${ERC20.slice(2)} ${approve.slice(2)} 0 1000000 40 ${traderSender}`)

        const allowance = iERC20.encodeFunctionData("allowance", [trader, ERC20TransferProxy])

        console.log("=================================================================================================")
        console.log("allowance")
        console.log(`./bin/btcu-cli callcontract ${ERC20.slice(2)} ${allowance.slice(2)}`)

        // 9

        let tokenGeneralId = 1
		const tokenId = generateTokenId(deployer, tokenGeneralId)

        const mintData =  {
            tokenId: tokenId,
            uri: "uri",
            supply: 1,
            creators: [{
                account: deployer,
                value: 10000
            }],
            royalties: [],
            signatures: [ZeroWord]
        }

        const mintAndTransfer = iERC1155Rarible.encodeFunctionData("mintAndTransfer", [mintData, deployer, mintData.supply])

        console.log("=================================================================================================")
        console.log("mintAndTransfer")
        console.log(`./bin/btcu-cli sendtocontract ${ERC1155Rarible.slice(2)} ${mintAndTransfer.slice(2)} 0 1000000 40 ${sender}`)

        const balanceOf = iERC1155Rarible.encodeFunctionData("balanceOf", [deployer, mintData.tokenId])
        const balanceOfTrader = iERC1155Rarible.encodeFunctionData("balanceOf", [trader, mintData.tokenId])
        const uri = iERC1155Rarible.encodeFunctionData("uri", [mintData.tokenId])
      
        console.log("=================================================================================================")
        console.log("balanceOf")
        console.log(`./bin/btcu-cli callcontract ${ERC1155Rarible.slice(2)} ${balanceOf.slice(2)}`)
        console.log("balanceOfTrader")
        console.log(`./bin/btcu-cli callcontract ${ERC1155Rarible.slice(2)} ${balanceOfTrader.slice(2)}`)

        console.log("=================================================================================================")
        console.log("uri")
        console.log(`./bin/btcu-cli callcontract ${ERC1155Rarible.slice(2)} ${uri.slice(2)}`)

        // 10

        const left = Order(deployer, Asset(ERC1155Type, enc(ERC1155Rarible, tokenId), 1), AddressZero, Asset(ERC20Type, enc(ERC20), 100), 1, 0, 0, "0xffffffff", "0x")
        
        const right = Order(trader, Asset(ERC20Type, enc(ERC20), 100), AddressZero, Asset(ERC1155Type, enc(ERC1155Rarible, tokenId), 1), 1, 0, 0, "0xffffffff", "0x")

        const leftOrderHashToSign = iExchangeV2.encodeFunctionData("orderHashToSign", [left])
        const rightOrderHashToSign = iExchangeV2.encodeFunctionData("orderHashToSign", [right])

        console.log("=================================================================================================")
        console.log("leftOrderHashToSign")
        console.log(`./bin/btcu-cli callcontract ${ExchangeV2.slice(2)} ${leftOrderHashToSign.slice(2)}`)
        console.log("rightOrderHashToSign")
        console.log(`./bin/btcu-cli callcontract ${ExchangeV2.slice(2)} ${rightOrderHashToSign.slice(2)}`)

        const leftOrderHash = "f8320afb45e76b57ae0d9345ce8a9a1c7ad922b8550d0d3b0dfc47fa607c4d45"
        const rightOrderHash = "2d1665cc7df1c2828a15ed9c1721522b4370377c5f9c05b5aa0dfe424b539277"

        console.log("=================================================================================================")
        console.log("signmessage left")
        console.log(`./bin/btcu-cli signmessage ${sender} ${leftOrderHash}`)

        console.log("signmessage right")
        console.log(`./bin/btcu-cli signmessage ${traderSender} ${rightOrderHash}`)

        const leftSig = "200cad26797340d2916cc737a4c312e15d3d115443716e215fe347579b8ed66ad141b10c40871e8d9816cf219b9aa33d2004b5f4940a5b8ce179254080e72a6a1b"

        const leftR  =  "0x"  + leftSig.substring(2, 66)
        const leftS  =  "0x"  + leftSig.substring(66, 130)
        const leftV  =  parseInt(leftSig.substring(0, 2), 16)

        const rightSig = "2023c85acb9720594af1b487df33333501d89ccda0821e59ebb95b5215008f315e308df49e43383ed0596a66ca8f6d95a61d465ef46cd0a69714cca43e4c0e2d4b"

        const rightR  =  "0x"  + rightSig.substring(2, 66)
        const rightS  =  "0x"  + rightSig.substring(66, 130)
        const rightV  =  parseInt(rightSig.substring(0, 2), 16)

        const matchOrders = iExchangeV2.encodeFunctionData("matchOrders", [
            left, 
            right, 
            [leftV, rightV],
            [leftR, leftS, rightR, rightS]
        ])

        console.log("=================================================================================================")
        console.log("matchOrders")
        console.log(`./bin/btcu-cli sendtocontract ${ExchangeV2.slice(2)} ${matchOrders.slice(2)} 0 1000000 40 ${sender}`)

    })
})
