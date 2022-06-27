function AssetType(assetClass, data) {
	return { assetClass, data }
}

function Asset(assetClass, assetData, value) {
	return { assetType: AssetType(assetClass, assetData), value };
}

function Order(maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data) {
	return { maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data };
}

module.exports = { AssetType, Asset, Order }