import axios from 'axios'
import message from 'ant-design-vue/lib/message'
import { router } from '@/config/router'
import * as Qs from "qs";

const serverHost = ' http://localhost:8088'
const baseUrl = serverHost + '/merchant'
const service = axios.create({
    baseURL: baseUrl,
    timeout: 12000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
        function(data, headers) {
            if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
                // 把一个参数对象格式化为一个字符串
                return Qs.stringify(data)
            } else if (headers['Content-Type'] === 'multipart/form-data;charset=UTF-8') {
                return data
            } else {
                headers['Content-Type'] = 'application/json'
            }
            return JSON.stringify(data)
        }
        ]
})

const err = (error) => {
    if (error.response) {
        message.error('服务器连接失败')
    }
    return Promise.reject(error)
}
const response = (response) => {
    const data = response.data
    if (data.state === 610 ) {
        router.push('/login')
    } else if (data.state === 500) {
        message.error('服务器出错!', 1)
    }
    return data
}

service.interceptors.request.use(
    config => {
        if (localStorage.token) {
            config.headers.token = localStorage.token;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

service.interceptors.response.use(response, err)

export {
    service as axios
}
