# @emit-js/spawn

[emit](https://github.com/emit-js/emit#readme) process spawn

![spawn](spawn.gif)

## Install

```bash
npm install @emit-js/emit @emit-js/spawn
```

## Setup

```js
const emit = require("@emit-js/emit")()
require("@emit-js/spawn")(emit)
```

## Usage

```js
await emit.spawn("test", {
  args: ["hi"],
  command: "echo",
  save: true,
})
```

## Options

| Option    | Description                                                     |
| --------- | --------------------------------------------------------------- |
| `args`    | Array of command arguments                                      |
| `command` | Command to spawn                                                |
| `save`    | Save output to [store](https://github.com/emit-js/store#readme) |
