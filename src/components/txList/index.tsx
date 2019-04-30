import React, { Component } from 'react'
import './index.scss'
import { FormattedMessage } from 'react-intl'
import { fAtom, getAmountFromMsg } from 'lib/utils'
import msgTypes from 'lib/msgTypes'

interface Props {
  txs: any[]
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  let month = '' + (date.getMonth() + 1)
  month = month.length < 2 ? `0${month}` : `${month}`

  let day = '' + date.getDate()
  day = day.length < 2 ? `0${day}` : `${day}`

  let h = '' + date.getHours()
  h = h.length < 2 ? `0${h}` : `${h}`

  let m = '' + date.getMinutes()
  m = m.length < 2 ? `0${m}` : `${m}`

  let s = '' + date.getSeconds()
  s = s.length < 2 ? `0${s}` : `${s}`

  return `${year}-${month}-${day} ${h}:${m}:${s}`
}

class CMP extends Component<Props> {

  getKeyOfType(type) {
    return {
      [msgTypes.send]: 'transfer',
      [msgTypes.delegate]: 'delegate',
      [msgTypes.undelegate]: 'undelegate',
      [msgTypes.withdraw]: 'withdraw',
      [msgTypes.redelegate]: 'redelegate',
    }[type]
  }

  renderItem(tx) {

    const isOut = [msgTypes.send, msgTypes.delegate, msgTypes.redelegate].includes(tx.msgType)
    const amount = getAmountFromMsg(tx)
    const msgKey = this.getKeyOfType(tx.msgType)

    return <div className="tx-item" key={tx.rowId}>
      <div className="i-left">
        <FormattedMessage id={msgKey} />
        <i>{formatTime(tx.timestamp)}</i>
      </div>
      <div className={`i-right ${isOut ? "delegate" : ""}`}>
        {`${isOut ? '-' : '+'} ${fAtom(amount)} ATOM`}
      </div>
    </div>
  }

  render() {
    const { txs } = this.props

    if (!txs || !txs.length) return null

    return <div className="tx-list">
      {txs.map(tx => {
        return this.renderItem(tx)
      })}
    </div>
  }
}

export default CMP
