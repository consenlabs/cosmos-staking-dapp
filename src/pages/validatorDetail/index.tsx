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
    const { account, match } = this.props
    const id = match.params.id

    logger().track('to_validator_detail', { validator: id })

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


    return (
      <div className="validator-detail-page">
        <section>
          <a className="top" href={v.description.website || '#'}>
            <ValidatorLogo url={v.description.logo} />
            <div className="left">
              <strong>{v.description.moniker}
                <img src="data:image/png;base64,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" />
              </strong>
              <span>{ellipsis(v.operator_address)}</span>
            </div>
          </a>
          <div className="desc">{v.description.details || 'no description'}</div>
        </section>

        <ul>
          <li>
            <FormattedMessage
              id='total_delegations'
            />
            <i>{fAtom(v.tokens)} ATOM</i>
          </li>
          {/* <li>
            <FormattedMessage
              id='validator_delegations'
            />
            <i>{fAtom(v.tokens - v.delegator_shares)} ATOM</i>
          </li> */}
          {/* <li>
            <span>委托者</span>
            <i>~</i>
          </li> */}
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
          <div className="list-area">
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
