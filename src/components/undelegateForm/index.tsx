import React, { Component } from 'react'
import './index.scss'
import { uatom, fAtom, createWithdrawMsg, createTxPayload, createUnDelegateMsg, Toast } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validUndelegate } from 'lib/validator'
import { pubsub } from 'lib/event'
import { FormattedMessage, injectIntl } from 'react-intl'
import Modal from 'react-modal'
import getNetworkConfig from '../../config/network'
import { feeAmount } from '../../config/fee'
import logger from '../../lib/logger'

const customStyles = {
  content: {
    top: 'auto',
    left: '0',
    right: '0',
    bottom: '-8px',
    borderRadius: '8px',
    padding: '0'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
};

const selectLabels = ['delegated', 'rewards']

interface Props {
  account: any
  reward: any
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
      style={customStyles}
      contentLabel="Delegate Modal"
      onRequestClose={this.hideDelegateSourceModal}
      appElement={document.body}
    >
      {this.renderTypeSelector()}
    </Modal>
  }

  renderTypeSelector = () => {

    const { intl, reward, delegation } = this.props
    const { sourceType } = this.state

    return <div className="modal-inner type-selector">
      <header>{intl.formatMessage({ id: 'select_funds_type' })}</header>
      <ul className="delegate-type-list">
        <li onClick={() => this.selectType(0)}>
          <div>
            <label>{intl.formatMessage({ id: selectLabels[0] })}</label>
            <span>{fAtom(delegation.shares, 6, '0')} ATOM</span>
          </div>
          {sourceType === 0 && <b>✓</b>}
        </li>
        <li onClick={() => this.selectType(1)}>
          <div>
            <label>{intl.formatMessage({ id: selectLabels[1] })}</label>
            <span>{fAtom(reward, 6, '0')} ATOM</span>
          </div>
          {sourceType === 1 && <b>✓</b>}
        </li>
      </ul>
      <div className="split-margin"></div>
      <footer>{intl.formatMessage({ id: 'cancel' })}</footer>
    </div>
  }



  onSubmit = () => {
    const { account, history, intl, validator } = this.props
    const { address, balance } = account
    const { amount, sourceObject, sourceType } = this.state
    const [valid, msg] = validUndelegate(uatom(amount), sourceObject.value, feeAmount, balance)
    if (!valid) {
      return Toast.error(intl.formatMessage({ id: msg }))
    }

    const logOpt = { validator: validator.operator_address, moniker: validator.description.moniker }
    logger().track('submit_undelegate', logOpt)

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
            uatom(amount),
            getNetworkConfig().denom),
        ]
      default:
    }

    const memo = [
      'undelegate from imToken',
      'withdraw from imToken',
      'redelegate from imToken',
    ][sourceType]

    // send delegate apiCall
    const txPayload = createTxPayload(
      address,
      msgs,
      memo,
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
    const { intl } = this.props
    const { amount, sourceObject } = this.state

    const disabled = !amount
    return (
      <div className="form-inner">
        <div className="form-header" onClick={this.showDelegateSourceModal}>
          <FormattedMessage id={sourceObject.key} />
          <i>{fAtom(sourceObject.value, 6, '0')} ATOM</i>
          <b></b>
        </div>
        <input
          type="number"
          placeholder={intl.formatMessage({ id: 'input_amount' })}
          value={amount}
          onChange={this.onChange}
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
        {this.renderSelectorModal()}
      </div>
    )
  }
}

export default injectIntl(CMP)

