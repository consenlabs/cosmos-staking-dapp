import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectAccountInfo } from '../../lib/redux/selectors'
import './index.scss'
import { toBN, atom, thousandCommas, ellipsis, isExist } from 'lib/utils'

interface Props {
  account: any
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {
    const { account } = this.props
    const { address, balance, rewardBalance, refundingBalance, delegateBalance } = account
    const atomPrice = 30

    return (
      <div className="account-card">
        <div className="account-top">
          <div className="account-top-address">
            <strong>Cosmos Wallet</strong>
            <span>{ellipsis(address || '获取账号中...', 24)}</span>
          </div>
          <div className="account-top-amount">
            <strong>{isExist(balance) ? thousandCommas(atom(balance)) : '~'}</strong>
            <span>¥ {isExist(balance) ? thousandCommas(toBN(atom(balance)).times(atomPrice).toString()) : '~'}</span>
          </div>
        </div>
        <div className="account-bottom">
          <div>
            <div>
              <span>可用余额</span>
              <i>{isExist(balance) ? thousandCommas(atom(balance)) : '~'}</i>
            </div>
            <div>
              <span>收益</span>
              <i>{isExist(rewardBalance) ? thousandCommas(atom(rewardBalance)) : '~'}</i>
            </div>
          </div>
          <div className="split-line"></div>
          <div>
            <div>
              <span>委托</span>
              <i>{isExist(delegateBalance) ? thousandCommas(atom(delegateBalance)) : '~'}</i>
            </div>
            <div>
              <span>赎回中</span>
              <i>{isExist(refundingBalance) ? thousandCommas(atom(refundingBalance)) : '~'}</i>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
