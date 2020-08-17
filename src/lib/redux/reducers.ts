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
  pendingTxs: {},
  exchangeToken: {
    makerToken: {
      "symbol": "ETH",
      "logo": "https://aws-v2-cdn.token.im/app-mainnet-production/tokens/icons/eth%403x-2.png",
      "contractAddress": "0x0000000000000000000000000000000000000000",
      "decimal": 18,
      "precision": 4,
      "minTradeAmount": 0.01,
      "maxTradeAmount": 30,
      "opposites": [
        "ATOM",
        "ELF",
        "EOS",
        "KNC",
        "MANA",
        "PAX",
        "SNT",
        "TUSD",
        "USDC",
        "USDT",
        "ZRX"
      ],
      "xChainType": null,
      "xChainAddress": null
    },
    takerToken: {
      "symbol": "ATOM",
      "logo": "https://aws-v2-cdn.token.im/app-mainnet-production/tokens/icons/ATOM.png",
      "contractAddress": "0xc5637328da2e0a3400274a4088cea2e25fb91446",
      "decimal": 6,
      "precision": 4,
      "minTradeAmount": 0.001,
      "maxTradeAmount": 1,
      "opposites": [],
      "xChainType": "COSMOS",
      "xChainAddress": "uatom"
    }
  },
  unbondingDelegations: [],
  selectedValidtor: null,


  // vote
  proposals: [],
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
        if (Array.isArray(action.payload.validators) && action.payload.validators.length) {
          draft.validators = action.payload.validators
        }
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
      case types.ADD_PENDING_TX:
        if (action.payload.tx && action.payload.tx.txHash) {
          draft.pendingTxs[action.payload.tx.txHash] = action.payload.tx
        }
        return
      case types.REMOVE_PENDING_TX:
        delete draft.pendingTxs[action.payload.txHash]
        return
      case types.UPDATE_EXCHANGE_TOKEN:
        draft.exchangeToken = action.payload
        return
      case types.UPDATE_UNBONDING_DELEGATIONS:
        draft.unbondingDelegations = action.payload
        return
      case types.UPDATE_SELECTED_VALIDATOR:
        draft.selectedValidtor = action.payload
        return
      case types.UPDATE_PROPOSALS:
        draft.proposals = action.payload
      default:
        return draft
    }
  })
}
