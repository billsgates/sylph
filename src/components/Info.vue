<template>
  <div id="info">
    <div class="info-container">
      <div class="info-left">
        <div class="info-main">
          <div class="info-title">
            <div class="info-service-name">{{ serviceName }}</div>
            <div class="info-level">{{ planName }}</div>
          </div>
          <div class="info-setting-btn">
            <a-button
              v-show="isAdmin"
              class="btn-primary btn-setting"
              :type="members.length < 1 ? 'primary' : 'default'"
              @click="openSettingRoomModal()"
            >
              {{ $t(`settings`) }}
            </a-button>
            <a-button
              v-show="isAdmin"
              v-if="isInRound"
              class="btn-primary btn-setting"
              type="default"
              @click="openDoubleCheckModal()"
            >
              {{ $t(`delete_round`) }}
            </a-button>
            <a-button
              v-show="isAdmin"
              class="btn-primary"
              type="primary"
              v-else
              :disabled="!(members.length == maxCount - 1 && !isInRound)"
              @click="openNewRoundModal()"
            >
              {{ $t(`new_round`) }}
            </a-button>
          </div>
        </div>
        <div class="info-plan">
          <div class="info-plan-detail-container">
            <div class="info-plan-label-container">
              <div class="info-plan-label">{{ $t(`payment_deadline`) }}</div>
              <div class="info-plan-label">{{ $t(`interval`) }}</div>
              <div class="info-plan-label">{{ $t(`date`) }}</div>
            </div>
            <div class="info-plan-date-container">
              <div class="info-plan-date">
                {{ timelineBoard.paymentDeadline }}
                <!-- 2020-02-02 -->
              </div>
              <div class="info-plan-date">
                {{ timelineBoard.interval }}
                <!-- 2020-02-02 - 2020-01-02 -->
              </div>
              <div class="info-plan-date">
                {{ timelineBoard.date }}
                <!-- 2021-01-02 -->
              </div>
            </div>
          </div>
          <div class="info-plan-detail-mobile">
            <div class="info-plan-detail">
              <div class="info-plan-label">{{ $t(`payment_deadline`) }}</div>
              <div
                class="info-plan-date"
                v-html="
                  timelineBoard.paymentDeadline != '-'
                    ? timelineBoard.paymentDeadline
                    : mobileBorad.paymentDeadline
                "
              >
                <!-- {{ timelineBoard.paymentDeadline }} -->
              </div>
            </div>
            <div class="info-plan-detail">
              <div class="info-plan-label">{{ $t(`interval`) }}</div>
              <div
                class="info-plan-date"
                v-html="
                  timelineBoard.interval != '-'
                    ? timelineBoard.interval
                    : mobileBorad.interval
                "
              >
                <!-- {{ timelineBoard.interval }} -->
              </div>
            </div>
            <div class="info-plan-detail">
              <div class="info-plan-label">{{ $t(`date`) }}</div>
              <div
                class="info-plan-date"
                v-html="
                  timelineBoard.date != '-'
                    ? timelineBoard.date
                    : mobileBorad.date
                "
              >
                <!-- {{ timelineBoard.date }} -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-right">
        <div class="info-card info-announce">
          <div class="info-card-title">{{ $t(`announcement`) }}</div>

          <textarea v-if="isAdmin" v-model="announcement" />
          <div v-else class="text">
            {{ this.announcement ? this.announcement : $t(`none`) }}
          </div>
          <div v-show="isAdmin" class="btn-announce-container">
            <a-button
              type="default"
              class="btn-primary btn-announce"
              @click="handleAnnouncement()"
              >{{ $t(`announce`) }}</a-button
            >
          </div>
        </div>
        <div class="info-card info-admin">
          <div class="info-card-title">{{ $t(`admin_info`) }}</div>
          <div class="info-card-content">
            <div class="info-profile-name">
              <img :src="user" />
              <div class="info-name">
                <div>{{ admin.name }}</div>
                <a-rate
                  :default-value="admin.rating"
                  allow-half
                  :disabled="isAdmin ? true : false"
                />
              </div>
            </div>
            <div class="info-profile-contact">
              <div>{{ admin.email }}</div>
              <div>{{ admin.phone }}</div>
            </div>
          </div>
          <div class="info-import-btn-container">
            <!-- <a-button type="default" class="btn-primary btn-import-info">{{
              $t(`save`)
            }}</a-button> -->
          </div>
        </div>
      </div>
    </div>
    <div class="info-table">
      <a-table
        :columns="columns"
        :data-source="members"
        rowKey="user_name"
        :locale="emptyText"
      >
        <span slot="customUser">{{ $t(`user`) }}</span>
        <span slot="customStatus">{{ $t(`state`) }}</span>
        <span slot="customAction">{{ $t(`action`) }}</span>
        <span slot="user_name" slot-scope="text" class="info-table-user">
          <img :src="user" />
          <span>{{
            text.toLowerCase() == "You".toLowerCase() ? $t(`you`) : text
          }}</span></span
        >
        <span
          slot="payment_status"
          slot-scope="record"
          class="info-table-state"
        >
          <div
            v-if="
              record.toLowerCase() == 'confirmed'.toLowerCase() && isInRound
            "
          >
            {{ $t(`paid`) }}
          </div>
          <div v-if="record != 'confirmed' && isInRound">
            {{ $t(`owe_admin`) }}
            {{ (paymentFee / (members.length + 1)) * interval }}
          </div>
        </span>
        <span slot="action" slot-scope="record" class="info-table-action">
          <a-button
            v-show="
              isAdmin || record.user_name.toLowerCase() == 'You'.toLowerCase()
            "
            type="primary"
            class="btn-action"
            :disabled="
              isSettleUpDisabled ||
                record.payment_status.toLowerCase() == 'confirmed'.toLowerCase()
            "
            @click="openSettleUpDialog(record)"
          >
            <a-icon type="dollar" />{{ $t(`settle_up`) }}</a-button
          >
          <a-button
            v-show="isAdmin"
            type="default"
            class="btn-action"
            @click="openRemindDialog(record)"
            ><a-icon type="mail" />{{ $t(`remind`) }}</a-button
          >
          <a-button
            v-show="
              (isAdmin &&
                !record.user_name.toLowerCase() == 'You'.toLowerCase()) ||
                !record.user_name.toLowerCase() == 'You'.toLowerCase()
            "
            type="default"
            class="btn-action"
            @click="openRateDialog(record)"
            ><a-icon type="star" />{{ $t(`rate`) }}</a-button
          >
          <a-button
            v-show="isAdmin"
            type="default"
            class="btn-action"
            @click="openRemoveDialog(record)"
            ><a-icon type="delete" />{{ $t(`remove`) }}</a-button
          >
        </span>
      </a-table>
    </div>
    <DoubleCheckDialog
      :visible="isDoubleCheckModalOpen"
      delteObject="round"
      @doYes="deleteRound()"
      @close="closeDoubleCheckModal()"
    />
    <AdminRoomSetting
      v-if="serviceId"
      :isPublic="isPublic"
      :visible="isSettingRoomModalOpen"
      :roomId="roomId"
      :isAdmin="isAdmin"
      :serviceId="serviceId"
      :serviceName="serviceName"
      :planName="planName"
      :maxCount="maxCount"
      :roundInfo="roundInfo"
      :members="members"
      @close="closeRoomSettingModal()"
    />

    <NewRoundModal
      v-if="serviceId"
      :visible="isNewRoundModalOpen"
      :roomId="roomId"
      @setboard="setTimelineBoard()"
      @close="closeNewRoundModal()"
    />

    <SettleUpDialog
      v-if="serviceId"
      :visible="isSettleUpDialogOpen"
      :roomId="roomId"
      :userState="selectedUserState"
      :interval="interval"
      @close="closeSettleUpDialog()"
      @settleUp="settleUp"
    />

    <RemindDialog
      :visible="isRemindDialogOpen"
      :userState="selectedUserState"
      @close="closeRemindDialog()"
    />
    <RateDialog
      :visible="isRateDialogOpen"
      :userState="selectedUserState"
      @close="closeRateDialog()"
    />
    <RemoveDialog
      v-if="serviceId"
      :visible="isRemoveDialogOpen"
      :roomId="roomId"
      :userState="selectedUserState"
      @close="closeRemoveDialog()"
      @removeUser="removeUser"
    />
  </div>
