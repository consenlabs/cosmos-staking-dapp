import React, { Component } from 'react'
import './index.scss'
import { atom, uatom, thousandCommas, isExist, createTxPayload, createDelegateMsg, Toast } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validAmount } from 'lib/validator'
import { FormattedMessage } from 'react-intl'
import { pubsub } from 'lib/event'
import getNetworkConfig from '../../config/network'
import getFeeConfig from '../../config/fee'

interface Props {
  account: any
  validator: any
  history: any
}

class CMP extends Component<Props> {

  state = {
    amount: '',
  }

  componentDidMount() {
  }

  afterOpenModal() { }

  onSubmit = () => {
    const { account, validator, history } = this.props
    const { balance, address } = account
    const { amount } = this.state
    const [valid, msg] = validAmount(amount, atom(balance), getFeeConfig().retainFee)
    if (!valid) {
      return Toast.error(msg)
    }

    // send delegate apiCall
    const txPayload = createTxPayload(
      address,
      [createDelegateMsg(address, validator.operator_address, uatom(amount), getNetworkConfig().denom)],
      'delegate from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      Toast.success(txHash, { heading: '发送成功' })
      console.log(txHash)
      history.push('/')
      pubsub.emit('updateAsyncData')
    }).catch(e => {
      Toast.error(e.message, { heading: '发送失败' })
    })
  }

  onChange = (event) => {
    this.setState({ amount: event.target.value })
  }

  render() {
    const { account } = this.props
    const { balance } = account
    const { amount } = this.state
    const atomBalance = isExist(balance) ? thousandCommas(atom(balance)) : 0
    const disabled = !amount
    return (
      <div className="form-inner">
        <div className="form-header">
          <FormattedMessage
            id='available_asset'
          />
          <i>{atomBalance} ATOM</i>
        </div>
        <input
          type="number"
          placeholder="输入金额"
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

export default CMP
