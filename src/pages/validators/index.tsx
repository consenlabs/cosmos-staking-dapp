import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import { updateSortby } from '../../lib/redux/actions'
import { selectSortby } from '../../lib/redux/selectors'
import ValidatorList from '../../components/validatorList'
import NavBar from '../../components/navBar'
import Banner from '../../components/banner'
import WaterMark from '../../components/walletMark'
import './index.scss'
import logger from '../../lib/logger'
import SORT from '../../assets/sort.svg'
import ActionSheet from '../../components/actionsheet'

interface Props {
  validators: any[]
  intl: any
  sortBy: string
  updateSortby: any
}

class Page extends Component<Props, any> {
  constructor(props) {
    super(props)
    this.state = {
      actionsheetVisible: false,
    }
  }

  componentDidMount() {
    logger().track('to_validators_list')
  }


  render() {
    const { intl, sortBy } = this.props
    const { actionsheetVisible } = this.state
    return (
      <div className="validators">
        <WaterMark />
        <NavBar index={1} />
        {this.renderSort()}
        <Banner size="small" />
        <ValidatorList
          sortBy={sortBy}
        />
        {actionsheetVisible && (
          <ActionSheet
            options={['tokens', 'annualized_returns', 'delegators'].map(t => ({ locale: intl.formatMessage({ id: t }), key: t }))}
            title={intl.formatMessage({ id: 'sort' })}
            close={() => this.setState({ actionsheetVisible: false })}
            onSelect={(option) => this.props.updateSortby(option)}
          />
        )}
      </div>
    )
  }

  renderSort = () => {
    return (
      <div className="sort-bar">
        <p onClick={() => this.setState({ actionsheetVisible: true })}>
          <FormattedMessage
            id={this.props.sortBy}
          />
          <img src={SORT} />
        </p>
      </div>
    )
  }
}

const mapStateToProps = _state => {
  return {
    sortBy: selectSortby(_state),
  }
}

const mapDispatchToProps = {
  updateSortby,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(Page)))
