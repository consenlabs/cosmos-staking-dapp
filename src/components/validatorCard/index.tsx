import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import ValidatorLogo from '../../components/validatorLogo'
import './index.scss'
import { fAtom, fPercent, t } from 'lib/utils'
import SELECTED from '../../assets/selected.svg'

interface Props {
  validator: any
  pool?: any
  isHideBadge?: boolean
  index: number
  onSelect?: any
  selectedValidator?: any
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {

    const { onSelect, validator } = this.props
    const v = validator
    // const totalPoolBondedTokens = pool.bonded_tokens
    // const percent = atom(v.tokens) / atom(totalPoolBondedTokens)

    if (onSelect) {
      return (
        <div onClick={() => onSelect(v)}>
          {this.renderInner()}
        </div>
      )
    }

    return (
      <Link to={`/validator/${v.operator_address}`}>
        {this.renderInner()}
      </Link>
    )
  }

  renderInner() {
    const { validator, isHideBadge, index, selectedValidator } = this.props
    const v = validator
    const isSelected = selectedValidator && selectedValidator.operator_address === v.operator_address
    const cl = isSelected ? 'selected' : (index % 2 === 0 ? 'even-row' : 'odd-row')

    return (
      <div className={`validator ${cl}`}>
        {!isHideBadge && <div className="validator-rank-badge">{v.sortIndex + 1}</div>}
        <ValidatorLogo url={v.description.logo} />
        <div className="v-left">
          <strong>{v.description.moniker}</strong>
          <span>{`${fAtom(v.tokens, 0)} ATOM`} / {v.delegators}</span>
        </div>
        {
          isSelected ? <img src={SELECTED} alt="selected" /> :
        <div className="v-right">
          <strong>{fPercent(v.annualized_returns, 2)}</strong>
          <span>{t('yield')}</span>
        </div>}
      </div>
    )
  }
}

const mapStateToProps = _state => {
  return {
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
