import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectAccountInfo } from '../../lib/redux/selectors'
import './index.scss'
import Modal from 'react-modal'
import { atom, uatom, thousandCommas, isExist, createTxPayload, createUnDelegateMsg } from 'lib/utils'
import { sendTransaction } from 'lib/sdk'
import { validAmount } from 'lib/validator'
import tokenConfig from '../../config/token'
// import feeConfig from '../../config/fee'
// import * as sdk from '../../lib/sdk'

interface Props {
  visible: boolean
  account: any
  selectedDelegation: any
  onRequestClose: Function
  onDelegateSuccess: Function
}

const customStyles = {
  content: {
    top: '50%',
    left: '0',
    right: '0',
    bottom: '-8px',
    borderRadius: '8px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
};

class CMP extends Component<Props> {

  state = {
    amount: '',
  }

  componentDidMount() {
  }

  afterOpenModal() { }

  onSubmit = () => {
    const { account, selectedDelegation } = this.props
    const delegateBalance = selectedDelegation.shares
    const { address } = account
    const { amount } = this.state
    const [valid, msg] = validAmount(amount, atom(delegateBalance))
    if (!valid) {
      return alert(msg)
    }

    // send delegate apiCall
    const txPayload = createTxPayload(
      address,
      [createUnDelegateMsg(
        address,
        selectedDelegation.validator_address,
        uatom(amount),
        tokenConfig.denom)
      ],
      'undelegate from imToken',
    )

    sendTransaction(txPayload).then(txHash => {
      alert('发送成功: ' + txHash)
      this.props.onRequestClose()
      this.props.onDelegateSuccess()
      console.log(txHash)
    }).catch(e => {
      alert('发送失败: ' + e.message)
    })
  }

  onChange = (event) => {
    this.setState({ amount: event.target.value })
  }

  render() {
    const { visible, onRequestClose, selectedDelegation } = this.props

    if (!selectedDelegation) return null

    const delegateBalance = selectedDelegation.shares
    const { amount } = this.state
    const atomBalance = isExist(delegateBalance) ? thousandCommas(atom(delegateBalance)) : 0
    const disabled = !amount
    return (
      <Modal
        isOpen={visible}
        closeTimeoutMS={300}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Delegate Modal"
      >
        <div className="modal-inner">
          <div className="form-header">
            <span>已抵押</span>
            <i>{atomBalance} ATOM</i>
          </div>
          <input
            type="number"
            placeholder="输入金额"
            value={amount}
            onChange={this.onChange}
            max={atomBalance}
            min={0.000001}
          />
          <button disabled={disabled} className="form-button" onClick={this.onSubmit}>取消委托</button>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: selectAccountInfo(state),
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
