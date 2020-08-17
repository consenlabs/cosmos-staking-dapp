import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectAccountInfo, selectPrice } from '../../lib/redux/selectors'
import './index.scss'
import AccountRewardBar from '../accountRewardBar'
import { toBN, fAtom, ellipsis, isExist, t } from 'lib/utils'

interface Props {
  account: any
  price: any
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {
    const { account, price = {} } = this.props
    const { address, balance, rewardBalance, refundingBalance, delegateBalance } = account
    const atomPrice = price.price || 0
    const currency = price.currency === 'CNY' ? '¥' : '$'
    const totalBalance = toBN(balance || 0).plus(rewardBalance || 0).plus(refundingBalance || 0).plus(delegateBalance || 0).toFixed()

    return (
      <div className="account-card">
        <div className="account-top">
          <div className="account-top-address">
            <strong>Cosmos Wallet</strong>
            {address ? (
              <span>{ellipsis(address)}</span>
            ) : (
                <span>{t('accessing_account')}</span>
              )}
          </div>
          <div className="account-top-amount">
            <strong>{isExist(balance) ? `${fAtom(totalBalance)} ATOM` : '~'}</strong>
            <span>{currency} {isExist(balance) ? fAtom(toBN(totalBalance).times(atomPrice).toFixed()) : '~'}</span>
          </div>
        </div>
        <div className="account-bottom">
          <div className="account-balance">
            <div>
              <div>
                <span>{t('available_balance')}</span>
                <i>{fAtom(balance)}</i>
              </div>
              <div>
                <span>{t('delegations')}</span>
                <i>{fAtom(delegateBalance)}</i>
              </div>
            </div>
            <div className="split-line"></div>
            <div>
              <div>
                <span>{t('rewards')}</span>
                <i>{fAtom(rewardBalance)}</i>
              </div>
              <div>
                <span>{t('undelegating')}</span>
                <i>{fAtom(refundingBalance)}</i>
              </div>
            </div>
          </div>
          <AccountRewardBar />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: selectAccountInfo(state),
    price: selectPrice(state),
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
