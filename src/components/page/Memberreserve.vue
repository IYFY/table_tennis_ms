<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 顾客预约列表
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
              

                <el-table-column label="预约编码" prop="reserve_id" width="100"></el-table-column>
                <el-table-column label="顾客名" prop="member.name"></el-table-column>
                <el-table-column label="顾客手机号" prop="member.phone"></el-table-column>
                <el-table-column label="球桌名称" prop="site.table_name"></el-table-column>
                <el-table-column label="预约时间" width="160">
                    <template slot-scope="scope">
                        <span size="medium">{{ rTime(scope.row.reserve_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="预约状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag
                            :type="
                                scope.row.reserve_state === '完成预约'
                                    ? 'success'
                                    : scope.row.reserve_state === '预约中'
                                    ? 'warning'
                                    : scope.row.reserve_state === '预约取消'
                                    ? 'danger'
                                    : ''
                            "
                        >{{ scope.row.reserve_state}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-show="scope.row.reserve_state == '预约中'"
                            type="text"
                            icon="el-icon-check"
                            @click="handleFinish(scope.row)"
                        >到达</el-button>
                        <el-button
                            v-show="scope.row.reserve_state == '预约中'"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                        >取消预约</el-button>
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

        <!-- 到达编辑弹出框 -->
        <el-dialog title="编辑到达信息" :visible.sync="editVisible" @close="editDialogClosed" width="35%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
                <el-form-item label="顾客名称" ref="member_id">
                    <el-input v-model="editForm.member.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="预约时间">
                    <el-date-picker
                        v-model="editForm.reserve_time"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        disabled
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="预约球桌名称">
                    <el-input v-model="editForm.site.table_name" disabled></el-input>
                </el-form-item>

                <el-form-item label="开台球桌名称" prop="table_id">
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

            <template slot="footer">
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateInfo">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 添加弹出框 -->
        <el-dialog title="添加预约" :visible.sync="addVisible" @close="addDialogClosed" width="35%">
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
                <el-form-item label="预约时间" prop="reserve_time">
                    <el-date-picker
                        v-model="addForm.reserve_time"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="球桌名称" prop="table_id">
                    <el-select
                        v-model="addForm.table_id"
                        placeholder="请选择"
                        @change="getTablereserve"
                    >
                        <el-option
                            v-for="item in Tableoptions"
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
                    >{{ '该球桌的存在预约：' + rTime( item.reserve_time) + '；在本次预约时间' + getTime(item.reserve_time).message }}</el-tag>
                </div>
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
import { getSiteIdInfo, getStartSiteIdInfo } from '../../../network/site';
import {
    getMemberreserveAllInfo,
    addMemberreserve,
    updateMemberreserve,
    deleteMemberreserve,
    getTablereserveInfo
} from '../../../network/memberreserve';
import { addbillandtable } from '../../../network/spendingbills';
export default {
    name: 'memberreserve',
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
            Tableoptions: [],
            StartTableoptions: [],
            Tablereserveoptions: [],
            addVisible: false,
            addForm: {
              
                swap_count: 0
            },
          
            editVisible: false,
            editForm: {
                member: {},
                site: {}
            },
            idx: -1,
            id: -1,
            FormRules: {
                member_id: [{ required: true, message: '请选择顾客', trigger: 'blur' }],
                table_id: [{ required: true, message: '请选择球桌', trigger: 'blur' }],
                reserve_time: [{ required: true, message: '请输入预约时间', trigger: 'blur' }]
            },
            editFormRules: {
                table_id: [
                    { required: true, message: '请选择球桌', trigger: 'blur' },
                    {
                        validator: (rule, value, cb) => {
                            if (this.editForm.table_id === value) {
                                return cb();
                            }
                            cb(new Error('该预约球桌正在使用,请修改开台球桌'));
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
            getMemberreserveAllInfo(this.query).then(res => {
                if (res.code == 0) {
                    this.Data = res;
                    console.log(this.Data);
                    this.tableData = this.Data.result.rows;
                    this.pageTotal = this.Data.result.count;
                    console.log(this.tableData);
                } else {
                 
                }
              
            });
            this.getStartSiteIdInfo();
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
        getSiteIdInfo() {
            // 网络请求正常球桌信息
            getSiteIdInfo().then(res => {
                console.log(res);
               
                this.Tableoptions = res.result;
              
                console.log('*********this.Tableoptions');
                console.log(this.Tableoptions);
            });
        },
        getStartSiteIdInfo() {
            // 网络请求空置球桌信息
            getStartSiteIdInfo().then(res => {
                console.log(res);
            
                this.StartTableoptions = res.result;
              
                let id = this.editForm.site.table_id;
                console.log('this.editForm.site.table_id');
                console.log(id);
                this.StartTableoptions.forEach(function(value) {
                    console.log('value.table_id');
                    console.log(value.table_id);

                    if (value.table_id !== id) {
                        id = null;
                    }
                });
                this.editForm.table_id = id;
                console.log('this.editForm.site.table_id前');
                console.log(this.editForm.table_id);
                console.log('this.editForm.site.table_id后');
                console.log(this.editForm.table_id);
                // this.$refs.addFormRef.resetFields();
                // this.addForm.details = ''
                console.log('*********this.StartTableoptions');
                console.log(this.StartTableoptions);
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

  
        // 删除操作
        handleDelete(row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    const data = await deleteMemberreserve(row);

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

        // 编辑取消操作
        handleEdit(row) {
         
            // 二次确认删除
            this.$confirm('确定要撤消吗？', '提示', {
                type: 'warning'
            })
                .then(async () => {
                    row.reserve_state = '预约取消';
                    const data = await updateMemberreserve(row);

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
                        this.$message.error('取消预约失败');
                    }
                    this.getDatapage(); //更新数据
                })
                .catch(() => {
                    this.$message.success('放弃取消预约');
                });
        },
        // 编辑操作
        handleFinish(row) {
           
            this.getStartSiteIdInfo();
            console.log('row0000000000000000000000000000000000');
            console.log(row);
            this.editForm = JSON.parse(JSON.stringify(row));

            //如果到达时球桌没有占用就可以直接请求账单 球桌消费，占用就打开窗口重新选择球桌再请求账单 球桌消费
            let table = this.StartTableoptions.filter(value => {
                value.table_id == row.site.table_id;
            });
         

            if (table.length >= 1) {
                // 直接请求账单
               
                let data = {
                    member_id: row.member_id,
                    table_id: row.table_id,
                    admin_id: localStorage.getItem('admin_id') || '',
                    reserve_id: row.reserve_id,
                    reserve_state: '完成预约'
                };
                // 球桌消费
                addbillandtable(data)
                    .then(res => {
                        if (res.code == 0) {
                            this.getDatapage(); //更新数据
                           
                            this.$message.success(res.message);
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                    .catch(err => {
                        this.$message.error('达到数据添加失败');
                    });
            } else {
                this.editVisible = true;
                this.$message.error('预约的球桌正在使用中');
            }
        },
        // // 监听修改对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 保存编辑
        updateInfo() {
            // 校验
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                // 验证通过 ，提交
              

                console.log("******************8this.editForm")
                console.log(this.editForm)
                 console.log("******************8this.editForm")

                let data = {
                    member_id: this.editForm.member_id,
                    table_id: this.editForm.table_id,
                    admin_id: localStorage.getItem('admin_id') || '',
                    reserve_id: this.editForm.reserve_id,
                    reserve_state: '完成预约'
                };
                // 球桌消费
                addbillandtable(data)
                    .then(res => {
                        if (res.code == 0) {
                            this.getDatapage(); //更新数据
                            this.editVisible = false;
                            this.$message.success(res.message);
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                    .catch(err => {
                        this.$message.error('达到数据添加失败');
                    });

              
            });
        },
        addClick() {
            this.addVisible = true;
            this.getMemberIdInfo();
            this.getSiteIdInfo();
        },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
            // // 重置表单
         
            this.Tablereserveoptions = null;
        },
        addInfo() {
            // 校验
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
              
                // 验证通过 ，提交
                // alert('submit!');
                console.log('this.addForm');
                console.log(this.addForm);

                const data = await addMemberreserve(this.addForm);
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
        getTime(itemdata) {
         
            let formdate;
            if (this.addForm.reserve_time) {
                formdate = new Date(this.addForm.reserve_time);
            } else {
                // 如果预约时间没有选择就为当前时间
                formdate = new Date();
            }
            // let formdate = new Date(this.addForm.reserve_time);
            
            
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
        getTablereserve() {
       
            this.getTablereserveInfo(this.addForm.table_id);
          
        },
        geteditFormTablereserve() {
          
            this.getTablereserveInfo(this.editForm.table_id);
          
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
