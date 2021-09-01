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
      <div class="content-detail-container">
        <div class="content-detail">
          <img :src="user" />
          <span class="user-name text">{{ userState.user_name }} </span>
        </div>
        <a-rate v-model="rating" allow-half />
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
          class="btn-primary"
          key="save"
          type="primary"
          @click="close()"
        >
          {{ $t(`save`) }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import user from "../assets/user.png";
export default {
  props: {
    visible: { type: Boolean, default: false },
    userState: {
      type: Object,
      default: function() {
        return { payment_status: "", user_name: "" };
      },
    },
  },
  data() {
    return {
      user,
      isVisible: false, // default should be false
      rating: 0,
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
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 194px;
  padding: 26px;
  font-size: 16px;

  .text {
    margin-right: 30px;
  }
  img {
    width: 50px;
    margin-right: 10px;
  }

  .user-name {
    margin-right: 30px;
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
  }
}
@media screen and (max-width: 720px) {
  .content {
    height: 215px;
    padding: 25px 15px;
    .content-detail-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .content-detail {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        img {
          margin-right: 10px;
          margin-bottom: 15px;
        }
        span {
          margin: 0;
          margin-bottom: 15px;
          white-space: nowrap;
        }
      }
    }

    .btn-container {
      margin-top: 30px;
      .btn-primary {
        width: 80px;
      }
      .btn-cancel {
        margin-right: 15px;
      }
    }
  }
}
</style>
