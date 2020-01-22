import React, {Component} from "react"
import {connect} from  "react-redux"
import {Redirect} from "react-router-dom"
import HeaderSelector from "../../components/header-selector/header-selector"
import {NavBar, InputItem, TextareaItem, Button} from "antd-mobile"
import {updateUser} from "../../redux/actions";

class DashenInfo extends Component {
    //收集开始数据
    state = {
        header: "",
        info: "",
        post: "",
        company: "",
        salary: ""
    }

    setHeader = (header) =>{
        this.setState({
            header
        })
    }

    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    save = () => {
        this.props.updateUser(this.state)
    }

    render() {
        //如果信息已经完善，自动跳转到/dashen
        const {header} = this.props.user
        if(header){
            return <Redirect to="/dashen"/>
        }
        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder="请输入求职单位" onChange={val => this.handleChange("post",val)}>求职单位:</InputItem>
                <TextareaItem
                    title="个人描述"
                    placeholder="请输入个人描述"
                    rows={3}
                    onChange={val => this.handleChange("info",val)}
                />
                <Button type="primary" onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {updateUser}
)(DashenInfo)