<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="&gt;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- row -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="empty"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="orderList" style="width: 100%" :stripe="true" border>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100">
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == 0"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFromat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="isShowaddrss = true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-s-tools"
              size="mini"
              @click="getlogisticsList"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[10, 11, 12, 13]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totrl"
      >
      </el-pagination>
    </el-card>
    <!--修改地址对话框 -->
    <el-dialog
      title="修改收获地址"
      :visible.sync="isShowaddrss"
      width="40%"
      @close="addressdialogclosed"
    >
      <!-- 地址表单 -->
      <el-form
        :model="addressForm"
        :rules="addressRules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="DetailedAddress">
          <el-input v-model="addressForm.DetailedAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowaddrss = false">取 消</el-button>
        <el-button type="primary" @click="updateaddress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看物流对话框 -->
    <el-dialog title="查看物流信息" :visible.sync="isShowlogistics" width="30%">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in logisticsList"
          :key="index"
          :timestamp="activity.ftime"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowlogistics = false">取 消</el-button>
        <el-button type="primary" @click="isShowlogistics = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
//导入修改地址  的省市区/县 数据
import cityData from '@/components/goods/citydata.js'
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 订单列表数据
      orderList: [],
      // 总共有多少条数据
      totrl: 0,
      //是否展示修改收获地址对话框
      isShowaddrss: false,
      // 修改地址表单数据
      addressForm: {
        // 城市地址
        address: [],
        //详细地址
        DetailedAddress: '',
      },
      // 修改地址表单效验规则
      addressRules: {
        address: [{ required: true, message: '请选择城市', trigger: 'change' }],
        DetailedAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      // 修改地址  的省市区/县 数据
      cityData: cityData,
      // 是否展示查看物流对话框
      isShowlogistics: false,
      // 物流信息
      logisticsList: [],
    }
  },
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryinfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = res.data.goods
      this.totrl = res.data.total
      console.log(this.orderList)
    },
    // 点击清除搜索框
    empty() {
      console.log(this.queryinfo.query)
      this.getOrderList()
    },
    // 点击搜索
    search() {
      console.log(this.queryinfo.query)
      this.getOrderList()
    },
    // 分页==============
    // size发生改变
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize
      this.getOrderList()
    },
    // page发生改变
    handleCurrentChange(newnum) {
      this.queryinfo.pagenum = newnum
      this.getOrderList()
    },
    // 修改地址对话框关闭表单数据重置
    addressdialogclosed() {
      this.$refs.ruleForm.resetFields()
    },
    // 点击确定按钮发生修改地址请求
    // 接口文档有问题 不知道传什么参数过去
    updateaddress() {},
    // 获取物流信息
    async getlogisticsList() {
      this.isShowlogistics = true
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.logisticsList = res.data
      console.log(this.logisticsList)
    },
  },
  created() {
    this.getOrderList()
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>