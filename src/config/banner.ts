import HASH_ZH_BIG from '../assets/banners/hash-zh-big.png'
import HASH_ZH_SMALL from '../assets/banners/hash-zh-small.png'
import HASH_EN_BIG from '../assets/banners/hash-en-big.png'
import HASH_EN_SMALL from '../assets/banners/hash-en-small.png'
import SPARKPOOL_ZH_BIG from '../assets/banners/sparkpool-zh-big.png'
import SPARKPOOL_ZH_SMALL from '../assets/banners/sparkpool-zh-small.png'
import SPARKPOOL_EN_BIG from '../assets/banners/sparkpool-en-big.png'
import SPARKPOOL_EN_SMALL from '../assets/banners/sparkpool-en-small.png'

export default [
  {
    name: 'hash',
    operator_address: 'cosmosvaloper1cgh5ksjwy2sd407lyre4l3uj2fdrqhpkzp06e6',
    imgs: {
      zh_big: HASH_ZH_BIG,
      zh_small: HASH_ZH_SMALL,
      en_big: HASH_EN_BIG,
      en_small: HASH_EN_SMALL,
    },
    activity: {
      name: {
        zh: '请你瓜分 2000 个 ATOM',
        en: '请你瓜分 2000 个 ATOM',
      },
      time: {
        start: 1559232000,
        end: 1560355200,
      },
      url: '/cosmos/campaign/hashquark',
    },
    desc: {
      zh: 'HashQuark 是专注于 PoS、DPoS 以及其他共识机制公链的矿池，拥有专业的技术背景和丰富的经验。HashQuark 由香港金融科技公司 HashKey Group 出资成立。',
      en: 'HashQuark is a mining pool that focuses on PoS, DPoS and other public chains consensus mechanisms. Besides Cosmos, HashQuark is also supporting nodes and masternode of many public chains including IRISnet, Cybex, CyberMiles, V SYSTEMS, VeChain, etc.',
    }
  },
  {
    name: 'SparkPool',
    operator_address: 'cosmosvaloper1rwh0cxa72d3yle3r4l8gd7vyphrmjy2kpe4x72',
    imgs: {
      zh_big: SPARKPOOL_ZH_BIG,
      zh_small: SPARKPOOL_ZH_SMALL,
      en_big: SPARKPOOL_EN_BIG,
      en_small: SPARKPOOL_EN_SMALL,
    },
    desc: {
      zh: '星火矿池是全球第二大以太坊矿池，也是全球最大的 GPU 通用算力平台。三年来，星火矿池先后推出了 ETH 矿池、Beam 矿池、Grin 矿池、Cosmos 权益池以及 SparkOS 等产品，是全球范围内的顶尖矿池团队。',
      en: 'SparkPool is the second largest Ethereum mining pool in the world. For the starting Proof-Of-Stake blockchain era, SparkPool is using its accumulated experience to provide users with the best service for Cosmos PoS.',
    }
  },
]
