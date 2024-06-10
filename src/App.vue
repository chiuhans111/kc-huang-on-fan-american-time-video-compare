<template>
  <div style="max-width:1920px; margin:auto">
    <div>
      <h1>影片剪輯段落視覺化比較工具</h1>
      <p>只有 Master 影片可以用來拉時間軸，目前 Master 影片為：{{ master }}</p>
    </div>
    <div class="row">
      <div>
        <h3 :class="{ highlight: master == 1 }">1</h3>
        <button @click="master = 1">Set Master</button>
        <YTPlayer
          videoId="yfwXL_sJTlI"
          ref="player1"
          :events="events(1)"
        ></YTPlayer>
        <SRTView :srt="srt1" :time="t1"></SRTView>
      </div>
      <div>
        <h3 :class="{ highlight: master == 2 }">2</h3>
        <button @click="master = 2">Set Master</button>
        <YTPlayer
          videoId="ymR6Ed5f2aQ"
          ref="player2"
          :events="events(2)"
        ></YTPlayer>
        <SRTView :srt="srt2" :time="t2"></SRTView>
      </div>
    </div>
    <div>
      <h3>Timeline: (top:2, bottom:1)</h3>
      <p>
        2= {{ Math.floor(t2 / 60 / 60) }}:{{ Math.floor(t2 / 60) % 60 }}:{{
          Math.floor(t2 % 60)
        }}
      </p>
      <canvas width="800" height="125" ref="timeline"></canvas>
      <p>
        1= {{ Math.floor(t1 / 60 / 60) }}:{{ Math.floor(t1 / 60) % 60 }}:{{
          Math.floor(t1 % 60)
        }}
      </p>
    </div>
    <div>
      <p>
        GitHub Repository:
        <a
          href="https://github.com/chiuhans111/kc-huang-on-fan-american-time-video-compare"
          >https://github.com/chiuhans111/kc-huang-on-fan-american-time-video-compare</a
        >
      </p>
    </div>
  </div>
</template>

<script>
import YTPlayer from "./components/YTPlayer.vue";
import { f, g } from "./video-sync";
import "./srt";
import SRTView from "./components/SRTView.vue";
import srt1 from "!raw-loader!./data/1.srt";
import srt2 from "!raw-loader!./data/2.srt";
export default {
  name: "App",
  components: { YTPlayer, SRTView },
  data() {
    return {
      master: 1,
      alive: true,
      ready: [false, false],
      srt1,
      srt2,
      t1: 0,
      t2: 0,
    };
  },
  mounted() {
    console.log(this.$refs.player1);
  },

  methods: {
    getPlayers(ref) {
      return {
        1: [this.$refs.player1, this.$refs.player2],
        2: [this.$refs.player2, this.$refs.player1],
      }[ref];
    },
    events(ref) {
      var vm = this;
      return {
        onReady(event) {
          var players = vm.getPlayers(ref);
          console.log("ready", players[0].player, event);
          vm.ready[ref - 1] = true;
          if (vm.ready.every((x) => x)) {
            console.log("both player loaded");
            vm.update();
          }
        },

        onStateChange(event) {
          var players = vm.getPlayers(ref);
          console.log("state", ref, event);

          if (ref == vm.master) {
            if (event.data == players[0].YT.PlayerState.PLAYING) {
              // vm.master = ref;
              players[1].player.playVideo();
            }

            if (event.data == players[0].YT.PlayerState.PAUSED) {
              // vm.master = ref;
              players[1].player.pauseVideo();
            }

            if (event.data == players[0].YT.PlayerState.ENDED) {
              players[1].player.stopVideo();
            }
          }
        },

        onPlaybackRateChange(event) {
          var players = vm.getPlayers(ref);
          players[1].player.setPlaybackRate(event.data);
          console.log("playback rate change", ref, event);
        },
      };
    },
    update() {
      if (!this.alive) return;
      var players = this.getPlayers(1);
      this.t1 = players[0].player.getCurrentTime();
      this.t2 = players[1].player.getCurrentTime();

      // for master
      players = this.getPlayers(this.master);
      if (players[0] == null) return;
      if (players[1] == null) return;

      var t1 = players[0].player.getCurrentTime();
      var state1 = players[0].player.getPlayerState();
      var t2 = players[1].player.getCurrentTime();
      var state2 = players[1].player.getPlayerState();

      var tt = f(this.master, t1);

      g(this.master, t1, t2, this.$refs.timeline);

      if (tt === null) {
        players[1].player.pauseVideo();
      } else {
        if (Math.abs(t2 - tt) > 0.1) {
          players[1].player.seekTo(tt);
        }

        if (state2 !== state1) {
          if (state1 == players[0].YT.PlayerState.PLAYING) {
            players[1].player.playVideo();
          }
        }
      }

      if (state1 == players[0].YT.PlayerState.PAUSED) {
        players[1].player.pauseVideo();
      }

      if (state1 == players[0].YT.PlayerState.ENDED) {
        players[1].player.stopVideo();
      }

      setTimeout(() => {
        this.update();
      }, 500);
    },
  },
  beforeUnmount() {
    this.alive = false;
    console.log("kill");
  },
};
</script>

<style lang='scss'>
html {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.row {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  div {
    width: 50%;
  }

  @media (max-width: 900px) {
    div {
      width: 100%;
    }
  }
}

.highlight{
  color: red;
}
</style>
