import React, { Component } from 'react'
import { connect } from "react-redux"
import { injectIntl, FormattedMessage } from 'react-intl'
import { selectAccountInfo, selectPrice } from '../../lib/redux/selectors'
import './index.scss'
import { toBN, atom, thousandCommas, ellipsis, isExist } from 'lib/utils'

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

    return (
      <div className="account-card">
        <div className="account-top">
          <div className="account-top-address">
            <strong>Cosmos Wallet</strong>
            {address ? (
              <span>{ellipsis(address, 24)}</span>
            ) : (
              <FormattedMessage
                id='accessing_account'
              />
            )}
          </div>
          <div className="account-top-amount">
            <strong>{isExist(balance) ? thousandCommas(atom(balance)) : '~'}</strong>
            <span>{currency} {isExist(balance) ? thousandCommas(toBN(atom(balance)).times(atomPrice).toString()) : '~'}</span>
          </div>
        </div>
        <div className="account-bottom">
          <div>
            <div>
              <FormattedMessage
                id='available_asset'
              />
              <i>{isExist(balance) ? thousandCommas(atom(balance)) : '~'}</i>
            </div>
            <div>
              <FormattedMessage
                id='earnings'
              />
              <i>{isExist(rewardBalance) ? thousandCommas(atom(rewardBalance)) : '~'}</i>
            </div>
          </div>
          <div className="split-line"></div>
          <div>
            <div>
              <FormattedMessage
                id='delegation'
              />
              <i>{isExist(delegateBalance) ? thousandCommas(atom(delegateBalance)) : '~'}</i>
            </div>
            <div>
              <FormattedMessage
                id='unstaking'
              />
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
    price: selectPrice(state),
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CMP))
