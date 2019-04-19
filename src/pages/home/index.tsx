import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectValidators } from '../../lib/redux/selectors'
import './index.scss'
import { updateValidators, updateAccount, updateDelegations } from 'lib/redux/actions'
import DelegateModal from '../../components/delegateModal'
import UnDelegateModal from '../../components/undelegateModal'
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

class Page extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = {
      delegateModalVisible: false,
      undelegateModalVisible: false,
      selectedDelegation: null
    }
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

  handleUnDelegate = (delegation) => {
    this.setState({
      undelegateModalVisible: true,
      selectedDelegation: delegation,
    })
  }

  handleModalClose = () => {
    this.setState({
      delegateModalVisible: false,
      undelegateModalVisible: false,
    })
  }

  render() {
    const { delegateModalVisible, undelegateModalVisible, selectedDelegation } = this.state
    return (
      <div className="home" id="home">
        <AccountCard />
        <DelegationList onItemPress={this.handleUnDelegate} />
        {this.renderDelegateBanner()}
        <DelegateModal
          visible={delegateModalVisible}
          onRequestClose={this.handleModalClose}
          onDelegateSuccess={this.updateAsyncData}
        />
        <UnDelegateModal
          visible={undelegateModalVisible}
          selectedDelegation={selectedDelegation}
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
