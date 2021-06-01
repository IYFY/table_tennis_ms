<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-location-outline"></i> 球桌列表
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
              
                <el-table-column label="球桌编码" prop="table_id" width="180">
                   
                </el-table-column>
                <el-table-column label="球桌名称" prop="table_name" width="180">
                   
                </el-table-column>
                <el-table-column label="球桌位置" prop="site">
                 
                </el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    :filters="[{ text: '空置', value: '空置'}, { text: '使用中', value: '使用中'}, { text: '维修中', value: '维修中'}]"
                    :filter-method="filterState"
                    width="180"
                >
                    <template slot-scope="scope">
                        <el-tag
                            :type="
                                scope.row.state === '空置'
                                    ? 'success'
                                    : scope.row.state === '使用中'
                                    ? 'warning'
                                    : scope.row.state === '维修中'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ scope.row.state }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑球桌信息" :visible.sync="editVisible" @close="editDialogClosed" width="30%">
            <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="80px">
                <el-form-item label="球桌名称" prop="table_name">
                    <el-input v-model="editForm.table_name"></el-input>
                </el-form-item>
                <el-form-item label="球桌位置" prop="site">
                    <el-input v-model="editForm.site"></el-input>
                </el-form-item>

               

                <el-form-item label="球桌状态" prop="state">
                    <el-select
                        v-model="editForm.state"
                        placeholder="请选择"
                        :disabled=" editForm.state === '维修中' "
                    >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <template slot="footer">
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateInfo">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 添加弹出框 -->
        <el-dialog title="添加球桌" :visible.sync="addVisible" @close="addDialogClosed" width="30%">
            <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="球桌名称" prop="table_name">
                    <el-input v-model="addForm.table_name"></el-input>
                </el-form-item>
                <el-form-item label="球桌位置" prop="site">
                    <el-input v-model="addForm.site"></el-input>
                </el-form-item>
                <el-form-item label="球桌状态" prop="state">
                    <el-select v-model="addForm.state" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
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

import { getSiteAllInfo, addSite, updateSite, deleteSite } from '../../../network/site';

export default {
    name: 'site',
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
            options: [
                {
                    value: '空置',
                    label: '空置'
                },
                {
                    value: '使用中',
                    label: '使用中'
                }
            ],
            addVisible: false,
            addForm: {
                table_name: '',
                site: '',
                state: '空置'
            },
            editVisible: false,
            editForm: {},
            idx: -1,
            id: -1,
            FormRules: {
                table_name: [{ required: true, message: '请输入球桌名称', trigger: 'blur' }],
                site: [
                    { required: true, message: '球桌位置不能为空', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                state: [{ required: true, message: '球桌状态不能为空', trigger: 'blur' }]
            }
        };
    },
    created() {
        // this.getData();
        this.getDatapage();
    },
    methods: {
        getDatapage() {
            // 网络请求

            getSiteAllInfo(this.query).then(res => {

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

      
        // 删除操作
        handleDelete(row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    const data = await deleteSite(row);

                    if (data) {
                        if (data.code == 0) {
                            // 重新计算页面数
                            if (this.pageTotal - 1 > 0) {
                                
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
            console.log(row);
            this.editVisible = true;
            this.editForm = JSON.parse(JSON.stringify(row));
        },
        // 监听修改对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 保存编辑
        updateInfo() {
            // 校验
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                // 验证通过 ，提交
                // alert('submit!');
                const data = await updateSite(this.editForm);
                if (data) {
                    if (data.code == 0) {
                        this.getDatapage(); //更新数据
                        this.editVisible = false;
                        this.$message.success(data.message);
                    } else {
                        this.$message.error(data.message);
                    }
                } else {
                    this.$message.error('数据修改失败');
                }
            });
        },
        addClick() {
            this.addVisible = true;
        },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        addInfo() {
            // 校验
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                // 验证通过 ，提交
                // alert('submit!');
                const data = await addSite(this.addForm);
                if (data) {
                    if (data.code == 0) {
                        this.getDatapage(); //更新数据
                        this.addVisible = false;
                        this.$message.success(data.message);
                    } else {
                        this.$message.error(data.message);
                    }
                } else {
                    this.$message.error('数据添加失败');
                    // this.$message.success('数据添加失败');
                }
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
       
        filterState(value, row) {
            // 列表状态中的筛选
            return row.state === value;
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
