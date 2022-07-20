<template>
  <div class="xbuy-event-play-rule">
    <div class="rule-title pf-medium">活动玩法</div>
    <div class="rule-contents">
      <div class="rule-content">
        <img
          class="rule-image"
          src="@/assets/images/xbuy-event/icon-play-rule-1.png"
        />
        <div class="rule-text">邀好友助力</div>
      </div>
      <img
        class="rule-arrow"
        src="@/assets/images/xbuy-event/icon-play-rule-arrow.png"
      />
      <div class="rule-content">
        <img
          class="rule-image"
          src="@/assets/images/xbuy-event/icon-play-rule-2.png"
        />
        <div class="rule-text">助力成功</div>
      </div>
      <img
        class="rule-arrow"
        src="@/assets/images/xbuy-event/icon-play-rule-arrow.png"
      />
      <div class="rule-content">
        <img
          class="rule-image"
          src="@/assets/images/xbuy-event/icon-play-rule-3.png"
        />
        <div class="rule-text">发放优惠券</div>
      </div>
      <img
        class="rule-arrow"
        src="@/assets/images/xbuy-event/icon-play-rule-arrow.png"
      />
      <div class="rule-content">
        <img
          class="rule-image"
          src="@/assets/images/xbuy-event/icon-play-rule-4.png"
        />
        <div class="rule-text">抢购价购买</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.xbuy-event-play-rule {
  padding: 28px 24px 32px;
  .rule-title {
    font-size: 30px;
    color: #121212;
    line-height: 40px;
    margin-bottom: 29px;
  }
  .rule-contents {
    display: flex;
    justify-content: space-between;
    .rule-content {
      .rule-image {
        display: block;
        width: 60px;
        height: 60px;
        margin: 0 auto 12px;
      }
      .rule-text {
        font-size: 24px;
        color: #333333;
        line-height: 32px;
      }
    }
    .rule-arrow {
      display: block;
      width: 32px;
      height: 32px;
      margin-top: 14px;
    }
  }
}
</style>
