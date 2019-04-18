import * as types from './constant'

export const updateAccount = (account) => {
  return {
    type: types.UPDATE_ACCOUNT,
    payload: {
      account,
    }
  }
}

export const updateValidators = (validators) => {
  return {
    type: types.UPDATE_VALIDATORS,
    payload: {
      validators,
    }
  }
}

export const updateDelegations = (delegations) => {
  return {
    type: types.UPDATE_DELEGATIONS,
    payload: {
      delegations,
    }
  }
}