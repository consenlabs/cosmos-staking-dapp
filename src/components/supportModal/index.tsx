import React, { Component } from 'react'
import { t, isiPhoneX, compareSemver } from '../../lib/utils'
import Modal from '../modal'
import * as sdk from 'lib/sdk'
import noWalletIcon from '../../assets/no-wallet.svg'
import updateAppIcon from '../../assets/update-app.svg'

interface Props {

}

interface State {
  modalVisible: boolean
  title: string
  desc: string
  icon: any
}

class SupportModal extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      title: '',
      desc: '',
      icon: ''
    }
  }

  componentDidMount() {
    this.checkSupport()
  }

  checkSupport = () => {
    // not open in imToken
    if (!window['imToken']['callAPI']) return

    // imToken version too low
    const version = (window['imTokenAgent'] || '').split(':')[1]
    if (!(version && compareSemver(version, '2.4.0') >= 0)) {
      this.setState({
        modalVisible: true,
        title: t('update_app_title'),
        desc: t('update_app_desc'),
        icon: updateAppIcon,
      });
      return
    }

    // not cosmos wallet
    sdk.getAccounts().then(accounts => {
      if (!accounts.length) {
        this.setState({
          modalVisible: true,
          title: t('no_wallet_title'),
          desc: t('no_wallet_desc'),
          icon: noWalletIcon,
        });
      }
    }).catch(console.warn)
  }

  render() {
    const { title, desc, icon, modalVisible } = this.state

    if (!modalVisible) return null

    return (
      <Modal
        isOpen={true}
        contentLabel="imToken version Modal"
        onRequestClose={() => { }}
        styles={{ margin: '10px', bottom: isiPhoneX() ? '12px' : '0', borderRadius: '16px' }}
        appElement={document.body}
      >
        <div className="reward-modal-inner">
          <img src={icon} alt={title} />
          <span>{title}</span>
          <div className="desc">{desc}</div>
          <div className="buttons">
            <div className="button confirm-button" onClick={this.onUnderstood}>{t('understood')}</div>
          </div>
        </div>
      </Modal>
    )
  }

  onUnderstood = () => {
    if (window['imToken']['callAPI']) {
      window['imToken'].callAPI('navigator.closeDapp')
    }
  }
}

export default SupportModal