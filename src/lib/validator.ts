import { toBN } from './utils'

export const validAmount = (amount: number | string, balance: number | string, retainFee = 0, intl) => {

  const num = Number(amount)

  if (isNaN(num)) {
    return [false, intl.formatMessage({ id: 'invalid_number' })]
  }

  if (num <= 0) {
    return [false, intl.formatMessage({ id: 'number_must_be_positive' })]
  }

  const bnAmounnt = toBN(num)

  const sAmount = bnAmounnt.toString()
  const fraction = sAmount.split('.')[1]
  if (fraction && fraction.length > 6) {
    return [false, intl.formatMessage({ id: 'decimal_length_must_lt_six' })]
  }

  if (bnAmounnt.plus(retainFee).gt(balance)) {
    if (bnAmounnt.lt(balance)) {
      return [false, intl.formatMessage({ id: 'gas_not_enough' })]
    }
    return [false, intl.formatMessage({ id: 'more_than_available' })]
  }

  return [true, null]
}