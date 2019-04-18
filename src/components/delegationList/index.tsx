import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectDelegations, selectValidators } from '../../lib/redux/selectors'
import './index.scss'
import { updateDelegations } from 'lib/redux/actions'
import mockDelegations from '../../mocks/delegations'
// import * as sdk from '../../lib/sdk'

interface Props {
  updateDelegations: Function
  delegations: any[]
  validators: any[]
}


class CMP extends Component<Props> {

  componentDidMount() {
    this.props.updateDelegations(mockDelegations)
  }

  renderItem(d, v, index) {
    return <div className="dl-card" key={index}>
      <strong>{v.description.moniker}</strong>
      <div>
        <span>已委托</span>
        <i>{Number(d.shares / 1e6).toFixed(2)}</i>
      </div>
    </div>
  }

  render() {
    const { delegations, validators } = this.props

    return (
      <div className="delegations">
        {delegations.map((d, index) => {
          const v = validators.find(el => el.operator_address === d.validator_address) || {}
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

const mapDispatchToProps = {
  updateDelegations,
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
