import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { t, isiPhoneX, Toast, createVoteMsg, createTxPayload } from '../../lib/utils'
import { getProposals, getStakePool, IProposal } from 'lib/api'
import VoteItem from './components/prosoal-item'
import Modal from 'components/modal'
import Loading from 'components/loading'
import selectedSvg from 'assets/selected.svg'
import { getAccounts, setTitle, sendTransaction } from 'lib/sdk'
import { pubsub } from 'lib/event'
import './index.scss'

interface StateProps {
  prosoals: IProposal[],
  bondedTokens: number
  option: string
  selectedProsoal: IProposal
  account: string
}

class Page extends Component<any, StateProps> {

  options = [
    'Yes',
    'No',
    'NoWithVeto',
    'Abstain'
  ]

  state: StateProps = {
    account: '',
    prosoals: [],
    bondedTokens: 0,
    selectedProsoal: null as any,
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
    getProposals().then(prosoals => {
      this.setState({
        prosoals: prosoals
      })
    })
    getStakePool().then(pool => {
      this.setState({
        bondedTokens: pool.bonded_tokens
      })
    })
  }

  render() {
    const { prosoals, bondedTokens, option, selectedProsoal, account } = this.state

    if (!prosoals.length) {
      return <Loading />
    }
    return (
      <div className="vote-page" style={{ paddingBottom: isiPhoneX() ? 30 : 10 }}>
        {
          prosoals.map(prosoal => {
            return <VoteItem
              account={account}
              key={prosoal.id}
              proposal={prosoal}
              onVote={this.showVoteModal}
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
}

const mapStateToProps = _state => {
  return {
  }
}

export default withRouter(connect(mapStateToProps)(Page))
