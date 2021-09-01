<template>
  <div id="pro">
    <div class="pro-user-container">
      <img :src="user" />
      <div class="name">{{ this.data.name }}</div>
      <a-rate
        :default-value="this.data.rating"
        allow-half
        disabled
        class="rating"
      />
    </div>
    <div class="pro-detail-container">
      <a-form hasFeedback :style="{ radius: '2px' }">
        <div class="pro-form-item">
          <p>{{ $t(`name`) }}</p>
          <a-form-item>
            <a-input
              v-model="data.name"
              v-decorator="[
                'userName',
                {
                  rules: [
                    {
                      required: true,
                      message: $t(`account_is_required`),
                    },
                  ],
                },
              ]"
              block
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
        </div>
        <div class="pro-form-item">
          <p>{{ $t(`email`) }}</p>
          <a-form-item>
            <a-input
              v-model="data.email"
              v-decorator="[
                'userName',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Account is required.',
                    },
                  ],
                },
              ]"
              block
            >
              <a-icon
                slot="prefix"
                type="user"
                style="color: rgba(0,0,0,.25)"
              />
            </a-input>
          </a-form-item>
        </div>
        <div class="pro-form-item">
          <p>{{ $t(`bank_info`) }}</p>
          <a-form-item>
            <template v-for="info in data.bankinfo">
              <a-space :key="info.id">
              <a-input class="pro-input"
                v-model="info.value">
              </a-input>
              <a-icon type="minus-circle-o" @click="removeItem(info.id)"></a-icon>
              </a-space>
            </template>
            <a-button
              type="dashed"
              v-model="add"
              @click="addItem()"
              block
            >
              <a-icon type="plus" /> {{ $t(`add`) }}
            </a-button>
          </a-form-item>
        </div>
      </a-form>
      <div class="pro-button-container">
        <a-button v-if="!ischanged" class="btn-primary" type="primary" disabled>
          {{ $t(`save`) }}
        </a-button>
        <a-button
          v-else
          class="btn-primary"
          type="primary"
          @click="patchUser()"
        >
          {{ $t(`save`) }}
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import user from "../assets/user.png";
import api from "../api";
export default {
  data() {
    return {
      obs_cnt: 0,
      user,
      add: "add",
      ischanged: false,
      data: {
        name: "",
        email: "",
        rating: 0,
        bankinfo: [
        ],
      },
    };
  },
  methods: {
    addItem() {
      this.data.bankinfo.push({
        id: this.data.bankinfo.length + 1,
        value: ""
      })
    },
    removeItem(id){
      this.data.bankinfo.splice(id-1, 1);
    },
    getUser() {
      fetch(api + "/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response)
          this.data.name = response.name;
          this.data.email = response.email;
          this.data.rating = response.rating;
        });
    },
    patchUser() {
      const update_user = {
        name: this.data.name,
        email: this.data.email,
        image_url: "",
      };
      fetch(api + "/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(update_user),
      }).then((response) => console.log(response.status));
      this.obs_cnt = 0;
      this.ischanged = false;
    },
  },
  mounted() {
    this.getUser();
    this.ischanged = false;
  },
  watch: {
    data: {
      handler(val) {
        if (!this.ischanged & (this.obs_cnt != 0)) {
          this.ischanged = true;
        }
        this.data.name = val.name;
        this.data.email = val.email;
        this.obs_cnt += 1;
      },
      deep: true,
    },
  },
};
</script>
<style lang="less" scoped>
#pro {
  display: flex;
  margin-top: 35px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
.pro-input{
  width: 310px;
}
.pro-form-item {
  margin-bottom: 50px;
}
.pro-detail-container {
  // margin-right: 94px;
  width: 30%;
  max-width: 310px;
  min-width: 200px;
}
.pro-user-container {
  width: 18%;
  margin-top: 20px;
  margin-right: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    margin-bottom: 15px;
  }
  .name {
    margin-bottom: 27px;
  }
}
.pro-button-container {
  justify-content: flex-end;
  display: flex;
  padding: 0px;
  margin-top: 70px;
}
img {
  width: 80px;
  height: 80px;
}
.btn-primary {
  height: 40px;
  width: 130px;
  border-radius: 50px;
  color: black;
  font-weight: bold;
}
@media screen and (max-width: 720px) {
  #pro {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 0px;
  }
  .pro-form-item {
    margin-bottom: 20px;
    p {
      margin-bottom: 5px;
    }
  }
  .pro-user-container {
    width: 100%;
    margin: 0;
    margin-top: 10px;
    margin-bottom: 20px;
    .name {
      margin-bottom: 10px;
    }
  }
  .pro-detail-container {
    // margin-right: 94px;
    width: 100%;
    max-width: 275px;
    min-width: none;
  }
  .pro-button-container {
    justify-content: flex-end;
    display: flex;
    padding: 0px;
    margin-top: 50px;
  }
}
</style>
