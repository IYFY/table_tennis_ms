<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">乒乓球场馆管理系统</div>
            <el-form
                :model="loginForm"
                :rules="rules"
                ref="login"
                label-width="0px"
                class="ms-content"
            >
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="手机号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="loginForm.password"
                        @keyup.enter.native="login()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="login()">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import { login } from '../../../network/admin';

export default {
    data: function() {
        return {
            loginForm: {
             
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        login() {
            this.$refs.login.validate(async valid => {
                if (valid) {
                    console.log('网络请求：登录');
                    const data = await login(this.loginForm.username, this.loginForm.password);
                    if (data) {
                        if (data.code == 0) {
                            console.log('网络请求：' + JSON.stringify(data));
                            console.log('网络请求新：' + data.token);
                            //token本地存储
                            localStorage.setItem('admin_id', data.result.admin_id);
                            localStorage.setItem('admin_name', data.result.admin_name);
                            localStorage.setItem('gender', data.result.gender);
                            localStorage.setItem('phone', data.result.phone);
                            localStorage.setItem('currentUser_token', data.token);
                            this.$message.success(data.message);
                            this.$router.push('/home');

                       
                        } else {
                            this.$message.error(data.message);
                        }
                    } else {
                        this.$message.error('登录失败');
                    }
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
          
            // 网络请求
        },
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.$message.success('登录成功');
                    localStorage.setItem('ms_username', this.param.username);
                    this.$router.push('/home');
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
