import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import './index.scss'
import NavBar from '../../components/navBar'
import AccountCard from '../../components/accountCard'
import DelegationList from '../../components/delegationList'
import Banner from '../../components/banner'

interface Props {
  validators: any[]
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateAccount: (value: any) => any
}

class Page extends Component<Props, any> {
  render() {
    return (
      <div className="home" id="home">
        <NavBar index={0} />
        <AccountCard />
        <DelegationList />
        <Banner
          url="http://whale-token-im.b0.upaiyun.com/assets/images/sparkpool-cn-l.png"
          address="cosmosvaloper1rwh0cxa72d3yle3r4l8gd7vyphrmjy2kpe4x72"
        />
      </div>
    )
  }
}

const mapStateToProps = _state => {
  return {
  }
}

const mapDispatchToProps = {

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(Page)))
