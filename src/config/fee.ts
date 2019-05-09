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

export const getFeeParamsByMsgs = (msgs) => {
  let feeBN = new BN(0)
  let gasLimit = 0
  msgs.forEach(msg => {
    const _gasLimit = gasLimitMap[msg.type]
    feeBN = feeBN.plus(new BN(gasPrice).times(_gasLimit))
    gasLimit = gasLimit + _gasLimit
  })
  return {
    feeAmount: feeBN.toFixed(),
    gasLimit: String(gasLimit),
  }
}

