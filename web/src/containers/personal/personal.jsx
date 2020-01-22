import React, {Component} from "react"
import {connect} from "react-redux"
import {Result,List,WhiteSpace,Button,Modal} from "antd-mobile"
import Cookies from "js-cookie"
import {errorMsg} from "../../redux/actions"
/*消息中心路由组件*/

const Item = List.Item
const Brief = Item.Brief

 class Personal extends Component {

     logout = ()=>{
         Modal.alert("退出","确定退出登录吗?",[
             {
                 text:"取消",
                 onPress:()=> console.log("cancel")
             },
             {
                 text:"确定",
                 onPress:()=> {
                     //删除user_id的cookie
                     Cookies.remove("user_id")
                     //重置redux的state中的用户信息
                     this.props.errorMsg()
                 }
             }
         ])
     }

    render() {
        const {username,header,post,info,salary,company} = this.props.user
        return (
            <div>
                <Result
                img={<img src={require(`../../assets/images/${header}.png`)} style={{width:50}} alt="header"/>}
                title={username}
                message={company}
                />
                <List>
                    <Item multipleLine>
                        {post ? <Brief>职位:{post} </Brief>:null}
                        {info ? <Brief>简介:{info} </Brief>:null}
                        {salary ? <Brief>薪资:{salary} </Brief>:null}
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Button type="warning" onClick={this.logout}>退出登录</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state =>({user:state.user}),
    {errorMsg}
)(Personal)
