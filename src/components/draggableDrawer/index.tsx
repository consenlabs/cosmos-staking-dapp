import React, { Component } from 'react'
import { createPortal } from "react-dom"
import { Motion, spring, presets } from "react-motion"
import document from "global/document"
import Observer from "react-intersection-observer"
import { css } from "emotion"
import { isClientSide } from "./helpers"

if (isClientSide()) {
  require("intersection-observer")
}

interface Props {
  children: any
  range: {
    min: any,
    max: any
  }
  dontApplyListeners?: boolean
  onDrag?: any
  inViewportChange?: any
  modalElementClass?: any
  parentElement?: any
  containerElementClass?: string
  getContainerRef?: any
  getModalRef?: any
}

export default class DraggableDrawer extends Component<Props, any> {
  static defaultProps = {
    onDrag: () => { },
    inViewportChange: () => { },
    getContainerRef: () => { },
    getModalRef: () => { },
    parentElement: document.body,
    dontApplyListeners: false,
    containerElementClass: "",
    modalElementClass: ""
  }

  state = {
    thumb: 0,
    start: 0,
    position: 0,
    touching: false,
    listenersAttached: false,
    top: this.props.range.max,
  }

  MAX_NEGATIVE_SCROLL = 20
  SCROLL_TO_CLOSE = 75
  ALLOW_DRAWER_TRANSFORM = true

  drawer = null as any
  NEW_POSITION = 0
  MOVING_POSITION = 0
  NEGATIVE_SCROLL = 0

  componentDidMount() {}

  componentWillReceiveProps(nextPorps) {
    if (nextPorps.range.min !== this.props.range.min ||
      nextPorps.range.max !== this.props.range.max) {
        this.setState({ top: nextPorps.range.max })
    }
  }

