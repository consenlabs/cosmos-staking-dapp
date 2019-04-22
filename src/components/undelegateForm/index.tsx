import React, { Component } from 'react'
import './index.scss'
import { atom, uatom, thousandCommas, isExist, createTxPayload, createUnDelegateMsg } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validAmount } from 'lib/validator'
import tokenConfig from '../../config/token'

interface Props {
  account: any
  delegations: any
}

class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      selectedDelegation: props.delegations[0]
    }
  }


  componentDidMount() {
  }

  afterOpenModal() { }

  onSubmit = () => {
    const { account } = this.props
    // TODO: handle select
    const { selectedDelegation } = this.state
    const delegateBalance = selectedDelegation.shares
    const { address } = account
    const { amount } = this.state
    const [valid, msg] = validAmount(amount, atom(delegateBalance))
    if (!valid) {
      return alert(msg)
    }

    // send delegate apiCall
    const txPayload = createTxPayload(
      address,
      [createUnDelegateMsg(
        address,
        selectedDelegation.validator_address,
        uatom(amount),
        tokenConfig.denom)
      ],
      'undelegate from imToken',
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
    const { selectedDelegation } = this.state

    if (!selectedDelegation) return null

    const delegateBalance = selectedDelegation.shares
    const { amount } = this.state
    const atomBalance = isExist(delegateBalance) ? thousandCommas(atom(delegateBalance)) : 0
    const disabled = !amount
    return (
      <div className="form-inner">
        <div className="form-header">
          <span>已抵押</span>
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
        <button disabled={disabled} className="form-button" onClick={this.onSubmit}>取消委托</button>
      </div>
    )
  }
}

export default CMP

