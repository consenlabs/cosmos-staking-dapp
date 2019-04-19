import BN from 'big.js'
import numeral from 'numeral'

// interface __MsgAmount {
//   amount: string
//   denom: string
// }

interface __Msg {
  type: string
  value: any
}

const DEFAULT_FEE = { "amount": [{ "amount": "2610", "denom": "muon" }], "gas": "30000" }

export function createTxPayload(from: string, msg: __Msg[], memo: string) {
  const payload = {
    from: from,
    chainType: 'COSMOS',
    fee: DEFAULT_FEE,
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
      "value": {
        "amount": { "amount": amount, "denom": denom },
      }
    }
  }
}

export function createUnDelegateMsg(delegatorAddress, validatorAddress, amount, denom) {
  return {
    "type": "cosmos-sdk/MsgUndelegate",
    "value": {
      "delegator_address": delegatorAddress,
      "validator_address": validatorAddress,
      "value": {
        "amount": { "amount": amount, "denom": denom },
      }
    }
  }
}

export function createWithdrawMsg(delegatorAddress, validatorAddress, amount, denom) {
  return {
    "type": "cosmos-sdk/MsgWithdrawDelegationReward",
    "value": {
      "delegator_address": delegatorAddress,
      "validator_address": validatorAddress,
      "value": {
        "amount": { "amount": amount, "denom": denom },
      }
    }
  }
}

export function createRedelegateMsg(delegatorAddress, validatorSrcAddress, validatorDstAddress, amount, denom) {
  return {
    "type": "cosmos-sdk/MsgBeginRedelegate",
    "value": {
      "delegator_address": delegatorAddress,
      "validator_src_addressess": validatorSrcAddress,
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
  return numeral(num).format('0,0.[00]')
}

export const isExist = (o: any) => {
  return typeof o !== 'undefined'
}
