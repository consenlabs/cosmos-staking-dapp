import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import WaterMark from '../../components/walletMark'
import { t } from '../../lib/utils'
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
        <div className="cs-img">
          <div className="coming-soon">
            <span>{t('proposal_vote')}</span>
            <span>{t('coming_soon')}</span>
          </div>
        </div>
        <div className="bottom"></div>
      </div>
    )
  }
}

const mapStateToProps = _state => {
  return {
  }
}


export default withRouter(connect(mapStateToProps)(Page))
