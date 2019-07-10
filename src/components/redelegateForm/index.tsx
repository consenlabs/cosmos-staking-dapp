import React, { Component } from 'react'
import './index.scss'
import { uatom, fAtom, createTxPayload, createRedelegateMsg, Toast } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validDelegate } from 'lib/validator'
import { t, ellipsis } from 'lib/utils'
import { pubsub } from 'lib/event'
import getNetworkConfig from '../../config/network'
import { getFeeAmountByType } from '../../config/fee'
import msgTypes from '../../lib/msgTypes'
import logger from '../../lib/logger'

interface Props {
  reward: any
  account: any
  validator: any
  validators: any
  delegations: any
  redelegations: any
  history: any
  exchangeToken: any
  location?: any
}

class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    const { delegations, validator } = props
    const d = delegations.find(d => d.validator_address === validator.operator_address)
    this.state = {
      amount: '',
      modalVisible: false,
      selectingDelegation: false,
      sourceType: 0,
      sourceObject: {
        value: d.shares,
      },
    }
  }

  componentDidMount() {
    this.handleSelectValidator()
  }

  render() {
    const { amount, sourceObject } = this.state
    const disabled = !amount || !sourceObject.key
    return (
      <div className="form-inner">
        <div className="form-header">
          <span>{t('available_balance')}</span>
          <i>{fAtom(sourceObject.value, 6, '0')} ATOM</i>
        </div>
        <input
          type="number"
          placeholder={t('input_amount')}
          value={amount}
          onChange={this.onChange}
        />
        {this.renderSwitchValidator()}
        <div className="form-footer">
          <div>
            <span>{t('fee')}</span>
            <span className="fee">{`${fAtom(this.getFeeAmount())} ATOM`}</span>
          </div>
        </div>
        <button disabled={disabled} className="form-button" onClick={this.onSubmit}>
          <span>{t('redelegate')}</span>
        </button>
      </div>
    )
  }

  renderSwitchValidator() {
    const { sourceObject } = this.state
    const key = sourceObject.key

    return (
      <div className="select-validator" onClick={this.handleSelect}>
        {
          key ? <span>{t(key)} <span>{ellipsis(sourceObject.validator_src_address)}</span></span> :
          <span>{t('select_validator')}</span>
        }
        <b></b>
      </div>
    )
  }

  getFeeAmount = () => {
    return getFeeAmountByType(msgTypes.redelegate)
  }

  handleSelect = () => {
    const { history, validator, redelegations } = this.props
    const { amount } = this.state
    const redelegation = redelegations.find(r => r.validator_dst_address === validator.operator_address)
    if (redelegation && Array.isArray(redelegation.entries)) {
      // if completion_time is later than now, can't redelegate
      if (redelegation.entries.some(e => new Date(e.completion_time).getTime() > new Date().getTime())) {
        Toast.warn(t('redelegate_incompletion'), { hideAfter: 5 })
        return
      }
    }
    const url = `/select-validator/${validator.operator_address}?amount=${amount}`
    history.push(url)
  }

  onSubmit = () => {
    const { account, validator, history } = this.props
    const { amount, sourceObject } = this.state
    const { address } = account
    const isRedelegate = true
    const [valid, msg] = validDelegate(uatom(amount), sourceObject.value, this.getFeeAmount(), isRedelegate, account.balance)
    if (!valid) {
      return Toast.error(t(msg))
    }

    const distAddress = sourceObject.validator_src_address
    const state = history.location.state
    const from = (state && state.from) ? state.from : 'detail'
    const logOpt = { validator: validator.operator_address, moniker: validator.description.moniker, from, distValidator: distAddress }
    const logKey = 'submit_redelegate'
    logger().track(logKey, logOpt)
    const msgs = [
      createRedelegateMsg(
        address,
        validator.operator_address,
        distAddress,
        uatom(amount),
        getNetworkConfig().denom)
    ]
    // send delegate apiCall
    const memo = 'redelegate from imToken'

    const txPayload = createTxPayload(
      address,
      msgs,
      memo,
    )

    sendTransaction(txPayload).then(txHash => {
      logger().track(logKey, { result: 'successful', ...logOpt })
      console.log(txHash)

      pubsub.emit('sendTxSuccess', {
        txHash,
        status: 'PENDING',
        msgType: msgs[0].type,
        value: msgs[0].value,
        fee: txPayload.fee,
        validatorId: validator.operator_address,
        timestamp: (Date.now() / 1000).toFixed(0)
      })
      Toast.success(txHash, { heading: t('sent_successfully') })
      history.goBack()
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

  handleSelectValidator = () => {
    const { location, validators } = this.props

    if (!location) return

    const params = new URLSearchParams(location.search) as any
    const selectedValidatorAddress = params.get('selected')
    const amount = params.get('amount')

    if (selectedValidatorAddress) {
      const validator = validators.find(v => v.operator_address === selectedValidatorAddress)
      this.setState({
        sourceObject: {
          key: validator.description.moniker,
          validator_src_address: validator.operator_address,
          value: this.state.sourceObject.value,
        },
      })
    }

    if (amount) {
      this.setState({ amount })
    }
  }
}



export default CMP
