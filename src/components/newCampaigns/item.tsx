import React, { Component } from 'react'
import './index.scss'
import { t } from '../../lib/utils'
import ValidatorCard from '../validatorCard'

interface Props {
  validator: any
  history: any
}

class CMP extends Component<Props, any> {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="new-campaign">
        <div className="recommend">
          <span className="r-text">{t('recommend')}</span>
        </div>
        {this.renderInfoCard()}
      </div>
    )
  }

  renderInfoCard() {
    const { validator } = this.props
    return (
      <ValidatorCard
        validator={validator}
        isHideBadge
        index={0}
        onSelect={this.onSelect}
      />
    )
  }

  onSelect = () => {
    const { history, validator } = this.props
    // logger().track('go_validator_delegate', { moniker: 'hashquark' })
    history.push(`/validator/${validator.operator_address}`, { from: 'campaign' })
  }
}

export default CMP
