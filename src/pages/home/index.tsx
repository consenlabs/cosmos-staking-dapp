import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import './index.scss'
import NavBar from '../../components/navBar'
import AccountCard from '../../components/accountCard'
import DelegationList from '../../components/delegationList'
// import Banner from '../../components/banner'
import CampaignBanner from '../../components/campaignBanner'
import WaterMark from '../../components/walletMark'
import logger from '../../lib/logger'
import LOGO from '../../assets/cosmos.svg'
import FAQ from '../../assets/faq.svg'
import TURTORIAL from '../../assets/turtorial.svg'
import VOTE_ICON from 'assets/goVote.svg'
import { t, getLocale } from '../../lib/utils'
import NewCampaigns from '../../components/newCampaigns'

interface Props {
  validators: any[]
  updateValidators: (value: any) => any
  updateDelegations: (value: any) => any
  updateAccount: (value: any) => any
}

class Page extends Component<Props, any> {
  componentDidMount() {
    logger().track('to_home')
  }

  render() {
    return (
      <div className="home" id="home">
        <WaterMark />
        <NavBar index={0} />
        <AccountCard />
        <DelegationList />
        {this.renderDivider()}
        <CampaignBanner size="big" />
        <NewCampaigns type="home" />
        {this.renderBlocks()}
      </div>
    )
  }

  renderDivider = () => {
    return (
      <div className="divider">
        <div className="line"></div>
        <img src={LOGO} alt="" />
        <div className="line"></div>
      </div>
    )
  }

  renderBlocks = () => {
    const locale = getLocale()
    const language = locale === 'en' ? 'en-us' : 'zh-cn'
    const faqLink = `https://support.token.im/hc/${language}/articles/360021933754`
    const tutorialLink = `https://support.token.im/hc/${language}/sections/360004052613`
    return (
      <div className='blocks'>
        <a className='block-item' href={faqLink}>
          <img src={FAQ} alt="faq" />
          <span>{t('faq')}</span>
        </a>

        <a className='block-item' href={tutorialLink}>
          <img src={TURTORIAL} alt="turtorial" />
          <span>{t('tutorial')}</span>
        </a>

        <Link className='block-item' to="/vote">
          <img src={VOTE_ICON} alt="vote" />
          <span>{t('vote_title')}</span>
        </Link>
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
