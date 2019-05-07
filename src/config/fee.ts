import getNetworkConfig from './network'
import BN from 'big.js'
import msgTypes from '../lib/msgTypes'


export const gasPrice = 0.003

export const gasLimitMap = {
  [msgTypes.send]: 30000,
  [msgTypes.delegate]: 150000,
  [msgTypes.undelegate]: 150000,
  [msgTypes.withdraw]: 80000,
  [msgTypes.redelegate]: 200000
}

export const getFeeAmountByType = (type) => {
  const gasLimit = gasLimitMap[type]
  return new BN(gasPrice).times(gasLimit).toFixed()
}

export const getFeeFiledByType = (type) => {
  const gasLimit = String(gasLimitMap[type])
  const feeAmount = getFeeAmountByType(type)
  return { "amount": [{ "amount": feeAmount, "denom": getNetworkConfig().denom }], "gas": gasLimit }
}

