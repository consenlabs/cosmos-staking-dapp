import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { selectValidators } from '../../lib/redux/selectors'
import { ellipsis, thousandCommas, atom, fPercent, isiPhoneX } from '../../lib/utils'
import ValidatorLogo from '../../components/validatorLogo'
import Loading from '../../components/loading'
import './index.scss'
import logger from '../../lib/logger'

interface Props {
  validators: any
  match: any
}

class Page extends Component<Props> {

  componentDidMount() {
    const { match } = this.props
    const id = match.params.id
    logger().track('to_validator_detail', { validator: id })
  }

  render() {
    const { validators, match } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    if (!v) return <Loading />

    return (
      <div className="validator-detail">
        <section>
          <a className="top" href={v.description.website || 'javascript:void(0)'}>
            <ValidatorLogo url={v.description.logo} />
            <div className="left">
              <strong>{v.description.moniker}</strong>
              <span>{ellipsis(v.operator_address, 24)}</span>
            </div>
          </a>
          <div className="desc">{v.description.details || 'no description'}</div>
        </section>

        <ul>
          <li>
            <FormattedMessage
              id='total_delegation'
            />
            <i>{thousandCommas(atom(v.tokens))} ATOM</i>
          </li>
          <li>
            <FormattedMessage
              id='validator_delegation'
            />
            <i>{thousandCommas(atom(v.delegator_shares))} ATOM</i>
          </li>
          {/* <li>
            <span>委托者</span>
            <i>~</i>
          </li> */}
          <li>
            <FormattedMessage
              id='commission'
            />
            <i>{fPercent(v.commission.rate, 1)}</i>
          </li>
          <li>
            <FormattedMessage
              id='annualized_earnings'
            />
            <i>{fPercent(v.annualized_returns, 3)}</i>
          </li>
        </ul>

        <div className="toolbar" style={{ bottom: isiPhoneX() ? 40 : 0 }}>
          <Link to={`/undelegate/${v.operator_address}`}>
            <FormattedMessage
              id='unstake'
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
    validators: selectValidators(state)
  }
}


export default withRouter(connect(mapStateToProps)(Page))
