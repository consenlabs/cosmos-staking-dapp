import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import { selectValidators } from '../../lib/redux/selectors'
import { ellipsis, thousandCommas, atom } from '../../lib/utils'
import './index.scss'

interface Props {
  validators: any
  match: any
}

class Page extends Component<Props> {

  componentDidMount() {

  }

  render() {
    const { validators, match } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    console.log(v, match)
    if (!v) return <h1 className="error-404">404</h1>

    return (
      <div className="validator-detail">
        <section>
          <div className="top">
            <div className="logo">
              <img alt="logo" src={v.description.logo || '../../../images/default-validator.png'} />
            </div>
            <div className="left">
              <strong>{v.description.moniker}</strong>
              <span>{ellipsis(v.operator_address, 24)}</span>
            </div>
          </div>
          <div className="desc">{v.description.details || 'no description'}</div>
        </section>

        <ul>
          <li>
            <span>总委托</span>
            <i>{thousandCommas(atom(v.tokens))} ATOM</i>
          </li>
          <li>
            <span>验证者委托</span>
            <i>{thousandCommas(atom(v.delegator_shares))} ATOM</i>
          </li>
          <li>
            <span>委托者</span>
            <i>~</i>
          </li>
          <li>
            <span>佣金</span>
            <i>{(+v.commission.rate).toFixed(3)} %</i>
          </li>
          <li>
            <span>年化收益</span>
            <i>{v.annualized_returns} %</i>
          </li>
        </ul>

        <div className="toolbar">
          <Link to={`/undelegate/${v.operator_address}`}>赎回</Link>
          <Link to={`/delegate/${v.operator_address}`}>委托</Link>
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
