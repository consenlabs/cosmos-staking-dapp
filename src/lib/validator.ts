import { toBN } from './utils'

export const validAmount = (amount: number | string, balance: number | string) => {

  const num = Number(amount)

  if (isNaN(num)) {
    return [false, '金额不合法']
  }

  if (num <= 0) {
    return [false, '请输入大于 0 的金额']
  }

  if (toBN(num).gt(balance)) {
    return [false, '余额不够']
  }
  return [true, null]
}