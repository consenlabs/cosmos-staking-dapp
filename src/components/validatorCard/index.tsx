import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import ValidatorLogo from '../../components/validatorLogo'
import './index.scss'
import { atom, thousandCommas, fPercent } from 'lib/utils'
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
    const tokens = atom(v.tokens)
    const totalPoolBondedTokens = pool.bonded_tokens
    const percent = tokens / atom(totalPoolBondedTokens)

    return <Link className="validator" to={`/validator/${v.operator_address}`}>

      <ValidatorLogo url={v.description.logo} />
      <div className="v-left">
        <strong>{v.description.moniker}</strong>
        <span>{`${thousandCommas(tokens)} ATOM`} ({fPercent(percent, 3)})</span>
      </div>
      <div className="v-right">
        <strong>{fPercent(v.annualized_returns, 3)}</strong>
        <FormattedMessage
          id='annualized_earnings'
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