  componentDidUpdate() {
    if (this.drawer) {
      this.getNegativeScroll(this.drawer)
    }
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  attachListeners = drawer => {
    const { dontApplyListeners, getModalRef } = this.props
    const { listenersAttached } = this.state

    // only attach listeners once as this function gets called every re-render
    if (!drawer || listenersAttached || dontApplyListeners) return

    this.drawer = drawer
    getModalRef(drawer)

    this.drawer.addEventListener("touchend", this.release)
    this.drawer.addEventListener("touchmove", this.drag)
    this.drawer.addEventListener("touchstart", this.tap)

    const position = 0

    this.setState({ listenersAttached: true, position }, () => {
      setTimeout(() => {
        // trigger reflow so webkit browsers calculate height properly 😔
        // https://bugs.webkit.org/show_bug.cgi?id=184905
        this.drawer.style.display = "none"
        void this.drawer.offsetHeight
        this.drawer.style.display = ""
      }, 300)
    })
  }

  removeListeners = () => {
    if (!this.drawer) return

    this.drawer.removeEventListener("touchend", this.release)
    this.drawer.removeEventListener("touchmove", this.drag)
    this.drawer.removeEventListener("touchstart", this.tap)

    this.setState({ listenersAttached: false })
  }

  tap = event => {
    const { pageY } = event.touches[0]
    const start = pageY

    // reset NEW_POSITION and MOVING_POSITION
    this.NEW_POSITION = 0
    this.MOVING_POSITION = 0

    this.setState(() => {
      return {
        thumb: start,
        start: start,
        touching: true
      }
    })
  }

  drag = event => {
    const { range } = this.props
    const { thumb, position, top } = this.state
    const { pageY } = event.touches[0]

    const movingPosition = pageY
    const delta = movingPosition - thumb
    const newPosition = position + delta

    if (newPosition > 0 && this.ALLOW_DRAWER_TRANSFORM) {
      // stop android's pull to refresh behavior
      event.preventDefault()

      this.props.onDrag({ newPosition })
      // we set this, so we can access it. Since setState is async, we're not guranteed we'll have the
      // value in time
      this.MOVING_POSITION = movingPosition
      this.NEW_POSITION = newPosition

      // not at the bottom
      if (this.NEGATIVE_SCROLL < newPosition) {
        this.setState(() => {
          return {
            thumb: movingPosition,
            position: newPosition,
          }
        })
      }
    } else if (newPosition < 0 && top === range.max) {
      event.preventDefault()
      this.props.onDrag({ newPosition })
      this.MOVING_POSITION = movingPosition
      this.NEW_POSITION = newPosition

      // not at the bottom
      if (this.NEGATIVE_SCROLL < newPosition) {
        this.setState(() => {
          return {
            thumb: movingPosition,
            position: newPosition,
          }
        })
      }
    }
  }

  release = _event => {
    const { range } = this.props
    const { start: touchStart, top } = this.state

    const initialPosition = 0

    this.setState(() => {
      return {
        touching: false
      }
    })

    // drag up from bottom
    if (
      top === range.max &&
      this.NEW_POSITION < initialPosition &&
      touchStart - this.MOVING_POSITION > this.SCROLL_TO_CLOSE
    ) {
      return this.showDrawer()
    }

    // drag down
    if (
      this.NEW_POSITION >= initialPosition &&
      this.MOVING_POSITION - touchStart > this.SCROLL_TO_CLOSE
    ) {
      return this.hideDrawer()
    }

    const newPosition = 0
    this.setState(() => {
      return {
        position: newPosition
      }
    })
  }

  getNegativeScroll = element => {
    const size = this.getElementSize()
    this.NEGATIVE_SCROLL = size - element.scrollHeight - this.MAX_NEGATIVE_SCROLL
  }

  hideDrawer = () => {
    const { range } = this.props
    this.setState(() => {
      return {
        position: 0,
        top: range.max,
        thumb: 0,
        touching: false
      }
    })
  }

  showDrawer = () => {
    const { range } = this.props
    this.setState(() => {
      return {
        position: 0,
        top: range.min,
        thumb: 0,
        touching: false
      }
    })
  }

  getDrawerTransform = value => {
    return { transform: `translate3d(0, ${value}px, 0)` }
  }

  getElementSize = () => {
    return window.innerHeight
  }

  getPosition() {
    const { position } = this.state
    return position
  }

  inViewportChange = inView => {
    this.props.inViewportChange(inView)
    this.ALLOW_DRAWER_TRANSFORM = inView
  }

  preventDefault = event => event.preventDefault()
  stopPropagation = event => event.stopPropagation()

  render() {
    const { containerElementClass, getContainerRef, range } = this.props

    // if we're not client side we need to return early because createPortal is only
    // a clientside method
    if (!isClientSide()) {
      return null
    }

    const { touching, top } = this.state

    const animationSpring = touching
      ? { damping: 20, stiffness: 300 }
      : presets.noWobble

    const hiddenPosition = 0
    const position = this.getPosition()

    // Style object for the container element
    let containerStyle = {
      top,
      overflowY: top === range.max ? 'initial' : 'auto',
    } as any

    return createPortal(
      <Motion
        style={{
          translate: spring(position, animationSpring)
        }}
        defaultStyle={{
          translate: hiddenPosition
        }}
      >
        {({ translate }) => {
          return (
            <div
              style={containerStyle}
              onClick={this.hideDrawer}
              className={`${Container} ${containerElementClass} `}
              ref={getContainerRef}
            >
              {
              // @ts-ignore
              <Observer
                className={HaveWeScrolled}
                onChange={this.inViewportChange}
              />
              }

              <div
                onClick={this.stopPropagation}
                style={this.getDrawerTransform(translate)}
                ref={this.attachListeners}
                className={this.props.modalElementClass || ""}
              >
                {this.props.children}
              </div>
            </div>
          )
        }}
      </Motion>,
      this.props.parentElement,
    )
  }
}

const Container = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  align-items: center;
  z-index: 11;
  transition: background-color 0.2s linear;
  -webkit-overflow-scrolling: touch;
`;

const HaveWeScrolled = css`
  position: absolute;
  top: 0;
  height: 1px;
  width: 100%;
`;
