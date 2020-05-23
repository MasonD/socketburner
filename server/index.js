const
  server = require("http").createServer(),
  io = require("socket.io").listen(server),
  path = require("path"),
  fs = require("fs"),
  watch = require("node-watch"),
  watchPath = path.resolve(__dirname, "../home"),
  port = 3000;

io.origins("*:*"),
io.on("connection", (socket) => {
  console.log("a user connected");
  const watcher = watch(watchPath, { recursive: !0 }, (evt, name) => {
    console.log(name),
    fs.readFile(name, (err, contents) => {
      if (err) throw err;
      socket.send({
        name: path.relative(watchPath, name),
        contents: contents.toString(),
      });
    });
  });
  socket.on("disconnect", () => {
    watcher.close(), console.log("user disconnected");
  });
}),
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
