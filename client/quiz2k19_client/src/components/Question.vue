<template>
      <div class="container d-flex flex-row justify-content-center align-items-center">
        <div class="loading-indicator" v-if="loading"></div>
          <div class="question" :class="{'text-muted': hasAnswered}">
              <div class="errors alert alert-info" v-if="error">
                <div class="error">{{error}}</div>
              </div>
              <div class="title">
                <div class="h1">{{question.number}}. {{question.title | capitalize}}</div> 
              </div>
              <pre class="desc" v-if="question.description">{{question.description}}</pre>
              <div class="options" v-for="option in question.options" :key="option.id">
                  <label class="text-justify radio-container" :class="{'radio-disabled': hasAnswered}">
                      <input type="radio" :disabled="hasAnswered" class="optionsInput" :name="question._id" :value="option" v-model="pickedAnswer">
                      &nbsp;<span class="option h5">{{option | capitalize}}</span>
                      <span class="checkmark"></span>
                  </label>
                  <input type="hidden" :value="question._id">
              </div>
              <button type="submit" id="submit-btn" class="btn btn-success" :class="{disabled: hasAnswered}" :disabled="hasAnswered" @click="submitAnswer($event)">Submit</button>
          </div>
      </div>
</template>
<script>
import { HTTP } from "./http-common";

export default {
  name: "Question",
  props: {
    question: {
      type: Object,
      default: { title: "", description: "", options: [], _id: "", number: 1 }
    },
    teamId: "",
    finishTime: ""
  },
  data: function() {
    return {
      pickedAnswer: "",
      hasAnswered: false,
      error: "",
      loading: false,
      auto: null
    };
  },
  mounted: function() {
    this.$watch(
      "question",
      question => {
        this.hasAnswered = question.hasAnswered;
        this.pickedAnswer = question.selectedAnswer;
        this.error = "";
        console.log(question.selectedAnswer);
      },
      { immediate: true }
    );
  },
  created: function() {
    // setInterval(()=>{

    // }, 2000);

    if (this.$root.sharedData.autoEnabled) {
      this.auto = setInterval(() => {
        let randOption = Math.floor(
          Math.random() * Math.floor(this.question.options.length)
        );
        setTimeout(() => {
          console.log("random option: " + randOption);
          console.log("selecting option: " + this.question.options[randOption]);
          this.pickedAnswer = this.question.options[randOption];
        }, 500);
        setTimeout(() => {
          document.getElementById("submit-btn").click();
        }, 1000);
        setTimeout(() => {
          document.getElementById("btn-next").click();
        }, 1500);
        console.log("qno: " + this.question.number);
        console.log("totalqs: " + this.$root.sharedData.questions.length);
        // total questions - 1 because it also contains team name
        if (
          this.question.number >=
          this.$root.sharedData.questions.length - 1
        ) {
          document.getElementById("finish-btn").click();
          clearInterval(this.auto);
        }
      }, 3000);
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  methods: {
    submitAnswer: function(event) {
      if (!this.pickedAnswer) {
        this.error = "Answer is required!";
        return;
      } else {
        this.error = "";
      }
      this.question.hasAnswered = true;
      this.question.selectedAnswer = this.pickedAnswer;
      this.hasAnswered = true;

      this.loading = true;
      HTTP.post("/quiz/answer", {
        teamId: this.teamId,
        questionId: this.question._id,
        answer: this.pickedAnswer
      })
        .then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.data.errors) {
            this.error = "Answer is required!";
          } else {
            this.error = "";
            this.$socket.emit("updateLiveScore", "");
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
.question {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  animation: slideLeft 0.3s 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  animation: slideLeft 0.3s 0.3s;
}
.slide-left {
  animation: slideLeft 0.3s 0.3s;
}

@keyframes slideLeft {
  from {
    transform: translateX(1000px);
  }
  to {
    transform: translateX(0);
  }
}
.radio-container {
  display: block;
  cursor: pointer;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.radio-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #ccc;
  border-radius: 50%;
}

.radio-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.radio-disabled:hover input ~ .checkmark {
  background-color: #eee;
}

.radio-container input:checked ~ .checkmark {
  background-color: #158cba;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.radio-container input:checked ~ .checkmark:after {
  display: block;
}

.radio-container .checkmark:after {
  top: 9px;
  left: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #fff;
}
</style>

