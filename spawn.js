module.exports = function(dot) {
  if (dot.spawn) {
    return
  }

  dot("dependencies", "spawn", {
    arg: [
      "@dot-event/args",
      "@dot-event/glob",
      "@dot-event/store",
    ],
  })

  dot("args", "spawn", {
    args: { alias: "a" },
    command: { alias: "c" },
    exit: { alias: "e" },
    log: { alias: "l" },
    paths: { alias: ["_", "p"], default: [process.cwd()] },
    quiet: { alias: "q" },
    save: { alias: "s" },
  })

  require("./spawnPath")(dot)
  require("./spawnTerminal")(dot)

  dot.any("spawn", spawn)
}

async function spawn(prop, arg, dot) {
  const paths = await dot.glob(prop, {
    absolute: true,
    pattern:
      arg.paths.length === 1
        ? arg.paths[0]
        : "{" + arg.paths.join(",") + "}",
  })

  return Promise.all(
    paths.map(
      async path =>
        await dot.spawnPath(prop, {
          ...arg,
          path,
        })
    )
  )
}
