import React, { Component } from 'react'
import { connect } from "react-redux"
import { withRouter, Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { selectValidators, selectAccountInfo, selectDelegations, selectValidatorRewards } from '../../lib/redux/selectors'
import { ellipsis, fAtom, fPercent, isiPhoneX } from '../../lib/utils'
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
  account: any
  match: any
}

class Page extends Component<Props, any> {

  state = {
    txs: []
  }

  componentWillMount() {
    this.updateTxs(this.props)
  }

  componentDidMount() {
    const { match, validators } = this.props
    const id = match.params.id
    const v = validators.find(v => v.operator_address === id)

    logger().track('to_validator_detail', { validator: id, moniker: v ? v.description.moniker : '' })
  }

  componentWillReceiveProps(nextProps) {
    this.updateTxs(nextProps)
  }

  fetched = false
  updateTxs = (props) => {
    const { account, match } = props
    const id = match.params.id

    if (this.fetched || !id || !account.address) return false
    this.fetched = true

    getTxListByAddress(account.address, id).then(txs => {
      if (txs && txs.length) {
        this.setState({ txs })
      }
    })
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
                <img src={linkSVG} />
              </strong>
              <span>{ellipsis(v.operator_address)}</span>
            </div>
          </a>
          <div className="flexWrap">
            <div className="col first">
              <FormattedMessage
                id='bonded_tokens'
              />
              <p>{fAtom(v.tokens)} ATOM</p>
            </div>
            <div className="col">
              <FormattedMessage
                id='delegators'
              />
              <p>{v.delegators}</p>
            </div>
            <div className="col">
              <FormattedMessage
                id='yield'
              />
              <p className="emphasize">{fPercent(v.annualized_returns, 2)}</p>
            </div>
          </div>
        </section>

        {this.renderActivity()}

        <section>
          <p className="title">
            <FormattedMessage
              id='intro'
            />
          </p>
          <div className="desc">{v.description.details || 'no description'}</div>

          {this.renderAdvantage()}

        </section>

        {this.renderTxs()}

        <div className="toolbar" style={{ paddingBottom: isiPhoneX() ? 40 : 0 }}>
          <Link to={`/undelegate/${v.operator_address}`}>
            <FormattedMessage
              id='undelegate'
            />
          </Link>
          <Link to={`/delegate/${v.operator_address}`}>
            <FormattedMessage
              id='delegate'
            />
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

    return (
      <section>
        <p className="title">
          <FormattedMessage
            id='activity'
          />
        </p>
        <a className="box" href="">
          <div>
            <p>
              <FormattedMessage
                id='free_commission_high_yield'
              />
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

    const advs = ['高可用', '抗 DDOS', '哨兵节点']
    return (
      <div className="advantage">
        <p className="title">
          <FormattedMessage
            id='advantage'
          />
        </p>
        <div className="blocksWrap">
          {advs.map(ad => {
            return (
              <div className="block"><span>{ad}</span></div>
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
      <section className="list-area" style={{ 'paddingBottom': isiPhoneX() ? 100 : 60 }}>
        <p className="title">
          <FormattedMessage
            id='transactions'
          />
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
  }
}


export default withRouter(connect(mapStateToProps)(Page))
