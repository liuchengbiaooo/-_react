/*
与某个用户的聊天界面
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem, Icon, Grid} from 'antd-mobile'

import {sendMsg,readMsg} from '../../redux/actions'

const Item = List.Item

class Chat extends Component {

    state = {
        content: '',
        isShow: false // 是否显示表情列表
    }

    handleChange = (value) => {
        this.setState({content: value})
    }

    sendMsg = () => {
        // console.log('发送消息', this.state.content)
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content

        this.props.sendMsg({from, to, content})
        this.setState({
            content: '',
            isShow: false
        })
    }

    toggleShow = () => {
        const isShow = this.state.isShow
        if(isShow) {
          // 异步手动派发resize事件,解决表情列表显示的bug
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
          }, 0)
        }
        this.setState({
          isShow
        })
        this.setState({
            isShow: !isShow
        }, () => {// 更新完成状态之后异步执行
            console.log('setState()的回调函数中', this.state.isShow)  // 读到的是最新的状态
            if(this.state.isShow) {
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'))
                }, 0)
            }
        })
        console.log('setState()之后', this.state.isShow)

    }

    // 在第一次调用render()之前
    componentWillMount () {
        const emojis = ['😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊','😀', '😁', '😉', '😊',]
        this.emojis = emojis.map(value => ({text: value}))
        // console.log(this.emojis)
    }

    // 进入自动滑动到底部显示
    componentDidMount() {
        // 初始显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }
    // 列表更新时自动滑动底部显示
    componentDidUpdate () {
        // 更新显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }

    componentWillUnmount() {
        //分发异步action更新未读消息
        const to = this.props.user._id
        const from = this.props.match.params.userid
        this.props.readMsg(from,to)
    }

    render() {
        const {user} = this.props
        let {users, msgs} = this.props.chat
        const meId = user._id
        const targetId = this.props.match.params.userid
        const chatId = [meId, targetId].sort().join('_')
        // console.log('msgs1', msgs)
        // 从msgs中找出与目标用户的所有msg
        msgs = msgs.filter(msg => msg.chat_id===chatId)
        // console.log('msgs2', msgs)
        const targetUser = users[targetId]
        if(!targetUser) {
            return <h2>LOADING...</h2>
        }
        const targetIcon = require(`../../assets/images/${targetUser.header}.png`)

        return (
            <div id='chat-page'>
                <NavBar
                    className='fix-top'
                    icon={<Icon type='left'/>}
                    onLeftClick={() => this.props.history.goBack()}
                >{targetUser.username}</NavBar>
                <List>
                    {
                        msgs.map(msg => {
                            if(msg.to===meId) { // 对方发给我的
                                return (
                                    <Item
                                        key={msg._id}
                                        thumb={targetIcon}
                                    >
                                        {msg.content}
                                    </Item>
                                )
                            } else { // 我发给对方的
                                return (
                                    <Item
                                        key={msg._id}
                                        className='chat-me'
                                        extra='我'
                                    >
                                        {msg.content}
                                    </Item>
                                )
                            }
                        })
                    }
                </List>

                <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        extra={
                            <span>
                <span onClick={this.toggleShow}>😊</span> &nbsp;
                                <span onClick={this.sendMsg}>发送</span>
              </span>
                        }
                        value={this.state.content}
                        onChange={this.handleChange}
                        onFocus={() => this.setState({isShow: false})}
                    />

                    {
                        this.state.isShow ? (
                            <Grid
                                data={this.emojis}
                                columnNum={8}
                                carouselMaxRow={4}
                                isCarousel={true}
                                onClick={(item) => {
                                    this.setState({content: this.state.content + item.text})
                                }}
                            />
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user, chat: state.chat}),
    {sendMsg,readMsg}
)(Chat)