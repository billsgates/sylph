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
      <div>
        <span class="text">{{ $t(`send_payment_reminder_email_to`) }}</span>
        <img :src="user" />
        <span class="user-name">{{ userState.user_name }} </span>
        <span>?</span>
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
          key="send"
          type="primary"
          @click="mailTo()"
        >
          {{ $t(`send`) }}
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
    mailTo() {
      window.open("mailto:");
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
    margin-right: 20px;
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
    height: 220px;

    img {
      margin: 10px 10px 0 0;
    }
    .btn-container {
      margin-top: 40px;
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
