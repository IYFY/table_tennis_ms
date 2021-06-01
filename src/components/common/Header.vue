<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">乒乓球场馆管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
               
                <!-- 用户头像 -->
                <el-popover placement="top-start" title="用户信息" width="200" trigger="hover">
                    <p>{{"用户名： " + name}}</p>
                    <p>{{"性别： " + gender}}</p>
                    <div slot="reference" class="user-avator">
                        <img src="../../assets/img/img.jpg" />
                    </div>
                </el-popover>

                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                       
                        </a>-->
                        <el-dropdown-item command="handleEdit">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="修改密码" :visible.sync="editVisible" @close="editDialogClosed" width="30%">
            <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="用户姓名">
                    <el-input v-model="name" disabled></el-input>
                </el-form-item>
                <el-form-item label="旧密码：" prop="password">
                    <el-input type="password" v-model="editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newpwd">
                    <el-input type="password" v-model="editForm.newpwd"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="newpassword1">
                    <el-input type="password" v-model="editForm.newpassword1"></el-input>
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
import bus from '../common/bus';
import { updatePassword } from '../../../network/admin';

export default {
    data() {
        return {
            collapse: false,
            fullscreen: false,
            name: localStorage.getItem('admin_name') || '用户',
            gender: localStorage.getItem('gender') || '',
            message: 2,

            editForm: {
                password: '',
                newpwd: '',
                newpassword1: ''
            },
            editVisible: false,
            FormRules: {
                password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
                newpwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback(new Error('请输入新密码'));
                            } else if (value.toString().length < 6 || value.toString().length > 18) {
                                callback(new Error('密码长度为6-18位'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                newpassword1: [
                    { required: true, message: '请再一次输入新密码', trigger: 'blur' },
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请再次输入密码'));
                            } else if (value !== this.editForm.newpwd) {
                                callback(new Error('两次输入密码不一致!'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        username() {
            let username = localStorage.getItem('admin_name');
            return username ? username : this.name;
        }
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                localStorage.removeItem('admin_id');
                localStorage.removeItem('admin_name');
                localStorage.removeItem('gender');
                localStorage.removeItem('phone');
                localStorage.removeItem('currentUser_token');
                this.$router.push('/login');
            }
            if (command == 'handleEdit') {
                console.log('修改密码');
                this.editVisible = true;
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        // 监听修改对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
            this.editForm.password = '';
            this.editForm.newpwd = '';
            this.editForm.newpassword1 = '';
        },
        // 保存编辑
        updateInfo() {
            // 校验
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                // 验证通过 ，提交
                // alert('submit!');
                this.editForm.admin_id = localStorage.getItem('admin_id')
                const data = await updatePassword(this.editForm);
                if (data) {
                    if (data.code == 0) {
                        this.editVisible = false;
                        this.$message.success(data.message);
                    } else {
                        this.$message.error(data.message);
                    }
                } else {
                    this.$message.error('密码修改失败');
                }
            });
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
