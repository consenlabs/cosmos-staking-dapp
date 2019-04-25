import React, { Component } from 'react'
import './index.scss'
import { uatom, fAtom, isExist, createTxPayload, createDelegateMsg, Toast } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validDelegate } from 'lib/validator'
import { FormattedMessage, injectIntl } from 'react-intl'
import { pubsub } from 'lib/event'
import getNetworkConfig from '../../config/network'
import { feeAmount } from '../../config/fee'
import logger from '../../lib/logger'

interface Props {
  account: any
  validator: any
  history: any
  intl: any
}

class CMP extends Component<Props> {

  state = {
    amount: '',
  }

  componentDidMount() {
  }

  afterOpenModal() { }

  onSubmit = () => {
    const { account, validator, history, intl } = this.props
    const { balance, address } = account
    const { amount } = this.state
    const [valid, msg] = validDelegate(uatom(amount), balance, feeAmount)
    if (!valid) {
      return Toast.error(intl.formatMessage({ id: msg }))
    }

    logger().track('submit_delegate')

    // send delegate apiCall
    const txPayload = createTxPayload(
      address,
      [createDelegateMsg(address, validator.operator_address, uatom(amount), getNetworkConfig().denom)],
      'delegate from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      Toast.success(txHash, { heading: intl.formatMessage({ id: 'sent_successfully' }) })
      logger().track('submit_delegate', { result: 'successful' })
      console.log(txHash)
      history.goBack()
      pubsub.emit('updateAsyncData')
    }).catch(e => {
      logger().track('submit_delegate', { result: 'failed', message: e.message })
      Toast.error(e.message, { heading: intl.formatMessage({ id: 'failed_to_send' }) })
    })
  }

  onChange = (event) => {
    this.setState({ amount: event.target.value })
  }

  render() {
    const { account, intl } = this.props
    const { balance } = account
    const { amount } = this.state
    const atomBalance = isExist(balance) ? fAtom(balance) : 0
    const disabled = !amount
    return (
      <div className="form-inner">
        <div className="form-header">
          <FormattedMessage
            id='available_balance'
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
        <button disabled={disabled} className="form-button" onClick={this.onSubmit}>
          <FormattedMessage
            id='delegate'
          />
        </button>
      </div>
    )
  }
}

export default injectIntl(CMP)
