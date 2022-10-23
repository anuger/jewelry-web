<template>
  <div class="main">
    <div class="container">
      <div class="step-panel">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.key" :title="item.title"/>
        </a-steps>
        <div>
          <div class="data-panel" v-if="current===0">
            <a-form-model
                :labelCol="{span: 5}"
                :wrapperCol="{span: 19}"
            >
              <a-form-model-item label="手机号">
                <a-input placeholder="请输入手机号" v-model="phone"/>
              </a-form-model-item>
              <a-form-model-item label="验证码" style="margin-top: 40px">
                <div style="display: flex">
                  <a-input placeholder="请输入验证码" v-model="verifyCode"/>
                  <a-button style="margin-left: 12px" @click="sendVerify" :disabled="timer !== ''">{{ timer ? time : '发送' }}</a-button>
                </div>
              </a-form-model-item>
              <a-button type="primary" style="margin-top: 25px" @click="modifyPwd">下一步</a-button>
            </a-form-model>
          </div>
          <div class="data-panel" v-if="current===1">
            <a-form-model
                :labelCol="{span: 5}"
                :wrapperCol="{span: 15}"
            >
              <a-form-model-item label="新密码">
                <a-input palceholder="请输入新密码" v-model="password"/>
              </a-form-model-item>
              <a-form-model-item label="确认密码">
                <a-input palceholder="请再输入一遍新密码" v-model="againPassword"/>
              </a-form-model-item>
              <a-button>登录</a-button>
            </a-form-model>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      phone: '',
      verifyCode: '',
      password: '',
      againPassword: '',
      time: 60,
      timer: '',
      steps: [
        {
          title: '验证',
          key: 1
        },
        {
          title: '修改密码',
          key: 2
        },
        {
          title: '登录',
          key: 3
        }
      ]
    }
  },
  methods: {
    modifyPwd() {
      this.current = 1;
    },
    sendVerify() {
      if (this.phone.length !== 11) {
        return this.$message.error("手机号格式不正确")
      }
      // 发送验证码
      this.timer = setInterval(() => {
        if (this.time > 1 && this.time <= 60) {
          this.time--;
        } else {
          clearInterval(this.timer);
          this.timer = '';
          this.time = 60;
        }
      }, 1000);
    }
  },
  name: "ModifyPwd"
}
</script>

<style scoped>
.main {
  min-height: 100%;
  background-size: 100%;
  position: relative;
  background-color: #01C9CF;
}

.container {
  position: absolute;
  top: 50%;
  right: 50%;
  margin-top: -340px;
  margin-right: -500px;
  width: 1000px;
  height: 680px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  padding: 25px;
}

.step-panel {
  width: 95%;
}

.data-panel {
  display: flex;
  height: 500px;
  justify-content: center;
  align-items: center;
  margin-top: 48px;
}
</style>