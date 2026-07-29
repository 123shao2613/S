/**
 * S - 养花精灵 (Flower Sprite) Module
 * 打卡养花：出生 → 幼年 → 成年；每天打卡领花蜜喂食；
 * 完成任务越多花蜜越多；打卡中断则无精打采，喂食后神采奕奕。
 */

const S_FLOWER = {
  STAGE_NAMES: { egg: '出生 · 花种', baby: '幼年 · 花苗', adult: '成年 · 花精灵' },
  BABY_AT: 15,   // 累计喂养达到此值 → 幼年
  ADULT_AT: 50,  // 累计喂养达到此值 → 成年
  feedFx: false, // 喂食瞬间特效标记

  // ---------- storage ----------
  getRaw() {
    return S_APP.storage.get('flower', {
      nectar: 0, totalFed: 0, lastFed: null, lastCheckin: null, bornDate: null
    });
  },
  save(f) { S_APP.storage.set('flower', f); },

  daysSince(dateStr) {
    if (!dateStr) return Infinity;
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
    return Math.round((t - d) / 86400000);
  },

  getState() {
    const f = this.getRaw();
    const today = S_APP.getToday();
    const since = this.daysSince(f.lastFed);
    const stage = f.totalFed >= this.ADULT_AT ? 'adult'
      : (f.totalFed >= this.BABY_AT ? 'baby' : 'egg');
    let mood;
    if (f.lastFed === today) mood = 'happy';
    else if (since >= 2) mood = 'sad';
    else mood = 'neutral';
    const hunger = f.lastFed === today ? 0
      : Math.min(100, (isFinite(since) ? since : 3) * 40);
    return { ...f, stage, stageName: this.STAGE_NAMES[stage], mood, hunger, since };
  },

  // ---------- nectar on check-in ----------
  creditCheckinNectar() {
    const tasks = S_APP.getTodayTasks();
    const earned = 10 + Math.min(tasks, 10) * 5; // 基础10 + 每任务5（最多+50）
    const f = this.getRaw();
    f.nectar += earned;
    f.lastCheckin = S_APP.getToday();
    this.save(f);
    return earned;
  },

  feed() {
    const f = this.getRaw();
    if (f.nectar <= 0) {
      S_APP.toast('没有花蜜啦，先去侧边栏「打卡」领取吧~ 🍯', 'warning');
      return false;
    }
    f.nectar -= 1;
    f.totalFed += 1;
    const today = S_APP.getToday();
    if (!f.bornDate) f.bornDate = today;
    f.lastFed = today;
    this.save(f);
    this.feedFx = true;
    S_APP.toast('喂养成功！花精灵向你道谢啦 ♡', 'success');
    return true;
  },

  // ---------- slogans ----------
  pickSlogan(mood) {
    const map = {
      happy: ['今天的花蜜好甜啊！🍯', '谢谢你的喂养！♡', '吃饱啦，好满足~', '你最好啦！', '我要快快长大报答你~', '嗝~ 好饱呀'],
      neutral: ['再喂我一点花蜜嘛~', '今天的花蜜好甜啊…还想吃', '再多采点花蜜吧！', '我们明天也打卡好不好？', '有点饿了，主人~'],
      sad: ['好饿啊…🥺', '呜呜，我快要没力气了', '今天还没尝到花蜜呢', '主人记得喂我呀~', '打卡中断了，我好想你…']
    };
    const arr = map[mood] || map.neutral;
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // ---------- SVG sprite ----------
  faceSVG(mood, cx, cy) {
    if (mood === 'happy') {
      return `
        <path d="M ${cx-22} ${cy-4} Q ${cx-15} ${cy-16} ${cx-8} ${cy-4}" stroke="#6B4F9E" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M ${cx+8} ${cy-4} Q ${cx+15} ${cy-16} ${cx+22} ${cy-4}" stroke="#6B4F9E" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M ${cx-16} ${cy+12} Q ${cx} ${cy+28} ${cx+16} ${cy+12}" stroke="#6B4F9E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="${cx-27}" cy="${cy+8}" r="7" fill="#FFB3C6" opacity="0.75"/>
        <circle cx="${cx+27}" cy="${cy+8}" r="7" fill="#FFB3C6" opacity="0.75"/>
        <path d="M ${cx-30} ${cy-12} l -4 -10 l 9 4 z" fill="#FFE08A"/>
        <path d="M ${cx+30} ${cy-12} l 4 -10 l -9 4 z" fill="#FFE08A"/>`;
    }
    if (mood === 'sad') {
      return `
        <circle cx="${cx-16}" cy="${cy-3}" r="4.5" fill="#6B4F9E"/>
        <circle cx="${cx+16}" cy="${cy-3}" r="4.5" fill="#6B4F9E"/>
        <path d="M ${cx-14} ${cy+22} Q ${cx} ${cy+10} ${cx+14} ${cy+22}" stroke="#6B4F9E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M ${cx-24} ${cy+2} q -7 5 -11 1" stroke="#7AB8FF" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="${cx-28}" cy="${cy+12}" r="6" fill="#FFB3C6" opacity="0.4"/>
        <circle cx="${cx+28}" cy="${cy+12}" r="6" fill="#FFB3C6" opacity="0.4"/>`;
    }
    return `
      <circle cx="${cx-15}" cy="${cy-3}" r="4.5" fill="#6B4F9E"/>
      <circle cx="${cx+15}" cy="${cy-3}" r="4.5" fill="#6B4F9E"/>
      <path d="M ${cx-12} ${cy+14} Q ${cx} ${cy+21} ${cx+12} ${cy+14}" stroke="#6B4F9E" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="${cx-24}" cy="${cy+9}" r="5.5" fill="#FFB3C6" opacity="0.55"/>
      <circle cx="${cx+24}" cy="${cy+9}" r="5.5" fill="#FFB3C6" opacity="0.55"/>`;
  },

  plantSVG(stage, mood) {
    if (stage === 'egg') {
      return `
        <ellipse cx="100" cy="190" rx="72" ry="14" fill="#EBD9B0" opacity="0.5"/>
        <ellipse cx="100" cy="128" rx="58" ry="68" fill="#FFF1D6" stroke="#F3C56B" stroke-width="3.5"/>
        <circle cx="78" cy="108" r="7" fill="#F6D79B"/>
        <circle cx="122" cy="142" r="9" fill="#F6D79B"/>
        <circle cx="96" cy="162" r="6" fill="#F6D79B"/>
        ${this.faceSVG(mood, 100, 124)}`;
    }
    if (stage === 'baby') {
      return `
        <ellipse cx="100" cy="188" rx="62" ry="15" fill="#D9B38C"/>
        <path d="M100 188 Q100 135 100 98" stroke="#5BBF6A" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M100 142 Q58 122 52 96 Q90 102 100 132 Z" fill="#7ED48A" stroke="#5BBF6A" stroke-width="2"/>
        <path d="M100 130 Q142 110 148 84 Q108 90 100 120 Z" fill="#7ED48A" stroke="#5BBF6A" stroke-width="2"/>
        <circle cx="100" cy="92" r="27" fill="#B6E3A0" stroke="#5BBF6A" stroke-width="3"/>
        ${this.faceSVG(mood, 100, 92)}`;
    }
    // adult
    let petals = '';
    const pc = ['#F9A8D4', '#FBCFE8', '#F9A8D4', '#FBCFE8', '#F9A8D4', '#FBCFE8'];
    for (let i = 0; i < 6; i++) {
      const ang = (Math.PI * 2 / 6) * i;
      const px = 100 + Math.cos(ang) * 44;
      const py = 92 + Math.sin(ang) * 44;
      petals += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="21" ry="29" fill="${pc[i]}" stroke="#F472B6" stroke-width="2" transform="rotate(${((ang * 180 / Math.PI) + 90).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
    }
    return `
      <path d="M100 165 Q70 156 60 124 Q92 132 100 154 Z" fill="#7ED48A" stroke="#5BBF6A" stroke-width="2"/>
      <path d="M100 154 Q130 146 140 116 Q108 124 100 144 Z" fill="#7ED48A" stroke="#5BBF6A" stroke-width="2"/>
      <rect x="94" y="120" width="12" height="70" rx="6" fill="#5BBF6A"/>
      ${petals}
      <circle cx="100" cy="92" r="30" fill="#FFE08A" stroke="#F6C544" stroke-width="3"/>
      ${this.faceSVG(mood, 100, 92)}`;
  },

  spriteSVG(stage, mood, size = 200) {
    return `<svg viewBox="0 0 200 210" width="${size}" height="${size * 1.05}" xmlns="http://www.w3.org/2000/svg">
      ${this.plantSVG(stage, mood)}
    </svg>`;
  },

  // ---------- main render ----------
  render() {
    const s = this.getState();
    const checkedToday = S_APP.storage.get('checkins', []).includes(S_APP.getToday());
    const slogan = this.pickSlogan(s.mood);
    const moodLabel = s.mood === 'happy' ? '神采奕奕 ✨' : (s.mood === 'sad' ? '无精打采 🥀' : '还算精神');
    const hungerLabel = s.hunger === 0 ? '饱饱的' : (s.hunger >= 80 ? '快饿扁了' : (s.hunger >= 40 ? '有点饿' : '微饿'));
    const growPct = Math.min(100, (s.totalFed / this.ADULT_AT) * 100);
    const fxClass = this.feedFx ? 'fed-anim' : '';
    this.feedFx = false;

    const container = document.getElementById('module-flower');
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">🌸 养花精灵</h1>
          <p class="page-subtitle">每天打卡领花蜜，喂养你的专属花精灵，陪你从出生成长为成年</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="badge badge-accent">🍯 花蜜 ${s.nectar}</span>
          <span class="badge badge-primary">已喂 ${s.totalFed}</span>
        </div>
      </div>

      <div class="flower-stage-card">
        <div class="flower-bubble">${S_APP.escapeHtml(slogan)}</div>
        <div class="flower-sprite ${fxClass}" id="flowerSprite">
          ${this.spriteSVG(s.stage, s.mood, 220)}
          ${s.mood === 'happy' ? '<div class="flower-hearts">💗💗💗</div>' : ''}
        </div>
        <div class="flower-status">
          <span class="flower-stage-pill">${s.stageName}</span>
          <span class="flower-mood-pill mood-${s.mood}">${moodLabel}</span>
        </div>
        <div class="hunger-wrap">
          <div class="hunger-label">🍯 饥饿度 · ${hungerLabel}</div>
          <div class="hunger-bar"><div class="hunger-fill" style="width:${s.hunger}%;"></div></div>
        </div>
      </div>

      <div class="flower-actions">
        <button class="btn btn-primary flower-feed-btn" id="flowerFeedBtn" ${s.nectar <= 0 ? 'disabled' : ''}>
          🍯 喂食（剩 ${s.nectar} 份花蜜）
        </button>
        ${checkedToday
          ? '<span class="flower-checked-tip">✅ 今日已打卡，花蜜已到账</span>'
          : '<button class="btn btn-secondary" id="flowerCheckinBtn">🔥 去打卡领花蜜</button>'}
      </div>

      <div class="growth-card">
        <div class="growth-title">🌱 成长进度</div>
        <div class="growth-bar">
          <div class="growth-fill" style="width:${growPct}%;"></div>
          <div class="growth-dot" style="left:0%;"><span>🌰<br>出生</span></div>
          <div class="growth-dot" style="left:${Math.min(100, (this.BABY_AT / this.ADULT_AT) * 100)}%;"><span>🌿<br>幼年</span></div>
          <div class="growth-dot" style="left:100%;"><span>🌸<br>成年</span></div>
        </div>
        <div class="growth-hint">再喂养 <b>${Math.max(0, this.ADULT_AT - s.totalFed)}</b> 份花蜜，花精灵就能成长为<b>成年</b>啦！</div>
      </div>

      <div class="flower-stats">
        <div class="flower-stat"><div class="fs-val">${s.nectar}</div><div class="fs-label">🍯 可用花蜜</div></div>
        <div class="flower-stat"><div class="fs-val">${s.totalFed}</div><div class="fs-label">💗 累计喂养</div></div>
        <div class="flower-stat"><div class="fs-val">${S_APP.getStreak()}</div><div class="fs-label">🔥 连续打卡</div></div>
        <div class="flower-stat"><div class="fs-val">${s.mood === 'happy' ? '饱' : (s.since >= 2 ? '饿' : '中')}</div><div class="fs-label">🍽️ 当前状态</div></div>
      </div>

      <div class="flower-tips">
        💡 小贴士：在「音标 / 单词 / 跟读 / 对话 / 台词」里每完成一个学习任务，打卡时领取的花蜜就越多（每任务 +5，最多 +50）。打卡中断超过 1 天，花精灵就会无精打采，记得每天来喂它哦！
      </div>
    `;

    const feedBtn = document.getElementById('flowerFeedBtn');
    if (feedBtn) feedBtn.addEventListener('click', () => {
      if (this.feed()) this.render();
    });
    const checkinBtn = document.getElementById('flowerCheckinBtn');
    if (checkinBtn) checkinBtn.addEventListener('click', () => {
      S_APP.doCheckin();
      this.render();
    });
  },

  // ---------- dashboard widget ----------
  widgetHTML() {
    const s = this.getState();
    const slogan = this.pickSlogan(s.mood);
    const checkedToday = S_APP.storage.get('checkins', []).includes(S_APP.getToday());
    return `
      <div class="flower-widget" onclick="S_APP.navigate('flower')">
        <div class="flower-widget-left">
          <div class="flower-mini">${this.spriteSVG(s.stage, s.mood, 96)}</div>
        </div>
        <div class="flower-widget-right">
          <div class="flower-widget-title">🌸 养花精灵 · ${s.stageName}</div>
          <div class="flower-bubble small">${S_APP.escapeHtml(slogan)}</div>
          <div class="flower-widget-meta">
            🍯 ${s.nectar} 花蜜 · 已喂 ${s.totalFed} · ${s.mood === 'happy' ? '神采奕奕' : '无精打采'}
            ${checkedToday ? '' : '· <b style="color:#F472B6">待打卡</b>'}
          </div>
        </div>
        <div class="flower-widget-go">›</div>
      </div>
    `;
  },
};
