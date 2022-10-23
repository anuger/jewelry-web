import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
        path: '/login',
        component: () => import('@/page/Login')
    },
    {
      path: '/order/print',
      component: () => import('@/page/order/Print')
    },
    {
      path: '/forget/password',
      component: () => import('@/page/ModifyPwd')
    },
    {
        path: '/',
        component: () => import('@/layout/BasicLayout'),
        children: [
            {
                path: 'order/custom/work',
                component: () => import('@/page/order/CustomWork')
            },
            {
                path: 'order/batch/work',
                component: () => import('@/page/order/BatchWork')
            },
            {
                path: 'order/query',
                component: () => import('@/page/order/DesignQuery')
            },
            {
                path: 'design/detail/:designId',
                component: () => import('@/page/order/DesignDetail')
            },
            {
                path: 'order/factory_delivery',
                component: () => import('@/page/order/FactoryDelivery')
            },
            {
                path: 'order/post',
                component: () => import('@/page/order/Post')
            },
            {
                path: 'finance/cost',
                component: () => import('@/page/finance/Cost')
            },
            {
                path: 'finance/pay',
                component: () => import('@/page/finance/Pay')
            },
            {
                path: 'finance/statistics',
                component: () => import('@/page/finance/FinanceFlow')
            },
            {
              path: "template/category",
              component: () => import('@/page/template/Category')
            },
            {
              path: "template/list",
              component: () => import("@/page/template/TemplateList")
            },
            {
              path: "template/edit",
                component: () => import("@/page/template/TemplateEdit")
            },
            {
              path: "/template/import",
              component: () => import("@/page/template/Import")
            },
            {
                path: 'setting/factory',
                component: () => import('@/page/setting/FactorySetting')
            },
            {
                path: 'setting/merchant',
                component: () => import('@/page/setting/MerchantSetting')
            },
            {
                path: 'setting/channel',
                component: () => import('@/page/setting/ChannelSetting')
            },
            {
                path: 'setting/dealer',
                component: () => import('@/page/setting/DealerSetting')
            },
            {
                path: 'setting/user',
                component: () => import('@/page/setting/UserSetting')
            },
            {
                path: '*',
                component: () => import('@/page/Index')
            }
        ]
    }
]
// 这里解决vue-router新版本(3.1.1)中点击重复路由报错的问题 https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject)
        return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch((err) => {
        if (Router.isNavigationFailure(err)) {
            // resolve err
            return err
        }
        // rethrow error
        return Promise.reject(err)
    })
}

const router = new Router({
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }
})

router.beforeEach((to, from, next) => {

    if (to.path !== "/login" && to.path !== "/forget/password" && to.path !== "/order/print") {
        if (localStorage.getItem('token')) {
            next();
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        next();
    }
});

export {
    router
}