import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { IProposal } from 'lib/api'
import { fPercent, fAtom, t } from 'lib/utils'
import voteArrowImg from 'assets/vote-arrow.png'
import linkImg from 'assets/out-link.svg'
import './index.scss'
import { getProposalVoters, getProposalDepositByAddress } from 'lib/api'
import dayjs from 'dayjs'
import ComplexDonut from 'components/complexDonut'

interface Props {
  proposal: IProposal
  account: string
  bondedTokens: number
  onVote: (IProposal) => void
  onDeposit: (IProposal) => void
}

enum PROPOSAL_STAGE {
  passed = 'Passed',
  deposit = 'DepositPeriod',
  rejected = 'Rejected',
  voting = 'Voting'
}


class CMP extends Component<Props> {

  state = {
    myVoteOption: '',
    myDepositedAmount: '',
  }

  componentDidMount() {
    const { proposal, account } = this.props
    this.getMyVoteAndDeposit(account, proposal)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.account !== this.props.account) {
      this.getMyVoteAndDeposit(nextProps.account, nextProps.proposal)
    }
  }

  getMyVoteAndDeposit = (account, proposal) => {
    if (!account || Number(proposal.id) < 23) return false
    getProposalVoters(proposal.id).then(votes => {
      if (votes && Array.isArray(votes)) {
        const myVote = votes.find(v => {
          return v.voter === account
        })
        if (myVote) {
          this.setState({
            myVoteOption: myVote.option.toLowerCase(),
          })
        }
      }
    })

    getProposalDepositByAddress(proposal.id, account).then(deposit => {
      if (deposit.amount && Array.isArray(deposit.amount)) {
        this.setState({
          myDepositedAmount: fAtom(deposit.amount[0].amount, 2)
        })
      }
    })
  }

  render() {
    const { proposal, bondedTokens } = this.props
    const { final_tally_result: ftr } = proposal
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

    return <div className="prosoal-item" key={proposal.id}>
      <div className="p-top">
        <div className="chart">
          {this.renderChart(proposal)}
        </div>
        <div className="content">
          <h2>
            <a href={`https://www.mintscan.io/proposals/${proposal.id}`}>
              {`#${proposal.id} ${proposal.content.value.title}`}
            </a>
          </h2>
          <div>
            <div>
              <span>{t('quorum')}</span>
              <strong className="quorum-percent">{quorum}</strong>
            </div>
            <div className="split"></div>
            <div>
              <span>{t('most_voted_on')}</span>
              <div>
                <i className={`vote-option-icon v-icon-${mostVotedLabel}`}></i>
                <strong>{t(mostVotedLabel)} {mostVotedPercent}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      {this.renderStage(proposal)}
      {this.renderBadge(proposal.proposal_status)}
      <img src={linkImg} className="out-link-icon" />
    </div>
  }

  renderBadge = (status) => {
    return <div className={`p-badge badge-${status}`}>{t(status.toLowerCase())}</div>
  }

  renderStage = (proposal: IProposal) => {
    const { onVote, onDeposit, account } = this.props
    const { myVoteOption, myDepositedAmount } = this.state
    const status = proposal.proposal_status

    const testVoting = window['location'].search.indexOf('testVoting') !== -1

    let label = ''
    let time = ''

    switch (status) {
      case PROPOSAL_STAGE.passed:
      case PROPOSAL_STAGE.rejected:
      case PROPOSAL_STAGE.voting:
        label = 'voting_end'
        time = proposal.voting_end_time
        break
      case PROPOSAL_STAGE.deposit:
        label = 'deposit_end_time'
        time = proposal.deposit_end_time
        break
    }

    const formatedTime = dayjs.unix(new Date(time).getTime() / 1000).format('YYYY-MM-DD HH:mm:ss')
    const isVoting = status === PROPOSAL_STAGE.voting || testVoting
    const isDepositing = status === PROPOSAL_STAGE.deposit && !testVoting

    return <div className="p-stage">
      <div className="p-time">
        <span>{t(label)}</span>
        <time>{formatedTime}</time>
      </div>
      <div className="v-me">
        {isVoting && account && <div className="v-button v-vote-button" onClick={() => onVote(proposal)}>
          {t('vote')}
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
        {isDepositing && account && <div className="v-button v-deposit-button" onClick={() => onDeposit(proposal)}>
          {t('deposit')}
          <img src={voteArrowImg} />
        </div>}
        {isDepositing && !!myDepositedAmount &&
          <div>
            <span>{t('your_deposit')}</span>
            <div>
              <em>{myDepositedAmount}</em>
            </div>
          </div>
        }
      </div>
    </div>
  }

  renderChart = (proposal) => {
    const colorYes = '#6CC8A1'
    const colorNo = '#2C3058'
    const colorDefault = '#C1C6D6'

    const { final_tally_result: ftr, proposal_status: state } = proposal
    const vYes = Number(ftr.yes)
    const vNo = Number(ftr.no)
    const vAbstain = Number(ftr.abstain)
    const vNoWithVeto = Number(ftr.no_with_veto)

    const vTotal = vYes + vNo + vAbstain + vNoWithVeto

    let segments = state === PROPOSAL_STAGE.deposit || vTotal === 0 ?
      [{
        color: colorDefault,
        value: 1
      }]
      : [
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
