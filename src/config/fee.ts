import tokenConfig from './token'

export default {
  transfer: { "amount": [{ "amount": "2610", "denom": tokenConfig.denom }], "gas": "100000" },
  retainFee: 0.01,
}