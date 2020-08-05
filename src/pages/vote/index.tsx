import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { t, isiPhoneX, toBN, Toast, uatom, fAtom, createVoteMsg, createTxPayload, createDepositMsg, getBalanceFromAccount } from '../../lib/utils'
import { getProposals, getStakePool, IProposal, getAccount as getAccountInfo } from 'lib/api'
import getNetworkConfig from 'config/network'
import ProposalItem from './components/prosoal-item'
import Modal from 'components/modal'
import Loading from 'components/loading'
import selectedSvg from 'assets/selected.svg'
import { getAccounts, setTitle, sendTransaction } from 'lib/sdk'
import { getFeeAmountByType } from 'config/fee'
import msgTypes from 'lib/msgTypes'
import { pubsub } from 'lib/event'
import './index.scss'

import { selectProposals, selectPool, selectAccountInfo } from 'lib/redux/selectors'
import { updateProposals, updatePool, updateAccount } from 'lib/redux/actions'

interface Props {
  proposals: IProposal[],
  pool: any
  updateProposals: (any) => void
  updatePool: (any) => void
  updateAccount: (any) => void
  accountInfo: any
}

interface StateInterface {
  bondedTokens: number
  option: string
  selectedProsoal: IProposal
  depositProposal: IProposal
  depositAmount: string
  account: string
}

class Page extends Component<Props, StateInterface> {

  options = [
    'Yes',
    'No',
    'NoWithVeto',
    'Abstain'
  ]

  state: StateInterface = {
    account: '',
    bondedTokens: 0,
    selectedProsoal: null as any,
    depositProposal: null as any,
    depositAmount: '',
    option: '',
  }

  componentWillMount() {
    const { updateAccount } = this.props
    setTitle(t('vote_title'))

    getAccounts().then(accounts => {
      if (accounts.length) {
        const address = accounts[0]
        this.setState({ account: address })
        getAccountInfo(address).then(accountInfo => {
          const balance = getBalanceFromAccount(accountInfo)
          updateAccount({ ...accountInfo, balance, address })
        }).catch(e => {
          Toast.warn(e.message)
        })
      }
    })

    this.fetchData()
  }

  fetchData = () => {
    getProposals().then(proposals => {
      this.props.updateProposals(proposals)
    })
    getStakePool().then(pool => {
      this.props.updatePool(pool)
    })
  }

  render() {
    const { proposals, pool } = this.props
    const { option, selectedProsoal, account, depositProposal, depositAmount } = this.state
    const bondedTokens = pool && pool.bonded_tokens

    if (!proposals.length) {
      return <Loading />
    }
    return (
      <div className="vote-page" style={{ paddingBottom: isiPhoneX() ? 30 : 10 }}>
        {
          proposals.map(prosoal => {
            return <ProposalItem
              account={account}
              key={prosoal.id}
              proposal={prosoal}
              onVote={this.showVoteModal}
              onDeposit={this.showDepostiModal}
              bondedTokens={bondedTokens} />
          })
        }
        {!!selectedProsoal && <Modal isOpen={!!selectedProsoal}
          contentLabel="Vote Modal"
          onRequestClose={this.hideModal}
          appElement={document.body}>
          <div className="vote-modal-inner">
            <div className="desc">{`#${selectedProsoal.id} ${selectedProsoal.content.value.title}`} </div>
            <div className="v-option-list">
              {this.options.map(o => {
                return <div onClick={() => this.selectVoteOption(o)} key={o}>
                  <div>
                    <i className={`vote-option-icon v-icon-${o.toLowerCase()}`}></i>
                    <span>{t(o.toLowerCase())}</span>
                  </div>
                  {option === o ? <img src={selectedSvg} /> : <em></em>}
                </div>
              })}
            </div>
            <div className="buttons">
              <div className="button cancel-button" onClick={this.hideModal}>{t('cancel')}</div>
              <div className={`button confirm-button ${!!option ? '' : 'disable'}`} onClick={this.vote}>{t('confirm')}</div>
            </div>
          </div>
        </Modal>
        }

        {!!depositProposal && <Modal
          isOpen={!!depositProposal}
          contentLabel="Deposit Modal"
          onRequestClose={this.hideDepositModal}
          appElement={document.body}>
          <div className="vote-modal-inner">
            <div className="desc">{`#${depositProposal.id} ${depositProposal.content.value.title}`} </div>
            <div className="d-input-wrapper">
              <input
                type="number"
                placeholder={t('input_deposit_amount')}
                value={depositAmount}
                onChange={this.depositValueChange}
              />
              <span className="deposit-unit">ATOM</span>
            </div>
            <div className="buttons">
              <div className="button cancel-button" onClick={this.hideDepositModal}>{t('cancel')}</div>
              <div className={`button confirm-button ${!!depositAmount ? '' : 'disable'}`} onClick={this.onDeposit}>{t('confirm')}</div>
            </div>
          </div>
        </Modal>
        }
      </div>
    )
  }

