import { spawn } from "node-pty"

export function terminal(opts) {
  const options = defaultOptions(opts)
  const cols = process.stdout.columns
  const rows = process.stdout.rows

  const {
    args,
    command,
    cwd,
    env,
    onData,
    silent,
    stdin,
  } = options

  const pty = spawn(command, args, {
    cols,
    cwd,
    env,
    name: "xterm-color",
    rows,
  })

  pty.on("close", () => {
    if (stdin) {
      teardownStdin(pty)
    }
  })

  pty.on("data", data => {
    options.out += data

    if (onData) {
      onData({ out: options.out, pty })
    }

    if (!silent) {
      process.stdout.write(data)
    }
  })

  if (stdin) {
    setupStdin(pty)
  }

  return { options, pty }
}

function defaultOptions(options) {
  return {
    out: "",
    silent: true,
    ...options,
  }
}

function setupStdin(pty) {
  process.stdin.setEncoding("utf8")
  process.stdin.setRawMode(true)
  process.stdin.pipe(pty)
}

function teardownStdin(pty) {
  process.stdin.unpipe(pty)
  process.stdin.setRawMode(false)
}
