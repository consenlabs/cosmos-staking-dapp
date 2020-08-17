import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connect } from "react-redux"
import { selectValidators } from '../../lib/redux/selectors'
import Home from '../home'
import Validators from '../validators'
import SelectValidator from '../selectValidator'
import ValidatorDetail from '../validatorDetail'
import Delegate from '../delegate'
import UnDelegate from '../undelegate'
import ReDelegate from '../redelegate'
import Vote from '../vote'
import './index.scss'
import { updateValidators, updateAccount, updateDelegations, updateRedelegations, updateValidatorRewards, updateAtomPrice, addPendingTx, updateExchangeToken, updateUnbondingDelegations } from 'lib/redux/actions'
import * as api from 'lib/api'
import * as sdk from 'lib/sdk'
import * as utils from 'lib/utils'
import { isReload } from '../../lib/utils'
import { pubsub } from 'lib/event'
import Campaign from '../campaign'
import OpenApp from 'open-app'

interface Props {
  validators: any[]
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateRedelegations: (value: any) => any
  updateAccount: (value: any) => any
  updateValidatorRewards: (value: any) => any
  updateAtomPrice: (value: any) => any
  addPendingTx: (value: any) => any
  updateExchangeToken: (value: any) => any
  updateUnbondingDelegations: (value: any) => any
}

class App extends Component<Props> {

  componentDidMount() {
    // if (!window['imToken']['callAPI']) {
    //   setTimeout(() => {
    //     utils.Toast.warn(t('please_open_in_imtoken'), { hideAfter: 5, position: 'top-center' })
    //   }, 6000)
    // }
    new OpenApp()
  }

  isVote = () => {
    return window.location.pathname === '/vote' || window.location.pathname === '/cosmos/vote'
  }

  _autoRefresh: any = null
  MAX_REFRESH_INTERVAL: number = 30 * 1000
  _refreshInterval: number = 10 * 1000
  polling: any = null

  componentWillMount() {
    sdk.navigatorConfigure({ navigatorColor: '#191b31' })

    const { addPendingTx } = this.props
    this.updateAsyncData()
    this.fetchTradeToken()
    pubsub.on('sendTxSuccess', (tx) => {
      this._refreshInterval = 5 * 1000
      if (tx) {
        addPendingTx(tx)
      } else {
        this.updateAsyncData()
      }
    })
  }

  componentWillUnmount() {
    pubsub.off('sendTxSuccess')
  }

  fetchTradeToken = () => {
    if (this.isVote()) return false
    const { updateExchangeToken } = this.props
    api.getTradeTokenList().then((data) => {
      const tokenlist = data || []
      const eth = tokenlist.find(t => t.symbol === 'ETH')
      const atom = tokenlist.find(t => t.symbol === 'ATOM')
      if (eth && atom && (eth.opposites || []).includes('ATOM')) {
        updateExchangeToken({
          makerToken: eth,
          takerToken: atom,
        })
      }
    }).catch(console.warn)
  }

  updateAsyncData = () => {
    if (this.isVote()) return false
    const { updateAccount, updateDelegations, updateRedelegations, updateValidators, updateValidatorRewards, updateAtomPrice, updateUnbondingDelegations } = this.props

    if (this.polling) clearTimeout(this.polling)

    sdk.getAccounts().then(accounts => {
      let address = accounts[0]

      // if page reload, use localstorage cache account, to keep account as it before reload
      if (isReload()) {
        let cacheAccount = localStorage.getItem('cache_account')
        if (cacheAccount && accounts.includes(cacheAccount)) {
          address = cacheAccount
        }
      }

      if (!address) return false

      localStorage.setItem('cache_account', address)

      updateAccount({ address })

      api.getRewards(address).then(utils.getRewardBalance).then(b => {
        updateAccount({ rewardBalance: b })
      }).catch(console.warn)

      api.getUnbondingDelegations(address).then(data => {
        updateUnbondingDelegations(data)
        return data
      }).then(utils.getUnbondingBalance).then(b => {
        updateAccount({ refundingBalance: b })
      }).catch(console.warn)

      api.getAccount(address).then(accountInfo => {
        const balance = utils.getBalanceFromAccount(accountInfo)
        updateAccount({ ...accountInfo, balance, address })
      }).catch(console.warn)

      api.getDelegations(address).then(delegations => {
        const delegateBalance = utils.getDeletationBalance(delegations)
        updateDelegations(delegations)
        updateAccount({ delegateBalance })

        const validatorRewards = {}
        const promises = delegations.map(d => {
          return api.getMyRewardByValidator(address, d.validator_address).then(balance => {
            validatorRewards[d.validator_address] = balance
          }).catch(console.warn)
        })

        Promise.all(promises).then(() => {
          updateValidatorRewards(validatorRewards)
        })
      }).catch(console.warn)

      api.getRedelegations(address).then(redelegations => {
        updateRedelegations(redelegations)
      }).catch(console.warn)
    }).catch(console.warn)

    api.getValidators().then(updateValidators).catch(console.warn)
    api.getAtomPrice().then(updateAtomPrice).catch(console.warn)

    this._refreshInterval = Math.min(Math.round(this._refreshInterval * 1.2), this.MAX_REFRESH_INTERVAL)

    this.polling = setTimeout(this.updateAsyncData, this._refreshInterval)
  }

  render() {
    return <BrowserRouter basename="/cosmos">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/validators" component={Validators} />
        <Route path="/validator/:id" component={ValidatorDetail} />
        <Route path="/delegate/:id" component={Delegate} />
        <Route path="/undelegate/:id" component={UnDelegate} />
        <Route path="/redelegate/:id" component={ReDelegate} />
        <Route path="/campaign/:id" component={Campaign} />
        <Route path="/vote" component={Vote} />
        <Route path="/select-validator/:id" component={SelectValidator} />
      </Switch>
    </BrowserRouter>
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
  }
}

const mapDispatchToProps = {
  updateAccount,
  updateDelegations,
  updateValidators,
  updateRedelegations,
  updateValidatorRewards,
  updateAtomPrice,
  addPendingTx,
  updateExchangeToken,
  updateUnbondingDelegations,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
