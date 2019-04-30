import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { selectValidators, selectAccountInfo, selectDelegations, selectValidatorRewards } from '../../lib/redux/selectors'
import { ellipsis, } from '../../lib/utils'
import UnDelegateForm from '../../components/undelegateForm'
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

  }

  render() {
    const { validators, validatorRewards, account, delegations, match, history } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    if (!v) return <Loading />

    const delegation = delegations.find(d => d.validator_address === v.operator_address) || {}
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
        <UnDelegateForm account={account} delegation={delegation} validator={v} history={history} reward={reward} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    delegations: selectDelegations(state),
    validatorRewards: selectValidatorRewards(state),
    account: selectAccountInfo(state),
  }
}


export default withRouter(connect(mapStateToProps)(Page))
