<template>
  <v-ons-page>
    <game-toolbar title="Folia"></game-toolbar>
    <div class="background"></div>
    <div class="content" style>
      {{data}}
      <v-ons-card>
        <div class="title">{{foliaData.question}}</div>
        <div class="content">
          <p>Prenez une photo de feuille puis réaliser un tracé à l'intérieur de la feuille</p>
          <FileUpload @image="setImage"></FileUpload>
          <v-ons-button @click="restart" v-if="foliaResult.length">Nouvelle identification</v-ons-button>
          <v-ons-button @click="next">Suivant</v-ons-button>
        </div>
      </v-ons-card>
      <v-ons-cars v-if="successVisible">
        <div class="title">Résultat : {{foliaData.correctMessage}}</div>
      </v-ons-cars>
      <v-ons-cars v-if="failedVisible">
        <div class="title">Résultat : {{foliaData.wrongMessage}}</div>
      </v-ons-cars>

      <v-ons-card v-if="foliaStarted">
        <div class="title">Identification via Folia</div>
        <div class="content">
          <div style="position:relative;">
            <p>
              <v-ons-progress-bar :value="currentStep"></v-ons-progress-bar>
            </p>
          </div>
          <v-ons-list v-if="foliaResult.length">
            <v-ons-list-header>Résultats</v-ons-list-header>
            <v-ons-list-item v-for="(specieResult, index) in foliaResult" :key="index">
              <div class="left"></div>
              <div class="center">{{specieResult.specie}} {{specieResult.result}}%</div>
            </v-ons-list-item>
          </v-ons-list>
        </div>
      </v-ons-card>
      <v-ons-modal :visible="modalVisible">
        <div style="position:relative;">
          <img
            ref="image"
            :src="imageData"
            @load="imageLoaded"
            style="max-height: 100vh;max-width: 100vw;"
          >
          <VueSignaturePad
            :options="{dotSize:5,minWidth:15,maxWidth:15,penColor:'rgb(0,125,0)',onBegin}"
            :width="width"
            :height="height"
            ref="signaturePad"
            style="position:absolute;top:0;left: 0;right: 0;margin: auto;"
          ></VueSignaturePad>
        </div>
        <p>Réalisez un tracé à l'intérieur de la feuille puis valider</p>
        <v-ons-button
          style="position: absolute;left: 0;right: 0;bottom: 1px"
          :disabled="!draw"
          @click="sendImages"
        >Valider</v-ons-button>
      </v-ons-modal>

      <div style="position:relative"></div>
    </div>
  </v-ons-page>
</template>

<script>
import VueSignaturePad from "vue-signature-pad";
import FileUpload from "../components/FileUpload.vue";
import axios from "axios";

import { Promise } from "q";
export default {
  data() {
    return {
      imageData: "",
      width: "0",
      height: "0",
      currentStep: 0,
      foliaStarted: false,
      foliaResult: [],
      draw: false,
      modalVisible: false,
      successVisible: false,
      failedVisible: false
    };
  },
  components: {
    VueSignaturePad,
    FileUpload
  },
  sockets: {
    connect: function(socket) {
      console.log(this.data);
    },
    foliaProgress: function(data) {
      this.currentStep = this.currentStep + 4;
    },
    foliaResult: function(data) {
      let success = false;
      let result = false;
      for (let specieResult of data) {
        let specie = specieResult.split(",")[0].replace(/([A-Z])/g, " $1");
        let result = Math.ceil(Number(specieResult.split(",")[1]));
        this.foliaResult.push({ specie: specie.trim(), result: result });
      }
      for (let target of this.foliaData.targetSpecies) {
        let findTarget = this.foliaResult.find(
          value => value.specie == target.label
        );
        if (findTarget) {
          result = true;
        }
      }
      if (result) {
        this.successVisible = true;
      } else {
        this.failedVisible = true;
      }
    }
    //  setID(socketID) {
    //    this.socketID = socketID;
    //  }
  },
  computed: {
    socketID() {
      return this.$store.state.users.socketID;
    },
    foliaData() {
      return this.$store.state.activities.foliaData;
    }
  },
  methods: {
    next() {
      this.$store.dispatch("activities/nextPage");
    },
    onBegin() {
      this.draw = true;
    },
    restart() {
      this.imageData = "";
      this.$refs.signaturePad.clearSignature();
      this.width = "0";
      this.height = "0";
      this.foliaStarted = false;
      this.foliaResult = [];
      this.currentStep = 0;
      this.draw = false;
    },
    imageLoaded() {
      this.modalVisible = true;
      this.$refs.signaturePad.resizeCanvas();
      this.$nextTick(() => {
        this.width = this.$refs.image.clientWidth + "px";
        this.height = this.$refs.image.clientHeight + "px";
        this.$nextTick(() => {
          this.$refs.signaturePad.resizeCanvas();
        });
      });
      console.log("imageLoaded");
    },
    resizedataURL(datas, wantedWidth, wantedHeight, type) {
      return new Promise(function(resolve, reject) {
        // We create an image to receive the Data URI
        var img = document.createElement("img");

        // When the event "onload" is triggered we can resize the image.
        img.onload = function() {
          // We create a canvas and get its context.
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");

          // We set the dimensions at the wanted size.
          canvas.width = wantedWidth;
          canvas.height = wantedHeight;

          // We resize the image with the canvas method drawImage();
          ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

          var dataURI = canvas.toDataURL(type);
          resolve(dataURI);
          /////////////////////////////////////////
          // Use and treat your Data URI here !! //
          /////////////////////////////////////////
        };

        // We put the Data URI in the image's src attribute
        img.src = datas;
      });
    },

    sendImages() {
      this.modalVisible = false;
      let { status, data } = this.$refs.signaturePad.saveSignature();
      this.foliaStarted = true;
      this.resizedataURL(
        data,
        Number(this.width.replace("px", "")),
        Number(this.height.replace("px", "")),
        "image/png"
      ).then(dataURI => {
        this.resizedataURL(
          this.imageData,
          Number(this.width.replace("px", "")),
          Number(this.height.replace("px", "")),
          "image/jpeg"
        ).then(imageData => {
          axios.post("http://localhost:8080/setupImages", {
            trace: dataURI,
            leaf: imageData,
            socketID: this.socketID
          });
        });
      });
    },
    setImage(imageData) {
      this.imageData = imageData;
    },
    transition(releve) {
      this.$store.commit("navigator/push", {
        extends: Releve,
        data() {
          return {
            releve: releve,
            visualize: true
          };
        }
      });
    }
  }
};
</script>