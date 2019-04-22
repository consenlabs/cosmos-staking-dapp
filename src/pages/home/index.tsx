import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import './index.scss'
import NavBar from '../../components/navBar'
import AccountCard from '../../components/accountCard'
import DelegationList from '../../components/delegationList'

interface Props {
  validators: any[]
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateAccount: (value: any) => any
}

class Page extends Component<Props, any> {

  renderDelegateBanner() {
    return <div className="banner">
      <div onClick={() => { }}>
        <img src="/images/banner.png" alt="staking" />
      </div>
    </div>
  }


  render() {
    return (
      <div className="home" id="home">
        <NavBar index={0} />
        <AccountCard />
        <DelegationList />
        {this.renderDelegateBanner()}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page))
