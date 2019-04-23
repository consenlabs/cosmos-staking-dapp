import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { injectIntl, FormattedMessage } from 'react-intl'
import './index.scss'
import NavBar from '../../components/navBar'
import AccountCard from '../../components/accountCard'
import DelegationList from '../../components/delegationList'
import Banner from '../../components/banner'
import WaterMark from '../../components/walletMark'
import { Toast } from '../../lib/utils'
import logger from '../../lib/logger'
import LOGO from '../../assets/cosmos.svg'
import FAQ from '../../assets/faq.svg'
import TURTORIAL from '../../assets/turtorial.svg'

interface Props {
  validators: any[]
  intl: any
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateAccount: (value: any) => any
}

class Page extends Component<Props, any> {
  componentDidMount() {
    logger().track('to_home')
    if (!window['imToken']['callAPI']) {
      setTimeout(() => {
        Toast.warn('请用 imToken 打开', { hideAfter: 10 })
      }, 0)
    }
  }

  render() {
    return (
      <div className="home" id="home">
        <WaterMark />
        <NavBar index={0} />
        <AccountCard />
        <DelegationList />
        {this.renderDivider()}
        <Banner size="big" />
        {this.renderBlocks()}
      </div>
    )
  }

  renderDivider = () => {
    return (
      <div className="divier">
        <div className="line"></div>
        <img src={LOGO} />
        <div className="line"></div>
      </div>
    )
  }

  renderBlocks = () => {
    const locale = this.props.intl.locale
    const language = locale === 'en' ? 'en-us' : 'zh-cn'
    const faqLink = `https://support.token.im/hc/${language}/articles/360021933754`
    const tutorialLink = `https://support.token.im/hc/${language}/sections/360004052613`
    return (
      <div className='blocks'>
        <a className='block-item' style={{ marginRight: 7 }} href={faqLink}>
          <img src={FAQ} />
          <FormattedMessage
            id='faq'
          />
        </a>

        <a className='block-item' style={{ marginLeft: 7 }} href={tutorialLink}>
          <img src={TURTORIAL} />
          <FormattedMessage
            id='tutorial'
          />
        </a>
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
