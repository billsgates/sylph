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
              class="btn-primary btn-setting"
              style="{width:214px;}"
              v-show="isAdmin"
              v-if="!(this.memberCount == this.maxCount)"
              disabled
            >
              {{ $t(`go`) }}
            </a-button>

            <a-button
              v-else
              class="btn-primary btn-setting"
              style="{width:214px;}"
              type="primary"
              v-show="isAdmin"
              @click="startRoom()"
            >
              {{ $t(`go`) }}
            </a-button>

            <a-button
              class="btn-primary btn-setting"
              style="{width:214px;}"
              v-show="isAdmin"
              @click="deleteRoom()"
            >
              {{ $t(`delete_room`) }}
            </a-button>
          </div>
        </div>
        <div class="info-plan">
          <div class="info-plan-detail-container">
            <div class="info-plan-label-container">
              <div class="info-plan-label">{{ $t(`matching_deadline`) }}</div>
              <div class="info-plan-label">{{ $t(`plan_price`) }}</div>
              <div class="info-plan-label">{{ $t(`member`) }}</div>
            </div>
            <div class="info-plan-date-container">
              <div class="info-plan-date">
                {{ MatchingDeadline }}
              </div>
              <div class="info-plan-date">
                {{ planPrice }}
              </div>
              <div class="info-plan-date">
                {{ memberCount }}/ {{ maxCount }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info-table">
      <a-table
        :columns="columns"
        :data-source="memberList"
        rowKey="user_id"
        :locale="emptyText"
      >
        <span slot="customUser">{{ $t(`user`) }}</span>
        <span slot="customDate">{{ $t(`application_date`) }}</span>
        <span slot="customAction">{{ $t(`action`) }}</span>

        <span slot="user_name" slot-scope="text" class="info-table-user">
          <img :src="user" />
          {{ text.user_name }}
        </span>
        <span slot="action" slot-scope="record" class="info-table-action">
          <div>
            <a-button
              v-if="!record.is_accepted"
              v-show="isAdmin"
              type="primary"
              class="btn-action"
              @click="applyAccept(record.user_id)"
            >
              <a-icon type="user-add" /> {{ $t(`accept`) }}
            </a-button>

            <a-button v-else type="primary" class="btn-action" disabled>
              <a-icon type="user-add" /> {{ $t(`accepted`) }}
            </a-button>

            <div v-show="!record.is_accepted && !isAdmin">
              {{ $t(`pending`) }}
            </div>

            <a-button
              v-show="isAdmin"
              type="default"
              class="btn-action"
              :disabled="record.is_accepted"
              @click="openRemoveDialog(record)"
            >
              <a-icon type="delete" />{{ $t(`remove`) }}</a-button
            >
          </div>
        </span>
      </a-table>
    </div>
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
import RemoveDialog from "./RemoveDialog";
const axiosClient = axios.create({
  baseURL: api,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
    accept: "application/json",
  },
});
export default {
  components: {
    RemoveDialog,
  },
  data() {
    return {
      userName: localStorage.getItem("name"),
      user,
      emptyText: {
        emptyText: this.$t(`waiting_for_new_friends_to_join`),
      },
      roomId: "",
      selectedUserState: {},
      isAdmin: false,
      serviceId: 0,
      serviceName: "",
      planName: "",
      isPublic: false,
      mobile: {
        matchingDeadline: '<div style="padding-left: 85px;">-</div>',
        planPrice: '<div style="padding-left: 150px;">-</div>',
        memberCount: '<div style="padding-left: 168px;">-</div>',
      },
      maxCount: 0,
      roundInfo: {},
      memberList: [],
      memberCount: 0,
      admin: {},
      MatchingDeadline: "-",
      planPrice: 0,
      isRemoveDialogOpen: false,
      // data,
      columns: [
        {
          key: "user_name",
          width: "21%",
          slots: { title: "customUser" },
          scopedSlots: { customRender: "user_name" },
        },
        {
          key: "application_date",
          width: "24%",
          slots: { title: "customDate" },
          dataIndex: "application_date",
          scopedSlots: { customRender: "application_date" },
        },
        {
          key: "action",
          width: "55%",
          slots: { title: "customAction" },
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  methods: {
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
    startRoom() {
      const response = axiosClient.post(`/rooms/${this.roomId}/start`);
      if (response.status == 201) {
        console.log(this.roomId);
      }
      this.$router.push(`/Info/${this.roomId}`);
    },
    applyAccept(userId) {
      if (this.memberCount == this.maxCount) {
        alert("the room is full");
      } else {
        this.memberList.forEach((ele) => {
          if (ele.user_id == userId) {
            ele.is_accepted = true;
          }
        });
        const { data } = axiosClient.post(`/application/accept`, {
          room_id: parseInt(this.roomId),
          user_id: userId,
        });
        if (data) {
          console.log(data);
          this.memberCount += 1;
        }
      }
    },
    openRemoveDialog(user) {
      this.selectedUserState = user;
      this.isRemoveDialogOpen = !this.isRemoveDialogOpen;
    },
    closeRemoveDialog() {
      this.isRemoveDialogOpen = !this.isRemoveDialogOpen;
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
  },
  beforeMount() {
    this.roomId = this.$route.params.id;
  },
  async mounted() {
    console.log("router id", this.$route.params);
    this.roomId = this.$route.params.id;
    const axiosClient = axios.create({
      baseURL: api,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
        accept: "application/json",
      },
    });
    var { data } = await axiosClient.get(`/rooms/${this.roomId}/application`);
    if (data) {
      console.log(data);
      this.memberList = JSON.parse(JSON.stringify(data.data));
    }
    data = await (await axiosClient.get(`/rooms/${this.roomId}`)).data;
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
      this.planPrice = data.payment_fee;
      this.memberCount = data.members.length;
      this.MatchingDeadline = data.matching_deadline;
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

  .info-plan-detail-container {
    // margin-top: 40px;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    .info-plan-label-container {
      margin-right: 70%;
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

      .info-import-btn {
        font-size: 14px;
        color: #000000;
        width: 132px;
        height: 32px;
        border: #d9d9d9 solid 1px;
        border-radius: 50px;
        cursor: pointer;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
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
          margin-right: 50%;
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
    .info-left {
      width: 100%;
    }
    .info-title {
      flex-wrap: wrap;
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
