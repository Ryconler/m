<template>
  <div class="login">
    <h1 class="pf-medium">快捷登录</h1>
    <VanForm ref="loginForm" @submit="submit">
      <VanField
        v-model="phoneNumber"
        name="手机号"
        type="tel"
        label="手机号"
        placeholder="未注册过手机号将自动注册"
        :rules="[
          {
            pattern: phonePattern,
            message: '请输入正确的手机号'
          }
        ]"
        @update:model-value="phoneUpdate"
      />
      <VanField
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <VanField
        v-if="loginText == '注册'"
        v-model="phoneCode"
        name="短信验证码"
        label="短信验证码"
        placeholder="短信验证码"
        :rules="[{ required: true, message: '请输入短信验证码' }]"
      >
        <template #button>
          <div class="send-btn" @click="sendClick">{{ sendText }}</div>
        </template></VanField
      >
      <div style="margin: 16px">
        <VanButton
          class="submit-btn"
          round
          block
          type="primary"
          native-type="submit"
          :color="loginText == '注册' ? '#ff5900' : ''"
        >
          {{ loginText }}
        </VanButton>
      </div>
    </VanForm>
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue'
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  Toast
} from 'vant'
import { auth, localStore } from '@/utils'
import { STORAGE_KEYS } from '@/constant/storage'
import { checkUserExist } from '@/api/common'
import { useRoute } from 'vue-router'

const phoneNumber = ref('')
const phonePattern = ref(/^1[0-9]{10}$/)
const password = ref('')
const phoneCode = ref('')
const sendText = ref('获取验证码')
const loginText = ref('登录')

const phoneUpdate = (val: string) => {
  if (val.length == 11) {
    checkUserExist(val).then((res) => {
      if (res) {
        loginText.value = '登录'
      } else {
        loginText.value = '注册'
      }
    })
  }
}

let sendTime = localStore.getItem(STORAGE_KEYS.SEND_TIME)
const nowTime = Date.now()
if (sendTime) {
  let diffTime = nowTime - sendTime
  if (diffTime < 60 * 1000) {
    countDown(Math.floor(diffTime / 1000))
  }
}

function countDown(time: number) {
  sendText.value = `${time}s`
  const interval = setInterval(() => {
    sendText.value = `${--time}s`
    if (time <= 0) {
      clearInterval(interval)
      sendText.value = '获取验证码'
    }
  }, 1000)
}

const loginForm: Ref<any> = ref(null)
const sendClick = () => {
  if (sendText.value == '获取验证码' && loginForm.value) {
    loginForm.value.validate('手机号').then(() => {
      sendTime = Date.now()
      localStore.setItem(STORAGE_KEYS.SEND_TIME, sendTime)
      countDown(60)
      // 发送短信验证码
      auth.sendPhoneCode(phoneNumber.value)
    })
  }
}

const route = useRoute()
const submit = () => {
  function goBack() {
    const referrer =
      route.query.referrer || document.referrer || '//m.wzmxx.com'
    location.href = decodeURIComponent(referrer.toString())
  }
  if (loginText.value == '登录') {
    auth
      .signInWithPhoneCodeOrPassword({
        phoneNumber: phoneNumber.value,
        password: password.value
      })
      .then(() => {
        Toast('登录成功')
        setTimeout(() => {
          goBack()
        }, 1000)
      })
      .catch(() => {
        Toast(`登录失败\n请检查手机号/密码是否填写正确`)
      })
  } else if (loginText.value == '注册') {
    auth
      .signUpWithPhoneCode(phoneNumber.value, phoneCode.value, password.value)
      .then(() => {
        Toast('注册成功')
        setTimeout(() => {
          goBack()
        }, 1000)
      })
      .catch(() => {
        Toast(`注册失败\n请检查短信验证码是否填写正确`)
      })
  }
}
</script>
<style scoped lang="scss">
.login {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #ffffff;
  h1 {
    padding: 50px 24px 80px;
    font-size: 60px;
  }
  .van-cell {
    padding: 24px;
    :deep(*) {
      font-size: 30px;
    }
    :deep(.van-field__label) {
      color: #121212;
    }
    :deep(.van-field__error-message) {
      margin-top: 10px;
      font-size: 20px;
    }
    .send-btn {
      color: #666666;
    }
  }
  .submit-btn {
    height: 80px;
  }
}
</style>
