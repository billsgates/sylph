<template>
  <a-dropdown>
    <a-menu slot="overlay" @click="handleMenuClick">
      <template v-for="item in menulist">
        <a-menu-item :key="item.id">{{ item.value }}</a-menu-item>
      </template>
    </a-menu>
    <div>
      <a-button block>
        {{ select | ellipsis }}
        <a-icon type="down" />
      </a-button>
    </div>
  </a-dropdown>
</template>
<script>
export default {
  props: ["title", "menulist", "disabled"],
  data() {
    return {
      iconType: "user",
      select: this.title,
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (window.matchMedia("(max-width: 440px)").match && value.length > 3) {
        return value.slice(0, 3) + "...";
      }
      return value;
    },
  },
  methods: {
    handleMenuClick(e) {
      this.select = this.menulist[e.key - 1].value;
      this.$emit("selectValue", {
        id: this.menulist[e.key - 1].id,
        value: this.menulist[e.key - 1].value,
      });
    },
  },
  watch: {
    title(newVal) {
      if (newVal) {
        this.select = this.title;
      }
    },
  },
};
</script>
<style scoped>
.dd-button-container {
  justify-content: space-between;
  display: flex;
  width: 109px;
  height: 32px;
}
</style>
