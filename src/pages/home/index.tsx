import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import './index.scss'
import NavBar from '../../components/navBar'
import AccountCard from '../../components/accountCard'
import DelegationList from '../../components/delegationList'
import Banner from '../../components/banner'
import WaterMark from '../../components/walletMark'

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
        <WaterMark />
        <NavBar index={0} />
        <AccountCard />
        <DelegationList />
        <Banner size="big" />
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
