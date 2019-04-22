import React, { Component } from 'react'
import './index.scss'
import { atom, uatom, thousandCommas, isExist, createTxPayload, createDelegateMsg } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validAmount } from 'lib/validator'
import tokenConfig from '../../config/token'
import feeConfig from '../../config/fee'

interface Props {
  account: any
  validator: any
}

class CMP extends Component<Props> {

  state = {
    amount: '',
  }

  componentDidMount() {
  }

  afterOpenModal() { }

  onSubmit = () => {
    const { account, validator } = this.props
    const { balance, address } = account
    const { amount } = this.state
    const [valid, msg] = validAmount(amount, atom(balance), feeConfig.retainFee)
    if (!valid) {
      return alert(msg)
    }

    // send delegate apiCall
    const txPayload = createTxPayload(
      address,
      [createDelegateMsg(address, validator.operator_address, uatom(amount), tokenConfig.denom)],
      'delegate from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      alert('发送成功: ' + txHash)
      console.log(txHash)
    }).catch(e => {
      alert('发送失败: ' + e.message)
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
          <span>可用余额</span>
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
        <button disabled={disabled} className="form-button" onClick={this.onSubmit}>委托</button>
      </div>
    )
  }
}

export default CMP
