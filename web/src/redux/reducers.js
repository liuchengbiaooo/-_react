/*
包含n个reducer函数的模块
reducer函数: 根据老state和指定action返回一个新的state
 */
import {combineReducers} from 'redux'
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER_LIST,
    RECEIVE_CHAT_MSGS,
    RECEIVE_CHAT_MSG,
    MSG_READ
} from './action-types'
import {getRedirectPath} from '../utils'

/*
管理user数据的reducer
 */
const initUser = {
    username: '', // 用户名
    type: '', // 类型
    msg: '', // 需要显示的错误信息
    redirectTo: '', // 需要自动跳转的路径
}
function user(state=initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            const user = action.data
            return {...user, redirectTo: getRedirectPath(user.type, user.header)}
        case ERROR_MSG:
            const msg = action.data
            return {...initUser, msg}
        default:
            return state
    }
}

/*
管理用户列表userList的reducer
 */
const initUserList = []
function userList(state=initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

/*
管理聊天数据的reduer
 */
const initChat = {
    users: {},  // 包含所有用户信息对象的容器对象: key是_id, value是{username, header}
    msgs: [], // 聊天消息的数组
    unReadCount: 0, // 未读消息的总数量
}
function chat(state=initChat, action) {
    switch (action.type) {
        case RECEIVE_CHAT_MSGS:
            var {users, msgs,meId} = action.data
            return {
                users,
                msgs,
                unReadCount: msgs.reduce((pre,msg)=> pre + (!msg.read && msg.to===meId ? 1 : 0),0),
            }
        case RECEIVE_CHAT_MSG:
            var {msg,meId} = action.data
            return {
                users: state.users, // 不变
                msgs: [...state.msgs, msg],
                unReadCount: state.unReadCount + (!msg.read && msg.to===meId ? 1 : 0),
            }
        case MSG_READ:
            const {count,from,to} = action.data
            return{
                users:state.users,
                msgs:state.msgs.map(msg =>{
                    if(msg.from===from && msg.to===to && !msg.read){
                        return{...msg,read: true}
                    }else {
                        return msg
                    }
                }),
                unReadCount:state.unReadCount - count
            }
        default:
            return state
    }
}


/*
向外暴露整合所有reducer产生的新的reducer
整合产生的reducer管理的状态: {user: user(), userList: userList(), chat: chat()}
 */
export default combineReducers({
    user,
    userList,
    chat
})