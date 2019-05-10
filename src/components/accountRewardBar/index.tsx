import React, { Component } from 'react'
import { connect } from "react-redux"
import { t, createWithdrawMsg, createDelegateMsg, createTxPayload, Toast, toBN, fAtom, isiPhoneX } from '../../lib/utils'
import { getFeeParamsByMsgs } from '../../config/fee'
import { sendTransaction } from '../../lib/sdk'
import * as api from '../../lib/api'
import { selectAccountInfo, selectDelegations, selectValidatorRewards } from '../../lib/redux/selectors'
import './index.scss'
import Modal from '../../components/modal'
import withdrawIcon from '../../assets/withdraw.svg'
import withdrawBigIcon from '../../assets/big-withdraw.svg'
import compoundIcon from '../../assets/compound.svg'
import compoundBigIcon from '../../assets/big-compound.svg'

import getNetworkConfig from '../../config/network'
import logger from '../../lib/logger'
import { pubsub } from 'lib/event'

interface Props {
  account: any
  validatorRewards: any
  delegations: any
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

  doWithdrawAll = () => {
    const { delegations, account, validatorRewards } = this.props

    const _hasRewardDelegation = delegations.filter(d => {
      return Number(validatorRewards[d.validator_address]) > 0
    })

    if (!_hasRewardDelegation.length) {
      Toast.warn(t('no_rewards'))
      return false
    }

    const msgs = _hasRewardDelegation.map(d => {
      return createWithdrawMsg(d.delegator_address, d.validator_address)
    })

    const { feeAmount } = getFeeParamsByMsgs(msgs)

    if (toBN(account.balance || 0).lt(feeAmount)) {
      Toast.error(t('fee_not_enough'))
      return false
    }

    const logOpt = { delegations: _hasRewardDelegation }

    const txPayload = createTxPayload(
      account.address,
      msgs,
      'withdraw rewards from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      logger().track('submit_withdraw_all', { result: 'successful', ...logOpt })
      console.log(txHash)
      this.hideLoadingFn = Toast.loading(txHash, { heading: t('tx_pending'), hideAfter: 0, onClick: () => this.hideLoadingFn() })
      this.checkTxStatus(txHash, this.hideLoadingFn)
      // TODO: check status
    }).catch(e => {
      if (e.errorCode !== 1001) {
        logger().track('submit_withdraw_all', { result: 'failed', message: e.message, ...logOpt })
        Toast.error(e.message, { heading: t('failed_to_send') })
      }
    })

    this.hideModal()
  }

  doCompound = () => {
    const { delegations, account, validatorRewards } = this.props

    const _hasRewardDelegation = delegations.filter(d => {
      return Number(validatorRewards[d.validator_address]) > 0
    })

    if (!_hasRewardDelegation.length) {
      Toast.warn(t('no_rewards'))
      return false
    }

    const withdrawMsgs = _hasRewardDelegation.map(d => {
      return createWithdrawMsg(d.delegator_address, d.validator_address)
    })

    const delegateMsgs = _hasRewardDelegation.map(d => {
      const reward = validatorRewards[d.validator_address]
      return createDelegateMsg(d.delegator_address, d.validator_address, reward, getNetworkConfig().denom)
    })

    const msgs = withdrawMsgs.concat(delegateMsgs)
    const { feeAmount } = getFeeParamsByMsgs(msgs)

    if (toBN(account.balance || 0).lt(feeAmount)) {
      Toast.error(t('fee_not_enough'))
      return false
    }

    const logOpt = { delegations: _hasRewardDelegation }

    const txPayload = createTxPayload(
      account.address,
      msgs,
      'Reinvest rewards from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      logger().track('submit_compound_all', { result: 'successful', ...logOpt })
      const hideLoadingFn = Toast.loading(txHash, { heading: t('tx_pending'), hideAfter: 0, onClick: () => this.hideLoadingFn() })
      console.log(txHash)
      this.checkTxStatus(txHash, hideLoadingFn)
    }).catch(e => {
      if (e.errorCode !== 1001) {
        logger().track('submit_compound_all', { result: 'failed', message: e.message, ...logOpt })
        Toast.error(e.message, { heading: t('failed_to_send') })
      }
    })

    this.hideModal()

  }

  renderWidthdrawBox = () => {
    const { account } = this.props
    return <div className="reward-modal-inner">
      <img src={withdrawBigIcon} alt="withdraw-all" />
      <span>{t('withdraw_reward')}</span>
      <div className="desc">{t('withdraw_reward_desc', `${fAtom(account.rewardBalance)} ATOM`)}</div>
      <div className="buttons">
        <div className="button cancel-button" onClick={this.hideModal}>{t('cancel')}</div>
        <div className="button confirm-button" onClick={this.doWithdrawAll}>{t('confirm')}</div>
      </div>
    </div>
  }

  renderCompoundBox = () => {
    const { account } = this.props
    return <div className="reward-modal-inner">
      <img src={compoundBigIcon} alt="compound" />
      <span>{t('reinvest_reward')}</span>
      <div className="desc">{t('reinvest_reward_desc', `${fAtom(account.rewardBalance)} ATOM`)} </div>
      <div className="buttons">
        <div className="button cancel-button" onClick={this.hideModal}>{t('cancel')}</div>
        <div className="button confirm-button" onClick={this.doCompound}>{t('confirm')}</div>
      </div>
    </div>
  }

  render() {
    const { modalVisible, actionType } = this.state

    return (
      <div className="reward-toolbar">
        <div onClick={() => { this.showModal(0) }}>
          <img src={withdrawIcon} alt="withdraw_reward" />
          <span>{t('withdraw_reward')}</span>
        </div>
        <div onClick={() => { this.showModal(1) }}>
          <img src={compoundIcon} alt="reinvest_reward" />
          <span>{t('reinvest_reward')}</span>
        </div>

        <Modal isOpen={modalVisible}
          contentLabel="Reward Modal"
          onRequestClose={this.hideModal}
          styles={{ margin: '10px', bottom: isiPhoneX() ? '12px' : '0', borderRadius: '16px' }}
          appElement={document.body}>
          {actionType === 0 ? this.renderWidthdrawBox() : this.renderCompoundBox()}
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
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
