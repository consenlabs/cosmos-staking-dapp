import HYPERBLOCKS_ZH_BIG from '../assets/campaign/hyperblocks-zh-big.png'
import HYPERBLOCKS_ZH_SMALL from '../assets/campaign/hyperblocks-zh-small.png'
import HYPERBLOCKS_EN_BIG from '../assets/campaign/hyperblocks-en-big.png'
import HYPERBLOCKS_EN_SMALL from '../assets/campaign/hyperblocks-en-small.png'
import HASHQUARK_ZH_BIG from '../assets/campaign/hashquark-zh-big.png'
import HASHQUARK_ZH_SMALL from '../assets/campaign/hashquark-zh-small.png'
import HASHQUARK_EN_BIG from '../assets/campaign/hashquark-en-big.png'
import HASHQUARK_EN_SMALL from '../assets/campaign/hashquark-en-small.png'
import TOKENLON_ATOM_EN_SMALL from '../assets/campaign/tokenlon-atom-en-small.png'
import TOKENLON_ATOM_ZH_SMALL from '../assets/campaign/tokenlon-atom-zh-small.png'
import TOKENLON_ATOM_EN_BIG from '../assets/campaign/tokenlon-atom-en-big.png'
import TOKENLON_ATOM_ZH_BIG from '../assets/campaign/tokenlon-atom-zh-big.png'

