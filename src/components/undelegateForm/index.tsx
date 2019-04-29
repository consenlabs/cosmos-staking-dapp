import React, { Component } from 'react'
import './index.scss'
import { uatom, fAtom, isExist, createTxPayload, createUnDelegateMsg, Toast } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validUndelegate } from 'lib/validator'
import { pubsub } from 'lib/event'
import { FormattedMessage, injectIntl } from 'react-intl'
import getNetworkConfig from '../../config/network'
import { feeAmount } from '../../config/fee'
import logger from '../../lib/logger'

interface Props {
  account: any
  delegation: any
  validator: any
  history: any
  intl: any
}

class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = {
      amount: '',
    }
  }


  componentDidMount() {
  }


  onSubmit = () => {
    const { account, delegation = {}, history, intl, validator } = this.props
    const delegateBalance = delegation.shares || 0
    const { address, balance } = account
    const { amount } = this.state
    const [valid, msg] = validUndelegate(uatom(amount), delegateBalance, feeAmount, balance)
    if (!valid) {
      return Toast.error(intl.formatMessage({ id: msg }))
    }

    const logOpt = { validator: validator.operator_address, moniker: validator.description.moniker }
    logger().track('submit_undelegate', logOpt)

    // send delegate apiCall
    const txPayload = createTxPayload(
      address,
      [createUnDelegateMsg(
        address,
        delegation.validator_address,
        uatom(amount),
        getNetworkConfig().denom)
      ],
      'undelegate from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      Toast.success(txHash, { heading: intl.formatMessage({ id: 'sent_successfully' }) })
      logger().track('submit_undelegate', { result: 'successful', ...logOpt })
      console.log(txHash)
      history.goBack()
      pubsub.emit('updateAsyncData')
    }).catch(e => {
      logger().track('submit_undelegate', { result: 'failed', message: e.message, ...logOpt })
      Toast.error(e.message, { heading: intl.formatMessage({ id: 'failed_to_send' }) })
    })
  }

  onChange = (event) => {
    this.setState({ amount: event.target.value })
  }

  render() {
    const { delegation = {}, intl } = this.props

    const delegateBalance = delegation.shares
    const { amount } = this.state
    const atomBalance = isExist(delegateBalance) ? fAtom(delegateBalance) : 0
    const disabled = !amount
    return (
      <div className="form-inner">
        <div className="form-header">
          <FormattedMessage
            id='delegated'
          />
          <i>{atomBalance} ATOM</i>
        </div>
        <input
          type="number"
          placeholder={intl.formatMessage({ id: 'input_amount' })}
          value={amount}
          onChange={this.onChange}
          max={atomBalance}
          min={0.000001}
        />
        <div className="form-footer">
          <FormattedMessage
            id='fee'
          />
          <span>{`${fAtom(feeAmount)} ATOM`}</span>
        </div>
        <button disabled={disabled} className="form-button" onClick={this.onSubmit}>
          <FormattedMessage
            id='undelegate'
          />
        </button>
      </div>
    )
  }
}

export default injectIntl(CMP)

