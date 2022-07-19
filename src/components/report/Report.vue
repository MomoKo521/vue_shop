<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="&gt;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 第二步 为 ECharts 准备一个定义了宽高的 DOM-->
      <div id="main" style="width: 700px; height: 600px"></div>
    </el-card>
  </div>
</template>

<script>
// 第一步 npm install echarts --save 下载并 导入echarts组件
import * as echarts from 'echarts'
//导入lodash  目的：使用lodash 合并功能
import _ from 'lodash'
export default {
  data() {
    return {
      // 当前aixos请求返回的图表的配置项和数据还不满足要求  要和options合并成完整的数据表
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  methods: {},
  created() {},
  // 当DOM元素加载完成时
  async mounted() {
    // 第三步   基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 第四步 指定图表的配置项和数据
    // 获取基本数据表数据
    const { data: res } = await this.$http.get('reports/type/1')
    // console.log(res)
    // 合并数据
    const result = _.merge(res.data, this.options)
    // 第五步 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
}
</script>

<style lang="less" scoped>
</style>