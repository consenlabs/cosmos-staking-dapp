import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import ValidatorList from '../../components/validatorList'
import NavBar from '../../components/navBar'
import Banner from '../../components/banner'
import WaterMark from '../../components/walletMark'
import './index.scss'
import logger from '../../lib/logger'

interface Props {
  validators: any[]
}

class Page extends Component<Props> {

  componentDidMount() {
    logger().track('to_validators_list')
  }


  render() {
    return (
      <div className="validators">
        <WaterMark />
        <NavBar index={1} />
        <Banner size="small" />
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
