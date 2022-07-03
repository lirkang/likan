function formatSize(size: number) {
  if (size < 1024) {
    return size + ' b'
  } else if (size < 1024 * 1024) {
    const temp = size / 1024

    return temp.toFixed(2) + ' kb'
  } else if (size < 1024 * 1024 * 1024) {
    const temp = size / (1024 * 1024)

    return temp.toFixed(2) + ' mb'
  } else {
    const temp = size / (1024 * 1024 * 1024)

    return temp.toFixed(2) + ' gb'
  }
}

export default formatSize
