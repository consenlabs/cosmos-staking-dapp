import React, { Component } from 'react'
import dayjs from 'dayjs'
import './index.scss'
import { fAtom, t } from 'lib/utils'

interface Props {
  entries: any[]
}

class UnbondingList extends Component<Props> {

  renderItem(entry) {

    const date = dayjs(entry.completion_time).format('YYYY-MM-DD HH:mm:ss')

    return <div className="entry-item">
      <div className="i-left">
        <span>{`${fAtom(entry.balance)} ATOM`}</span>
        <i>{`${date} ${t('completion')}`}</i>
      </div>
    </div>
  }

  render() {
    const { entries } = this.props

    if (!entries || !entries.length) return null
    const _entries = entries.sort((a, b) => {
      return (new Date(b.completion_time)).getTime() - (new Date(a.completion_time)).getTime()
    })

    return <div className="entry-list">
      {_entries.map(entry => {
        return this.renderItem(entry)
      })}
    </div>
  }
}

export default UnbondingList
