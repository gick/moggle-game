<template>
  <v-ons-page>
    <game-toolbar title="Information"></game-toolbar>
    {{page}}
    <v-ons-card>
      <vue-simple-markdown :source="page.mkdown"></vue-simple-markdown>
    </v-ons-card>
    <v-ons-button @click="next">Suivant</v-ons-button>
  </v-ons-page>
</template>

<script>
export default {
  data() {
    return {
      page: {}
    };
  },
  computed: {},

  methods: {
    next() {
      this.$store.dispatch("activities/nextPage");
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
  color: rgba(0, 0, 0, 0.54);
}

ons-card {
  cursor: pointer;
  color: #333;
}

.card__title,
.card--material__title {
  font-size: 20px;
}
</style>
