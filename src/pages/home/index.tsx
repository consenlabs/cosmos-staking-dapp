import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectValidators } from '../../lib/redux/selectors'
import './index.scss'
import { updateValidators, updateAccount, updateDelegations } from 'lib/redux/actions'
import DelegateModal from '../../components/delegateModal'
import AccountCard from '../../components/accountCard'
import DelegationList from '../../components/delegationList'
import * as api from 'lib/api'
import * as sdk from 'lib/sdk'
import * as utils from 'lib/utils'

interface Props {
  validators: any[]
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateAccount: (value: any) => any
}

class Page extends Component<Props> {

  constructor(props) {
    super(props)
  }

  state = {
    delegateModalVisible: false,
  }

  componentWillMount() {
    this.updateAsyncData()
  }

  componentDidMount() { }

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

  renderDelegateBanner() {
    return <div className="banner">
      <div onClick={this.handleDelegate}>
        <img src="/images/banner.png" alt="staking" />
      </div>
    </div>
  }

  handleDelegate = () => {
    this.setState({
      delegateModalVisible: true,
    })
  }

  handleModalClose = () => {
    this.setState({
      delegateModalVisible: false,
    })
  }

  render() {
    const { delegateModalVisible } = this.state
    return (
      <div className="home" id="home">
        <AccountCard />
        <DelegationList />
        {this.renderDelegateBanner()}
        <DelegateModal
          visible={delegateModalVisible}
          onRequestClose={this.handleModalClose}
          onDelegateSuccess={this.updateAsyncData}
        />
      </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Page)
