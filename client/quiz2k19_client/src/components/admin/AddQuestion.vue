<template>
    <div class="main container">
        <div class="loading-indicator" v-if="loading"></div>
        <div class="navbar navbar-light bg-light">
          <h1>Add Question</h1>
        </div>
        <div class="back-button">
            <router-link :to="{name: 'Dashboard'}">&lt;&lt;&nbsp;Go back</router-link>
        </div>
        <form class="form container jumbotron" style="height: 100vh">
            <div class="errors alert alert-dark" v-if="validationErrors.errors.length > 0">
                <div class="error" v-for="error in validationErrors.errors" :key="error.id">
                    {{error}}
                </div>
            </div>
            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label for="title" class="input-group-text">Question</label>
                    </div>
                    <input type="text" class="form-control" v-model="question.title" placeholder="Enter the question" id="title">
                </div>
            </div>
            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label for="title" class="input-group-text">Description (Optional)</label>
                    </div>
                    <textarea class="form-control" v-model="question.description" placeholder="Enter description (optional)" id="description"></textarea>
                </div>
            </div>
            <div class="form-inline">
            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">
                            Options
                        </span>
                    </div>
                <div id="options">
                    <div class="option" v-for="(optionInput, index) in optionInputs" :key="optionInput.id">
                        <input type="text" placeholder="Option" class="option form-control" v-model="optionInput.value">
                        &nbsp;<button type="button" class="btn btn-warning" v-if="optionInputs.length > 2 && index > 1" v-on:click="removeOption(index)">Remove Option </button>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <button class="add-options btn btn-info" v-on:click="addOption">Add another option</button>
            <br>
            <div class="form-group my-2">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label for="answer" class="input-group-text">Answer</label>
                    </div>
                    <select v-model="selectedAnswer" class="form-control">
                    <option disabled value="">Select Answer</option>
                    <option v-for="optionInput in optionInputs" :key="optionInput.id" :value="optionInput.value">{{optionInput.value}}</option>
                </select>
                </div>
            </div>
            <button type="button" class="btn btn-primary my-2" :disabled="loading" v-on:click="submitQuestion" id="addQuestion">Submit</button>
        </form>
    </div>
</template>
<script>
import {HTTP} from '../http-common';

export default {
    name: 'AddQuestion',
    data: function(){
        return {
            question: {
                title: '',
                description: '',
                options: [],
                answer: ''
            },
            optionInputs: [{value: ''}, {value: ''}],
            selectedAnswer: '',
            validationErrors: {errors: []},
            loading: false
        }
    },
    created: function(){
        if(!localStorage.getItem("secret_key")) {
            this.$router.push({name: 'Login'});
        }
    },
    methods: {
        addOption: function(){
            this.optionInputs.push({value: ''});
        },
        removeOption: function(index){
            this.optionInputs.splice(index, 1);
        },
        submitQuestion: function(){
            
            // Set the JSON object to be sent to server
            for(let i=0;i<this.optionInputs.length;i++){
                this.question.options.push(this.optionInputs[i].value);
            }
            this.question.answer = this.selectedAnswer;
            this.question.secret_key = localStorage.getItem('secret_key');

            this.loading = true;
            HTTP.post('/admin/add-question', this.question).then( res =>{
                this.loading = false;
                this.validationErrors.errors = [];
                this.question.options = [];
                if(res.data) {
                    this.validationErrors = res.data;
                } else {
                    this.$router.push({name: 'Dashboard'});
                }
                console.log(res.data);
            }).catch( err =>{
                this.loading = false;
                console.log(err);
            });
            
            
        }
    }
}
</script>

