import { toBN, atom } from './utils'

export const validAmount = (amount: number | string, balance: number | string = 0, feeAmount, intl) => {

  const num = Number(amount)

  if (isNaN(num)) {
    return [false, intl.formatMessage({ id: 'invalid_number' })]
  }

  if (num <= 0) {
    return [false, intl.formatMessage({ id: 'number_must_be_positive' })]
  }

  const bnAmounnt = toBN(num)

  const uAmount = atom(amount)
  const fraction = uAmount.split('.')[1]
  if (fraction && fraction.length > 6) {
    return [false, intl.formatMessage({ id: 'decimal_length_must_lt_six' })]
  }

  if (bnAmounnt.gt(balance)) {
    return [false, intl.formatMessage({ id: 'more_than_available' })]
  }

  if (bnAmounnt.plus(feeAmount).gt(balance)) {
    return [false, intl.formatMessage({ id: 'gas_not_enough' })]
  }

  return [true, null]
}