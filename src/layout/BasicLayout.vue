<template>
  <a-layout :style="{ height: '100%' }">
    <!--    侧边栏-->
    <a-layout-sider
        width="200"
        class="layout-color"
        :style="{ overflowY: 'auto', overflowX: 'hidden',boxShadow: '2px 0 8px 0 rgb(29 35 41 / 5%)' }"
    >
      <div class="logo-panel">
        <div class="logo">logo</div>
      </div>
      <!--        菜单-->
      <a-menu
          mode="inline"
          class="layout-color"
          :style="{ borderRight: 0 }"
          @select="changeMenu"
          :selectedKeys="[$route.path]"
      >
        <template v-for="menu in menus">
          <a-menu-item v-if="!menu.childMenus" :key="menu.url">
            <a-icon :type="menu.icon"/>
            {{ menu.menuName }}
          </a-menu-item>
          <a-sub-menu v-if="menu.childMenus && (!menu.auth || account.userRoles.includes(menu.role))" :key="menu.menuName">
            <span slot="title"><a-icon :type="menu.icon"/>{{ menu.menuName }}</span>
            <a-menu-item
                v-for="childMenu in menu.childMenus"
                :key="childMenu.url"
                :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }"
            >
              {{ childMenu.menuName }}
              <a-badge :count="childMenu.messageCount || 0"/>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <!--    头部-->
    <a-layout>
      <a-layout-header
          class="layout-header"
      >
        <div class="layout-header-title">xx商户系统</div>
        <a-dropdown>
          <div class="header-user-panel">
            <a-avatar size="small" icon="user"/>
            <span class="header-user m-l-4">{{ account.merchantName + '(' + account.username + ')' }}</span>
          </div>
          <a-menu slot="overlay">
            <a-menu-item @click="logout">
              <a>注销</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-layout-header>
      <!--      内容展示-->
      <a-layout-content :style="{ overflow: 'auto' }">
        <div class="content">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </a-layout-content>
      <!--        底部-->
      <!--      <a-layout-footer>-->
      <!--        <div class="footer">深圳xxxx有限公司</div>-->
      <!--      </a-layout-footer>-->
    </a-layout>
  </a-layout>
</template>

<script>
import service from "@/api/service";

export default {
  data() {
    return {
      account: JSON.parse(localStorage.getItem("user")),
      collapsed: false,
      selectedKeys: [],
      timer: '',
      menus: [
        {
          icon: 'dashboard',
          menuName: "首页",
          url: '/'
        },
        {
          icon: 'project',
          menuName: "订单",
          url: '/order',
          role: 1,
          auth: false,
          childMenus: [
            {
              menuName: "非定制新单",
              url: '/order/batch/work',
              messageCount: 0
            },
            {
              menuName: "定制新单",
              url: '/order/custom/work',
              messageCount: 0
            },
            {
              menuName: "查订单",
              url: '/order/query'
            },
            {
              menuName: "工厂出货",
              url: '/order/factory_delivery'
            },
            {
              menuName: "寄货",
              url: '/order/post'
            }
          ]
        },
        {
          icon: 'wallet',
          menuName: "财务管理",
          url: '/finance',
          role: 2,
          auth: false,
          childMenus: [
            {
              menuName: "付款",
              url: '/finance/pay'
            },
            {
              menuName: "成本",
              url: '/finance/cost'
            },
            {
              menuName: "流水",
              url: '/finance/statistics'
            }
          ]
        },
        {
          icon: 'compass',
          menuName: "版库",
          url: '/template',
          role: 3,
          auth: false,
          childMenus: [
            {
              menuName: "我的版库",
              url: '/template/list'
            },
            {
              menuName: "类别管理",
              url: '/template/category'
            }
          ]
        },
        {
          icon: 'setting',
          menuName: "设置",
          url: '/setting',
          role: 5,
          auth: true,
          childMenus: [
            {
              menuName: "工厂设置",
              url: '/setting/factory'
            },
            {
              menuName: "商户设置",
              url: '/setting/merchant'
            },
            {
              menuName: "渠道设置",
              url: '/setting/channel'
            },
            {
              menuName: "经销商设置",
              url: '/setting/dealer'
            },
            {
              menuName: "用户设置",
              url: '/setting/user'
            }
          ]
        }
      ]
    };
  },
  //监听路由变化，发生变化时更新菜单
  watch: {
    $route: function () {
      this.selectedKeys = [this.$route.matched[0].path.substring(1)];
      this.account = JSON.parse(localStorage.getItem("user"));
    }
  },
  methods: {
    changeMenu(obj) {
      const path = obj.key;
      this.$router.push(path);
    },
    // 注销
    logout() {
      service.logout()
          .then(res => {
            if (res.state === 200) {
              localStorage.removeItem("token");
              this.$router.push("/login");
            } else {
              this.$message.error("注销失败", 1);
            }
          })
    },
    getNotify() {
      if(this.$route.path !== "/login") {
        service.getWorkNotify()
            .then(res => {
              if (res.state === 200) {
                this.menus[1].childMenus[0].messageCount = res.data.templateCheckCount;
                this.menus[1].childMenus[1].messageCount = res.data.customCheckCount + res.data.customUploadCount + res.data.customProduceCount;
              }
            })
      }
    },
  },
  // 创建时根据路由匹配选择的菜单
  created() {
    this.selectedKeys = [this.$route.matched[0].path.substring(1)];
    this.getNotify();
    this.timer = setInterval(this.getNotify, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  name: "BasicLayout"
};
</script>

<style scoped>

.logo-panel {
  height: 128px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: #6286e8;
  color: #ffffff;
  line-height: 64px;
  text-align: center;
}

.layout-header {
  display: flex;
  align-items: center;
  padding: 0 25px 0 25px;
  color: #666666;
  background-color: white;
  justify-content: space-between;
  margin-bottom: 2px;
  box-shadow: 0 0 8px 2px rgb(29 35 41 / 5%);
}

.layout-header-title {
  font-weight: 400;
  font-size: 20px;
}

.header-user-panel {
  display: flex;
  align-items: center;
  height: 40px;
}

.header-user {
  font-size: 14px;
}

.layout-color {
  background-color: white;
}

.content {
  padding: 1px 12px 1px 12px;
}
</style>