function newDot() {
  const emit = require("@emit-js/emit")()

  require("@emit-js/log")(emit)
  require("@emit-js/args")(emit)
  require("@emit-js/glob")(emit)
  require("@emit-js/store")(emit)
  require("../")(emit)

  return emit
}

test("spawn command", async () => {
  const emit = newDot()

  await emit.spawn("test", {
    args: ["hi"],
    command: "echo",
    save: true,
  })

  expect(emit.get("test")).toMatchObject({
    code: 0,
    err: false,
    out: "hi\r\n",
    signal: 0,
  })
})

test("spawn command with options", async () => {
  const emit = newDot()

  await emit.spawn("test", {
    command: "pwd",
    save: true,
  })

  expect(emit.get("test")).toMatchObject({
    code: 0,
    err: false,
    out: `${process.cwd()}\r\n`,
    signal: 0,
  })
})
