<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="&gt;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加分类 -->
      <el-row :gutter="20">
        <el-col>
          <el-button type="primary" @click="showAddcateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 商品分类表格 -->
      <tree-table
        class="tree_table"
        :data="cateList.result"
        :columns="column"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效具名插槽 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color: #1bda78"
          ></i>
          <i
            v-else-if="scope.row.cat_deleted === true"
            class="el-icon-error"
            style="color: red"
          ></i>
        </template>
        <!-- 排序插槽 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else-if="scope.row.cat_level == 2" type="warning"
            >三级</el-tag
          >
        </template>
        <!--操作插槽 -->
        <template slot="operation" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="ShowUpdatecatedialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 6, 7, 8]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.cateList.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="isShowCatedialog"
      width="40%"
      @close="addcateDialogClosed"
    >
      <el-form
        :model="addCateFrom"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- Cascader 级联选择器 -->
          <el-cascader
            class="cascader"
            v-model="selectkeys"
            :options="parenCateList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="handleChange"
            :clearable="true"
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowCatedialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="isShowUpdatecatedialog"
      width="40%"
    >
      <el-form
        ref="updateCateform"
        :model="updateCateRromList"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="updateCateRromList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowUpdatecatedialog = false">取 消</el-button>
        <el-button type="primary" @click="updateCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类表格数据
      cateList: [],
      // 发生商品分类请求参数
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 树形表格指定列的定义
      column: [
        {
          // 树形表格标题
          label: '分类名称',
          // 树形表格内容
          prop: 'cat_name',
        },
        // 自定义内容
        {
          label: '是否有效',
          // 表示，将当前列定义为模块列（插槽）
          type: 'template',
          // 表示当前这一列使用模板名称 (具名插槽)
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation',
        },
      ],
      // 添加分类对话窗口
      isShowCatedialog: false,
      // 添加分类表单值
      addCateFrom: {
        // 父类id
        cat_pid: 0,
        // 父类名称
        cat_name: '',
        // 分类层级
        cat_level: 0,
      },
      // 效验规则
      rules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' },
        ],
      },
      // 商品分类数据列表
      parenCateList: [],
      // 指定联级选择器的配置对象
      cascaderProps: {
        // 实际选中的值
        value: 'cat_id',
        //联级选择器展示的值
        label: 'cat_name',
        children: 'children',
      },
      // 联级选择器的值
      selectkeys: [],
      // 修改分类 -----------------------
      // 修改分类对话框
      isShowUpdatecatedialog: false,
      // 修改分类from数据
      updateCateRromList: {},
    }
  },
  methods: {
    // 获取商品分类数据列表 分页查询
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryinfo,
      })
      if (res.meta.status != 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 当分页查询 页面page发生改变
    //没当分页查询页数pagenum或者展示数据pagesize方式改变就重新请求商品数据
    handleCurrentChange(newpagenum) {
      // console.log(newpagenum)  当前分页查询的最新页面数
      this.queryinfo.pagenum = newpagenum
      this.getCateList()
    },
    // 当分页查询 多少条数据size发生改变
    handleSizeChange(newpagesize) {
      // console.log(newpagesize) 当前分页查询的最新页面展示数据数量
      this.queryinfo.pagesize = newpagesize
      this.getCateList()
    },
    //点击添加分类按钮 展示对话框
    showAddcateDialog() {
      this.isShowCatedialog = true
      // 点击添加分类 获取商品分数据列表
      this.getParenCateList()
    },
    //获取商品分数据列表
    async getParenCateList() {
      const { data: res } = await this.$http.get('categories/', {
        params: {
          type: 2,
        },
      })
      if (res.meta.status != 200) {
        return this.$message.error('获取分类数据失败')
      }
      this.parenCateList = res.data
      // console.log(this.parenCateList)
    },
    // 父级分类联级选择器发生改变
    handleChange() {
      // console.log(this.selectkeys)
      // console.log(this.addCateFrom.cat_name)
      // 如果 selectkeys 数组中的length 大于0 证明选中的父级分类
      // 反之， 就说明没有选中如何父级分类  （分级分类指的是二，三级分类）
      if (this.selectkeys.length > 0) {
        //  this.addCateFrom.cate_name是双向数据绑定所以不需要我们赋值
        this.addCateFrom.cat_pid = this.selectkeys[this.selectkeys.length - 1] //父类id
        this.addCateFrom.cat_level = this.selectkeys.length //数组的长度就是  分类层级
      } else {
        // 什么都没有选默认为0
        this.addCateFrom.cat_pid = 0
        this.addCateFrom.cat_level = 0
      }
      // console.log(this.addCateFrom)
    },
    // 添加分类对话框关闭时重置表单数据
    addcateDialogClosed() {
      // 重置表单
      this.$refs.ruleForm.resetFields()
      // 重置联级选择器
      this.selectkeys = []
      //重值addCateFrom
      this.addCateFrom.cat_pid = 0
      this.addCateFrom.cat_level = 0
    },
    // 点击添加分类对话框 确定按钮  发送添加分类请求
    // 解释一下这里添加分类的意思：
    //  addCateFrom: {   //addCateFrom作为添加分类接口的参数
    //     // 父类id
    //     cat_pid: 0,  //意思是在那个父级 的层级下面添加数据
    //     // 父类名称
    //     cat_name: '', //添加的数据名称
    //     // 分类层级
    //     cat_level: 0, //选中的分类层级  意思在当前层级下面添加数据  添加的数据层级是当前层级+1
    //   },
    addCate() {
      //效验from表单
      this.$refs.ruleForm.validate(async (validate) => {
        if (validate !== true) {
          return this.$message.error('请输入父类名称')
        }
        // 发送添加分类请求
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateFrom
        )
        if (res.meta.status != 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分成功')
        // 关闭对话框
        this.isShowCatedialog = false
        // 刷新数据
        this.getCateList()
      })
    },
    //修改分类==========
    //点击了分类编辑按钮  获取当前行的数据  可以直接拿到为什么还有在发送请求拿数据？怕别人在结构是动手脚
    async ShowUpdatecatedialog(val) {
      this.isShowUpdatecatedialog = true
      // console.log(val)
      const { data: res } = await this.$http.get('categories/' + val)
      if (res.meta.status != 200) {
        return this.$message.error('获取当前分类失败')
      }
      this.updateCateRromList = res.data
      // console.log(this.updateCateRromList)
    },
    // 点击编辑分类对话框确定按钮  发起修改分类请求
    updateCate() {
      this.$refs.updateCateform.validate(async (validate) => {
        if (validate != true) {
          return this.$message.error('分类名称不能为空')
        }
        const { data: res } = await this.$http.put(
          'categories/' + this.updateCateRromList.cat_id,
          {
            cat_name: this.updateCateRromList.cat_name,
          }
        )
        if (res.meta.status != 200) {
          return this.$message.error('修改分类失败')
        }
        this.$message.success('修改成功')
        //关闭对话框
        this.isShowUpdatecatedialog = false
        // 刷新数据
        this.getCateList()
      })
    },
    // 点击删除button按钮 发起删除分类请求
    async deleteCate(id) {
      // console.log(id)
      const is = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (is == 'confirm') {
        // 确认删除
        //发送删除分类请求
        const { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status != 200) {
          return this.$message.error('删除分类失败')
        }
        this.$message.success('删除分类成功')
        //刷新数据
        this.getCateList()
      } else if (is == 'cancel') {
        // 取消删除
        return this.$message.info('以取消删除分类')
      }
    },
  },
  created() {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.tree_table {
  margin-top: 15px;
}
.cascader {
  width: 100%;
}
</style>