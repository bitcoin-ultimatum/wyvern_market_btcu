const { ethers } = require("hardhat")

function tokens(n) {
  return ethers.utils.parseEther(n)
}

const AddressZero = ethers.constants.AddressZero
const ZeroWord = "0x0000000000000000000000000000000000000000000000000000000000000000"

const sellRepl = "0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"

const buyRepl = "0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"

const deploy = deployments.createFixture(async ({ deployments, ethers }, options) => {
    await deployments.fixture()

    const [deployer, trader1] = await ethers.getSigners()

    const proxyRegistry = await ethers.getContract("WyvernProxyRegistryN")
    await proxyRegistry.connect(deployer).registerProxy()
    const personalProxy = await proxyRegistry.proxies(deployer.address)

    const nft = await ethers.getContract("ERC1155")
    await nft.setApprovalForAll(personalProxy, true)
    await nft.mint(deployer.address, 0, 1, "hash")

    const token = await ethers.getContract("Token")
    await token.connect(deployer).transfer(trader1.address, tokens("100000"))

    const wyvernExchange = await ethers.getContract("WyvernExchangeN")
    const transferProxy = await wyvernExchange.tokenTransferProxy()

    await token.connect(trader1).approve(transferProxy, tokens("100000"))

    return {
        token,
        proxyRegistry,
        wyvernExchange,
        nft,
        deployer,
        trader1
    }
})

describe("Wyvern Protocol Test", () => {

    it("should ...", async () => {
        const { token, wyvernExchange, nft, deployer, trader1 } = await deploy()

        const tokenId = "0"
        const amount = "1"
        const data = "0x"

        const safeTransfer = ["function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)"]
        const c = new ethers.utils.Interface(safeTransfer)

        const sellFrom = deployer.address
        const sellTo = AddressZero
        const sellCalldata = c.encodeFunctionData("safeTransferFrom", [ sellFrom, sellTo, tokenId, amount, data ])

        const buyFrom = AddressZero
        const buyTo = trader1.address
        const buyCalldata = c.encodeFunctionData("safeTransferFrom", [ buyFrom, buyTo, tokenId, amount, data ])

        const sellOrderParams = {
            addrs: [
                wyvernExchange.address, // exchange address
                deployer.address, // maker
                AddressZero, // taker
                deployer.address, // feeRecipient
                nft.address, // target (721 or 1155 address)
                AddressZero, // always 0x
                token.address // erc20 token address
            ],
            uints: ["0", "0", "0", "0", "100000000000", "0", "1621439539", "0", "1"],
            feeMethod: 1,
            side: 1,
            saleKind: 0,
            howToCall: 0,
            calldata: sellCalldata, 
            replacementPattern: sellRepl, 
            staticExtradata: "0x",
        }

        const sellHash = await wyvernExchange.hashOrder_(sellOrderParams.addrs, sellOrderParams.uints, sellOrderParams.feeMethod, sellOrderParams.side, sellOrderParams.saleKind, sellOrderParams.howToCall, sellOrderParams.calldata, sellOrderParams.replacementPattern, sellOrderParams.staticExtradata) 

        const sellSignature = await deployer.signMessage(ethers.utils.arrayify(sellHash))
        const sellRes = sellSignature.substring(2)
		const sellR  =  "0x"  + sellRes.substring(0, 64)
		const sellS  =  "0x"  + sellRes.substring(64, 128)
		const sellV  =  parseInt(sellRes.substring(128, 130), 16)

        const buyOrderParams = {
            addrs: [
                wyvernExchange.address, // exchange address
                trader1.address, // maker
                AddressZero, // taker
                AddressZero, // feeRecipient
                nft.address, // target (721 or 1155 address)
                AddressZero, // always 0x
                token.address // erc20 token address
            ],
            uints: ["0", "0", "0",  "0", "100000000000", "0", "1621439539", "0", "1"],
            feeMethod: 1,
            side: 0,
            saleKind: 0,
            howToCall: 0,
            calldata: buyCalldata, 
            replacementPattern: buyRepl, 
            staticExtradata: "0x",
        }

        const buyHash = await wyvernExchange.hashOrder_(buyOrderParams.addrs, buyOrderParams.uints, buyOrderParams.feeMethod, buyOrderParams.side, buyOrderParams.saleKind, buyOrderParams.howToCall, buyOrderParams.calldata, buyOrderParams.replacementPattern, buyOrderParams.staticExtradata) 

        const buySignature = await trader1.signMessage(ethers.utils.arrayify(buyHash))
        const buyRes = buySignature.substring(2)
		const buyR  =  "0x"  + buyRes.substring(0, 64)
		const buyS  =  "0x"  + buyRes.substring(64, 128)
		const buyV  =  parseInt(buyRes.substring(128, 130), 16)
        
        await wyvernExchange.connect(trader1).atomicMatch_(
            [...buyOrderParams.addrs, ...sellOrderParams.addrs],
            [...buyOrderParams.uints, ...sellOrderParams.uints],
            [
                buyOrderParams.feeMethod, buyOrderParams.side, buyOrderParams.saleKind, buyOrderParams.howToCall,
                sellOrderParams.feeMethod, sellOrderParams.side, sellOrderParams.saleKind, sellOrderParams.howToCall
            ],
            buyOrderParams.calldata,
            sellOrderParams.calldata,
            buyOrderParams.replacementPattern,
            sellOrderParams.replacementPattern,
            buyOrderParams.staticExtradata,
            sellOrderParams.staticExtradata,
            [buyV, sellV],
            [buyR, buyS, sellR, sellS, ZeroWord]
        )

    })
})
