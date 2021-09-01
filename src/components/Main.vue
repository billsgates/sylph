<template>
  <div id="main">
    <div class="main-btn-container">
      <div class="web-visible">
        <a-button
          type="primary"
          class="addroom-btn btn-primary"
          @click="openAddRoomModal()"
        >
          + {{ $t(`add_room`) }}
          <AddRoomDialog
            :visible="addModalVisible"
            @closeAddModal="closeAddRoomModal()"
          />
        </a-button>
      </div>
      <div class="mobile-visible">
        <a-button
          type="primary"
          class="addroom-btn btn-primary web-visible mobile-visible"
          @click="openAddRoomModal()"
        >
          + {{ $t(`add`) }}
          <AddRoomDialog
            :visible="addModalVisible"
            @closeAddModal="closeAddRoomModal()"
          />
        </a-button>
      </div>

      <div class="web-visible">
        <a-button
          type="default"
          class="btn-primary"
          @click="() => openEnterRoomModal()"
        >
          {{ $t(`enter_room`) }}
          <EnterRoomDialog
            :visible="enterModalVisible"
            @closeEnterModal="closeEnterRoomModal()"
          />
        </a-button>
      </div>
      <div class="mobile-visible">
        <a-button
          type="default"
          class="btn-primary"
          @click="() => openEnterRoomModal()"
        >
          {{ $t(`enter`) }}
          <EnterRoomDialog
            :visible="enterModalVisible"
            @closeEnterModal="closeEnterRoomModal()"
          />
        </a-button>
      </div>

      <div class="web-visible">
        <a-button
          type="default"
          class="btn-primary find-plan-btn"
          @click="goToOnlinePage()"
          >{{ $t(`find_plan_online`) }}</a-button
        >
      </div>
      <div class="mobile-visible">
        <a-button
          type="default"
          class="btn-primary find-plan-btn"
          @click="goToOnlinePage()"
          >{{ $t(`find`) }}</a-button
        >
      </div>
    </div>

    <div v-if="rooms && rooms.length" class="room-card-container">
      <div v-for="item in rooms" :key="item.room_id" class="card-container">
        <a-card
          v-show="item.room_status.toLowerCase() == 'start'.toLowerCase()"
          class="card-home"
          @click="goToInfoPage(item.room_id)"
        >
          <p v-if="item.is_host">{{ $t(`admin`) }}</p>
          <p v-else>{{ $t(`member`) }}</p>
          <a-space align="baseline">
            <div>
              <h1>{{ item.service_name | ellipsis }}</h1>
            </div>
            <div>
              <p>{{ item.plan_name }}</p>
            </div>
          </a-space>
          <p v-if="item.payment_status.toLowerCase() == 'unpaid'.toLowerCase() && item.cost != undefined">
            {{ $t(`owe`) }} NT$ {{ item.cost }}
          </p>
        </a-card>
        <a-card
          v-show="item.room_status.toLowerCase() == 'created'.toLowerCase()"
          class="card-home"
          @click="goToApplyInfoPage(item.room_id)"
        >
          <p v-if="item.is_host">{{ $t(`admin`) }}</p>
          <p v-else>{{ $t(`member`) }}</p>
          <a-space align="baseline">
            <div>
              <h1>{{ item.service_name | ellipsis }}</h1>
            </div>
            <div>
              <p>{{ item.plan_name }}</p>
            </div>
          </a-space>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api";
import AddRoomDialog from "./AddRoomDialog";
import EnterRoomDialog from "./EnterRoomDialog";
export default {
  name: "Main",
  components: {
    AddRoomDialog,
    EnterRoomDialog,
  },
  data() {
    return {
      rooms: [],
      addModalVisible: false,
      enterModalVisible: false,
      emptyText: "Create your own room now !",
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 8) {
        return value.slice(0, 8) + "...";
      }
      return value;
    },
  },
  methods: {
    openAddRoomModal() {
      this.addModalVisible = !this.addModalVisible;
    },
    closeAddRoomModal() {
      this.addModalVisible = !this.addModalVisible;
    },
    openEnterRoomModal() {
      this.enterModalVisible = true;
    },
    closeEnterRoomModal(val) {
      this.enterModalVisible = val;
    },
    goToInfoPage(room_id) {
      this.$router.push(`/Info/${room_id}`); // should be automatically route to the new id
    },
    goToOnlinePage() {
      this.$router.push(`/onlinematch`);
    },
    goToApplyInfoPage(room_id) {
      this.$router.push(`/ApplyInfo/${room_id}`);
    },
    getRooms() {
      fetch(api + "/rooms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          this.rooms = response.data;
          console.log(this.rooms);
        });
    },
  },
  created() {
    this.getRooms();
  },
};
</script>
<style lang="less" scoped>
@import "../../ant-design-vue/dist/antd.less";
#main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.web-visible {
  display: block;
}
.mobile-visible {
  display: none;
}
.btn-primary {
  height: 40px;
  width: 130px;
  margin-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 50px;
  padding: 8px, 16px, 8px, 16px;
  color: black;
  font-weight: bold;
}
.addroom-btn:hover {
  color: @my-grey-3;
}
.find-plan-btn {
  width: 170px;
}
.card-home {
  width: 270px;
  height: 179px;
  border-radius: 10px;
  margin-top: 40px;
  margin-right: 30px;
  cursor: pointer;
}
.main-btn-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.room-card-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
}
@media screen and (max-width: 578px) {
  .web-visible {
    display: none;
  }
  .mobile-visible {
    display: block;
  }
  .btn-primary {
    height: 40px;
    width: 70px;
    margin-right: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 50px;
    padding: 8px, 16px, 8px, 16px;
    color: black;
    font-weight: bold;
  }
}
@media screen and (max-width: 440px) {
  .room-card-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
  }
  .card-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card-home {
    width: 300px;
    height: 160px;
    border-radius: 10px;
    margin: 0;
    margin-bottom: 25px;
    cursor: pointer;
  }
}
</style>
