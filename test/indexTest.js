function newDot() {
  const dot = require("dot-event")()

  require("@dot-event/args")(dot)
  require("@dot-event/log")(dot)
  require("@dot-event/store")(dot)
  require("../")(dot)

  return dot
}

test("spawn command", async () => {
  const dot = newDot()

  await dot.spawn("test", {
    args: ["hi"],
    command: "echo",
    save: true,
  })

  expect(dot.get("test")).toMatchObject({
    code: 0,
    err: false,
    out: "hi\r\n",
    signal: 0,
  })
})

test("spawn command with options", async () => {
  const dot = newDot()

  await dot.spawn("test", {
    command: "pwd",
    cwd: "/",
    save: true,
  })

  expect(dot.get("test")).toMatchObject({
    code: 0,
    err: false,
    out: "/\r\n",
    signal: 0,
  })
})
