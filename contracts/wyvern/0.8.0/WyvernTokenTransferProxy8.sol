pragma solidity 0.8.0;

interface ERC20 {

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

}

contract TokenTransferProxy {
    /* Authentication registry. */
    ProxyRegistry public registry;

    /**
     * Call ERC20 `transferFrom`
     *
     * @dev Authenticated contract only
     * @param token ERC20 token address
     * @param from From address
     * @param to To address
     * @param amount Transfer amount
     */
    function transferFrom(
        address token,
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        require(registry.contracts(msg.sender));
        return ERC20(token).transferFrom(from, to, amount);
    }
}

contract WyvernTokenTransferProxy is TokenTransferProxy {
    constructor(ProxyRegistry registryAddr) public {
        registry = registryAddr;
    }
}

interface TokenRecipient {}

interface ProxyRegistry {
    function proxies(address address_) external returns (OwnableDelegateProxy);
    function contracts(address address_) external returns (bool);
    function delegateProxyImplementation() external returns (address);
}


interface OwnedUpgradeabilityStorage {

    function implementation() external view returns (address);
    function proxyType() external pure returns (uint256 proxyTypeId);
}

interface AuthenticatedProxy is TokenRecipient, OwnedUpgradeabilityStorage {

    enum HowToCall {
        Call,
        DelegateCall
    }

    function proxy(
        address dest,
        HowToCall howToCall,
        bytes memory calldata_
    ) external returns (bool result);

    function proxyAssert(
        address dest,
        HowToCall howToCall,
        bytes memory calldata_
    ) external;
}

interface Proxy {}

interface OwnedUpgradeabilityProxy is Proxy, OwnedUpgradeabilityStorage {}

interface OwnableDelegateProxy is OwnedUpgradeabilityProxy {}