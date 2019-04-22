import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { selectValidators, selectAccountInfo, selectDelegations } from '../../lib/redux/selectors'
import { ellipsis, } from '../../lib/utils'
import UnDelegateForm from '../../components/undelegateForm'
import './index.scss'

interface Props {
  validators: any
  delegations: any
  account: any
  match: any
}

class Page extends Component<Props> {

  componentDidMount() {

  }

  render() {
    const { validators, account, delegations, match } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    console.log(v, match)
    if (!v) return <h1 className="loading-text">Loading...</h1>

    return (
      <div className="delegate-page">
        <div className="validator-detail">
          <section>
            <div className="top">
              <div className="logo">
                <img alt="logo" src={v.description.logo || '../../../images/default-validator.png'} />
              </div>
              <div className="left">
                <strong>{v.description.moniker}</strong>
                <span>{ellipsis(v.operator_address, 24)}</span>
              </div>
            </div>
          </section>
        </div>
        <UnDelegateForm account={account} delegations={delegations} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    delegations: selectDelegations(state),
    account: selectAccountInfo(state),
  }
}


export default withRouter(connect(mapStateToProps)(Page))
