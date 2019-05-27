import React from 'react'
import './index.scss'


export default ({ t, campaign }) => {
  return (
    <div className="details">
      <div>
        <p className="block-title">{t('campaign_time')}</p>
        <p>{campaign.time}</p>
      </div>

      <div>
        <p className="block-title">{t('campaign_rule')}</p>

        <div>
          <div className="rule-symbol" />
          <p className="rule-title">{t('rule1')}</p>
          <h2>{t('rule1_title')}</h2>
          <p>{t('rule1_desc1')}</p>
          <p>{t('rule1_desc2')}</p>
          <p>{t('rule1_remark1')}</p>
        </div>


        <div>
          <div className="rule-symbol" />
          <p className="rule-title">{t('rule2')}</p>
          <h2>{t('rule2_title')}</h2>
          <p>{t('rule1_desc1')}</p>
          <div className="reward-list">
            <p>
              <span>TOP 1</span>
              <span className="top-gift">{t('rule2_top1')}</span>
            </p>
            <p>
              <span>TOP 2</span>
              <span className="top-gift">{t('rule2_top2')}</span>
            </p>
            <p>
              <span>TOP 3</span>
              <span className="top-gift">{t('rule2_top3')}</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="block-title">{t('campaign_reward')}</p>
        <p>{t('reward_desc1')}</p>
        <p>{t('reward_desc2')}</p>
      </div>

      <div>
        <p className="block-title">{t('campaign_state')}</p>
        <p>{t('state_desc1')}</p>
        <p>{t('state_desc2')}</p>
      </div>
    </div>
  )
}