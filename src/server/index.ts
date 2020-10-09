const server = require("http").createServer(),
  io = require("socket.io").listen(server),
  path = require("path"),
  fs = require("fs"),
  watch = require("node-watch"),
  watchPath = path.resolve(__dirname, "../home"),
  port = 3000;
io.origins("*:*"),
  io.on(
    "connection",
    (socket: {
      send: (arg0: { name: any; contents: any }) => void;
      on: (arg0: string, arg1: () => void) => void;
    }) => {
      console.log("a user connected");
      const watcher = watch(
        watchPath,
        { recursive: !0 },
        (evt: any, name: any) => {
          console.log(name),
            fs.readFile(name, (err: any, contents: { toString: () => any }) => {
              if (err) throw err;
              socket.send({
                name: path.relative(watchPath, name),
                contents: contents.toString(),
              });
            });
        }
      );
      socket.on("disconnect", () => {
        watcher.close(), console.log("user disconnected");
      });
    }
  ),
  server.listen(port, () => {
    console.log(`listening on *:${port}`);
  });
