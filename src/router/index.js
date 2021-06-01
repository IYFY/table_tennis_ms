import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            redirect: '/spendingbills'
            // redirect: '/home'
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/home',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
               
                {
                    path: '/spendingbills',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Spendingbills.vue'),
                    meta: { title: '消费列表' }
                },
                {
                    path: '/spendinggoods',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Spendinggoods.vue'),
                    meta: { title: '商品消费列表' }
                },
                {
                    path: '/spendingtable',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Spendingtable.vue'),
                    meta: { title: '球桌消费列表' }
                },
                {
                    path: '/member',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Member.vue'),
                    meta: { title: '顾客列表' }
                },
                {
                    path: '/memberreserve',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Memberreserve.vue'),
                    meta: { title: '顾客预约' }
                },
                {
                    path: '/memberswap',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Memberswap.vue'),
                    meta: { title: '顾客兑换' }
                },
                {
                    path: '/site',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Site.vue'),
                    meta: { title: '球桌列表' }
                },
                {
                    path: '/siteservice',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Siteservice.vue'),
                    meta: { title: '球桌维护' }
                },
                {
                    path: '/goodscsts',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Goodscats.vue'),
                    meta: { title: '商品分类' }
                },
                {
                    path: '/goods',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Goods.vue'),
                    meta: { title: '商品列表' }
                },
                {
                    path: '/goodsswap',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Goodsswap.vue'),
                    meta: { title: '商品兑换列表' }
                },
                {
                    path: '/chargerule',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Chargerule.vue'),
                    meta: { title: '计费规则列表' }
                },
                {
                    path: '/admin',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Admin.vue'),
                    meta: { title: '管理员列表' }
                },
               
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
