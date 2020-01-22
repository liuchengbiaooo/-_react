/*用于定义路由的路由器模块*/
const express = require('express');
const UserModel = require("../models/UserModel");
const MsgModel = require("../models/MsgModel");

/*给密码加密*/
const md5 = require("blueimp-md5")

const router = express.Router();

/*指定查询users时需要过滤的属性*/
const filter = {password: 0, __v: 0}

//注册用户路由
router.post("/register", (req, res) => {
    //1.读取请求参数的数据
    const {username, password, type} = req.body
    //先对后台表单进行加密，没有通过，直接返回错误提示
    if (!password) {
        return res.send({
            code: 1,
            msg: "必须指定密码"
        })
    }

    //2.处理数据 (处理：判断用户是否存在，如果存在返回错误信息，不存在，保存)
    UserModel.findOne({username})
        .then(userDoc => {
            //如果user的值存在
            if (userDoc) {
                //返回错误信息
                res.send({
                    code: 1,
                    msg: "此用户已存在"
                    })

                return new Promise((resolve, reject) => {
                    // resolve() 只有调用才会执行then()中指定的回调函数,防止下面成功后调用(.then)执行这一步
                })

            } else {
                //没值，保存并且放回做下一步处理
                return UserModel.create({username, type, password: md5(password)})
            }
        })
        /*成功之后，放回值再次调用.then*/
        .then(userDoc => {
            const {_id, username, type} = userDoc

             //创建cookie(user_id:_id),并交给浏览器
             //res.cookie("user_id",_id)//没有指定最大存活时间，就是一个会话cookie，浏览器保存放在内存
            res.cookie("user_id",_id,{maxAge:1000*60*60*24*7}) //1000毫秒  持久化cookie ，保存在文件中

            res.send({
                code: 0,
                data: {_id, username, type}
            })
        })

        .catch(error => {
            console.error('注册用户异常', error)
        })
    //3.返回参数
})


//注册用户登录路由
router.post("/login", (req, res) => {
    //1.读取请求参数的数据
    const {username, password} = req.body

    //2.处理数据(根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登录成功)
    UserModel.findOne({username, password: md5(password)}, filter)/*filter:过滤，过滤掉userDoc里面的值*/
        .then(userDoc => {
            if (userDoc) {
                //创建cookie(user_id:_id),并交给浏览器
                res.cookie("user_id",userDoc._id,{maxAge:1000*60*60*24*7})
                //如果有，放回登录成功
                res.send({
                    code: 0,
                    data: userDoc
                })
            } else {
                //如果没有，返回登录失败
                //3.返回参数
                res.send({
                    code: 1,
                    msg: "用户名或密码错误"
                })
            }
        })
        .catch(error => {
            console.error("用户登录异常", error)
        })
})

//更新用户路由
router.post("/update",(req,res)=>{
    //从cookie中获取用户ID
    const userId = req.cookies.user_id
    //如果没有，直接返回提示信息
    if(!userId){
        return res.send({code:1,msg:"请先登陆"})
    }
    //根据userid查询得到对应的user并更新
    const user = req.body
    UserModel.findByIdAndUpdate({_id:userId},user)
        .then(oldUser =>{
            if(oldUser){
                const {_id,username,type} = oldUser
                res.send({
                    code:0,
                    data:Object.assign({_id,username,type},user)
                    //Object.assign:(obj1,obj2)合并多个对象中的所有属性，生成一个新的对象
                })
            }else {//说明cookie中的user_id是有问题
                //通知浏览器删除user_id cookie
                res.clearCookie("user_id")
                //返回提示登录信息
                return res.send({code:1,msg:"请先登陆"})
            }
        })
})

//获取用户信息的路由(根据cookie)
router.get("/user",(req,res)=>{
    //从请求的cookie得到userid
    const userid = req.cookies.user_id
    //如果不在，直接返回一个提示信息
    if(!userid){
        return res.send({
            code:1,
            msg:"请先登录"
        })
    }
    //根据userid查询对应的user
    UserModel.findOne({_id:userid},filter)
        .then(user =>{
            if(user){
                res.send({
                    code:0,
                    data:user
                })
            }else {
                //通知浏览器删除userid cookie
                res.clearCookie("user_id")
                res.send({
                    code:1,
                    msg:"请先登录"
                })
            }
        })
})

//获取用户列表(根据类型)
router.get("/userlist",(req,res)=>{
    const {type} = req.query //取出数据
    UserModel.find({type},filter)
        .then(users =>{
            res.send({code:0,data:users})
        })
})


//获取当前用户所有相关聊天信息列表
router.get('/msglist', (req, res) => {
    // 获取cookie中的userid
    const userid = req.cookies.user_id

    let users
    // 查询得到所有user文档数组
    UserModel.find()
        .then(userDocs => {
            // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
            users = userDocs.reduce((users, user) => {
                users[user._id] = {username: user.username, header: user.header}
                return users
            }, {})
            /*
            查询userid相关的所有聊天信息
             参数1: 查询条件
             参数2: 过滤条件
             参数3: 回调函数
            */
            return MsgModel.find({'$or': [{from: userid}, {to: userid}]})
        })
        .then(msgs => {
            // 返回包含所有用户和当前用户相关的所有聊天消息的数据
            res.send({code: 0, data: {users, msgs}})
        })
        .catch(error => {
            console.error('获取消息列表异常', error)
            res.send({code: 1, msg: '获取消息列表异常, 请重新尝试'})
        })
})

/*
修改指定消息为已读
 */
router.post('/readmsg', (req, res) => {
    // 得到请求中的from和to
    const from = req.body.from
    const to = req.cookies.user_id
    console.log(from)
    /*
    更新数据库中的msg数据
    参数1: 查询条件
    参数2: 更新为指定的数据对象
    参数3: 是否1次更新多条, 默认只更新一条
    参数4: 更新完成的回调函数
     */
    MsgModel.update({from, to, read: false}, {read: true}, {multi: true})
        .then(doc => {
            console.log(doc)
            res.send({code: 0, data: doc.nModified})// 更新的数量
            console.log("sss",doc.nModified)
        })
        .catch(error => {
            console.error('查看消息列表异常', error)
            res.send({code: 1, msg: '查看消息列表异常, 请重新尝试'})
        })
})
/*向外暴露router*/

module.exports = router
