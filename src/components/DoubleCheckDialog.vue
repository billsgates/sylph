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
        {{
          delteObject.toLowerCase() == "round".toLowerCase()
            ? $t(`are_you_sure_you_want_to_remove_this_round`)
            : $t(`are_you_sure_you_want_to_remove_this_room`)
        }}
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
          @click="doYes()"
          ghost
        >
          {{ $t(`remove`) }}
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
    delteObject: { type: String, default: "" },
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
    doYes() {
      this.$emit("doYes");
      this.close();
    },
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

  img {
    width: 50px;
    margin-right: 10px;
  }

  .user-name {
    margin-right: 50px;
  }

  .state {
    margin-right: 50px;
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
    .btn-danger {
      color: #ff4d4f;
    }
  }
}
</style>
