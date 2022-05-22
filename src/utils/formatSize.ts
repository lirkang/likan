function formatSize(size: number) {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    const temp = size / 1024

    return temp.toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    const temp = size / (1024 * 1024)

    return temp.toFixed(2) + 'MB'
  } else {
    const temp = size / (1024 * 1024 * 1024)

    return temp.toFixed(2) + 'GB'
  }
}

export default formatSize
