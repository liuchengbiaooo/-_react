const MsgModel = require('../models/MsgModel')
/*
用来实现聊天的后台模块
 */
module.exports = function (server) {

    // 得到IO管理对象
    const io = require('socket.io')(server)

    // 监视客户端连接
    io.on('connection', (socket) => { // socket代表与客户端连接
        console.log('有一个客户端连上了')
        // 绑定监听(sendMsg)用来接收客户端发送的消息
        socket.on('sendMsg', ({from, to, content}) => {
            const create_time = Date.now() //发消息的时间
            const chat_id = [from, to].sort().join("_")//2个用户相关的发的消息一致
            const msg = {from, to, content, create_time, chat_id}
            //1.保存到msgs集合
            MsgModel.create(msg)
                .then((msgDoc) => {//保存成功
                    //2.给客户端发消息
                  io.emit("receiveMsg",msgDoc)
                })
        })
    })
}