</template>

<script>
import axios from "axios";
import api from "../api";
import user from "../assets/user.png";
import AdminRoomSetting from "./AdminRoomSetting";
import NewRoundModal from "./NewRoundModal";
import SettleUpDialog from "./SettleUpDialog";
import RemindDialog from "./RemindDialog";
import RateDialog from "./RateDialog";
import RemoveDialog from "./RemoveDialog";
import DoubleCheckDialog from "./DoubleCheckDialog";

export default {
  components: {
    AdminRoomSetting,
    NewRoundModal,
    SettleUpDialog,
    RemindDialog,
    RateDialog,
    RemoveDialog,
    DoubleCheckDialog,
  },
  data() {
    return {
      isRoomStart: true,
      user,
      isSettingDisabled: false, // default should be false
      isSettleUpDisabled: false, // default should be true
      isInRound: false,
      emptyText: {
        emptyText: this.$t(`go_to_settings_to_add_members`),
      },
      roomId: "",
      isAdmin: false,
      serviceId: 0,
      serviceName: "",
      planName: "",
      isPublic: false,
      maxCount: 0,
      roundInfo: {},
      memberList: [],
      admin: {},
      mobileBorad: {
        paymentDeadline: '<div style="padding-left: 85px;">-</div>',
        interval: '<div style="padding-left: 150px;">-</div>',
        date: '<div style="padding-left: 168px;">-</div>',
      },
      timelineBoard: {
        paymentDeadline: "-",
        interval: "-",
        date: "-",
      },
      originalAnnouncement: "",
      announcement: "",

      // data,
      columns: [
        {
          key: "user_name",
          width: "21%",
          dataIndex: "user_name",
          slots: { title: "customUser" },
          scopedSlots: { customRender: "user_name" },
        },
        {
          key: "payment_status",
          width: "24%",
          dataIndex: "payment_status",
          slots: { title: "customStatus" },
          scopedSlots: { customRender: "payment_status" },
        },
        {
          key: "action",
          width: "55%",
          slots: { title: "customAction" },
          scopedSlots: { customRender: "action" },
        },
      ],
      isSettingRoomModalOpen: false,
      isDoubleCheckModalOpen: false,
      isNewRoundModalOpen: false,
      isSettleUpDialogOpen: false,
      selectedUserState: {},
      isRemindDialogOpen: false,
      isRateDialogOpen: false,
      isRemoveDialogOpen: false,
      paymentFee: 0,
      interval: 1,
    };
  },
  computed: {
    members: function() {
      console.log("user_name", this.admin.name);
      let memberList = JSON.parse(JSON.stringify(this.memberList));
      return memberList;
    },
  },
  methods: {
    async setTimelineBoard() {
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      const { data } = await axiosClient.get(`/rooms/${this.roomId}`);
      console.log("setTimeline", data);
      if (data) {
        const email = localStorage.getItem("email");
        if (email.toLowerCase() == data.admin.email.toLowerCase()) {
          this.isAdmin = true;
        }
        if (data.round.payment_deadline != "") {
          this.isInRound = true;
          this.timelineBoard.paymentDeadline = data.round.payment_deadline;
          this.timelineBoard.interval = data.round.round_interval + "  month";
          this.timelineBoard.date =
            data.round.starting_time + "  ->  " + data.round.ending_time;
        } else {
          this.timelineBoard.paymentDeadline = "-";
          this.timelineBoard.interval = "-";
          this.timelineBoard.date = "-";
        }
      }
    },
    setTableKey(record) {
      console.log("record", record);
      return record.name;
    },
    async deleteRound() {
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      const res = await axiosClient.delete(`/rooms/${this.roomId}/round`);
      if (res.status == 200) {
        this.isInRound = false;
        (this.isSettingDisabled = false), // default should be false
          (this.isSettleUpDisabled = false), // default should be true
          this.setTimelineBoard();
      }
      this.$router.go();
    },
    openDoubleCheckModal() {
      this.isDoubleCheckModalOpen = !this.isDoubleCheckModalOpen;
    },
    closeDoubleCheckModal() {
      this.isDoubleCheckModalOpen = !this.isDoubleCheckModalOpen;
    },

    openSettingRoomModal() {
      this.isSettingRoomModalOpen = !this.isSettingRoomModalOpen;
    },
    closeRoomSettingModal() {
      // this.isSettingRoomModalOpen = !this.isSettingRoomModalOpen;
      window.location.reload();
    },
    openNewRoundModal() {
      this.isNewRoundModalOpen = !this.isNewRoundModalOpen;
    },
    closeNewRoundModal() {
      this.isNewRoundModalOpen = !this.isNewRoundModalOpen;
      window.location.reload();
    },
    openSettleUpDialog(user) {
      user.price = this.paymentFee / (this.members.length + 1);
      this.selectedUserState = user;
      // console.log("user", user);
      this.isSettleUpDialogOpen = !this.isSettleUpDialogOpen;
    },
    closeSettleUpDialog() {
      this.isSettleUpDialogOpen = !this.isSettleUpDialogOpen;
    },
    openRemindDialog(user) {
      this.selectedUserState = user;
      this.isRemindDialogOpen = !this.isRemindDialogOpen;
    },
    closeRemindDialog() {
      this.isRemindDialogOpen = !this.isRemindDialogOpen;
    },
    openRateDialog(user) {
      this.selectedUserState = user;
      this.isRateDialogOpen = !this.isRateDialogOpen;
    },
    closeRateDialog() {
      this.isRateDialogOpen = !this.isRateDialogOpen;
    },
    openRemoveDialog(user) {
      this.selectedUserState = user;
      this.isRemoveDialogOpen = !this.isRemoveDialogOpen;
    },
    closeRemoveDialog() {
      this.isRemoveDialogOpen = !this.isRemoveDialogOpen;
    },
    settleUp(newUserStatus) {
      this.isSettleUpDialogOpen = !this.isSettleUpDialogOpen;
      this.memberList.forEach((member, id) => {
        if (member.user_id == newUserStatus.userId) {
          this.memberList[id].payment_status = newUserStatus.status;
        }
      });
      window.location.reload();
    },
    removeUser(userId) {
      this.isRemoveDialogOpen = !this.isRemoveDialogOpen;
      let userIdx;
      this.memberList.forEach((member, id) => {
        if (member.user_id == userId) {
          userIdx = id;
        }
      });
      this.memberList.splice(userIdx, 1);
    },
    async handleAnnouncement() {
      console.log(this.announcement);
      if (this.originalAnnouncement == this.announcement) return;
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
        max_count: this.maxCount,
        service_id: this.serviceId,
        plan_name: this.planName,
        is_public: this.isPublic,
        announcement: this.announcement,
      });
    },
  },
  beforeMount() {
    this.roomId = this.$route.params.id;
  },
  async mounted() {
    console.log("router id", this.$route.params);
    this.roomId = this.$route.params.id;
    // console.log("roomid", this.roomId);
    const axiosClient = axios.create({
      baseURL: api,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
        accept: "application/json",
      },
    });
    const { data } = await axiosClient.get(`/rooms/${this.roomId}`);
    console.log("original data", data);
    if (data) {
      const email = localStorage.getItem("email");
      if (email.toLowerCase() == data.admin.email.toLowerCase()) {
        this.isAdmin = true;
      }
      this.serviceId = data.service_id;
      this.serviceName = data.service_name;
      this.planName = data.plan_name;
      this.isPublic = data.is_public;
      this.maxCount = data.max_count;
      this.roundInfo = data.round;
      this.admin = data.admin;
      this.memberList = data.members;
      this.originalAnnouncement = data.announcement;
      this.announcement = data.announcement;
      this.paymentFee = data.payment_fee;
      console.log("payment" + this.paymentFee);

      if (data.round.payment_deadline != "") {
        this.isInRound = true;
        this.interval = Number(data.round.round_interval);
        this.timelineBoard.paymentDeadline = data.round.payment_deadline;
        this.timelineBoard.interval = data.round.round_interval + " month";
        this.timelineBoard.date =
          data.round.starting_time + "  ->  " + data.round.ending_time;
      }

      this.memberList = this.memberList.filter(
        (member) =>
          member.user_name.toLowerCase() != this.admin.name.toLowerCase()
      );
      if (!this.isAdmin) {
        let idx;
        this.memberList.forEach((member, id) => {
          console.log("member", member.user_id);
          console.log("userId in storage", localStorage.getItem("userId"));
          if (member.user_id == localStorage.getItem("userId")) {
            idx = id;
          }
        });

        this.memberList[idx].user_name = "You";
        const youData = this.memberList[idx];
        this.memberList.splice(idx, 1);
        this.memberList.unshift(youData);
        console.log("list", this.memberList);
      }
    }
  },
};
</script>

