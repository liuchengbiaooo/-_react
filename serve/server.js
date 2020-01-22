/*1.通过express启动服务器*/
/*2.通过mongoose连接数据库
    连接上数据库才连接服务器*/
/*3.使用中间件*/

const mongoose = require("mongoose")
const express = require("express")
const cookieParser = require('cookie-parser')

const app =express()

const http = require("http")
const server =http.createServer(app)
require("./socketIO/server_socket")(server)

//声明使用静态中间件，显示初始页面
app.use(express.static("public"))

//声明使用解析post请求的中间件
app.use(express.urlencoded({extended:true})) /*处理不了json格式数据*/
app.use(express.json())

//使用cookie-parser中间件，解析请求中的cookie数据，保存req.cookies
app.use(cookieParser())

//声明使用路由器中间件
const indexRouter = require("./routers/indexRouter")
app.use("/",indexRouter)

//1.通过mongoose连接数据库
mongoose.connect("mongodb://localhost/xiangmu1",{useNewUrlParser: true})
.then(()=>{
    console.log("数据库连接成功！！！")
    //2.成功之后连接服务器
    server.listen("5000",()=>{
        console.log("服务器启动成功，请访问：http://localhost:5000")
    })
})
.catch((errer)=>{
    console.log("连接数据库失败！！！",errer)
})