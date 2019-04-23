import BN from 'big.js'
import numeral from 'numeral'
import cogoToast from 'cogo-toast'
import getFeeConfig from '../config/fee'

export const Toast = cogoToast

BN.DP = 20
BN.RM = 0

// interface __MsgAmount {
//   amount: string
//   denom: string
// }

interface __Msg {
  type: string
  value: any
}

export function createTxPayload(from: string, msg: __Msg[], memo: string) {
  const payload = {
    from: from,
    chainType: 'COSMOS',
    fee: getFeeConfig().transfer,
    msg,
    memo,
  }
  return payload
}

export function createTransferMsg(fromAddr, toAddr, amount, denom) {
  return {
    "type": "cosmos-sdk/MsgSend",
    "value": {
      "amount": [{ "amount": amount, "denom": denom }],
      "from_address": fromAddr,
      "to_address": toAddr
    }
  }
}

export function createDelegateMsg(delegatorAddress, validatorAddress, amount, denom) {
  return {
    "type": "cosmos-sdk/MsgDelegate",
    "value": {
      "delegator_address": delegatorAddress,
      "validator_address": validatorAddress,
      "amount": { "amount": amount, "denom": denom },
    }
  }
}

export function createUnDelegateMsg(delegatorAddress, validatorAddress, amount, denom) {
  return {
    "type": "cosmos-sdk/MsgUndelegate",
    "value": {
      "delegator_address": delegatorAddress,
      "validator_address": validatorAddress,
      "amount": { "amount": amount, "denom": denom },
    }
  }
}

export function createWithdrawMsg(delegatorAddress, validatorAddress, amount, denom) {
  return {
    "type": "cosmos-sdk/MsgWithdrawDelegationReward",
    "value": {
      "delegator_address": delegatorAddress,
      "validator_address": validatorAddress,
      "amount": { "amount": amount, "denom": denom },
    }
  }
}

export function createRedelegateMsg(delegatorAddress, validatorSrcAddress, validatorDstAddress, amount, denom) {
  return {
    "type": "cosmos-sdk/MsgBeginRedelegate",
    "value": {
      "delegator_address": delegatorAddress,
      "validator_src_address": validatorSrcAddress,
      "validator_dst_address": validatorDstAddress,
      "value": {
        "amount": { "amount": amount, "denom": denom },
      }
    }
  }
}

export const ellipsis = (str: string, num: number = 20): string => {
  if (str && str.length > num) {
    return `${str.substring(0, num / 2)}...${str.substring(str.length - num / 2, str.length)}`
  }
  return str
}

export const toBN = (x) => new BN(x)

export const uatom = (atom: string | number) => {
  return new BN(atom, 10).times(1e6).toString()
}

export const atom = (uatom: string | number) => {
  return new BN(uatom).div(1e6).toString()
}

export const thousandCommas = (num: string | number) => {
  return numeral(num).format('0,0.[0000]')
}

export const fPercent = (p: number, fixed = 3) => {
  return !isNaN(Number(p)) ? `${(p * 100).toFixed(fixed)} %` : '~'
}

export const decimal = (num: string | number, place: number = 3): string => {
  if (!num || Number(num) === 0) return '0'
  return toBN(num).toFixed(place, 1)
}

export const isExist = (o: any) => {
  return typeof o !== 'undefined'
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
  return val.toLowerCase().split('_')[0] || 'zh'
}