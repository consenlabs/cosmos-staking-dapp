import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import Item from './item'
import { selectValidators } from '../../lib/redux/selectors'
import { newCampaigns } from '../../config/campaign'

interface Props {
  locale: string
  history: any
  validators: any
}

class CMP extends Component<Props, any> {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    const validator = this.getCampaign()
    const { history } = this.props
    return !!validator && (
      <Item
        validator={validator}
        history={history}
      />
    )
  }

  getCampaign = () => {
    const { validators } = this.props
    const campaign = newCampaigns[Math.floor(Math.random() * newCampaigns.length)]
    if (validators && validators.length) {
      const validator = validators.find(v => v.operator_address === campaign.operator_address)
      return validator
    }
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
  }
}

export default withRouter(connect(mapStateToProps)(CMP))
