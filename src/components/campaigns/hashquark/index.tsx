import React, { Component } from 'react';
import campaignConfig from '../../../config/campaign'
import '../index.scss'
import ValidatorCard from '../../validatorCard'
import Loading from '../../loading'
import { getLocale, Toast, atom } from '../../../lib/utils'
import Detail from '../detail'
import Footer from '../footer'
import Modal from '../../modal'
import * as api from '../../../lib/api'
import { pubsub } from 'lib/event'
import logger from '../../../lib/logger'

const hashquark = campaignConfig[0]
const locale = getLocale()

interface Props {
  locale: string
  validators: any
  pool: any
  pendingTxs: any
  history: any
  account: any
}

const t = (str, ...args) => {
  let value = hashquark.locales[locale][str] || str
  if (args.length) {
    let i = 0
    value = value.replace(/\$s/ig, () => {
      const o = args[i] || ''
      i++
      return o
    })
  }

  return value
}

const formatAddress = (address: string) => {
  return address.substring(0, 10) + ' ... ' + address.substring(38)
}

class HashQuark extends Component<Props, any> {
  constructor(props) {
    super(props)
    this.state = {
      info: null,
      modalVisible: true,
      tx: null,
    }
  }

  componentDidMount() {
    this.fetchInfo()
    this.checkPendingTx()
  }

  checkPendingTx = () => {
    const { pendingTxs, history } = this.props
    const state = history.location.state
    if (state && state.txHash) {
      const tx = pendingTxs[state.txHash]
      if (!tx) return
      api.checkTx(tx.txHash, 3000, 10).then(() => {
        pubsub.emit('sendTxSuccess')
        this.setState({
          tx,
          modalVisible: true,
        }, this.fetchInfo)
      }).catch(e => {
        console.warn(e)
        Toast.error(e.message)
      })
    }
  }

  fetchInfo = () => {
    const { account } = this.props
    api.getHashquarkRankList(account.address).then((data) => {
      if (data) {
        this.setState({ info: data })
      }
    })
  }

  render() {
    const { info } = this.state
    const { validators, pool } = this.props

    if (!info) return <Loading />

    const validator = validators.find(t => t.operator_address === hashquark.operator_address)

    return (
      <div className="hashquark">
        <img src={hashquark.banner[locale]} alt="hashquark banner" className="banner" />
        <div className="content">
          <ValidatorCard validator={validator} pool={pool} isHideBadge={true} />
          {this.renderInfoCard()}
          {this.renderDivider()}
          <Detail t={t} />
          <Footer
            t={t}
            time={info.end_time}
            onDelegate={this.onDelegate}
          />
          {this.renderModal()}
        </div>
      </div>
    )
  }

  renderInfoCard = () => {
    const { info } = this.state
    return (
      <div className="info-card">
        <div className="flex-center my-delegation">
          <p className="delegated-shares">{`${atom(info.delegated_shares)} ATOM`}</p>
          <p className="delegated-shares-desc">{t('delegated')}</p>
        </div>
        <div className="flex-center delegated-info">
          <div className="flex-row-between row-item">
            <span className="row-title">{t('total_delegated')}</span>
            <span className="row-value">{`${atom(info.total_delegated)} ATOM`}</span>
          </div>
          <div className="flex-row-between row-item">
            <span className="row-title">{t('total_delegator')}</span>
            <span className="row-value">{`${info.total_delegator}`}</span>
          </div>
          <div className="delegation-ranking">
            <p className="row-title">{t('top_delegations')}</p>
            {info.top_delegations.map((delegation, idx) => {
              return (
                <div className="flex-row-between" key={idx}>
                  <div>
                    <div className="index-block">{idx + 1}</div>
                    <a
                      className="top-address"
                      href={`https://www.mintscan.io/account/${delegation.address}`}
                    >
                      {formatAddress(delegation.address)}
                    </a>
                  </div>
                  <span className="row-value">{`${atom(delegation.delegated)} ATOM`}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  renderDivider = () => {
    return (
      <div className="divider">
        <div className="line-white"></div>
        <p>{t('campaign_details')}</p>
        <div className="line-white"></div>
      </div>
    )
  }

  renderModal = () => {
    const { modalVisible, tx } = this.state

    if (!tx || !modalVisible) return null

    return (
      <Modal
        isOpen={true}
        contentLabel="Delegate success Modal"
        onRequestClose={() => this.setState({ tx: null, modalVisible: false })}
        styles={{ margin: '0 40px', borderRadius: '16px', position: 'relative', top: '50%', transform: 'translateY(-50%)' }}
        appElement={document.body}>
        <div className="modal-success">
          <img src={require('../../../assets/campaign/delegate-success.png')} />

          <p className="title">{`${t('success_delegate', tx.amount)}`}</p>
          <p className="desc">{t('success_delegate_desc')}</p>
          <button
            className="confirm-button"
            onClick={() => this.setState({ tx: null, modalVisible: false })}
          >{t('confirm')}</button>
        </div>
      </Modal>
    )
  }

  onDelegate = () => {
    const { history } = this.props
    const state = history.location.state

    let banner = ''
    if (state && state.size) {
      banner = state.size === 'big' ? '1' : '2'  
    }
    
    logger().track('submit_delegate_now', { banner })
    history.push(`/delegate/${hashquark.operator_address}`, { from: 'campaign' })
  }
}

export default HashQuark