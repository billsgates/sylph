<template>
  <a-modal
    v-model="isVisible"
    :footer="null"
    @ok="closeModal"
    @cancel="closeModal"
    :body-style="{ height: '320px' }"
  >
    <div class="block-container">
      <p>{{ $t(`room_pin`) }}</p>
      <a-input
        :placeholder="$t(`room_number`)"
        v-model="roomNumber"
        class="erd-room"
        style="width: 100%"
      />
      <p v-if="showWarning || roomError != ''" class="erd-warning">
        {{ showWarning ? $t(`pin_is_incorrect`) : $t(`room_error`) }}
      </p>
      <div class="erd-btn-container">
        <a-button
          class="btn-primary"
          key="add Room"
          type="primary"
          @click="joinRoom()"
        >
          {{ $t(`enter_room`) }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
import api from "../api";
import axios from "axios";
export default {
  props: { visible: { type: Boolean, default: false } },
  data() {
    return {
      isVisible: false,
      roomNumber: "",
      showWarning: false,
      roomError: "",
    };
  },
  watch: {
    visible: function(val) {
      this.isVisible = val;
    },
    roomNumber: function(val) {
      if (val) {
        this.showWarning = false;
      } else {
        this.showWarning = true;
      }
    },
  },
  methods: {
    closeModal: function() {
      this.isVisible = false;
      this.$emit("closeEnterModal", this.isVisible);
    },
    async joinRoom() {
      console.log("room num", this.roomNumber);
      const axiosClient = axios.create({
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      try {
        const { data } = await axiosClient.post(`${api}/rooms/join`, {
          invitation_code: this.roomNumber,
        });
        this.$router.push(`/Info/${data.room_id}`);
      } catch (error) {
        // console.log("err", error);
        this.roomError = error.response.data;
      }

      // console.log("data", data);
      // if (data)
      // this.$router.push(`/Info/${data.room_id}`);
    },
  },
};
</script>
<style scoped>
.erd-warning {
  margin-top: 10px;
  color: red;
}
.block-container {
  padding: 26px;
}
.erd-room {
  height: 32px;
  width: 395px;
  border-radius: 2px;
  padding: 4px, 12px, 4px, 12px;
}
.btn-primary {
  height: 40px;
  width: 130px;
  margin-bottom: 20px;
  border-radius: 50px;
  color: black;
  font-weight: bold;
}
.erd-btn-container {
  margin-top: 80px;
  justify-content: flex-end;
  display: flex;
}
</style>