<style lang="less" scoped>
#info {
}
.info-container {
  width: 100%;
  height: 300px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  // flex-wrap: wrap;
}
.info-left {
  // width: 50%;
  margin-right: 18px;
  height: 100%;
}
.info-main {
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .info-title {
    width: 100%;
    color: #000000;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .info-service-name {
      white-space: nowrap;
      font-weight: 700;
      font-size: 30px;
      margin-right: 8%;
    }
    .info-level {
      font-size: 30px;
      margin-right: 8%;
      font-weight: 400;
    }
    .anticon {
      font-size: 25px;
      cursor: pointer;
    }
  }
  .info-setting-btn {
    width: 100%;
    margin-top: 20px;
    white-space: nowrap;
  }
  .btn-setting {
    margin-right: 20px;
    color: #000000;
  }
  .btn-primary {
    height: 40px;
    width: 130px;
    // margin-top: 100px;
    margin-bottom: 20px;
    // margin-right: 25px;
    border-radius: 50px;
    padding: 8px, 16px, 8px, 16px;
    font-weight: bold;
  }
  .btn-primary-long {
    height: 40px;
    width: 240px;
    // margin-top: 100px;
    margin-bottom: 20px;
    margin-right: 25px;
    border-radius: 50px;
    padding: 8px, 16px, 8px, 16px;
    font-weight: bold;
  }
}

