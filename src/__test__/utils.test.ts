import BN from 'big.js'
import { toBN, uatom, atom, formatSmartBalance, fAtom } from '../lib/utils'

describe('test utils methods', () => {
  describe('test toBN', () => {
    const cases = [{
      input: '0',
      result: new BN('0')
    }, {
      input: new BN(6),
      result: new BN(6),
    }, {
      input: 'abcd',
      result: new BN(0),
    }, {
      input: undefined,
      result: new BN(0),
    }, {
      input: '1230000000000000000000000000000',
      result: new BN('1230000000000000000000000000000'),
    }]

    cases.forEach(c => {
      it(`toBN: ${c.input} => ${c.result}`, () => {
        expect(toBN(c.input).eq(toBN(c.result))).toBeTruthy()
      })
    })
  })

  describe('test uatom', () => {
    const cases = [{
      input: '0',
      result: '0',
    }, {
      input: '1',
      result: '1000000',
    }, {
      input: 1.001,
      result: '1001000',
    }, {
      input: undefined,
      result: '0',
    }, {
      input: '0.000000000000001234567',
      result: '0.000000001234567',
    }]

    cases.forEach(c => {
      it(`uatom: ${c.input} => ${c.result}`, () => {
        expect(uatom(c.input as any)).toBe(c.result)
      })
    })
  })

  describe('test atom', () => {
    const cases = [{
      input: '0',
      result: '0',
    }, {
      input: '1000000',
      result: '1',
    }, {
      input: 1001000,
      result: '1.001',
    }, {
      input: undefined,
      result: '0',
    }, {
      input: '0.000000001234567',
      result: '0.000000000000001234567',
    }]

    cases.forEach(c => {
      it(`atom: ${c.input} => ${c.result}`, () => {
        expect(atom(c.input as any)).toBe(c.result)
      })
    })
  })

  describe('test formatSmartBalance', () => {
    const cases = [{
      input: '0.1',
      places: 4,
      result: '0.1'
    }, {
      input: '0.000000000012',
      result: '0',
    }, {
      input: '0.00234567',
      result: '0.002345',
    }, {
      input: undefined,
      result: '0',
    }, {
      input: 123123123.000,
      result: '123,123,123',
    }, {
      input: 123123123.00002355,
      result: '123,123,123',
    }, {
      input: 123123123.00129355,
      result: '123,123,123.0012',
    }]

    cases.forEach(c => {
      it(`formatSmartBalance: ${c.input} => ${c.result}`, () => {
        expect(formatSmartBalance(c.input as any, c.places)).toBe(c.result)
      })
    })
  })

  describe('test fAtom', () => {
    const cases = [{
      input: '1',
      result: '0.000001'
    }, {
      input: '0.000000000012',
      result: '0',
    }, {
      input: '234567.123456789',
      result: '0.234567',
    }, {
      input: undefined,
      result: '~',
    }, {
      input: 3123123123.000,
      result: '3,123.1231',
    }, {
      input: 3123123123.00002355,
      result: '3,123.1231',
    }, {
      input: 3123456789,
      result: '3,123.4567',
    }]

    cases.forEach(c => {
      it(`fAtom: ${c.input} => ${c.result}`, () => {
        expect(fAtom(c.input as any)).toEqual(c.result)
      })
    })
  })

})