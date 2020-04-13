import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import { selectValidators, selectAccountInfo, selectDelegations, selectValidatorRewards, selectPendingTxs, selectUnbondingDelegations } from '../../lib/redux/selectors'
import { removePendingTx, updateUnbondingDelegations } from 'lib/redux/actions'
import { ellipsis, fAtom, fPercent, isiPhoneX, t, getLocale, getUnbondingBalance, getDailyReward, Toast } from '../../lib/utils'
import ValidatorLogo from '../../components/validatorLogo'
import Loading from '../../components/loading'
import TxList from '../../components/txList'
import UnbondingList from '../../components/unbondingList'
import './index.scss'
import logger from '../../lib/logger'
import linkSVG from '../../assets/link.svg'
import { getTxListByAddress, getUnbondingDelegations } from '../../lib/api'
import bannerConfig from '../../config/banner'
import campaignConfig from '../../config/campaign'
import descConfig from '../../config/desc'
import Arrow from '../../assets/arrow.svg'
import DELETATE from '../../assets/delegate.svg'
import REDELEGATE from '../../assets/redelegate.svg'
import WITHDRAW from '../../assets/withdraw.svg'
import ARROW_BLUE from '../../assets/arrow-blue.svg'
import FLAG from '../../assets/flag.svg'
import dayjs from 'dayjs'
import Drawer from '../../components/draggableDrawer'

interface Props {
  validators: any
  delegations: any
  validatorRewards: any
  pendingTxs: any
  account: any
  match: any
  history: any
  unbondingDelegations: any[]
  removePendingTx: (value: any) => any
}

/**
 * cache txs result in memory, render before remote tx loaded
 */
const validatorTxsCache = {}

//
const OFFSET_HEIGHT = 80
const MODAL_HEIGHT = 200
const TOOLBAR_HEIGHT = 54
const IPHONEX_HEIGHT = 40

