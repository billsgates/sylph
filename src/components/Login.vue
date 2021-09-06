<template>
  <div id="login">
    <div class="l-block-container">
      <!-- <a-button class="google-login" block @click="googleLogin()">
        <a-icon type="google" />
        {{ $t(`google_login`) }}
      </a-button> -->

      <a-form :form="form" hasFeedback :style="{ radius: '2px' }">
        <div class="l-form-item">
          <p>{{ $t(`email`) }}</p>
          <a-form-item>
            <a-input
              v-decorator="[
                'email',
                {
                  rules: [
                    {
                      type: 'email',
                      message: $t(`account_should_be_email`),
                    },
                    {},
                  ],
                },
              ]"
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
        </div>
        <div class="l-form-item">
          <p>{{ $t(`password`) }}</p>
          <a-form-item>
            <a-input-password
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      message: $t(`password_is_required`),
                    },
                  ],
                },
              ]"
            >
            </a-input-password>
          </a-form-item>
        </div>
        <p v-if="showWarning" class="l-warning">{{ $t(`login_failed`) }}</p>
        <div class="l-center-container">
          <!-- <p style="color:#1890FF">
            {{ $t(`forgot_password`) }}
          </p> -->
        </div>
        <div class="l-center-container">
          <a-space algin="baseline">
            <div class="remind-text">{{ $t(`dont_have_an_account`) }}</div>
            <a-button
              type="link"
              @click="goToSignUp()"
              style="color:#1890FF; padding-left:0px; padding-right:0px"
            >
              {{ $t(`sign_up`) }}
            </a-button>
          </a-space>
        </div>
        <div class="l-btn-container">
          <a-button
            class="btn-primary"
            key="add Room"
            type="primary"
            @click="postLogin()"
          >
            {{ $t(`log_in`) }}
          </a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script>
import api from "../api";
import firebase from "firebase";
import axios from "axios";
export default {
  data() {
    return {
      token: "",
      visible: true,
      form: this.$form.createForm(this),
      showWarning: false,
    };
  },
  methods: {
    goToSignUp() {
      this.$router.push("/SignUp");
    },
    goToMain() {
      this.$router.push("/Main");
    },
    goToGate() {
      this.$router.push("/");
    },
    postLogin() {
      const that = this;
      this.form.validateFields((err, values) => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        };
        fetch(api + "/auth/signin", requestOptions)
          .then((response) => {
            if (response.status == 200) {
              return response.json();
            } else if (response.status == 401) {
              this.showWarning = true;
              throw "error";
            } else {
              that.goToSignUp();
            }
          })
          .then((response) => {
            console.log("login", response);
            localStorage.setItem("token", response.token);
            localStorage.setItem("email", values.email);
            localStorage.setItem("userId", response.id);
          })
          .then(() => this.getName())
          .then(() => this.goToMain())
          .catch((error) => {
            console.log(error);
          });
      });
    },
    async getName() {
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 2500,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(axiosClient);
      const { data } = await axiosClient.get(`/user`);
      if (data) {
        localStorage.setItem("name", data.name);
        console.log(data);
      }
    },
    googleLogin() {
      const that = this;
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          const requestOptions = {
            // method: "POST",
            // headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            email: result.user.email,
            password: result.user.uid,
            // }),
          };
          const axiosClient = axios.create({
            timeout: 5000,
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
          });
          try {
            const { data } = await axiosClient.post(
              `${api}/auth/signin`,
              requestOptions
            );
            // console.log("sign up", data);
            if (data) {
              localStorage.setItem("token", data.token);
              localStorage.setItem("email", result.user.email);
              localStorage.setItem("userId", data.id);
              that.$router.push("/Main");
            }
          } catch (error) {
            console.log(error);
          }
        })
        .catch((err) => console.log(err));
    },
  },
  async mounted() {
    if (localStorage.getItem("email") && localStorage.getItem("token")) {
      fetch(api + "/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          // console.log("response", response);
          localStorage.setItem("userId", response.id);
        });
      this.goToMain();
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../ant-design-vue/dist/antd.less";
#login {
  padding: 50px;
  padding-top: 50px;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.l-warning {
  margin-top: 10px;
  color: red;
}
.l-block-container {
  width: 395px;
  // height: 479px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.l-center-container {
  text-align: center;
  margin: 30px;
  display: flex;
  justify-content: center;
}
.google-login {
  width: 100%;
  height: 50px;
  margin-bottom: 30px;
}
p {
  margin: 0px;
  margin-bottom: 10px;
}
.l-form-item {
  margin-bottom: 30px;
}
.btn-primary {
  height: 40px;
  width: 130px;
  margin-bottom: 20px;
  border-radius: 50px;
}
.btn-primary:hover {
  color: @my-grey-3;
}
.l-btn-container {
  margin-top: 22px;
  justify-content: flex-end;
  display: flex;
}

@media screen and (max-width: 587px) {
  .l-block-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .l-center-container {
    text-align: center;
    margin: 0;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;

    .remind-text {
      white-space: nowrap;
    }
  }
  .google-login {
    width: 100%;
    height: 35px;
    margin-bottom: 30px;
  }
  p {
    margin: 0px;
  }
  .l-form-item {
    margin-bottom: 10px;
  }
  .btn-primary {
    height: 35px;
    width: 100px;
    margin-bottom: 20px;
    border-radius: 50px;
  }
  .btn-primary:hover {
    color: @my-grey-3;
  }
}
</style>
