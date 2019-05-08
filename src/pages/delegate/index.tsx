import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectValidators, selectAccountInfo, selectValidatorRewards, selectDelegations, selectRedelegations } from '../../lib/redux/selectors'
import { ellipsis, } from '../../lib/utils'
import DelegateForm from '../../components/delegateForm'
import ValidatorLogo from '../../components/validatorLogo'
import Loading from '../../components/loading'
import './index.scss'

interface Props {
  validators: any
  validatorRewards: any
  delegations: any
  redelegations: any
  account: any
  match: any
  history: any
}

class Page extends Component<Props> {

  componentDidMount() {
    console.log(this.props)
  }

  render() {
    const { validators, validatorRewards, account, delegations, redelegations, match, history } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    if (!v) return <Loading />

    const reward = validatorRewards[v.operator_address]

    return (
      <div className="delegate-page">
        <div className="validator-detail">
          <section>
            <div className="top">
              <ValidatorLogo url={v.description.logo} />
              <div className="left">
                <strong>{v.description.moniker}</strong>
                <span>{ellipsis(v.operator_address)}</span>
              </div>
            </div>
          </section>
        </div>
        <DelegateForm
          account={account}
          validator={v}
          history={history}
          reward={reward}
          validators={validators}
          delegations={delegations}
          redelegations={redelegations}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    validatorRewards: selectValidatorRewards(state),
    account: selectAccountInfo(state),
    delegations: selectDelegations(state),
    redelegations: selectRedelegations(state),
  }
}


export default withRouter(connect(mapStateToProps)(Page))
