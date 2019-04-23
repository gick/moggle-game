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
import axios from "axios";
export default {
  beforeCreate() {

    this.$store.commit("navigator/push", AppSplitter);
    axios.get("http://localhost:8080/listActivities").then(
      function(response) {
        this.$store.commit("activities/set", response.data);
      }.bind(this)
    );
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
          extends: currentPage.page,
          data() {
            return currentPage.data;
          }
        });
      }else{
        this.activity=false
      }
    },
    currentPage: function(pageNumber) {
      if(this.activity){
      let pageIndex = this.$store.state.activities.currentPage;
      let currentPage = this.$store.state.activities.pages[pageIndex];
      this.$store.commit("navigator/push", {
        extends: currentPage.page,
        data() {
          return currentPage.data;
        }
      });
    }}
  },
  computed: {
    currentPage() {
      return this.$store.state.activities.currentPage;
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
