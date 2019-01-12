<template>
    <div class="main container">
        <div class="loading-indicator" v-if="loading"></div>
        <div class="navbar navbar-light bg-light">
          <h1>View Question</h1>
        </div>
        <div class="back-button">
            <router-link :to="{name: 'Dashboard'}">&lt;&lt;&nbsp;Go back</router-link>
        </div>
        <div class="viewed-question container jumbotron" style="height: 100vh;">
            <div class="view-question alert alert-light">
                <div class="h2"><span>Question:&nbsp;</span>{{question.title | capitalize}}</div>
                <div class="desc" v-if="question.description"><pre>{{question.description}}</pre></div>
                <h3>Options:</h3>
                <ul>
                    <li class="h4" v-for="option in question.options" :key="option.id">{{option}}</li>
                </ul>
                
                <h4>Answer: {{question.answer}}</h4>
                <button class="btn btn-danger delete-question" @click="deleteQuestion(question._id)">Delete</button>
            </div>
            </div>
    </div>
</template>
<script>
import {HTTP} from '../http-common';

export default {
    name: 'ViewQuestion',
    data: function(){
        return {
            question: {
                title: '',
                options:[],
                answer: '',
                _id: ''
            },
            loading: false
        }
    },
    created: function(){
        if(!localStorage.getItem("secret_key")) {
            this.$router.push({name: 'Login'});
        }
        
        this.loading = true;
        HTTP.post(`/admin/view-question/${this.$route.params.id}`, {id: this.$route.params.id, secret_key: localStorage.getItem('secret_key')}).then(res => {
            this.loading = false;
            this.question = res.data;
        }).catch(err => {
            this.loading = false;
            console.log(err);
        });
    },
    filters: {
        capitalize: function(value) {
        if (!value) return "";
        return value.charAt(0).toUpperCase() + value.slice(1);
        }
    },
    methods: {
    deleteQuestion: function(question_id) {
      HTTP.post(`/admin/delete-question/${question_id}`, {
        secret_key: localStorage.getItem("secret_key"),
        id: question_id
      })
        .then(res => {
          if(!res.data){
              this.$router.push({name: 'Dashboard'});
          } else {
              console.log(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}
</script>

