import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import { selectDelegations, selectValidators } from '../../lib/redux/selectors'
import ValidatorLogo from '../../components/validatorLogo'
import './index.scss'
import { atom, thousandCommas } from 'lib/utils'

interface Props {
  delegations: any[]
  validators: any[]
}


class CMP extends Component<Props> {

  componentDidMount() { }

  renderItem(d, v, index) {
    if (!v) return null
    return <Link className="dl-card" key={index} to={`/validators/${v.operator_address}`}>
      <div className="top">
        <ValidatorLogo url={v.description.logo} />
        <strong>{v.description.moniker}</strong>
        <div>
          <i>{v.annualized_returns || '~'}</i>
          <span>年化收益</span>
        </div>
      </div>
      <div className="split-line"></div>
      <div className="bottom">
        <div>
          <span>已委托</span>
          <i>{thousandCommas(atom(d.shares))}</i>
        </div>

        <div>
          <span>收益</span>
          <i>~</i>
        </div>

        <div>
          <span>预计收益 (天)</span>
          <i>~</i>
        </div>
      </div>

    </Link>
  }

  render() {
    const { delegations, validators } = this.props

    return (
      <div className="delegations">
        {!!delegations && delegations.map((d, index) => {
          const v = validators.find(el => el.operator_address === d.validator_address)
          return this.renderItem(d, v, index)
        })}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    delegations: selectDelegations(state),
  }
}

const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(CMP)
