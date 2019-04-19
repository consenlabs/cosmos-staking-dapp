import { toBN } from './utils'

export const validAmount = (amount: number | string, balance: number | string, retainFee = 0) => {

  const num = Number(amount)

  if (isNaN(num)) {
    return [false, '金额不合法']
  }

  if (num <= 0) {
    return [false, '请输入大于 0 的金额']
  }

  const bnAmounnt = toBN(num)

  if (bnAmounnt.plus(retainFee).gt(balance)) {
    if (bnAmounnt.lt(balance)) {
      return [false, '矿工费不够']
    }
    return [false, '超出可用数量']
  }

  return [true, null]
}