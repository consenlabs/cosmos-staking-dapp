import React, { Component } from 'react';
import campaignConfig from '../../../config/campaign'
import '../index.scss'
import ValidatorCard from '../../validatorCard'
import Loading from '../../loading'
import { getLocale, Toast, fAtom, ellipsis, getAmountFromMsg, isiPhoneX } from '../../../lib/utils'
import Detail from '../detail'
import Footer from '../footer'
import Modal from '../../modal'
import * as api from '../../../lib/api'
import { pubsub } from 'lib/event'
import logger from '../../../lib/logger'
import dayjs from 'dayjs'

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

class HashQuark extends Component<Props, any> {
  constructor(props) {
    super(props)
    this.state = {
      info: null,
      modalVisible: false,
      tx: null,
    }
  }

  hideLoadingFn: any = null

  componentDidMount() {
    this.fetchInfo()
    this.checkPendingTx()

    const { history } = this.props
    const state = history.location.state

    let banner = ''
    if (state && state.size) {
      banner = state.size === 'big' ? '1' : '2'  
    }
    
    logger().track('go_campaign', { banner, campaign: 'activity' })
  }

  checkPendingTx = () => {
    const { pendingTxs, history } = this.props
    const state = history.location.state
    if (state && state.txHash) {
      history.replace({ ...history.location, state: {} })
      const tx = pendingTxs[state.txHash]
      if (!tx) return

      this.hideLoadingFn = Toast.loading(tx.txHash, { heading: t('tx_pending'), hideAfter: 0, onClick: () => this.hideLoadingFn() })

      api.checkTx(tx.txHash, 3000, 10).then(() => {
        this.hideLoadingFn && this.hideLoadingFn()
        pubsub.emit('sendTxSuccess')
        
        this.setState({
          tx,
          modalVisible: true,
        }, this.fetchInfo)
      }).catch(e => {
        console.warn(e)
        this.hideLoadingFn && this.hideLoadingFn()
        Toast.error(e.message, { hideAfter: 5 })
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
    const { validators, pool } = this.props

    const validator = validators.find(t => t.operator_address === hashquark.operator_address)
    const start = dayjs.unix(hashquark.duration.start * 1).format('YYYY/MM/DD HH:mm')
    const end = dayjs.unix(hashquark.duration.end * 1).format('YYYY/MM/DD HH:mm')
    const endtime = dayjs.unix(hashquark.duration.end * 1).format('MM.DD HH:mm')

    return (
      <div className="hashquark" style={{ paddingBottom: isiPhoneX() ? 100 : 80 }}>
        <img src={hashquark.banner[locale]} alt="hashquark banner" className="banner" />
        <div className="content">
          <ValidatorCard validator={validator} pool={pool} />
          {this.renderInfoCard()}
          {this.renderDivider()}
          <Detail
            t={t}
            time={`${start} - ${end}`}
            endtime={endtime}
          />
          <Footer
            t={t}
            time={hashquark.duration.end}
            onDelegate={this.onDelegate}
          />
          {this.renderModal()}
        </div>
      </div>
    )
  }

  renderInfoCard = () => {
    const { info } = this.state

    if (!info) {
      return (
        <div className="info-card">
          <Loading />
          <p className="loading-title">{t('data_loading')}</p>
        </div>
      )
    }

    const my_delegated = info.delegated_shares < 0 ? 0 : info.delegated_shares

    return (
      <div className="info-card">
        <div className="flex-center my-delegation">
          <p className="delegated-shares">{`${fAtom(my_delegated)} ATOM`}</p>
          <p className="delegated-shares-desc">{t('delegated')}</p>
        </div>
        <div className="flex-center delegated-info">
          <div className="flex-row-between row-item">
            <span className="row-title">{t('total_delegated')}</span>
            <span className="row-value">{`${fAtom(info.total_delegated)} ATOM`}</span>
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
                      {ellipsis(delegation.address)}
                    </a>
                  </div>
                  <span className="row-value">{`${fAtom(delegation.delegated)} ATOM`}</span>
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

          <p className="title">{`${t('success_delegate', fAtom(getAmountFromMsg(tx)))}`}</p>
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
    logger().track('go_validator_delegate', { moniker: 'hashquark' })
    history.push(`/delegate/${hashquark.operator_address}`, { from: 'campaign' })
  }
}

export default HashQuark