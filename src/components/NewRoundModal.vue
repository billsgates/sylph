<template>
  <a-modal
    v-model="isVisible"
    :footer="null"
    :width="480"
    :closable="false"
    @ok="close"
    @cancel="close"
  >
    <div class="content">
      <div class="item">
        <div class="label">{{ $t(`plan_start`) }}</div>
        <a-date-picker class="date-picker" @change="handleDatePicker" />
      </div>

      <div class="item">
        <div class="label">{{ $t(`interval`) }}</div>
        <a-input placeholder="0" v-model="interval" class="item-input" />
        {{ $t(`a_month`) }}
        <!-- <a-select
          v-model="intervalUnit"
          :default-value="intervalUnitData[0]"
          class="item-input"
        >
          <a-select-option v-for="ele in intervalUnitData" :key="ele">
            {{ ele }}
          </a-select-option>
        </a-select> -->
      </div>

      <div class="item">
        <div class="label">{{ $t(payment_deadline) }}</div>
        <a-input placeholder="0" v-model="deadline" class="item-input" />
        {{ $t(`week`) }}
        <!-- <a-select
          v-model="deadlineUnit"
          :default-value="deadlineUnitData[0]"
          class="item-input"
        >
          <a-select-option v-for="ele in deadlineUnitData" :key="ele">
            {{ ele }}
          </a-select-option>
        </a-select> -->
        <span class="text">{{ $t(`before_start`) }}</span>
      </div>

      <div>
        {{ $t(`the_system_will_email_you_the_new_round_information`) }}
      </div>

      <div class="btn-container">
        <a-button
          class="btn-primary btn-new-round"
          key="Save"
          type="primary"
          @click="createNewRound()"
        >
          {{ $t(`new_round`) }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import api from "../api";
Date.prototype.toISODate = function() {
  return (
    this.getFullYear() +
    "-" +
    ("0" + (this.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + this.getDate()).slice(-2)
  );
};
export default {
  props: {
    visible: { type: Boolean, default: false },
    roomId: { type: String, default: "0" },
  },
  data() {
    return {
      isVisible: false, // default should be false
      date: "",
      interval: 1,
      // intervalUnit: this.$t(`week`),
      // intervalUnitData: [this.$t(`year`), this.$t(`month`), this.$t(`week`)],
      deadline: 1,
      // deadlineUnit: this.$t(`week`),
      // deadlineUnitData: [this.$t(`year`), this.$t(`month`), this.$t(`week`)],
      isAddedToGoogleCalendar: false,
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
    handleDatePicker(date, dateString) {
      this.date = dateString;
      console.log(date, dateString);
    },
    handleGoogleCalendar() {
      this.isAddedToGoogleCalendar = !this.isAddedToGoogleCalendar;
    },
    createNewRound() {
      const new_round = {
        starting_time: this.date,
        round_interval: Number(this.interval),
        payment_deadline: this.deadline,
        is_add_calendar: this.isAddedToGoogleCalendar,
      };
      fetch(api + "/rooms/" + this.roomId + "/round", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(new_round),
      })
        .then((res) => {
          if (res.status == 201) {
            this.close();
            this.$emit("setboard");
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 518px;
  padding: 26px;
  font-size: 16px;

  .item {
    margin-bottom: 50px;
    .item-input {
      width: 110px;
      margin-right: 15px;
    }

    .label {
      margin-bottom: 10px;
    }

    .date-picker {
      width: 256px;
    }

    .text {
      margin-left: 0px;
    }
  }

  .btn-container {
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

    .btn-new-round {
      margin-top: 50px;
    }
  }
}
@media screen and (max-width: 600px) {
  .content {
    height: 550px;
    padding: 26px;
    font-size: 16px;
    .item {
      margin-bottom: 20px;

      .item-input {
        width: 110px;
        margin-right: 15px;
        margin-bottom: 10px;
      }

      .date-picker {
        width: 200px;
      }
    }
  }
}
</style>
