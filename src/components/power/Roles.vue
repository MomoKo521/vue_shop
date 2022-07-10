<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="&gt;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col>
          <el-button type="primary" @click="isShowupdateuser = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="rolesList" :stripe="true" border>
        <!-- 下拉表格 角色详细信息 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级 下拉框数据-->
            <el-row
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              :class="(index == 0 ? 'topdropdown' : '', 'Alignment ')"
              class="dropdown"
            >
              <el-col :span="5"
                ><el-tag
                  closable
                  @close="removeRRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i
              ></el-col>
              <!-- 二级 下拉框数据一 -->
              <el-col :span="19">
                <el-row
                  :class="i == 0 ? '' : 'topdropdown'"
                  class="Alignment"
                  v-for="(item2, i) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级 下拉框数据二 -->
                  <el-col :span="6"
                    ><el-tag
                      closable
                      @close="removeRRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item2_2 in item2.children"
                      :key="item2_2.id"
                      closable
                      @close="removeRRightById(scope.row, item2_2.id)"
                      >{{ item2_2.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--权限信息表格 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getupdaterole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleterole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="getAssignPermissions(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="isShowupdateuser"
      width="40%"
      @close="adddialogClose"
    >
      <el-form ref="form" :model="adduser" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="adduser.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            v-model="adduser.roleDesc"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowupdateuser = false">取 消</el-button>
        <el-button @click="addrole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="isShowupdaterole"
      width="40%"
      @close="updatedialogClose"
    >
      <el-form
        ref="updateform"
        :model="updateroleList"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updateroleList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            v-model="updateroleList.roleDesc"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowupdaterole = false">取 消</el-button>
        <el-button @click="updaaterole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色权限 对话框-->
    <el-dialog title="提示" :visible.sync="showAssignPermissions" width="30%">
      <el-tree
        :data="AssignPermissions"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer">
        <el-button @click="showAssignPermissions = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      //添加角色窗口
      isShowupdateuser: false,
      adduser: {
        roleName: '',
        roleDesc: '',
      },
      // 修改角色从窗口
      isShowupdaterole: false,
      // 要修改角色的数据
      updateroleList: {},
      //所有分配权限的数据
      AssignPermissions: [],
      // 分配权限对话框
      showAssignPermissions: false,
      // 定义分配权限Tree 树形控件
      // label Tree 树形控件描述
      // children ree 树形控件数据
      defaultProps: {
        label: 'authName',
        children: 'children',
      },
      // Tree 树形控件默认被选中的权限
      defKeys: [],
      // 当前角色id  用于添加角色权限
      roleid: '',
      // 添加角色表单验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 获取角色列表信息
    async getrolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status == 200) {
        this.rolesList = res.data
        //console.log(this.rolesList)
      }
    },
    // 关闭添加用户窗口  重置表单信息
    adddialogClose() {
      this.$refs.form.resetFields()
    },
    // 添加角色
    addrole() {
      this.$refs.form.validate(async (validate) => {
        // console.log(validate)
        // console.log(this.adduser)
        if (validate == false) {
          this.$message.error('请按要求填写信息')
          return
        }
        // 添加角色
        const { data: res } = await this.$http.post('roles', this.adduser)
        console.log(res)
        if (res.meta.status != 201) {
          this.$message.error(res.meta.msg)
          return
        }
        // 提示添加成功
        this.$message.success(res.meta.msg)
        // 刷新角色列表
        this.getrolesList()
        // 关闭添加角色窗口
        this.isShowupdateuser = false
      })
    },
    // 关闭修改用户窗口 重置输入框
    updatedialogClose() {
      this.$refs.updateform.resetFields()
    },
    // 修改角色信息
    async getupdaterole(val) {
      this.isShowupdaterole = true
      // console.log(val)
      // 根据要修改角色的id获取角色信息
      const { data: res } = await this.$http.get('roles/' + val)
      this.updateroleList = res.data
      // console.log(this.updateroleList)
    },
    // 点击确定修改角色信息
    updaaterole() {
      // 验证修改表单
      this.$refs.updateform.validate(async (validate) => {
        // console.log(validate)
        if (validate == false) {
          this.$message.error('请按要求填写信息')
          return
        }
        // 发起修改用户请求
        const { data: res } = await this.$http.put(
          'roles/' + this.updateroleList.roleId,
          {
            roleName: this.updateroleList.roleName,
            roleDesc: this.updateroleList.roleDesc,
          }
        )
        if (res.meta.status != 200) {
          this.$message.error('修改失败')
          return
        }
        this.$message.success('修改角色成功')
        //  关闭窗口
        this.isShowupdaterole = false
        // 刷新列表
        this.getrolesList()
      })
    },
    // 删除角色
    async deleterole(id) {
      const decision = await this.$confirm(
        '此操作将永久删除角色, 是否继续?',
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
      // 发送删除角色请求
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status != 200) {
        this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      // 刷新数据
      this.getrolesList()
    },
    // 删除角色权限
    async removeRRightById(role, rigthid) {
      // role当前行信息
      // rigthid点击的权限 id
      const decision = await this.$confirm(
        '此操作将永久删除角色权限, 是否继续?',
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
      //发起删除角色权限请求
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rigthid}`
      )
      if (res.meta.status !== 200) {
        this.$message.error('删除角色权限失败')
        return
      }
      this.$message.success('删除角色权限成功')
      // 刷新数据 不过是只要刷新角色权限下拉框的数据  这样下拉框就不会关闭
      //role.children 下拉框的数据源 role角色权限数据
      role.children = res.data
    },
    // 获取分配权限的数据
    async getAssignPermissions(role) {
      //展示权限对话框
      this.showAssignPermissions = true
      // 清空权限对话框默认被勾选的权限
      this.defKeys = []
      // 获取当前角色id 用于给角色添加权限
      this.roleid = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据失败')
        return
      }
      this.AssignPermissions = res.data
      //console.log(this.AssignPermissions)
      // 点击分配角色勾选当前角色以有的权限

      this.getLeafKeys(role)
    },
    // 获取当前角色权限选中状态
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys 数组中
    getLeafKeys(node) {
      // 如果如果当前node节点不包含children属性，那么则是三级节点
      if (!node.children) {
        this.defKeys.push(node.id)
        // console.log(this.defKeys)

        return
      }
      // 如果当前还不是三级节点 那么一直循环到当前节点每页children属性 也就是最后一级节点为止
      // why？？因为是根据把角色权限的权限id存到数组中 然后根据数组中的id默认勾选权限  做到打开分配角色权限  以存在的权限默认被勾选 不必担心二级和一级权限勾选 如果三级有勾那么上级节点机会自动勾选 这是vue组件的功能
      node.children.forEach((element) => {
        this.getLeafKeys(element)
      })
    },
    // 给角色添加权限
    async allotRights() {
      // 获取被选中的id
      // getCheckedKeys返回目前被选中的节点的 key 所组成的数组
      // getHalfCheckedKeys返回目前半选中的节点的 key 所组成的数组 也就是一、二级节点的key 也就是id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // console.log(keys)
      // 因为添加权限接口参数中的rids是字符串类型
      const idtsr = keys.join(',')
      // 角色id得是int型
      this.roleid = parseInt(this.roleid)
      // console.log(this.roleid)
      const { data: res } = await this.$http.post(
        `roles/${this.roleid}/rights`,
        {
          rids: idtsr,
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error('更新角色权限失败')
        return
      }
      this.$message.success('更新角色权限成功')
      //关闭角色权限对话框
      this.showAssignPermissions = false
      //刷新数据
      this.getrolesList()
    },
  },
  created() {
    this.getrolesList()
  },
}
</script>

<style>
.dropdown {
  border-bottom: 1px solid #eee;
}
.topdropdown {
  border-top: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
/* 角色下拉框信息垂直居中对齐 */
.Alignment {
  display: flex;
  align-items: center;
}
</style>