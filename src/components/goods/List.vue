<template>
  <div>
    <!--面包屑 -->
    <el-breadcrumb separator="&gt;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- row -->
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
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addlist">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table :data="list" style="width: 100%" :stripe="true" border>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">
            <!--使用过滤器过为标准时间  |是管道符  要过滤的数据 | 过滤器名字   这里的过滤器全局挂vue中  代码在main.js中-->
            {{ scope.row.add_time | dataFromat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteList(scope.row.goods_id)"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // list数据
      list: [],
      // list数据总量
      totrl: 0,
    }
  },
  methods: {
    // 点击清空input表单
    empty() {
      this.queryinfo.query = ''
      this.getGoodsList()
    },
    // 获取分页list数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryinfo,
      })
      console.log(res)
      if (res.meta.status != 200) {
        return this.$message.error('获取list列表失败')
      }
      this.list = res.data.goods
      this.totrl = res.data.total
    },
    // 点击搜索
    search() {
      this.getGoodsList()
    },
    // 分页查询
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newnum) {
      this.queryinfo.pagenum = newnum
      this.getGoodsList()
    },
    //删除list数据
    async deleteList(id) {
      const is = await this.$confirm(
        '此操作将永久删除商品分类, 是否继续?',
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
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status != 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        // 刷新数据
        this.getGoodsList()
      } else if (is == 'cancel') {
        // 取消删除
        return this.$message.info('以取消删除')
      }
    },
    // 点击添加商品跳转商品添加组件
    addlist() {
      this.$router.push('addlist')
    },
  },
  created() {
    this.getGoodsList()
  },
}
</script>

<style lang="less" scoped>
</style>>

</style>