import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import ValidatorLogo from '../../components/validatorLogo'
import './index.scss'
import { atom, fAtom, fPercent } from 'lib/utils'
import { FormattedMessage } from 'react-intl'

interface Props {
  validator: any
  pool: any
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {

    const { pool, validator } = this.props
    const v = validator
    const totalPoolBondedTokens = pool.bonded_tokens
    const percent = atom(v.tokens) / atom(totalPoolBondedTokens)

    return <Link className="validator" to={`/validator/${v.operator_address}`}>

      <ValidatorLogo url={v.description.logo} />
      <div className="v-left">
        <strong>{v.description.moniker}</strong>
        <span>{`${fAtom(v.tokens)} ATOM`} ({fPercent(percent, 2)})</span>
      </div>
      <div className="v-right">
        <strong>{fPercent(v.annualized_returns, 1)}</strong>
        <FormattedMessage
          id='yield'
        />
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
