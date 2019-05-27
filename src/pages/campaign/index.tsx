import React, { Component } from 'react'
import campaigns from '../../components/campaigns'
import Loading from '../../components/loading'
import { selectValidators, selectPool } from '../../lib/redux/selectors'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getLocale } from '../../lib/utils'

interface Props {
  match: any
  validators: any
  pool: any
}

class Campaign extends Component<Props, any> {
  render() {
    const { match, validators } = this.props

    const id = match.params.id

    if (!campaigns[id] || validators.length === 0) {
      return <Loading />
    }

    const CampaignComponent = campaigns[id]

    return (
      <div>
        <CampaignComponent
          validators={validators}
          locale={getLocale()}
          pool={this.props.pool}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    pool: selectPool(state),
  }
}


export default withRouter(connect(mapStateToProps)(Campaign))