import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectValidators } from '../../lib/redux/selectors'
import './index.css'

interface Props {
  validators: any[]
}

class Page extends Component<Props> {

  componentDidMount() {

  }

  render() {
    const { validators } = this.props
    return (
      <div>
        {
          validators.map(v => {
            return <div>{v.description.moniker}</div>
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


export default connect(mapStateToProps)(Page)
