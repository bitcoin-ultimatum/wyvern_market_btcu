import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    
    const token = await deploy('Token', {
        from: deployer,
        log: true,
        args: [
            "Tether USD",
            "USDT",
            "100000000000000000000000000"
        ]
    })

    const nft = await deploy('ERC1155', {
        from: deployer,
        log: true,
        args: [
            "http://example.com/",
        ]
    })

    const proxyRegistry = await deploy('WyvernProxyRegistry', {
        from: deployer,
        log: true,
    })

    const transferProxy = await deploy('WyvernTokenTransferProxy', {
        from: deployer,
        log: true,
        args: [
            proxyRegistry.address,
        ]
    })

    const wyvernExchange = await deploy('WyvernExchange', {
        args: [
            proxyRegistry.address,
            transferProxy.address,
            token.address,
            deployer
        ],
        from: deployer,
        log: true
    })

    // initial access

    await deployments.execute(
        "WyvernProxyRegistry",
        {
            from: deployer,
            log: true
        },
        "grantInitialAuthentication",
        wyvernExchange.address
    )

}

module.exports = func
module.exports.tags = ["wyvern"]
