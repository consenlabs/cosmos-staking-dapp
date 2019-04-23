import React, { Component } from 'react'
import './index.scss'
import { atom, uatom, thousandCommas, isExist, createTxPayload, createUnDelegateMsg, Toast } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validAmount } from 'lib/validator'
import { pubsub } from 'lib/event'
import tokenConfig from '../../config/token'

interface Props {
  account: any
  delegation: any
  validator: any
  history: any
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
    const { account, delegation, history } = this.props
    const delegateBalance = delegation.shares
    const { address } = account
    const { amount } = this.state
    const [valid, msg] = validAmount(amount, atom(delegateBalance))
    if (!valid) {
      return Toast.error(msg)
    }

    // send delegate apiCall
    const txPayload = createTxPayload(
      address,
      [createUnDelegateMsg(
        address,
        delegation.validator_address,
        uatom(amount),
        tokenConfig.denom)
      ],
      'undelegate from imToken',
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
    const { delegation } = this.props

    if (!delegation) return null

    const delegateBalance = delegation.shares
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

