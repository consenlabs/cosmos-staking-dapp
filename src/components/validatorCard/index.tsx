import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import './index.scss'
import { atom, thousandCommas } from 'lib/utils'

interface Props {
  validator: any
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {

    const v = this.props.validator
    const tokens = atom(v.tokens)
    const percent = (tokens / 237538998).toFixed(3)

    return <Link className="validator" to={`/validators/${v.operator_address}`}>
      <div className="logo">
        <img alt="logo" src={v.description.logo || '../../../images/default-validator.png'} />
      </div>
      <div className="v-left">
        <strong>{v.description.moniker}</strong>
        <span>{thousandCommas(tokens)} ({percent}%)</span>
      </div>
      <div className="v-right">
        <strong>7%</strong>
        <span>年化收益</span>
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
