<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="&gt;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!--  ¶Alert 警告-->
      <el-alert
        title="警告提示的文案"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row :gutter="20" class="cateselect">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 选择商品分类联级菜单 -->
          <el-cascader
            v-model="selectkeys"
            :options="cateList"
            expand-trigger:="hover"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tabs 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBthDisabled"
            @click="isShowAddDialog = true"
          >
            添加参数
          </el-button>
          <!-- 动态参数 表格 -->
          <el-table :data="manyTableData" style="width: 100%" border>
            <el-table-column type="expand">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <!-- 详细参数 -->
                <el-tag
                  type="success"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="ShowUpdateDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBthDisabled"
            @click="isShowAddDialog = true"
          >
            添加属性
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border>
            <el-table-column type="expand">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <!-- 详细参数 -->
                <el-tag
                  type="success"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="ShowUpdateDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="isShowAddDialog"
      width="40%"
      @close="closedialog"
    >
      <el-form
        :model="addfrom"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addfrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改参数 对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="isShowUpdateDialog"
      width="40%"
      @close="closeupdatedialog"
    >
      <el-form
        :model="updatefrom"
        :rules="rules"
        ref="update_Form"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="updatefrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 联级下拉框值
      cateList: [],
      // 联级下拉框双向绑定的数组
      selectkeys: [],
      // 联级下拉框展示配置
      cascaderProps: {
        // 实际选中的值
        value: 'cat_id',
        //联级选择器展示的值
        label: 'cat_name',
        children: 'children',
      },
      // Tabs 标签页 当前name  name是那个展示对应的el-tab-pane
      activeName: 'many',
      // 因为不同标签页要展示的表格数据不同 所以要用两个变量存储
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // ======================添加参数
      // 是否展示添加分类对话框
      isShowAddDialog: false,
      // 添加参数from数据
      addfrom: {
        attr_name: '',
      },
      // 效验规则
      rules: {
        attr_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      //===========修改参数
      // 是否展示修改分类对话框
      isShowUpdateDialog: false,
      // 点击编辑获取当前行的最新数据
      updatefrom: {},
      //============详细参数
    }
  },
  methods: {
    // 获取商品分类数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
      // console.log(this.cateList)
    },
    //联级下拉框值方式变化
    handleChange() {
      // 必须要选中三级下拉框才能被选中
      if (this.selectkeys.length !== 3) {
        this.selectkeys = []
        // 重置table数据源为空
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // console.log(this.selectkeys)
      // cateId 联级选择器三级的值
      // console.log(this.cateId)

      // console.log(this.activeName)
      // 当联级选择器值发生改变时 发起获取参数列表请求
      this.getParameter()
    },
    // Tabs标签页发生改变触发
    handleClick() {
      // console.log(this.activeName)
      // 当用户点击rabs 标签页切换tbs栏时  发生请求参数列表请求
      this.getParameter()
    },
    // 获取参数列表 表格数据
    // 根据sel的值获取获取动态参数/静态属性   sel=many  获取动态餐宿  sel=only 获取静态属性
    async getParameter() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      )
      // console.log(res)
      // 因为返回的商品详细参数是 以空格分隔的字符串  所以我们要对 字符串做分割处理用数组接收
      if (res.meta.status == 200) {
        res.data.forEach((element) => {
          // 这里要加一个三元表达式判断 当前attr_vals是否为空 为空就直接返回一个空数组
          element.attr_vals =
            element.attr_vals != '' ? element.attr_vals.split(' ') : []
          // 因为每个input的值绑定的变量和是否展示input boolenan值是不一样的  所以这里我们得给 每一行添加一个属于自己的数据
          //  当前行数据input是否展示为false
          element.inputVisible = false
          //  当前行数据input数据双向绑定对象
          element.inputValue = ''
        })
      }
      if (res.meta.status == 200) {
        if (this.activeName == 'many') {
          this.manyTableData = res.data
          console.log(this.manyTableData)
        } else if (this.activeName == 'only') {
          this.onlyTableData = res.data
          console.log(this.onlyTableData)
        }
      }
    },
    // 关闭添加阐述对话框  重置form表单数据
    closedialog() {
      this.$refs.ruleForm.resetFields()
    },
    // 点击 添加参数 确定按钮 发生添加参数请求
    addParams() {
      this.$refs.ruleForm.validate(async (validate) => {
        if (validate == true) {
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addfrom.attr_name,
              attr_sel: this.activeName,
            }
          )
          if (res.meta.status !== 201) {
            return this.$message.error('添加' + this.titleText + '失败')
          }
          this.$message.success('添加' + this.titleText + '成功')
          this.isShowAddDialog = false
          this.getParameter()
        }
      })
    },
    // 点击编辑餐宿按钮
    async ShowUpdateDialog(attr_id) {
      this.isShowUpdateDialog = true
      // console.log(val)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取编剧失败')
      }
      this.updatefrom = res.data
      // console.log(this.updatefrom)
    },
    // 关闭添加阐述对话框  重置form表单数据
    closeupdatedialog() {
      this.$refs.update_Form.resetFields()
    },
    // 点击确定修改参数按钮  发送修改参数请求
    updateParams() {
      this.$refs.update_Form.validate(async (validate) => {
        if (validate == true) {
          const { data: res } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.updatefrom.attr_id}`,
            {
              attr_name: this.updatefrom.attr_name,
              attr_sel: this.activeName,
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('修改' + this.titleText + '失败')
          }
          this.$message.success('修改' + this.titleText + '成功')
          this.isShowUpdateDialog = false
          this.getParameter()
        }
      })
    },
    // 点击删除按钮 发送删除请求
    async deleteParams(id) {
      const is = await this.$confirm(
        '此操作将永久删除' + this.titleText + ', 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (is == 'confirm') {
        // 确认删除
        //发送删除请求
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${id}`
        )
        if (res.meta.status != 200) {
          return this.$message.error('删除' + this.titleText + '失败')
        }
        this.$message.success('删除' + this.titleText + '成功')
        // 刷新数据
        this.getParameter()
      } else if (is == 'cancel') {
        // 取消删除
        return this.$message.info('以取消删除' + this.titleText)
      }
    },
    // 以下属于详细参数范围
    // 点击tag  new tag按钮
    showInput(row) {
      row.inputVisible = true
      // 让文本自动获取焦点
      //$nextTick 方法的作用  就是当页面上元素被重新渲染之后 才会执行回调函数中代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 表单失去焦点获取按下enter键盘按键触发
    handleInputConfirm(row) {
      row.inputVisible = false
      // 失去焦点 亦或者按下enter后需要 对文本进行校验
      // 文本框的值在trim()清楚空格内容后  文本框的内容长度还是等于0话  那么就清空文本框且return  不发起添加内容请求
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        return
      }
      // 文本框有内容 且不是空格  那么就发起添加标签请求
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      this.setTag(row)
    },
    // tag标签发生改变发生请求
    async setTag(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          //原本接口返回的详细参数是字符串类型   我们发送请求参数也得是字符串类型
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status != 200) {
        return this.$message.error('修改tag标签失败')
      }
      this.$message.success('修改tag标签成功')
    },
    // 点击了详细参数tag的删除按钮
    handleClose(i, row) {
      //从索引i开始删除一个  也就是删除当前点击的tag标签
      row.attr_vals.splice(i, 1)
      // 发生修改tag数据请求
      this.setTag(row)
    },
  },
  created() {
    this.getCateList()
  },
  computed: {
    // 判断当前联级选择器是否选中第三级标签  是 添加按钮接触粗禁用 反之
    isBthDisabled() {
      if (this.selectkeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 获取当前联级选择器三级id
    cateId() {
      if (this.selectkeys.length === 3) {
        return this.selectkeys[2]
      }

      return null
    },
    // 根据activeName值 展示当前对话框的内容
    titleText() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else if (this.activeName == 'only') {
        return '静态属性'
      }
    },
  },
}
</script>

<style lang='less' scoped>
.cateselect {
  margin-top: 15px;
}
.el-cascader {
  margin-left: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>