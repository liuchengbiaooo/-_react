import React, {Component} from "react"
import {Route, Switch,Redirect} from "react-router-dom"
import {NavBar} from "antd-mobile"
import {connect} from "react-redux"
import Cookies from "js-cookie"

import LaobanInfo from "../laoban-info/laoban-info"
import DashenInfo from "../dashen-info/dashen-info"
import Laoban from "../laoban/laoban"
import Dashen from "../dashen/dashen"
import Message from "../message/message"
import Personal from "../personal/personal"
import NavFooter from "../../components/nav-footer/nav-footer"
import NotFound from "../../components/not-found/not-found"
import Chat from "../../containers/chat/chat"

import {getUser} from "../../redux/actions"
import {getRedirectPath} from "../../utils"
class Main extends Component {
    //组件类和组件对象
    //组件对象添加属性
    navList = [
        {
            path: '/laoban', // 路由路径
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神',
        },
        {
            path: '/dashen', // 路由路径
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板',
        },
        {
            path: '/message', // 路由路径
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]

    componentDidMount(){
        //如果前面登录过，但是当前没有登录，发请求
        const userid = Cookies.get("user_id")
        const{user}=this.props
        if(userid && !user._id){
         //发请求获取当前用户信息
           this.props.getUser()
        }
    }

    render() {
/*
1.判断以前是否登录过：是否有user_id的cookie？
  没有 ==》自动跳转到登录界面
  有=》2
2.判断当前是否已经登录：state的user中是否有_id
  没有 ==》 发ajax请求获取对应的user并保存到start中
  有 ==》 显示对应的路由界面
*/
        //1.判断以前是否登录过
        const userid = Cookies.get("user_id")//读取
        if(!userid){
            return <Redirect to="/login"/>
        }
        //2.判断当前是否已经登录
        const user=this.props.user
        if(!user._id){
            //不能再render()里面发ajax请求
            return <h2>LOADING...</h2>
        }
        //如果请求的是根路径，自动跳转到对应的主界面路由
        //等到当前请求的path
        const path = this.props.location.pathname
        if(path==="/"){
           return <Redirect to={getRedirectPath(user.type,user.header)}/>
        }

        const {navList} = this
        //得到当前导航对象
        const currentNav = navList.find(nav => nav.path === path)
       /* const user = this.props.user*/
        //根据当前登录用户的type来决定标识那个nav需要隐藏
        if (user.type==="laoban") {
            if(path==="/dashen"){
                return <Redirect to="/laoban"/>
            }
            navList[1].hide = true
        } else {
            if(path==="/laoban"){
                return <Redirect to="/dashen"/>
            }
            navList[0].hide = true
        }

        return (
            <div>
                {currentNav ? <NavBar>{currentNav.title}</NavBar> : null}
                <Switch>
                    <Route path="/laobaninfo" component={LaobanInfo}/>
                    <Route path="/dasheninfo" component={DashenInfo}/>
                    <Route path="/laoban" component={Laoban}/>
                    <Route path="/dashen" component={Dashen}/>
                    <Route path="/message" component={Message}/>
                    <Route path="/personal" component={Personal}/>
                    <Route path="/chat/:userid" component={Chat}/>
                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={this.props.unReadCount}/> : null}
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user,unReadCount:state.chat.unReadCount}),
    {getUser}
)(Main)
