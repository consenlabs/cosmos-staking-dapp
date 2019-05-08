import React, { Component } from 'react'
import './index.scss'
import { uatom, fAtom, createTxPayload, createDelegateMsg, createWithdrawMsg, createRedelegateMsg, Toast, isiPhoneX } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validDelegate } from 'lib/validator'
import { FormattedMessage, injectIntl } from 'react-intl'
import Modal from '../../components/modal'
import { pubsub } from 'lib/event'
import ValidatorLogo from '../../components/validatorLogo'
import getNetworkConfig from '../../config/network'
import { getFeeAmountByType } from '../../config/fee'
import msgTypes from '../../lib/msgTypes'
import logger from '../../lib/logger'
import modalBackSVG from '../../assets/modal-back.svg'

const selectLabels = ['available_balance', 'rewards', 'other_delegations']

interface Props {
  reward: any
  account: any
  validator: any
  validators: any
  delegations: any
  redelegations: any
  history: any
  intl: any
}

class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      modalVisible: false,
      selectingDelegation: false,
      sourceType: 0,
      sourceObject: {
        key: selectLabels[0],
        value: props.account.balance,
      }
    }
  }

  renderSelectorModal = () => {
    const { modalVisible, selectingDelegation } = this.state

    return <Modal
      isOpen={modalVisible}
      contentLabel="Delegate Modal"
      onRequestClose={this.hideDelegateSourceModal}
      appElement={document.body}
    >
      {!selectingDelegation ? this.renderTypeSelector() : this.renderDelegations()}
    </Modal>
  }

  backModal = () => {
    this.setState({ selectingDelegation: false })
  }

  renderTypeSelector = () => {

    const { account, delegations, validator, intl } = this.props
    const _delegations = delegations.filter(d => d.validator_address !== validator.operator_address)
    const hasDelegation = _delegations && _delegations.length > 0

    return <div className="modal-inner type-selector" style={{ paddingBottom: isiPhoneX() ? '20px' : '0' }}>
      <header>{intl.formatMessage({ id: 'select_funds_type' })}</header>
      <ul className="delegate-type-list">
        <li onClick={() => this.selectType(0)}>
          <div>
            <label>{intl.formatMessage({ id: selectLabels[0] })}</label>
            <span>{fAtom(account.balance)} ATOM</span>
          </div>
        </li>
        {/* <li onClick={() => this.selectType(1)}>
          <div>
            <label>{intl.formatMessage({ id: selectLabels[1] })}</label>
            <span>{fAtom(reward, 6, '0')} ATOM</span>
          </div>
          {sourceType === 1 && <b>✓</b>}
        </li> */}
        <li onClick={hasDelegation ? () => this.selectType(2) : () => { }}>
          <div>
            <label>{intl.formatMessage({ id: selectLabels[2] })}</label>
          </div>
          {hasDelegation ? <em>{intl.formatMessage({ id: 'change' })}<i></i></em> : <em>{intl.formatMessage({ id: 'none' })}</em>}

        </li>
      </ul>
      <div className="split-margin"></div>
      <footer onClick={this.hideDelegateSourceModal}>{intl.formatMessage({ id: 'cancel' })}</footer>
    </div>
  }

  renderDelegations = () => {
    const { delegations, validators, intl, validator, redelegations } = this.props
    let _delegations = delegations.filter(d => d.validator_address !== validator.operator_address)

    _delegations = _delegations.slice(0).map(d => {
      const redelegation = redelegations.find(r => r.validator_dst_address === d.validator_address)
      if (redelegation && Array.isArray(redelegation.entries)) {
        if (redelegation.entries.some(e => {
          // if completion_time is later than now, can't redelegate
          return new Date(e.completion_time).getTime() > new Date().getTime()
        })) {
          d.incompletion = true
        }
      }
      return d
    })

    return <div className="modal-inner type-selector">
      <header>
        <div onClick={this.backModal}>
          <img src={modalBackSVG} />
        </div>
        {intl.formatMessage({ id: 'other_delegations' })}
      </header>
      <div className="m-delegations">
        {!!_delegations && _delegations.map((d) => {
          const v = validators.find(el => el.operator_address === d.validator_address)
          return <div className="dl-item" key={v.operator_address} onClick={() => {
            this.handleSelectDelegation(d, v)
          }}>
            <div className="validator-rank-badge">{v.sortIndex + 1}</div>
            <ValidatorLogo url={v.description.logo} />
            <div className="dl-item-info">
              <strong>{v.description.moniker}</strong>
              <i>{fAtom(d.shares)} ATOM</i>
            </div>
          </div>
        })}
      </div>
    </div>
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
          <div>
            <FormattedMessage
              id='fee'
            />
            <span>{`${fAtom(this.getFeeAmount())} ATOM`}</span>
          </div>
        </div>
        <button disabled={disabled} className="form-button" onClick={this.onSubmit}>
          <FormattedMessage
            id='delegate'
          />
        </button>
        {this.renderSelectorModal()}
      </div>
    )
  }

  getFeeAmount = () => {
    const { sourceType } = this.state
    switch (sourceType) {
      case 0:
        return getFeeAmountByType(msgTypes.delegate)
      case 1:
        return getFeeAmountByType(msgTypes.redelegate)
      default:
        return getFeeAmountByType(msgTypes.redelegate)
    }
  }

  onSubmit = () => {
    const { account, validator, history, intl } = this.props
    const { amount, sourceObject, sourceType } = this.state
    const { address } = account
    const isRedelegate = sourceType === 2
    const [valid, msg] = validDelegate(uatom(amount), sourceObject.value, this.getFeeAmount(), isRedelegate, account.balance)
    if (!valid) {
      return Toast.error(intl.formatMessage({ id: msg }))
    }

    const logOpt = { validator: validator.operator_address, moniker: validator.description.moniker }
    logger().track('submit_delegate', logOpt)

    let msgs: any = null

    switch (sourceType) {
      case 0:
        msgs = [
          createDelegateMsg(
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
            validator.operator_address),

          createDelegateMsg(
            address,
            validator.operator_address,
            uatom(amount),
            getNetworkConfig().denom)
        ]
      case 2:
        msgs = [
          createRedelegateMsg(
            address,
            sourceObject.validator_src_address,
            validator.operator_address,
            uatom(amount),
            getNetworkConfig().denom)
        ]
      default:
    }
    // send delegate apiCall
    const memo = [
      'delegate from imToken',
      'withdraw & delegate from imToken',
      'redelegate from imToken',
    ][sourceType]

    const txPayload = createTxPayload(
      address,
      msgs,
      memo,
      msgs[0].type
    )

    sendTransaction(txPayload).then(txHash => {
      Toast.success(txHash, { heading: intl.formatMessage({ id: 'sent_successfully' }) })
      logger().track('submit_delegate', { result: 'successful', ...logOpt })
      console.log(txHash)
      history.goBack()
      pubsub.emit('updateAsyncData')
    }).catch(e => {
      if (e.errorCode !== 1001) {
        logger().track('submit_delegate', { result: 'failed', message: e.message, ...logOpt })
        Toast.error(e.message, { heading: intl.formatMessage({ id: 'failed_to_send' }) })
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
    this.setState({ modalVisible: false, selectingDelegation: false })
  }

  handleSelectDelegation = (delegation, validator) => {
    const { intl } = this.props

    if (delegation.incompletion) {
      Toast.warn(intl.formatMessage({ id: 'redelegate_incompletion' }), { hideAfter: 5 })
      return false
    }

    this.setState({
      sourceType: 2,
      sourceObject: {
        key: validator.description.moniker,
        value: delegation.shares,
        validator_src_address: delegation.validator_address,
      },
      modalVisible: false,
      selectingDelegation: false,
    })
  }

  selectType = (index) => {
    const { account, reward } = this.props
    switch (index) {
      case 0:
        this.setState({
          sourceType: index,
          sourceObject: {
            key: selectLabels[index],
            value: account.balance
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
      case 2:
        this.setState({
          selectingDelegation: true,
        })
        break;
      default:
        return
    }
  }
}



export default injectIntl(CMP)
