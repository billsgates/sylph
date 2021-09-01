<template>
  <div id="app">
    <Nav :currentPage="currentPage" class="app-nav" />
    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Nav from "./components/Nav";
export default {
  name: "App",
  components: {
    Nav,
  },
  data() {
    return {
      islogin: false,
      hasaccout: true,
      isRouterAlive: true,
      currentPage: "",
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
  },
  updated() {
    if (this.$route.name) {
      this.currentPage = this.$route.name;
    }
    // console.log("updated", this.$route.name);
  },
  mounted() {
    if (this.$route.name) {
      this.currentPage = this.$route.name;
    }
  },
};
</script>

<style>
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.main-container {
  padding: 8%;
  padding-top: 80px;
  width: 100%;
}
@media screen and (max-width: 768px) {
  .main-container {
    padding: 35px;
    padding-top: 80px;
    width: 100%;
  }
}
</style>
