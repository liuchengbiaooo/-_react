/*
消息界面路由容器组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

class Message extends Component {
/*
对msgs按chat_id进行分组, 并得到每个组的lastMsg组成的数组
1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id, lastMsg}
2. 得到所有lastMsg的数组
3. 对数组进行排序(按create_time降序)
 */
    getLastMsgs = (msgs, meId) => {
        // 1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id:lastMsg}
        const lastMsgsObj = {}

        // 遍历msgs中所有msg，找出每个聊天的lastmsg，并保存到对象容器中：属性名是chat_id值，值为msg
        msgs.forEach(msg => {
            //对每个msg进行统计
            if (!msg.read && msg.to === meId) {//如果是别人发给我的未读消息
                msg.unReadCount = 1
            } else {
                msg.unReadCount = 0
            }
            const chatId = msg.chat_id
            const lastMsg = lastMsgsObj[chatId]
            if (!lastMsg) { //容器中没同组的lastMsg，当前msg就这个组的lastMsg
                lastMsgsObj[chatId] = msg
            } else { //容器中有同组的lastMsg，比较后保存当前租最后的msg
                //计算unReadCount
                const unReadCount = lastMsg.unReadCount + msg.unReadCount
                if (msg.create_time > lastMsg.create_time) {
                    lastMsgsObj[chatId] = msg
                }
                // 给最新的lastMsg指定unReadCount
                lastMsgsObj[chatId].unReadCount = unReadCount
            }
        })
        // 2. 得到所有lastMsg的数组
        const lastMsgs = Object.values(lastMsgsObj)
        // 3. 对数组进行排序(按create_time降序)
        lastMsgs.sort((m1, m2) => m2.create_time - m1.create_time)
        // 如果结果<0, 将m1放在前面, 如果结果为0, 不变, 如果结果>0, m2前面
        return lastMsgs
    }

    render() {
        const {user} = this.props
        const meId = user._id
        const {users, msgs} = this.props.chat

        // 对msgs按chat_id进行分组
        const lastMsgs = this.getLastMsgs(msgs, meId)
        return (
            <List>
                {
                    lastMsgs.map(msg => {
                        //得到目标用户的id
                        const targetId = msg.from === meId ? msg.to : msg.from
                        const targetUser = users[targetId]
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount}/>}
                                thumb={require(`../../assets/images/${targetUser.header}.png`)}
                                arrow="horizontal"
                                onClick={() => this.props.history.push(`/chat/${targetId}`)}
                            >
                                {msg.content}
                                <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    })
                }
            </List>
        )
    }
}

export default connect(
    state => ({user: state.user, chat: state.chat}),
    {}
)(Message)