<template>
    <div style="height: 100vh;" class="main container d-flex justify-content-center align-items-center">
        <div style="max-width: 600px;box-shadow: 0 0 2px 0 #333;" class="alert alert-light login-form container">
            <h1 class="login-heading">Login</h1><hr>
            <div v-if="error" class="error-message alert alert-info">{{error}}</div>
            <form class="form-group">
                <label for="login-text">Enter Secret Key</label>
                <br>
                <input class="form-control" type="password" id="login-text" placeholder="SECRET_KEY" v-model="user_input.secret_key">
                <br>
                <input type="button" class="btn btn-primary" value="Enter" v-on:click="login">
            </form>
        </div>
    </div>
</template>
<script>
import {HTTP} from '../http-common';

export default {
    name: 'Login',
    data: function(){
        return {
            user_input: {secret_key: ''},
            error: ''
        }
    },
    created: function(){
        if(localStorage.getItem("secret_key")) {
            this.$router.push({name: 'Dashboard'});
        }
    },
    methods: {
        login: function(){
            console.log(this.user_input);
            HTTP.post('/admin/login', this.user_input).then( res => {
                if(res.data.success){
                    localStorage.setItem("secret_key", res.data.secret_key);
                    this.$router.push({name: 'Dashboard'});
                } else {
                    this.error = "Invalid Credentials";
                }
            }).catch(err => {
                console.log(err);
            });
            
        }
        
    }
}
</script>
<style>
.login-form {
    padding: 4rem;
}
</style>

