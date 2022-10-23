<template>
  <div class="main">
    <div class="container">
      <div class="login-image">

      </div>
      <div class="form-panel">
        <div class="title">商户下单系统</div>
        <div class="form">
          <a-form-model id="login" :model="form" ref="loginForm" :rules="rules">
            <a-form-model-item prop="account">
              <a-input
                  auto-focus
                  size="large"
                  v-model="form.account"
                  placeholder="请输入手机号"
              >
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="password">
              <a-input
                  autocomplete
                  type="password"
                  size="large"
                  prop="password"
                  v-model="form.password"
                  placeholder="请输入密码"
                  @keyup.enter="handleSubmit"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
              </a-input>
            </a-form-model-item>
            <a-button block size="large" type="primary" class="login-btn" @click="handleSubmit">登录</a-button>
            <a-button type="link" class="m-t-4" style="float: right" @click="forgetPwd">忘记密码？</a-button>
          </a-form-model>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api/service";

export default {
  data() {
    let checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      }
      if (value.length !== 11) {
        return callback(new Error("手机号格式错误"));
      }
      callback();
    };
    let checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码"));
      }
      if (value.length < 6 || value.length > 16) {
        return callback(new Error("密码长度在6～16位之间"));
      }
      callback();
    };
    return {
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [{validator: checkAccount, trigger: "blur"}],
        password: [{validator: checkPassword, trigger: "blur"}]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          service.login({account: this.form.account, password: this.form.password})
              .then(res => {
                if (res.state === 200) {
                  this.$message.success("登录成功", 1)
                  localStorage.setItem("user", JSON.stringify(res.data.user));
                  localStorage.setItem("token", res.data.token);
                  this.$router.push("/");
                } else {
                  this.$message.info(res.message, 1);
                }
              });
        }
      });
    },
    forgetPwd() {
      this.$router.push("/forget/password")
    }
  },

  name: "login"
};
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
}

.login-image {
  width: 50%;
  background: url(../assets/login_background.png) no-repeat 50%;
}

.form-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-family: Avenir, "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-weight: 600;
  font-size: 32px;
  color: rgba(0, 0, 0, 0.85);
}

.form {
  margin-top: 50px;
  width: 276px;
}

.login-btn {
  margin-top: 20px;
}
</style>