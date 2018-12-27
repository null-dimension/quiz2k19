<template>
  <div style="height: 100vh;" class="container d-flex flex-row justify-content-center align-items-center">
      <h3 id="team-name">TEAM {{teamName}}</h3>
      <div class="timer" :class="{'text-danger': minutes <= 1}">
        <span id="hours" v-if="hours">
          <span v-if="hours > 9">{{hours}}</span>
          <span v-else>0{{hours}}</span> :
        </span>
        <span id="minutes">
          <span v-if="minutes > 9">{{minutes}}</span>
          <span v-else>0{{minutes}}</span>
        </span>
        :
        <span id="seconds">
          <span v-if="seconds > 9">{{seconds}}</span>
          <span v-else>0{{seconds}}</span>
        </span>
      </div>
      <router-link class="btn-finish btn btn-lg btn-primary" :to="{name: 'FinishQuiz'}">Finish</router-link>
    <div class="question-container">
      
      <!-- <div class="question" v-for="question in questions" :key="question.id">
                {{question.title}}
            </div> -->
      <div class="question-component jumbotron" style="" :class="{'slide-left': slideLeft, 'slide-right': slideRight}">
          <question :question.sync="question" :teamId="teamId"></question>
      </div>
      <div class="question-nav">
        <button type="button" id="btn-prev" class="btn-nav btn btn-lg btn-secondary" :class="{disabled: currentQuestion==1}" @click="prevQuestion">&lt;&nbsp;Previous</button>
        <button type="button" id="btn-next" class="btn-nav btn btn-lg btn-secondary" :class="{disabled: currentQuestion==questions.length-1}" @click="nextQuestion">Next&nbsp;&gt;</button>
      </div>
      
    </div>
    <div class="pagination-container">
        <ul class="pagination">
          <li class="page-item" :class="{disabled: currentQuestion==1}" @click="goToFirst">
            <a class="page-link" href="javascript:void(0)">&laquo;&nbsp;First</a>
          </li>
          <li class="page-item" v-for="qno in questions.length-1" :key="qno" :class="{active: qno==currentQuestion}" @click="goToQuestion(qno)">
            <a class="page-link" href="javascript:void(0)">{{qno}}</a>
          </li>
          <li class="page-item" :class="{disabled: currentQuestion==questions.length-1}" @click="goToLast">
            <a class="page-link" href="javascript:void(0)">Last&nbsp;&raquo;</a>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
import Question from "@/components/Question";
import { serverBus } from "../main";

