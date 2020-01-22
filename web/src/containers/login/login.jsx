import React, {Component} from "react"
import {connect} from "react-redux"
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Button
} from "antd-mobile"
import {Redirect} from "react-router-dom"
import {login,errorMsg} from "../../redux/actions"
import Logo from "../../components/logo/logo"

/*用户注册的路由组件*/
class Login extends Component {
    state ={
        username:"",/*用户名*/
        password:"",/*登录密码*/
    }
    /*注册处理输入框、单选框变化，收集数据到state*/
    handleChange = (name,value)=>{
        this.setState({[name]:value})
    }
    //登录回调
    login = () =>{
        this.props.login(this.state)
    }
    render() {
        const {redirectTo,msg} = this.props.user
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>硅谷直聘</NavBar>
                <Logo/>
                <WingBlank>{/*增加两边距离*/}
                    <List>
                        {msg ? <p className='error-msg'>{msg}</p> : null}
                        <InputItem placeholder='请输入用户名' onChange={val => {this.handleChange('username', val)}}>用户名:</InputItem>
                        <WhiteSpace/>
                        <InputItem type='password' placeholder='请输入密码' onChange={val => {this.handleChange('password', val)}}>密码:</InputItem>
                        <WhiteSpace/>
                        <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;陆</Button>
                        <WhiteSpace/>
                        <Button onClick={() => {this.props.history.replace("/register");this.props.errorMsg("")}}>还没有有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {login,errorMsg}
)(Login)