import React, { Component } from 'react';
import campaignConfig from '../../../config/campaign'
import '../index.scss'
import ValidatorCard from '../../validatorCard'
import Loading from '../../loading'
import { getLocale } from '../../../lib/utils'
import Detail from '../detail'

const hashquark = campaignConfig.hashquark
const locale = getLocale()

interface Props {
  locale: string
  validators: any
  pool: any
}

const t = (str) => {
  return hashquark.locales[locale][str] || str
}

const formatAddress = (address: string) => {
  return address.substring(0, 10) + '......' + address.substring(38)
}

class HashQuark extends Component<Props, any> {
  constructor(props) {
    super(props)
    this.state = {
      info: null,
    }
  }

  componentDidMount() {
    this.setState({
      info: {
        delegated_shares: 1000,
        total_delegated: 20000,
        total_delegator: 128,
        top_delegations: [{
          address: 'cosmos19jgs45pn0h80qchmmymrrtaslhfa9wvgz2wp3l',
          delegated: 100,
        }, {
          address: 'cosmos19jgs45pn0h80qchmmymrrtaslhfa9wvgz2wp3l',
          delegated: 100,
        }, {
          address: 'cosmos19jgs45pn0h80qchmmymrrtaslhfa9wvgz2wp3l',
          delegated: 100,
        }]
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
          <Detail t={t} campaign={hashquark} />
          {this.renderFooter()}
        </div>
      </div>
    )
  }

  renderInfoCard = () => {
    const { info } = this.state
    return (
      <div className="info-card">
        <div className="flex-center my-delegation">
          <p className="delegated-shares">{`${info.delegated_shares} ATOM`}</p>
          <p className="delegated-shares-desc">{t('delegated')}</p>
        </div>
        <div className="flex-center delegated-info">
          <div className="flex-row-between row-item">
            <span className="row-title">{t('total_delegated')}</span>
            <span className="row-value">{`${info.total_delegated} ATOM`}</span>
          </div>
          <div className="flex-row-between row-item">
            <span className="row-title">{t('total_delegator')}</span>
            <span className="row-value">{`${info.total_delegator}`}</span>
          </div>
          <div className="delegation-ranking">
            <p className="row-title">{t('top_delegations')}</p>
            {info.top_delegations.map((delegation, idx) => {
              return (
                <div className="flex-row-between">
                  <div>
                    <div className="index-block">{idx + 1}</div>
                    <span className="top-address">{formatAddress(delegation.address)}</span>
                  </div>
                  <span className="row-value">{`${delegation.delegated} ATOM`}</span>
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

  renderFooter = () => {
    return (
      <footer className="footer flex-row-between">
        <div>
          <p className="end-time">{t('end_time')}</p>
        </div>
        <button>{t('delegate_now')}</button>
      </footer>
    )
  }
}

export default HashQuark