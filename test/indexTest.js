test("spawn command", async () => {
  const dot = require("dot-event")()
  require("@dot-event/log")(dot)
  require("@dot-event/store")(dot)
  require("../")(dot)

  await dot.spawn("test", {
    args: ["hi"],
    command: "echo",
    store: true,
  })

  expect(dot.get("test")).toMatchObject({
    args: ["hi"],
    code: 0,
    command: "echo",
    out: "hi\r\n",
    signal: 0,
    silent: true,
  })
})

test("spawn command with options", async () => {
  const dot = require("dot-event")()
  require("@dot-event/log")(dot)
  require("@dot-event/store")(dot)
  require("../")(dot)

  await dot.spawn("test", {
    command: "pwd",
    cwd: "/",
    store: true,
  })

  expect(dot.get("test")).toMatchObject({
    code: 0,
    command: "pwd",
    cwd: "/",
    out: "/\r\n",
    signal: 0,
    silent: true,
  })
})
