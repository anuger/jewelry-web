import {axios} from '@/api/http';

const api = {
    login: (user) => {
        return axios({
            url: '/login',
            method: 'post',
            data: user
        })
    },
    logout: () => {
        return axios({
            url: "/logout",
            method: "delete"
        })
    },
    // 首页
    getTodo: () => {
        return axios({
            url: "/index/todo",
            method: "get"
        })
    },
    getDealerOrder: (beginDate, endDate) => {
        return axios({
            url: "/index/dealer/order",
            method: "get",
            params: {beginDate, endDate}
        })
    },
    getChannelOrder: (beginDate, endDate) => {
        return axios({
            url: "/index/channel/order",
            method: "get",
            params: {beginDate, endDate}
        })
    },
    getSaleRank: (designType, beginDate, endDate) => {
        return axios({
            url: "/index/sale/rank",
            method: "get",
            params: {designType, beginDate, endDate}
        })
    },
    // 工厂管理
    getFactoryList: () => {
        return axios({
            url: "/factories",
            method: "get"
        })
    },
    addFactory: (factory) => {
        return axios({
            url: "/factory",
            method: "post",
            data: factory
        })
    },
    modifyFactory: (factory, factoryId) => {
        return axios({
            url: "/factory/" + factoryId,
            method: "put",
            data: factory
        })
    },
    removeFactory: (factoryId) => {
        return axios({
            url: "factory/" + factoryId,
            method: "delete"
        })
    },
    // 商户管理
    getMerchant: () => {
        return axios({
            url: "/merchant",
            method: "get"
        })
    },
    modifyMerchantName: (merchantName) => {
        return axios({
            url: "/merchant",
            method: "put",
            data: {
                merchantName
            }
        })
    },
    // 渠道管理
    addChannel: (channel) => {
        return axios({
            url: "/channel",
            method: "post",
            data: channel
        })
    },
    removeChannel: (channelId) => {
        return axios({
            url: "/channel/" + channelId,
            method: "delete"
        })
    },
    modifyChannel: (channel, channelId) => {
        return axios({
            url: "/channel/" + channelId,
            method: "put",
            data: channel
        })
    },
    getChannelList: () => {
        return axios({
            url: "/channels",
            method: "get"
        })
    },
    // 经销商管理
    addDealer: (dealer) => {
        return axios({
            url: "/dealer",
            method: "post",
            data: dealer
        })
    },
    removeDealer: (dealerId) => {
        return axios({
            url: "/dealer/" + dealerId,
            method: "delete"
        })
    },
    modifyDealer: (dealer, dealerId) => {
        return axios({
            url: "/dealer/" + dealerId,
            method: "put",
            data: dealer
        })
    },
    getDealerList: () => {
        return axios({
            url: "/dealers",
            method: "get"
        })
    },
    // 用户管理
    addUser: (user) => {
        return axios({
            url: "/user",
            method: "post",
            data: user
        })
    },
    removeUser: (userId) => {
        return axios({
            url: "/user/" + userId,
            method: "delete"
        })
    },
    modifyUser: (user, userId) => {
        return axios({
            url: "/user/" + userId,
            method: "put",
            data: user
        })
    },
    getUserList: () => {
        return axios({
            url: "/users",
            method: "get"
        })
    },
    // 订单
    getWorkNotify: () => {
        return axios({
            url: "/design/notify",
            method: "get"
        })
    },
    getTemplateWork: () => {
        return axios({
            url: "/design/template/status/1",
            method: "get"
        })
    },
    getCustomWork: (status) => {
        return axios({
            url: "/design/custom/status/" + status,
            method: "get"
        })
    },
    getFactoryOptions: () => {
        return axios({
            url: "/options/factory",
            method: "get"
        })
    },
    checkTemplate: (designOrderId, salePrice, deliveryTime) => {
        return axios({
            url: "/design/template/check/" + designOrderId,
            method: "post",
            data: {
                salePrice,
                deliveryTime
            }
        })
    },
    checkCustom: (designOrderId, salePrice, deliveryTime, isNeedCad) => {
        return axios({
            url: "/design/custom/check/" + designOrderId,
            method: "post",
            data: {
                salePrice,
                deliveryTime,
                isNeedCad
            }
        })
    },
    uploadImage: (file) => {
        return axios({
            url: "/image",
            method: "post",
            data: file,
            headers: {
                'Content-Type': 'multipart/form-data;charset=UTF-8'
            }
        })
    },
    uploadFile: (file) => {
        return axios({
            url: "file",
            method: "post",
            data: file,
            headers: {
                'Content-Type': 'multipart/form-data;charset=UTF-8'
            }
        })
    },
    uploadCad: (cadImage, cadFile, designId) => {
        return axios({
            url: "/design/custom/upload/" + designId,
            method: "post",
            data: {
                cadFile,
                cadImage
            }
        })
    },
    produce: (designId, factoryId) => {
        return axios({
            url: "/design/custom/produce/" + designId,
            method: "post",
            data: {
                factoryId
            }
        })
    },
    // 查订单
    queryDesign: (query) => {
        return axios({
            url: "/designs",
            method: "get",
            params: query
        })
    },
    // 工厂出货
    getDeliveryDesign: (query) => {
        return axios({
            url: "/designs/delivery",
            method: "get",
            params: query
        })
    },
    designDelivery: (designId, data) => {
        return axios({
            url: "/design/delivery/" + designId,
            method: "post",
            data: data,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
    },
    // 寄货列表
    getSendDesign: (query) => {
        return axios({
            url: "/designs/send",
            method: "get",
            params: query
        })
    },
    send: (designId, fare, salePrice, packageFee, cert) => {
        return axios({
            url: "/design/send/" + designId,
            method: "post",
            data: {
                fare,
                salePrice,
                packageFee,
                cert
            }
        })
    },
    // 查询详情
    getDesignDetails: (designId) => {
        return axios({
            url: "/design/" + designId,
            method: "get"
        })
    },
    // 财务管理
    getPayList: (query) => {
        return axios({
            url: "/designs/pay",
            method: "get",
            params: query
        })
    },
    getCostList: (query) => {
        return axios({
            url: "/designs/cost",
            method: "get",
            params: query
        })
    },
    addFinalFee: (designId, payImages, remark) => {
        return axios({
            url: "design/final_fee/" + designId,
            method: "post",
            data: {payImages, remark}
        })
    },
    getCosts: (designId) => {
        return axios({
            url: "design/costs/" + designId,
            method: "get"
        })
    },
    removeCost: (costId) => {
        return axios({
            url: "/design/cost/" + costId,
            method: "delete"
        })
    },
    modifyCost: (costId, data) => {
        return axios({
            url: "/design/cost/" + costId,
            method: "put",
            data: data
        })
    },
    addCost: (data, designId) => {
        return axios({
            url: "/design/cost/" + designId,
            method: "post",
            data: data
        })
    },
    getFinanceStatistics: () => {
        return axios({
            url: "/finance/statistics",
            method: "get"
        })
    },
    getDealerStatistics: (beginDate, endDate) => {
        return axios({
            url: "/finance/dealer/statistics",
            method: "get",
            params: {beginDate, endDate}
        })
    },
    getChannelStatistics: (beginDate, endDate) => {
        return axios({
            url: "/finance/channel/statistics",
            method: "get",
            params: {beginDate, endDate}
        })
    },
    //版库管理
    addCategory: (data) => {
        return axios({
            url: "/template/category",
            method: "post",
            data: data
        })
    },
    removeCategory: (categoryId) => {
        return axios({
            url: "/template/category/" + categoryId,
            method: "delete"
        })
    },
    modifyCategory: (categoryId, data) => {
        return axios({
            url: "/template/category/" + categoryId,
            method: "put",
            data: data
        })
    },
    getCategoryList: () => {
        return axios({
            url: "/template/categories",
            method: "get"
        })
    },
    getCategoryOption: () => {
        return axios({
            url: "/template/category/option",
            method: "get"
        })
    },
    // config
    getConfig: () => {
        return axios({
            url: "/config",
            method: "get"
        })
    },
    // 版库
    getTemplateList: (query) => {
        return axios({
            url: "/templates",
            method: "get",
            params: query
        })
    },
    addTemplate: (data) => {
        return axios({
            url: "/template",
            method: "post",
            data: data
        })
    },
    modifyTemplate: (templateId, data) => {
        return axios({
            url: "/template/" + templateId,
            method: "put",
            data: data
        })
    },
    removeTemplate: (templateId) => {
        return axios({
            url: "/template/" + templateId,
            method: "delete"
        })
    },
    getTemplateDetail: (templateId) => {
        return axios({
            url: "/template/" + templateId,
            method: "get"
        })
    },
    downloadExcel: () => {
        return axios({
            url: "/template/excel",
            method: "get",
            responseType: "blob"
        })
    },
    uploadExcel: (file) => {
        return axios({
            url: "/template/excel",
            method: "post",
            data: file,
            headers: {
                'Content-Type': 'multipart/form-data;charset=UTF-8'
            }
        })
    },
    templateImport: (key) => {
        return axios({
            url: "/template/import/" + key,
            method: "post"
        })
    },
    // 小程序banner
    getBanners: () => {
        return axios({
            url: "/dealer/banners",
            method: "get"
        })
    },
    addBanner: (imageUrl) => {
        return axios({
            url: "/dealer/banner",
            method: "post",
            data: {
                imageUrl
            }
        })
    },
    removeBanner: (imageUrl) => {
        return axios({
            url: "/dealer/banner/remove",
            method: "post",
            data: {
                imageUrl
            }
        })
    },
    collectDesign: (designId, templateNo, categoryId) => {
        return axios({
            url: "/design/collect/" + designId,
            method: "post",
            data: {
                templateNo,
                templateCategoryId: categoryId
            }
        })
    },
    backDesign: (designId) => {
        return axios({
            url: "/design/back/" + designId,
            method: "put"
        })
    },
    getDesignSign: (designId) => {
        return axios({
            url: "/design/sign/" + designId,
            method: "get"
        })
    },
    getDesignPrintData: (designSign) => {
        return axios({
            url: "/design/print",
            method: "get",
            params: {
                designSign
            }
        })
    }
}

export default {
    ...api
}