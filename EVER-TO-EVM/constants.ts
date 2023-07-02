import { Address } from "locklift";

export const EthereumEverscaleEventConfigurationA: Address = new Address(
  "0:54f2bc1064cbe7d9b057808b8578e9b2f3ff54d27ef472ffbdb16b2e4461292a",
); // evm ever alien  event conf
export const EthereumEverscaleEventConfigurationN: Address = new Address(
  "0:bd71db92ddb726930c0a23aade41d5d6134056efb791605189e8489d1d29e626",
); // evm ever native  event conf
export const EverscaleEthereumEventConfigurationN = new Address(
  "0:a8698f1a9bd48201b1eafcb6975b90b60867063ffff3cc7114a480f924999b75",
); // ever evm native event conf
export const EverscaleEthereumEventConfigurationA = new Address(
  "0:6b7e3255de478ff6b5d441235e6ea6c43764f897dd761d56c2fdf7199d80cf86",
); // ever evm native alien conf
export const getAddrWidValue = new Address("0:1312c5e5d75e3442571032b5d41730f135686b21162154d49789af5aa50dc12d");
// address wid and value returner
export const EventCloser = new Address("0:6c5803db0fb7403421494ec458e5bc4763fb49cbb1b246ff2d3310e860845a78");
// EverEvm event closer
export const WEVERVault: Address = new Address("0:557957cba74ab1dc544b4081be81f1208ad73997d74ab3b72d95864a41b779a4");
// Vault contract
export const Compounder = new Address("0:8707c99c2e4a98642ba29a9d389656e804bd5b3cbe11a426ca12335792168d8a");
// Compounder
export const ProxyMultiVaultNativeV_4 = new Address(
  "0:36122a25a11e8772dc5d94f5f6a653d4661f6e474bc85cb275aece185acd62a4",
);
// proxy native v_4
export const ProxyMultivaultAlienV_7 = new Address(
  "0:85c3287c6114e420ae82ec1364da3c760a5789f383213ef3cedef5d8c3d126fd",
);
export const MergePool_V4 = new Address("0:ec31a2d0740402900a065d2fdd027ef31f0f3748a9862d113902acecc6acae18");
// merge pool
export const EVERUSDT: Address = new Address("0:a519f99bb5d6d51ef958ed24d337ad75a1c770885dcd42d51d6663f9fcdacfb2");
// ever USDT
export const TargetTokenRootAlienEvmUSDT = new Address(
  "0:5f1ae3df506d1cec64cb2a30040a930f29e662a4527c1ddc0dfc2a86ba897dc4",
);
// MergePoolUSDTEvmBsc
export const EVERWBNB: Address = new Address("0:9002c8a1cbbca3f9700b1b9438082342ede76d579e3a5a7c6f0e5d030ac5df43");
// ever WBNB
export const EVERBRIDGE: Address = new Address("0:f2679d80b682974e065e03bf42bbee285ce7c587eb153b41d761ebfd954c45e1");
// ever BRIDGE
export const EvmReceiver = "0xF1B7B971Da6715ecDF24F0c38352618a059309d7";
// sample evm receiver
export const unWrapper = "0xa5cf4c57a7756943559B6B65f6cC67Aa834F79F5";
// unWrapper for evm native token
export const transfer_fees = {
  EverToEvmAutoRelease: locklift.utils.toNano("13"),
  EverToEvmManualRelease: locklift.utils.toNano("6"),
};
