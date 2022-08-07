import { exec } from 'child_process'

function openBrowser({ path }: { path: string }) {
  exec(`start file://${path}`)
}

export { openBrowser }
