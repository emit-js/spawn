module.exports = function(emit) {
  if (emit.spawnPath) {
    return
  }

  emit.any("spawnPath", spawnPath)
}

async function spawnPath(arg, prop, emit, signal) {
  const { args, exit, json, path, quiet, save } = arg
  const argsArr = fixArgs(args)

  const out = await run(
    {
      args: argsArr,
      command: arg.command,
      cwd: path,
    },
    prop,
    emit
  )

  out.err = out.code > 0

  if (!out.err && json) {
    out.out = JSON.parse(out.out)
  }

  if (!quiet) {
    const level = out.err ? "warn" : "info",
      messages = [
        `command: ${arg.command}${
          argsArr ? " " + argsArr.join(" ") : ""
        }`,
        `cwd: ${path}`,
        `code: ${out.code}`,
        `output:\n${out.out}`,
      ]

    for (const message of messages) {
      emit("spawnOutput", prop, { level, message })
    }
  }

  if (out.err) {
    signal.cancel = true

    if (exit) {
      process.exit(out.code)
    } else {
      return out
    }
  }

  if (emit.set && save) {
    await emit.set(prop, out)
  }

  return out
}

function fixArgs(args) {
  return typeof args === "string" ? [args] : args
}

async function run(arg, prop, emit) {
  const { pty, options: opts } = emit.spawnTerminal(arg)

  return new Promise((resolve, reject) => {
    pty.on("exit", (code, signal) =>
      resolve({ code, out: opts.out, signal })
    )
    pty.on("error", e => reject(e))
  })
}
