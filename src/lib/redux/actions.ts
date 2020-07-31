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

export const updateRedelegations = (redelegations) => {
  return {
    type: types.UPDATE_REDELEGATIONS,
    payload: {
      redelegations,
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

export const addPendingTx = (tx) => {
  return {
    type: types.ADD_PENDING_TX,
    payload: {
      tx,
    }
  }
}

export const removePendingTx = (txHash: string) => {
  return {
    type: types.REMOVE_PENDING_TX,
    payload: {
      txHash,
    }
  }
}

export const updateExchangeToken = ({ makerToken, takerToken }) => {
  return {
    type: types.UPDATE_EXCHANGE_TOKEN,
    payload: {
      makerToken,
      takerToken,
    }
  }
}

export const updateUnbondingDelegations = (unbondingDelegations) => {
  return {
    type: types.UPDATE_UNBONDING_DELEGATIONS,
    payload: unbondingDelegations
  }
}

export const updateSelectedValidator = (validator) => {
  return {
    type: types.UPDATE_SELECTED_VALIDATOR,
    payload: validator
  }
}


export const updateProposals = (proposals) => {
  return {
    type: types.UPDATE_PROPOSALS,
    payload: proposals
  }
}