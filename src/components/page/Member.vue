<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 顾客列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
       
                <el-input
                    v-model="query.name"
                    placeholder="顾客名"
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
                <el-table-column label="编码" prop="member_id" width="180">
               
                </el-table-column>
                <el-table-column label="姓名" prop="name" width="180">
             
                </el-table-column>
                <el-table-column label="性别" prop="gender" width="100">
            
                </el-table-column>
                <el-table-column label="年龄" prop="age" width="100">
 
                </el-table-column>
                <el-table-column label="电话" prop="phone" width="180">
               
                </el-table-column>
           
                <el-table-column label="积分" prop="integration" width="100">
            
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
        <el-dialog title="编辑顾客信息" :visible.sync="editVisible" @close="editDialogClosed" width="30%">
            <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.gender">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- <el-form-item label="性别">
                    <el-input v-model="editForm.gender"></el-input>
                </el-form-item>-->

                <el-form-item label="年龄" prop="age">
                    <el-input-number
                        v-model="editForm.age"
                        controls-position="right"
                        :min="0"
                        :max="100"
                        step-strictly
                    ></el-input-number>
                    <!-- <el-input v-model="editForm.age"></el-input> -->
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
                <!-- <el-form-item label="金额" prop="balance">
                    <el-input v-model="editForm.balance"></el-input>
                </el-form-item>-->
                <el-form-item label="积分" prop="integration">
                    <el-input-number
                        v-model="editForm.integration"
                        controls-position="right"
                        :min="0"
                        step-strictly
                    ></el-input-number>
                    <!-- <el-input v-model="editForm.integration"></el-input> -->
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
        <el-dialog title="添加" :visible.sync="addVisible" @close="addDialogClosed" width="30%">
            <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.gender">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>


                <el-form-item label="年龄" prop="age">
                    <el-input-number
                        v-model="addForm.age"
                        controls-position="right"
                        :min="1"
                        :max="100"
                        step-strictly
                    ></el-input-number>
                    
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="addForm.phone"></el-input>
                </el-form-item>
               
                <el-form-item label="积分" prop="integration">
                    <el-input-number
                        v-model="addForm.integration"
                        controls-position="right"
                        :min="0"
                        step-strictly
                    ></el-input-number>
                   
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

import { getMemberAllInfo, addMember, updateMember, deleteMember } from '../../../network/member';

export default {
    name: 'member',
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
         
            addVisible: false,
            addForm: {
                name: '',
                gender: '男',
                age: '',
                phone: '',
                balance: '',
                integration: ''
            },
            editVisible: false,
            editForm: {},
            idx: -1,
            id: -1,
            FormRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '年龄不能为空' },
                    { type: 'number', message: '年龄必须为数字值' }
                ],
                phone: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    {
                        validator: (rule, value, cb) => {
                            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                            if (regMobile.test(value)) {
                                return cb();
                            }
                            cb(new Error('请输入正确的手机号'));
                        },
                        trigger: 'blur'
                    }
                ],
                balance: [
                    { required: true, message: '请输入金额', trigger: 'blur' },
                    {
                        pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
                        message: '请输入合法的金额数字，最多两位小数',
                        trigger: 'blur'
                    }
                ],
                integration: [
                    { required: true, message: '请输入数字', trigger: 'blur' },
                    {
                        type: 'number',
                        message: '请输入整数',
                        trigger: 'blur',
                        transform(value) {
                            if (!/^[0-9]\d*$/.test(value)) {
                                return true;
                            } else {
                            }
                        }
                    }
                ]
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
            getMemberAllInfo(this.query).then(res => {
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
                    const data = await deleteMember(row);

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
               
                const data = await updateMember(this.editForm);

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
            this.addForm.gender = '男';
        },
        addInfo() {
            // 校验
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                // 验证通过 ，提交

                const data = await addMember(this.addForm);

               
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
