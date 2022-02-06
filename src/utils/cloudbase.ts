import cloudbase from '@cloudbase/js-sdk'

const app = cloudbase.init({
  env: 'wzmxx-cloudbase-6gq43u4scecde6fc'
})

export const auth = app.auth({
  persistence: 'local'
})
