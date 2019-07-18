import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import ValidatorList from '../../components/validatorList'
import { isiPhoneX } from '../../lib/utils'
import './index.scss'

interface Props {
  history: any
  match: any
  location: any
}

class Page extends Component<Props, any> {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // console.log('select-validator', this.props)
  }


  render() {
    const { match, history } = this.props
    const id = match.params.id
    const xStyle = { marginBottom: isiPhoneX() ? 20 : 0 }

    return (
      <div className="select-validators" style={xStyle}>
        <ValidatorList
          isSelect
          currentValidator={id}
          history={history}
        />
      </div>
    )
  }
}

const mapStateToProps = _state => {
  return {}
}

export default withRouter(connect(mapStateToProps)(Page))
