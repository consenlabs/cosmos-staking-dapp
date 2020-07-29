import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { t, Toast } from '../../lib/utils'
import { getProposals, getStakePool, IVote } from 'lib/api'
import VoteItem from './components/vote-item'
import Modal from 'components/modal'
import selectedSvg from 'assets/selected.svg'
import './index.scss'

interface StateProps {
  votes: IVote[],
  bondedTokens: number
  option: string
  selectedVote: IVote
}

class Page extends Component<any, StateProps> {

  options = [
    'yes',
    'no',
    'no_with_veto',
    'abstain'
  ]

  state: StateProps = {
    votes: [],
    bondedTokens: 0,
    selectedVote: null as any,
    option: ''
  }

  componentDidMount() {
    getProposals().then(votes => {
      console.log(votes)
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
    const { votes, bondedTokens, option, selectedVote } = this.state

    return (
      <div className="vote-page">
        {
          votes.map(vote => {
            return <VoteItem
              key={vote.id}
              vote={vote}
              onVote={this.showVoteModal}
              bondedTokens={bondedTokens} />
          })
        }
        {!!selectedVote && <Modal isOpen={selectedVote}
          contentLabel="Vote Modal"
          onRequestClose={this.hideModal}
          appElement={document.body}>
          <div className="vote-modal-inner">
            <span className="v-modal-title">{('vote')}</span>
            <div className="desc">{`#${selectedVote.id} ${selectedVote.content.value.title}`} </div>
            <div className="v-option-list">
              {this.options.map(o => {
                return <div onClick={() => this.selectVoteOption(o)}>
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
    const { option } = this.state
    if (!option) return false
    Toast.info('TODO')
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
