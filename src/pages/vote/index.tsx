import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import WaterMark from '../../components/walletMark'
import './index.scss'

interface Props {
}

class Page extends Component<Props> {

  componentDidMount() {

  }

  render() {

    return (
      <div className="vote-page">
        <WaterMark />
        <div className="coming-soon">🚀 敬请期待...</div>
      </div>
    )
  }
}

const mapStateToProps = _state => {
  return {
  }
}


export default withRouter(connect(mapStateToProps)(Page))
