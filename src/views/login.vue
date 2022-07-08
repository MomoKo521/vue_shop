<template>
  <div class="login">
    <!-- 头部 -->
    <div class="login_box">
      <div class="login_img"><img src="../assets/logo.png" alt="" /></div>
      <!-- input -->
      <el-form
        :model="form"
        label-width="0px"
        class="lohin_form"
        :rules="rules"
        ref="loginFromRef"
      >
        <!--用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 用户密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-s-goods"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456',
      },
      //效验表单数据
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 5,
            message: '用户名长度在 3 到 5 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 12,
            message: '密码名长度在 6 到 12 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 重置表单
    resetLogin() {
      this.$refs.loginFromRef.resetFields()
      // console.log(this);
    },
    // 登陆
    login() {
      // 效验表单 如果都表单数据满足表单要求就返回true 否则返回false
      this.$refs.loginFromRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status !== 200) {
          // console.log(res);
          this.$message.error('登陆失败')
          return
        }
        this.$message({
          message: '登陆成功',
          type: 'success',
        })
        //登陆成功后保存后台请求的token数据 （token是用来判断你是否登陆的）
        window.sessionStorage.setItem('token', res.data.token)
        // 保存后跳转首页
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    height: 300px;
    width: 450px;
    background-color: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .login_img {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      border: 1px solid gray;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px;
      background-color: white;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: gainsboro;
      }
    }
    .lohin_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>