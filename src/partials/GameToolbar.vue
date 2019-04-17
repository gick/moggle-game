<template>
  <v-ons-toolbar>
    <div class="center">
      <slot>{{ title }}</slot>
    </div>
    <div class="right">
      <v-ons-toolbar-button id="info-button" @click="popoverVisible = true">
        <v-ons-icon icon="md-more-vert"></v-ons-icon>
      </v-ons-toolbar-button>
    </div>
    <v-ons-popover
      cancelable
      direction="down"
      cover-target
      target="#info-button"
      :visible.sync="popoverVisible"
    >
      <v-ons-list>
        <v-ons-list-item
          tappable
          v-for="(page,index) in pages"
          @click="setPage(page.page)"
          :key="index"
          :modifier="md ? 'nodivider' : 'longdivider'"
        >
          <div class="center">{{ page.label }}</div>
        </v-ons-list-item>
      </v-ons-list>
    </v-ons-popover>
  </v-ons-toolbar>
</template>

<script>
import Score from "../pages/Score.vue";
import Inventory from "../pages/Inventory.vue";

export default {
  props: ["title"],
  data() {
    return {
      popoverVisible: false,
      pages: [
        { label: "Score", page: Score },
        { label: "Inventaire", page: Inventory },
        { label: "Quitter le jeu", page: null }
      ]
    };
  },
  methods: {
    setPage(page) {
      this.popoverVisible = false;
      if (page == null) {
        this.$store.commit("activities/endGame");
        this.$store.commit("navigator/pop");
        return;
      }
      this.$store.commit("navigator/push", {
        extends: page
      });
    }
  }
};
</script>
