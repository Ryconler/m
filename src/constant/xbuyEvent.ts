import { get } from 'lodash'

/* 活动状态 */
export enum EventStatus {
  Unstarted, //0:未开始
  Inprogress, //1:活动中
  Paused, //2:活动暂停
  Finished //3:活动结束
}
/* 活动助力状态 */
export enum ShareStatus {
  Unshared, //0未助力
  ShareSuccessed, //1助力成功
  ShareFailed, //2助力失败
  Sharing, //3助力进行中
  ShareFinished //4助力已截止
}
/* 助力人助力结果 */
export enum HelpResult {
  HelpSuccess = '1', //助力成功
  HelpRepeat = '410', //重复助力
  HelpLimit = '411', //助力上限
  HelpNoneed = '412' //好友已完成，无需再助力
}
/* 页面访问用户类型 */
export enum UserType {
  Visitor, //游客
  Sharer, //分享人
  Helper //助力人
}
/* 活动字段结构 */
export type EventType = {
  id: number
  isLogin: boolean
  buyed: boolean
  skuId: number
  spuId: number
  skuName: string
  cmmdtyImage: string
  status: EventStatus
  price: number
  promPrice: number
  currTime: string
  startTime: string
  endTime: string
  shareTime: string
  availableInventory: number //可用库存
  assistanceNum: number
  activityTime: number
  activityRule: string //活动规则
  content: string //活动详情
  shareUid: number
  shareStatus: ShareStatus
  hasAssistanceNum: number
  assistanceList: {
    bePhoto: string
    beNickname: string
    beStatus: ShareStatus
    beShareTime: string
  }[] //助力人列表
  templateType2Id: number
  businessId: number
  level4CategoryId: number
  orderId: string
  begin: number
  /* 前端扩展 */
  isSharer?: boolean
  isHelper?: boolean
  helpResult?: HelpResult
  helpMsg?: string
  hzwFirstHelp?: boolean
}

type ConditionType<T> = {
  /* 
    条件规则
    cons: [{a: x, b: y}, {c: z}]
    将转化为
    EventInfo.a == x && EventInfo.b == y || EventInfo.c == z
  */
  value: T //匹配了条件规则后的显示样式
  desc: string //一段描述
  cons: {
    status?: EventStatus
    shareStatus?: ShareStatus
    isSharer?: boolean
    buyed?: boolean
    isHelper?: boolean
    helpResult?: HelpResult
    hzwFirstHelp?: boolean
  }[] //条件规则
}

/* 组件XBuyEventStatus.vue显示不同样式的规则 */
export enum StatusShowType {
  Unknown,
  EventUnstarted, //活动未开始
  HelpOverview, //还需9人助力成功，坚持就是胜利
  Congratulation, //恭喜您 助力成功
  Buyed, //您已购买成功
  NoInventoryWithHelped, //库存已被抢完，带助力进度条
  NoInventory, //库存已被抢完
  FinishedWithHelped, //活动已结束，带助力进度条
  Finished, //活动已结束
  Deadline, //规定时间内助力失败
  Metoo //活动正在抢购中... ，我也要抢
}
export const StatusShowConditions: ConditionType<StatusShowType>[] = [
  {
    value: StatusShowType.EventUnstarted,
    desc: '活动未开始',
    cons: [
      {
        status: EventStatus.Unstarted
      }
    ]
  },
  {
    value: StatusShowType.HelpOverview,
    desc: '还需9人助力成功，坚持就是胜利',
    cons: [
      {
        isSharer: true,
        status: EventStatus.Inprogress,
        shareStatus: ShareStatus.Sharing
      }
    ]
  },
  {
    value: StatusShowType.Congratulation,
    desc: '恭喜您 助力成功',
    cons: [
      {
        isSharer: true,
        buyed: false,
        status: EventStatus.Inprogress,
        shareStatus: ShareStatus.ShareSuccessed
      },
      {
        isSharer: true,
        buyed: false,
        status: EventStatus.Paused,
        shareStatus: ShareStatus.ShareSuccessed
      }
    ]
  },
  {
    value: StatusShowType.Buyed,
    desc: '您已购买成功',
    cons: [
      {
        isSharer: true,
        buyed: true,
        status: EventStatus.Inprogress,
        shareStatus: ShareStatus.ShareSuccessed
      },
      {
        isSharer: true,
        buyed: true,
        status: EventStatus.Paused,
        shareStatus: ShareStatus.ShareSuccessed
      },
      {
        isSharer: true,
        buyed: true,
        status: EventStatus.Finished,
        shareStatus: ShareStatus.ShareSuccessed
      }
    ]
  },
  {
    value: StatusShowType.NoInventoryWithHelped,
    desc: '库存已被抢完，带助力进度条',
    cons: [
      {
        isSharer: true,
        status: EventStatus.Paused,
        shareStatus: ShareStatus.ShareFailed
      }
    ]
  },
  {
    value: StatusShowType.NoInventory,
    desc: '库存已被抢完',
    cons: [
      {
        isSharer: true,
        status: EventStatus.Paused,
        shareStatus: ShareStatus.Unshared
      },
      {
        isHelper: true,
        status: EventStatus.Paused
      }
    ]
  },
  {
    value: StatusShowType.FinishedWithHelped,
    desc: '活动已结束，带助力进度条',
    cons: [
      {
        isSharer: true,
        status: EventStatus.Finished,
        shareStatus: ShareStatus.ShareFailed
      },
      {
        isSharer: true,
        status: EventStatus.Finished,
        shareStatus: ShareStatus.ShareSuccessed,
        buyed: false
      }
    ]
  },
  {
    value: StatusShowType.Finished,
    desc: '活动已结束',
    cons: [
      {
        isSharer: true,
        status: EventStatus.Finished,
        shareStatus: ShareStatus.Unshared
      },
      {
        isHelper: true,
        status: EventStatus.Finished
      }
    ]
  },
  {
    value: StatusShowType.Deadline,
    desc: '规定时间内助力失败',
    cons: [
      {
        isSharer: true,
        status: EventStatus.Inprogress,
        shareStatus: ShareStatus.ShareFinished
      }
    ]
  },
  {
    value: StatusShowType.Metoo,
    desc: 'Metoo',
    cons: [
      {
        isHelper: true,
        status: EventStatus.Inprogress
      }
    ]
  }
]

