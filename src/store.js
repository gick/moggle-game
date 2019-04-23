import QRCode from './pages/QRCode.vue'
import GameEnd from './pages/GameEnd.vue'
import Map from './pages/Map.vue'
import Radar from './pages/Radar.vue'
import MediaPage from './pages/MediaPage.vue'
import Question from './pages/Question.vue'
import Folia from './pages/Folia.vue'
import {auth,firestore} from './firebase'
import { vuexfireMutations, firestoreAction } from 'vuexfire'

export default {
  mutations:{
    ...vuexfireMutations
  },
  modules: {
    navigator: {
      strict: true,
      namespaced: true,
      state: {
        stack: [],
        options: {}
      },
      mutations: {
        push(state, page) {
          state.stack.push(page);
        },
        pop(state) {
          if (state.stack.length > 1) {
            state.stack.pop();
          }
        },
        replace(state, page) {
          state.stack.pop();
          state.stack.push(page);
        },
        reset(state, page) {
          state.stack = [page || state.stack[0]];
        },
        options(state, newOptions = {}) {
          state.options = newOptions;
        }
      }
    },

    splitter: {
      strict: true,
      namespaced: true,
      state: {
        open: false
      },
      mutations: {
        toggle(state, shouldOpen) {
          if (typeof shouldOpen === 'boolean') {
            state.open = shouldOpen;
          } else {
            state.open = !state.open;
          }
        }
      }
    },
    users:{
      strict:true,
      namespaced:true,
      state:{
        users:[],
        id:'',
        email:'',
        socketID:''
      },
      mutations:{
        setUser(state,payload){
          state.id=payload.uid
          state.email=payload.email
        },
        logout(state){
          state.id=''
          state.email=''
        },
        setSocketID(state,socketID){
          state.socketID=socketID
        }

      },
      actions:{        
      bindTodos: firestoreAction(({ bindFirestoreRef }) => {
        // return the promise returned by `bindFirestoreRef`
        console.log('test')
        return bindFirestoreRef('users', firestore.collection('users'))
      }),
      
      

    }},
    activities: {
      strict: true,
      namespaced: true,

      state: {
        activities: [],
        currentActivity: {},
        unitGameIndex: 0,
        pages: [],
        userId:'',
        startActivity: false,
        currentPage: 0,
        score:0,
        test:[],
        foliaData:{}
      },
      mutations: {
        set(state, activities) {
          state.activities = activities
        },
        addScore(state,point){
          state.score=state.score+point
        },
        nextPage(state) {
          state.currentPage++
        },
        nextUnitGame(state) {
          state.unitGameIndex++
        },
        endGame(state) {
          state.startActivity = false
          state.pages = []
          state.currentPage = 0
          state.currentUnitGame = 0
          state.unitGameIndex=0
        },
        setCurrentActivity(state, activity) {
          state.currentActivity = activity
          state.pages = []
          if (state.unitGameIndex == 0) {
            if (state.currentActivity.startpage) {
              state.pages.push({
                page: MediaPage,
                data: {
                  page: state.currentActivity.startpage
                }
              })
            }
          }

          let currentUnitGame = activity.unitgameActivities[state.unitGameIndex]
          if (currentUnitGame.startMedia) {
            state.pages.push({
              page: MediaPage,
              data: {
                page: currentUnitGame.startMedia
              }
            })
          }
          if (currentUnitGame.POI) {
            if (currentUnitGame.poiGuidance == 'qr') {
              state.pages.push({
                page: QRCode,
                data: {
                  id: currentUnitGame.POI._id
                }
              })
            }
            if (currentUnitGame.poiGuidance == 'radar') {
              state.pages.push({
                page: Radar,
                data: {
                  poi: currentUnitGame.POI
                }
              })
            }

            if (currentUnitGame.poiGuidance == 'map') {
              state.pages.push({
                page: Map,
                data: {
                  poi: currentUnitGame.POI
                }
              })
            }
          }
          if (currentUnitGame.mcqActivities.length || currentUnitGame.freetextActivities.length) {
            state.pages.push({
              page: Question,
              data: {
                mcq: currentUnitGame.mcqActivities,
                freetext: currentUnitGame.freetextActivities
              }
            })

          }
          if(currentUnitGame.foliaActivities){
            state.foliaData=currentUnitGame.foliaActivities
            state.pages.push({
              page:Folia,
              data:{
                data:{}
              }
            })
          }
          if (currentUnitGame.feedbackMedia) {
            state.pages.push({
              page: MediaPage,
              data: {
                page: currentUnitGame.feedbackMedia
              }
            })
          }
          if (state.currentActivity.unitgameActivities.length == state.unitGameIndex) {

            state.pages.push({
              page: GameEnd,
              data: {}
            })
          }
          state.currentPage = 0
          state.startActivity = true
        },
      },
      actions: {
        nextPage({
          commit,
          state
        }) {
          if (state.currentPage == state.pages.length - 1) {
            if (state.currentActivity.unitgameActivities.length - 1 > state.unitGameIndex) {
              commit('nextUnitGame')
              commit('setCurrentActivity', state.currentActivity)
            } else {
              commit('endGame')
              commit('navigator/reset', null, {
                root: true
              })
            }
          } else {
            commit('nextPage')
          }
        },

      }
    },
    tabbar: {
      strict: true,
      namespaced: true,
      state: {
        index: 1
      },
      mutations: {
        set(state, index) {
          state.index = index;
        }
      }
    }
  }
};