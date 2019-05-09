import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import { selectDelegations, selectValidators, selectValidatorRewards } from '../../lib/redux/selectors'
import ValidatorLogo from '../../components/validatorLogo'
import './index.scss'
import { getDailyReward, fPercent, fAtom, t } from 'lib/utils'

interface Props {
  delegations: any[]
  validators: any[]
  validatorRewards: any
}


class CMP extends Component<Props> {

  componentDidMount() {
  }

  renderItem(d, v, index) {
    if (!v) return null

    const { validatorRewards } = this.props
    const reward = validatorRewards[v.operator_address] || 0

    return <Link className="dl-card" key={index} to={`/validator/${v.operator_address}`}>
      <div className="top">
        <div className="validator-rank-badge">{v.sortIndex + 1}</div>
        <ValidatorLogo url={v.description.logo} />
        <strong>{v.description.moniker}</strong>
        <div>
          <i>{fPercent(v.annualized_returns, 2) || '~'}</i>
          <span>{t('yield')}</span>
        </div>
      </div>
      <div className="split-line"></div>
      <div className="bottom">
        <div className="first">
          <span>{t('delegations')}</span>
          <i>{fAtom(d.shares)}</i>
        </div>

        <div>
          <span>{t('rewards')}</span>
          <i>{fAtom(reward)}</i>
        </div>

        <div className="last">
          <span>{t('rewards_per_day')}</span>
          <i>{d.shares && v.annualized_returns ? `+${getDailyReward(d.shares, v.annualized_returns)}` : '~'}</i>
        </div>
      </div>

    </Link>
  }

  render() {
    const { delegations, validators } = this.props

    if (!delegations || !delegations.length) return null

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
    validatorRewards: selectValidatorRewards(state)
  }
}

const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(CMP)
