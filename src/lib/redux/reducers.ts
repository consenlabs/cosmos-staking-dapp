import produce from 'immer'
import * as types from './constant'

const initialState = {
  account: {
  },
  validators: [],
  delegations: [],
  redelegations: [],
  pool: {
    not_bonded_tokens: 0,
    bonded_tokens: 0,
  },
  validatorRewards: {},
  price: {},
  sortBy: 'delegators',
}

export default function device(state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case types.UPDATE_ACCOUNT:
        const account = action.payload.account
        if (account && typeof account === 'object') {
          draft.account = { ...draft.account, ...action.payload.account }
        }
        return
      case types.UPDATE_VALIDATORS:
        draft.validators = action.payload.validators
        return
      case types.UPDATE_DELEGATIONS:
        draft.delegations = action.payload.delegations
        return
      case types.UPDATE_REDELEGATIONS:
        draft.redelegations = action.payload.redelegations
        return
      case types.UPDATE_POOL:
        draft.pool = action.payload.pool
        return
      case types.UPDATE_VALIDATOR_REWARDS:
        draft.validatorRewards = action.payload.validatorRewards
        return
      case types.UPDATE_ATOM_PRICE:
        draft.price = action.payload.price
        return
      case types.UPDATE_SORTBY:
        draft.sortBy = action.payload.sortBy
        return
      default:
        return draft
    }
  })
}
