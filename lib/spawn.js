// Helpers
import { terminal } from "./spawn/terminal"

module.exports = function(dot) {
  if (dot.spawn) {
    return
  }

  dot("dependencies", "spawn", {
    arg: ["@dot-event/alias", "@dot-event/store"],
  })

  dot("alias", "spawn", {
    a: ["args"],
    c: ["command"],
    e: ["exit"],
    l: ["log"],
    s: ["save"],
  })

  dot.any("spawn", spawn)
}

async function spawn(prop, arg, dot, e, signal) {
  const { args, cli, cwd, exit, json, log, save } = arg

  const out = await run({
    args: fixArgs(args),
    command: arg.command,
    cwd: cwd,
  })

  if (out.code !== 0) {
    dot("log", "warn", prop, out)
    signal.cancel = true

    if (exit) {
      process.exit(out.code)
    }
  }

  if (json) {
    out.out = JSON.parse(out.out)
  }

  if (cli || log) {
    const level = out.code === 0 ? "info" : "warn"

    dot("log", level, prop, {
      arg: "exit code: " + out.code,
    })

    dot("log", level, prop, { arg: "output:\n" + out.out })
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
      resolve({ code, out: opts.out, signal })
    )
    pty.on("error", e => reject(e))
  })
}
