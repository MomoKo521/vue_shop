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
      <el-aside :width="isMenucollapse ? '60px ' : '200px'">
        <!-- 菜单折叠 -->
        <div class="Menucollapse" @click="toMenucollapse()">| | |</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#323743"
          text-color="#fff"
          active-text-color="#5685D0"
          :collapse="isMenucollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="componentpaht"
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
              <i :class="iocnobj[item.id]"></i>
              <!-- 一级菜单文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + item.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="activepaht('/' + item.path)"
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
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getmenu()
    this.componentpaht = window.sessionStorage.getItem('activepaht')
  },
  data() {
    return {
      // 侧边栏菜单
      menuList: [],
      // 侧边栏图标
      iocnobj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-box',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing',
      },
      //菜单栏折叠切换
      isMenucollapse: false,
      // 组件路由
      componentpaht: '',
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
      // console.log(this.menuList)
    },
    // 折叠菜单栏
    toMenucollapse() {
      this.isMenucollapse = !this.isMenucollapse
    },
    // 存储点击菜单栏跳转路由
    activepaht(val) {
      // console.log(val)
      window.sessionStorage.setItem('activepaht', val)
      this.componentpaht = val
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
  .Menucollapse {
    color: #fff;
    font-size: 14px;
    line-height: 36px;
    background-color: #777a81;
    text-align: center;
    cursor: pointer;
  }
}
.el-main {
  background-color: #e9edf0;
}
.Home_box {
  height: 100%;
}
.el-menu {
  border: none;
}
</style>