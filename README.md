# @dot-event/spawn

[dot-event](https://github.com/dot-event/dot-event#readme) process spawn

![spawn](spawn.gif)

## Install

```bash
npm install dot-event @dot-event/spawn
```

## Setup

```js
const dot = require("dot-event")()
require("@dot-event/spawn")(dot)
```

## Usage

```js
await dot.spawn("test", {
  args: ["hi"],
  command: "echo",
  store: true,
})
```

## Options

| Option    | Description                                                       |
| --------- | ----------------------------------------------------------------- |
| `args`    | Array of command arguments                                        |
| `command` | Command to spawn                                                  |
| `save`    | Save output to [store](https://github.com/dot-event/store#readme) |
