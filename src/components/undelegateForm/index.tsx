import React, { Component } from 'react'
import './index.scss'
import { atom, uatom, thousandCommas, isExist, createTxPayload, createUnDelegateMsg, Toast } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validAmount } from 'lib/validator'
import { pubsub } from 'lib/event'
import { FormattedMessage, injectIntl } from 'react-intl'
import getNetworkConfig from '../../config/network'

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
    const { account, delegation, history, intl } = this.props
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
        getNetworkConfig().denom)
      ],
      'undelegate from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      Toast.success(txHash, { heading: intl.formatMessage({ id: 'sent_successfully' }) })
      console.log(txHash)
      history.push('/')
      pubsub.emit('updateAsyncData')
    }).catch(e => {
      Toast.error(e.message, { heading: intl.formatMessage({ id: 'failed_to_send' }) })
    })
  }

  onChange = (event) => {
    this.setState({ amount: event.target.value })
  }

  renderEmpty() {
    return <div className="form-inner">
      <div className="form-empty">
        <FormattedMessage
          id='without_delegation_couldnt_unstake'
        />
      </div>
    </div>
  }

  render() {
    const { delegation, intl } = this.props

    if (!delegation) return this.renderEmpty()

    const delegateBalance = delegation.shares
    const { amount } = this.state
    const atomBalance = isExist(delegateBalance) ? thousandCommas(atom(delegateBalance)) : 0
    const disabled = !amount
    return (
      <div className="form-inner">
        <div className="form-header">
          <FormattedMessage
            id='staked'
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
            id='cancel_delegate'
          />
        </button>
      </div>
    )
  }
}

export default injectIntl(CMP)

