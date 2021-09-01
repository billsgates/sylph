<template>
  <div>
    <div class="ard-block-container">
    <p>{{ $t(`the_room_will_be_public`) }}</p>
    </div>
    <div class="ard-block-container">
      <p>{{ $t(`matching_deadline`) }}<span class="star">*</span></p>
      <a-date-picker class="date-picker" @change="handleDatePicker" />
    </div>
    <div class="ard-block-container">
      <p>{{ $t(`message`) }}</p>
      <textarea v-model="message"/>
    </div>
    <div class="ard-button-container">
      <a-button
          class="btn-primary btn-cancel"
          key="cancel"
          type="default"
          @click="goBack()"
        >
          {{ $t(`back`) }} 
      </a-button>
      <a-button
        class="btn-primary"
        key="add Room"
        type="primary"
        @click="submit()"
      >
        {{ $t(`submit`) }}
      </a-button>
      
    </div>
  </div>
</template>
<script>
// import api from "../api";
export default {
  props: { visible: { type: Boolean, default: false } },
  data() {
    return {
      deadline:"",
      message:"",
      is_public: true,
    }
  },
  methods: {
    handleDatePicker(date, dateString) {
      this.deadline = dateString;
    },
    goBack(){
      this.$emit("setPublic");
    },
    submit(){
      console.log(String(this.message))
      this.$emit("addPublicDetail", {
        "deadline": this.deadline,
        "message": String(this.message)
      });
    }
  },
  watch: {
    visible: function(val) {
      this.isVisible = val;
    },
  },
  created() {},
};
</script>
<style scoped>
textarea {
  width: 100%;
  height: 200px;
  border-color: #d9d9d9;
  border-radius: 2px;
}
.ard-button-container {
  justify-content: flex-end;
  display: flex;
  padding: 0px;
  margin-top: 40px;
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
  margin-left: 13px;
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