export default {
  name: "Quiz",
  data: function() {
    return {
      questions: [],
      question: {},
      currentQuestion: 1,
      teamName: "",
      teamId: "",
      slideLeft: false,
      slideRight: false,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timeUp: false,
      countDownTimer: null
    };
  },
  components: {
    question: Question
  },
  created: function() {
      if(this.$root.sharedData.questions.length > 0) {
        this.questions = this.$root.sharedData.questions;
        // Has the user answered?
        for (let i = 0; i < this.questions.length; i++) {
          this.questions[i].hasAnswered = false;
          this.questions[i].selectedAnswer = "";
          this.questions[i].showQuestion = false;
        }
        console.log(this.questions);
        // [0] index is team name and id
        this.teamName = this.questions[0].teamName;
        this.teamId = this.questions[0].teamId;

        this.question = this.questions[this.currentQuestion];
        this.question.number = this.currentQuestion;

        this.startTimer();
      } else {
        console.log("ERROR: NO DATA IN SHARED_DATA");
        this.$router.push({name: 'Home'});
      }
  },
  methods: {
    prevQuestion: function() {
      if (this.currentQuestion <= 1) {
        this.currentQuestion = 1;
      } else {
        this.currentQuestion--;

        this.question = this.questions[this.currentQuestion];
        this.question.number = this.currentQuestion;

        this.slideLeft = false;
        this.slideRight = true;

        setTimeout(() => {
          this.slideLeft = false;
          this.slideRight = false;
        }, 350);
      }
    },
    nextQuestion: function() {
      if (this.currentQuestion >= this.questions.length - 1) {
        this.currentQuestion = this.questions.length - 1;
      } else {
        this.question.showQuestion = false;
        this.currentQuestion++;
        this.question = this.questions[this.currentQuestion];

        this.question.number = this.currentQuestion;
        this.slideLeft = true;
        this.slideRight = false;

        setTimeout(() => {
          this.slideLeft = false;
          this.slideRight = false;
        }, 350);
      }
    },
    goToQuestion: function(qno) {
      if (qno > this.currentQuestion) {
        this.slideLeft = true;
        this.slideRight = false;
      } else if (qno < this.currentQuestion) {
        this.slideLeft = false;
        this.slideRight = true;
      }
      this.currentQuestion = qno;
      this.question = this.questions[this.currentQuestion];
      this.question.number = this.currentQuestion;

      setTimeout(() => {
        this.slideLeft = false;
        this.slideRight = false;
      }, 350);
    },
    goToFirst: function() {
      if (this.currentQuestion != 1) {
        this.slideLeft = false;
        this.slideRight = true;
      }
      this.currentQuestion = 1;
      this.question = this.questions[this.currentQuestion];
      this.question.number = this.currentQuestion;

      setTimeout(() => {
        this.slideLeft = false;
        this.slideRight = false;
      }, 350);
    },
    goToLast: function() {
      if (this.currentQuestion != this.questions.length - 1) {
        this.slideLeft = true;
        this.slideRight = false;
      }
      this.currentQuestion = this.questions.length - 1;
      this.question = this.questions[this.currentQuestion];
      this.question.number = this.currentQuestion;

      setTimeout(() => {
        this.slideLeft = false;
        this.slideRight = false;
      }, 350);
    },
    startTimer: function(){
      // Max time in milliseconds
      let maxTime = 300000;
      let countDownTo = new Date().getTime() + maxTime;

      this.countDownTimer = setInterval(()=>{

        let now = new Date().getTime();

        let timeDiff = countDownTo - now;

        let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);;
        if(hours < 0){
          hours = 0;
        } 
        if(minutes < 0){
          minutes = 0;
        }
        if(seconds < 0) {
          seconds = 0;
        }
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        // Time up//
        if(timeDiff <= 0) {
          this.timeUp = true;
          clearInterval(this.countDownTimer);
          this.$router.push({name: 'FinishQuiz'});
          
        }
      }, 1000);
    }
  },
  watch: {
    currentQuestion: function(newValue) {
      console.log(newValue);
    }
  },
  beforeRouteLeave (to, from, next) {
    //console.log(to, from);
    // clearInterval(this.countDownTimer);
    // if(to.name === 'FinishQuiz') {
    //   this.$router.push({ name: 'FinishQuiz' });
    // } else {
    //   console.log('else beforeRoute');
    // }
    Object.assign(this.$data, this.$options.data.call(this));
    this.$root.sharedData.questions = [];
    next();
  },
  beforeRouteEnter(to, from, next) {
    if(from.name === 'Home') {
      next();
    } else {

      next('/');
    }
    
  }
};
</script>

<style>
body {
  overflow-x: hidden;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.timer {
  position: fixed;
  bottom: 10px;
  left: 10px;
  font-size: 1.5rem;
  box-shadow: 0 0 5px 1px #333;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border-radius: 10px;
  padding: 10px;
  z-index: 10;
}

.slide-left {
  animation: slideLeft 0.3s forwards;
}
.slide-right {
  animation: slideRight 0.3s forwards;
}
.slide-left-enter-active {
  animation: slideLeft 0.3s forwards;
}
.slide-left-leave-active {
  animation: slideLeft 0.3s forwards;
}

@keyframes slideLeft {
  from {
    transform: translateX(1000px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slideRight {
  from {
    transform: translateX(-1000px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.question-container {

  width: 100%;
}
.pagination-container {
  position: absolute;
  bottom: 0;
}
#team-name {
  position: absolute;
  top: 0px;
  padding: 20px;
  color: #fff;
  width: 100%;
  text-align: center;
  box-shadow: 0 0 5px 1px #333;
  background: rgba(0, 0, 0, 0.5);
}
.btn-finish {
  position: absolute;
  top: 55px;
}
.btn-nav {
  position: absolute;
  z-index: 10;
  bottom: 5em;
  margin: 5px;
  width: 100px;
}
#btn-next { 
  left: 50%;
}
#btn-prev {
  right: 50%;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
