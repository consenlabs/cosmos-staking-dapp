import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { selectValidators, selectPool } from '../../lib/redux/selectors'
import ValidatorCard from '../../components/validatorCard'
import Loading from '../../components/loading'
import './index.scss'

interface Props {
  validators: any[]
  pool: any
}

class Page extends Component<Props> {

  componentDidMount() {

  }


  render() {
    const { validators, pool } = this.props

    if (!validators || !validators.length) return <Loading />

    return (
      <div className="validator-list">
        {
          validators.map(v => {
            return <ValidatorCard validator={v} key={v.operator_address} pool={pool} />
          })
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    pool: selectPool(state)
  }
}


export default withRouter(connect(mapStateToProps)(Page))
