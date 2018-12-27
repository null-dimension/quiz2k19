<template>
    <div style="height: 100vh;" class="main container my-2">
        <h1>LIVE SCORE</h1>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Rank #</th>
                    <th scope="col">Team Name</th>
                    <th scope="col">Points</th>
                </tr>
            </thead>
            <tbody v-if="teams.length > 0">
                <tr class=" table-secondary" v-for="(team, index) in teams" :key="team.id" :class="{'table-danger':index==0, 'table-warning': index==1, 'table-info': index==2}">
                    <th scope="row">{{index + 1}}</th>
                    <td>{{team.name}}</td>
                    <td>{{team.points}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>

export default {
    name: 'LiveScore',
    data: function(){
        return {
            teams: []
        }
    },
    sockets: {
        connect: function(){
            console.log('Connected to live-score');
        },
        disconnect: function(){
            console.log('Disconnected from live-score');
        },
        liveScore: function(data){
            this.teams = data;
        }
    }
}
</script>

