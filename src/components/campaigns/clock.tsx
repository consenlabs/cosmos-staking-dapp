import React, { Component } from 'react';

interface Props {
  time: number
  t: any
}

class Clock extends Component<Props, any> {
  constructor(props) {
    super(props)
    this.state = this.getState(props.end_time)
  }

  getState = (end_time) => {
    return {
      day: 0,
      hour: 0,
      minute: 10,
      second: 10,
      isOver: false,
    }
  }

  render() {
    const { day, hour, minute, second, isOver, t } = this.state

    if (isOver) {
      return (
        <span>{t('campaign_over')}</span>
      )
    }
    return (
      <div>
        <div>{day}</div>
        <span>{t('day')}</span>
        <div>{hour}</div>
        <span>:</span>
        <div>{minute}</div>
        <span>:</span>
        <div>{second}</div>
      </div>
    );
  }
}

export default Clock