.info-plan {
  height: 70%;
  margin-top: 30px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .info-plan-detail-mobile {
    display: none;
  }

  .info-plan-detail-container {
    // margin-top: 40px;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    .info-plan-label-container {
      margin-right: 30%;
    }

    .info-plan-label,
    .info-plan-date {
      margin-top: 20px;
      white-space: nowrap;
    }
  }
}

.info-right {
  // background-color: blue;
  width: 70%;
  height: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  .info-card {
    width: 32%;
    height: 97%;
    border: #d9d9d9 solid 1px;
    border-radius: 10px;
    padding: 30px 3.5%;
    color: #828282;

    .info-card-title {
      font-size: 16px;
      margin-bottom: 10%;
    }
    textarea {
      width: 100%;
      height: 60%;
      border-color: #d9d9d9;
      border-radius: 2px;
    }
    .info-import-btn-container {
      // margin-top: 70px;
      width: 100%;

      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      .btn-import-info {
        border-radius: 50px;
        margin: 5px 0;
      }
    }
  }
  .info-announce {
    min-width: 170px;
    margin-right: 20px;
    .text {
      height: 60%;
    }
    .btn-announce-container {
      display: flex;
      justify-content: flex-end;
      .btn-announce {
        border-radius: 50px;
        margin: 5px 0;
      }
    }
  }
  .info-admin {
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
  .info-card-content {
    height: 70%;
    .info-profile-name {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 50px;
        margin-right: 20px;
      }
    }
    .info-profile-contact {
      margin-top: 10px;
      div {
        margin-top: 20px;
      }
    }
  }
}
.info-table {
  width: 100%;
  margin-top: 40px;
  .info-table-user {
    img {
      width: 50px;
      margin-right: 15px;
      margin-bottom: 10px;
    }
    span {
      white-space: nowrap;
    }
  }
  .info-table-state {
  }
  // .info-table-action {
  //   width: 50%;
  // }

  .btn-action {
    font-weight: normal;
    border-radius: 50px;
    width: 130px;
    margin: 5px 0;
    margin-right: 15px;
  }
}
@media screen and (min-width: 768px) and (max-width: 915px) {
  .info-container {
    height: 350px;
    .info-left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      .info-main {
        height: 50%;
        .info-title {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
        }
        .info-setting-btn {
          margin-top: 25px;
        }
      }

      .info-plan {
        height: 50%;
        margin-top: 0;
        .info-plan-label-container {
          margin-right: 10%;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  #info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
  }
  .info-container {
    width: 100%;
    height: auto;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: nowrap;
    .info-title {
      flex-wrap: wrap;
    }

    .info-plan-detail-container {
      display: none;
    }
    .info-plan-detail-mobile {
      display: block;
      .info-plan-detail {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .info-plan-label {
          margin-right: 20px;
        }
      }
    }

    .btn-setting {
      margin-right: 15px;
      color: #000000;
    }

    .btn-primary {
      width: 110px;
    }

    .info-left {
      height: auto;
      .info-main {
        height: auto;
        .info-setting-btn {
          margin-top: 25px;
        }
        button {
          margin-bottom: 0;
        }
      }
      .info-plan {
        margin-top: 40px;

        .info-plan-detail-container {
          padding-left: 18px;
        }
        .info-plan-label-container {
          margin-right: 20px;
        }
        .info-plan-label,
        .info-plan-date {
          margin-top: 0;
          margin-bottom: 20px;
        }
      }
    }

    .info-right {
      width: 100%;
      margin-top: 20px;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      textarea {
        height: 100px;
        margin-bottom: 10px;
      }

      .info-card {
        margin-bottom: 20px;
      }
      .info-card-title {
        margin-bottom: 15px;
      }
      .info-announce,
      .info-admin {
        width: 100%;
        min-width: none;
        padding: 20px;
        height: auto;

        .info-card-content {
          height: 120px;
        }
      }
    }
  }
}
</style>
