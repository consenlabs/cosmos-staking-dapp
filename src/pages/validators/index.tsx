import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import ValidatorList from '../../components/validatorList'
import NavBar from '../../components/navBar'
import Banner from '../../components/banner'
import WaterMark from '../../components/walletMark'
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
        <WaterMark />
        <NavBar index={1} />
        <Banner
          address="cosmosvaloper1cgh5ksjwy2sd407lyre4l3uj2fdrqhpkzp06e6"
          url="http://whale-token-im.b0.upaiyun.com/assets/images/hash-cn-s.png"
        />
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
