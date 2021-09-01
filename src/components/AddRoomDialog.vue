<template>
  <div id="components-modal-demo-position">
    <a-modal
      v-model="isVisible"
      centered
      @ok="closeModal"
      @cancel="closeModal"
      :footer="null"
      :width="480"
      :body-style="{ padding: '40px', paddingTop: '40px', height: '542px' }"
    >
      <div v-show="!next_page" id="add-first-stage">
        <div class="ard-block-container">
          <p>{{ $t(`plan_select`) }} <span class="star">*</span></p>
          <div class="plan-type">
            <DropDown
              class="dropdown"
              :title="this.select.platforms"
              :menulist="platforms"
              @selectValue="selectPlatform"
            />
            <DropDown class="dropdown" v-if="!isSelect" disabled />
            <DropDown
              class="dropdown"
              v-else
              :title="this.select.plans"
              :menulist="plans"
              @selectValue="selectPlan"
            />
          </div>
        </div>
        <div class="ard-block-container">
          <p>{{ $t(`plan_price`) }}</p>
          <div class="plan-type plan-price">
            <a-space :size="15" align="baseline">
              <p class="ard-text">NT</p>
              <!-- <DropDown
            disabled
            class="dropdown currency"
            title="NT"
            :menulist="currency"
            @selectValue="
              (val) => {
                this.select.currency = val.value;
              }
            "
          /> -->
              <a-input-number
                class="input"
                disabled
                v-model="this.select.price"
                :min="0"
              />
              <p>/</p>
              <p>month</p>
              <!-- <DropDown
            class="dropdown time"
            :title="$t(`${this.select.timeSlot}`)"
            :menulist="timeSlot"
            @selectValue="
              (val) => {
                this.select.timeSlot = val.value;
              }
            "
          /> -->
            </a-space>
          </div>
        </div>
        <div class="ard-block-container">
          <p>{{ $t(`split`) }}</p>
          <a-space :size="15" align="baseline">
            <a-input-number
              v-model="this.select.peoplecnt"
              :min="1"
              :max="this.select.max_count"
              @change="selectPeople"
            />
            <p>{{ $t(`people`) }}</p>
          </a-space>
        </div>
        <div style="margin-top:40px;">
          <a-checkbox
            :checked="this.select.public"
            @change="(val) => (this.select.public = !this.select.public)"
          >
            {{ $t(`find_memebers_online`) }}
          </a-checkbox>
        </div>
        <div class="ard-button-container">
          <a-button
            class="btn-primary"
            key="add Room"
            type="primary"
            @click="checkPublic()"
          >
            + {{ $t(`add_room`) }}
          </a-button>
        </div>
      </div>
      <div v-show="next_page" id="add-second-stage">
        <AddRoomPublic
          @setPublic="() => (this.next_page = false)"
          @addPublicDetail="(val) => addPublicDetail(val)"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
