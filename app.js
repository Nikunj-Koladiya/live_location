const express = require("express")
const app = express()
const socketio = require("socket.io")
const http = require('http')
const path = require('path'); 
require('dotenv').config();

const server = http.createServer(app)
const io = socketio(server)

app.set("view engine","ejs")
app.use(express.static(path.join(__dirname, "public")))


io.on("connection", function(socket){
    const userName = "User" + socket.id;
    io.emit("new-user", { id: socket.id, name: userName });

    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id, ...data,name: userName})
    })
    socket.on("disconnect",function(){
        io.emit('user-disconnect',socket.id)
    })

})

app.get("/",function(req,res){
    res.render("index")
})

server.listen(process.env.PORT || 3000,()=>{
    console.log("App is running");
    
})