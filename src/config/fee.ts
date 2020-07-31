import BN from 'big.js'
import msgTypes from '../lib/msgTypes'


export const gasPrice = 0.003

export const gasLimitMap = {
  [msgTypes.send]: 50000,
  [msgTypes.delegate]: 200000,
  [msgTypes.undelegate]: 200000,
  [msgTypes.withdraw]: 90000,
  [msgTypes.redelegate]: 250000,
  [msgTypes.vote]: 100000,
  [msgTypes.proposal]: 100000,
  [msgTypes.deposit]: 100000
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

