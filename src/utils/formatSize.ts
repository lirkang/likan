function formatSize(size: number, containSuffix = true) {
  if (size < 1024 * 1024) {
    const temp = size / 1024

    return temp.toFixed(2) + (containSuffix ? ' K' : '')
  } else if (size < 1024 * 1024 * 1024) {
    const temp = size / (1024 * 1024)

    return temp.toFixed(2) + (containSuffix ? ' M' : '')
  } else {
    const temp = size / (1024 * 1024 * 1024)

    return temp.toFixed(2) + (containSuffix ? ' G' : '')
  }
}

export default formatSize
