import React, { Component } from 'react'
import './index.scss'
import { uatom, fAtom, createTxPayload, createDelegateMsg, createWithdrawMsg, createRedelegateMsg, Toast, isiPhoneX, getLocale } from 'lib/utils'
import { sendTransaction, routeTo } from 'lib/sdk'
import { validDelegate } from 'lib/validator'
import { t } from 'lib/utils'
import Modal from '../../components/modal'
import { pubsub } from 'lib/event'
import ValidatorLogo from '../../components/validatorLogo'
import getNetworkConfig from '../../config/network'
import { getFeeAmountByType } from '../../config/fee'
import msgTypes from '../../lib/msgTypes'
import logger from '../../lib/logger'
import modalBackSVG from '../../assets/modal-back.svg'
import Arrow from '../../assets/arrow.svg'
import campaignConfig from '../../config/campaign'
import buyAtomBigIcon from '../../assets/big-buy-atom.svg'
import LOGO from '../../assets/cosmos.svg'

const selectLabels = ['available_balance', 'rewards', 'other_delegations']

interface Props {
  reward: any
  account: any
  validator: any
  validators: any
  delegations: any
  redelegations: any
  history: any
  exchangeToken: any
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
      },
      exchangeModalVisible: false,
    }
  }

  hideExchangeModal = () => this.setState({ exchangeModalVisible: false })
  showExchangeModal = () => this.setState({ exchangeModalVisible: true })

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

  renderExchangeModal = () => {
    const { account } = this.props
    const { exchangeModalVisible } = this.state
    return (
      <Modal isOpen={exchangeModalVisible}
        contentLabel="Reward Modal"
        onRequestClose={this.hideExchangeModal}
        styles={{ margin: '10px', bottom: isiPhoneX() ? '12px' : '0', borderRadius: '16px' }}
        appElement={document.body}>
          <div className="reward-modal-inner">
          <img src={buyAtomBigIcon} alt="exchange" />
          <span>{t('exchange_atom')}</span>
          <div className="desc">{t('exchange_atom_desc')} </div>
          <div className="ex-address">{account.address} </div>
          <div className="buttons">
            <div className="button cancel-button" onClick={this.hideExchangeModal}>{t('cancel')}</div>
            <div className="button confirm-button" onClick={this.doExchange}>{t('confirm')}</div>
          </div>
        </div>
      </Modal>
    )
  }

  doExchange = () => {
    const { exchangeToken, account, validator } = this.props
    if (exchangeToken && exchangeToken.makerToken && exchangeToken.takerToken) {
      logger().track('go_tokenlon_exchange', { page: 'delegate', moniker: validator.description.moniker })
      routeTo({
        screen: 'Tokenlon',
        passProps: {
          ...exchangeToken,
          xChainReceiver: account.address,
        }
      })
    } else {
      Toast.error(t('cant_exchange_now'))
    }

    this.hideExchangeModal()
  }

  backModal = () => {
    this.setState({ selectingDelegation: false })
  }

  renderTypeSelector = () => {

    const { account, delegations, validator } = this.props
    const _delegations = delegations.filter(d => d.validator_address !== validator.operator_address)
    const hasDelegation = _delegations && _delegations.length > 0

    return <div className="modal-inner type-selector" style={{ paddingBottom: isiPhoneX() ? '20px' : '0' }}>
      <header>{t('select_funds_type')}</header>
      <ul className="delegate-type-list">
        <li onClick={() => this.selectType(0)}>
          <div>
            <label>{t(selectLabels[0])}</label>
            <span>{fAtom(account.balance)} ATOM</span>
          </div>
        </li>
        {/* <li onClick={() => this.selectType(1)}>
          <div>
            <label>{t({ selectLabels[1] )}</label>
            <span>{fAtom(reward, 6, '0')} ATOM</span>
          </div>
          {sourceType === 1 && <b>✓</b>}
        </li> */}
        <li onClick={hasDelegation ? () => this.selectType(2) : () => { }}>
          <div>
            <label>{t(selectLabels[2])}</label>
          </div>
          {hasDelegation ? <em>{t('change')}<i></i></em> : <em>{t('none')}</em>}

        </li>
      </ul>
      <div className="split-margin"></div>
      <footer onClick={this.hideDelegateSourceModal}>{t('cancel')}</footer>
    </div>
  }

  renderDelegations = () => {
    const { delegations, validators, validator, redelegations } = this.props
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
          <img src={modalBackSVG} alt="back" />
        </div>
        {t('other_delegations')}
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
            {d.incompletion && <span className="status">{t('unavailable')}</span>}
          </div>
        })}
      </div>
    </div>
  }

  renderDivider = () => {
    return (
      <div className="divider">
        <div className="line"></div>
        <img src={LOGO} alt="" />
        <div className="line"></div>
      </div>
    )
  }

  renderNotes = () => {
    const { sourceType } = this.state
    switch (sourceType) {
      case 2:
        return (
          <div className="delegation-notes">
            <p className="item-title">{t('state')}</p>
            <p className="item-desc">{t('redelegate_state')}</p>
          </div>
        )
      default:
        return (
          <div className="delegation-notes">
            <p className="item-title">{t('delegations')}</p>
            <p className="item-desc">{t('delegations_state')}</p>
            <p className="item-title">{t('rewards')}</p>
            <p className="item-desc">{t('rewards_state')}</p>
            <p className="item-title">{t('risk')}</p>
            <p className="item-desc">
              {t('risk_state')}
              <a href={`https://support.token.im/hc/${getLocale()}/sections/360004052613`}>{t('more_details')}</a>
            </p>
          </div>
        )
    }
  }

  render() {
    const { amount, sourceObject } = this.state
    const disabled = !amount
    return (
      <div className="form-inner">
        <div className="form-header" onClick={this.showDelegateSourceModal}>
          <span>{t(sourceObject.key)}</span>
          <i>{fAtom(sourceObject.value, 6, '0')} ATOM</i>
          <b></b>
        </div>
        <input
          type="number"
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
          <span>{t('delegate')}</span>
        </button>
        {this.renderNotes()}
        {this.renderDivider()}
        <div className="box" onClick={this.showExchangeModal}>
          <div>
            <p>
              <span>{t('quick_exchange_atom')}</span>
            </p>
            <span className="date">{t('quick_exchange_atom_desc')}</span>
          </div>
          <img src={Arrow} />
        </div>
        {this.renderSelectorModal()}
        {this.renderExchangeModal()}
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
    const { account, validator, history } = this.props
    const { amount, sourceObject, sourceType } = this.state
    const { address } = account
    const isRedelegate = sourceType === 2
    const [valid, msg] = validDelegate(uatom(amount), sourceObject.value, this.getFeeAmount(), isRedelegate, account.balance)
    if (!valid) {
      return Toast.error(t(msg))
    }

    const state = history.location.state
    const from = (state && state.from) ? state.from : 'detail'
    const logOpt = { validator: validator.operator_address, moniker: validator.description.moniker, from }
    const logKey = isRedelegate ? 'submit_redelegate' : 'submit_delegate'
    logger().track(logKey, logOpt)

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
        break
      case 2:
        msgs = [
          createRedelegateMsg(
            address,
            sourceObject.validator_src_address,
            validator.operator_address,
            uatom(amount),
            getNetworkConfig().denom)
        ]
        break
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
      const campaign = campaignConfig.find(t => t.operator_address === validator.operator_address)
      if (campaign && (campaign.duration.end * 1000) > Date.now()) {
        // const state = history.location.state
        // if (state && state.from === 'campaign') {
        //   history.goBack()
        // } else {
        history.replace('/campaign/hashquark', { txHash })
        // }
      } else {
        Toast.success(txHash, { heading: t('sent_successfully') })
        history.goBack()
      }
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
    this.setState({ modalVisible: false, selectingDelegation: false })
  }

  handleSelectDelegation = (delegation, validator) => {

    if (delegation.incompletion) {
      Toast.warn(t('redelegate_incompletion'), { hideAfter: 5 })
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



export default CMP
