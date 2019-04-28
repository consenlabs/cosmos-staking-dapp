import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectValidators, selectAccountInfo, selectValidatorRewards, selectDelegations } from '../../lib/redux/selectors'
import { ellipsis, } from '../../lib/utils'
import DelegateForm from '../../components/delegateForm'
import ValidatorLogo from '../../components/validatorLogo'
import Loading from '../../components/loading'
import './index.scss'

interface Props {
  validators: any
  validatorRewards: any
  delegations: any
  account: any
  match: any
  history: any
}

class Page extends Component<Props> {

  componentDidMount() {
    console.log(this.props)
  }

  render() {
    const { validators, validatorRewards, account, delegations, match, history } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    console.log(v, match)
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
    delegations: selectDelegations(state)
  }
}


export default withRouter(connect(mapStateToProps)(Page))
