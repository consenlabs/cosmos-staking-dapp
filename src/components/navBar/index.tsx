import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { t } from '../../lib/utils'
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
          <span>{t('my_delegations')}</span>
        </Link>
        <Link className={index === 1 ? "selected" : ""} to="/validators">
          <span>{t('validators')}</span>
        </Link>
      </div>
    </div>
  }
}

export default CMP
