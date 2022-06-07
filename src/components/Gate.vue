<template>
  <div id="gate">
    <div class="title-container">
      <transition name="slide1">
        <div v-if="isShow" class="title">Split Bills,</div>
      </transition>
      <transition name="slide2">
        <div v-if="isShow" class="title">Remind Interval,</div>
      </transition>
      <transition name="slide3">
        <div v-if="isShow" class="title">Match Members,</div>
      </transition>
      <transition name="slide4">
        <div v-if="isShow" class="title pink">
          for Shared Plan on Digital Services
        </div>
      </transition>
    </div>
    <transition name="drop">
      <img v-if="isShow" :src="banner" />
    </transition>
  </div>
</template>

<script>
import banner from "../assets/banner.png";
export default {
  data() {
    return {
      banner,
      isShow: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.isShow = true;
    });
  },
};
</script>

<style scoped>
#gate {
  width: 100%;
  font-family: "Montserrat", sans-serif;
}
img {
  width: 32.5vw;
  min-width: 400px;
  position: absolute;
  top: 60px;
  right: 17%;
  background-color: white;
  opacity: 1;
}
.title-container {
  position: absolute;
  top: 28%;
  left: 18.5%;
  z-index: 1;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.title {
  font-weight: bold;
  font-size: 34px;
  left: -200px;
  opacity: 1;
  transform: translateX(0);
  color: #000000;
}
.pink {
  color: rgb(243, 178, 172);
}

.slide1-enter-active {
  transition: transform 0.5s;
}
.slide1-enter {
  opacity: 0;
  transform: translateX(-200%);
}
.slide2-enter-active {
  transition: transform 0.8s;
}
.slide2-enter {
  opacity: 0;
  transform: translateX(-200%);
}
.slide3-enter-active {
  transition: transform 1.1s;
}
.slide3-enter {
  opacity: 0;
  transform: translateX(-200%);
}
.slide4-enter-active {
  transition: transform 1.4s;
}
.slide4-enter {
  opacity: 0;
  transform: translateX(-200%);
}
.drop-enter-active {
  transition: opacity 2s;
}
.drop-enter {
  opacity: 0;
}

@media screen and (max-width: 935px) {
  img {
    right: 16%;
  }
  .title-container {
    top: 32%;
    left: 14%;
    height: 140px;
  }
  .title {
    font-size: 20px;
  }
}
@media screen and (max-width: 768px) {
  img {
    top: 25%;
    right: 13%;
    width: 375px;
    min-width: 375px;
  }
  .title-container {
    top: 40%;
    left: 13%;
    height: 150px;
  }
}
@media screen and (max-width: 720px) {
  img {
    top: 60px;
    right: 0;
    width: 300px;
    min-width: 0px;
  }
  .title-container {
    top: 40%;
    left: 10%;
    height: 180px;
  }
  .title {
    font-size: 24px;
  }
}
/* only for iphone 5 */
@media screen and (max-width: 320px) {
  img {
    top: 60px;
    right: 0;
    width: 260px;
    min-width: 0px;
  }
  .title-container {
    top: 43%;
    left: 10%;
    height: 180px;
  }
  .title {
    font-size: 22px;
  }
}
/* only for ipad pro */
@media screen and (width: 1024px) and (height: 1366px) {
  img {
    top: 20%;
    right: 13%;
    width: 470px;
    min-width: 375px;
  }
  .title-container {
    top: 50%;
    left: 13%;
    height: 200px;
  }
  .title {
    font-size: 30px;
  }
}
</style>
