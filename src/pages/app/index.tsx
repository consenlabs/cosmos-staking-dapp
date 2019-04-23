import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connect } from "react-redux"
import { selectValidators } from '../../lib/redux/selectors'
import Home from '../home'
import Validators from '../validators'
import ValidatorDetail from '../validatorDetail'
import Delegate from '../delegate'
import UnDelegate from '../undelegate'
import './index.scss'
import { updateValidators, updateAccount, updateDelegations, updatePool, updateLanguage } from 'lib/redux/actions'
import * as api from 'lib/api'
import * as sdk from 'lib/sdk'
import * as utils from 'lib/utils'

interface Props {
  validators: any[]
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateAccount: (value: any) => any
  updatePool: (value: any) => any
  updateLanguage: (value: any) => any
}


function parseSearch(str) {
  if(str == undefined) return
    str = str.substr(1)
    var arr = str.split("&"),
        obj = {},
        newArr = []
    arr.map((value) => {
      newArr = value.split("=")
      if(newArr[0] != undefined) {
        obj[newArr[0]] = newArr[1]
      }
    })
  return obj
}

class App extends Component<Props> {

  componentWillMount() {
    this.updateAsyncData()
  }

  updateAsyncData = () => {
    const { updateAccount, updateDelegations, updateValidators, updatePool, updateLanguage } = this.props

    const searchObj = parseSearch(window.location.search) as any
    if (searchObj.locale) {
      updateLanguage(searchObj.locale || 'en-US')
    }

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

    api.getStakePool().then(pool => {
      console.log(pool)
      updatePool(pool)
    })

    api.getValidators().then(updateValidators)
  }

  render() {
    return <BrowserRouter basename="/cosmos">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/validators" component={Validators} />
        <Route path="/validator/:id" component={ValidatorDetail} />
        <Route path="/delegate/:id" component={Delegate} />
        <Route path="/undelegate/:id" component={UnDelegate} />
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
  updateLanguage,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
