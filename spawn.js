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
    paths: {
      alias: ["_", "cwd", "p"],
      default: [process.cwd()],
    },
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
    pattern: pathsToPattern(arg.paths),
  })

  if (paths.length > 1) {
    return Promise.all(
      paths.map(
        async path =>
          await dot.spawnPath(prop, {
            ...arg,
            path,
          })
      )
    )
  } else {
    return await dot.spawnPath(prop, {
      ...arg,
      path: paths[0],
    })
  }
}

function pathsToPattern(paths) {
  if (typeof paths === "string") {
    return paths
  } else if (paths.length === 1) {
    return paths[0]
  } else {
    return "{" + paths.join(",") + "}"
  }
}
