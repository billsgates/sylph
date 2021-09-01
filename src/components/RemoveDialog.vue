<template>
  <a-modal
    v-model="isVisible"
    :footer="null"
    :width="557"
    :closable="false"
    @ok="close"
    @cancel="close"
  >
    <div class="content">
      <div>
        <span class="text">{{ $t(`are_you_sure_you_want_to_remove`) }}</span>
        <img :src="user" />
        <span class="user-name text">{{ userState.user_name }} </span>
        <span>?</span>
      </div>

      <div class="btn-container">
        <a-button
          class="btn-primary btn-cancel"
          key="cancel"
          type="default"
          @click="close()"
        >
          {{ $t(`cancel`) }}
        </a-button>
        <a-button
          class="btn-primary btn-danger"
          key="remove"
          type="danger"
          @click="removeUser()"
          ghost
        >
          {{ $t(`remove`) }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import user from "../assets/user.png";
import axios from "axios";
import api from "../api";

export default {
  props: {
    visible: { type: Boolean, default: false },
    userState: {
      type: Object,
      default: function() {
        return { payment_status: "", user_name: "" };
      },
    },
    roomId: { type: String, default: "" },
  },
  data() {
    return {
      user,
      isVisible: false, // default should be false
    };
  },
  watch: {
    visible: function(val) {
      this.isVisible = val;
    },
  },
  methods: {
    close: function() {
      this.isVisible = false;
      this.$emit("close", this.isVisible);
    },
    async removeUser() {
      var res;
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      if (this.$route.name.toLowerCase() == "ApplyInfo".toLowerCase()) {
        console.log({
          room_id: parseInt(this.roomId),
          user_id: this.userState.user_id,
        });
        res = await axiosClient.delete(`/application/delete`, {
          data: {
            room_id: parseInt(this.roomId),
            user_id: this.userState.user_id,
          },
        });
      } else {
        res = await axiosClient.delete(`/participant`, {
          data: {
            user_id: this.userState.user_id,
            room_id: parseInt(this.roomId),
          },
        });
      }
      // console.log(res);
      if (res) {
        this.isVisible = false;
        this.$emit("removeUser", this.userState.user_id);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 194px;
  padding: 26px;
  font-size: 16px;

  .text {
    margin-right: 30px;
  }
  img {
    width: 50px;
    margin-right: 10px;
  }

  .user-name {
    margin-right: 30px;
  }

  .btn-container {
    margin-top: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    .btn-primary {
      height: 40px;
      width: 130px;
      margin-bottom: 20px;
      border-radius: 50px;
      padding: 8px, 16px, 8px, 16px;
      color: black;
      font-weight: bold;
    }

    .btn-cancel {
      margin-right: 10px;
    }
    .btn-danger {
      color: #ff4d4f;
    }
  }
}
@media screen and (max-width: 720px) {
  .content {
    padding: 25px 15px;
    height: 170px;
    .user-name {
      margin-right: 10px;
    }

    img {
      margin-left: -12px;
      width: 35px;
    }

    .btn-container {
      margin-top: 30px;
      .btn-primary {
        width: 80px;
      }
      .btn-cancel {
        margin-right: 15px;
      }
    }
  }
}
</style>
