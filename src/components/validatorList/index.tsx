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
  sortBy: string
}

class Page extends Component<Props> {

  componentDidMount() {

  }


  render() {
    const { validators, pool, sortBy } = this.props

    if (!validators || !validators.length) return <Loading />
    const sortedList = validators.sort((a, b) => {
      const sortKey = {
        yield: 'annualized_returns',
        bonded_tokens: 'tokens',
        delegators: 'delegators',
      }[sortBy]

      // if annualized_returns is same, sort by tokens
      if (sortBy === 'yield' && a[sortKey] == b[sortKey]) {
        return b['tokens'] - a['tokens'] > 0 ? 1 : -1
      }
      return b[sortKey] - a[sortKey] > 0 ? 1 : -1
    })

    return (
      <div className="validator-list">
        {
          sortedList.map(v => {
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
