import React, { Component } from 'react'
import { isiPhoneX } from '../../lib/utils'
import './index.scss'

interface Props {
  time: number
  t: any
  onDelegate: any
}

class Footer extends Component<Props, any> {
  constructor(props) {
    super(props)
    this.state = this.getState(props.time)
  }

  tick: any

  getState = (end_time) => {
    const seconds = end_time * 1000 - Date.now()
    const day = Math.floor(seconds / (1000 * 60 * 60 * 24))
    const hour = Math.floor((seconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minute = Math.floor((seconds % (1000 * 60 * 60)) / (1000 * 60))
    const second = Math.floor((seconds % (1000 * 60))/ (1000))
    return {
      day,
      hour,
      minute,
      second,
      isOver: seconds < 0,
    }
  }

  componentDidMount() {
    this.tick = setInterval(() => {
      this.setState(this.getState(this.props.time))
    }, 1000)
  }

  componentWillUnmount() {
    if (this.tick) {
      clearInterval(this.tick)
    }
  }  

  render() {
    const { day, hour, minute, second, isOver } = this.state
    const { t } = this.props

    const iPhoneX = isiPhoneX()
    const style = {
      height: iPhoneX ? 80 : 60,
      paddingBottom: iPhoneX ? 20 : 0,
    }
    return (
      <footer className="footer flex-row-between" style={style}>
        {isOver ? (
          <div className="campaign-timing">
            <span>{t('campaign_over')}</span>
          </div>
        ) : (
          <div>
            <p className="end-time">{t('end_time')}</p>
            <div className="clock">
              <div>{day}</div>
              <span>{t('day')}</span>
              <div>{hour}</div>
              <span>:</span>
              <div>{minute}</div>
              <span>:</span>
              <div>{second}</div>
            </div>
          </div>
        )}
        <button
          disabled={isOver}
          onClick={this.delegateNow}
          style={isOver ? { color: '#d2d4dd' } : {}}
        >{isOver ?t('campaign_over_button') : t('delegate_now')}</button>
      </footer>
    )
  }

  delegateNow = () => {
    const { isOver } = this.state
    if (isOver) return

    this.props.onDelegate()
  }
}

export default Footer