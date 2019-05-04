<template>
  <v-ons-navigator
    swipeable
    swipe-target-width="50px"
    :page-stack="pageStack"
    :pop-page="storePop"
    :options="options"
    :class="{ 'border-radius': borderRadius }"
  ></v-ons-navigator>
</template>

<script>
import AppSplitter from "./AppSplitter.vue";
import GameToolBar from "./partials/GameToolbar.vue";
import axios from "axios";
export default {
  beforeCreate() {

    this.$store.commit("navigator/push", AppSplitter);
  },
  data() {
    return {
      shutUp: this.md,
      activity:false
    };
  },
  watch: {
    startActivity: function(activity) {
      if (activity) {
        this.activity=true
        let pageIndex = this.$store.state.activities.currentPage;
        let currentPage = this.$store.state.activities.pages[pageIndex];
        this.$store.commit("navigator/push", {
          extends: GameToolBar,
          data() {
            return {};
          }
        });
      }else{
        this.setBadge()
      }
    },
  },
  computed: {
    userBadge(){
      return this.$store.state.activities.badge;
    },
    allBadge(){
      return this.$store.state.users.badges
    },
    startActivity() {
      return this.$store.state.activities.startActivity;
    },
    pageStack() {
      return this.$store.state.navigator.stack;
    },
    options() {
      return this.$store.state.navigator.options;
    },
    borderRadius() {
      return new URL(window.location).searchParams.get("borderradius") !== null;
    }
  },
  methods: {
    setBadge(){
      if(this.userBadge){
        let index=this.allBadge.find(val=>val._id==this.userBadge._id)
        if(index==-1){
        this.$toasted.show('Vous avez gagné un badge en complétant ce jeux!',{ duration: 3000,position:'bottom-center',theme:'bubble' } )
        this.$store.dispatch('activities/setBadge')
        }
        else{
         this.$toasted.show('Vous possedez déjà le badge de ce jeu!',{ duration: 3000,position:'bottom-center',theme:'bubble' } )
        }
      }
    },
    storePop() {
      this.$store.commit("navigator/pop");
    },
    showPopTip() {
      !this.shutUp &&
        this.$ons.notification
          .toast({
            message: "Try swipe-to-pop from left side!",
            buttonLabel: "Shut up!",
            timeout: 2000
          })
          .then(i => (this.shutUp = i === 0));
    }
  }
};
</script>
