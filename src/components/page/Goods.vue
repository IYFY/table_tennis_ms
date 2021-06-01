<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-goods"></i> 商品列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-input
                    v-model="query.name"
                    placeholder="商品名称"
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
               
                <el-table-column label="商品编码" prop="goods_id" width="100">
                   
                </el-table-column>
                <el-table-column label="商品名称" prop="goods_name">
               
                </el-table-column>
                <el-table-column label="商品单价" width="120">
                    <template slot-scope="scope">
                        <span size="medium">{{"￥" + scope.row.price }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="商品库存" prop="goods_stock" width="120">
               
                </el-table-column>
                <el-table-column label="商品预警库存" prop="warn_stock" width="120">
                </el-table-column>

                <el-table-column label="商品类型" prop="goods_cats.cats_name">
                </el-table-column>

                <el-table-column
                    label="是否上架"
                    align="center"
                    :filters="[{ text: '已上架', value: '已上架' }, { text: '未上架', value: '未上架' }]"
                    :filter-method="filterState"
                    width="180"
                >
                    <template slot-scope="scope">
                        <el-tag
                            :type="
                                setSalestate(scope.row.issale) === '已上架'
                                    ? 'success'
                                    : setSalestate(scope.row.issale) === '未上架'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ setSalestate(scope.row.issale)}}</el-tag>
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
        <el-dialog title="编辑商品信息" :visible.sync="editVisible" @close="editDialogClosed" width="30%">
            <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="120px">
                <el-form-item label="商品分类" prop="cats_id">
                    <el-select v-model="editForm.cats_id" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.cats_id"
                            :label="item.cats_name"
                            :value="item.cats_id"
                        ></el-option>
                    </el-select>
                  
                </el-form-item>
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="editForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格(元)" prop="price">
                    <el-input v-model="editForm.price"></el-input>
                </el-form-item>
                <el-form-item label="商品库存">
                    <el-input-number
                        v-model="editForm.goods_stock"
                        controls-position="right"
                        :min="0"
                        step-strictly
                        @input="changestock"
                    ></el-input-number>
                 
                </el-form-item>
                <el-form-item label="商品预警库存">
                    <el-input-number
                        v-model="editForm.warn_stock"
                        controls-position="right"
                        :min="0"
                        :max="editForm.goods_stock"
                        step-strictly
                    ></el-input-number>
                    
                </el-form-item>
                <el-form-item label="是否上架">
                    <el-radio-group v-model="editForm.issale">
                        <el-radio label="0">不上架</el-radio>
                        <el-radio label="1">上架</el-radio>
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
        <el-dialog title="添加商品" :visible.sync="addVisible" @close="addDialogClosed" width="30%">
            <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="120px">
                <el-form-item label="商品分类" prop="cats_id">
                    <el-select v-model="addForm.cats_id" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.cats_id"
                            :label="item.cats_name"
                            :value="item.cats_id"
                        ></el-option>
                    </el-select>
                    <!-- <el-input v-model="addForm.name"></el-input> -->
                </el-form-item>
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格(元)" prop="price">
                    <el-input v-model="addForm.price"></el-input>
                </el-form-item>
                <el-form-item label="商品库存">
                    <el-input-number
                        v-model="addForm.goods_stock"
                        controls-position="right"
                        :min="0"
                        step-strictly
                        @input="changestock"
                    ></el-input-number>
                    
                </el-form-item>
                <el-form-item label="商品预警库存">
                    <el-input-number
                        v-model="addForm.warn_stock"
                        controls-position="right"
                        :min="0"
                        :max="addForm.goods_stock"
                        step-strictly
                    ></el-input-number>
                  
                </el-form-item>
                <el-form-item label="是否上架">
                    <el-radio-group v-model="addForm.issale">
                        <el-radio label="0">不上架</el-radio>
                        <el-radio label="1">上架</el-radio>
                    </el-radio-group>
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

import { getPartGoodscats } from '../../../network/goodscats';
import { getGoodsAllInfo, addGoods, updateGoods, deleteGoods } from '../../../network/goods';

export default {
    name: 'goods',
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
                // goods_id: ,
                goods_name: '',
                cats_id: '',
                price: 0,
                goods_stock: 0,
                warn_stock: 0,
                issale: '0'
              
            },
            editVisible: false,
            editForm: {},
            idx: -1,
            id: -1,
            FormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                cats_id: [{ required: true, message: '商品分类不能为空', trigger: 'blur' }],
              
                price: [
                    { required: true, message: '请输入金额', trigger: 'blur' },
                    {
                        pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
                        message: '请输入合法的金额数字，最多两位小数',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    created() {
        
        this.getDatapage();
    },
    methods: {
        getDatapage() {
            // 网络请求

            getGoodsAllInfo(this.query).then(res => {
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
        getPartGoodscats() {
            // 网络请求商品类型

            getPartGoodscats().then(res => {
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
                    const data = await deleteGoods(row);

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
            this.getPartGoodscats();
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
                const data = await updateGoods(this.editForm);
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
            this.getPartGoodscats();
        },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
            // 重置表单
            this.addForm.goods_stock = 0;
            this.addForm.warn_stock = 0;
            this.addForm.issale = '0';
        },
        addInfo() {
            // 校验
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                // 验证通过 ，提交
                // alert('submit!');
                const data = await addGoods(this.addForm);
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
       
        setSalestate(data) {
            if (data == 0) {
                return '未上架';
            }
            if (data == 1) {
                return '已上架';
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
            return this.setSalestate(row.issale) === value;
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
