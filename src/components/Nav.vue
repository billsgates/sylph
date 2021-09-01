<template>
  <div id="nav">
    <img :src="logo" @click="goToHomePage()" class="nav-home-btn" />
    <div v-if="currentPage != '/'" class="nav-right-container">
      <div class="globe">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 0 24 24"
          width="36px"
          fill="#C4C4C4"
          @click="changeLang()"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z"
          />
        </svg>
      </div>
      <div class="nav-profile-btn">
        <a-dropdown
          :disabled="currentPage.toLowerCase() == '/Login'.toLowerCase() || currentPage.toLowerCase() == '/SignUp'.toLowerCase()"
        >
          <img :src="user" />
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="goToProfilePage()">{{ $t(`settings`) }}</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="logout()">{{ $t(`logout`) }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <div v-else class="nav-right-auth-container">
      <div class="globe">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="36px"
          viewBox="0 0 24 24"
          width="36px"
          fill="#C4C4C4"
          @click="changeLang()"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z"
          />
        </svg>
      </div>
      <div class="nav-auth-btn">
        <div class="btn-auth btn-login" @click="login()">
          {{ $t(`log_in`) }}
        </div>
        <div class="btn-auth btn-signup" @click="signup()">
          {{ $t(`sign_up`) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globe from "../assets/globe.png";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
export default {
  props: {
    currentPage: { type: String, default: "" },
  },
  data() {
    return {
      globe,
      logo,
      user,
    };
  },
  methods: {
    logout() {
      if (localStorage.getItem("token")) {
        localStorage.clear();
        this.$router.push("/");
      } else {
        this.$router.push("/Login");
      }
    },
    goToHomePage() {
      if (localStorage.getItem("token")) {
        this.$router.push("/Main");
      }
    },
    goToProfilePage() {
      if (localStorage.getItem("token")) {
        this.$router.push("/Profile");
      } else {
        this.$router.push("/Login");
      }
    },
    changeLang() {
      const lang = localStorage.getItem("lang");
      let newLang = "enUS";
      if (lang == null || lang.toLowerCase() == "enUS".toLowerCase()) {
        newLang = "zhTW";
      }
      this.$i18n.locale = newLang;
      if (
        localStorage.getItem("lang") == null ||
        localStorage.getItem("lang") != newLang
      ) {
        localStorage.setItem("lang", newLang);
      }
    },
    login() {
      this.$router.push("/Login");
    },
    signup() {
      this.$router.push("/SignUp");
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../ant-design-vue/dist/antd.less";
#nav {
  height: 60px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
  position: fixed;
  z-index: 200;
  top: 0px;
  left: 0px;
  width: 100%;
  margin-bottom: 60px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.nav-home-btn {
  width: 150px;
  font-size: 30px;
  color: #c4c4c4;
  margin-left: 8%;
  cursor: pointer;
}
.nav-logo {
  /* margin-left: 130px; */
  font-size: 30px;
}
.nav-right-container,
.nav-right-auth-container {
  width: 22%;
  min-width: 220px;
  margin-right: 8%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  // background-color: black;
  .globe {
    width: 36px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    svg {
      width: 30px;
      cursor: pointer;
    }
  }

  .nav-profile-btn,
  .nav-auth-btn {
    width: 90%;
    height: 30px;
    border-radius: 100%;
    // background-color: #e0e0e0;
    cursor: pointer;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    img {
      width: 32px;
      height: 32px;
    }
  }
  .nav-profile-btn {
    width: 35px;
  }
  .nav-auth-btn {
    .btn-auth {
      width: 120px;
      height: 30px;
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
      border: @my-grey-1 1px solid;
      border-radius: 50px;
      color: black;
    }
    .btn-login {
      margin-right: 18px;
    }
    .btn-signup {
      background-color: @primary-color;
      border-color: @primary-color;
    }
  }
}
.nav-right-container {
  width: 7%;
  min-width: 75px;
}
@media screen and (max-width: 720px) {
  .nav-home-btn {
    width: 100px;
  }

  .nav-right-container {
    .globe {
      width: 32px;
      margin-right: 0px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      svg {
        width: 30px;
      }
    }
  }
  .nav-right-auth-container {
    min-width: 180px;
    .globe {
      width: 30px;
      margin-right: 0px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      svg {
        width: 24px;
        cursor: pointer;
      }
    }
    .nav-auth-btn {
      width: 80%;

      .btn-login {
        margin-right: 10px;
      }
      .btn-auth {
        width: 70px;
        height: 30px;
        font-size: 12px;
      }
    }
  }
}
</style>
