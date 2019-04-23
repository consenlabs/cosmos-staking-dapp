import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
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
        <div className="cs-img">
          <div className="coming-soon">
            <FormattedMessage
              id='proposal_vote'
            />
            <FormattedMessage
              id='coming_soon'
            />
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
