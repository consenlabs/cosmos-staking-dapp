import React, { Component } from 'react'
import { connect } from "react-redux"
import { t } from '../../lib/utils'
import { selectAccountInfo, selectDelegations, selectValidatorRewards } from '../../lib/redux/selectors'
import './index.scss'
import Modal from '../../components/modal'
import withdrawIcon from '../../assets/withdraw.svg'
import withdrawBigIcon from '../../assets/big-withdraw.svg'
import compoundIcon from '../../assets/compound.svg'
import compoundBigIcon from '../../assets/big-compound.svg'

interface Props {
  account: any
  validatorRewards: any
  delegations: any
}

class CMP extends Component<Props> {

  state = {
    modalVisible: false,
  }

  componentDidMount() { }

  hideModal = () => {
    this.setState({ modalVisible: false })
  }

  doWithdrawAll = () => {

  }

  doCompound = () => {

  }

  renderWidthdrawBox = () => {
    return <div className="reward-modal-inner">
      <img src={withdrawBigIcon} alt="withdraw-all" />
      <span>{t('confirm_withdraw')}</span>
      <div className="desc">{t('withdraw_all_reward')} 492.357856 ATOM</div>
      <div className="buttons">
        <div className="button cancel-button" onClick={this.hideModal}>{t('cancel')}</div>
        <div className="button confirm-button" onClick={this.doWithdrawAll}>{t('confirm')}</div>
      </div>
    </div>
  }

  renderCompoundBox = () => {
    return <div className="reward-modal-inner">
      <img src={compoundBigIcon} alt="compound" />
      <span>{t('confirm_compound')}</span>
      <div className="desc">{t('compound_all_reward')}</div>
      <div className="buttons">
        <div className="button cancel-button" onClick={this.hideModal}>{t('cancel')}</div>
        <div className="button confirm-button" onClick={this.doCompound}>{t('confirm')}</div>
      </div>
    </div>
  }

  render() {
    const { modalVisible } = this.state

    return (
      <div className="reward-toolbar">
        <div>
          <img src={withdrawIcon} alt="withdraw-all" />
          <span>{t('withdraw')}</span>
        </div>
        <div>
          <img src={compoundIcon} alt="compound" />
          <span>{t('compound')}</span>
        </div>

        <Modal isOpen={modalVisible}
          contentLabel="Reword Modal"
          onRequestClose={this.hideModal}
          styles={{ margin: '10px', bottom: '0', borderRadius: '16px' }}
          appElement={document.body}>
          {this.renderCompoundBox()}
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: selectAccountInfo(state),
    delegations: selectDelegations(state),
    validatorRewards: selectValidatorRewards(state),
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