class Page extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = {
      txs: [],
      open: false,
    }
  }

  componentWillMount() {
    this.updateTxs(this.props)
    this.polling()
  }

  componentWillUnmount() {
    this.pollingTimer && clearInterval(this.pollingTimer)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.account.address && !this.props.account.address) {
      this.updateTxs(nextProps)
    }
  }

  componentDidMount() {
    const { match, validators } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    let txs = []
    if (v) {
      txs = validatorTxsCache[v.operator_address] || []
    }
    this.setState({ txs: this.mergeWithPendingTx(txs) })
    logger().track('to_validator_detail', { validator: id, moniker: v ? v.description.moniker : '' })
  }

  pollingTimer: any = null
  card: any = null

  polling = () => {
    this.pollingTimer && clearInterval(this.pollingTimer)
    this.pollingTimer = setInterval(() => {
      this.updateTxs(this.props)
      this.updateUnbondingList()
    }, 5000)
  }

  updateUnbondingList = () => {
    const { account } = this.props
    getUnbondingDelegations(account.address).then(data => {
      updateUnbondingDelegations(data)
    }).catch(console.warn)
  }

  updateTxs = (props) => {
    const { account, match } = props
    const id = match.params.id

    if (!id || !account.address) return false

    getTxListByAddress(account.address, id).then(txs => {
      if (txs && txs.length) {
        validatorTxsCache[id] = txs
        this.setState({ txs: this.mergeWithPendingTx(txs) })
      }
    }).catch(console.warn)
  }

  mergeWithPendingTx = (txs) => {
    const { pendingTxs, match, removePendingTx } = this.props
    const id = match.params.id
    const toAddedTxs: any = []

    for (let txHash in pendingTxs) {
      const pendingTx = pendingTxs[txHash]
      if (pendingTx.validatorId === id) {
        const pendingTxInRemote = txs.find(tx => tx.txHash === txHash)
        if (pendingTxInRemote) {
          removePendingTx(pendingTxInRemote.txHash)
        } else {
          toAddedTxs.push(pendingTx)
        }
      }
    }
    return toAddedTxs.concat(txs)
  }

  render() {
    const { validators, match } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)
    const vdesc = descConfig.find(v => v.operator_address === id)
    const locale = getLocale()
    const desc = vdesc && vdesc.desc && vdesc.desc[locale]

    if (!v) return <Loading />

    const height = window.innerHeight - MODAL_HEIGHT - TOOLBAR_HEIGHT - (isiPhoneX() ? IPHONEX_HEIGHT : 0)

    return (
      <div className="validator-detail-page" style={{ height }}>
        <section>
          <a className="top" href={v.description.website || '#'}>
            <ValidatorLogo url={v.description.logo} />
            <div className="left">
              <strong>{v.description.moniker}
                <img src={linkSVG} alt="website" />
              </strong>
              <span>{ellipsis(v.operator_address)}</span>
            </div>
          </a>
          <div className="flexWrap">
            <div className="col first">
              <span>{t('bonded_tokens')}(ATOM)</span>
              <p>{fAtom(v.tokens)}</p>
            </div>
            <div className="col">
              <span>{t('delegators')}</span>
              <p>{v.delegators}</p>
            </div>
            <div className="col">
              <span>{t('yield')}</span>
              <p className="emphasize">{fPercent(v.annualized_returns, 2)}</p>
            </div>
          </div>
        </section>

        {this.renderActivity()}

        <section>
          <p className="title">
            <span>{t('intro')}</span>
          </p>
          <div className="desc">{desc || v.description.details || 'no description'}</div>

          {this.renderAdvantage()}

        </section>

        {this.renderCardModal()}

        {this.renderToolbar()}
      </div>
    )
  }

  renderActivity() {
    const { match, history } = this.props
    const id = match.params.id
    const v = campaignConfig.find(v => v.operator_address === id)
    const locale = getLocale()

    if (!v || !v.activity) return null
    const activity = v.activity

    const start = dayjs.unix(v.duration.start * 1).format('YYYY/MM/DD HH:mm')
    const end = dayjs.unix(v.duration.end * 1).format('YYYY/MM/DD HH:mm')
    const isOver = Date.now() > v.duration.end * 1000
    const isStarted = Date.now() > v.duration.start * 1000

    if (!isStarted || isOver) return null

    return (
      <section>
        <p className="title">
          <span>{t('activity')}</span>
        </p>
        <div className="box" onClick={() => {
          if (activity.url) {
            if (activity.url.startsWith('http')) {
              window.location.href = activity.url.replace(/__locale__/, locale)
            } else {
              history.push(activity.url)
            }
          }
        }}>
          <div>
            <p>
              <span>{activity.name[locale]}</span>
            </p>
            <span className="date">{isOver ? `(${t('campaign_over')})` : `${start} - ${end}`}</span>
          </div>
          <img src={Arrow} />
        </div>
      </section>
    )
  }

  renderAdvantage() {
    const { match } = this.props
    const id = match.params.id
    const v = bannerConfig.find(v => v.operator_address === id)

    if (!v) return null
    return null

    const advs = ['hide_availability', 'anti_ddos', 'sentry_node']
    return (
      <div className="advantage">
        <p className="title">
          <span>{t('advantage')}</span>
        </p>
        <div className="blocksWrap">
          {advs.map(ad => {
            return (
              <div className="block" key={ad}>
                <span>{t(ad)}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  renderCardModal() {
    const { match, delegations } = this.props
    const id = match.params.id
    const d = delegations.find(d => d.validator_address === id)
    if (!d) return null

    const minHeight = window.innerHeight - OFFSET_HEIGHT
    const top = {
      min: OFFSET_HEIGHT,
      max: this.getModalTop(),
    }

    return (
      <Drawer
        range={top}
        onDrag={() => { }}
        containerElementClass="drawer"
        modalElementClass="drawer-modal"
        ref={(ref) => this.card = ref}
      >
        <div className="modal-card" style={{ minHeight }}>
          <div className="flag drawer-flag" onClick={this.handleFlagClick}><img src={FLAG} alt="flag" /></div>
          <div className="card-inner">
            {this.renderDelegation()}
            {this.renderUnbondingList()}
            {this.renderTxs()}
          </div>
        </div>
      </Drawer>
    )
  }

  renderDelegation() {
    const { validators, match, validatorRewards, delegations, unbondingDelegations } = this.props
    const id = match.params.id
    const reward = validatorRewards[id] || 0
    const unDels = unbondingDelegations.filter(un => un.validator_address === id)
    const unbonding = getUnbondingBalance(unDels) || 0
    const d = delegations.find(d => d.validator_address === id) || {}
    const v = validators.find(v => v.operator_address === id) || {}
    const shares = d.balance || 0

    return (
      <div className="delegation list-section">
        <p className="title">{t('delegation_status')}</p>
        <div className="bottom">
          <div>
            <div>
              <span>{t('delegations')}</span>
              <i>{fAtom(shares)}</i>
            </div>

            <div>
              <span>{t('undelegating')}</span>
              <i>{fAtom(unbonding)}</i>
            </div>
          </div>
          <div className="split-line"></div>
          <div>
            <div>
              <span>{t('rewards')}</span>
              <i>{fAtom(reward)}</i>
            </div>

            <div>
              <span>{t('rewards_per_day')}</span>
              <i>{shares && v.annualized_returns ? `+${getDailyReward(shares, v.annualized_returns)}` : '0'}</i>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderUnbondingList() {
    const { match, account, unbondingDelegations } = this.props
    const id = match.params.id
    const unBonding = unbondingDelegations.find(un => un.validator_address === id)

    if (!unBonding || !unBonding.entries) return null

    const entries = unBonding.entries
    const MAX_LENGTH = 5

    return (
      <div className="list-section">
        <p className="title">
          <span>{t('undelegating')}</span>
          {entries.length >= MAX_LENGTH && <a href={`https://www.mintscan.io/account/${account.address}`}>{t('all')} <img src={ARROW_BLUE} alt="arrow" /></a>}
        </p>
        <UnbondingList entries={entries.slice(0, MAX_LENGTH)} account={account} />
      </div>
    )
  }

  renderTxs() {
    const { txs } = this.state
    const { account } = this.props

    if (!txs || !txs.length) return null
    const MAX_LENGTH = 5
    const paddingBottom = isiPhoneX() ? TOOLBAR_HEIGHT + IPHONEX_HEIGHT : TOOLBAR_HEIGHT

    return (
      <div className="list-section" style={{ paddingBottom }}>
        <p className="title">
          <span>{t('transactions')}</span>
          {txs.length >= MAX_LENGTH && <a href={`https://www.mintscan.io/account/${account.address}`}>{t('all')} <img src={ARROW_BLUE} alt="arrow" /></a>}
        </p>
        <TxList txs={txs.slice(0, MAX_LENGTH)} />
      </div>
    )

  }

  renderToolbar() {
    const { match, validators, delegations } = this.props
    const id = match.params.id
    const d = delegations.find(d => d.validator_address === id)
    const v = validators.find(v => v.operator_address === id)

    if (d) {
      return (
        <div className="toolbar" style={{ padding: 0 }}>
          <div className="toolbar-row" style={{ paddingBottom: isiPhoneX() ? IPHONEX_HEIGHT : 0 }}>
            <Link to={`/delegate/${v.operator_address}`}>
              <img src={DELETATE} alt="delegate" />
              <span>{t('delegate')}</span>
            </Link>
            <div className="vertical-line"></div>

            {d ? <Link to={`/redelegate/${v.operator_address}`}>
              <img src={REDELEGATE} alt="redelegate" />
              <span>{t('redelegate')}</span>
            </Link> : <a onClick={this.handleBan}>
                <img src={REDELEGATE} alt="redelegate" />
                <span>{t('redelegate')}</span>
              </a>}

            <div className="vertical-line"></div>

            {d ? <Link to={`/undelegate/${v.operator_address}`}>
              <img src={WITHDRAW} alt="delegate" />
              <span>{t('withdraw')}</span>
            </Link> : <a onClick={this.handleBan}>
                <img src={WITHDRAW} alt="delegate" />
                <span>{t('withdraw')}</span>
              </a>}
          </div>
        </div>
      )
    }

    return (
      <div className="toolbar" style={{ paddingBottom: isiPhoneX() ? IPHONEX_HEIGHT : 10 }}>
        <Link to={`/delegate/${v.operator_address}`} className="btn">
          <span>{t('delegate')}</span>
        </Link>
      </div>
    )
  }

  getModalTop = () => {
    const wHeight = window.innerHeight
    const top = wHeight - MODAL_HEIGHT - TOOLBAR_HEIGHT - (isiPhoneX() ? IPHONEX_HEIGHT : 0)
    return top
  }

  handleFlagClick = () => {
    const { open } = this.state
    if (open) {
      this.card.showDrawer()
    } else {
      this.card.hideDrawer()
    }
    this.setState({ open: !open })
  }

  handleBan = () => {
    Toast.warn(t('no_delegation'), { hideAfter: 2 })
  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    delegations: selectDelegations(state),
    account: selectAccountInfo(state),
    validatorRewards: selectValidatorRewards(state),
    pendingTxs: selectPendingTxs(state),
    unbondingDelegations: selectUnbondingDelegations(state),
  }
}

const mapDispatchToProps = {
  removePendingTx,
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page))
