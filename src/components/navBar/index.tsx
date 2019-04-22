import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './index.scss'

interface Props {
  index: number
}

class CMP extends Component<Props> {

  componentDidMount() { }

  render() {
    const { index } = this.props

    return <div className="navbar">
      <div>
        <Link className={index === 0 ? "selected" : ""} to="/">
          我的委托
      </Link>
        <Link className={index === 1 ? "selected" : ""} to="/validators">
          验证者
      </Link>
      </div>
    </div>
  }
}

export default CMP
