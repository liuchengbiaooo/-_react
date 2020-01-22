/*
包含n个action creator函数的模块
每个action creator都返回一个action对象/函数
同步action: action对象
异步action: action函数(dispatch)
 */
import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqchatMsgs,
    reqReadMsg
} from '../api'

import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER_LIST,
    RECEIVE_CHAT_MSGS,
    RECEIVE_CHAT_MSG,
    MSG_READ
} from './action-types'  // 每个action type都对应一个同步action
import io from 'socket.io-client'
const socket = io('ws://localhost:5000')

// 注册/登陆成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误信息的同步action
export const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
// 接收用户列表的同步action
export const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})
// 接收聊天消息列表
export const receiveChatMsgs = ({users, msgs,meId}) => ({type: RECEIVE_CHAT_MSGS, data: {users, msgs,meId}})

// 接收一个聊天消息
export const receiveChatMsg = (msg,meId) => ({type: RECEIVE_CHAT_MSG, data: {msg,meId}})

//消息已读的同步action
export const msgRead = ({count,from,to}) => ({type:MSG_READ,data:{count,from,to}})



/*
注册的异步action
 */
export function register(user) {

    // 表单数据验证, 如果验证失败
    const {username, password, password2} = user
    if(!username) {
        return errorMsg('请输入用户名')
    } else if(!password) {
        return errorMsg('请输入密码')
    } else if (password!==password2) {
        return errorMsg('两次密码必须一致')
    }


    return async dispatch => {
        // 1. 发送异步ajax请求
        const response = await reqRegister(user)
        // 2. 根据结果分发对应的同步action
        const result = response.data // {code: 0, data: user}  {code: 1, msg: 'xxx'}
        if(result.code===0) { // 成功了
            const user = result.data
            getChatMsgs(dispatch, user._id)
            dispatch(authSuccess(user))
        } else { // 失败了
            const {msg} = result
            dispatch(errorMsg(msg))
        }
    }
}

/*
登陆的异步action
 */
export function login({username, password}) {
    return async dispatch => {

        // 前台表单验证
        if(!username) {
            dispatch(errorMsg('请输入用户名'))
            return
        } else if(!password) {
            return dispatch(errorMsg('请输入密码'))
        }


        // 1. 发送异步ajax请求
        const response = await reqLogin(username, password)
        // 2. 根据结果分发对应的同步action
        const result = response.data // {code: 0, data: user}  {code: 1, msg: 'xxx'}
        if(result.code===0) { // 成功了
            const user = result.data
            getChatMsgs(dispatch, user._id)
            dispatch(authSuccess(user))
        } else { // 失败了
            const {msg} = result
            dispatch(errorMsg(msg))
        }
    }
}

/*
更新用户的异步action
 */
export function updateUser(user) {
    return async dispatch => {
        // 1. 发异步ajax请求
        const response = await reqUpdateUser(user)
        // 2. 根据结果分发同步action
        const result = response.data
        if(result.code===0) {
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

/*
获取用户的异步action
 */
export function getUser () {
    return async dispatch => {
        const response = await reqUser()
        const result = response.data
        if(result.code===0) {
            getChatMsgs(dispatch, result.data._id)
            dispatch(authSuccess(result.data))
        } else {
            dispatch(errorMsg(result.msg))
        }
    }
}

/*
获取指定类型用户列表的异步action
 */
export function getUserList(type) {
    return async dispatch => {
        const response = await reqUserList(type)
        const result = response.data
        if(result.code===0) {
            const userList = result.data
            dispatch(receiveUserList(userList))
        }
    }
}

/*
初始化io绑定接收消息的监听
 */
function initIO(dispatch, meId) {

    // 限制只绑定一次监听: 加标识
    if(!io.flag) {
        io.flag = true
        // 绑定监听, 接收服务器发送给浏览器的消息
        socket.on('receiveMsg', (msg) => {
            console.log('浏览器接收到服务器发送的消息', msg)
            // 判断当前收到的消息是否是与我相关的消息
            if(msg.from===meId || msg.to===meId) {
                dispatch(receiveChatMsg(msg,meId))
            }
        })
    }

}
/*
发送消息的异步action
 */
export function sendMsg ({from, to, content}) {
    return dispatch => {
        // 发送聊天消息
        socket.emit('sendMsg', {from, to, content})
        console.log('浏览器向服务器发送消息', from, to, content)
    }
}

/*
获取当前用户相关的所有聊天数据的异步函数
函数必须在登陆成功后调用
  1). 注册成功
  2). 登陆成功
  3). 自动登陆成功
 */
async function getChatMsgs(dispatch, meId) {
    initIO(dispatch, meId)
    const response = await reqchatMsgs()
    const result = response.data
    if(result.code===0) {
        const {users, msgs} = result.data
        dispatch(receiveChatMsgs({users, msgs,meId}))
    }
}

/*读取更新未读消息的异步action*/
export function readMsg(from,to) {
    return async dispatch =>{
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code===0){
            const count = result.data
            dispatch(msgRead({count,from,to}))
        }
    }
}
