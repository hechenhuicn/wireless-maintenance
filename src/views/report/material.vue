<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getMeteral, exportMeteral } from '@/api'

let reportSearchForm = reactive({
    networkType: ''//网络类型
});
const networkTypeArr = ['LTE', 'NR']
let tableData = ref([]);//表格数据
const columnArr = [
    { prop: 'SerialNumber', label: 'SerialNumber', width: '180px'},
    { prop: 'VendorUnitTypeNumber', label: 'VendorUnitTypeNumber', width: '180px'},
    { prop: '简化名称', label: '简化名称'},
    { prop: '分类', label: '分类'},
    { prop: 'FAC', label: 'FAC'},
    { prop: '区县', label: '区县', width: '80px'},
    { prop: 'hardware', label: 'hardware'},
    { prop: 'NETWORK', label: 'NETWORK'},
    { prop: 'UserLabel_原始', label: 'UserLabel_原始', width: '180px'},
    { prop: 'UserLabel_最新', label: 'UserLabel_最新', width: '180px'},
    { prop: '入网类型', label: '入网类型', width: '100px'},
    { prop: '上次入网日期', label: '上次入网日期', width: '180px'},
    { prop: '上次退网日期', label: '上次退网日期', width: '180px'},
    { prop: '变更日期', label: '变更日期'},
    { prop: '变更次数', label: '变更次数'},
    { prop: 'NBId', label: 'NBId'},
    { prop: '历史进程', label: '历史进程', width: '250px'}
];
let pageSize = ref(20);//每页显示条数
let totalCount = ref(0);//总数量
let currentPage = ref(1);//当前第几页
let loading = ref(false);//表格loading标记，true是显示
let exportLoading = ref(false);//导出loading标记，true是显示

onMounted(() => {
    getTableData(1, 20);
})
// 查询
const search = () => {
    // 初始查询从第1页开始，默认20条
    getTableData(1, 20);
}

// 导出
const leadingout = async () => {
    exportLoading.value = true;
    await exportMeteral(reportSearchForm.networkType)
    exportLoading.value = false;
}
// 获取某分页下的数据
const getTableData = async (page, pageSize) => {
    loading.value = true;
    let res = await getMeteral(page, pageSize, reportSearchForm);
    // console.log('getMeteral res',res);
    if (res.status == 200) {
        tableData.value = res.data.results;
        totalCount.value = res.data.count;
    }
    loading.value = false;
}
// 变更页码
const handleCurrentChange = (val) => {
    currentPage.value = val;
    getTableData(val, pageSize.value);
}
</script>

<template>
    <div v-loading="exportLoading">
    <!-- 查询form -->
    <el-form :inline="true" :model="reportSearchForm" class="report-search-form">
        <el-row>
            <el-col>
                <el-form-item label="网络类型">
                    <el-select v-model="reportSearchForm.networkType" clearable>
                        <el-option v-for="networkType in networkTypeArr" :key="networkType" :label="networkType" :value="networkType" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" @click="leadingout">导出</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column v-for="item in columnArr" :prop="item.prop" :label="item.label" :width="item.width" align="center"/>
    </el-table>

    <el-pagination background layout="total, prev, pager, next, jumper"
                    :total="totalCount"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    small
                    class="hidden-sm-and-down">
    </el-pagination>
    </div>
</template>

<style scoped>
.el-col {
    display:flex;
}
</style>