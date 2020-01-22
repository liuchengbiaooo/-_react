/*包含n个工具函数的模块*/
//根据用户的type和header返回对应的跳转路径
export function getRedirectPath(type,header) {
    let path = type==="laoban" ? "/laoban" :"/dashen"
    if(!header){
        path += "info"
    }
    return path
}