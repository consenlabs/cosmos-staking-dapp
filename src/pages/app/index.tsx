import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connect } from "react-redux"
import { selectValidators } from '../../lib/redux/selectors'
import Home from '../home'
import Validators from '../validators'
import ValidatorDetail from '../validatorDetail'
import Delegate from '../delegate'
import UnDelegate from '../undelegate'
import Vote from '../vote'
import './index.scss'
import { updateValidators, updateAccount, updateDelegations, updateRedelegations, updateValidatorRewards, updateAtomPrice, addPendingTx } from 'lib/redux/actions'
import * as api from 'lib/api'
import * as sdk from 'lib/sdk'
import * as utils from 'lib/utils'
import { t } from '../../lib/utils'
import { pubsub } from 'lib/event'
import Campaign from '../campaign'

interface Props {
  validators: any[]
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateRedelegations: (value: any) => any
  updateAccount: (value: any) => any
  updateValidatorRewards: (value: any) => any
  updateAtomPrice: (value: any) => any
  addPendingTx: (value: any) => any
}

class App extends Component<Props> {

  componentDidMount() {
    if (!window['imToken']['callAPI']) {
      setTimeout(() => {
        utils.Toast.warn(t('please_open_in_imtoken'), { hideAfter: 5, position: 'top-center' })
      }, 6000)
    }
  }

  _autoRefresh: any = null
  _updateTimes: number = 0

  componentWillMount() {
    const { addPendingTx } = this.props
    this.updateAsyncData()
    pubsub.on('sendTxSuccess', (tx) => {
      this._autoRefresh && clearInterval(this._autoRefresh)
      this._updateTimes = 0
      this._autoRefresh = setInterval(this.updateAsyncData, 1000 * 10)
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

  updateAsyncData = () => {
    const { updateAccount, updateDelegations, updateRedelegations, updateValidators, updateValidatorRewards, updateAtomPrice } = this.props

    if (this._updateTimes > 10) return false

    sdk.getAccounts().then(accounts => {
      const address = accounts[0]

      if (!address) return false

      updateAccount({ address })

      api.getRewards(address).then(utils.getRewardBalance).then(b => {
        updateAccount({ rewardBalance: b })
      })

      api.getUnbondingDelegations(address).then(utils.getUnbondingBalance).then(b => {
        updateAccount({ refundingBalance: b })
      })

      api.getAccount(address).then(accountInfo => {
        const balance = utils.getBalanceFromAccount(accountInfo)
        updateAccount({ ...accountInfo, balance })
      })

      api.getDelegations(address).then(delegations => {
        const delegateBalance = utils.getDeletationBalance(delegations)
        updateDelegations(delegations)
        updateAccount({ delegateBalance })

        const validatorRewards = {}
        const promises = delegations.map(d => {
          return api.getMyRewardByValidator(address, d.validator_address).then(balance => {
            validatorRewards[d.validator_address] = balance
          })
        })

        Promise.all(promises).then(() => {
          updateValidatorRewards(validatorRewards)
        })
      })

      api.getRedelegations(address).then(redelegations => {
        updateRedelegations(redelegations)
      })
    })

    api.getValidators().then(updateValidators).catch(err => console.warn(err))
    api.getAtomPrice().then(updateAtomPrice)

    this._updateTimes++
  }

  render() {
    return <BrowserRouter basename="/cosmos">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/validators" component={Validators} />
        <Route path="/validator/:id" component={ValidatorDetail} />
        <Route path="/delegate/:id" component={Delegate} />
        <Route path="/undelegate/:id" component={UnDelegate} />
        <Route path="/campaign/:id" component={Campaign} />
        <Route path="/vote" component={Vote} />
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
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
