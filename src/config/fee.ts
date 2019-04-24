import getNetworkConfig from './network'

export const feeAmount = "5000"

export default () => ({
  transfer: { "amount": [{ "amount": feeAmount, "denom": getNetworkConfig().denom }], "gas": "200012" },
  retainFee: 0.01,
})