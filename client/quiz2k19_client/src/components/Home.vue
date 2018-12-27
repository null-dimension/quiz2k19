<template>
    <div style="height: 100vh;" class="main container d-flex flex-row justify-content-center align-items-center">
        <div class="loading-indicator" v-if="loading"></div>
        <div class="text-center jumbotron">
            <h1>TECHNO TARANG 2K19</h1>
            <hr>
            <h2>QUIZ</h2>
            <form class="form">
                <div class="errors" v-if="validationErrors.errors.length > 0">
                    <div class="error alert alert-dark" v-for="error in validationErrors.errors" :key="error.id">
                        {{error}}
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">TEAM</span>
                        </div>

                        <input type="text" id="teamInput" class="form-control" v-model="teamName" placeholder="Enter your team">
                    </div>
                </div>
                <button type="button" class="btn btn-lg btn-primary" v-on:click="startQuiz" :disabled="loading">Start!</button>
            </form>
            <hr>
            <div class="rules">
                <h3>RULES</h3>
                <ul class="list-group">
                    <li class="list-group-item">RULE 1</li>
                    <li class="list-group-item">RULE 1</li>
                    <li class="list-group-item">RULE 1</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { serverBus } from "../main";
import { HTTP } from "./http-common";

export default {
  name: "Home",
  data: function() {
    return {
      questions: [],
      teamName: '',
      validationErrors: { errors: [] },
      loading: false
    };
  },
  methods: {
    startQuiz: function() {
      this.loading = true;
      HTTP.post("/quiz", { teamName: this.teamName })
        .then(res => {
          this.loading = false;
          if (res.data.errors) {
            this.validationErrors.errors = res.data.errors;
          } else {
            this.$root.sharedData.questions = res.data;

            this.$router.push({ name: "Quiz" });
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
<style>
/* .main {
    height: 100vh;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: stretch;
} */
.loading-indicator {
    position: fixed;
    top: 10px;
    left: 10px;
    
    border: 10px dotted #f3f3f3;
    border-radius: 50%;
    width: 50px; 
    height: 50px;
    animation: animateLoader 2s ease-in-out infinite;

}
@keyframes animateLoader{
    from{
        transform: rotate(0deg);
    } to {
        transform: rotate(360deg);
    }
}
</style>


