import React, { Component } from 'react'
import './index.scss'
import { uatom, fAtom, createTxPayload, createUnDelegateMsg, Toast } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validUndelegate } from 'lib/validator'
import { t } from '../../lib/utils'
import { pubsub } from 'lib/event'
import getNetworkConfig from '../../config/network'
import { getFeeAmountByType } from '../../config/fee'
import msgTypes from '../../lib/msgTypes'
import logger from '../../lib/logger'

const selectLabels = ['delegated', 'rewards']

interface Props {
  account: any
  reward: any
  delegation: any
  validator: any
  history: any
}

class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      sourceObject: {
        key: selectLabels[0],
        value: props.delegation.shares,
      }
    }
  }

  getFeeAmount = () => {
    return getFeeAmountByType(msgTypes.undelegate)
  }

  onSubmit = () => {
    const { account, history, validator } = this.props
    const { address, balance } = account
    const { amount, sourceObject } = this.state
    const feeAmount = this.getFeeAmount()

    const [valid, msg] = validUndelegate(uatom(amount), sourceObject.value, feeAmount, balance)
    if (!valid) {
      return Toast.error(t(msg))
    }

    const logOpt = { validator: validator.operator_address, moniker: validator.description.moniker }
    const logKey = 'submit_undelegate'
    logger().track(logKey, logOpt)

    const msgs = [
      createUnDelegateMsg(
        address,
        validator.operator_address,
        uatom(amount),
        getNetworkConfig().denom)
    ]

    const memo = 'undelegate from imToken'

    // send delegate apiCall
    const txPayload = createTxPayload(
      address,
      msgs,
      memo,
    )

    sendTransaction(txPayload).then(txHash => {
      Toast.success(txHash, { heading: t('sent_successfully') })
      logger().track(logKey, { result: 'successful', ...logOpt })
      console.log(txHash)
      history.goBack()
      pubsub.emit('sendTxSuccess', {
        txHash,
        status: 'PENDING',
        msgType: msgs[0].type,
        value: msgs[0].value,
        fee: txPayload.fee,
        validatorId: validator.operator_address,
        timestamp: (Date.now() / 1000).toFixed(0)
      })
    }).catch(e => {
      if (e.errorCode !== 1001) {
        logger().track(logKey, { result: 'failed', message: e.message, ...logOpt })
        Toast.error(e.message, { heading: t('failed_to_send') })
      }
    })
  }

  onChange = (event) => {
    this.setState({ amount: event.target.value })
  }

  render() {
    const { amount, sourceObject } = this.state
    const disabled = !amount
    const displayAmount = fAtom(sourceObject.value, 6, '0')
    return (
      <div className="form-inner">
        <div className="form-header">
          <span>{t(sourceObject.key)}</span>
          <i>{displayAmount} ATOM</i>
        </div>
        <input
          type={'number'}
          placeholder={t('input_amount')}
          value={amount}
          onChange={this.onChange}
        />
        <div className="form-footer">
          <div>
            <span>{t('fee')}</span>
            <span>{`${fAtom(this.getFeeAmount())} ATOM`}</span>
          </div>
        </div>
        <button disabled={disabled} className="form-button" onClick={this.onSubmit}>
          <span>{t('withdraw')}</span>
        </button>
        {this.renderNotes()}
      </div>
    )
  }

  renderNotes = () => {
    return (
      <div className="delegation-notes">
        <p className="item-title">{t('state')}</p>
        <p className="item-desc">{t('undelegate_state')}</p>
      </div>
    )
  }
}

export default CMP