/* 组件XBuyEventDialog.vue显示不同样式的规则 */
export enum DialogShowType {
  None,
  HZWFirstHelp, //孩子王已经帮您助力一次，还需9人帮您助力
  HelpOverview, //已有3人帮您助力，还需2人即可助力成功
  Congratulation, //恭喜您助力成功
  HelpSuccess, //您已帮【昵称】助力成功
  EventHasSuccess, //您的好友已完成助力
  HelpRepeat, //您已帮【生命在于运动】助力过
  HelpLimit, //今日助力已达上限
  EventInvalid, //该助力活动已失效
  OtherMsg //其他提示信息
}
export const DialogShowConditions: ConditionType<DialogShowType>[] = [
  {
    value: DialogShowType.HZWFirstHelp,
    desc: '孩子王已经帮您助力一次，还需9人帮您助力',
    cons: [
      {
        hzwFirstHelp: true
      }
    ]
  },
  {
    value: DialogShowType.HelpOverview,
    desc: '已有3人帮您助力，还需2人即可助力成功',
    cons: [
      {
        isSharer: true,
        status: EventStatus.Inprogress,
        shareStatus: ShareStatus.Sharing
      }
    ]
  },
  {
    value: DialogShowType.Congratulation,
    desc: '恭喜您助力成功',
    cons: [
      {
        isSharer: true,
        status: EventStatus.Inprogress,
        shareStatus: ShareStatus.ShareSuccessed,
        buyed: false
      }
    ]
  },
  {
    value: DialogShowType.EventHasSuccess,
    desc: '您的好友已完成助力',
    cons: [
      {
        helpResult: HelpResult.HelpNoneed
      }
    ]
  },
  {
    value: DialogShowType.HelpSuccess,
    desc: '您已帮【昵称】助力成功',
    cons: [
      {
        helpResult: HelpResult.HelpSuccess
      }
    ]
  },
  {
    value: DialogShowType.HelpRepeat,
    desc: '您已帮【生命在于运动】助力过',
    cons: [
      {
        helpResult: HelpResult.HelpRepeat
      }
    ]
  },
  {
    value: DialogShowType.HelpLimit,
    desc: '今日助力已达上限',
    cons: [
      {
        helpResult: HelpResult.HelpLimit
      }
    ]
  },
  {
    value: DialogShowType.EventInvalid,
    desc: '该助力活动已失效',
    cons: [
      {
        isHelper: true,
        status: EventStatus.Paused
      },
      {
        isHelper: true,
        status: EventStatus.Finished
      }
    ]
  }
]

/* 上面判断条件规则的转化方法 */
export function getConsResult<T>(
  eventInfo: EventType,
  conditions: ConditionType<T>[]
): ConditionType<T> | undefined {
  for (const status of conditions) {
    let flag = false
    for (const con of status.cons) {
      const _flag = Object.keys(con).every(
        key => get(eventInfo, key) == get(con, key)
      )
      flag = flag || _flag
    }
    if (flag) {
      return status
    }
  }
}
