<template>
  <!-- <a-modal
    @cancel="goToGate()"
    v-model="visible"
    :closable="false"
    :footer="false"
    :width="495"
    :body-style="{  }"
  > -->
  <div id="sign-up">
    <div class="su-block-container">
      <a-button class="google-login" block @click="googleSignUp()">
        <a-icon type="google" />
        {{ $t(`google_login`) }}
      </a-button>

      <a-form :form="form" hasFeedback :style="{ radius: '2px' }">
        <div class="su-form-item">
          <p>{{ $t(`name`) }}</p>
          <a-form-item>
            <a-input
              v-decorator="[
                'name',
                {
                  rules: [
                    {
                      required: true,
                      message: $t(`name_is_required`),
                    },
                  ],
                },
              ]"
            >
            </a-input>
          </a-form-item>
        </div>
        <div class="su-form-item">
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
                    {
                      required: true,
                      message: $t(`email_is_required`),
                    },
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
        <div class="su-form-item">
          <p>{{ $t(`password`) }}</p>
          <a-form-item>
            <a-input-password
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Password  is required.',
                    },
                  ],
                },
              ]"
            >
            </a-input-password>
          </a-form-item>
        </div>
        <div class="su-center-container">
          <a-space>
            <p class="remind-text">{{ $t(`already_have_an_account`) }}</p>
            <p
              style="color:#1890FF; cursor:pointer; white-space: nowrap"
              @click="goToLogin()"
            >
              {{ $t(`log_in`) }}
            </p>
          </a-space>
        </div>
        <div class="su-btn-container">
          <a-button
            class="btn-primary"
            key="add Room"
            type="primary"
            @click="postSignUp()"
          >
            {{ $t(`sign_up`) }}
          </a-button>
        </div>
      </a-form>
    </div>
    <!-- </a-modal> -->
  </div>
</template>
<script>
import api from "../api";
import axios from "axios";
import firebase from "firebase";
export default {
  data() {
    return {
      visible: true,
      form: this.$form.createForm(this),
    };
  },
  methods: {
    goToLogin() {
      this.$router.push("/Login");
    },
    goToMain() {
      this.$router.push("/Main");
    },
    goToGate() {
      this.$router.push("/");
    },
    async getName() {
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const { data } = await axiosClient.get(`/user`);
      if (data) {
        localStorage.setItem("name", data.name);
        console.log(data);
      }
    },
    postSignUp() {
      this.form.validateFields((err, values) => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        };
        console.log(values);
        fetch(api + "/auth/signup", requestOptions)
          .then((response) => response.json())
          .then((response) => {
            localStorage.setItem("token", response.token);
            localStorage.setItem("email", values.email);
            localStorage.setItem("userId", response.id);
          })
          .then(async () => {
            await this.getName();
          })
          .then(() => this.goToMain())
          .catch((error) => {
            console.log(error);
          });
      });
    },
    googleSignUp() {
      const that = this;
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          // console.log("google result", result);
          const requestOptions = {
            // method: "POST",
            // headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({
            name: result.user.displayName,
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
              `${api}/auth/signup`,
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
};
</script>
<style scoped>
#sign-up {
  padding: 50px;
  padding-top: 50px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.su-block-container {
  width: 395px;
  height: 479px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.su-center-container {
  text-align: center;
  margin: 20px;
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
.su-form-item {
  margin-bottom: 30px;
}
.btn-primary {
  height: 40px;
  width: 130px;
  margin: 0px;
  border-radius: 50px;
}

.su-btn-container {
  margin-top: 11px;
  justify-content: flex-end;
  display: flex;
}
@media screen and (max-width: 587px) {
  .su-block-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .su-center-container {
    text-align: center;
    margin: 20px;
    display: flex;
    justify-content: center;
  }
  .remind-text {
    white-space: nowrap;
  }
  .google-login {
    width: 100%;
    height: 35px;
    margin-bottom: 30px;
  }
  p {
    margin: 0px;
    margin-bottom: 10px;
  }
  .su-form-item {
    margin-bottom: 30px;
  }
  .btn-primary {
    height: 40px;
    width: 130px;
    margin: 0px;
    border-radius: 50px;
  }

  .su-btn-container {
    margin-top: 11px;
    justify-content: flex-end;
    display: flex;
  }
}
</style>
