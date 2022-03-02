import { expect } from "chai";
import { ethers, network, deployments } from "hardhat";
import { Signer } from "ethers"
import { ERC721Hello } from "../typechain"

describe("ERC721Hello", function () {

    let hello: ERC721Hello
    let owner, user: Signer
    let userAddress: string

    beforeEach(async () => {        
        [owner] = await ethers.getSigners()
        userAddress = "0x84e68686fb4555a6eb049883c34cc08f5f19f60b"

        await deployments.fixture()

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [userAddress]
        })

        user = ethers.provider.getSigner(userAddress)
        hello = await ethers.getContract("ERC721Hello", owner)
   
    })

    it("should return NFT name", async function () {
        expect(await hello.name()).to.eq("ERC721Hello")
    })

    it("should return NFT symbol", async function () {
        expect(await hello.symbol()).to.eq("HELL")
    })

    it("should ... ", async function () {})
})