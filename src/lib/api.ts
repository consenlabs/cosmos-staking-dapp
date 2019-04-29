import Axios from "axios"
import { getProvider } from './sdk'
import { getRewardBalance, getLocale } from './utils'
import getNetworkConfig from '../config/network'
import msgTypes from './msgTypes'

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ node requests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

// let _headers = null
let _provider = null

const warnning = (err) => console.warn(err)

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
    }).catch(warnning)
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
    console.warn(err)
  })
}

export const getDelegations = (address) => {
  const url = `staking/delegators/${address}/delegations`
  return get(url, {}).then(delegations => (delegations || []).sort(
    (a, b) => b.shares - a.shares
  ))
}

export const getRewards = (delegatorAddr) => {
  const url = `distribution/delegators/${delegatorAddr}/rewards`
  return get(url, {}).then(rewards => rewards || [])
}

export const getUnbondingDelegations = (address) => {
  const url = `staking/delegators/${address}/unbonding_delegations`
  return get(url, {}).then(unbondingDelegations => unbondingDelegations || [])
}

export const getDelegationTx = (delegatorAddr) => {
  const url = `staking/delegators/${delegatorAddr}/delegations`
  return get(url, {})
}

export const getStakePool = () => {
  const url = `staking/pool`
  return get(url, {}).then(pool => pool || {})
}

export const getMyRewardByValidator = (delegatorAddr, validatorAddr) => {
  const url = `distribution/delegators/${delegatorAddr}/rewards/${validatorAddr}`
  return get(url, {}).then(rewards => {
    rewards = rewards || []
    const balance = getRewardBalance(rewards)
    return balance
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
  return rpc(host, `market.getPrice`, params).then(prices => prices || {}).catch(warnning)
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
  return rpc(getNetworkConfig().chainAPI, 'wallet.getMsgListByAddress', params).then(data => data || []).catch(warnning)
}
