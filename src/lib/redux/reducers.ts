import produce from 'immer'
import * as types from './constant'

const initialState = {
  account: {},
  validators: [],
  delegations: [],
}

export default function device(state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case types.UPDATE_ACCOUNT:
        draft.account = action.payload.account
        return
      case types.UPDATE_VALIDATORS:
        draft.validators = action.payload.validators
        return
      case types.UPDATE_DELEGATIONS:
        draft.delegations = action.payload.delegations
        return
      default:
        return draft
    }
  })
}
