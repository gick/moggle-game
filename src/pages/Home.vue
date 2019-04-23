<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item @click="startActivity(activity)" v-for="(activity, index) in activityList" :key="index">
        <div class="center">{{activity.label}}</div>

      </v-ons-list-item>
    </v-ons-list>
    <v-ons-button @click="authenticate">Auth</v-ons-button>
    <v-ons-button @click="bind">Bind</v-ons-button>
  </v-ons-page>
</template>

<script>

export default {
  data () {
    return {
    };
  },
  computed:{
    activityList(){
      return this.$store.state.activities.activities
    }
  },
  sockets:{
      setID(socketID){
        this.$store.commit('users/setSocketID',socketID)
      }
  },
  methods: {
    startActivity(activity){
      this.$store.commit('activities/setCurrentActivity',activity)
    },
    authenticate(){
      this.$store.dispatch('activities/authenticate')
    }
    ,
    bind(){
      this.$store.dispatch('user/bindTodos')
    },
    push(page, key) {
      this.$store.commit('navigator/push', {
        extends: page,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'Home',
              title: key
            }
          }
        }
      });
    }
  }
};
</script>

<style>
.intro {
  text-align: left;
  padding: 0 22px;
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, .54);
}

ons-card {
  cursor: pointer;
  color: #333;
}

.card__title, .card--material__title {
  font-size: 20px;
}
</style>
