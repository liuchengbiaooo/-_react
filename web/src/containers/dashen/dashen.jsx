import React, {Component} from "react"
import {connect} from "react-redux"
import UserList from "../../components/user-list/user-list"
import {getUserList} from "../../redux/actions"

/*大神主界面路由组件*/
 class Dashen extends Component {
     componentDidMount (){
         //发请求获取大神列表，保存到state中
         this.props.getUserList("laoban")
     }
    render() {
        return (
             <UserList userList={this.props.userList}/>
        )
    }
}
export default connect(
    state => ({userList:state.userList}),
    {getUserList}
)(Dashen)