/*能操作msgs集合数据的Model*/

//1.引入mongoose
const mongoose = require("mongoose")

//2.定义集合的文档结构
const msgSchema = new mongoose.Schema({
    from:{type:String,require:true},//发送用户的id
    to:{type:String,require:true},//接收用户的id
    chat_id:{type:String,require:true},//from和to组成的字符串
    content:{type:String,require:true}, //内容
    read:{type:Boolean,default:false}, //标识是否已读
    create_time:{type:Number} //创建时间
})
//3.定义能操作chats集合数据的Model
const MsgModel = mongoose.model("msgs1",msgSchema)
//4.向外暴露
module.exports = MsgModel