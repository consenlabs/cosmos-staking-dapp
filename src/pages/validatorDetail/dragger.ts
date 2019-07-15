import { Draggable } from '@shopify/draggable'

const OFFSET_HEIGHT = 80

let clientY = 0

// 1 up / -1 down
let direction = 0

let position = {
  top: 0,
}

function translateMirror(mirror, mirrorCoords, containerRect) {
  console.log('mirrorCoords', mirrorCoords.top)
  console.log('containerRect', containerRect.top)

  if (mirrorCoords.top <= OFFSET_HEIGHT) {
    return
  }

  requestAnimationFrame(() => {
    mirror.style.transform = `translate3d(0, ${mirrorCoords.top}px, 0)`
  })
}

function calcOffset(offset) {
  return offset * 2 * 0.5
}

export default function DragEvents() {
  // const toggleClass = 'card-is-on'
  const containers = document.querySelectorAll('.validator-detail-page')

  if (containers.length === 0) {
    return false
  }

  const draggable = new Draggable(containers, {
    draggable: '.modal-card',
    delay: 0,
  })

  // let isToggled = false
  let initialMousePosition
  let containerRect
  let dragRect
  // let dragThreshold

  // --- Draggable events --- //
  draggable.on('drag:start', (evt) => {
    clientY = evt.sensorEvent.clientY
    initialMousePosition = {
      // x: evt.sensorEvent.clientX,
      y: clientY,
    }
  })

  draggable.on('drag:stop', () => {
    const wHeight = window.innerHeight
    const top = wHeight - 300

    setTimeout(() => {
      const card = document.querySelector('.modal-card') as any

      if (direction === 1) {
        if (position.top < top / 2) {
          card.style.top = `${OFFSET_HEIGHT}px`
          draggable.destroy()
        } else {
          card.style.top = `${top}px`
        }
        return
      } else if (direction === -1) {
        if (position.top > top / 2) {
          card.style.top = `${top}px`
        } else {
          card.style.top = `${OFFSET_HEIGHT}px`
          draggable.destroy()
        }
      }
    }, 1)
  })

  draggable.on('mirror:created', (evt) => {
    containerRect = evt.sourceContainer.getBoundingClientRect()
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

    console.log('evt.sensorEvent.clientY', evt.sensorEvent.clientY)

    if (clientY < evt.sensorEvent.clientY) {
      direction = -1
    } else if (clientY > evt.sensorEvent.clientY) {
      direction = 1
    }

    clientY = evt.sensorEvent.clientY
    const offsetY = calcOffset(initialMousePosition.y - clientY)
    const offsetValue = offsetY

    const mirrorCoords = {
      top: dragRect.top - offsetValue,
    }

    position.top = mirrorCoords.top

    translateMirror(evt.mirror, mirrorCoords, containerRect)
  })

  return draggable
}
