import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button
} from "antd-mobile"

import {connect} from "react-redux"
import {register,errorMsg} from "../../redux/actions"

import Logo from "../../components/logo/logo"

/*用户注册的路由组件*/
class Register extends Component {
    state = {
        username: "", /*用户名*/
        password: "", /*用户密码*/
        password2: "", /*确定密码*/
        type: "dashen"
    }

    /*处理输入框、单选框的变化，收集数据到state*/
    handleChange = (name, value) => {
        this.setState({[name]: value})
    }

    // 注册回调
    register = async () => {
        console.log('register()', this.state)
        this.props.register(this.state)
    }

    render() {
        const {redirectTo,msg}= this.props.user
        //如果redirectTo有值，自动跳转到对应的路由
        if(redirectTo){
            // this.props.history.push(redirectTo) 用于事件回调中的自动跳转路由
            return <Redirect to={redirectTo}/> //用于render（）中的自动路由跳转

        }
        return (
            <div>
                <NavBar>硅谷直聘</NavBar>
                <Logo/>
                <WingBlank>{/*增加两边距离*/}
                    <List>
                        {msg ? <p className="error-msg">{msg}</p> : null} {/*出错了就在页面显示*/}
                        <InputItem placeholder="请输入用户名"
                                   onChange={val => this.handleChange("username", val)}>用户名:</InputItem> {/*onChange：触发事件之后会将值放入val里面*/}
                        <WhiteSpace/>
                        <InputItem type="password" placeholder="请输入密码"
                                   onChange={val => this.handleChange("password", val)}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace/>
                        <InputItem type="password" placeholder="请确认密码"
                                   onChange={val => this.handleChange("password2", val)}>确认密码:</InputItem>
                        <WhiteSpace/>
                        <List.Item>
                            <span style={{marginRight: 20}}>用户类型:</span>
                            <Radio checked={this.state.type === "dashen"} onClick={() => {this.handleChange("type", "dashen")}}>大神</Radio>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={this.state.type === "laoban"} onClick={() => {this.handleChange("type", "laoban")}}>老板</Radio>
                        </List.Item>
                        <WhiteSpace/>{/*增加内容之间距离*/}
                        <Button type="primary" onClick={this.register}>注册</Button>
                        <WhiteSpace/>
                        <Button onClick={() => {this.props.history.replace("/login");this.props.errorMsg("")}}>已经账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state =>({user:state.user}),//取值
    {register,errorMsg}
)(Register)