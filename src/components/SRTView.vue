<template>
  <div class="container">
    {{ content }}
    <!-- <table>
      <template v-for="(s, i) in srtlist" :key="i">
        <tr>
          <td>{{ s.id }}</td>
          <td>{{ s.start }}</td>
          <td>{{ s.end }}</td>
          <td>{{ s.content }}</td>
        </tr>
      </template>
    </table> -->
  </div>
</template>
<script>
import { parseSRT } from "../srt";
export default {
  props: ["srt", "time"],
  data() {
    return {
      srtlist: [],
    };
  },
  mounted() {
    this.srtlist = parseSRT(this.srt);
  },
  computed: {
    content() {
      for (let s of this.srtlist) {
        if (s.start <= this.time && s.end > this.time) {
          return s.content;
        }
      }
      return ''
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  /* overflow-y: scroll;
  width: 100%;
  height: 300px; */
}
</style>