export default [
  {
    id: 'tokenlon-atom',
    duration: {
      start: 1564541800,
      end: 1567133800,
    },
    imgs: {
      zh: {
        big: TOKENLON_ATOM_ZH_BIG,
        small: TOKENLON_ATOM_ZH_SMALL
      },
      en: {
        big: TOKENLON_ATOM_EN_BIG,
        small: TOKENLON_ATOM_EN_SMALL
      },
    },
    // event
    actionType: 'goTokenlon',
  },
  {
    id: 'hyperblocks',
    name: 'HyperBlocks',
    operator_address: 'cosmosvaloper1ul2me6vukg2vac2p6ltxmqlaa7jywdgt8q76ag',
    duration: {
      start: 1560848400,
      end: 1563379199,
    },
    imgs: {
      zh: {
        big: HYPERBLOCKS_ZH_BIG,
        small: HYPERBLOCKS_ZH_SMALL
      },
      en: {
        big: HYPERBLOCKS_EN_BIG,
        small: HYPERBLOCKS_EN_SMALL
      },
    },
    activity: {
      name: {
        zh: 'HyperBlocks - 限时免手续费',
        en: 'HyperBlocks - Stake for Free',
      },
      url: 'https://support.token.im/hc/__locale__/articles/360024814933',
      campaignUrl: '/validator/cosmosvaloper1ul2me6vukg2vac2p6ltxmqlaa7jywdgt8q76ag',
    },
  },
  {
    id: 'hashquark',
    name: 'HashQuark',
    open: true,
    operator_address: 'cosmosvaloper1cgh5ksjwy2sd407lyre4l3uj2fdrqhpkzp06e6',
    duration: {
      start: 1559289600,
      end: 1560506400,
    },
    imgs: {
      zh: {
        big: HASHQUARK_ZH_BIG,
        small: HASHQUARK_ZH_SMALL
      },
      en: {
        big: HASHQUARK_EN_BIG,
        small: HASHQUARK_EN_SMALL
      },
    },
    banner: {
      zh: HASHQUARK_ZH_BIG,
      en: HASHQUARK_EN_BIG,
    },
    activity: {
      name: {
        zh: '邀你瓜分 2000 ATOM',
        en: 'You are invited to win 2000 ATOM',
      },
      url: '/campaign/hashquark',
      campaignUrl: '/campaign/hashquark'
    },
    locales: {
      zh: {
        delegated: '我的委托（活动期间）',
        total_delegated: '总委托代币',
        total_delegator: '委托者',
        top_delegations: '委托排名',
        campaign_details: '活动详情',
        campaign_time: '活动时间',
        campaign_rule: '活动规则',
        campaign_reward: '奖励派发',
        campaign_state: '活动说明',
        rule1: '一重礼',
        rule2: '二重礼',
        rule1_title: '质押赢空投',
        rule2_title: '排位赢 imKey',
        rule1_desc1: '活动期间，向 HashQuark 节点委托任意数量 ATOM，即可参与瓜分 1200 ATOM！',
        rule1_desc2: '单人奖励 =（已委托代币 / 总委托代币）X 1200 ATOM，委托越多，奖励越多！',
        rule2_desc1: '活动期间，向 HashQuark  节点累计委托 ATOM 数量排名前三的用户可额外获得 TOP 3 惊喜大奖：',
        rule2_top1: '400 ATOM + 价值 999 元限量版 imKey',
        rule2_top2: '300 ATOM + 价值 999 元限量版 imKey',
        rule2_top3: '100 ATOM + 价值 999 元限量版 imKey',
        reward_desc1: '1. 本次活动奖励将在活动结束后统一进行发放，请耐心等待；',
        reward_desc2: '2. 截止至活动结束，向 HashQuark 委托 ATOM 数量 TOP 3 的用户将于活动结束后收到含有 imKey 兑换码及兑换方式的消息通知；',
        state_desc1: '1. 活动期间任意时间可委托，次数不限，活动结束（$s）前赎回或改票视为无效；',
        state_desc2: '2. 一重礼「单人奖励」公式中，总委托代币为活动期间通过 imToken 委托给 HashQuark ATOM 数量的总和；',
        delegate_now: '立即委托',
        end_time: '距活动结束',
        campaign_over: '活动已结束，感谢参与!',
        campaign_over_button: '查看验证节点',
        day: '天',
        success_delegate: '已成功委托 $s ATOM',
        success_delegate_desc: '空投将在活动结束后发放，感谢支持~',
        confirm: '确认',
        tx_pending: '交易正在打包',
        data_loading: '数据加载中',
      },
      en: {
        delegated: 'My Delegated during the event',
        total_delegated: 'Total Delegated',
        total_delegator: 'Delegators',
        top_delegations: 'Ranking',
        campaign_details: 'Event Details',
        campaign_time: 'Event Time',
        campaign_rule: 'Event Rules',
        campaign_reward: 'Award Details',
        campaign_state: 'Event Description',
        rule1: 'Bonus 1',
        rule2: 'Bonus 2',
        rule1_title: 'A Good Time for a Stake!',
        rule2_title: 'The Key to imKey',
        rule1_desc1: 'User that delegate ATOM to HashQuark during the event receive your share of 1200 ATOM. The more you delegate, the higher your reward.',
        rule1_desc2: 'Your reward = (your staked tokens / total staked tokens) x 1200 ATOM.',
        rule2_desc1: 'The top 3 delegators during the event, reveice another bonus + the imKey bluetooth hardware wallet (worth $150):',
        rule2_top1: '400 ATOM + limited imKey',
        rule2_top2: '300 ATOM + limited imKey',
        rule2_top3: '100 ATOM + limited imKey',
        reward_desc1: '1. Rewards for this event will be distributed shortly after the end of the activity. Stay tuned!',
        reward_desc2: '2. At the end of the event, the user who staked ATOM as one of the TOP 3, will receive a message notification containing an imKey winner code and cash in method;',
        state_desc1: '1. Staking (and adding more Stake) can be made at any time during the activity, with no limit to the number of times. Withdrawal or change of delegation before the end of the activity ($s) shall be deemed invalid;',
        state_desc2: '2. The ATOMs a single user will be rewarded with are calculated by the amount staked by the user devided by the total amount staked by all users to Hashquark through imToken during the activity period;',
        delegate_now: 'Delegate now',
        end_time: 'Time until event ends',
        campaign_over: 'The event has ended!',
        campaign_over_button: 'View validator',
        day: 'day',
        success_delegate: '$s ATOM has been successfully delegated.',
        success_delegate_desc: 'Airdrops will be distributed after the event. Stay tuned!',
        confirm: 'Confirm',
        tx_pending: 'Transaction Pending',
        data_loading: 'Loading ...',
      },
    },
  }
]
