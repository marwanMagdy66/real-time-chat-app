import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
dotenv.config();
app.use(express.json());

const server = app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});

app.use(express.static(path.join(__dirname, "public")));

const io = new Server(server, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"]
    }
  });
let socketConnected = new Set();
io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketConnected.add(socket.id);

  io.emit("client-total", socketConnected.size);

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} has disconnected`);
    socketConnected.delete(socket.id);
    io.emit("client-total", socketConnected.size);
  });

  socket.on('message',(data)=>{
    console.log(data);
    socket.broadcast.emit('chatMessage',data)
  })


  socket.on('feedback',(data)=>{
    socket.broadcast.emit('feedback',data)
  })
}
