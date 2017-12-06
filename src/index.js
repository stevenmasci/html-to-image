import cloneNode from './cloneNode'
import embedWebFonts from './embedWebFonts'
import embedImages from './embedImages'
import createSvgDataURL from './createSvgDataURL'
import applyStyle from './applyStyle'
import {
  getNodeWidth,
  getNodeHeight,
  createImage,
  delay,
  canvasToBlob,
} from './utils'


export function toSvgDataURL(domNode, options = {}) {
  const width = options.width || getNodeWidth(domNode)
  const height = options.height || getNodeHeight(domNode)

  return cloneNode(domNode, options.filter, true)
    .then(clonedNode => embedWebFonts(clonedNode, options))
    .then(clonedNode => embedImages(clonedNode, options))
    .then(clonedNode => applyStyle(clonedNode, options))
    .then(clonedNode => createSvgDataURL(clonedNode, width, height))
}

export function toCanvas(domNode, options = {}) {
  return toSvgDataURL(domNode, options)
    .then(createImage)
    .then(delay(100))
    .then((image) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = options.width || getNodeWidth(domNode)
      canvas.height = options.height || getNodeHeight(domNode)

      if (options.backgroundColor) {
        context.fillStyle = options.backgroundColor
        context.fillRect(0, 0, canvas.width, canvas.height)
      }

      context.drawImage(image, 0, 0)

      return canvas
    })
}

export function toPixelData(domNode, options = {}) {
  const width = options.width || getNodeWidth(domNode)
  const height = options.height || getNodeHeight(domNode)

  return toCanvas(domNode, options)
    .then(canvas => (
      canvas.getContext('2d').getImageData(0, 0, width, height).data
    ))
}

export function toPng(domNode, options = {}) {
  return toCanvas(domNode, options).then(canvas => (
    canvas.toDataURL()
  ))
}

export function toJpeg(domNode, options = {}) {
  return toCanvas(domNode, options).then(canvas => (
    canvas.toDataURL('image/jpeg', options.quality || 1)
  ))
}

export function toBlob(domNode, options = {}) {
  return toCanvas(domNode, options).then(canvasToBlob)
}
