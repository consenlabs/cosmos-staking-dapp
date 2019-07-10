import React, { Component } from 'react'
import './index.scss'
import { uatom, fAtom, createWithdrawMsg, createTxPayload, createUnDelegateMsg, Toast, toBN, isiPhoneX } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validUndelegate } from 'lib/validator'
import { t } from '../../lib/utils'
import { pubsub } from 'lib/event'
import Modal from '../../components/modal'
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
      modalVisible: false,
      sourceType: 0,
      sourceObject: {
        key: selectLabels[0],
        value: props.delegation.shares,
      }
    }
  }

  renderSelectorModal = () => {
    const { modalVisible } = this.state

    return <Modal
      isOpen={modalVisible}
      contentLabel="Delegate Modal"
      onRequestClose={this.hideDelegateSourceModal}
      appElement={document.body}
    >
      {this.renderTypeSelector()}
    </Modal>
  }

  renderTypeSelector = () => {

    const { reward, delegation } = this.props

    return <div className="modal-inner type-selector" style={{ paddingBottom: isiPhoneX() ? '20px' : '0' }}>
      <header>{t('select_funds_type')}</header>
      <ul className="delegate-type-list">
        <li onClick={() => this.selectType(0)}>
          <div>
            <label>{t(selectLabels[0])}</label>
            <span>{fAtom(delegation.shares, 6, '0')} ATOM</span>
          </div>
        </li>
        <li onClick={() => this.selectType(1)}>
          <div>
            <label>{t(selectLabels[1])}</label>
            <span>{fAtom(reward, 6, '0')} ATOM</span>
          </div>
        </li>
      </ul>
      <div className="split-margin"></div>
      <footer onClick={this.hideDelegateSourceModal}>{t('cancel')}</footer>
    </div>
  }

  getFeeAmount = () => {
    const { sourceType } = this.state
    switch (sourceType) {
      case 0:
        return getFeeAmountByType(msgTypes.undelegate)
      case 1:
        return getFeeAmountByType(msgTypes.withdraw)
      default:
        return getFeeAmountByType(msgTypes.redelegate)
    }
  }

  onSubmit = () => {
    const { account, history, validator } = this.props
    const { address, balance } = account
    const { amount, sourceObject, sourceType } = this.state
    const feeAmount = this.getFeeAmount()

    if (sourceType === 0) {
      const [valid, msg] = validUndelegate(uatom(amount), sourceObject.value, feeAmount, balance)
      if (!valid) {
        return Toast.error(t(msg))
      }
    } else {
      // validate balance >= fee
      if (toBN(balance).lt(feeAmount)) {
        return Toast.error(t('fee_not_enough'))
      }
    }


    const logOpt = { validator: validator.operator_address, moniker: validator.description.moniker }
    const logKey = sourceType === 0 ? 'submit_undelegate' : 'submit_withdraw'
    logger().track(logKey, logOpt)

    let msgs: any = null

    switch (sourceType) {
      case 0:
        msgs = [
          createUnDelegateMsg(
            address,
            validator.operator_address,
            uatom(amount),
            getNetworkConfig().denom)
        ]
        break
      case 1:
        msgs = [
          createWithdrawMsg(
            address,
            validator.operator_address,
          ),
        ]
        break
      default:
    }

    const memo = [
      'undelegate from imToken',
      'withdraw from imToken',
    ][sourceType]

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

  showDelegateSourceModal = () => {
    this.setState({ modalVisible: true })
  }

  hideDelegateSourceModal = () => {
    this.setState({ modalVisible: false })
  }

  selectType = (index) => {
    const { delegation, reward } = this.props
    switch (index) {
      case 0:
        this.setState({
          sourceType: index,
          sourceObject: {
            key: selectLabels[index],
            value: delegation.shares
          },
          modalVisible: false,
        })
        break;
      case 1:
        this.setState({
          sourceType: index,
          sourceObject: {
            key: selectLabels[index],
            value: reward
          },
          modalVisible: false,
        })
        break;
      default:
        return
    }
  }

  render() {
    const { amount, sourceObject, sourceType } = this.state
    const isWithdraw = sourceType === 1
    const cantWithdraw = !sourceObject.value || !toBN(sourceObject.value).gt(0)
    const disabled = isWithdraw ? cantWithdraw : !amount
    const displayAmount = fAtom(sourceObject.value, 6, '0')
    return (
      <div className="form-inner">
        <div className="form-header">
          <span>{t(sourceObject.key)}</span>
          <i>{displayAmount} ATOM</i>
        </div>
        {!isWithdraw &&
          <input
            type={isWithdraw ? 'text' : 'number'}
            placeholder={t('input_amount')}
            value={amount}
            disabled={isWithdraw}
            onChange={this.onChange}
          />
        }
        <div className="form-footer">
          <div>
            <span>{t('fee')}</span>
            <span>{`${fAtom(this.getFeeAmount())} ATOM`}</span>
          </div>
        </div>
        <button disabled={disabled} className="form-button" onClick={this.onSubmit}>
          <span>{t(isWithdraw ? 'withdraw_all' : 'withdraw')}</span>
        </button>
        {this.renderNotes()}
        {this.renderSelectorModal()}
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

