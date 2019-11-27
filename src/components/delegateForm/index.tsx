import React, { Component } from 'react'
import './index.scss'
import { uatom, fAtom, createTxPayload, createDelegateMsg, Toast, isiPhoneX, getLocale } from 'lib/utils'
import { sendTransaction, routeTo } from 'lib/sdk'
import { validDelegate } from 'lib/validator'
import { t } from 'lib/utils'
import Modal from '../../components/modal'
import { pubsub } from 'lib/event'
import getNetworkConfig from '../../config/network'
import { getFeeAmountByType } from '../../config/fee'
import msgTypes from '../../lib/msgTypes'
import logger from '../../lib/logger'
import Arrow from '../../assets/arrow.svg'
import buyAtomBigIcon from '../../assets/big-buy-atom.svg'
import LOGO from '../../assets/cosmos.svg'

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
      exchangeModalVisible: false,
    }
  }

  hideExchangeModal = () => this.setState({ exchangeModalVisible: false })
  showExchangeModal = () => this.setState({ exchangeModalVisible: true })

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
    return (
      <div className="delegation-notes">
        <p className="item-title">{t('delegations')}</p>
        <p className="item-desc">{t('delegations_state')}</p>
        {/* <p className="item-title">{t('rewards')}</p>
        <p className="item-desc">{t('rewards_state')}</p> */}
        <p className="item-title">{t('risk')}</p>
        <p className="item-desc">
          {t('risk_state')}
          <a href={`https://support.token.im/hc/${getLocale()}/articles/360024607373`}>{t('more_details')}</a>
        </p>
      </div>
    )
  }

  render() {
    const { amount } = this.state
    const disabled = !amount
    const value = this.props.account.balance

    return (
      <div className="form-inner">
        <div className="form-header">
          <span>{t('available_balance')}</span>
          <i>{fAtom(value, 6, '0')} ATOM</i>
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
        <div className="box" onClick={this.showExchangeModal}>
          <div>
            <p>
              <span>{t('quick_exchange_atom')}</span>
            </p>
            <span className="date">{t('quick_exchange_atom_desc')}</span>
          </div>
          <img src={Arrow} />
        </div>
        {this.renderExchangeModal()}
      </div>
    )
  }

  getFeeAmount = () => {
    return getFeeAmountByType(msgTypes.delegate)
  }

  onSubmit = () => {
    const { account, validator, history } = this.props
    const { amount } = this.state
    const { address } = account
    const balance = account.balance
    const isRedelegate = false
    const [valid, msg] = validDelegate(uatom(amount), balance, this.getFeeAmount(), isRedelegate, balance)
    if (!valid) {
      return Toast.error(t(msg))
    }

    const state = history.location.state
    const from = (state && state.from) ? state.from : 'detail'
    const logOpt = { validator: validator.operator_address, moniker: validator.description.moniker, from }
    const logKey = 'submit_delegate'
    logger().track(logKey, logOpt)

    const msgs = [
      createDelegateMsg(
        address,
        validator.operator_address,
        uatom(amount),
        getNetworkConfig().denom)
    ]

    // send delegate apiCall
    const memo = 'imToken-DeFiApi'

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
}



export default CMP
