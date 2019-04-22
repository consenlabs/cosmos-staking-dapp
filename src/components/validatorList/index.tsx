import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { selectValidators } from '../../lib/redux/selectors'
import ValidatorCard from '../../components/validatorCard'
import './index.scss'

interface Props {
  validators: any[]
}

class Page extends Component<Props> {

  componentDidMount() {

  }


  render() {
    const { validators } = this.props
    return (
      <div className="validator-list">
        {
          validators.map(v => {
            return <ValidatorCard validator={v} key={v.operator_address} />
          })
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
  }
}


export default withRouter(connect(mapStateToProps)(Page))
