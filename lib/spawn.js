// Helpers
import { terminal } from "./spawn/terminal"

module.exports = function(dot) {
  if (dot.spawn) {
    return
  }

  dot("dependencies", "spawn", {
    arg: ["@dot-event/args", "@dot-event/store"],
  })

  dot("args", "spawn", {
    args: { alias: "a" },
    command: { alias: "c" },
    exit: { alias: "e" },
    log: { alias: "l" },
    quiet: { alias: "q" },
    save: { alias: "s" },
  })

  dot.any("spawn", spawn)
}

async function spawn(prop, arg, dot, e, signal) {
  const { args, cwd, exit, json, quiet, save } = arg

  const out = await run({
    args: fixArgs(args),
    command: arg.command,
    cwd: cwd,
  })

  out.err = out.code > 0

  if (!out.err && json) {
    out.out = JSON.parse(out.out)
  }

  if (!quiet) {
    const level = out.err ? "warn" : "info"

    dot("spawnOutput", prop, {
      level,
      message: "exit code: " + out.code,
    })

    dot("spawnOutput", prop, {
      level,
      message: "output:\n" + out.out,
    })
  }

  if (out.err) {
    signal.cancel = true

    if (exit) {
      process.exit(out.code)
    } else {
      return out
    }
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
