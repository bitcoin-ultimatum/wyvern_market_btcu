import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments
    const { owner } = await getNamedAccounts()

    await deploy('ERC721Hello', {
        from: owner,
        args: [
            "ERC721Hello",
            "HELL"
        ],
        log: true,
    })
}

module.exports = func
module.exports.tags = ["erc721hello"]
