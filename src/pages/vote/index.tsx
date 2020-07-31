import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { t, isiPhoneX, Toast, uatom, createVoteMsg, createTxPayload, createProposalMsg, createDepositMsg } from '../../lib/utils'
import { getProposals, getStakePool, IProposal } from 'lib/api'
import ProposalItem from './components/prosoal-item'
import Modal from 'components/modal'
import Loading from 'components/loading'
import selectedSvg from 'assets/selected.svg'
import { getAccounts, setTitle, sendTransaction } from 'lib/sdk'
import { pubsub } from 'lib/event'
import './index.scss'

import { selectProposals, selectPool } from 'lib/redux/selectors'
import { updateProposals, updatePool } from 'lib/redux/actions'

interface Props {
  proposals: IProposal[],
  pool: any
  updateProposals: (any) => void
  updatePool: (any) => void
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
    setTitle(t('vote_title'))

    getAccounts().then(accounts => {
      if (accounts.length) {
        this.setState({ account: accounts[0] })
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
            <span className="v-modal-title">{t('vote')}</span>
            <div className="desc">{`#${selectedProsoal.id} ${selectedProsoal.content.value.title}`} </div>
            <div className="v-option-list">
              {this.options.map(o => {
                return <div onClick={() => this.selectVoteOption(o)} key={o}>
                  <div>
                    <i className={`vote-option-icon v-icon-${o}`}></i>
                    <span>{t(o)}</span>
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
            <span className="v-modal-title">{t('deposit')}</span>
            <div className="desc">{`#${depositProposal.id} ${depositProposal.content.value.title}`} </div>
            <div className="v-option-list">
              <div className="d-input-wrapper">
                <input
                  type="number"
                  placeholder="Input deposit amount"
                  value={depositAmount}
                  onChange={this.depositValueChange}
                />
              </div>
            </div>
            <div className="buttons">
              <div className="button cancel-button" onClick={this.hideDepositModal}>{t('cancel')}</div>
              <div className={`button confirm-button`} onClick={this.onDeposit}>{t('confirm')}</div>
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
    const { account, depositProposal, depositAmount } = this.state

    const amount = Number(depositAmount)
    if (!amount || isNaN(amount)) {
      Toast.warn('amount invalid')
      return false
    }

    const msgs = [
      createDepositMsg(
        account,
        depositProposal.id,
        uatom(amount),
        'uatom'
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

  testSubmitProposal = () => {
    const { account } = this.state
    const msgs = [
      createProposalMsg(
        account,
        'Hello, is anybody there?',
        'Just nod if you can hear me.',
        '1000',
        'uatom'
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
      this.hideModal()
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
      depositProposal: prosoal,
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
  updateProposals,
  updatePool
}


const mapStateToProps = state => {
  return {
    proposals: selectProposals(state),
    pool: selectPool(state)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page))
