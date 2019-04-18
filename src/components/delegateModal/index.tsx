import React, { Component } from 'react'
import { connect } from "react-redux"
import { selectAccountInfo } from '../../lib/redux/selectors'
import './index.scss'
import { updateAccount } from 'lib/redux/actions'
import Modal from 'react-modal'
// import * as sdk from '../../lib/sdk'

interface Props {
  visible: boolean
  account: any
  updateAccount: Function
  onRequestClose: Function
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

  componentDidMount() {
  }

  afterOpenModal() { }

  render() {
    const { visible, onRequestClose } = this.props
    return (
      <Modal
        isOpen={visible}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="inner"></div>
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
  updateAccount,
}

export default connect(mapStateToProps, mapDispatchToProps)(CMP)
