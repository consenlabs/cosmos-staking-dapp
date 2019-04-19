import Axios from "axios"
import { getHeaders, getProvider } from './sdk'

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ node requests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

let _headers = null
let _provider = null

export async function initRequestDependency() {
  return {
    headers: _headers || await getHeaders(),
    provider: _provider || await getProvider()
  }
}

function get(url, params = {}) {
  return initRequestDependency().then(({ headers, provider }) => {
    const _url = `${provider}/${url}`
    return Axios({ method: 'get', url: _url, params, headers, }).then(res => {
      if (res.data) {
        return res.data
      } else {
        throw new Error(`null response ${url} ${JSON.stringify(params)}`)
      }
    }).catch(error => {
      console.warn(error)
    })
  })
}

export function getValidators() {
  return get(`staking/validators`)
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

export const getBalance = (address) => {
  return getAccount(address).then(account => account.coins)
}

export const getDelegations = (address) => {
  const url = `staking/delegators/${address}/delegations`
  return get(url, {})
}

export const getRewards = (delegatorAddr) => {
  const url = `distribution/delegators/${delegatorAddr}/rewards`
  return get(url, {})
}

export const getUnbondingDelegations = (address) => {
  const url = `staking/delegators/${address}/unbonding_delegations`
  return get(url, {})
}

export const genDelegationTx = (delegatorAddr) => {
  const url = `staking/delegators/${delegatorAddr}/delegations`
  return get(url, {})
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ server rpc requests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

function createRpcRequestData(method, params) {
  return {
    jsonrpc: '2.0',
    id: 1,
    method,
    params: params || [],
  }
}

function serverRequest(url, method, params) {
  return initRequestDependency().then(({ headers }) => {
    return Axios({
      method: 'get',
      url,
      data: createRpcRequestData(method, params),
      timeout: 5,
      headers: headers,
    }).then(res => {
      if (res.data) {
        return res.data
      } else {
        throw new Error(`null response ${url} ${method} ${JSON.stringify(params)}`)
      }
    }).catch(error => {
      console.warn(error)
    })
  })
}

export function getTxListByAddress(delegator: string, validator: string) {
  const url = `https://api.dev.tokenlon.im/v1/cosmos`
  const params = [{
    address: delegator,
    tags: {
      action: ['delegate', 'undelegate'],
      delegator,
      validator,
    }
  }]
  return serverRequest(url, 'wallet.getMsgListByAddress', [params]).then(data => data || [])
}
