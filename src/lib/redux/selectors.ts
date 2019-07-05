export const selectAccountInfo = state => state.account
export const selectValidators = state => state.validators
export const selectDelegations = state => state.delegations
export const selectPool = state => state.pool
export const selectValidatorRewards = state => state.validatorRewards
export const selectPrice = state => state.price
export const selectSortby = state => state.sortBy
export const selectRedelegations = state => state.redelegations
export const selectPendingTxs = state => state.pendingTxs
export const selectExchangeToken = state => state.exchangeToken
export const selectUnbondingDelegations = state => state.unbondingDelegations || []
