<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-coin"></i> 计费规则列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-input
                    v-model="query.name"
                    placeholder="规则名称"
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
        
                <el-table-column label="规则编码" prop="rule_id" width="100"></el-table-column>
                <el-table-column label="规则名称" prop="rule_name"></el-table-column>
                <el-table-column label="规则尺度" width="100">
                    <template slot-scope="scope">
                        <span size="medium">{{scope.row.measure }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="价格" prop="price" width="100">
                 
                </el-table-column>
                <el-table-column
                    label="规则类型"
                    :filters="[{ text: '获取积分', value: '获取积分' }, { text: '球桌计费', value: '球桌计费' }]"
                    :filter-method="filterType"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-tag
                            :type="
                                 scope.row.type  === '获取积分'
                                    ? 'success'
                                    :  scope.row.type  === '球桌计费'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ scope.row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="规则说明" prop="detail">
                   
                </el-table-column>

                <el-table-column
                    label="是否启用"
                    align="center"
                    :filters="[{ text: '已启用', value: '已启用' }, { text: '未启用', value: '未启用' }]"
                    :filter-method="filterState"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-tag
                            :type="
                                setSalestate(scope.row.isactivate) === '已启用'
                                    ? 'success'
                                    : setSalestate(scope.row.isactivate) === '未启用'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ setSalestate(scope.row.isactivate)}}</el-tag>
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
        <el-dialog title="编辑规则信息" :visible.sync="editVisible" @close="editDialogClosed" width="30%">
            <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="120px">
                <el-form-item label="规则类型" prop="type">
                    <el-select v-model="editForm.type" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则名称" prop="rule_name">
                    <el-input v-model="editForm.rule_name"></el-input>
                </el-form-item>
                <el-form-item label="规则尺度" prop="measure">
                    <el-input v-model="editForm.measure"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="editForm.price"></el-input>
                </el-form-item>
                <el-form-item label="规则说明" prop="detail">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="editForm.detail"
                    ></el-input>
                </el-form-item>
                <el-form-item label="是否启动">
                    <el-radio-group v-model="editForm.isactivate">
                        <el-radio :label="0">不启动</el-radio>
                        <el-radio :label="1">启动</el-radio>
                    </el-radio-group>
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
        <el-dialog title="添加规则" :visible.sync="addVisible" @close="addDialogClosed" width="30%">
            <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="120px">
                <el-form-item label="规则类型" prop="type">
                    <el-select v-model="addForm.type" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则名称" prop="rule_name">
                    <el-input v-model="addForm.rule_name"></el-input>
                </el-form-item>
                <el-form-item label="规则尺度" prop="measure">
                    <el-input v-model="addForm.measure"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="addForm.price"></el-input>
                </el-form-item>
                <el-form-item label="规则说明" prop="detail">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="addForm.detail"
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

import { getRuleAllInfo, addRule, updateRule, deleteRule } from '../../../network/chargerule';

export default {
    name: 'chargerule',
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
                    value: '球桌计费',
                    label: '球桌计费'
                },
                {
                    value: '获取积分',
                    label: '获取积分'
                }
            ],
            addVisible: false,
            addForm: {},
            editVisible: false,
            editForm: {
                radio: '1'
            },
            idx: -1,
            id: -1,
            FormRules: {
                type: [{ required: true, message: '请选择规则类型', trigger: 'blur' }],
                rule_name: [
                    { required: true, message: '请输入规则名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                measure: [
                    { required: true, message: '请输入规则尺度', trigger: 'blur' },
                    {
                        validator: (rule, value, cb) => {
                            console.log('*******规则value*****');
                            console.log(value);
                            if (value == 0) {
                                console.log('*******等于0*****');
                                cb(new Error('请输入大于零的数字'));
                            } else {
                                return cb();
                            }
                        },
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
                        message: '请输入合法的金额数字，最多两位小数',
                        trigger: 'blur'
                    }
                ],
                price: [
                    { required: true, message: '请输入价格', trigger: 'blur' },
                    {
                        pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
                        message: '请输入合法的金额数字，最多两位小数',
                        trigger: 'blur'
                    }
                ],
                detail: [
                    { required: true, message: '请输入规则说明', trigger: 'blur' },
                    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
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

            getRuleAllInfo(this.query).then(res => {
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
                    const data = await deleteRule(row);

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
                        this.$message.error('规则删除失败');
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
            console.log('****************editform');
            console.log(this.editForm);
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
                const data = await updateRule(this.editForm);
                if (data) {
                    if (data.code == 0) {
                        this.getDatapage(); //更新数据
                        this.editVisible = false;
                        this.$message.success(data.message);
                    } else {
                        this.$message.error(data.message);
                    }
                } else {
                    this.$message.error('规则修改失败');
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
                const data = await addRule(this.addForm);
                if (data) {
                    if (data.code == 0) {
                        this.getDatapage(); //更新数据
                        this.addVisible = false;
                        this.$message.success(data.message);
                    } else {
                        this.$message.error(data.message);
                    }
                } else {
                    this.$message.error('规则添加失败');
                   
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
       
        setSalestate(data) {
            if (data == 0) {
                return '未启用';
            }
            if (data == 1) {
                return '已启用';
            }
        },
        changestock() {
            // console.log('事件触犯了')
            if (this.addForm.goods_stock < this.addForm.warn_stock) {
                this.addForm.warn_stock = this.addForm.goods_stock;
            }
        },
       
        filterState(value, row) {
            // 列表状态中的筛选
            return this.setSalestate(row.isactivate) === value;
        },
        filterType(value, row) {
            // 列表状态中的筛选
            return row.type === value;
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
