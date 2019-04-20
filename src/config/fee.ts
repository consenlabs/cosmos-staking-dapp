import tokenConfig from './token'

export default {
  transfer: { "amount": [{ "amount": "3000", "denom": tokenConfig.denom }], "gas": "120000" },
  retainFee: 0.01,
}