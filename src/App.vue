<template>
  <Index/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Index from "@/pages";

@Options({
  components: {
    Index
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*{
  padding:0;
  margin: 0;
}
</style>
