import React, {Component} from "react"
import {TabBar} from "antd-mobile"
import propTypes from "prop-types"
import {withRouter} from "react-router-dom"

/*主界面底部导航的组件*/
class NavFooter extends Component {
    static propTypes ={
        navList:propTypes.array.isRequired,
        unReadCount:propTypes.number.isRequired
    }
    render() {
        //对navlist进行过滤，去除hide标识为true
        const navList =this.props.navList.filter(nav => !nav.hide)
        //等到当前请求的path
        const path = this.props.location.pathname
        return (
            <TabBar>
                {
                    navList.map((nav) =>(
                        <TabBar.Item
                            badge={nav.path==="/message" ? this.props.unReadCount : 0}
                            key={nav.path}
                            icon={{uri:require(`./images/${nav.icon}.png`)}}
                            selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                            title={nav.title}
                            selected={nav.path===path}
                            onPress={()=>this.props.history.replace(nav.path)}
                        >
                        </TabBar.Item>
                    ))
                }
            </TabBar>
        )
    }
}
//向外暴露的不是NavFooter,而是通过withRouter()包装产生新的组件
//内部会向NavFooter传递路由组件的3个属性：history/location/match
export default withRouter(NavFooter)