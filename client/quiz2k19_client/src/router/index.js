import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Quiz from '@/components/Quiz'
import Login from '@/components/admin/Login'
import Dashboard from '@/components/admin/Dashboard'
import ViewQuestion from '@/components/admin/ViewQuestion'
import AddQuestion from '@/components/admin/AddQuestion'
import EditQuestion from '@/components/admin/EditQuestion'
import LiveScore from '@/components/LiveScore'
import FinishQuiz from '@/components/FinishQuiz'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/quiz',
            name: 'Quiz',
            component: Quiz
        },
        {
            path: '/live-score',
            name: 'LiveScore',
            component: LiveScore
        },
        {
            path: '/finish',
            name: 'FinishQuiz',
            component: FinishQuiz
        },
        {
            path: '/admin',
            redirect: {name: 'Login'}
        },
        {
            path: '/admin/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/admin/dashboard',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/admin/view-question/:id',
            name: 'ViewQuestion',
            component: ViewQuestion
        },
        {
            path: '/admin/add-question',
            name: 'AddQuestion',
            component: AddQuestion
        },
        {
            path: '/admin/edit-question/:id',
            name: 'EditQuestion',
            component: EditQuestion
        }
    ],
    scrollBehavior(to, from, savedPosition){
        return {x: 0, y: 0};
    }
})