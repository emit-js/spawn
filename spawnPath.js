module.exports = function(dot) {
  if (dot.spawnPath) {
    return
  }

  dot.any("spawnPath", spawnPath)
}

async function spawnPath(prop, arg, dot, e, signal) {
  const { args, exit, json, path, quiet, save } = arg
  const argsArr = fixArgs(args)

  const out = await run(
    prop,
    {
      args: argsArr,
      command: arg.command,
      cwd: path,
    },
    dot
  )

  out.err = out.code > 0

  if (!out.err && json) {
    out.out = JSON.parse(out.out)
  }

  if (!quiet) {
    const level = out.err ? "warn" : "info"

    dot("spawnOutput", prop, {
      level,
      message: `command: ${argsArr.join(" ")}`,
    })

    dot("spawnOutput", prop, {
      level,
      message: `exit code: ${out.code}`,
    })

    dot("spawnOutput", prop, {
      level,
      message: `output:\n${out.out}`,
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

async function run(prop, args, dot) {
  const { pty, options: opts } = dot.spawnTerminal(args)

  return new Promise((resolve, reject) => {
    pty.on("exit", (code, signal) =>
      resolve({ code, out: opts.out, signal })
    )
    pty.on("error", e => reject(e))
  })
}
