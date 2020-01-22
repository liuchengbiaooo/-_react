/*
能发ajax请求的函数模块
封装了axios
函数的返回值是promise对象
*/
import axios from "axios"

export default function ajax(url, data={}, method="GET") {
    if (method === "GET") {
        //拼串
        let queryStr = ""
        /*keys方法是将object对象的属性名进行遍历放回一个真数组*/
        Object.keys(data).forEach(key => {
            const value = data[key] //通过属性名或者属性值
            queryStr += `${key}=${value}&`
        })
        if(queryStr!==""){
            //username=tom&password=123&
            queryStr =queryStr.substring(0,queryStr.length-1)//指定开始的下标和结束的下标（去掉一个多的&）
            url += "?"+ queryStr //  url?username=tom&password=123&
        }
        return axios.get(url)
    }else {
        return axios.post(url,data)
    }

}