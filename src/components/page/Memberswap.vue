<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 顾客兑换列表
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
            

                <el-table-column label="兑换编码" prop="record_id" width="100"></el-table-column>
                <el-table-column label="顾客名" prop="member.name"></el-table-column>
                <el-table-column label="商品名称" prop="goods.goods_name"></el-table-column>
                <el-table-column label="兑换数量" prop="swap_count" width="120"></el-table-column>
                <el-table-column label="兑换总积分" prop="swap_integration" width="120"></el-table-column>
         
                <el-table-column label="兑换时间" width="155">
                    <template slot-scope="scope">
                        <span size="medium">{{ rTime(scope.row.swap_time) }}</span>
                    </template>
                </el-table-column>
 
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                        >撤消兑换</el-button>
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

        <!-- 添加弹出框 -->
        <el-dialog title="添加兑换" :visible.sync="addVisible" @close="addDialogClosed" width="30%">
            <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="120px">
                <el-form-item label="顾客名称" prop="member_id" ref="memberid">
                    <el-select
                        v-model="addForm.member_id"
                        placeholder="请选择"
                        @change="getmemberinte"
                    >
                        <el-option
                            v-for="item in Memberoptions"
                            :key="item.member_id"
                            :label="item.name"
                            :value="item.member_id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顾客拥有积分">
                    <el-input :value="intvalue" disabled></el-input>
                </el-form-item>
                <el-form-item label="兑换商品名称" prop="goods_id">
                    <el-select v-model="addForm.goods_id" placeholder="请选择" @change="getgoodsinte">
                        <el-option
                            v-for="item in Goodsoptions"
                            :key="item.goods_id"
                            :label="item.goods_name"
                            :value="item.goods_id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品兑换积分">
                    <el-input :value="goodsintvalue" disabled></el-input>
                </el-form-item>
                <el-form-item label="商品兑换库存">
                    <el-input :value="goodsstockvalue" disabled></el-input>
                </el-form-item>
            
                <el-form-item label="顾客兑换数量" prop="swap_count">
                    <el-input-number
                        v-model="addForm.swap_count"
                        :min="0"
                        :max="maxcount"
                        step-strictly
                        @input="getintegration"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="顾客花费积分" prop="price">
                    <el-input v-model="addForm.swap_integration" disabled></el-input>
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

import { getMemberIdInfo } from '../../../network/member';
import { getGoodsswpaInfo } from '../../../network/goods';
import { getMemberswapAllInfo, addMemberswap, deleteMemberswap, cancelMemberswap } from '../../../network/memberswap';

export default {
    name: 'memberswap',
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
            Memberoptions: [],
            Goodsoptions: [],
            addVisible: false,
            addForm: {
         
                swap_count: 0
            },
            intvalue: 0,
            goodsstockvalue: 0,
            goodsintvalue: 0,
            maxcount: 0,
            editVisible: false,
            editForm: {},
            idx: -1,
            id: -1,
            FormRules: {
                member_id: [{ required: true, message: '请选择顾客', trigger: 'blur' }],
                goods_id: [{ required: true, message: '请选择商品', trigger: 'blur' }],
                swap_count: [{ required: true, message: '请输入兑换数量', trigger: 'blur' }]
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

            getMemberswapAllInfo(this.query).then(res => {
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
        getMemberIdInfo() {
            // 网络请求顾客
            getMemberIdInfo().then(res => {
                console.log(res);
                // console.log(res.result);
                this.Memberoptions = res.result;
                
                console.log('*********this.options');
                console.log(this.options);
            });
        },
        getGoodsswpaInfo() {
            // 网络请求可兑换商品

            getGoodsswpaInfo().then(res => {
                console.log(res);
         
                this.Goodsoptions = res.result;
               
                console.log('*********this.Goodsoptions');
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
                    const data = await deleteMemberswap(row);

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
     

            // 二次确认删除
            this.$confirm('确定要撤消吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    const data = await cancelMemberswap(row);

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
                        this.$message.error('兑换撤消失败');
                    }
                    this.getDatapage(); //更新数据
                })
                .catch(() => {
                    this.$message.success('放弃撤消');
                });
        },

        addClick() {
            this.addVisible = true;
            this.getMemberIdInfo();
            this.getGoodsswpaInfo();
        },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
            // // 重置表单
            this.intvalue = 0;
            this.goodsintvalue = 0;
            this.goodsstockvalue = 0;
            this.addForm.swap_count = 0;
        },
        addInfo() {
            // 校验
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                if (this.addForm.swap_count == 0) {
                    this.$message.error('兑换数量不可为零');
                    return;
                }
                // 验证通过 ，提交
                // alert('submit!');
                const data = await addMemberswap(this.addForm);
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

        getmemberinte() {
            console.log('**********');

            console.log(this.addForm.member_id);
            console.log(this.Memberoptions.find(item => item.member_id == this.addForm.member_id));
            this.intvalue = this.Memberoptions.find(item => item.member_id == this.addForm.member_id).integration;
        },
        getgoodsinte() {
            console.log('*****获取商品的库存， 积分*****');

            console.log(this.addForm.goods_id);
            console.log(this.Goodsoptions.find(item => item.goods_id == this.addForm.goods_id));
            this.goodsstockvalue = this.Goodsoptions.find(item => item.goods_id == this.addForm.goods_id).swap_stock;
            this.goodsintvalue = this.Goodsoptions.find(item => item.goods_id == this.addForm.goods_id).swap_integration;

            let count = this.intvalue / this.goodsintvalue;
            if (this.goodsstockvalue >= count) {
                this.maxcount = count;
            } else {
                this.maxcount = this.goodsstockvalue;
            }
        },
        getintegration() {
            // 计算总积分
            this.addForm.swap_integration = this.goodsintvalue * this.addForm.swap_count;
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
