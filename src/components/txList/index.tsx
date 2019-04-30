import React, { Component } from 'react'
import dayjs from 'dayjs'
import './index.scss'
import { FormattedMessage } from 'react-intl'
import { fAtom, getAmountFromMsg } from 'lib/utils'
import msgTypes from 'lib/msgTypes'

interface Props {
  txs: any[]
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
    const date = dayjs(tx.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')

    return <a className="tx-item" key={tx.rowId} href={`https://www.mintscan.io/txs/${tx.txHash}`}>
      <div className="i-left">
        <FormattedMessage id={msgKey} />
        <i>{date}</i>
      </div>
      {tx.msgType !== msgTypes.withdraw &&
        <div className={`i-right ${isOut ? "delegate" : ""}`}>
          {`${isOut ? '-' : '+'} ${fAtom(amount)} ATOM`}
        </div>
      }
    </a>
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