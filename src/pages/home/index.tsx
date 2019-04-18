import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectValidators } from '../../lib/redux/selectors'
import './index.scss'
import { updateValidators } from 'lib/redux/actions'
import DelegateModal from '../../components/delegateModal'
import mockValidators from '../../mocks/validators'
import AccountCard from '../../components/accountCard'
import DelegationList from '../../components/delegationList'

interface Props {
  validators: any[]
  updateValidators: Function
}

class Page extends Component<Props> {

  state = {
    delegateModalVisible: true,
  }

  componentDidMount() {
    this.props.updateValidators(mockValidators)
  }

  renderDelegateBanner() {
    return <div className="banner">
      <div onClick={this.handleDelegate}>
        <img src="/images/banner.png" alt="staking" />
      </div>
    </div>
  }

  handleDelegate = () => {
    this.setState({
      delegateModalVisible: true,
    })
  }

  handleModalClose = () => {
    this.setState({
      delegateModalVisible: false,
    })
  }

  render() {
    const { delegateModalVisible } = this.state
    return (
      <div className="home">
        <AccountCard />
        <DelegationList />
        {this.renderDelegateBanner()}
        <DelegateModal
          visible={delegateModalVisible}
          onRequestClose={this.handleModalClose}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
  }
}

const mapDispatchToProps = {
  updateValidators
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
