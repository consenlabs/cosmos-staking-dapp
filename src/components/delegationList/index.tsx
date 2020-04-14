import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import { selectDelegations, selectValidators, selectValidatorRewards, selectUnbondingDelegations } from '../../lib/redux/selectors'
import ValidatorLogo from '../../components/validatorLogo'
import './index.scss'
import { getDailyReward, fPercent, fAtom, t, getUnbondingBalance } from 'lib/utils'

interface Props {
  delegations: any[]
  validators: any[]
  validatorRewards: any
  unbondingDelegations: any[]
}


class CMP extends Component<Props> {

  componentDidMount() {
  }

  renderItem = (d, v, index) => {
    if (!v) return null

    const { validatorRewards, unbondingDelegations } = this.props
    const reward = validatorRewards[v.operator_address] || 0
    const unDels = unbondingDelegations.filter(un => un.validator_address === v.operator_address)
    const unbonding = getUnbondingBalance(unDels) || 0

    return <Link className="dl-card" key={index} to={`/validator/${v.operator_address}`}>
      <div className="top">
        <div className="validator-rank-badge">{v.sortIndex + 1}</div>
        <ValidatorLogo url={v.description.logo} />
        <strong>{v.description.moniker}</strong>
        <div>
          <span>{t('yield')}</span>
          <i>{fPercent(v.annualized_returns, 2) || '~'}</i>
        </div>
      </div>
      <div className="split-line"></div>
      <div className="bottom">
        <div>
          <div>
            <span>{t('delegations')}</span>
            <i>{fAtom(d.balance || 0)}</i>
          </div>

          <div>
            <span>{t('undelegating')}</span>
            <i>{fAtom(unbonding)}</i>
          </div>
        </div>
        <div className="split-line"></div>
        <div>
          <div>
            <span>{t('rewards')}</span>
            <i>{fAtom(reward)}</i>
          </div>

          <div>
            <span>{t('rewards_per_day')}</span>
            <i>{d.balance && v.annualized_returns ? `+${getDailyReward(d.balance, v.annualized_returns)}` : '0'}</i>
          </div>
        </div>
      </div>

    </Link>
  }

  render() {
    const { validators } = this.props

    const delegations = this.mergeDeles()

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

  mergeDeles = () => {
    const { delegations, unbondingDelegations } = this.props
    const deles = delegations.slice(0)
    unbondingDelegations.forEach(udel => {
      if (!deles.find(del => del.validator_address === udel.validator_address)) {
        deles.push(udel)
      }
    })
    return deles
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    delegations: selectDelegations(state),
    validatorRewards: selectValidatorRewards(state),
    unbondingDelegations: selectUnbondingDelegations(state)
  }
}

const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(CMP)
