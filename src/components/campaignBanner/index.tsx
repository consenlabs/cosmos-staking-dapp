import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import { getLocale } from '../../lib/utils'
import campaignConfig from '../../config/campaign'

interface Props {
  size: 'big' | 'small'
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
  return {
    img: campaign.imgs[locale][size],
    url: campaign.activity.campaignUrl,
  }
}


class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = getBanner(props.size)
    console.log(this.state)
  }

  render() {
    const { img, url } = this.state
    if (!url) return null
    return <Link className="banner" to={{ pathname: url, state: { size: this.props.size } }}>
      <div>
        <img src={img} alt="staking" />
      </div>
    </Link>
  }
}

export default CMP
