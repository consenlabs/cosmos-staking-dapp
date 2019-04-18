import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectAccountInfo } from '../../lib/redux/selectors'
import './index.scss'
import { updateAccount } from 'lib/redux/actions'
import mockAccount from '../../mocks/account'
// import * as sdk from '../../lib/sdk'

interface Props {
  account: any
  updateAccount: Function
}


class CMP extends Component<Props> {

  componentDidMount() {
    // sdk.getAccounts().then(accounts => {
    //   this.props.updateAccount({ address: accounts[0] })
    // })
    this.props.updateAccount(mockAccount)
  }

  render() {
    const { account } = this.props
    return (
      <div className="account-card">
        <div className="account-top">
          <div className="account-top-address">
            <strong>Cosmos Wallet</strong>
            <span>{account.address}</span>
          </div>
          <div className="account-top-amount">
            <strong>{account.balance}</strong>
            <span>¥1,048.50</span>
          </div>
        </div>
        <div className="account-bottom">
          <div>
            <div>
              <span>可用余额</span>
              <i>{account.balance}</i>
            </div>
            <div>
              <span>收益</span>
              <i>{account.rewardBalance}</i>
            </div>
          </div>
          <div className="split-line"></div>
          <div>
            <div>
              <span>委托</span>
              <i>{account.delegateBalance}</i>
            </div>
            <div>
              <span>赎回中</span>
              <i>{account.refundingBalance}</i>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: selectAccountInfo(state),
  }
}

const mapDispatchToProps = {
  updateAccount,
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
