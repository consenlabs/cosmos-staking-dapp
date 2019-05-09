import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import { selectValidators, selectAccountInfo, selectDelegations, selectValidatorRewards, selectPendingTxs } from '../../lib/redux/selectors'
import { removePendingTx } from 'lib/redux/actions'
import { ellipsis, fAtom, fPercent, isiPhoneX, t } from '../../lib/utils'
import ValidatorLogo from '../../components/validatorLogo'
import Loading from '../../components/loading'
import TxList from '../../components/txList'
import './index.scss'
import logger from '../../lib/logger'
import linkSVG from '../../assets/link.svg'
import { getTxListByAddress } from '../../lib/api'
import bannerConfig from '../../config/banner'
import Arrow from '../../assets/arrow.svg'

interface Props {
  validators: any
  delegations: any
  validatorRewards: any
  pendingTxs: any
  account: any
  match: any
  removePendingTx: (value: any) => any
}

/**
 * cache txs result in memory, render before remote tx loaded
 */
const validatorTxsCache = {}

class Page extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = {
      txs: [],
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

  polling = () => {
    this.pollingTimer && clearInterval(this.pollingTimer)
    this.pollingTimer = setInterval(() => this.updateTxs(this.props), 5000)
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
    })
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

    if (!v) return <Loading />

    return (
      <div className="validator-detail-page">
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
              <span>{t('bonded_tokens')}</span>
              <p>{fAtom(v.tokens)} ATOM</p>
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
          <div className="desc">{v.description.details || 'no description'}</div>

          {this.renderAdvantage()}

        </section>

        {this.renderTxs()}

        <div className="toolbar" style={{ paddingBottom: isiPhoneX() ? 40 : 0 }}>
          <Link to={`/undelegate/${v.operator_address}`}>
            <span>{t('withdraw')}</span>
          </Link>
          <Link to={`/delegate/${v.operator_address}`}>
            <span>{t('delegate')}</span>
          </Link>
        </div>
      </div>
    )
  }

  renderActivity() {
    const { match } = this.props
    const id = match.params.id
    const v = bannerConfig.find(v => v.operator_address === id)

    if (!v) return null
    return null // TODO: hidden activity right now, need  activity link update

    return (
      <section>
        <p className="title">
          <span>{t('activity')}</span>
        </p>
        <a className="box" href="">
          <div>
            <p>
              <span>{t('free_commission_high_yield')}</span>
            </p>
            <span className="date">2019-4-25 ~ 2019-5-30</span>
          </div>
          <img src={Arrow} />
        </a>
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

  renderTxs() {
    const { txs } = this.state

    if (!txs || !txs.length) return null

    return (
      <section className="list-area" style={{ 'paddingBottom': isiPhoneX() ? '100px' : '60px' }}>
        <p className="title">
          <span>{t('transactions')}</span>
        </p>
        <TxList txs={txs} />
      </section>
    )

  }
}

const mapStateToProps = state => {
  return {
    validators: selectValidators(state),
    delegations: selectDelegations(state),
    account: selectAccountInfo(state),
    validatorRewards: selectValidatorRewards(state),
    pendingTxs: selectPendingTxs(state),
  }
}

const mapDispatchToProps = {
  removePendingTx,
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page))
