<template>
  <div id="online">
    <div class="online-button-container">
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
      <div class="online-search">
        <a-icon
          slot="prefix"
          type="search"
          class="input-icon"
          style="font-size:18px; margin-right: 12px"
        />
        <input
          class="online-input"
          v-model="searchText"
          placeholder="  Search Plan"
          style="width: 200px; border: none;"
        />
      </div>
    </div>
    <div class="online-table">
      <a-table :columns="columns" :data-source="rooms" rowKey="room_id">
        <span slot="customAdmin">{{ $t(`admin_title`) }}</span>
        <span slot="customPlan">{{ $t(`plan_title`) }}</span>
        <span slot="customPrice">{{ $t(`plan_price`) }}</span>
        <span slot="customDeadline">{{ $t(`matching_deadline`) }}</span>
        <span slot="customMembers">{{ $t(`members`) }}</span>
        <span slot="customMessage">{{ $t(`message`) }}</span>
        <span slot="customAction">{{ $t(`action`) }}</span>

        <span slot="admin_name" slot-scope="text" class="online-table-user">
          <a-space align="center">
            <img :src="user" />
            <a-space direction="vertical">
              {{ text.admin_name }}
              <div>
                {{ text.admin_rating }}
                <a-icon type="star" theme="twoTone" two-tone-color="#F2C94C" />
              </div>
            </a-space>
          </a-space>
        </span>

        <span slot="plan_name" slot-scope="text" class="online-table-user">
          {{ text.service_name }} - {{ text.plan_name }}
        </span>

        <span slot="cost" slot-scope="text" class="online-table-user">
          NT$ {{ text.cost }} / {{ $t(`month`) }}
        </span>

        <span slot="mem" slot-scope="text" class="online-table-user">
          {{ text.member_count }} / {{ text.max_count }}
        </span>

        <span slot="action" slot-scope="text" class="online-table-action">
          <a-button
            type="primary"
            class="btn-action"
            :disabled="
              text.isApply ||
                text.member_count == text.max_count ||
                 String(text.admin_name).toLowerCase() == String(userName).toLowerCase()
            "
            @click="() => applyJoinRoom(text.room_id)"
          >
            {{ $t(`apply`) }}
          </a-button>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import user from "../assets/user.png";
import api from "../api";
import AddRoomDialog from "./AddRoomDialog";
import axios from "axios";

export default {
  name: "Main",
  components: {
    AddRoomDialog,
  },
  data() {
    return {
      bufferRoom:[],
      searchText:"",
      userName: localStorage.getItem("name"),
      publicRoom: [],
      user,
      addModalVisible: false,
      // data,
      columns: [
        {
          key: "admin_name",
          width: "15%",
          slots: { title: "customAdmin" },
          scopedSlots: { customRender: "admin_name" },
        },
        {
          key: "plan_name",
          width: "15%",
          slots: { title: "customPlan" },
          scopedSlots: { customRender: "plan_name" },
        },
        {
          key: "cost",
          width: "15%",
          slots: { title: "customPrice" },
          scopedSlots: { customRender: "cost" },
        },
        {
          key: "time",
          width: "15%",
          dataIndex: "matching_deadline",
          slots: { title: "customDeadline" },
          scopedSlots: { customRender: "time" },
        },
        {
          key: "mem",
          width: "9%",
          slots: { title: "customMembers" },
          scopedSlots: { customRender: "mem" },
        },
        {
          key: "mes",
          width: "15%",
          dataIndex: "public_message",
          slots: { title: "customMessage" },
          scopedSlots: { customRender: "mes" },
        },
        {
          key: "action",
          width: "15%",
          slots: { title: "customAction" },
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  computed: {
    rooms: function() {
      return JSON.parse(JSON.stringify(this.publicRoom));
    },
  },
  watch: {
    publicRoom: {
      handler() {
        console.log("watch");
      },
      deep: true,
    },
    searchText:{
      handler(){
        let allRoom = this.publicRoom.concat(this.bufferRoom)
        this.publicRoom = []
        this.bufferRoom = []
        allRoom.forEach(ele => {
          if(ele.plan_name.toLowerCase().includes(this.searchText.toLowerCase()) || 
            ele.service_name.toLowerCase().includes(this.searchText.toLowerCase())){
            this.publicRoom.push(ele)
          }
          else{
            this.bufferRoom.push(ele)
          }
        })
      }
    }
  },
  methods: {
    openAddRoomModal() {
      this.addModalVisible = true;
    },
    closeAddRoomModal(val) {
      this.addModalVisible = val;
    },
    getPublicRoom() {
      fetch(api + "/rooms/public", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          response.data.forEach((ele) => {
            console.log(ele)
            let roomObj = {
              room_id: ele.room_id,
              admin_name: ele.admin_name,
              admin_rating: ele.admin_rating,
              service_name: ele.service_name,
              plan_name: ele.plan_name,
              cost: ele.cost,
              max_count: ele.max_count,
              member_count: ele.member_count,
              isApply: ele.is_applied,
              public_message: ele.public_message,
              matching_deadline: ele.matching_deadline,
            };
            this.publicRoom.push(roomObj);
          });
        });
    },
    async applyJoinRoom(roomId) {
      const axiosClient = axios.create({
        baseURL: api,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
          accept: "application/json",
        },
      });
      const res = await axiosClient.post(`/rooms/${roomId}/application`, {
        application_message: "let me in plz",
      });
      if (res.status == 200) {
        let roomIdx;
        this.publicRoom.forEach((room, id) => {
          if (room.room_id == roomId) {
            roomIdx = id;
          }
        });
        this.publicRoom[roomIdx].isApply = true;
      }
    },
  },
  mounted: function() {
    this.getPublicRoom();
  },
};
</script>
<style lang="less" scoped>
#online {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.online-button-container {
  width: 50%;
  margin-bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .addroom-btn {
    margin-right: 15%;
  }

  .online-search {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #c4c4c4;
    .online-input {
      margin-right: 20px;
      margin-top: 20px;
      margin-bottom: 20px;
      border: none;
      outline: none;
      color: black;
      .ant-input {
        border: none;
      }

      .input-icon {
        margin-right: 12px;
        width: 18px;
      }
    }
    ::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #c4c4c4;
      opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #c4c4c4;
    }

    ::-ms-input-placeholder {
      /* Microsoft Edge */
      color: #c4c4c4;
    }
  }
}
.online-container {
  width: 100%;
  height: 300px;
}
.online-table {
  // background-color: green;
  width: 1200px;
  margin-top: 20px;
  .online-table-user {
    img {
      width: 50px;
      margin-right: 15px;
    }
  }
  .online-table-state {
  }
  // .online-table-action {
  //   width: 50%;
  // }
  .btn-action {
    font-weight: normal;
    border-radius: 50px;
    width: 130px;
    margin: 5px 0;
    // margin-right: 15px;
  }
}
.btn-primary {
  height: 40px;
  width: 130px;
  border-radius: 50px;
  color: black;
  font-weight: bold;
  margin-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
@media screen and (max-width: 720px) {
  .online-table {
    .online-table-user {
      img {
        display: none;
      }
    }
  }
  .online-table {
    .btn-action {
      padding: 20px 10px;
      width: auto;
      height: auto;
      white-space: normal;
      // margin-right: 0;
    }
  }
}
</style>
