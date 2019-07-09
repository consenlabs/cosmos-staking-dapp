import React, { Component } from 'react'
import dayjs from 'dayjs'
import './index.scss'
import { fAtom, t } from 'lib/utils'

interface Props {
  entries: any[]
  account: any
}

class UnbondingList extends Component<Props> {

  renderItem(entry) {
    const { account } = this.props
    const date = dayjs(entry.completion_time).format('YYYY-MM-DD HH:mm:ss')

    return <a key={entry.completion_time} className="entry-item" href={`https://www.mintscan.io/account/${account.address}`}>
      <div className="i-left">
        <span>{`${fAtom(entry.balance)} ATOM`}</span>
        <i>{`${date} ${t('completion')}`}</i>
      </div>
    </a>
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
