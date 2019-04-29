import { toBN, atom } from './utils'

export const isDecimalOverflow = (num: string, length) => {
  const fraction = num.split('.')[1]
  return !!(fraction && fraction.length > length)
}

export const validDelegate = (inputAmount, availableBalance = 0, feeAmount) => {

  const num = Number(inputAmount)

  if (isNaN(num)) {
    return [false, 'invalid_number']
  }

  if (num <= 0) {
    return [false, 'number_must_be_positive']
  }

  const bnAmounnt = toBN(num)

  if (isDecimalOverflow(atom(inputAmount), 6)) {
    return [false, 'decimal_length_must_lt_six']
  }

  if (bnAmounnt.gt(availableBalance)) {
    return [false, 'more_than_available']
  }

  if (bnAmounnt.plus(feeAmount).gt(availableBalance)) {
    return [false, 'fee_not_enough']
  }

  return [true, null]
}

export const validUndelegate = (inputAmount, delegatedNumber = 0, feeAmount, availableBalance = 0) => {

  const num = Number(inputAmount)

  if (isNaN(num)) {
    return [false, 'invalid_number']
  }

  if (num <= 0) {
    return [false, 'number_must_be_positive']
  }

  if (isDecimalOverflow(atom(inputAmount), 6)) {
    return [false, 'decimal_length_must_lt_six']
  }

  if (toBN(inputAmount).gt(delegatedNumber)) {
    return [false, 'more_than_available']
  }

  if (toBN(feeAmount).gt(availableBalance)) {
    return [false, 'fee_not_enough']
  }

  return [true, null]
}