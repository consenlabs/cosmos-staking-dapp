import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import './index.scss'
import { getLocale } from '../../lib/utils'
import campaignConfig from '../../config/campaign'

interface Props {
  size: 'big' | 'small'
  store: any
}

function getBanner(size) {
  const locale = getLocale()
  let campaign = campaignConfig.find((t) => {
    const current = Date.now()
    return current > (t.duration.start * 1000) && current < (t.duration.end * 1000)
  })
  // show previous event for now
  if (!campaign) {
    return {}
  }
  const activity = campaign.activity
  return {
    img: campaign.imgs[locale][size],
    url: activity ? activity.campaignUrl : '',
    onClick: campaign.onClick
  }
}


class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = getBanner(props.size)
  }

  render() {
    const { store } = this.props
    const { img, url, onClick } = this.state
    if (!img) return null
    if (onClick) {
      return (
        <Link className="banner" to={{}}>
          <div onClick={() => onClick(store)}>
            <img src={img} alt="staking" />
          </div>
        </Link>
      )
    }
    return <Link className="banner" to={{ pathname: url, state: { size: this.props.size } }}>
      <div>
        <img src={img} alt="staking" />
      </div>
    </Link>
  }
}

const mapStateToProps = state => {
  return {
    store: state
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
