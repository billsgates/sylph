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
      <div class="content-detail">
        <div class="content-detail">
          <img :src="user" />
          <span class="user-name">{{ userState.user_name }}</span>
        </div>
        <div class="state">
          {{ $t(`paid`) }}  NT${{ userState.price * interval }}   
          {{ $t(`to`) }}
        </div>
        <div class="content-detail">
          <img :src="user" /> <span>{{ $t(`admin_title`) }}</span>
        </div>
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
          class="btn-primary"
          key="settleUp"
          type="primary"
          @click="settleUp()"
        >
          {{ $t(`settle_up`) }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import axios from "axios";
import api from "../api";
import user from "../assets/user.png";

export default {
  props: {
    visible: { type: Boolean, default: false },
    userState: {
      type: Object,
      default: function() {
        return { user_id: 0, user_name: "", payment_status: "", price: 0 };
      },
    },
    interval:{type: Number, default: 1},
    // paymentFee: { type: Number, default: 0 },
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
    async settleUp() {
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      const res = await axiosClient.patch(`/participant/status`, {
        user_id: this.userState.user_id,
        room_id: parseInt(this.roomId),
        payment_status: "confirmed",
      });
      // console.log("res", res);
      if (res) {
        this.isVisible = false;
        const newUserStatus = {
          userId: this.userState.user_id,
          status: "confirmed",
        };
        this.$emit("settleUp", newUserStatus);
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

  .content-detail {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    margin-bottom: 20px;
  }

  img {
    width: 50px;
    margin-right: 10px;
  }

  .user-name {
    margin-right: 50px;
  }

  .state {
    margin-right: 50px;
    margin-bottom: 20px;
  }

  .btn-container {
    margin-top: 64px;
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
      margin-right: 20px;
    }
  }
}
@media screen and (max-width: 720px) {
  .content {
    height: 300px;

    .state {
      margin-left: 60px;
    }
    .btn-container {
      margin-top: 20px;
      .btn-primary {
        width: 90px;
      }
      .btn-cancel {
        margin-right: 15px;
      }
    }
  }
}
</style>
