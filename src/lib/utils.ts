import BN from 'big.js'
import numeral from 'numeral'
import cogoToast from 'cogo-toast'
import { getFeeFiledByType } from '../config/fee'
import msgTypes from './msgTypes'
import enTrans from '../locale/en_US'
import zhTrans from '../locale/zh_CN'

export const Toast = cogoToast

BN.DP = 40
BN.RM = 0

// interface __MsgAmount {
//   amount: string
//   denom: string
// }

interface __Msg {
  type: string
  value: any
}

export function createTxPayload(from: string, msg: __Msg[], memo: string, feeType = msgTypes.redelegate) {
  const payload = {
    from: from,
    chainType: 'COSMOS',
    fee: getFeeFiledByType(feeType),
    msg,
    memo,
  }
  return payload
}

export function createTransferMsg(fromAddr, toAddr, amount, denom) {
  return {
    "type": msgTypes.send,
    "value": {
      "amount": [{ "amount": amount, "denom": denom }],
      "from_address": fromAddr,
      "to_address": toAddr
    }
  }
}

export function createDelegateMsg(delegatorAddress, validatorAddress, amount, denom) {
  return {
    "type": msgTypes.delegate,
    "value": {
      "delegator_address": delegatorAddress,
      "validator_address": validatorAddress,
      "amount": { "amount": amount, "denom": denom },
    }
  }
}

export function createUnDelegateMsg(delegatorAddress, validatorAddress, amount, denom) {
  return {
    "type": msgTypes.undelegate,
    "value": {
      "delegator_address": delegatorAddress,
      "validator_address": validatorAddress,
      "amount": { "amount": amount, "denom": denom },
    }
  }
}

export function createWithdrawMsg(delegatorAddress, validatorAddress) {
  return {
    "type": msgTypes.withdraw,
    "value": {
      "delegator_address": delegatorAddress,
      "validator_address": validatorAddress,
    }
  }
}

export function createRedelegateMsg(delegatorAddress, validatorSrcAddress, validatorDstAddress, amount, denom) {
  return {
    "type": msgTypes.redelegate,
    "value": {
      "delegator_address": delegatorAddress,
      "validator_src_address": validatorSrcAddress,
      "validator_dst_address": validatorDstAddress,
      "amount": { "amount": amount, "denom": denom },
    }
  }
}

export const ellipsis = (str: string, lead: number = 12, tail: number = 6): string => {
  if (str && str.length > lead + tail + 8) {
    return `${str.substring(0, lead)}...${str.substring(str.length - tail, str.length)}`
  }
  return str
}

export const toBN = (x) => {
  if (isNaN(Number(x))) return new BN(0)
  if (x instanceof BN) return x
  return new BN(x)
}

export const uatom = (atom: string | number) => {
  return toBN(atom).times(1e6).toFixed()
}

export const atom = (uatom: string | number) => {
  return toBN(uatom).div(1e6).toFixed()
}

/**
 * used for render balance in jsx
 * the decimals length depend on the value
 * if value < 1, at least keep the non-zero and following four places
 * if integer, keep interger
 * if otherwise, keep ${decimalLength} places decimals
 */
export const formatSmartBalance = (num: number | string, defaultDecimalLength: number = 4, maxDecimalLength: number = 6) => {
  const valueBN = toBN(num)
  const valueString = valueBN.toFixed()

  if (valueBN.eq(valueBN.toFixed(0, 1))) {
    return thousandCommas(valueString, 0)
  }

  if (valueBN.lt(1)) {
    for (let i = 2; i < valueString.length; i++) {
      if (i >= 2 + maxDecimalLength) return '0'  // if 0.000000* return 0
      if (valueString[i] !== '0') {
        let max = Math.min(maxDecimalLength, i + defaultDecimalLength) // display 0. + maxDecimalLength zero at most.
        return valueBN.toFixed(Math.max(max, defaultDecimalLength)).replace(/[0]+$/, '')
      }
    }
  }

  return thousandCommas(valueBN.toFixed(defaultDecimalLength), defaultDecimalLength)
}

/**
 * format uatom balance in atom
 * used for render balance in jsx
 * don't used for calc
 */
export const fAtom = (uatom: string | number, decimalLength = 4, placeholader = '~') => {
  if (isNaN(Number(uatom))) return placeholader
  return formatSmartBalance(atom(uatom), decimalLength)
}


export const thousandCommas = (num: string | number, place: number = 4) => {
  const decimals = '0'.repeat(place)
  return numeral(num).format(`0,0.[${decimals}]`)
}

export const fPercent = (p: number, fixed = 3) => {
  return !isNaN(Number(p)) ? `${(p * 100).toFixed(fixed)}%` : '~'
}

export const isExist = (o: any) => {
  return typeof o !== 'undefined'
}

export const getDailyReward = (delegateShares, annualizedTeturns) => {
  const dailyReward = toBN(delegateShares).times(annualizedTeturns).div(365).toFixed()
  return fAtom(dailyReward, 3)
}

export const getBalanceFromAccount = (account) => {
  const v = account
  if (!v || !v.coins || !Array.isArray(v.coins)) return 0
  const atom = v.coins.find(
    c => c.denom === 'uatom' || c.denom === 'muon'
  )
  return atom.amount || 0
}

export const getDeletationBalance = (delegations) => {
  let balance = 0
  delegations.forEach(d => {
    balance += d.shares * 1
  })
  return balance.toFixed(0)
}

export const getRewardBalance = (rewards) => {
  let balance = 0
  rewards.forEach(d => {
    balance += d.amount * 1
  })
  return balance.toFixed(0)
}

export const getUnbondingBalance = (unbondingDelegations) => {
  let balance = 0
  unbondingDelegations.forEach(d => {
    if (Array.isArray(d.entries)) {
      d.entries.forEach(o => {
        balance += o.balance * 1
      })
    }
  })
  return balance.toFixed(0)
}

export const isiPhoneX = () => {
  if (typeof window !== 'undefined' && window) {
    return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
  }
  return false
}

export const getLocale = () => {
  let val = navigator.language || ''
  const locale = val.toLowerCase().split(/[^\w+]/ig)[0] || 'en'
  return locale === 'zh' ? 'zh' : 'en'
}

export const getAmountFromMsg = (msg) => {
  const amountObj = msg.value.amount
  return amountObj && amountObj.amount
}

let trans: any = null
export const t = (key) => {
  if (!trans) {
    const locale = getLocale()
    trans = (locale === 'zh' ? zhTrans : enTrans)
  }

  return trans[key] || key
}