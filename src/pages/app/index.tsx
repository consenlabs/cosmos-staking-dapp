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
import { updateValidators, updateAccount, updateDelegations, updatePool, updateValidatorRewards, updateAtomPrice } from 'lib/redux/actions'
import * as api from 'lib/api'
import * as sdk from 'lib/sdk'
import * as utils from 'lib/utils'
import { pubsub } from 'lib/event'

interface Props {
  validators: any[]
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateAccount: (value: any) => any
  updatePool: (value: any) => any
  updateValidatorRewards: (value: any) => any
  updateAtomPrice: (value: any) => any
}

class App extends Component<Props> {

  componentDidMount() {
    if (!window['imToken']['callAPI']) {
      setTimeout(() => {
        utils.Toast.warn('请在 imToken 中打开', { hideAfter: 5, position: 'top-center' })
      }, 6000)
    }
  }

  componentWillMount() {
    this.updateAsyncData()
    pubsub.on('updateAsyncData', () => {
      pubsub.off('updateAsyncData')
      // refresh immediately
      this.updateAsyncData()
      // auto refresh after 10 seconds
      setInterval(this.updateAsyncData, 1000 * 10)
    })
  }

  componentWillUnmount() {
    pubsub.off('updateAsyncData')
  }

  updateAsyncData = () => {
    const { updateAccount, updateDelegations, updateValidators, updatePool, updateValidatorRewards, updateAtomPrice } = this.props

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
            console.log(validatorRewards)
          })
        })

        Promise.all(promises).then(() => {
          updateValidatorRewards(validatorRewards)
        })
      })
    })

    api.getStakePool().then(pool => {
      console.log(pool)
      updatePool(pool)
    })

    api.getValidators().then(updateValidators).catch(err => console.warn(err))
    api.getAtomPrice().then(updateAtomPrice)
  }

  render() {
    return <BrowserRouter basename="/cosmos">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/validators" component={Validators} />
        <Route path="/validator/:id" component={ValidatorDetail} />
        <Route path="/delegate/:id" component={Delegate} />
        <Route path="/undelegate/:id" component={UnDelegate} />
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
  updatePool,
  updateValidatorRewards,
  updateAtomPrice,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
