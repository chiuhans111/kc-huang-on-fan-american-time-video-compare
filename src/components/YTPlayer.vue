<template>
  <div class="video-container" ref="container">
    <div id="player" ref="player"></div>
  </div>
</template>

<script>
import { YTPromise } from "../youtube-iframe-api";

export default {
  name: "App",
  props: ["videoId", "events"],
  data() {
    return {
      YT: null,
      player: null,
      done: false,
    };
  },
  components: {},
  async mounted() {
    this.YT = await YTPromise;

    this.player = new this.YT.Player(this.$refs.player, {
      height: "390",
      width: "640",
      videoId: this.videoId,
      playerVars: {
        playsinline: 1,
      },
      events: this.events,
    });

    window.addEventListener("resize", this.resize);
    this.resize();
  },
  methods: {
    resize() {
      var rect = this.$refs.container.getBoundingClientRect();
      this.player.setSize(rect.width, rect.height);
    },
  },
  unmounted() {
    window.removeEventListener("resize", this.resize);
  },
};
</script>

<style lang='scss' scoped>
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  width: 100%;
  height: 0;
  overflow: hidden;
}
</style>
