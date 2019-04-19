import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectDelegations, selectValidators } from '../../lib/redux/selectors'
import './index.scss'
import { atom, thousandCommas } from 'lib/utils'

interface Props {
  delegations: any[]
  validators: any[]
  onItemPress: Function
}


class CMP extends Component<Props> {

  componentDidMount() { }

  onPress = (delegation) => {
    this.props.onItemPress(delegation)
  }

  renderItem(d, v, index) {
    if (!v) return null
    return <div className="dl-card" key={index} onClick={() => this.onPress(d)}>
      <strong>{v.description.moniker}</strong>
      <div>
        <span>已委托</span>
        <i>{thousandCommas(atom(d.shares))}</i>
      </div>
    </div>
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
