import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import { getLocale } from '../../lib/utils'
import bannerConfig from '../../config/banner'

interface Props {
  size: 'big' | 'small'
}

let bigSelected: any = null
let smallSelected: any = null

function getRandomBanner(size) {
  const locale = getLocale()
  console.log(size)

  const index = Date.now() % 2
  bigSelected = bigSelected || bannerConfig[index]
  smallSelected = smallSelected || bannerConfig[Math.abs(index - 1)]

  const selectedConfig = size === 'big' ? bigSelected : smallSelected
  const localeKey = locale === 'en' ? 'en' : 'cn'
  const sizeKey = size === 'big' ? 'l' : 's'
  console.log(sizeKey, localeKey, selectedConfig, bigSelected, smallSelected)

  return {
    url: selectedConfig.imgs[`${localeKey}_${sizeKey}`],
    address: selectedConfig.operator_address,
  }
}


class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = getRandomBanner(props.size)
  }

  componentDidMount() { }

  render() {
    const { address, url } = this.state

    return <Link className="banner" to={`/validator/${address}`}>
      <div>
        <img src={url} alt="staking" />
      </div>
    </Link>
  }
}

export default CMP
