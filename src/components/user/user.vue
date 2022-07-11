<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="&gt;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="empty"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="isshowadduser = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 用户信息 表格-->
      <el-table :data="usersList" :stripe="true" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽  获取当前行的数据slot-scope  scope未知？    scope-row是当前行的数据信息-->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getupdatesg(scope.row.id)"
            >
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteuser(scope.row.id)"
            ></el-button>
            <!-- el-tooltip 文字提示 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
                @click="getdistribute(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页查询 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 新增用户窗口 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isshowadduser"
      width="50%"
      @close="dialogClose"
    >
      <!-- 新增用户表单 -->
      <el-form
        :model="addUsersFrom"
        :rules="rules"
        ref="ruleForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUsersFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUsersFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUsersFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUsersFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isshowadduser = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息窗口 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="isShowupdateuser"
      width="40%"
      @close="updatedialogClose"
    >
      <el-form ref="form" :model="updataList" label-width="70px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updataList.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="updataList.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updataList.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowupdateuser = false">取 消</el-button>
        <el-button @click="updateuser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色窗口 -->

    <el-dialog title="分配角色" :visible.sync="setdialog" width="30%">
      <p>当前的用户：{{ this.userinfos.username }}</p>
      <p>当前的角色：{{ this.userinfos.role_name }}</p>
      <p>
        <el-select v-model="selectroleid" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setdialog = false">取 消</el-button>
        <el-button type="primary" @click="setselectroleid">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义表单邮箱效验规则
    var checkEmail = (rule, value, cd) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cd()
      }
      cd(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cd) => {
      const rregMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (rregMobile.test(value)) {
        return cd()
      }
      cd(new Error('请输入合法的手机号'))
    }
    return {
      // query 查询用户名  pagenum 页   pagesize 每页多少条数据
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      // 用户信息
      usersList: [],
      // 用户信息总数量
      total: 0,
      // 新增用户功能
      // 是否显示新增用户窗口
      isshowadduser: false,
      // 新增用户表单信息
      addUsersFrom: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 是否展示修改用户信息
      isShowupdateuser: false,
      // 修改表单数据
      updataList: {},
      // 效验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },

          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 分配角色对话框
      setdialog: false,
      // 当前点击分配角色信息
      userinfos: {},
      // 角色列表
      rolesList: {},
      // 被角色列表slelect下拉框选中的值
      selectroleid: '',
    }
  },
  methods: {
    // 获取用户列表信息
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryinfo,
      })
      this.usersList = res.data.users
      this.total = res.data.total
      console.log(this.usersList)
    },
    //监听  每页显示条数个数
    handleSizeChange(newsize) {
      // console.log(newpage + '条数据')
      this.queryinfo.pagesize = newsize
      this.getUsersList()
    },
    // 监听 当前页数发生改变
    handleCurrentChange(newpage) {
      // console.log(newpage + '页')
      this.queryinfo.pagenum = newpage
      this.getUsersList()
    },
    // 监听 用户状态发生改变
    async userStateChanged(userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        this.$message.error('更新状态失败')
      } else {
        this.$message.success('更新状态成功')
      }
    },
    // 监听搜索框内容清空
    empty() {
      this.getUsersList()
    },
    // 关闭新增用户窗口清空表单数据
    dialogClose() {
      // resetFields vue from函数
      this.$refs.ruleForm.resetFields()
    },
    // 新增用户
    addUser() {
      // validate vue 验证from表单函数
      this.$refs.ruleForm.validate(async (valid) => {
        // console.log(valid)  获取表单效验的结果：返回值boolenan  只要指定的from表单有一项效验未通过就返回false
        if (valid == false) {
          this.$message.error('请按要求填写信息')
          return
        }
        const { data: res } = await this.$http.post('users', this.addUsersFrom)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        }
        // console.log(res)
        this.$message.success(res.meta.msg)
        // 重新获取用户信息
        this.getUsersList()
        // 关闭窗口
        this.isshowadduser = false
      })
    },
    // 点击修改获取要修改的用户信息
    async getupdatesg(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      // console.log(res)
      this.updataList = res.data
      // 开启修改user窗口
      this.isShowupdateuser = true
    },
    // 关闭修改用户窗口 重置输入框
    updatedialogClose() {
      this.$refs.form.resetFields()
    },
    // 点击确定 发起axios请求修改用户信息
    updateuser() {
      this.$refs.form.validate(async (validate) => {
        if (validate == false) {
          this.$message.error('信息错误！')
        } else {
          const { data } = await this.$http.put('users/' + this.updataList.id, {
            email: this.updataList.email,
            mobile: this.updataList.mobile,
          })
          // console.log(data)
          if (data.meta.status != 200) {
            this.$message.error('修改失败')
          } else {
            this.$message.success('修改成功')
            // 更新数据
            this.getUsersList()
            // 关闭修改窗口
            this.isShowupdateuser = false
          }
        }
      })
    },
    // 删除用户
    async deleteuser(id) {
      const decision = await this.$confirm(
        '此操作将永久删除用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 如果用户点击确认删除，则返回值为字符串confirm
      // 如果用户点击取消删除，则返回值为字符串cancel
      // console.log(decision)
      if (decision !== 'confirm') {
        return this.$message.info('以取消删除')
      }
      // 发生删除用户axios请求
      const { data } = await this.$http.delete('users/' + id)
      console.log(data)
      if (data.meta.status != 200) {
        this.$message.error('删除用户失败')
        return
      }
      this.$message.success('删除用户成功')
      // 刷新用户列表
      this.getUsersList()
    },
    // 获取角色列表
    async getdistribute(user) {
      // 清空上次select值
      this.selectroleid = ''
      this.setdialog = true
      // console.log(user)
      this.userinfos = user
      // 获取角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status == 200) {
        this.rolesList = res.data
        // console.log(this.rolesList)
      }
    },
    // 点击确定按钮 分配角色
    async setselectroleid() {
      if (!this.selectroleid) {
        return this.$message.error('请选择分配角色')
      }
      // 发生接口请求更新分配角色
      const { data: res } = await this.$http.put(
        `users/${this.userinfos.id}/role`,
        {
          rid: this.selectroleid,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配新角色失败')
      }
      this.$message.success('分配新角色成功')
      // 刷新数据
      this.getUsersList()
      // 关闭分配角色对话框
      this.setdialog = false
    },
  },
  created() {
    this.getUsersList()
  },
}
</script>

<style>
</style>