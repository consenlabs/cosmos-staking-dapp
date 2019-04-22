import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connect } from "react-redux"
import { selectValidators } from '../../lib/redux/selectors'
import Home from '../home'
import Validators from '../validators'
import ValidatorDetail from '../validatorDetail'
import './index.scss'
import { updateValidators, updateAccount, updateDelegations } from 'lib/redux/actions'
import * as api from 'lib/api'
import * as sdk from 'lib/sdk'
import * as utils from 'lib/utils'

interface Props {
  validators: any[]
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateAccount: (value: any) => any
}

class App extends Component<Props> {

  componentWillMount() {
    this.updateAsyncData()
  }

  updateAsyncData = () => {
    const { updateAccount, updateDelegations, updateValidators } = this.props

    sdk.getAccounts().then(accounts => {
      const address = accounts[0]

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
      })
    })

    api.getValidators().then(updateValidators)
  }

  render() {
    return <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/validators" component={Validators} />
        <Route path="/validators/:id" component={ValidatorDetail} />
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
  updateValidators
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
