function formatSize(size: number) {
  if (size < 1024 * 1024) {
    const temp = size / 1024

    return temp.toFixed(2) + ' K'
  } else if (size < 1024 * 1024 * 1024) {
    const temp = size / (1024 * 1024)

    return temp.toFixed(2) + ' M'
  } else {
    const temp = size / (1024 * 1024 * 1024)

    return temp.toFixed(2) + ' G'
  }
}

export default formatSize
