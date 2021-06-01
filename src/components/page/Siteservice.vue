<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-location-outline"></i> 维护列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-input
                    v-model="query.name"
                    placeholder="球桌名称"
                    class="handle-input mr10"
                    @clear="getDatapage"
                    clearable
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="getDatapage">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addClick">添加</el-button>
            </div>
            <!-- 表格 -->
            <el-table
                stripe
                max-height="400"
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
              
                <el-table-column label="维护编码" prop="service_id" width="100">
                  
                </el-table-column>
                <el-table-column label="球桌名称" prop="site.table_name" width="100">
                 
                </el-table-column>
                <el-table-column label="球桌位置" prop="site.site">
                   
                </el-table-column>
                <el-table-column label="维修信息" prop="details">
                  
                </el-table-column>
                <el-table-column label="报修时间" width="155">
                    <template slot-scope="scope">
                        <span size="medium">{{ rTime(scope.row.service_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="完成时间" width="155">
                    <template slot-scope="scope">
                        <span size="medium">{{rTime(scope.row.finish_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    :filters="[{ text: '未维修', value: '未维修' }, { text: '已维修', value: '已维修' }]"
                    :filter-method="filterState"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-tag
                            :type=" setState(scope.row.finish_time) === '已维修'
                                    ? 'success'
                                    : setState(scope.row.finish_time) === '未维修'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ setState(scope.row.finish_time) }}</el-tag>
                    </template>
                </el-table-column>

               

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                        >完成维修</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.pageIndex"
                :page-sizes="[3, 5, 7, 9]"
                :page-size="query.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageTotal"
                class="pagination"
            ></el-pagination>
        </div>

      

        <!-- 添加弹出框 -->
        <el-dialog title="添加维修" :visible.sync="addVisible" @close="addDialogClosed" width="30%">
            <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="球桌名称" prop="table_id">
                    <el-select v-model="addForm.table_id" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.table_id"
                            :label="item.table_name"
                            :value="item.table_id"
                        ></el-option>
                    </el-select>
                    <!-- <el-input v-model="addForm.name"></el-input> -->
                </el-form-item>
                <el-form-item label="维修信息" prop="details">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="addForm.details"
                    ></el-input>
                </el-form-item>
               
            </el-form>

            <template slot="footer">
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addInfo">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
// 会员管理 1


import { getSiteIdInfo } from '../../../network/site';
import { getSiteserviceInfo, deleteSiteservice, updateSiteservice, addSiteservice } from '../../../network/siteservice';

export default {
    name: 'siteservice',
    data() {
        return {
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 7
            },
            pageTotal: 0,
            Data: [],
            tableData: [],
            options: [],
            addVisible: false,
            addForm: {
                table_id: '',
                details: ''
            },
            editVisible: false,
            editForm: {},
            idx: -1,
            id: -1,
            FormRules: {
                table_id: [{ required: true, message: '请选择球桌', trigger: 'blur' }],

                details: [
                    { required: true, message: '请输入维修信息', trigger: 'blur' },
                    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
                ]
             
            }
        };
    },
    created() {
        // this.getData();
        this.getDatapage();
    },
    beforeMount() {},
    methods: {
        getDatapage() {
            // 网络请求

            getSiteserviceInfo(this.query).then(res => {
                if (res.code == 0) {
                    this.Data = res;
                    console.log(this.Data);
                    this.tableData = this.Data.result.rows;
                    this.pageTotal = this.Data.result.count;
                    console.log(this.tableData);
                } else {
                  
                }

            });

            
        },
        getSiteAllInfo() {
            // 网络请求球桌

            getSiteIdInfo().then(res => {
                console.log(res);
               
                this.options = res.result;
            
                console.log('*********this.options');
                console.log(this.options);
            });
        },

     
        // 删除操作
        handleDelete(row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    const data = await deleteSiteservice(row);
                    if (data) {
                        if (data.code == 0) {
                            // 重新计算页面数
                            if (this.pageTotal - 1 > 0) {
                                // console.log("this.pageTotal >= 0")
                                // console.log((this.pageTotal - 1) % this.query.pageSize)
                                if ((this.pageTotal - 1) % this.query.pageSize == 0) {
                                    if (this.query.pageIndex >= 2) {
                                        this.query.pageIndex = this.query.pageIndex - 1;
                                    }
                                }
                            }
                            this.$message.success(data.message);
                        } else {
                            this.$message.error(data.message);
                        }
                    } else {
                        this.$message.error('数据删除失败');
                    }
                    this.getDatapage(); //更新数据
                })
                .catch(() => {
                    this.$message.success('放弃删除');
                });
        },
        // 编辑操作
        handleEdit(row) {
            if (this.setState(row.finish_time) === '已维修') {
                this.$message.success('已维修完成，无需修改');

                return;
            }
            // 二次确认完成
            this.$confirm('确定要完成维护？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    const res = await updateSiteservice(row);
                    if (!res) {
                        this.$message.success('数据修改失败');
                    } else {
                        this.$message.success(res.message);
                    }
                    this.getDatapage(); //更新数据
                })
                .catch(() => {
                    this.$message.success('放弃修改');
                });

          
        },
     
        addClick() {
            this.addVisible = true;
            this.getSiteAllInfo();
        },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        addInfo() {
            console.log('this.addForm');
            console.log(this.addForm);
            console.log('this.addForm');
            // 校验
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;

                console.log('this.addForm');
                console.log(this.addForm);
                console.log('this.addForm');
                // 验证通过 ，提交
                // alert('submit!');
                const data = await addSiteservice(this.addForm);
                if (!data) {
                    this.$message.success('数据添加失败');
                } else {
                    // console.log(data)
                    this.$message.success(data.message);
                }
                this.getDatapage(); //更新数据
                this.addVisible = false;
            });
        },
        // 数据个数
        handleSizeChange(newSize) {
            this.query.pageSize = newSize;
            this.getDatapage();
        },
        // 当前页码
        handleCurrentChange(newPage) {
            this.query.pageIndex = newPage;
            this.getDatapage();
        },
      

        rTime(date) {
            // 2020-06-27T14:20:27.000000Z 时间格式转换成 2020-06-27 14:20:27
            if (!date) return '';
            const time = new Date(date);
            const year = time.getFullYear();
            const month = (time.getMonth() + 1).toString().padStart(2, '0');
            const day = time
                .getDate()
                .toString()
                .padStart(2, '0');
            const hours = time
                .getHours()
                .toString()
                .padStart(2, '0');
            const minutes = time
                .getMinutes()
                .toString()
                .padStart(2, '0');
            const seconds = time
                .getSeconds()
                .toString()
                .padStart(2, '0');
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        },
        setState(date) {
            if (date) {
                return '已维修';
            } else {
                return '未维修';
            }
        },
        filterState(value, row) {
            // 列表状态中的筛选
            return this.setState(row.finish_time) === value;
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
    /* margin-bottom: 15px; */
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.pagination {
    margin: 10px auto;
    text-align: center;
}
</style>
