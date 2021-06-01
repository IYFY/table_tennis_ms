<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-goods"></i> 商品兑换列表
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
       
                <el-table-column label="商品编码" prop="goods_id" width="100"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品兑换积分" prop="swap_integration"></el-table-column>
                <el-table-column label="可兑换库存" prop="swap_stock" width="120"></el-table-column>
                <el-table-column label="商品库存" prop="goods_stock" width="120"></el-table-column>
                <el-table-column label="商品类型" prop="goods_cats.cats_name"></el-table-column>
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
                <el-table-column
                    label="是否可兑换"
                    align="center"
                    :filters="[{ text: '可兑换', value: '可兑换' }, { text: '不可兑换', value: '不可兑换' }]"
                    :filter-method="filterSwap"
                    width="180"
                >
                    <template slot-scope="scope">
                        <el-tag
                            :type="
                                setSwapstate(scope.row.isswap) === '可兑换'
                                    ? 'success'
                                    : setSwapstate(scope.row.isswap) === '不可兑换'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ setSwapstate(scope.row.isswap)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                     
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
        <el-dialog
            title="编辑商品兑换信息"
            :visible.sync="editVisible"
            @close="editDialogClosed"
            width="30%"
        >
            <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="120px">
                <el-form-item label="商品名称">
                    <el-input v-model="editForm.goods_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="商品库存">
                    <el-input v-model="editForm.goods_stock" disabled></el-input>
                </el-form-item>

                <el-form-item label="商品兑换积分">
                    <el-input-number
                        v-model="editForm.swap_integration"
                        controls-position="right"
                        :min="0"
                        step-strictly
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="可兑换库存">
                    <el-input-number
                        v-model="editForm.swap_stock"
                        controls-position="right"
                        :min="0"
                        :max="editForm.goods_stock"
                        step-strictly
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="是否可兑换">
                    <el-radio-group v-model="editForm.isswap">
                        <el-radio label="0">不可兑换</el-radio>
                        <el-radio label="1">可兑换</el-radio>
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

      
    </div>
</template>

<script>


import { getGoodsAllInfo, updateGoods } from '../../../network/goods';

export default {
    name: 'goodsswap',
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
              
                swap_integration: [
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
        // this.getData();
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
     
        // 编辑操作
        handleEdit(row) {
            // this.getPartGoodscats();
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
        setSwapstate(data) {
            if (data == 0) {
                return '不可兑换';
            }
            if (data == 1) {
                return '可兑换';
            }
        },
        filterState(value, row) {
            // 列表状态中的筛选
            return this.setSalestate(row.issale) === value;
        },
        filterSwap(value, row) {
            // 列表状态中的筛选
            return this.setSwapstate(row.isswap) === value;
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
