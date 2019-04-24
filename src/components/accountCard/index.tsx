import React, { Component } from 'react'
import { connect } from "react-redux"
import { injectIntl, FormattedMessage } from 'react-intl'
import { selectAccountInfo, selectPrice } from '../../lib/redux/selectors'
import './index.scss'
import { toBN, fAtom, ellipsis, isExist } from 'lib/utils'

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
    const totalBalance = toBN(balance || 0).plus(rewardBalance || 0).plus(refundingBalance || 0).plus(delegateBalance || 0).toString()

    return (
      <div className="account-card">
        <div className="account-top">
          <div className="account-top-address">
            <strong>Cosmos Wallet</strong>
            {address ? (
              <span>{ellipsis(address, 16)}</span>
            ) : (
                <FormattedMessage
                  id='accessing_account'
                />
              )}
          </div>
          <div className="account-top-amount">
            <strong>{isExist(balance) ? `${fAtom(totalBalance)} ATOM` : '~'}</strong>
            <span>{currency} {isExist(balance) ? fAtom(toBN(totalBalance).times(atomPrice).toString()) : '~'}</span>
          </div>
        </div>
        <div className="account-bottom">
          <div>
            <div>
              <FormattedMessage
                id='available_balance'
              />
              <i>{fAtom(balance)}</i>
            </div>
            <div>
              <FormattedMessage
                id='delegations'
              />
              <i>{fAtom(delegateBalance)}</i>
            </div>
          </div>
          <div className="split-line"></div>
          <div>
            <div>
              <FormattedMessage
                id='rewards'
              />
              <i>{fAtom(rewardBalance)}</i>
            </div>
            <div>
              <FormattedMessage
                id='undelegating'
              />
              <i>{fAtom(refundingBalance)}</i>
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
