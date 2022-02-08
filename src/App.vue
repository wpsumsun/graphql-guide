<template>
  <div id="app">
    <button @click="getLaunchByFlightNumber(1)">Click me</button>
     <table>
       <thead>
        <th>mission_name</th>
        <th>launch_year</th>
       </thead>
       <tbody>
        <tr v-for="item in list" :key="item.mission_name">
          <td>{{ item.mission_name }}</td>
          <td>{{ item.launch_year }}</td>
        </tr>
       </tbody>
     </table>
  </div>
</template>

<script>
import gql from 'graphql-tag';

const navListGql=gql`{
 launches {
    flight_number
    mission_name
    launch_year
    rocket {
      rocket_id
      rocket_name
      rocket_type
    }
  }
}`;

const getLaunchByFlightNumber = gql`
  query getLaunchByFlightNumber($flight_number: Int!) {
    launch(flight_number: $flight_number) {
      flight_number
      mission_name
      launch_year
      rocket {
        rocket_id
        rocket_name
        rocket_type
      }
    }
  }`

export default {
  name: 'App',
  data() {
    return {
      list: [],
    }
  },
  created() {
    this.getLaunches();
  },
  methods: {
    getLaunches(){
      this.$apollo.addSmartQuery('launches', {
        query:navListGql,
        result (res) {
          console.log("getLaunches", res)
          this.list = res.data.launches;
        },
        // 错误处理
        error (error) {
          console.error('We\'ve got an error!', error)
        }
      });
    },
    getLaunchByFlightNumber(flight_number){
      this.$apollo.addSmartQuery('launch', {
        query:getLaunchByFlightNumber,
        variables:{
          flight_number
        },
        result (res) {
          console.log("getLaunchByFlightNumber", res)
        },
        // 错误处理
        error (error) {
          console.error('We\'ve got an error!', error)
        }
      });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
