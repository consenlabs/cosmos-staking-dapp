import React, { Component } from 'react'
import { connect } from "react-redux"
import { t, createWithdrawMsg, createDelegateMsg, createTxPayload, Toast, toBN, fAtom, isiPhoneX } from '../../lib/utils'
import { getFeeParamsByMsgs } from '../../config/fee'
import { sendTransaction, routeTo } from '../../lib/sdk'
import * as api from '../../lib/api'
import { selectAccountInfo, selectDelegations, selectValidatorRewards, selectExchangeToken } from '../../lib/redux/selectors'
import './index.scss'
import Modal from '../../components/modal'
import withdrawIcon from '../../assets/withdraw.svg'
import compoundIcon from '../../assets/compound.svg'
import buyAtomIcon from '../../assets/buy-atom.svg'

import getNetworkConfig from '../../config/network'
import logger from '../../lib/logger'
import { pubsub } from 'lib/event'

interface Props {
  account: any
  validatorRewards: any
  delegations: any
  exchangeToken: any
}

class CMP extends Component<Props> {

  state = {
    modalVisible: false,
    actionType: 0,
  }

  componentDidMount() { }

  hideLoadingFn: any = null

  hideModal = () => {
    this.setState({ modalVisible: false })
  }

  showModal = (actionType) => {
    const actions = ['submit_withdraw_all', 'submit_compound_all', 'submit_exchange_atom']

    logger().track(actions[actionType], { action: 'click' })

    this.setState({ actionType, modalVisible: true })
  }

  checkTxStatus = (txHash, callback) => {
    console.log(txHash, callback)
    api.checkTx(txHash, 3000, 10).then(() => {
      callback && callback()
      Toast.success(t('tx_success'))
      pubsub.emit('sendTxSuccess')
    }).catch(e => {
      console.warn(e)
      callback && callback()
      Toast.error(e.message)
    })
  }

  getRewardDelegations = () => {
    const { delegations, validatorRewards } = this.props
    return delegations.filter(d => {
      return Number(validatorRewards[d.validator_address]) > 0
    })
  }

  createWithdrawAllMsgs = () => {

    const _hasRewardDelegation = this.getRewardDelegations()

    const msgs = _hasRewardDelegation.map(d => {
      return createWithdrawMsg(d.delegator_address, d.validator_address)
    })

    return msgs
  }

  createCompoundMsgs = () => {
    const { validatorRewards } = this.props

    const _hasRewardDelegation = this.getRewardDelegations()

    const withdrawMsgs = _hasRewardDelegation.map(d => {
      return createWithdrawMsg(d.delegator_address, d.validator_address)
    })

    const delegateMsgs = _hasRewardDelegation.map(d => {
      const reward = validatorRewards[d.validator_address]
      return createDelegateMsg(d.delegator_address, d.validator_address, reward, getNetworkConfig().denom)
    })

    const msgs = withdrawMsgs.concat(delegateMsgs)

    return msgs
  }

  doWithdrawAll = () => {
    const { account } = this.props
    const rewardDelegations = this.getRewardDelegations()
    const msgs = this.createWithdrawAllMsgs()

    logger().track('submit_withdraw_all', { action: 'confirm' })

    if (!rewardDelegations.length) {
      Toast.warn(t('no_rewards'))
      return false
    }

    const { feeAmount } = getFeeParamsByMsgs(msgs)

    if (toBN(account.balance || 0).lt(feeAmount)) {
      Toast.error(t('fee_not_enough'))
      return false
    }

    const logOpt = { delegations: rewardDelegations }

    const txPayload = createTxPayload(
      account.address,
      msgs,
      'withdraw rewards from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      logger().track('submit_withdraw_all', { action: 'send', result: 'successful', ...logOpt })
      console.log(txHash)
      this.hideLoadingFn = Toast.loading(txHash, { heading: t('tx_pending'), hideAfter: 0, onClick: () => this.hideLoadingFn() })
      this.checkTxStatus(txHash, this.hideLoadingFn)
    }).catch(e => {
      if (e.errorCode !== 1001) {
        logger().track('submit_withdraw_all', { action: 'send', result: 'failed', message: e.message, ...logOpt })
        Toast.error(e.message, { heading: t('failed_to_send') })
      }
    })

