<template>
    <div class="main container">
        <div class="loading-indicator" v-if="loading"></div>
        <div class="navbar navbar-light bg-light">
          <h1>Dashboard</h1>
        </div>
        <div class="questions-container container jumbotron" style="height: 100%;">
          <router-link class="btn btn-secondary" :to="{name: 'Home'}">Play Quiz</router-link>
          <h3>Questions</h3>
          <router-link class="btn btn-success" :to="{name: 'AddQuestion'}">Add Question</router-link>
          <div class="alert alert-dark" v-if="error">
            {{errors}}
          </div>
          <div class="questions my-3">
              <div class="question h4 alert alert-light" v-for="(question, key) in questions" :key="question.id">
                  <div class="title">
                    {{key+1}}. {{question.title | capitalize}}
                  </div>
                  <div class="option-buttons my-3" v-if="question._id">
                      <router-link class="btn btn-secondary view-question text-dark" :to="{name: 'ViewQuestion', params: {id: question._id}}">View</router-link>
                      &nbsp;
                      <router-link class="btn btn-primary edit-question text-light" :to="{name: 'EditQuestion', params: {id: question._id}}">Edit</router-link>
                      &nbsp;
                      <button class="btn btn-danger delete-question" @click="deleteQuestion(question._id, key, $event)">Delete</button>
                  </div>
              </div>
          </div>
          </div>
    </div>
</template>
<script>
import { HTTP } from "../http-common";

export default {
  name: "Dashboard",
  data: function() {
    return {
      questions: [{ title: "", options: [], answer: "", _id: "" }],
      error: '',
      loading: false
    };
  },
  created: function() {
    if (!localStorage.getItem("secret_key")) {
      this.$router.push({ name: "Login" });
    }
    this.loading = true;
    HTTP.post("/admin/dashboard", {
      secret_key: localStorage.getItem("secret_key")
    })
      .then(res => {
        this.loading = false;
        this.questions = res.data;
      })
      .catch(err => {
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
    deleteQuestion: function(question_id, index, event) {
      this.loading = true;
      event.target.disabled = true;
      HTTP.post(`/admin/delete-question/${question_id}`, {
        secret_key: localStorage.getItem("secret_key"),
        id: question_id
      })
        .then(res => {
          this.loading = false;
          if(!res.data){
              this.questions.splice(index, 1);
          } else {
              console.log(res.data);
              this.error = res.data;
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  }
};
</script>

