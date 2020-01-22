/*
包含n个请求函数的模块
每个函数的返回值都是promise
*/
import ajax from "./ajax"
const BASE = ""

// 请求注册接口
 //  export const reqRegister = ({username,password,type}) => ajax(BASE+"/register",{username,password,type},"POST")
export const reqRegister = (user) => ajax(BASE+"/register",user,"POST")

//请求登录接口
export const reqLogin = (username,password) => ajax(BASE+"/login",{username,password},"POST")

//请求更新用户
export const reqUpdateUser = (user) =>ajax(BASE + "update",user,"POST")

//请求获取用户
export const reqUser = () => ajax(BASE + "user")

//请求获取指定类型的所有用户
export const reqUserList = (type) => ajax(BASE + "userlist",{type})

//请求当然用户相关所有聊天数据
export const reqchatMsgs = () => ajax(BASE + "msglist")

//请求将查看的未读消息更新为已读
export const reqReadMsg = (from) => ajax(BASE + "/readmsg" ,{from},"POST")