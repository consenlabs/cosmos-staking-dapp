import produce from 'immer'
import * as types from './constant'

const initialState = {
  account: {
  },
  validators: [],
  delegations: [],
  pool: {
    not_bonded_tokens: 0,
    bonded_tokens: 0,
  },
  language: 'zh',
  validatorRewards: {},
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
      case types.UPDATE_POOL:
        draft.pool = action.payload.pool
        return
      case types.UPDATE_LANGUAGE:
        draft.language = action.payload.language
        return
      case types.UPDATE_VALIDATOR_REWARDS:
        draft.validatorRewards = action.payload.validatorRewards
        return
      default:
        return draft
    }
  })
}
