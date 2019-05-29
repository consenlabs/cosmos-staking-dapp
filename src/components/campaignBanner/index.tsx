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
  const hashquark = campaignConfig[0]
  return {
    img: hashquark.imgs[locale][size],
    id: hashquark.id,
  }
}


class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = getBanner(props.size)
    console.log(this.state)
  }

  render() {
    const { img, id } = this.state
    if (!id) return null
    return <Link className="banner" to={{ pathname: `/campaign/${id}`, state: { size: this.props.size }}}>
      <div>
        <img src={img} alt="staking" />
      </div>
    </Link>
  }
}

export default CMP
