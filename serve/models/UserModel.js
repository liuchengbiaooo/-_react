/*能操作users集合数据的Model*/

//1.引入mongoose
const mongoose =require("mongoose")
//2.定义Schema（文档结构）
const userSchema = new mongoose.Schema({
    username:{type:String,required:true},//用户名
    password:{type:String,required:true},//密码
    type:{type:String,required:true},//用户类型
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 工资
})
//3.定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model("users",userSchema)
//4.向外暴露Mobel
module.exports = UserModel
