<template>
  <a-modal
    v-model="isVisible"
    :footer="null"
    :width="666"
    :closable="false"
    @ok="close"
    @cancel="close"
  >
    <div class="admin-room">
      <a-menu
        class="menu web-menu"
        mode="vertical"
        :default-selected-keys="['1']"
        :selected-keys="[selectedItem]"
        @click="handleSettingState"
      >
        <a-menu-item key="1">
          {{ $t(`settings`) }}
        </a-menu-item>
        <a-menu-item v-show="isAdmin" key="2">
          {{ $t(`members`) }}
        </a-menu-item>
        <a-menu-item key="3">
          {{ $t(`reminder`) }}
        </a-menu-item>
        <a-menu-item v-show="isAdmin" key="4">
          {{ $t(`delete`) }}
        </a-menu-item>
      </a-menu>
      <a-menu
        class="menu mobile-menu"
        mode="horizontal"
        :default-selected-keys="['1']"
        :selected-keys="[selectedItem]"
        @click="handleSettingState"
      >
        <a-menu-item key="1">
          {{ $t(`settings`) }}
        </a-menu-item>
        <a-menu-item v-show="isAdmin" key="2">
          {{ $t(`members`) }}
        </a-menu-item>
        <a-menu-item key="3">
          {{ $t(`reminder`) }}
        </a-menu-item>
        <a-menu-item v-show="isAdmin" key="4">
          {{ $t(`delete`) }}
        </a-menu-item>
      </a-menu>

      <div class="admin-room-content">
        <div v-if="selectedItem == '1'">
          <div class="content-item">
            <div class="content-title">{{ $t(`plan_select`) }}</div>
            <a-select
              :default-value="serviceName"
              style="width: 110px; margin-right: 15px;"
              @change="handlePlanChange"
            >
              <a-select-option v-for="ele in planList" :key="ele.id">
                {{ ele.name }}
              </a-select-option>
            </a-select>
            <a-select v-model="planNameDft" style="width: 110px">
              <a-select-option
                v-for="ele in planLevelList"
                :key="ele.plan_name"
              >
                {{ ele.plan_name }}
              </a-select-option>
            </a-select>
          </div>
          <div class="content-item">
            <div class="content-title">{{ $t(`plan_price`) }}</div>
            <a-select
              v-model="currencySelected"
              :default-value="currencyData[0]"
              class="price-select currency-select"
              disabled
            >
              <a-select-option v-for="ele in currencyData" :key="ele">
                {{ ele }}
              </a-select-option>
            </a-select>
            <a-input
              v-model="price"
              placeholder="0"
              class="price-select"
              disabled
            />
            <span> / </span>
            <a-select
              v-model="periodSelected"
              :default-value="periodData[1]"
              class="price-select"
              disabled
            >
              <a-select-option v-for="ele in periodData" :key="ele">
                {{ ele }}
              </a-select-option>
            </a-select>
          </div>
          <div class="content-item">
            <div class="content-title">{{ $t(`split`) }}</div>
            <a-input
              placeholder="0"
              v-model="selectedMaxCnt"
              class="price-select"
            />
            <span> {{ $t(`people`) }} </span>
          </div>
          <div>
            <!-- <a-checkbox
              style="font-size: 16px"
              :checked="isRoomPublic"
              @change="handleRoomPublic"
            >
              {{ $t(`make_this_room_public`) }}
            </a-checkbox> -->
            <span v-if="isPublic"> The room is public </span>
            <span v-else> The room is private </span>
          </div>
          <div class="btn-container">
            <a-button
              class="btn-primary btn-save"
              key="Save"
              type="primary"
              :disabled="isSaved && isChanged"
              @click="saveSettings()"
            >
              {{ $t(`save`) }}
            </a-button>
          </div>
        </div>
        <div v-if="selectedItem == '2'">
          <div class="new-user" @click="generateNewPin()">
            <img :src="add" />
          </div>
          <div v-for="ele in pinList" class="new-code" :key="ele.pinCode">
            <img :src="question" />
            <div class="pin-info">
              <div class="pin">
                <div class="label">
                  {{ $t(`room_pin`) }} <span>|</span> {{ ele }}
                </div>
              </div>
              <!-- <div class="note">
                expire at {{ ele.expireDate }} {{ ele.expireTime }}
              </div> -->
            </div>
            <copy-to-clipboard :text="ele" @copy="handleCopy">
              <a-button class="btn-primary btn-copy" type="default">
                {{ $t(`copy`) }}
              </a-button>
            </copy-to-clipboard>
          </div>
        </div>
        <div v-if="selectedItem == '3'">
          {{ $t(`new_features_are_available_on_next_generation_platform`) }}
        </div>
        <div v-if="selectedItem == '4'">
          <a-button
            class="btn-primary btn-delete"
            type="danger"
            ghost
            @click="openDoubleCheckDialog()"
          >
            {{ $t(`delete_room`) }}
          </a-button>
        </div>
      </div>
    </div>
    <DoubleCheckDialog
      :visible="isDeleteDialogOpen"
      delteObject="room"
      @doYes="deleteRoom()"
      @close="closeDoubleCheckModal()"
    />
  </a-modal>
