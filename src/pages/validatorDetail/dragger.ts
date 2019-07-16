import { Draggable } from '@shopify/draggable'
import { isiPhoneX } from '../../lib/utils'

const OFFSET_HEIGHT = 80
const MODAL_HEIGHT = 200
const TOOLBAR_HEIGHT = 54
const IPHONEX_HEIGHT = 40

let clientY = 0

let draggable = null as any

let position = {
  top: 0,
}

function getTop() {
  const wHeight = window.innerHeight
  const top = wHeight - MODAL_HEIGHT - TOOLBAR_HEIGHT - (isiPhoneX() ? IPHONEX_HEIGHT : 0)
  return top
}

function translateMirror(mirror, mirrorCoords) {
  const top = getTop()

  if (mirrorCoords.top <= OFFSET_HEIGHT || mirrorCoords.top >= top) {
    return
  }

  requestAnimationFrame(() => {
    mirror.style.transform = `translate3d(0, ${mirrorCoords.top}px, 0)`
  })
}

function calcOffset(offset) {
  return offset * 2 * 0.5
}

function init({ onStart, onDrag, onStop }: any) {
  const containers = document.querySelectorAll('.validator-detail-page')

  if (containers.length === 0) {
    return false
  }

  draggable = new Draggable(containers, {
    draggable: '.draggable',
    delay: 0,
  })

  let initialMousePosition
  let dragRect

  // --- Draggable events --- //
  draggable.on('drag:start', (evt) => {
    clientY = evt.sensorEvent.clientY
    initialMousePosition = {
      // x: evt.sensorEvent.clientX,
      y: clientY,
    }
    onStart && onStart(evt)
  })

  draggable.on('drag:stop', (evt) => {
    setTimeout(() => {
      const top = getTop()
      const card = document.querySelector('.modal-card.draggable') as any
      if (position.top < top) {
        card.style.top = `${OFFSET_HEIGHT}px`
        // TODO:
        onStop && onStop(evt)
      } else {
        card.style.top = `${top}px`
      }

    }, 1)
  })

  draggable.on('mirror:created', (evt) => {
    dragRect = evt.source.getBoundingClientRect()
  })

  draggable.on('mirror:move', (evt) => {
    // Required to help restrict the draggable element to the container
    evt.cancel()

    // We do not want to use `getBoundingClientRect` while dragging,
    // as that would be very expensive.
    // Instead, we look at the mouse position, which we can ballpark as being
    // close to the center of the draggable element.
    // We need to look at both the X and Y offset and determine which is the higher number.
    // That way we can drag outside of the container and still have the
    // draggable element move appropriately.

    clientY = evt.sensorEvent.clientY
    const offsetY = calcOffset(initialMousePosition.y - clientY)
    const offsetValue = offsetY

    const mirrorCoords = {
      top: dragRect.top - offsetValue,
    }

    position.top = mirrorCoords.top

    translateMirror(evt.mirror, mirrorCoords)

    onDrag && onDrag(evt)
  })

  return draggable
}

export default {
  init,
  destroy: () => draggable && draggable.destroy()
}
