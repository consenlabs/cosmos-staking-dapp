import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { IVote } from 'lib/api'
import { fPercent } from 'lib/utils'
import voteArrowImg from 'assets/vote-arrow.png'
import './index.scss'
import dayjs from 'dayjs'

interface Props {
  vote: IVote
  bondedTokens: number
  onVote: (IVote) => void
}


class CMP extends Component<Props> {

  componentDidMount() {
  }

  renderBadge = (status) => {
    return <div className={`v-badge badge-${status}`}>{status}</div>
  }

  renderStage = (vote: IVote) => {
    const { onVote } = this.props
    const status = vote.proposal_status

    let label = ''
    let time = ''
    switch (status) {
      case 'Passed':
      case 'Rejected':
      case 'Voting':
        label = 'voting_end'
        time = vote.voting_end_time
        break
      case 'Deposit':
        label = 'deposit_end_time'
        time = vote.deposit_end_time
        break
    }

    const formatedTime = dayjs.unix(new Date(time).getTime() / 1000).format('YYYY-MM-DD HH:mm:ss')
    const isVoting = status === 'Voting'
    const myVoteLabel = 'yes'
    return <div className="v-stage">
      <div className="v-time">
        <span>{label}</span>
        <time>{formatedTime}</time>
      </div>
      <div className="v-me">
        {!isVoting && <div className="v-button" onClick={() => onVote(vote)}>
          Vote
          <img src={voteArrowImg} />
        </div>}
        {
          <div>
            <span>your vote</span>
            <div>
              <i className={`vote-option-icon v-icon-${myVoteLabel}`}></i>
              <em>{myVoteLabel}</em>
            </div>
          </div>
        }
      </div>
    </div>
  }


  render() {
    const { vote, bondedTokens } = this.props
    const { final_tally_result: ftr } = vote
    const totalVoted = Number(ftr.abstain) + Number(ftr.yes) + Number(ftr.no) + Number(ftr.no_with_veto)
    const quorum = !!bondedTokens ? fPercent(totalVoted / bondedTokens, 2) : '~'
    const mostVoted = Math.max(
      Number(ftr.abstain),
      Number(ftr.yes),
      Number(ftr.no),
      Number(ftr.no_with_veto),
    )
    const mostVotedPercent = !!bondedTokens ? fPercent(mostVoted / totalVoted, 2) : '~'
    const mostVotedLabel = ['abstain', 'yes', 'no', 'no_with_veto'].find(label => {
      return Number(ftr[label]) === mostVoted
    })

    return <div className="vote-item" key={vote.id}>
      <div className="v-top">
        <div className="chart"></div>
        <div className="content">
          <h2>
            <a href={`https://www.mintscan.io/proposals/${vote.id}`}>
              {`#${vote.id} ${vote.content.value.title}`}
            </a>
          </h2>
          <div>
            <div>
              <span>Quorum</span>
              <strong className="quorum-percent">{quorum}</strong>
            </div>
            <div className="split"></div>
            <div>
              <span>Most Voted On</span>
              <div>
                <i className={`vote-option-icon v-icon-${mostVotedLabel}`}></i>
                <strong>{mostVotedLabel} {mostVotedPercent}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      {this.renderStage(vote)}
      {this.renderBadge(vote.proposal_status)}
    </div>
  }
}


export default CMP
