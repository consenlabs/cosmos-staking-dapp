import { validDelegate, validUndelegate, isDecimalOverflow } from '../lib/validator'

describe('test isDecimalOverflow', () => {

  const cases = [{
    num: '0',
    places: 6,
    result: false
  }, {
    num: '0.00001',
    places: 6,
    result: false
  }, {
    num: '0.0000000001',
    places: 6,
    result: true
  }, {
    num: '',
    places: 6,
    result: false
  }]

  cases.forEach(c => {
    it(`isDecimal: ${c.num} overflow ${c.places} => ${c.result}`, () => {
      expect(isDecimalOverflow(c.num, c.places)).toEqual(c.result)
    })
  })
})

describe('test validDelegate', () => {

  const cases = [
    {
      inputAmount: 'aaaa',
      availableBalance: 7,
      feeAmount: 1,
      result: [false, 'invalid_number']
    },
    {
      inputAmount: undefined,
      availableBalance: 7,
      feeAmount: 1,
      result: [false, 'invalid_number']
    }, {
      inputAmount: 0,
      availableBalance: 7,
      feeAmount: 1,
      result: [false, 'number_must_be_positive']
    }, {
      inputAmount: '0.1',
      availableBalance: 7,
      feeAmount: 1,
      result: [false, 'decimal_length_must_lt_six']
    }, {
      inputAmount: '81000000',
      availableBalance: 7000000,
      feeAmount: 1000000,
      result: [false, 'more_than_available']
    }, {
      inputAmount: 6100000,
      availableBalance: 7000000,
      feeAmount: 1000000,
      result: [false, 'gas_not_enough']
    }, {
      inputAmount: 4,
      availableBalance: 7,
      feeAmount: 1,
      result: [true, null]
    }, {
      inputAmount: 6,
      availableBalance: 7,
      feeAmount: 1,
      result: [true, null]
    }]

  cases.forEach(c => {
    it(`validDelegate: ${c.inputAmount} ${c.availableBalance} ${c.feeAmount} => ${c.result}`, () => {
      expect(validDelegate(c.inputAmount, c.availableBalance, c.feeAmount)).toEqual(c.result)
    })
  })
})

describe('test validUndelegate', () => {

  const cases = [
    {
      inputAmount: 'aaaa',
      delegatedNumber: 9,
      availableBalance: 7,
      feeAmount: 1,
      result: [false, 'invalid_number']
    },
    {
      inputAmount: undefined,
      delegatedNumber: 9,
      availableBalance: 7,
      feeAmount: 1,
      result: [false, 'invalid_number']
    }, {
      inputAmount: 0,
      delegatedNumber: 9,
      availableBalance: 7,
      feeAmount: 1,
      result: [false, 'number_must_be_positive']
    }, {
      inputAmount: '0.000000001',
      delegatedNumber: 9,
      availableBalance: 7,
      feeAmount: 1,
      result: [false, 'decimal_length_must_lt_six']
    }, {
      inputAmount: 10,
      delegatedNumber: 9,
      availableBalance: 3,
      feeAmount: 1,
      result: [false, 'more_than_available']
    }, {
      inputAmount: 8,
      delegatedNumber: 9,
      availableBalance: 3,
      feeAmount: 4,
      result: [false, 'gas_not_enough']
    }, {
      inputAmount: 4,
      delegatedNumber: 9,
      availableBalance: 1,
      feeAmount: 1,
      result: [true, null]
    }, {
      inputAmount: 9,
      delegatedNumber: 9,
      availableBalance: 1,
      feeAmount: 1,
      result: [true, null]
    }]

  cases.forEach(c => {
    it(`validUndelegate: ${c.inputAmount} ${c.delegatedNumber} ${c.availableBalance} ${c.feeAmount} => ${c.result}`, () => {
      expect(validUndelegate(c.inputAmount, c.delegatedNumber, c.feeAmount, c.availableBalance)).toEqual(c.result)
    })
  })
})