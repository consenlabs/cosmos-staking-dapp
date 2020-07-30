import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { t, Toast, createVoteMsg, createTxPayload } from '../../lib/utils'
import { getProposals, getStakePool, IVote } from 'lib/api'
import VoteItem from './components/vote-item'
import Modal from 'components/modal'
import Loading from 'components/loading'
import selectedSvg from 'assets/selected.svg'
import { getAccounts, setTitle, sendTransaction } from 'lib/sdk'
import { pubsub } from 'lib/event'
import './index.scss'

interface StateProps {
  votes: IVote[],
  bondedTokens: number
  option: string
  selectedVote: IVote
  account: string
}

class Page extends Component<any, StateProps> {

  options = [
    'yes',
    'no',
    'no_with_veto',
    'abstain'
  ]

  state: StateProps = {
    account: '',
    votes: [],
    bondedTokens: 0,
    selectedVote: null as any,
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
    getProposals().then(votes => {
      this.setState({
        votes: votes
      })
    })
    getStakePool().then(pool => {
      this.setState({
        bondedTokens: pool.bonded_tokens
      })
    })
  }

  render() {
    const { votes, bondedTokens, option, selectedVote, account } = this.state

    if (!votes.length) {
      return <Loading />
    }
    return (
      <div className="vote-page">
        {
          votes.map(vote => {
            return <VoteItem
              account={account}
              key={vote.id}
              vote={vote}
              onVote={this.showVoteModal}
              bondedTokens={bondedTokens} />
          })
        }
        {!!selectedVote && <Modal isOpen={!!selectedVote}
          contentLabel="Vote Modal"
          onRequestClose={this.hideModal}
          appElement={document.body}>
          <div className="vote-modal-inner">
            <span className="v-modal-title">{t('vote')}</span>
            <div className="desc">{`#${selectedVote.id} ${selectedVote.content.value.title}`} </div>
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
      </div>
    )
  }

  selectVoteOption = (option) => {
    this.setState({
      option: option,
    })
  }

  vote = () => {
    const { option, account, selectedVote } = this.state
    if (!option || !account || !selectedVote) return false

    const msgs = [
      createVoteMsg(
        account,
        selectedVote.id,
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
      this.fetchData()
    }).catch(e => {
      if (e.errorCode !== 1001) {
        // logger().track(logKey, { result: 'failed', message: e.message, ...logOpt })
        Toast.error(e.message, { heading: t('failed_to_send') })
      }
    })
  }

  showVoteModal = (vote) => {
    this.setState({
      selectedVote: vote,
    })
  }

  hideModal = () => {
    this.setState({
      selectedVote: null as any,
      option: '',
    })
  }
}

const mapStateToProps = _state => {
  return {
  }
}

export default withRouter(connect(mapStateToProps)(Page))