</template>

<script>
import CopyToClipboard from "vue-copy-to-clipboard";
import add from "../assets/add.png";
import question from "../assets/question.png";
import axios from "axios";
import api from "../api";
// import _ from "lodash";
import DoubleCheckDialog from "./DoubleCheckDialog";

const planData = ["Youtube", "Netflix"];
const planLevelData = {
  Youtube: ["Premium", "Famili"],
  Netflix: ["Family"],
};
const currencyData = ["NT", "US"];
const periodData = ["year", "month", "week"];
export default {
  components: {
    CopyToClipboard,
    DoubleCheckDialog,
  },
  props: {
    isPublic: { type: Boolean, default: false },
    visible: { type: Boolean, default: false },
    roomId: { type: String, default: "0" },
    isAdmin: { type: Boolean, default: false },
    serviceId: { type: Number, default: 0 },
    serviceName: { type: String, default: "" },
    planPrice: { type: Number, default: 1200 },
    planName: { type: String, default: "" },
    maxCount: { type: Number, default: 0 },
    roundInfo: {
      type: Object,
      default: function() {
        return {
          ending_time: "",
          payment_deadline: "",
          round_interval: "",
          starting_time: "",
        };
      },
    },
    members: {
      type: Array[Object],
      default: function() {
        return [
          {
            payment_status: { type: String, default: "" },
            user_id: { type: String, default: "" },
            user_name: { type: String, default: "" },
          },
        ];
      },
    },
  },
  data() {
    return {
      add,
      question,

      isVisible: false, // default should be false
      selectedItem: "1", // default should be 1
      planData,
      planLevelData,
      plans: [],
      // plan: "",
      planNameDefault: "",
      planNameDft: "",
      selectedMaxCnt: 0,
      selectedServiceId: 0,
      planLevels: [],
      price: 0,
      currencyData,
      periodData: [this.$t(`year`), this.$t(`month`), this.$t(`week`)],
      currencySelected: currencyData[0],
      periodSelected: this.$t(`${periodData[1]}`),
      people: 0,
      isRoomPublic: false,

      pinCodes: [],

      isSaved: false,
      isChanged: false,
      settingData: {},

      isDeleteDialogOpen: false,
    };
  },
  watch: {
    visible: function(val) {
      this.isVisible = val;
    },
    maxCount: function(val) {
      this.selectedMaxCnt = val;
    },
    currencySelected: function(val) {
      if (val) {
        // console.log("val", val);
        this.isChanged = true;
        this.isSaved = false;
      } else {
        this.isChanged = false;
      }
    },
    periodSelected: function(val) {
      if (val) {
        // console.log("val", val);
        this.isChanged = true;
        this.isSaved = false;
      } else {
        this.isChanged = false;
      }
    },
    selectedMaxCnt: function(val) {
      if (val) {
        // console.log("val", val);
        this.isChanged = true;
        this.isSaved = false;
      } else {
        this.isChanged = false;
      }
    },
    planNameDft: function(val) {
      // console.log("dft", val, this.planLevelList);
      this.planNameDefault = val;
      const selectedPlan = this.planLevelList.filter(
        (planLevel) => planLevel.plan_name.toLowerCase() == val.toLowerCase()
      )[0];
      this.price = selectedPlan.cost;
      console.log("dft");
      if (val != this.planName) {
        this.selectedMaxCnt = Math.min(selectedPlan.max_count, this.maxCount);
      }
    },
    serviceId: function(val) {
      // console.log("sercie", val);
      this.selectedServiceId = val;
    },
  },
  computed: {
    pinList: function() {
      // console.log("codes", JSON.parse(JSON.stringify(this.pinCodes)));
      return JSON.parse(JSON.stringify(this.pinCodes));
    },
    planList: function() {
      return JSON.parse(JSON.stringify(this.plans));
    },
    planLevelList: function() {
      return JSON.parse(JSON.stringify(this.planLevels));
    },
  },
  methods: {
    async saveSettings() {
      this.settingData = {
        selectedServiceId: this.selectedServiceId + 1,
        planNameDft: this.planNameDft,
        maxCount: this.selectedMaxCnt,
      };
      // console.log("this.settingData", this.settingData);
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      await axiosClient.patch(`/rooms/${this.roomId}`, {
        max_count: parseInt(this.settingData.maxCount),
        service_id: this.settingData.selectedServiceId,
        plan_name: this.settingData.planNameDft,
        is_public: true,
      });
      this.isSaved = true;
    },
    close() {
      this.isVisible = false;
      this.$emit("close", this.isVisible);
    },
    async deleteRoom() {
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      await axiosClient.delete(`/rooms/${this.roomId}`);
      this.$router.push("/Main");
    },
    handleSettingState(e) {
      this.selectedItem = e.key;
    },
    handlePlanChange(val) {
      // this.plan = planLevelData[value];
      console.log("handle change");
      const value = val - 1;
      this.planLevels = this.planList[value].plans;
      this.selectedServiceId = this.planList[value].id;
      this.planNameDft = this.planList[value].plans[0].plan_name;
    },
    handleRoomPublic() {
      this.isRoomPublic = !this.isRoomPublic;
    },
    handleCopy(result) {
      console.log(result);
    },
    async generateNewPin() {
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      const { data: newPin } = await axiosClient.post(
        `/rooms/${this.roomId}/invitation`
      );
      const pin = newPin.code;
      this.pinCodes.unshift(pin);
    },
    async openDoubleCheckDialog() {
      this.isDeleteDialogOpen = true;
    },
  },
  async mounted() {
    // console.log("id", this.roomId);
    const axiosClient = axios.create({
      baseURL: api,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
        accept: "application/json",
      },
    });
    const { data: plans } = await axiosClient.get("/services");
    // console.log("plans", plans.data);
    this.plans = plans.data;
    this.planLevels = plans.data[this.serviceId - 1].plans;
    this.planNameDft = this.planName;
    this.selectedMaxCnt = this.maxCount;

    if (this.isAdmin) {
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      const { data } = await axiosClient.get(
        `/rooms/${this.roomId}/invitation`
      );
      const codes = data.data.map((code) => code.invitation_code);
      this.pinCodes = codes;
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../ant-design-vue/dist/antd.less";
span {
  font-size: 16px;
  margin: 0;
}
.admin-room {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: 510px;
  .web-menu {
    display: block;
  }
  .mobile-menu {
    display: none;
  }
  .menu {
    width: 100px;
    height: 485px;
    padding: 12px 35px 10px 10px;
    box-sizing: content-box;
  }
}
.admin-room-content {
  box-sizing: content-box;
  padding: 26px;
  padding-left: 50px;
  width: 480px;
  height: 450px;
  overflow: scroll;
  .currency-select {
    margin-right: 15px;
  }
  .price-select {
    width: 110px;
    margin-bottom: 10px;
  }
}
.ant-menu-item-selected {
  background-color: none !important;
}
.content-item {
  margin-bottom: 30px;

  span {
    font-size: 16px;
    margin: 0 15px;
  }

  .content-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
}

.btn-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.btn-primary {
  height: 40px;
  width: 130px;
  // margin-top: 100px;
  margin-bottom: 20px;
  border-radius: 50px;
  padding: 8px, 16px, 8px, 16px;
  color: black;
  font-weight: bold;
}
.btn-save {
  margin-top: 80px;
}
.btn-google-calendar {
  width: 200px;
  height: 40px;
  font-size: 14px;
  border: solid @my-grey-1 1px;
  border-radius: 50px;
  background-color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.new-code {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 84%;
  font-size: 14px;
  margin-bottom: 30px;
  img {
    width: 50px;
    margin-right: 25px;
  }
  .pin-info {
    margin-right: 0px;
    .pin {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      .label {
        margin-right: 30px;
        span {
          margin: 0 10px;
        }
      }
    }
    .note {
      color: @my-grey-3;
    }
  }
  .btn-copy {
    width: 70px;
    margin-bottom: 0;
    font-size: 14px !important;
    font-weight: 400;
  }
}

.new-user {
  margin-bottom: 30px;
  cursor: pointer;
  img {
    width: 50px;
  }
}

@media screen and (max-width: 600px) {
  .admin-room {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 550px;
    .web-menu {
      display: none;
    }
    .mobile-menu {
      display: block;
    }
    .menu {
      width: 100%;
      height: 60px;
      box-sizing: border-box;
    }
    .admin-room-content {
      width: 93%;
      height: 90%;
      padding: 10px;
      padding-top: 25px;

      .btn-primary {
        margin-top: 45px;
      }
      .btn-delete {
        margin-top: 10px;
      }
      .btn-save {
        margin-bottom: 0;
      }
      .content-item {
        span {
          margin: 0;
          margin-right: 5px;
        }
      }
      .price-select {
        width: 60px;
        margin-right: 5px;
        margin-bottom: 10px;
      }
    }
  }
  .new-code {
    width: 100%;
    margin-right: 0;
    img {
      margin-right: 18px;
    }
    .pin-info {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;

      .pin {
        .label {
          margin-right: 18px;
        }
      }
    }
    .btn-primary {
      margin-top: 0 !important;
    }
  }
}
</style>
