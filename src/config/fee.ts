import getNetworkConfig from './network'

export default () => ({
  transfer: { "amount": [{ "amount": "5000", "denom": getNetworkConfig().denom }], "gas": "200012" },
  retainFee: 0.01,
})