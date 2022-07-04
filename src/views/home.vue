<template>
  <el-container class="Home_box">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#323743"
          text-color="#fff"
          active-text-color="#5685D0"
        >
          <!-- 菜单模块区域 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单 -->
            <template slot="title">
              <!-- 一级菜单字体图标 -->
              <i class="el-icon-s-custom"></i>
              <!-- 一级菜单文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subitem.id + ''"
              v-for="subitem in item.children"
              :key="subitem.id"
            >
              <!-- 二级菜单字体图标 -->
              <i class="el-icon-menu"></i>
              <!-- 二级菜单文本 -->
              <span>{{ subitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getmenu()
  },
  data() {
    return {
      // 侧边栏菜单
      menuList: [],
      // 侧边栏图标
      iocnobj: {
        125: '',
        103: '',
        101: '',
        102: '',
        145: '',
      },
    }
  },
  methods: {
    // 退出登陆
    logout() {
      // 删除token
      window.sessionStorage.clear('token')
      // 跳转登陆
      this.$router.push('/login')
    },
    // 获取侧边栏菜单
    async getmenu() {
      const { data: res } = await this.$http.get('menus')
      //获取侧边栏菜单失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 成功就赋值请求返回的数据
      this.menuList = res.data
      // console.log(res)
      console.log(this.menuList)
    },
  },
}
</script>

<style lang="less"  scoped>
.el-header {
  background-color: #373d3f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 20px;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #30353e;
}
.el-main {
  background-color: #e9edf0;
}
.Home_box {
  height: 100%;
}
</style>