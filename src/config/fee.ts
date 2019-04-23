import tokenConfig from './token'

export default {
  transfer: { "amount": [{ "amount": "5000", "denom": tokenConfig.denom }], "gas": "200000" },
  retainFee: 0.01,
}