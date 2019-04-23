import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
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
          <FormattedMessage
            id='my_delegation'
          />
        </Link>
        <Link className={index === 1 ? "selected" : ""} to="/validators">
          <FormattedMessage
            id='validators'
          />
        </Link>
      </div>
    </div>
  }
}

export default CMP