import DropDown from "./DropDown";
import api from "../api";
import AddRoomPublic from "../components/AddRoomPublic";
export default {
  components: {
    DropDown,
    AddRoomPublic,
  },
  props: { visible: { type: Boolean, default: false } },
  data() {
    return {
      next_page: false,
      select: {
        serviceId: -1,
        platforms: "Platforms",
        plans: "Plan",
        price: 0,
        timeSlot: "month",
        currency: "NT",
        peoplecnt: 1,
        max_count: 1,
        public: false,
        matching_deadline: "",
        message: "",
      },
      isSelect: false,
      isVisible: false,
      platforms: [],
      plans: [],
      currency: [
        {
          id: 1,
          value: "NT",
        },
        {
          id: 2,
          value: "US",
        },
      ],
      timeSlot: [
        {
          id: 1,
          value: this.$t(`year`),
        },
        {
          id: 2,
          value: this.$t(`month`),
        },
        {
          id: 3,
          value: this.$t(`week`),
        },
        {
          id: 4,
          value: this.$t(`day`),
        },
      ],
    };
  },
  methods: {
    addPublicDetail(val) {
      console.log(val);
      this.select.matching_deadline = val.deadline,
      this.select.message = val.message;
      console.log(this.select.message);
      this.createRoom();
    },
    checkPublic() {
      if (this.select.public == true) {
        this.next_page = true;
      } else {
        this.createRoom();
      }
    },
    selectPeople(val) {
      if (val < this.select.max_count) {
        this.select.peoplecnt = val;
      } else {
        this.select.peoplecnt = this.select.max_count;
      }
    },
    selectPlan(val) {
      this.select.plans = val.value;
      this.select.price = this.plans[val.id - 1].cost;
      this.select.max_count = this.plans[val.id - 1].max_count;
    },
    selectPlatform(val) {
      this.select.platforms = val.value;
      this.select.serviceId = val.id;
      var cnt = 1;
      this.plans = [];
      this.platforms[val.id - 1].plans.forEach((ele) => {
        this.plans.push({
          id: cnt,
          value: ele.plan_name,
          cost: ele.cost,
          max_count: ele.max_count,
        });
        cnt += 1;
      });
      this.isSelect = true;
    },
    closeModal() {
      this.isVisible = false;
      this.$emit("closeAddModal");
      // this.isVisible = false;
    },
    goToInfoPage() {
      this.$router.push("/Info");
    },
    getServicesforModal() {
      fetch(api + "/services", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          const data = response.data;
          data.forEach((ele) => {
            var plans = [];
            ele.plans.forEach((e) => {
              plans.push({
                plan_name: e.plan_name,
                cost: e.cost,
                max_count: e.max_count,
              });
            });
            this.platforms.push({
              id: ele.id,
              value: ele.name,
              plans: plans,
            });
          });
        })
        .catch((err) => {
          console.log(err);
          this.platforms = [{ id: 1, name: "Netflix" }];
        });
    },
    getServicesPlan(id) {
      fetch(api + "/services/" + id.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((response) => response.json());
    },
    createRoom() {
      const result = {
        max_count: this.select.peoplecnt,
        service_id: this.select.serviceId,
        plan_name: this.select.plans,
        is_public: this.select.public,
        matching_deadline: this.select.matching_deadline,
        public_message: this.select.message,
      };
      if (this.select.serviceId > -1) {
        console.log(result);
        fetch(api + "/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(result),
        })
          .then((response) => response.json())
          .then((res) => {
            console.log(this.select);
            if (this.select.public) {
              this.$router.push("/ApplyInfo/" + res.room_id.toString());
            } else {
              this.$router.push("/Info/" + res.room_id.toString());
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  watch: {
    visible: function(val) {
      this.isVisible = val;
    },
  },
  created() {},
  mounted() {
    this.getServicesforModal();
  },
};
</script>
<style scoped>
.ard-text {
  height: 32px;
  margin-right: 10px;
}
.ard-input {
  height: 32px;
  width: 109px;
  border-radius: 2px;
}
.ard-button-container {
  justify-content: flex-end;
  display: flex;
  padding: 0px;
  margin-top: 40px;
}
.ard-modal {
  padding-top: "30px";
  padding-left: "50px";
  padding-right: "50px";
  height: "1080px";
}
.ard-space {
  justify-content: space-between;
}
.ard-block-container {
  margin-bottom: 30px;
}
.star {
  margin-left: 5px;
}
p {
  margin: 0px;
  margin-bottom: 10px;
}
.btn-primary {
  height: 40px;
  width: 130px;
  border-radius: 50px;
  color: black;
  font-weight: bold;
}
.plan-type {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.dropdown {
  width: 130px;
  margin-right: 10px;
  margin-bottom: 5px;
}
.currency {
  width: 68px;
  margin-right: 5px;
}
.time {
  margin-left: 5px;
}
.input {
  width: 50px;
  margin-right: 5px;
}
@media screen and (max-width: 440px) {
  .ard-block-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .plan-type {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .dropdown {
    width: 85px;
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .currency {
    width: 68px;
    margin-right: 5px;
  }
  .time {
    margin-left: 5px;
  }
  .input {
    width: 50px;
    margin-right: 5px;
  }
}
@media screen and (max-width: 320px) {
  .plan-price {
    flex-wrap: wrap;
  }
}
</style>
