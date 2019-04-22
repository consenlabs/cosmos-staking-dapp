import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'

interface Props {
  address: string
  url: string
}



class CMP extends Component<Props> {

  componentDidMount() { }

  render() {
    const { address, url } = this.props

    return <Link className="banner" to={`/validator/${address}`}>
      <div>
        <img src={url} alt="staking" />
      </div>
    </Link>
  }
}

export default CMP
