<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="&gt;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        :closable="false"
        center
        show-icon
      >
      </el-alert>
      <!-- 步骤条 -->
      <!--  :active="activeName - 0"   当前tab栏的值 -0  转换成 int型 必须是减去0！  +不行-->
      <el-steps
        :space="200"
        :active="activeName - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- from表单   -->
      <el-form
        :model="addFrom"
        :rules="addFromrules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
      >
        <!-- 右展示tab栏 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeName"
          :before-leave="berforeTableave"
          @tab-click="switchTabs"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息表单 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 分类信息联级选择器-->
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="cateList"
                expand-trigger="hover"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数 -->
            <el-form-item
              :label="item.attr_name"
              v-for="(item, i) in manyData"
              :key="i"
            >
              <!-- 多选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cd"
                  v-for="(cd, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="itme.attr_name"
              v-for="itme in onlyData"
              :key="itme.attr_id"
            >
              <el-input v-model="itme.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--上传图片 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handaSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本组件 -->
            <quill-editor v-model="addFrom.goods_introduce"> </quill-editor>
            <el-button type="primary" style="margin-top: 20px" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog title="预览图片" :visible.sync="isShowPreview" width="50%">
      <img :src="previewPath" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
//导入lodash依赖 //目的拷贝对象
import _ from 'lodash'
export default {
  data() {
    return {
      //当前tab栏展示的名字 默认0
      activeName: '0',
      // 表单数据
      addFrom: {
        // 商品名称
        goods_name: '',
        // 商品所属分类
        goods_cat: [],
        // 商品价格
        goods_price: 0,
        // 商品数量
        goods_number: 0,
        // 商品重量
        goods_weight: 0,
        // 商品介绍
        goods_introduce: '',
        // 上传的图片临时的路径
        pics: [],
        //商品的参数 包含静态参数 和动态属性
        attrs: [],
      },
      // 表单效验规则
      addFromrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品所属分类/注意必须选择三级分类',
            trigger: 'change',
          },
        ],
      },
      // 商品分类列表数据
      cateList: [],
      // 联级选择器选中的值
      selectkesy: [],
      // 联级选择器定义规则
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 动态参数
      manyData: [],
      // 静态属性
      onlyData: [],
      // 图片图片============
      //上传图片的url地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象 因为图片上传调用接口 没有使用axios发送  所以没有绑定token值  没有token请求接口就会无效
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 预览图片的真实地址
      previewPath: '',
      // 预览图片对话框是否展示
      isShowPreview: false,
    }
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
      // console.log(this.cateList)
    },
    // 当联级选择器发生触发
    handleChange() {
      if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = []
      }
      // console.log(this.addFrom.goods_cat)
    },
    // 当tabs栏要切换时  不满足条件就不让切换
    berforeTableave(activeName, oldActiveName) {
      //activeName 即将进入的tbas 标签页名字
      // oldActiveName 即将离开tabs 标签页名字
      if (oldActiveName === '0' && this.addFrom.goods_cat.length !== 3) {
        this.$message.error('未选择商品分类！')
        // 返回值未false  就会阻止这次tabs 标签页切换
        return false
      }
    },
    // tabs 栏切换触发
    async switchTabs() {
      //console.log(this.activeName)
      // 当his.activeName 等于1时 就说明访问商品参数tabs标签页
      if (this.activeName == 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many',
            },
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        res.data.forEach((element) => {
          element.attr_vals =
            element.attr_vals != '' ? element.attr_vals.split(' ') : []
        })
        this.manyData = res.data
        // console.log(this.manyData)
      } else if (this.activeName == 2) {
        // 静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only',
            },
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        this.onlyData = res.data
        // console.log(this.onlyData)
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      // file  当前要预览图片的信息
      // console.log(file)
      // 1 展示图片预览对话框组件
      this.isShowPreview = true
      // 2.获取 预览图片的真实地址
      const path = file.response.data.url
      // 3.把预览图片真实地址赋值给previewPath
      this.previewPath = path
    },
    // 处理移除图片的操作
    handleRemove(file) {
      //  file 要删除的图片信息
      // console.log(file)
      //  1.获取将要被删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从addfrrom.pics数组 找到要删除图片的路径对应索引值
      const index = this.addFrom.pics.findIndex((item) => {
        item.pic === filePath
      })
      // 3.调用数组的splice方法 把要删除的图片临时路径 从pics数组中删除
      this.addFrom.pics.splice(index, 1)
      // console.log(this.addFrom)
    },
    // 图片上传成功触发
    handaSuccess(response) {
      //response 图片上传成功接口放回的信息
      // console.log(response)

      // 图片上传成功后 要把接口返回的图片临时路径保存到 addFrom 数据中  以便发起添加上商品请求
      // 添加商品请求 图片路径参数数据格式要求 pics:[{"pic":"图片临时路径"}]
      // 先要按要求处理一下图片路径请求参数
      const picInfo = { pic: response.data.tmp_path }
      //把处理好的图片临时路径放到添加商品 图片路径参数中
      this.addFrom.pics.push(picInfo)
      // console.log(this.addFrom)
    },
    // 点击添加商品 发生添加商品接口请求
    add() {
      // 进行表单效验
      this.$refs.ruleForm.validate(async (validate) => {
        if (validate == false) {
          return this.$message.error('请填写表单必填项！')
        }
        // 发送添加商品接口请求之前要对参数  按接口请求参数进行处理一下 符合请求参数的规定
        // 商品分类列表id goods_cat   要转换成以，分割的字符串
        // 注意不能直接对addfrom。goods_cat进去join处理  因为el-cascader 联级选择的 v-model  属性必须绑定的是数组  此时我们使用join会把双向数据绑定对象的数组变成字符串  之后会报错！！
        // 注意！不能直接赋值个另外一个对象 why？  对象b = 对象a 相当于把对象b的地址指向对象a的地址，实际上a和b是一个对象。两个变量共用一个内存地址，一个   变量值的改变会导致另一个变量值的改变。

        // 使用lodash 依赖深拷贝对象
        const form = _.cloneDeep(this.addFrom)
        form.goods_cat = form.goods_cat.join(',')
        // 把商品属性添加到参数中
        // 处理动态参数
        this.manyData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addFrom.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addFrom.attrs.push(newInfo)
        })
        form.attrs = this.addFrom.attrs
        // console.log(form)
        // 发送添加商品请求
        const { data: res } = await this.$http.post('goods', form)
        if (!res) {
          this.$message.success('添加商品成功')
          // 跳转到商品列表
          this.$router.push('/goods')
        }
        if (res.meta.status != 201) {
          this.$message.error('添加商品失败')
        }
      })
    },
  },
  created() {
    this.getCateList()
  },
  computed: {
    // 获取联级选择器三级分类的id
    cateId() {
      if (this.addFrom.goods_cat.length === 3) {
        return this.addFrom.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style>
</style>