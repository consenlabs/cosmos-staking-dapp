import Axios from "axios"
import { getProvider } from './sdk'
import { getRewardBalance, getLocale, t } from './utils'
import getNetworkConfig from '../config/network'
import msgTypes from './msgTypes'

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ node requests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// let _headers = null
let _provider = null

export async function initRequestDependency() {
  return {
    // headers: _headers || await getHeaders(),
    provider: _provider || await getProvider()
  }
}

function get(url, params = {}) {
  return initRequestDependency().then(({ provider }) => {
    const _url = `${provider}/${url}`
    return Axios({ method: 'get', url: _url, params }).then(res => {
      if (res.data) {
        return res.data
      } else {
        throw new Error(`null response ${url} ${JSON.stringify(params)}`)
      }
    })
  })
}


function rpc(url, method, params) {
  return initRequestDependency().then(({ }) => {
    const data = {
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }
    return Axios({ method: 'post', url, data }).then(res => {
      if (res.data) {
        return res.data.result
      } else {
        throw new Error(`null response ${url} ${JSON.stringify(params)}`)
      }
    })
  })
}

function sortValidators(a, b) {
  return a.tokens * 1 > b.tokens * 1 ? -1 : 1
}

// Normalize account response
// https://github.com/cosmos/cosmos-sdk/issues/3885
export function getAccount(address) {
  const emptyAccount = {
    coins: [],
    sequence: `0`,
    account_number: `0`,
  }
  const url = `auth/accounts/${address}`
  return get(url, {}).then(res => {
    if (!res) throw new Error('no response')
    let account = res.value || emptyAccount
    if (res.type === `auth/DelayedVestingAccount`) {
      if (!account.BaseVestingAccount) {
        return emptyAccount
      }
      account = Object.assign({},
        account.BaseVestingAccount.BaseAccount,
        account.BaseVestingAccount,
      )
      delete account.BaseAccount
      delete account.BaseVestingAccount
    }
    return account
  }).catch(err => {
    // if account not found, return null instead of throwing
    if (err.message.includes(`account bytes are empty`) ||
      err.message.includes(`failed to prove merkle proof`)) {
      return emptyAccount
    }
    // throw err
    throw err
  })
}

export const getDelegations = (address) => {
  const url = `staking/delegators/${address}/delegations`
  return get(url, {}).then(delegations => {
    console.log(delegations)
    return (delegations || []).sort(
      (a, b) => b.shares - a.shares
    )
  })
}

export const getRewards = (delegatorAddr) => {
  const url = `distribution/delegators/${delegatorAddr}/rewards`
  return get(url, {}).then(rewards => rewards || []).catch(err => {
    if (err.message.includes(`null response`)) {
      return []
    } else {
      throw err
    }
  })
}

export const getUnbondingDelegations = (address) => {
  const url = `staking/delegators/${address}/unbonding_delegations`
  return get(url, {}).then(unbondingDelegations => unbondingDelegations || []).catch(err => {
    if (err.message.includes(`null response`)) {
      return []
    } else {
      throw err
    }
  })
}

export const getDelegationTx = (delegatorAddr) => {
  const url = `staking/delegators/${delegatorAddr}/delegations`
  return get(url, {})
}

export const getStakePool = () => {
  const url = `staking/pool`
  return get(url, {}).then(pool => pool || {})
}

/**
 * [
  {
    "delegator_address": "cosmos18ptg027t5cumqzkhpn726uhdqdadh88ss7ytv3",
    "validator_src_address": "cosmosvaloper1cgh5ksjwy2sd407lyre4l3uj2fdrqhpkzp06e6",
    "validator_dst_address": "cosmosvaloper1rwh0cxa72d3yle3r4l8gd7vyphrmjy2kpe4x72",
    "entries": [
      {
        "creation_height": "97157",
        "completion_time": "2019-05-21T09:43:35.605908506Z",
        "initial_balance": "2200000",
        "shares_dst": "2200000.000000000000000000"
      }
    ]
  }
]
 */
export const getRedelegations = (delegateAddr) => {
  const url = `staking/redelegations?delegator=${delegateAddr}`
  return get(url, {}).then(redelegations => redelegations || [])
}

export const getMyRewardByValidator = (delegatorAddr, validatorAddr) => {
  const url = `distribution/delegators/${delegatorAddr}/rewards/${validatorAddr}`
  return get(url, {}).then(rewards => {
    rewards = rewards || []
    const balance = getRewardBalance(rewards)
    return balance
  })
}

export const getTxByHash = (txHash) => {
  const url = `txs/${txHash}`
  return get(url, {})
}

/**
 * check tx if failed
 */

function checkTxRawLog(raw_log) {
  try {
    const rawlog = JSON.parse(raw_log)
    if (Array.isArray(rawlog)) {
      return rawlog.every(r => r.success === true)
    }
  } catch (error) {
    // if raw_log is not parsed successfully, take it as failed
  }
  return false
}

/**
 * polling check tx
 */
export function checkTx(txHash, timer, repeatCount = 10) {

  let count = 0

  const check = (resolve, reject) => {
    return getTxByHash(txHash).then(tx => {
      if (tx && tx.height) {
        if (checkTxRawLog(tx.raw_log)) {
          resolve(tx)
        } else {
          reject({ message: t('tx_failed') })
        }
      }
    }).catch(e => {
      if (count > repeatCount) {
        reject(e)
        return
      }
      setTimeout(() => {
        count++
        check(resolve, reject)
      }, timer || 5000)
    })
  }


  return new Promise((resolve, reject) => {
    check(resolve, reject)
  })
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ server rpc requests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

export async function getValidators() {
  const host = getNetworkConfig().chainAPI
  return rpc(host, `wallet.getValidators`, []).then(validators => {
    return (validators || []).map(v => ({ ...v, tokens: v.Tokens || v.tokens }))
  }).then(validators => validators.sort(sortValidators).map(
    (v, index) => {
      return { ...v, sortIndex: index }
    }))
}

export async function getAtomPrice() {
  const host = getNetworkConfig().market
  const currency = getLocale() === 'zh' ? 'CNY' : 'USDT'
  const params = [{ "chainType": "COSMOS", "address": "uatom", currency }]
  return rpc(host, `market.getPrice`, params).then(prices => prices || {})
}

export function getTxListByAddress(delegator: string, validator: string) {
  const params = [{
    address: delegator,
    relativeAddress: validator,
    msgTypes: [
      msgTypes.delegate,
      msgTypes.undelegate,
      msgTypes.withdraw,
      msgTypes.redelegate,
    ],
  }]
  return rpc(getNetworkConfig().chainAPI, 'wallet.getMsgListByAddress', params).then(data => data || [])
}

export function getHashquarkRankList(address: string) {
  const params = [{
    address,
  }]
  return rpc(getNetworkConfig().campaign, 'campaign.hashquarkRankList', params).then(data => data)
}

export function getTradeTokenList() {
  return rpc(getNetworkConfig().exchange, 'tokenlon.getTradeTokenList', {}).then(data => data)
}
