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

export const updatePool = (pool) => {
  return {
    type: types.UPDATE_POOL,
    payload: {
      pool,
    }
  }
}

export const updateValidatorRewards = (validatorRewards) => {
  return {
    type: types.UPDATE_VALIDATOR_REWARDS,
    payload: {
      validatorRewards,
    }
  }
}

export const updateAtomPrice = (price) => {
  return {
    type: types.UPDATE_ATOM_PRICE,
    payload: {
      price,
    }
  }
}

export const updateSortby = (sortBy) => {
  return {
    type: types.UPDATE_SORTBY,
    payload: {
      sortBy,
    }
  }
}
