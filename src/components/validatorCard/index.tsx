import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import ValidatorLogo from '../../components/validatorLogo'
import './index.scss'
import { fAtom, fPercent, t } from 'lib/utils'

interface Props {
  validator: any
  pool: any
  isHideBadge?: boolean
  index: number
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {

    const { validator, isHideBadge, index } = this.props
    const v = validator
    // const totalPoolBondedTokens = pool.bonded_tokens
    // const percent = atom(v.tokens) / atom(totalPoolBondedTokens)

    return <Link className={`validator ${index % 2 === 0 ? 'even-row' : 'odd-row'}`} to={`/validator/${v.operator_address}`}>
      {!isHideBadge && <div className="validator-rank-badge">{v.sortIndex + 1}</div>}
      <ValidatorLogo url={v.description.logo} />
      <div className="v-left">
        <strong>{v.description.moniker}</strong>
        <span>{`${fAtom(v.tokens, 0)} ATOM`} / {v.delegators}</span>
      </div>
      <div className="v-right">
        <strong>{fPercent(v.annualized_returns, 2)}</strong>
        <span>{t('yield')}</span>
      </div>
    </Link>
  }
}

const mapStateToProps = _state => {
  return {
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
