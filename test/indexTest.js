test("spawn command", async () => {
  const dot = require("dot-event")()
  require("@dot-event/log")(dot)
  require("@dot-event/store")(dot)
  require("../")(dot)

  await dot.spawn("test", {
    args: ["hi"],
    command: "echo",
    save: true,
  })

  expect(dot.get("test")).toMatchObject({
    code: 0,
    out: "hi\r\n",
    signal: 0,
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
    save: true,
  })

  expect(dot.get("test")).toMatchObject({
    code: 0,
    out: "/\r\n",
    signal: 0,
  })
})
