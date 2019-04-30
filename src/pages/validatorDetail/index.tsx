import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { selectValidators, selectAccountInfo, selectDelegations, selectValidatorRewards } from '../../lib/redux/selectors'
import { ellipsis, fAtom, fPercent, isiPhoneX } from '../../lib/utils'
import ValidatorLogo from '../../components/validatorLogo'
import Loading from '../../components/loading'
import TxList from '../../components/txList'
import './index.scss'
import logger from '../../lib/logger'
import linkSVG from '../../assets/link.svg'
import { getTxListByAddress } from '../../lib/api'

interface Props {
  validators: any
  delegations: any
  validatorRewards: any
  account: any
  match: any
}

class Page extends Component<Props, any> {

  state = {
    txs: []
  }

  componentDidMount() {
    const { account, match, validators } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    logger().track('to_validator_detail', { validator: id, moniker: v ? v.description.moniker : '' })

    if (!id || !account.address) return false

    getTxListByAddress(account.address, id).then(txs => {
      if (txs && txs.length) {
        this.setState({ txs })
      }
    })
  }

  render() {
    const { validators, delegations, validatorRewards, match } = this.props
    const { txs } = this.state
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    if (!v) return <Loading />

    const d = delegations.find(o => o.validator_address === v.operator_address)
    const reward = validatorRewards[v.operator_address] || 0
    console.log(d, reward, txs)


    return (
      <div className="validator-detail-page">
        <section>
          <a className="top" href={v.description.website || '#'}>
            <ValidatorLogo url={v.description.logo} />
            <div className="left">
              <strong>{v.description.moniker}
                <img src={linkSVG} />
              </strong>
              <span>{ellipsis(v.operator_address)}</span>
            </div>
          </a>
          <div className="desc">{v.description.details || 'no description'}</div>
        </section>

        <ul>
          <li>
            <FormattedMessage
              id='bonded_tokens'
            />
            <i>{fAtom(v.tokens)} ATOM</i>
          </li>
          <li>
            <FormattedMessage
              id='self_bonded_tokens'
            />
            <i>{fAtom(v.self_delegator_tokens)} ATOM</i>
          </li>
          <li>
            <FormattedMessage
              id='delegators'
            />
            <i>{v.delegators}</i>
          </li>
          <li>
            <FormattedMessage
              id='commission_rate'
            />
            <i>{fPercent(v.commission.rate, 1)}</i>
          </li>
          <li>
            <FormattedMessage
              id='yield'
            />
            <i className="emphasize">{fPercent(v.annualized_returns, 2)}</i>
          </li>
        </ul>

        {!!(txs && txs.length) &&
          <div className="list-area" style={{ 'paddingBottom': isiPhoneX() ? 100 : 60 }}>
            <div className="delegate-status">
              <span>委托状态</span>
              <div className="delegate-status-bottom">
                <div>
                  <FormattedMessage id='delegated' />
                  <i>{fAtom(d.shares)}</i>
                </div>
                <div>
                  <FormattedMessage id='rewards' />
                  <i>{fAtom(reward)}</i>
                </div>
                <div>
                  <FormattedMessage id='rewards_per_day' />
                  <i>{d.shares && v.annualized_returns ? `+${fAtom(d.shares * v.annualized_returns / 365, 3)}` : '~'}</i>
                </div>
              </div>
            </div>
            <TxList txs={txs} />
          </div>
        }

        <div className="toolbar" style={{ bottom: isiPhoneX() ? 40 : 0 }}>
          <Link to={`/undelegate/${v.operator_address}`}>
            <FormattedMessage
              id='undelegate'
            />
          </Link>
          <Link to={`/delegate/${v.operator_address}`}>
            <FormattedMessage
              id='delegate'
            />
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    delegations: selectDelegations(state),
    account: selectAccountInfo(state),
    validatorRewards: selectValidatorRewards(state),
  }
}


export default withRouter(connect(mapStateToProps)(Page))
