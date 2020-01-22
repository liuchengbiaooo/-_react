import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import {connect} from "react-redux"
import {updateUser}from "../../redux/actions"

import {NavBar, InputItem, TextareaItem, Button} from "antd-mobile"
import HeaderSelector from "../../components/header-selector/header-selector"

class LaobanInfo extends Component {
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
        //如果信息已经完善，自动跳转到/laoban
        const {header} = this.props.user
        if(header){
            return <Redirect to="/laoban"/>
        }
        return (
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder="请输入招聘职位" onChange={val => this.handleChange("post",val)}>招聘职位:</InputItem>
                <InputItem placeholder="请输入公司名称" onChange={val => this.handleChange("company",val)}>公司名称:</InputItem>
                <InputItem placeholder="请输入职位薪资" onChange={val => this.handleChange("salary",val)}>职位薪资:</InputItem>
                <TextareaItem
                    title="职位要求"
                    placeholder="请输入职位要求"
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
)(LaobanInfo)