    this.hideModal()
  }

  doCompound = () => {
    const { account } = this.props

    const rewardDelegations = this.getRewardDelegations()
    const msgs = this.createCompoundMsgs()

    logger().track('submit_compound_all', { action: 'confirm' })

    if (!rewardDelegations.length) {
      Toast.warn(t('no_rewards'))
      return false
    }

    const { feeAmount } = getFeeParamsByMsgs(msgs)

    if (toBN(account.balance || 0).lt(feeAmount)) {
      Toast.error(t('fee_not_enough'))
      return false
    }

    const logOpt = { delegations: rewardDelegations }

    const txPayload = createTxPayload(
      account.address,
      msgs,
      'Reinvest rewards from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      logger().track('submit_compound_all', { action: 'send', result: 'successful', ...logOpt })
      const hideLoadingFn = Toast.loading(txHash, { heading: t('tx_pending'), hideAfter: 0, onClick: () => this.hideLoadingFn() })
      console.log(txHash)
      this.checkTxStatus(txHash, hideLoadingFn)
    }).catch(e => {
      if (e.errorCode !== 1001) {
        logger().track('submit_compound_all', { action: 'send', result: 'failed', message: e.message, ...logOpt })
        Toast.error(e.message, { heading: t('failed_to_send') })
      }
    })

    this.hideModal()
  }

  doExchange = () => {
    const { exchangeToken, account } = this.props
    if (exchangeToken && exchangeToken.makerToken && exchangeToken.takerToken) {
      logger().track('go_tokenlon_exchange', { page: 'home' })
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

    this.hideModal()
  }

  renderWidthdrawBox = () => {
    const { account } = this.props
    const msgs = this.createWithdrawAllMsgs()
    const { feeAmount } = getFeeParamsByMsgs(msgs)

    return <div className="reward-modal-inner">
      <img src={withdrawIcon} alt="withdraw-all" />
      <span>{t('withdraw_reward')}</span>
      <div className="desc">{t('withdraw_reward_desc', `${fAtom(account.rewardBalance)} ATOM`, `${fAtom(feeAmount)} ATOM`)}</div>
      <div className="buttons">
        <div className="button cancel-button" onClick={this.hideModal}>{t('cancel')}</div>
        <div className="button confirm-button" onClick={this.doWithdrawAll}>{t('confirm')}</div>
      </div>
    </div>
  }

  renderCompoundBox = () => {
    const { account } = this.props
    const msgs = this.createCompoundMsgs()
    const { feeAmount } = getFeeParamsByMsgs(msgs)

    return <div className="reward-modal-inner">
      <img src={compoundIcon} alt="compound" />
      <span>{t('reinvest_reward')}</span>
      <div className="desc">{t('reinvest_reward_desc', `${fAtom(account.rewardBalance)} ATOM`, `${fAtom(feeAmount)} ATOM`)} </div>
      <div className="buttons">
        <div className="button cancel-button" onClick={this.hideModal}>{t('cancel')}</div>
        <div className="button confirm-button" onClick={this.doCompound}>{t('confirm')}</div>
      </div>
    </div>
  }

  renderExchangeAtom = () => {
    const { account } = this.props

    return <div className="reward-modal-inner">
      <img src={buyAtomIcon} alt="exchange" />
      <span>{t('exchange_atom')}</span>
      <div className="desc">{t('exchange_atom_desc')} </div>
      <div className="ex-address">{account.address} </div>
      <div className="buttons">
        <div className="button cancel-button" onClick={this.hideModal}>{t('cancel')}</div>
        <div className="button confirm-button" onClick={this.doExchange}>{t('confirm')}</div>
      </div>
    </div>
  }

  render() {
    const { modalVisible, actionType } = this.state

    return (
      <div className="reward-toolbar">
        <div onClick={() => { this.showModal(2) }}>
          <img src={buyAtomIcon} alt="exchange_atom" />
          <p>{t('exchange_atom')}</p>
        </div>
        <div onClick={() => { this.showModal(0) }}>
          <img src={withdrawIcon} alt="withdraw_reward" />
          <p>{t('withdraw_reward')}</p>
        </div>
        <div onClick={() => { this.showModal(1) }}>
          <img src={compoundIcon} alt="reinvest_reward" />
          <p>{t('reinvest_reward')}</p>
        </div>

        <Modal isOpen={modalVisible}
          contentLabel="Reward Modal"
          onRequestClose={this.hideModal}
          styles={{ margin: '10px', bottom: isiPhoneX() ? '12px' : '0', borderRadius: '16px' }}
          appElement={document.body}>
          {actionType === 0 && this.renderWidthdrawBox()}
          {actionType === 1 && this.renderCompoundBox()}
          {actionType === 2 && this.renderExchangeAtom()}
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: selectAccountInfo(state),
    delegations: selectDelegations(state),
    validatorRewards: selectValidatorRewards(state),
    exchangeToken: selectExchangeToken(state),
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
