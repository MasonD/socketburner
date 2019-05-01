const server = require("http").createServer();
const io = require("socket.io").listen(server);
const path = require("path");
const fs = require("fs");
const watch = require("node-watch");

const watchPath = path.resolve(__dirname, "../home");

io.origins("*:*");
io.on("connection", socket => {
  console.log("a user connected");
  const watcher = watch(watchPath, { recursive: true }, (evt, name) => {
    console.log(name);
    fs.readFile(name, (err, contents) => {
      if (err) throw err;
      socket.send({
        name: path.relative(watchPath, name),
        contents: contents.toString()
      });
    });
  });

  socket.on("disconnect", () => watcher.close());
});

server.listen(3000);
