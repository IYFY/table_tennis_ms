<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                // {
                //     icon: 'el-icon-lx-home',
                //     index: 'dashboard',
                //     title: '系统首页'
                // },
                // {
                //     icon: 'el-icon-lx-cascades',
                //     index: 'member',  // 跳转路由
                //     title: '顾客管理' // 标题
                // },
                {
                    icon: 'el-icon-edit-outline',
                    index: '1',
                    title: '消费管理',
                    subs: [
                        //子菜单
                        {
                            index: 'spendingbills',  
                            title: '总消费列表'
                        },
                        {
                            index: 'spendingtable',
                            title: '球桌消费列表'
                        },
                        {
                            index: 'spendinggoods',
                            title: '商品消费列表'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '2',
                    title: '顾客管理',
                    subs: [
                        //子菜单
                        {
                            index: 'member',  
                            title: '顾客列表'
                        },
                        {
                            index: 'memberreserve',
                            title: '顾客预约'
                        },
                        {
                            index: 'memberswap',
                            title: '顾客兑换'
                        }
                    ]
                },
                {
                    icon: 'el-icon-location-outline',
                    index: '3',
                    title: '球桌管理',
                    subs: [
                        //子菜单
                        {
                            index: 'site',  
                            title: '球桌列表'
                        },
                        // {
                        //     index: '场地预定',
                        //     title: '场地预定'
                        // },
                        {
                            index: 'siteservice',
                            title: '球桌维护'
                        }
                    ]
                },
                {
                    icon: 'el-icon-goods',
                    index: '4',
                    title: '商品管理',
                    subs: [
                        //子菜单
                        {
                            index: 'goodscsts',  
                            title: '商品分类'
                        },
                        {
                            index: 'goods',
                            title: '商品列表'
                        },
                        {
                            index: 'goodsswap',
                            title: '商品兑换列表'
                        }
                    ]
                },
                {
                    icon: 'el-icon-setting',
                    index: '5',
                    title: '系统设置',
                    subs: [
                        //子菜单
                        {
                            index: 'admin',  
                            title: '管理员列表'
                        },
                        {
                            index: 'chargerule',
                            title: '计费规则管理'
                        },
                    ]
                },
      
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
