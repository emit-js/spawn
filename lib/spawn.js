// Helpers
import { terminal } from "./spawn/terminal"

module.exports = function(dot, opts) {
  if (dot.state.spawn) {
    return
  }

  opts = opts || {}
  dot.state.spawn = opts

  dot.any("spawn", spawn)
}

async function spawn(prop, arg, dot, e, signal) {
  const { args, lax, json, save } = arg

  const out = await run({
    ...arg,
    args: fixArgs(args),
  })

  if (out.code !== 0) {
    await dot.log("warn", out)
    signal.cancel = true

    if (!lax) {
      process.exit(out.code)
    }
  }

  if (json) {
    out.out = JSON.parse(out.out)
  }

  if (dot.set && save) {
    await dot.set(prop, out)
  }

  return out
}

function fixArgs(args) {
  return typeof args === "string" ? [args] : args
}

async function run(options) {
  const { pty, options: opts } = terminal(options)

  return new Promise((resolve, reject) => {
    pty.on("exit", (code, signal) =>
      resolve({ ...opts, code, signal })
    )
    pty.on("error", e => reject(e))
  })
}
