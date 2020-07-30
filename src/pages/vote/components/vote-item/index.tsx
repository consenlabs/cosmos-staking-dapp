import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { IVote } from 'lib/api'
import { fPercent, t } from 'lib/utils'
import voteArrowImg from 'assets/vote-arrow.png'
import './index.scss'
import { getProposalVoters } from 'lib/api'
import dayjs from 'dayjs'
import ComplexDonut from 'components/complexDonut'

interface Props {
  vote: IVote
  account: string
  bondedTokens: number
  onVote: (IVote) => void
}

enum VOTE_STAGE {
  passed = 'Passed',
  deposit = 'Deposit',
  rejected = 'Rejected',
  voting = 'Voting'
}


class CMP extends Component<Props> {

  state = {
    myVoteOption: ''
  }

  componentDidMount() {
    const { vote, account } = this.props
    if (account) {
      getProposalVoters(vote.id).then(voters => {
        if (voters && Array.isArray(voters)) {
          const myVote = voters.find(v => {
            return v.voter === account
          })
          if (myVote) {
            this.setState({
              myVoteOption: myVote.option.toLowerCase(),
            })
          }
        }
      })
    }
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
        <div className="chart">
          {this.renderChart(vote)}
        </div>
        <div className="content">
          <h2>
            <a href={`https://www.mintscan.io/proposals/${vote.id}`}>
              {`#${vote.id} ${vote.content.value.title}`}
            </a>
          </h2>
          <div>
            <div>
              <span>{t('quorum')}</span>
              <strong className="quorum-percent">{quorum}</strong>
            </div>
            <div className="split"></div>
            <div>
              <span>{t('most_vote_on')}</span>
              <div>
                <i className={`vote-option-icon v-icon-${mostVotedLabel}`}></i>
                <strong>{t(mostVotedLabel)} {mostVotedPercent}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      {this.renderStage(vote)}
      {this.renderBadge(vote.proposal_status)}
    </div>
  }

  renderBadge = (status) => {
    return <div className={`v-badge badge-${status}`}>{t(status)}</div>
  }

  renderStage = (vote: IVote) => {
    const { onVote } = this.props
    const { myVoteOption } = this.state
    const status = vote.proposal_status

    let label = ''
    let time = ''

    switch (status) {
      case VOTE_STAGE.passed:
      case VOTE_STAGE.rejected:
      case VOTE_STAGE.voting:
        label = 'voting_end'
        time = vote.voting_end_time
        break
      case VOTE_STAGE.deposit:
        label = 'deposit_end_time'
        time = vote.deposit_end_time
        break
    }

    const formatedTime = dayjs.unix(new Date(time).getTime() / 1000).format('YYYY-MM-DD HH:mm:ss')
    const isVoting = status === 'Voting'

    return <div className="v-stage">
      <div className="v-time">
        <span>{t(label)}</span>
        <time>{formatedTime}</time>
      </div>
      <div className="v-me">
        {isVoting && <div className="v-button" onClick={() => onVote(vote)}>
          Vote
          <img src={voteArrowImg} />
        </div>}
        {!!myVoteOption &&
          <div>
            <span>{t('your_vote')}</span>
            <div>
              <i className={`vote-option-icon v-icon-${myVoteOption}`}></i>
              <em>{t(myVoteOption)}</em>
            </div>
          </div>
        }
      </div>
    </div>
  }

  renderChart = (vote) => {
    const colorYes = '#6CC8A1'
    const colorNo = '#2C3058'
    const colorDefault = '#C1C6D6'

    const { final_tally_result: ftr, proposal_status: state } = vote
    const vYes = Number(ftr.yes)
    const vNo = Number(ftr.no)
    const vAbstain = Number(ftr.abstain)
    const vNoWithVeto = Number(ftr.no_with_veto)

    let segments: any = []
    switch (state) {
      case VOTE_STAGE.passed:
        segments = [{
          color: colorYes,
          value: vYes,
        }, {
          color: colorDefault,
          value: vNo + vAbstain + vNoWithVeto
        }]
        break
      case VOTE_STAGE.rejected:
        segments = [{
          color: colorNo,
          value: vNo,
        }, {
          color: colorDefault,
          value: vYes + vAbstain + vNoWithVeto
        }]
        break
      case VOTE_STAGE.voting:
        segments = [
          {
            color: colorYes,
            value: vYes,
          },
          {
            color: colorNo,
            value: vNo,
          }, {
            color: colorDefault,
            value: vAbstain + vNoWithVeto
          }]
        break
      case VOTE_STAGE.deposit:
        segments = [
          {
            color: colorDefault,
            value: 100
          }
        ]
        break
    }

    return <ComplexDonut
      size={70}
      radius={26}
      segments={segments}
      thickness={18}
      startAngle={0}
    />
  }
}


export default CMP