  selectVoteOption = (option) => {
    this.setState({
      option: option,
    })
  }

  vote = () => {
    const { option, account, selectedProsoal } = this.state
    if (!option || !account || !selectedProsoal) return false

    const msgs = [
      createVoteMsg(
        account,
        selectedProsoal.id,
        option)
    ]

    const memo = 'imToken-DeFiApi'

    const txPayload = createTxPayload(
      account,
      msgs,
      memo,
    )

    sendTransaction(txPayload).then(txHash => {
      // logger().track(logKey, { result: 'successful', ...logOpt })
      console.log(txHash)

      pubsub.emit('sendTxSuccess', {
        txHash,
        status: 'PENDING',
        msgType: msgs[0].type,
        value: msgs[0].value,
        fee: txPayload.fee,
        timestamp: (Date.now() / 1000).toFixed(0)
      })
      Toast.success(txHash, { heading: t('sent_successfully') })
      this.hideModal()
      this.fetchData()
    }).catch(e => {
      if (e.errorCode !== 1001) {
        // logger().track(logKey, { result: 'failed', message: e.message, ...logOpt })
        Toast.error(e.message, { heading: t('failed_to_send') })
      }
    })
  }

  showDepostiModal = (proposal) => {
    this.setState({
      depositProposal: proposal
    })
  }

  depositValueChange = (e) => {
    this.setState({
      depositAmount: e.target.value
    })
  }

  onDeposit = () => {
    const { accountInfo } = this.props
    const { balance } = accountInfo
    const { account, depositProposal, depositAmount } = this.state

    const amount = Number(depositAmount)
    if (!amount || isNaN(amount)) {
      Toast.warn(t('invalid_number'))
      return false
    }
    const fee = getFeeAmountByType(msgTypes.deposit)
    if (toBN(uatom(amount)).plus(fee).gt(balance)) {
      Toast.warn(`${t('more_than_available')} : ${fAtom(Math.max(balance - fee, 0))}`)
      return false
    }

    const msgs = [
      createDepositMsg(
        account,
        depositProposal.id,
        uatom(amount),
        getNetworkConfig().denom,
      )
    ]

    const memo = 'imToken-DeFiApi'

    const txPayload = createTxPayload(
      account,
      msgs,
      memo,
    )

    sendTransaction(txPayload).then(txHash => {
      // logger().track(logKey, { result: 'successful', ...logOpt })
      console.log(txHash)

      pubsub.emit('sendTxSuccess', {
        txHash,
        status: 'PENDING',
        msgType: msgs[0].type,
        value: msgs[0].value,
        fee: txPayload.fee,
        timestamp: (Date.now() / 1000).toFixed(0)
      })
      Toast.success(txHash, { heading: t('sent_successfully') })
      this.hideDepositModal()
      this.fetchData()
    }).catch(e => {
      if (e.errorCode !== 1001) {
        // logger().track(logKey, { result: 'failed', message: e.message, ...logOpt })
        Toast.error(e.message, { heading: t('failed_to_send') })
      }
    })
  }

  showVoteModal = (prosoal: IProposal) => {
    this.setState({
      selectedProsoal: prosoal,
    })
  }

  hideModal = () => {
    this.setState({
      selectedProsoal: null as any,
      option: '',
    })
  }

  hideDepositModal = () => {
    this.setState({
      depositProposal: null as any,
    })
  }
}

const mapDispatchToProps = {
  updateAccount,
  updateProposals,
  updatePool
}


const mapStateToProps = state => {
  return {
    proposals: selectProposals(state),
    accountInfo: selectAccountInfo(state),
    pool: selectPool(state)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page))
