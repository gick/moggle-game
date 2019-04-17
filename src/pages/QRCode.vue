<template>
  <v-ons-page>
    <game-toolbar title="QR code"></game-toolbar>
    <p>Prendre en photo un QR-code</p>
    <picture-input
      ref="pictureInput"
      width="600"
      height="600"
      margin="16"
      :crop="false"
      accept="image/jpeg, image/png"
      size="10"
      button-class="btn"
      :custom-strings="{
        upload: '<h1>Bummer!</h1>',
        drag: 'Drag a 😺 GIF or GTFO'
      }"
      @change="onChange"
    ></picture-input>
    <v-ons-card>Prendre en photo un QR Code</v-ons-card>
    <v-ons-card v-show="noQR">
      <p>Le QR code n'a pas été reconnu, merci de réessayer</p>
    </v-ons-card>
    <v-ons-card v-show="incorrectQR">
      <p>Le QR code n'est pas correct, merci de réessayer</p>
    </v-ons-card>
    <v-ons-card v-show="correctQR">
      <p>Bravo vous avez scanné le bon QR code</p>
      <v-ons-button @click="next">Suivant</v-ons-button>
    </v-ons-card>
          <v-ons-button @click="next">Suivant</v-ons-button>

  </v-ons-page>
</template>

<script>
import PictureInput from "vue-picture-input";
import axios from "axios";
export default {
  data() {
    return {
      id: "",
      noQR: false,
      incorrectQR: false,
      correctQR: false
    };
  },
  components: {
    PictureInput
  },
  computed: {},

  methods: {
    next() {
      this.$store.dispatch("activities/nextPage");
    },
    onChange() {
      this.noQR=false
      this.incorrectQR=false
      this.correctQR=false
      var formData = new FormData();

      let file = this.$refs.pictureInput.file;
      formData.append("files", file);

      axios
        .post("http://localhost:8080/qrScan", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(function(response) {
          if (response.data.length == 0) {
            this.noQR=true
            return
          }
          if(response.data[0]==this.id){
            this.correctQR=true
          } else
          {
            this.incorrectQR=true
          }
        }.bind(this));
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
