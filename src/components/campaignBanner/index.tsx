import React, { Component } from 'react'
import { connect } from "react-redux"
import { Link } from 'react-router-dom'
import './index.scss'
import { t, getLocale, isiPhoneX } from '../../lib/utils'
import campaignConfig from '../../config/campaign'
import { selectAccountInfo, selectExchangeToken } from 'lib/redux/selectors'
import buyAtomIcon from '../../assets/buy-atom.svg'
import { goTokenlon } from 'lib/sdk'
import Modal from '../../components/modal'

interface Props {
  size: 'big' | 'small'
  account: any
  exchangeToken: any
}

function getBanner(size) {
  const locale = getLocale()
  let campaign = campaignConfig.find((t) => {
    const current = Date.now()
    return current > (t.duration.start * 1000) && current < (t.duration.end * 1000)
  })
  // show previous event for now
  if (!campaign) {
    return {}
  }
  const activity = campaign.activity
  return {
    img: campaign.imgs[locale][size],
    url: activity ? activity.campaignUrl : '',
    actionType: campaign.actionType
  }
}


class CMP extends Component<Props, any> {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      ...getBanner(props.size)
    }
  }

  render() {
    const { img, url, actionType } = this.state
    if (!img) return null
    if (actionType === 'goTokenlon') {
      return (
        <div>
          <a className="banner" onClick={() => this.setState({ modalVisible: true })}>
            <div>
              <img src={img} alt="staking" />
            </div>
          </a>
          {this.renderModal()}
        </div>
      )
    }
    return <Link className="banner" to={{ pathname: url, state: { size: this.props.size } }}>
      <div>
        <img src={img} alt="staking" />
      </div>
    </Link>
  }

  renderModal = () => {
    const { modalVisible } = this.state
    return (
      <Modal isOpen={modalVisible}
        contentLabel="Reward Modal"
        onRequestClose={this.hideModal}
        styles={{ margin: '10px', bottom: isiPhoneX() ? '12px' : '0', borderRadius: '16px' }}
        appElement={document.body}>
        {this.renderExchangeAtom()}
      </Modal>
    )
  }

  renderExchangeAtom = () => {
    const { account } = this.props

    return <div className="reward-modal-inner">
      <img src={buyAtomIcon} alt="exchange" />
      <span>{t('exchange_atom')}</span>
      <div className="desc">{t('exchange_atom_desc')} </div>
      <div className="ex-address">{account.address} </div>
      <div className="buttons">
        <div className="button cancel-button" onClick={this.hideModal}>{t('cancel')}</div>
        <div className="button confirm-button" onClick={this.doExchange}>{t('confirm')}</div>
      </div>
    </div>
  }

  hideModal = () => {
    this.setState({ modalVisible: false })
  }

  doExchange = () => {
    goTokenlon(this.props)
    this.hideModal()
  }
}

const mapStateToProps = state => {
  return {
    account: selectAccountInfo(state),
    exchangeToken: selectExchangeToken(state),
  }
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
