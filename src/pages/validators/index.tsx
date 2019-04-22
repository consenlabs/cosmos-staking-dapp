import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import ValidatorList from '../../components/validatorList'
import NavBar from '../../components/navBar'
import './index.scss'

interface Props {
  validators: any[]
}

class Page extends Component<Props> {

  componentDidMount() {

  }


  render() {
    return (
      <div className="validators">
        <NavBar index={1} />
        <ValidatorList />
      </div>
    )
  }
}

const mapStateToProps = _state => {
  return {
  }
}


export default withRouter(connect(mapStateToProps)(Page))
