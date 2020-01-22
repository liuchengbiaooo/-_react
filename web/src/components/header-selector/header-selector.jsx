import React, {Component} from "react"
import {List, Grid} from "antd-mobile"
import propTypes from "prop-types"
/*选择用户头像*/
export default class HeaderSelector extends Component {

    static propTypes = {
        setHeader: propTypes.func.isRequired
    }

    state = {
        icon: null
    }

    constructor(props) {
        super(props)
        const headers = []
        for (var i = 0; i < 20; i++) {
            const text = "头像" + (i + 1)
            const icon = require(`../../assets/images/${text}.png`) //动态引入图片
            headers.push({
                icon,
                text
            })
        }
        this.headers = headers
    }

    getHeader = ({text, icon}) => {
        //更新自身的icon状态
        this.setState({
            icon
        })
        //更新父组件的header状态
        this.props.setHeader(text)
    }

    render() {
        const {icon} = this.state
        //根据icon来动态确定头部界面
        const listHeader = !icon ? `请选择头像`:<div>已选择头像<img src={icon} alt="icon"/></div>
        return (
            <List renderHeader={() => listHeader}>
                <Grid data={this.headers}
                      columnNum={5}
                      onClick={this.getHeader}>
                </Grid>
            </List>
        )
    }
}