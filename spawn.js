module.exports = function(emit) {
  if (emit.spawn) {
    return
  }

  emit("dependencies", "spawn", [
    "@emit-js/args",
    "@emit-js/glob",
    "@emit-js/store",
  ])

  emit("args", "spawn", {
    args: { alias: "a" },
    command: { alias: "c" },
    exit: { alias: "e" },
    log: { alias: "l" },
    paths: {
      alias: ["_", "cwd", "p"],
      default: [process.cwd()],
    },
    quiet: { alias: "q" },
    save: { alias: "s" },
  })

  require("./spawnPath")(emit)
  require("./spawnTerminal")(emit)

  emit.any("spawn", spawn)
}

async function spawn(arg, prop, emit) {
  const paths = await emit.glob(prop, {
    absolute: true,
    pattern: arg.paths,
  })

  if (paths.length > 1) {
    return Promise.all(
      paths.map(
        async path =>
          await emit.spawnPath(prop, {
            ...arg,
            path,
          })
      )
    )
  } else {
    return await emit.spawnPath(prop, {
      ...arg,
      path: paths[0],
    })
  }
}
