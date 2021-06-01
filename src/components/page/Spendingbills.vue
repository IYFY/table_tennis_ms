<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-edit-outline"></i> 消费列表
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
                <el-table-column label="消费编码" prop="bill_code" width="100"></el-table-column>
                <el-table-column label="顾客名" prop="member.name" width="100"></el-table-column>
                <el-table-column label="消费金额" prop="gross_amount" width="100"></el-table-column>
                <el-table-column label="获取积分" prop="gain_integration" width="100"></el-table-column>
                <el-table-column label="开单时间" width="160">
                    <template slot-scope="scope">
                        <span size="medium">{{ rTime(scope.row.creation_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付时间" width="160">
                    <template slot-scope="scope">
                        <span size="medium">{{ rTime(scope.row.pay_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="消费状态" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag
                            :type="
                                scope.row.state === '已支付'
                                    ? 'success'
                                    : scope.row.state === '待支付'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ scope.row.state}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作人员" prop="admin.admin_name" width="100"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                         
                        <el-button
                            v-show="scope.row.state == '待支付'"
                            type="text"
                            icon="el-icon-check"
                            @click="handleFinish(scope.row)"
                        >结账</el-button>
                      
                        <el-button
                        v-show="scope.row.state == '待支付'"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleadd(scope.row)"
                        >添加消费</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">详情</el-button>
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

        <!-- 添加消费者弹出框 -->
        <el-dialog title="添加消费者" :visible.sync="addVisible" @close="addDialogClosed" width="35%">
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
            </el-form>

            <template slot="footer">
                <span class="dialog-footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addInfo">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 添加消费弹出框 -->
        <el-dialog
            title="添加消费"
            :visible.sync="addspendingVisible"
            @close="addspendingDialogClosed"
            width="40%"
        >
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label">
                        <i class="el-icon-date"></i> 添加球桌消费
                    </span>

                    <!-- 球桌消费 -->

                    <el-form
                        :model="editForm"
                        :rules="editFormRules"
                        ref="addtableFormRef"
                        label-width="120px"
                    >
                        <el-form-item label="顾客名称：" ref="member_id">
                            <!-- <el-input v-model="editForm.member.name" disabled></el-input> -->
                            <span>{{editForm.member.name}}</span>
                        </el-form-item>

                        <el-form-item label="开台球桌名称：" prop="table_id">
                            <el-select
                                v-model="editForm.table_id"
                                placeholder="请选择"
                                @change="geteditFormTablereserve"
                            >
                                <el-option
                                    v-for="item in StartTableoptions"
                                    :key="item.table_id"
                                    :label="item.table_name"
                                    :value="item.table_id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <div v-for="item in Tablereserveoptions" :key="item.table_id">
                            <el-divider></el-divider>
                            <el-tag
                                size="medium"
                                :type="
                                getTime(item.reserve_time).days >= 1 
                                    ? 'success'
                                    : getTime(item.reserve_time).hours >= 1
                                    ? 'warning'
                                    : getTime(item.reserve_time).minutes <= 60
                                    ? 'danger'
                                    : ''
                            "
                            >{{ '该球桌的存在预约：' + rTime( item.reserve_time) + '；在当前时间' + getTime(item.reserve_time).message }}</el-tag>
                        </div>
                    </el-form>

                    <div class="dialogfooter">
                        <el-button @click="addspendingVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addtableInfo">确 定</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label">
                        <i class="el-icon-date"></i> 添加商品消费
                    </span>

                    <!-- 商品消费 -->
                    <el-form
                        :model="addgoodsForm"
                        :rules="addgoodsFormRules"
                        ref="addgoodsFormRef"
                        label-width="160px"
                    >
                        <el-form-item label="顾客名称：" ref="memberid">
                            <span>{{editForm.member.name}}</span>
                        </el-form-item>
                        <el-form-item label="购买商品名称：" prop="goods_id">
                            <el-select
                                v-model="addgoodsForm.goods_id"
                                placeholder="请选择"
                                @change="getgoodsinte"
                            >
                                <el-option
                                    v-for="item in Goodsoptions"
                                    :key="item.goods_id"
                                    :label="item.goods_name"
                                    :value="item.goods_id"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="商品价格（￥）：">
                            <span>{{goodsvalue}}</span>
                            <!-- <el-input :value="goodsvalue" disabled></el-input> -->
                        </el-form-item>
                        <el-form-item label="商品库存：">
                            <span>{{goodsstockvalue}}</span>
                            <!-- <el-input :value="goodsstockvalue" disabled></el-input> -->
                        </el-form-item>
                        <!-- <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>-->
                        <el-form-item label="顾客购买数量：" prop="goods_count">
                            <el-input-number
                                v-model="addgoodsForm.goods_count"
                                :min="0"
                                :max="goodsstockvalue"
                                step-strictly
                                @input="getintegration"
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item label="顾客花费金额（￥）：">
                            <span>{{addgoodsForm.amount }}</span>
                            <!-- <el-input v-model="addgoodsForm.amount.toFixed(2)" disabled></el-input> -->
                        </el-form-item>
                    </el-form>

                    <div class="dialogfooter">
                        <el-button @click="addspendingVisible = false">取 消</el-button>
                        <el-button type="primary" @click="addgoodsInfo">确 定</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <!-- 结账弹出框 -->
        <el-dialog title="结账" :visible.sync="finishVisible" @close="finishDialogClosed" width="30%">
            <el-form
                :model="finishForm"
                :rules="ruleRulesjifen"
                ref="finishFormRef"
                label-width="120px"
            >
                <el-form-item label="获取积分规则：" prop="ruleitem">
                    <el-select v-model="ruleitem" placeholder="请选择">
                        <el-option
                            v-for="item in getRulesjifen"
                            :key="item.rule_id"
                            :label="item.rule_name +' ('+ item.detail+') '"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-divider>
                    <div>球桌消费</div>
                </el-divider>
                <div v-if="includetableData.length == 0" class="itemclass">
                    <div>该顾客没有球桌消费</div>
                </div>
                <div v-for="item in includetableData" :key="item.table_id">
                    <div
                        class="itemclass"
                    >{{ '球桌：' + item.site.table_name + ' 使用 '+ item.duration + " 分钟；计费(￥)：" + item.amount}}</div>
                </div>
                <el-divider>
                    <div>商品消费</div>
                </el-divider>
                <div v-if="includegoodsData.length == 0" class="itemclass">
                    <div>该顾客没有商品消费</div>
                </div>
                <div v-for="item in includegoodsData" :key="item.goods_id">
                    <div
                        class="itemclass"
                    >{{ '商品：' + item. goods.goods_name + ' 购买数量 '+ item.goods_count + "； 总价格(￥)：" + item.amount}}</div>
                </div>
                <el-divider>
                    <div>总计消费</div>
                </el-divider>

                <div class="itemclass">{{ '顾客总计消费（￥）：' + countamount()}}</div>
                <div class="itemclass">{{ '顾客获取积分：' + getjifen()}}</div>
            </el-form>

            <template slot="footer">
                <span class="dialog-footer">
                    <el-button @click="finishVisible = false">取 消</el-button>
                    <el-button type="primary" @click="finishInfo">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 详情弹出框 -->
        <el-dialog title="消费详情" :visible.sync="editVisible" @close="editDialogClosed" width="75%">
            <el-tabs type="border-card" height="500px">
                <el-tab-pane>
                    <span slot="label">
                        <i class="el-icon-date"></i> 球桌消费
                    </span>
                    <!-- 消费球桌的表格 -->
                 
                    <el-form :rules="ruleRules" ref="ruleRef" label-width="120px">
                        <el-form-item label="计费规则：" prop="ruleid">
                            <el-select v-model="ruleid" placeholder="请选择">
                                <el-option
                                    v-for="item in getRules"
                                    :key="item.rule_id"
                                    :label="item.rule_name +' ('+ item.detail+') '"
                                    :value="item"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>

                    <el-table
                        stripe
                        max-height="400"
                        :data="includetableData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column label="序号" prop="name" width="50" align="center">
                            <template slot-scope="scope">
                                <span size="medium">{{scope.$index+ 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="球桌消费编码" prop="table_bill" width="120"></el-table-column>
                        <el-table-column label="球桌名称" prop="site.table_name" width="100"></el-table-column>

                        <el-table-column label="开始时间">
                            <template slot-scope="scope">
                                <span size="medium">{{ rTime(scope.row.start_time) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="结束时间" >
                            <template slot-scope="scope">
                                <span size="medium">{{rTime(scope.row.end_time) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="使用时长（分钟）" prop="duration" width="150"></el-table-column>
                        <el-table-column label="消费金额" width="100">
                            <template slot-scope="scope">
                                <span size="medium">{{"￥" + scope.row.amount }}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column label="消费金额" prop="amount" width="100"></el-table-column> -->

                        <el-table-column label="操作" align="center" v-if="this.oldrow.state == '待支付'">
                            <template slot-scope="scope" >
                                <el-button
                                    v-show="!scope.row.end_time"
                                    type="text"
                                    icon="el-icon-check"
                                    @click="handletableFinish(scope.row)"
                                >完成消费</el-button>
                                <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    class="red"
                                    @click="handletableDelete(scope.row)"
                                >取消开桌</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label">
                        <i class="el-icon-date"></i> 商品消费
                    </span>

                    <!-- 消费商品的表格 -->
                    <!-- <el-divider></el-divider> -->
                    <!-- <p></p> -->
                    <!-- <el-tag style="margin-bottom: 10px; width: 100%;">消费的商品：</el-tag> -->
                    <el-table
                        stripe
                        max-height="400"
                        :data="includegoodsData"
                        border
                        class="table"
                        ref="multipleTable"
                        header-cell-class-name="table-header"
                    >
                        <el-table-column label="序号" prop="name" width="50" align="center">
                            <template slot-scope="scope">
                                <span size="medium">{{scope.$index+ 1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品消费编码" prop="goods_bill" width="120">
                          
                        </el-table-column>
                        <el-table-column label="商品名称" prop="goods.goods_name">
                          
                        </el-table-column>

                        <el-table-column label="购买数量" prop="goods_count">
                      
                        </el-table-column>

                        <el-table-column label="消费金额">
                            <template slot-scope="scope">
                                <span size="medium">{{"￥" + scope.row.amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" v-if="this.oldrow.state == '待支付'">
                            <template slot-scope="scope">
                                <el-button
                                
                                    type="text"
                                    icon="el-icon-delete"
                                    class="red"
                                    @click="handlegoodsDelete(scope.row)"
                                >取消购买</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
// 会员管理 1

import { getMemberIdInfo } from '../../../network/member';
import { getStartSiteIdInfo } from '../../../network/site';
import { getTablereserveInfo } from '../../../network/memberreserve';
import { getGoodssaleInfo } from '../../../network/goods';
import { getSpendingbillAllInfo, addSpendingbill, deleteSpendingbill, updateSpendingbill } from '../../../network/spendingbills';
import { getSpendingtableInfo, addSpendingtable, updatetimeSpendingtable, deleteSpendingtable } from '../../../network/spendingtable';
import { getSpendinggoodsInfo, addSpendinggoods, cancelgoods } from '../../../network/spendinggoods';
import { getPartBRule, getPartARule } from '../../../network/chargerule';

export default {
    name: 'spendingbills',
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

            includetableData: [],
            includegoodsData: [],
            Memberoptions: [],
            Tableoptions: [],
            Goodsoptions: [],
            // 选中的规则
            ruleid: '',
            ruleitem: '',
            // 账单号 顾客id 顾客消费的金额和积分
            billcode: '',
            memberid: '',
            amount: 0,
            jifen: 0,
            // 计费规则
            getRules: [],
            // 积分规则
            getRulesjifen: [],
            oldrow: {},

            StartTableoptions: [],
            Tablereserveoptions: [],
            addVisible: false,
            addspendingVisible: false,
            // 消费商品表单
            addgoodsForm: {
                goods_id: ''
                //    amount: 0
            },
            goodsstockvalue: 0,
            goodsvalue: '',
            addForm: {
                admin_id: localStorage.getItem('admin_id') || ''
               
            },
        
            editVisible: false,
            // 球桌消费表单
            editForm: {
                member: {},
                site: {}
            },
            // 结账
            finishVisible: false,
            finishForm: {},
            ruleRulesjifen: {
                ruleitem: [{ required: true, message: '请选择规则', trigger: 'blur' }]
            },
            ruleRules: {
                ruleid: [{ required: true, message: '请选择规则', trigger: 'blur' }]
            },
            FormRules: {
                member_id: [{ required: true, message: '请选择顾客', trigger: 'blur' }],
                table_id: [{ required: true, message: '请选择球桌', trigger: 'blur' }],
                reserve_time: [{ required: true, message: '请输入预约时间', trigger: 'blur' }]
            },
            editFormRules: {
                table_id: [{ required: true, message: '请选择球桌', trigger: 'blur' }]
            },
            addgoodsFormRules: {
                goods_id: [{ required: true, message: '请选择商品', trigger: 'blur' }],
                goods_count: [
                    { required: true, message: '请输入购买数量', trigger: 'blur' },
                    {
                        validator: (rule, value, cb) => {
                            if (value >= 1) {
                                return cb();
                            }
                            cb(new Error('购买数量不能为0'));
                        },
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
            // 网络请求分页信息
            getSpendingbillAllInfo(this.query).then(res => {
                if (res.code == 0) {
                    this.Data = res;
                    console.log(this.Data);
                    this.tableData = this.Data.result.rows;
                    this.pageTotal = this.Data.result.count;
                    console.log('消费分页信息');
                    console.log(this.tableData);
                } else {
               
                }
              
            });
        },
        getMemberIdInfo() {
            // 网络请求顾客
            getMemberIdInfo().then(res => {
                console.log(res);
      
                this.Memberoptions = res.result;
               
                console.log('*********this.Memberoptions');
                console.log(this.Memberoptions);
            });
        },
      

        getStartSiteIdInfo() {
            // 网络请求空置球桌信息
            getStartSiteIdInfo().then(res => {
                this.StartTableoptions = res.result;
               
            });
        },
        getTablereserveInfo(data) {
            // 网络请求某球桌预约信息
            getTablereserveInfo(data).then(res => {
                console.log(res);

                this.Tablereserveoptions = res.result;
              
                console.log('*********this.Tablereserveoptions');
                console.log(this.Tablereserveoptions);
            });
        },

        // 请求消费记录包含的球桌
        getSpendingtableInfo(data) {
            // 网络请求某  消费下 球桌信息
            getSpendingtableInfo(data).then(res => {
                console.log(res);
                // console.log(res.result);
                this.includetableData = res.result;
               
                console.log('*********this.includetableData');
                console.log(this.includetableData);
            });
        },
        // 请求消费记录包含的商品
        getSpendinggoodsInfo(data) {
            // 网络请求某  消费下 商品信息
            getSpendinggoodsInfo(data).then(res => {

                // console.log(res.result);
                this.includegoodsData = res.result;
             
            });
        },

        getGoodssaleInfo() {
            // 网络请求可购买商品

            getGoodssaleInfo().then(res => {
        
                // console.log(res.result);
                this.Goodsoptions = res.result;
             
          
            });
        },
        getPartBRuleIdInfo() {
            // 网络请求计费规则
            getPartBRule().then(res => {
           
              
                this.getRules = res.result;
             
            });
        },
        getPartARuleIdInfo() {
            // 网络请求积分规则
            getPartARule().then(res => {
             
               
                this.getRulesjifen = res.result;
                
            });
        },

      

        // 删除账单操作
        handleDelete(row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    const data = await deleteSpendingbill(row);

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

        // 编辑结账操作
        handleFinish(row) {
         
            this.getPartARuleIdInfo();
            this.getSpendingtableInfo(row);
            this.getSpendinggoodsInfo(row);

            // 保存结账的id 和顾客id
            this.billcode = row.bill_code;
            this.memberid = row.member_id;

            this.finishVisible = true;
            // this.editForm = JSON.parse(JSON.stringify(row));
        },
        countamount() {
            let amount = 0;
            let tableamount = 0;
            let goodsamount = 0;
            if (this.includetableData.length != 0) {
                tableamount = this.includetableData.reduce((prev, item) => {
                    return parseInt(prev) + parseInt(item.amount);
                }, 0);
            }
            if (this.includegoodsData.length != 0) {
                goodsamount = this.includegoodsData.reduce((prev, item) => {
                    // console.log("item*************************")
                    // console.log(item)
                    return parseInt(prev) + parseInt(item.amount);
                }, 0);
            }
            amount = parseInt(tableamount + goodsamount);
            this.amount = amount;
            return amount.toFixed(2);
        },
        getjifen() {
            if (this.ruleitem == '') {
                // 获取的积分
                return '';
            } else {
                // 获取的积分
                this.jifen = parseInt((this.countamount() / this.ruleitem.measure) * this.ruleitem.price);
                return this.jifen;
            }
        },
        finishDialogClosed() {
            // 关闭结账事件
            this.$refs.finishFormRef.resetFields();
        },

        finishInfo() {
            // 确认结账请求
            if (this.ruleitem == '') {
                this.$message.error('获取积分规则不可为空');
                return;
            }
              if(this.amount == 0){
                   this.$message.error('顾客没有消费');
                return;
              }
            // 发送结账的请求、 并修改顾客积分
            let data = {
                billcode: this.billcode,
                memberid: this.memberid,
                amount: this.amount,
                jifen: this.jifen,
            };
          
            updateSpendingbill(data).then(data => {
                    if (data) {
                        if (data.code == 0) {
                            this.finishVisible = false;
                            this.getDatapage()
                            this.$message.success(data.message);
                        } else {
                            this.$message.error(data.message);
                        }
                    }
                })
                .catch(err => this.$message.error('数据修改失败'));;
        },

        // 添加消费按键编辑操作
        handleadd(row) {
            // this.getPartGoodscats();
            this.getStartSiteIdInfo();
            this.getGoodssaleInfo();
            this.getSpendingtableInfo(row);
            this.getSpendinggoodsInfo(row);

   

            // 消费商品表单添加顾客id
            this.addgoodsForm.bill_code = row.bill_code;
            // 消费 球桌表单
            this.editForm = JSON.parse(JSON.stringify(row));
         

            this.addspendingVisible = true;
        },
        // 查看某个顾客的账单消费详情操作
        handleEdit(row) {
   
            // 获取计费规则
            this.oldrow = row;
   
            this.getPartBRuleIdInfo();
            this.getSpendingtableInfo(row);
            this.getSpendinggoodsInfo(row);


            this.editVisible = true;
        },
        // // 监听修改对话框的关闭事件
        editDialogClosed() {
            // this.$refs.ruleRef.resetFields();
        },
        handletableFinish(row) {
            // 球桌完成计费  计算消费时间
            if (this.ruleid == '') {
                this.$message.error('计费规则不可为空');
                return;
            }
            row.ruleid = this.ruleid;
            const data = updatetimeSpendingtable(row)
                .then(data => {
                    if (data) {
                        if (data.code == 0) {
                            this.getDatapage(); //更新数据
                            this.getSpendingtableInfo(this.oldrow);
                            // this.editVisible = false;

                            this.$message.success(data.message);
                        } else {
                            this.$message.error(data.message);
                        }
                    }
                })
                .catch(err => this.$message.error('数据修改失败'));
        },
        handletableDelete(row) {
            // 撤消球桌消费
            // 二次确认球桌消费撤消
            this.$confirm('确定要取消球桌消费吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    console.log(row);
                    const data = await deleteSpendingtable(row);
                    console.log(data);
                    if (data) {
                        if (data.code == 0) {
                            this.getSpendingtableInfo(this.oldrow);
                            this.$message.success(data.message);
                        } else {
                            this.$message.error(data.message);
                        }
                    } else {
                        this.$message.error('取消球桌消费失败');
                    }
                    this.getDatapage(); //更新数据
                })
                .catch(() => {
                    this.$message.success('放弃取消');
                });
        },
        addClick() {
            this.getMemberIdInfo();
            this.addVisible = true;
            // this.getSiteIdInfo();
        },
        // 监听添加消费者对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
           
        },
        // 监听添加消费者消费对话框的关闭事件
        addspendingDialogClosed() {
            this.$refs.addtableFormRef.resetFields();
            this.Tablereserveoptions = null;

            // 商品表单清空
            this.$refs.addgoodsFormRef.resetFields();
            this.goodsstockvalue = 0;
            this.goodsvalue = '';

        },
        // 添加账单的请求
        addInfo() {
            // 校验
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
               
                const data = await addSpendingbill(this.addForm);
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
        getTime(itemdata) {
           
            let formdate = new Date();
            let idata = new Date(itemdata);
            let data = parseInt(formdate - idata) / 1000;
            if (data < 0) {
                let days = parseInt(-data / 86400); // 天  24*60*60*1000
                let hours = parseInt(-data / 3600) - 24 * days; // 小时 60*60 总小时数-过去的小时数=现在的小时数
                let minutes = parseInt((-data % 3600) / 60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
                // let seconds = parseInt(data % 60); // 以60秒为一整份 取余 剩下秒数
                // console.log('时间差是: ' + days + '天, ' + hours + '小时, ' + minutes + '分钟');
                return {
                    message: '后: ' + days + '天, ' + hours + '小时, ' + minutes + '分钟',
                    days,
                    hours,
                    minutes
                };
            } else {
                let days = parseInt(data / 86400); // 天  24*60*60*1000
                let hours = parseInt(data / 3600) - 24 * days; // 小时 60*60 总小时数-过去的小时数=现在的小时数
                let minutes = parseInt((data % 3600) / 60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
                // let seconds = parseInt(data % 60); // 以60秒为一整份 取余 剩下秒数
                // console.log('时间差是: ' + days + '天, ' + hours + '小时, ' + minutes + '分钟');
                return {
                    message: '前: ' + days + '天, ' + hours + '小时, ' + minutes + '分钟',
                    days,
                    hours,
                    minutes
                };
            }
        },
        getmemberinte() {
            this.intvalue = this.Memberoptions.find(item => item.member_id == this.addForm.member_id).integration;
        },
        /**
         * 添加球桌消费
         */
        geteditFormTablereserve() {
            // 请求并添加到数组
            this.getTablereserveInfo(this.editForm.table_id);
           
        },
        addtableInfo() {
            //消费球桌 发送添球桌消费的请求
            // 校验
            this.$refs.addtableFormRef.validate(async valid => {
                if (!valid) return;
                // 验证通过 ，提交
               

                const data = await addSpendingtable(this.editForm);
                if (data) {
                    if (data.code == 0) {
                        this.getDatapage(); //更新数据

                        this.addspendingVisible = false;
                        this.$message.success(data.message);
                    } else {
                        this.$message.error(data.message);
                    }
                } else {
                    this.$message.error('球桌开台失败');
                    // this.$message.success('数据添加失败');
                }
            });
        },
        /**
         * 添加商品消费
         */
        getgoodsinte() {
            // 添加商品 表单展示选择 商品的库存， 价格

           
            this.goodsstockvalue = this.Goodsoptions.find(item => item.goods_id == this.addgoodsForm.goods_id).goods_stock;
            this.goodsvalue = this.Goodsoptions.find(item => item.goods_id == this.addgoodsForm.goods_id).price;

            // 修改商品时重置购买数量和购买价格
            this.addgoodsForm.goods_count = 0;
            this.addgoodsForm.amount = 0;
        },
        getintegration() {
            // 添加商品 计算购买商品 总 金额
           

            if (this.goodsvalue) {
                if (this.addgoodsForm.goods_count) {
                    this.addgoodsForm.amount = this.goodsvalue * this.addgoodsForm.goods_count;
                } else {
                    this.addgoodsForm.amount = 0;
                }
            } else {
                this.addgoodsForm.amount = '';
            }
        },
        addgoodsInfo() {
            //添加商品 发送添加商品的请求
            // 校验
            this.$refs.addgoodsFormRef.validate(async valid => {
                if (!valid) return;
               

                const data = await addSpendinggoods(this.addgoodsForm);
                if (data) {
                    if (data.code == 0) {
                        this.getDatapage(); //更新数据

                        this.addspendingVisible = false;
                        this.$message.success(data.message);
                    } else {
                        this.$message.error(data.message);
                    }
                } else {
                    this.$message.error('购买商品失败');
          
                }
            });
        },
        handlegoodsDelete(row) {
            // 二次确认购买商品撤消
            this.$confirm('确定要取消购买吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    console.log(row);
                    const data = await cancelgoods(row);
                    console.log(data);
                    if (data) {
                        if (data.code == 0) {
                         
                            this.getSpendinggoodsInfo(this.oldrow);
                            this.$message.success(data.message);
                        } else {
                            this.$message.error(data.message);
                        }
                    } else {
                        this.$message.error('取消购买失败');
                    }
                    this.getDatapage(); //更新数据
                })
                .catch(() => {
                    this.$message.success('放弃取消');
                });
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

.dialogfooter {
    padding: 10px 20px 20px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.selectaaa {
    padding: 5px 5px 10px;
}
.itemclass {
    padding: 5px 5px 10px;
}
</style>
