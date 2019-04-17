<template>
  <v-ons-card>
    <div class="title">{{mcq.question}}</div>
    <div class="content">
      <v-ons-list>
        <v-ons-list-item tappable>
          <label class="left">
            <v-ons-radio modifier="material" input-id="correct" :value="mcq.response" v-model=" currentResponse"></v-ons-radio>
          </label>
          <label v-if="!mcq.imageMode" for="correct" class="center">{{ mcq.response }}</label>
          <ImagePreview :image-id="mcq.response" v-if="mcq.imageMode"></ImagePreview>
        </v-ons-list-item>
        <v-ons-list-item v-for="(response, $index) in mcq.distractors" :key="$index" tappable>
          <label class="left">
            <v-ons-radio modifier="material"
              :input-id="'radio-' + $index"
              :value="response.value"
              v-model=" currentResponse"
            ></v-ons-radio>
          </label>
          <label :for="'radio-' + $index" class="center" v-if="!mcq.imageMode">{{ response.value }}</label>
          <ImagePreview :image-id="response.value" v-if="mcq.imageMode"></ImagePreview>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
              <v-ons-button @click="validate">Valider</v-ons-button>
          </div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
  </v-ons-card>
</template>

<script>
import ImagePreview from './ImagePreview.vue'
export default {
  data() {
    return {
      currentResponse: ""
    };
  },
  components:{
    ImagePreview
  },
  props: {
    mcq: Object
  },
  computed: {},

  methods: {
    validate() {
    }
  }
};
</script>

<style>
ons-card {
  cursor: pointer;
  color: #333;
}

.card__title,
.card--material__title {
  font-size: 20px;
}
</style>
