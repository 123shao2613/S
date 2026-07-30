/**
 * S - Korean Learning Workbench
 * Core Application Logic
 */

const S_APP = {
  // ====== STATE ======
  state: {
    currentModule: 'dashboard',
    ttsVoice: null,
    ttsReady: false,
  },

  // Persistent data (localStorage)
  storage: {
    get(key, defaultVal) {
      try {
        const v = localStorage.getItem('s_korean_' + key);
        return v ? JSON.parse(v) : defaultVal;
      } catch (e) { return defaultVal; }
    },
    set(key, val) {
      try { localStorage.setItem('s_korean_' + key, JSON.stringify(val)); } catch (e) {}
    },
  },

  // ====== INIT ======
  init() {
    this.loadTTSEngine();
      this.bindNav();
      this.bindCheckin();
      this.bindVoiceSettings();
      this.bindHelpBtn();
      this.bindMobile();
      this._maybeShowGuide();
      this.updateStreakUI();
      this.updateLevelUI();

    // Initialize modules
      S_DASHBOARD.init();
      S_PHONICS.init();
      S_VOCAB.init();
      S_SPEAKING.init();
      S_DIALOGUE.init();
      S_DRAMA.init();

      // Navigate to dashboard by default
      this.navigate('dashboard');
  },

  // ====== TTS ENGINE ======
  loadTTSEngine() {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    // Female voice hints (substring match, lower-cased). Covers Windows
    // "Microsoft Heami", Edge/online natural voices, and common TTS names.
    const FEMALE_KW = ['여성', 'female', 'woman', 'heami', 'yuna', 'seoyeon',
      'sohee', 'sunhee', 'yoori', 'eunjin', 'haeyun', 'sora', 'aria', 'viv',
      '유나', '서연', '소희', '하윤', '은진', '지유', '수지', '유리',
      '하린', '지원', '민서', 'sumi', 'nari', 'online (natural)'];

    const pickFemaleKorean = (voices) => {
      const ko = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ko'));
      if (!ko.length) return null;
      let v = ko.find(x => FEMALE_KW.some(k => (x.name || '').toLowerCase().includes(k)));
      if (!v) v = ko.find(x => !/(male|남성|sang|jun|min|hyun|tae|joon|wook)\b/i.test(x.name || '')) || ko[0];
      return v;
    };

    const apply = (uri) => {
      const all = speechSynthesis.getVoices();
      const chosen = all.find(x => x.voiceURI === uri) || pickFemaleKorean(all);
      if (chosen) {
        this.state.ttsVoice = chosen;
        this.state.ttsVoiceURI = chosen.voiceURI;
        this.state.ttsReady = true;
      }
    };

    const loadVoices = () => {
      const all = speechSynthesis.getVoices();
      if (!all || !all.length) return;
      this.state.ttsVoices = all;
      const hasKo = all.some(v => (v.lang || '').toLowerCase().startsWith('ko'));
      this.state.ttsHasKorean = hasKo;
      const saved = this.storage.get('ttsVoiceURI', null);
      if (saved && all.some(x => x.voiceURI === saved)) {
        apply(saved);
      } else if (hasKo) {
        apply(null); // auto female-korean
        this.storage.set('ttsVoiceURI', this.state.ttsVoiceURI);
      } else if (all[0]) {
        // 没有韩文语音：仍选一个默认语音，保证至少能出声（发音会不准），并提示用户安装韩文语音包
        this.state.ttsVoice = all[0];
        this.state.ttsVoiceURI = all[0].voiceURI;
        this.state.ttsReady = true;
        this.storage.set('ttsVoiceURI', all[0].voiceURI);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  },

  // Manually set the voice (used by the picker). Persists the choice.
  setVoiceByURI(uri) {
    const all = speechSynthesis.getVoices();
    const chosen = all.find(x => x.voiceURI === uri);
    if (chosen) {
      this.state.ttsVoice = chosen;
      this.state.ttsVoiceURI = chosen.voiceURI;
      this.state.ttsReady = true;
      this.storage.set('ttsVoiceURI', chosen.voiceURI);
      return true;
    }
    return false;
  },

  // List voices for the UI picker, sorted (Korean first).
  getVoiceList() {
    const all = this.state.ttsVoices || (speechSynthesis.getVoices() || []);
    return all.slice().sort((a, b) => {
      const ak = (a.lang || '').startsWith('ko') ? 0 : 1;
      const bk = (b.lang || '').startsWith('ko') ? 0 : 1;
      return ak - bk || (a.name || '').localeCompare(b.name || '');
    });
  },

  // Open the voice-settings modal (女性韩文发音选择).
  openVoiceSettings() {
    const voices = this.getVoiceList();
    const cur = this.state.ttsVoiceURI;
    if (!voices.length) {
      this.toast('未检测到任何系统语音。Windows：设置 → 时间和语言 → 语音 → 管理语音 → 勾选“韩语”并安装；macOS：系统设置 → 辅助功能 → 语音 → 下载韩语。安装后刷新页面。', 'warning', 6000);
      return;
    }
    const options = voices.map(v => {
      const ko = (v.lang || '').toLowerCase().startsWith('ko');
      const sel = v.voiceURI === cur ? 'selected' : '';
      const tag = ko ? '🇰🇷 韩文' : (v.lang || '未知');
      return `<option value="${this.escapeAttr(v.voiceURI)}" ${sel}>${this.escapeHtml(v.name)} · ${tag}</option>`;
    }).join('');

    const hasKo = voices.some(v => (v.lang || '').toLowerCase().startsWith('ko'));
    const warn = hasKo ? '' : `
      <div style="margin-bottom:12px;padding:10px 12px;border-radius:12px;background:#FEF2F2;border:1px dashed #F87171;color:#B91C1C;font-size:0.82rem;">
        ⚠️ 未检测到<b>韩文语音</b>。当前系统只有其他语言语音，朗读韩语会发音不准或听不懂。请先安装韩文语音包：<br>
        · <b>Windows</b>：设置 → 时间和语言 → 语言和区域 → 添加“韩语” → 安装“语音”功能，重启浏览器。<br>
        · <b>macOS</b>：系统设置 → 辅助功能 → 语音 → 系统语音 → 管理语音 → 下载“韩语”。<br>
        · 安装后刷新本页面，再到此处选择韩文女声即可。
      </div>`;

    const body = `
      ${warn}
      <p class="text-sm text-muted">所有韩语朗读都会使用下方选择的语音。建议选择 <b>韩文（🇰🇷）女声</b>（名称常含 Heami / Yuna / 여성）。若列表中没有韩文语音，请按上方提示安装后刷新页面。</p>
      <div class="form-group">
        <label>朗读语音</label>
        <select class="form-input" id="voiceSelect">${options}</select>
      </div>
      <div class="form-group">
        <label>语速</label>
        <input type="range" id="voiceRate" min="0.6" max="1.2" step="0.05" value="${this.storage.get('ttsRate', 0.85)}">
        <span class="text-sm text-muted" id="voiceRateVal">${(+this.storage.get('ttsRate', 0.85)).toFixed(2)}x</span>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
        <button class="btn btn-secondary" id="voicePreview">🔊 试听</button>
        <button class="btn btn-secondary" onclick="S_APP.closeModal()">取消</button>
        <button class="btn btn-primary" id="voiceSave">保存</button>
      </div>
    `;

    this.openModal('🎙️ 发音设置（女声韩文）', body, () => {
      const sel = document.getElementById('voiceSelect');
      const rate = document.getElementById('voiceRate');
      const rateVal = document.getElementById('voiceRateVal');
      rate.addEventListener('input', () => { rateVal.textContent = parseFloat(rate.value).toFixed(2) + 'x'; });
      document.getElementById('voicePreview').addEventListener('click', () => {
        if (this.setVoiceByURI(sel.value)) {
          this.storage.set('ttsRate', parseFloat(rate.value));
          if (!this.state.ttsHasKorean) {
            this.toast('（当前无韩文语音，使用默认语音试听，发音会不准；请按上方提示安装韩文语音包）', 'warning');
          }
          this.speak('안녕하세요, 반갑습니다. 오늘도 화이팅이에요!', { rate: parseFloat(rate.value) });
        }
      });
      document.getElementById('voiceSave').addEventListener('click', () => {
        if (this.setVoiceByURI(sel.value)) {
          this.storage.set('ttsRate', parseFloat(rate.value));
          this.toast('发音设置已保存 ✅', 'success');
          this.closeModal();
        } else {
          this.toast('选择的语音不可用', 'warning');
        }
      });
    });
  },

  speak(text, opts = {}) {
    if (!('speechSynthesis' in window)) {
      this._showTTSUnsupported();
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();

    const all = this.state.ttsVoices || (synth.getVoices() || []);
    // 已选语音若不是韩文、但系统里有韩文语音，则改用韩文（发音更标准）
    let voice = this.state.ttsVoice;
    if (voice && !(voice.lang || '').toLowerCase().startsWith('ko')) {
      const koVoice = all.find(v => (v.lang || '').toLowerCase().startsWith('ko'));
      if (koVoice) voice = koVoice;
    }
    // 仍为空则兜底：优先韩文，否则用第一个可用语音，保证至少能出声
    if (!voice) voice = all.find(v => (v.lang || '').toLowerCase().startsWith('ko')) || all[0] || null;
    if (voice) {
      this.state.ttsVoice = voice;
      this.state.ttsVoiceURI = voice.voiceURI;
    }

    const utter = new SpeechSynthesisUtterance(text);
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang || 'ko-KR';
    } else {
      utter.lang = 'ko-KR';
    }
    utter.rate = opts.rate || this.storage.get('ttsRate', 0.85);
    utter.pitch = opts.pitch || 1.15;
    utter.volume = opts.volume || 1.0;

    if (opts.onStart) utter.onstart = opts.onStart;
    if (opts.onEnd) utter.onend = opts.onEnd;
    if (opts.onError) utter.onerror = opts.onError;

    // 朗读失败（多为系统缺对应语言语音包）时给出明确提示
    utter.onerror = (e) => {
      this.toast('朗读失败：' + (e.error || '未知错误') + '。请打开 🎙️ 发音设置检查/安装韩文语音包', 'error');
    };

    // 保留引用，避免被 GC 回收导致朗读中途中断（Chromium 已知问题）
    this.state._currentUtter = utter;
    synth.speak(utter);
    // Edge/Chrome 在 cancel 后偶尔进入 paused 状态，唤醒一下以免静音
    try { if (synth.paused) synth.resume(); } catch (e) {}
  },

  stopSpeak() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  },

  // Show an instructive notice when the browser lacks the Web Speech API
  // (e.g. Huawei's built-in browser, WeChat/QQ in-app webview, some PWA
  // containers). The real fix is to open the site in Chrome or Edge.
  _showTTSUnsupported() {
    if (this.storage.get('ttsUnsupportedDismissed')) {
      this.toast('请用 Chrome / Edge 打开本页面才能朗读韩语', 'warning');
      return;
    }
    const id = 'ttsUnsupportedBanner';
    if (document.getElementById(id)) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const banner = document.createElement('div');
    banner.id = id;
    banner.className = 'tts-unsupported';
    banner.innerHTML = `
      <div class="tts-unsupported-text">
        🔇 当前浏览器不支持语音朗读（缺少 Web Speech API）。<b>请用 Chrome 或 Edge 打开本页面</b>即可正常朗读韩语。
        ${isMobile ? '手机：用 Chrome 打开网址 → 菜单「添加到主屏幕」即可当 App 使用。' : '若已用 Chrome/Edge 仍无声，请点右上角 🎙️ 安装韩文语音包。'}
      </div>
      <button class="tts-unsupported-close" aria-label="关闭">×</button>`;
    const close = () => {
      banner.remove();
      this.storage.set('ttsUnsupportedDismissed', 1);
    };
    banner.querySelector('.tts-unsupported-close').addEventListener('click', close);
    document.body.appendChild(banner);
    setTimeout(() => { const el = document.getElementById(id); if (el) el.classList.add('show'); }, 50);
  },

  // ====== NAVIGATION ======
  bindNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const mod = item.dataset.module;
        this.navigate(mod);
      });
    });
  },

  navigate(moduleName) {
    this.state.currentModule = moduleName;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navEl = document.querySelector(`.nav-item[data-module="${moduleName}"]`);
    if (navEl) navEl.classList.add('active');

    // Update module visibility
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    const modEl = document.getElementById(`module-${moduleName}`);
    if (modEl) modEl.classList.add('active');

    // Trigger module render
    const modMap = {
      dashboard: () => S_DASHBOARD.render(),
      phonics: () => S_PHONICS.render(),
      vocabulary: () => S_VOCAB.render(),
      speaking: () => S_SPEAKING.render(),
      dialogue: () => S_DIALOGUE.render(),
      drama: () => S_DRAMA.render(),
      flower: () => S_FLOWER.render(),
    };
    if (modMap[moduleName]) modMap[moduleName]();

    // Scroll to top
    document.querySelector('.content').scrollTop = 0;

    // Mobile: refresh top bar title and close the drawer
    this.updateTopbarTitle();
    this.closeMobileDrawer();
  },

  // ====== MOBILE HELPERS ======
  bindMobile() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    const hamburger = document.getElementById('topbarHamburger');
    const topCheckin = document.getElementById('topbarCheckin');

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        if (sidebar) sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('show');
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeMobileDrawer());
    }
    if (topCheckin) {
      topCheckin.addEventListener('click', () => this.doCheckin());
    }
    // Close drawer when any nav item is tapped (mobile)
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => this.closeMobileDrawer());
    });
    this.updateTopbarTitle();
  },

  updateTopbarTitle() {
    const el = document.getElementById('topbarTitle');
    if (!el) return;
    const navEl = document.querySelector(`.nav-item[data-module="${this.state.currentModule}"]`);
    const label = navEl ? navEl.querySelector('.nav-label') : null;
    el.textContent = label ? label.textContent : '学习仪表盘';
  },

  closeMobileDrawer() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
  },

  // ====== CHECK-IN / STREAK ======
  bindCheckin() {
    const btn = document.getElementById('checkinBtn');
    if (btn) {
      btn.addEventListener('click', () => this.doCheckin());
    }
  },

  bindVoiceSettings() {
    const btn = document.getElementById('voiceSettingsBtn');
    if (btn) {
      btn.addEventListener('click', () => this.openVoiceSettings());
    }
  },

  bindHelpBtn() {
    const btn = document.getElementById('helpBtn');
    if (btn) {
      btn.addEventListener('click', () => this.showGuide());
    }
  },

  // Show the first-run / on-demand illustrated guide (install-as-app + voice).
  showGuide() {
    const body = `
      <div class="guide">
        <div class="guide-hero">🌸 欢迎来到韩语学习屋</div>
        <p class="guide-sub">三步上手，手机也能当 App 用</p>

        <div class="guide-step">
          <div class="guide-step-icon">📲</div>
          <div class="guide-step-body">
            <div class="guide-step-title">第 1 步 · 安装成 App（手机推荐）</div>
            <ol class="guide-ol">
              <li>用 <b>Chrome</b> 浏览器打开本网址（华为自带浏览器 / 微信内打开会缺少语音）</li>
              <li>点右上角 <b>⋮ 菜单 → 添加到主屏幕</b></li>
              <li>桌面出现「S韩语」图标，点开即全屏运行</li>
            </ol>
          </div>
        </div>

        <div class="guide-step">
          <div class="guide-step-icon">🔊</div>
          <div class="guide-step-body">
            <div class="guide-step-title">第 2 步 · 开启韩语朗读</div>
            <ol class="guide-ol">
              <li>朗读依赖浏览器语音合成，<b>Chrome / Edge 自带支持</b></li>
              <li>若点击 🔊 没声音：点左下「🎙️ 发音设置」</li>
              <li>按提示安装<b>韩文语音包</b>，选「韩文女声」后刷新即可</li>
            </ol>
          </div>
        </div>

        <div class="guide-step">
          <div class="guide-step-icon">🌸</div>
          <div class="guide-step-body">
            <div class="guide-step-title">第 3 步 · 每天打卡养花精灵</div>
            <p class="guide-p">每天来打卡领花蜜喂精灵，完成的任务越多花蜜越多，精灵会从蛋 → 幼年 → 成年慢慢长大哦！</p>
          </div>
        </div>

        <button class="guide-start" id="guideStartBtn">开始学习 ✿</button>
      </div>`;
    this.openModal('📖 新手引导', body, (bodyEl) => {
      const start = bodyEl.querySelector('#guideStartBtn');
      if (start) start.addEventListener('click', () => this.closeModal());
    });
    this.storage.set('guideSeen', 1);
  },

  // Auto-show the guide on the very first visit only.
  _maybeShowGuide() {
    if (!this.storage.get('guideSeen', 0)) {
      setTimeout(() => { if (!this.storage.get('guideSeen', 0)) this.showGuide(); }, 700);
    }
  },

  getToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  },

  // 记录今天完成的学习任务（用于打卡时计算花蜜数量）
  recordTask() {
    const today = this.getToday();
    const log = this.storage.get('taskLog', { date: today, count: 0 });
    if (log.date !== today) { log.date = today; log.count = 0; }
    log.count = (log.count || 0) + 1;
    this.storage.set('taskLog', log);
  },

  getTodayTasks() {
    const log = this.storage.get('taskLog', { date: this.getToday(), count: 0 });
    return log.date === this.getToday() ? (log.count || 0) : 0;
  },

  doCheckin() {
    const today = this.getToday();
    const checkins = this.storage.get('checkins', []);
    if (checkins.includes(today)) {
      this.toast('今天已经打卡了！明天继续加油 💪', 'warning');
      return;
    }

    checkins.push(today);
    this.storage.set('checkins', checkins);

    // Award XP
    this.addXP(20);
    let msg = '打卡成功！+20 经验值 🎉';
    // 养花精灵：领取花蜜（完成任务越多，花蜜越多）
    if (typeof S_FLOWER !== 'undefined') {
      const earned = S_FLOWER.creditCheckinNectar();
      msg += ` · 🍯 +${earned} 花蜜`;
    }
    this.toast(msg, 'success');
    this.updateStreakUI();
    this.updateLevelUI();

    // Re-render dashboard if active
    if (this.state.currentModule === 'dashboard') S_DASHBOARD.render();
  },

  getStreak() {
    const checkins = this.storage.get('checkins', []);
    if (checkins.length === 0) return 0;

    const sorted = [...checkins].sort();
    let streak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (sorted.includes(dStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  },

  updateStreakUI() {
    const streak = this.getStreak();
    const countEl = document.getElementById('streakCount');
    const btn = document.getElementById('checkinBtn');
    if (countEl) countEl.textContent = streak;

    const today = this.getToday();
    const checkins = this.storage.get('checkins', []);
    if (btn) {
      if (checkins.includes(today)) {
        btn.classList.add('done');
        btn.textContent = '已打卡';
        btn.disabled = true;
      } else {
        btn.classList.remove('done');
        btn.textContent = '打卡';
        btn.disabled = false;
      }
    }

    // Mirror state onto the mobile top-bar check-in button
    const topBtn = document.getElementById('topbarCheckin');
    if (topBtn) {
      if (checkins.includes(today)) {
        topBtn.classList.add('done');
        topBtn.textContent = '已打卡';
        topBtn.disabled = true;
      } else {
        topBtn.classList.remove('done');
        topBtn.textContent = '打卡 ♡';
        topBtn.disabled = false;
      }
    }
  },

  // ====== XP & LEVEL ======
  addXP(amount) {
    const xp = this.storage.get('xp', 0) + amount;
    this.storage.set('xp', xp);

    // Check for level up
    const oldLevel = this.storage.get('level', 1);
    const newLevel = Math.floor(Math.sqrt(xp / 50)) + 1;
    if (newLevel > oldLevel) {
      this.storage.set('level', newLevel);
      this.toast(`恭喜升级！Lv.${newLevel} 🎊`, 'success');
    }
  },

  getLevelInfo() {
    const xp = this.storage.get('xp', 0);
    const level = Math.floor(Math.sqrt(xp / 50)) + 1;
    const currentLevelXp = Math.pow(level - 1, 2) * 50;
    const nextLevelXp = Math.pow(level, 2) * 50;
    const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

    const titles = ['新手', '入门者', '学习者', '探索者', '进阶者', '熟练者', '高手', '专家', '大师', '宗师'];
    const title = titles[Math.min(level - 1, titles.length - 1)];

    return { level, xp, currentLevelXp, nextLevelXp, progress: Math.min(progress, 100), title };
  },

  updateLevelUI() {
    const info = this.getLevelInfo();
    const fill = document.getElementById('levelFill');
    const text = document.getElementById('levelText');
    if (fill) fill.style.width = info.progress + '%';
    if (text) text.textContent = `Lv.${info.level} ${info.title} (${info.xp} XP)`;
  },

  // ====== RECORDING (MediaRecorder) ======
  recorder: null,
  recordChunks: [],
  recordStream: null,

  async startRecording() {
    try {
      this.recordStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recordChunks = [];
      this.recorder = new MediaRecorder(this.recordStream);

      this.recorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordChunks.push(e.data);
      };

      this.recorder.start();
      return true;
    } catch (e) {
      this.toast('无法访问麦克风，请检查浏览器权限设置', 'error');
      return false;
    }
  },

  stopRecording() {
    return new Promise((resolve) => {
      if (!this.recorder || this.recorder.state === 'inactive') {
        resolve(null);
        return;
      }
      this.recorder.onstop = () => {
        const blob = new Blob(this.recordChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        if (this.recordStream) {
          this.recordStream.getTracks().forEach(t => t.stop());
        }
        resolve({ blob, url, duration: this.recordChunks.length });
      };
      this.recorder.stop();
    });
  },

  // ====== SPEECH RECOGNITION ======
  recognition: null,

  initRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = 'ko-KR';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    return rec;
  },

  recognizeSpeech(timeout = 8000) {
    return new Promise((resolve) => {
      const rec = this.initRecognition();
      if (!rec) {
        resolve({ success: false, transcript: '', error: 'not_supported' });
        return;
      }

      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          try { rec.stop(); } catch(e) {}
          resolve({ success: false, transcript: '', error: 'timeout' });
        }
      }, timeout);

      rec.onresult = (e) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        const transcript = e.results[0][0].transcript;
        const confidence = e.results[0][0].confidence;
        resolve({ success: true, transcript, confidence });
      };

      rec.onerror = (e) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        resolve({ success: false, transcript: '', error: e.error });
      };

      rec.onend = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve({ success: false, transcript: '', error: 'no_speech' });
        }
      };

      try { rec.start(); } catch(e) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve({ success: false, transcript: '', error: 'start_failed' });
        }
      }
    });
  },

  // ====== PRONUNCIATION SCORING =====
  scorePronunciation(targetText, recognizedText) {
    if (!recognizedText || recognizedText.trim() === '') {
      return { score: 0, syllableResults: [], method: 'no_input' };
    }

    // Normalize: remove spaces and punctuation
    const normalize = (s) => s.replace(/[\s,.!??!。]/g, '').toLowerCase();
    const target = normalize(targetText);
    const recognized = normalize(recognizedText);

    if (target === recognized) {
      return { score: 100, syllableResults: [], method: 'exact_match' };
    }

    // Calculate character-level similarity using Levenshtein
    const distance = this.levenshtein(target, recognized);
    const maxLength = Math.max(target.length, recognized.length);
    const similarity = Math.max(0, (1 - distance / maxLength) * 100);

    // Score: similarity + some bonus for length match
    let score = Math.round(similarity);
    score = Math.max(10, Math.min(100, score));

    // Syllable analysis (simplified - compare chunks)
    const targetSyllables = targetText.replace(/[\s,.!?]/g, '').match(/.{1,1}/g) || [];
    const recognizedSyllables = recognized.match(/.{1,1}/g) || [];
    const syllableResults = targetSyllables.map((syl, i) => {
      const recSyl = recognizedSyllables[i];
      if (!recSyl) return { syllable: syl, status: 'incorrect' };
      if (syl === recSyl) return { syllable: syl, status: 'correct' };
      // Check if similar (same consonant or vowel)
      return { syllable: syl, status: 'partial' };
    });

    return { score, syllableResults, method: 'recognition' };
  },

  // Simulated scoring when speech recognition is unavailable
  simulateScore(targetText) {
    const syllables = targetText.replace(/[\s,.!?]/g, '').match(/.{1,1}/g) || [];
    // Generate a realistic random score with bias toward higher scores
    const baseScore = 60 + Math.floor(Math.random() * 35);
    const syllableResults = syllables.map(syl => {
      const r = Math.random();
      if (r > 0.75) return { syllable: syl, status: 'partial' };
      if (r > 0.9) return { syllable: syl, status: 'incorrect' };
      return { syllable: syl, status: 'correct' };
    });

    // Adjust score based on syllable results
    const correctCount = syllableResults.filter(r => r.status === 'correct').length;
    const partialCount = syllableResults.filter(r => r.status === 'partial').length;
    const adjustedScore = Math.round((correctCount + partialCount * 0.5) / syllables.length * 100);

    return {
      score: Math.max(adjustedScore, baseScore),
      syllableResults,
      method: 'simulated'
    };
  },

  levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1]
          ? dp[i-1][j-1]
          : Math.min(dp[i-1][j-1] + 1, dp[i][j-1] + 1, dp[i-1][j] + 1);
      }
    }
    return dp[m][n];
  },

  // ====== TOAST ======
  toast(msg, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(100%)';
      t.style.transition = 'all 0.3s ease';
      setTimeout(() => t.remove(), 300);
    }, duration);
  },

  // ====== MOUTH SVG GENERATOR ======
  generateMouthSVG(type) {
    const baseSVG = (innerContent, label) => `
      <svg viewBox="0 0 200 200" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
        <!-- Face outline -->
        <ellipse cx="100" cy="100" rx="90" ry="85" fill="#FFF5E6" stroke="#E8D5C0" stroke-width="2"/>
        <!-- Nose -->
        <path d="M 100 70 Q 95 85 100 90 Q 105 85 100 70" fill="none" stroke="#D4A88E" stroke-width="1.5" stroke-linecap="round"/>
        ${innerContent}
        <!-- Label -->
        <text x="100" y="195" text-anchor="middle" font-size="11" fill="#9CA3AF" font-family="sans-serif">${label}</text>
      </svg>
    `;

    const mouths = {
      'mouth-open-wide': {
        content: `<ellipse cx="100" cy="125" rx="30" ry="22" fill="#8B4513"/><ellipse cx="100" cy="125" rx="28" ry="20" fill="#A0522D"/><line x1="100" y1="103" x2="100" y2="147" stroke="#CD853F" stroke-width="2"/>`,
        label: '口大开'
      },
      'mouth-half-open': {
        content: `<ellipse cx="100" cy="125" rx="25" ry="15" fill="#8B4513"/><ellipse cx="100" cy="125" rx="23" ry="13" fill="#A0522D"/>`,
        label: '口半开'
      },
      'mouth-narrow': {
        content: `<line x1="75" y1="125" x2="125" y2="125" stroke="#8B4513" stroke-width="4" stroke-linecap="round"/><line x1="78" y1="125" x2="122" y2="125" stroke="#A0522D" stroke-width="2"/>`,
        label: '口窄开'
      },
      'mouth-flat': {
        content: `<line x1="70" y1="125" x2="130" y2="125" stroke="#8B4513" stroke-width="3" stroke-linecap="round"/>`,
        label: '扁平口'
      },
      'lips-round-small': {
        content: `<ellipse cx="100" cy="125" rx="12" ry="14" fill="#8B4513"/><ellipse cx="100" cy="125" rx="10" ry="12" fill="#A0522D"/>`,
        label: '圆唇小口'
      },
      'lips-closed': {
        content: `<line x1="80" y1="125" x2="120" y2="125" stroke="#C98876" stroke-width="3" stroke-linecap="round"/>`,
        label: '双唇闭合'
      },
      'lips-closed-strong': {
        content: `<line x1="78" y1="123" x2="122" y2="123" stroke="#C98876" stroke-width="4" stroke-linecap="round"/><line x1="78" y1="127" x2="122" y2="127" stroke="#B87060" stroke-width="2"/>`,
        label: '紧闭送气'
      },
      'lips-closed-tense': {
        content: `<line x1="78" y1="125" x2="122" y2="125" stroke="#A0522D" stroke-width="5" stroke-linecap="round"/>`,
        label: '紧闭紧音'
      },
      'teeth-narrow': {
        content: `<line x1="78" y1="120" x2="122" y2="120" stroke="#FFF" stroke-width="3"/><line x1="78" y1="121" x2="122" y2="121" stroke="#E0E0E0" stroke-width="1"/><line x1="80" y1="120" x2="80" y2="128" stroke="#FFF" stroke-width="1"/><line x1="90" y1="120" x2="90" y2="128" stroke="#FFF" stroke-width="1"/><line x1="100" y1="120" x2="100" y2="128" stroke="#FFF" stroke-width="1"/><line x1="110" y1="120" x2="110" y2="128" stroke="#FFF" stroke-width="1"/><line x1="120" y1="120" x2="120" y2="128" stroke="#FFF" stroke-width="1"/>`,
        label: '齿间窄缝'
      },
      'teeth-narrow-tense': {
        content: `<line x1="76" y1="120" x2="124" y2="120" stroke="#FFF" stroke-width="4"/><line x1="76" y1="122" x2="124" y2="122" stroke="#E0E0E0" stroke-width="2"/>`,
        label: '紧音窄缝'
      },
      'tongue-back-up': {
        content: `<ellipse cx="100" cy="128" rx="25" ry="18" fill="#8B4513"/><path d="M 85 118 Q 100 105 115 118 L 115 125 Q 100 115 85 125 Z" fill="#FF6B6B"/><text x="115" y="112" font-size="9" fill="#EF4444">↑舌根</text>`,
        label: '舌根抬起'
      },
      'tongue-back-up-strong': {
        content: `<ellipse cx="100" cy="128" rx="25" ry="18" fill="#8B4513"/><path d="M 82 115 Q 100 100 118 115 L 118 125 Q 100 110 82 125 Z" fill="#FF6B6B"/><text x="118" y="108" font-size="9" fill="#EF4444">↑强送气</text>`,
        label: '舌根抬送气'
      },
      'tongue-back-up-tense': {
        content: `<ellipse cx="100" cy="128" rx="22" ry="16" fill="#8B4513"/><path d="M 85 115 Q 100 102 115 115 L 115 122 Q 100 112 85 122 Z" fill="#FF4444"/><text x="115" y="110" font-size="9" fill="#EF4444">紧</text>`,
        label: '舌根紧音'
      },
      'tongue-tip-up': {
        content: `<ellipse cx="100" cy="128" rx="25" ry="18" fill="#8B4513"/><path d="M 95 125 Q 100 110 105 125 Z" fill="#FF6B6B"/><text x="105" y="108" font-size="9" fill="#EF4444">↑舌尖</text>`,
        label: '舌尖抵上'
      },
      'tongue-tip-up-strong': {
        content: `<ellipse cx="100" cy="128" rx="25" ry="18" fill="#8B4513"/><path d="M 93 122 Q 100 105 107 122 Z" fill="#FF6B6B"/><text x="107" y="103" font-size="9" fill="#EF4444">↑送气</text>`,
        label: '舌尖送气'
      },
      'tongue-tip-up-tense': {
        content: `<ellipse cx="100" cy="128" rx="22" ry="16" fill="#8B4513"/><path d="M 96 125 Q 100 112 104 125 Z" fill="#FF4444"/><text x="104" y="110" font-size="9" fill="#EF4444">紧</text>`,
        label: '舌尖紧音'
      },
      'tongue-tip-flap': {
        content: `<ellipse cx="100" cy="128" rx="25" ry="18" fill="#8B4513"/><path d="M 95 125 Q 100 115 105 125 Q 100 120 95 125" fill="#FF6B6B"/><text x="105" y="113" font-size="9" fill="#EF4444">弹</text>`,
        label: '舌尖弹动'
      },
      'throat-open': {
        content: `<ellipse cx="100" cy="128" rx="20" ry="12" fill="#8B4513"/><ellipse cx="100" cy="128" rx="18" ry="10" fill="#A0522D"/><text x="130" y="130" font-size="9" fill="#EF4444">喉</text>`,
        label: '喉部打开'
      },
    };

    const m = mouths[type] || mouths['mouth-open-wide'];
    return baseSVG(m.content, m.label);
  },

  // ====== SYLLABLE SPLIT (auto from korean) ======
  splitSyllables(text) {
    if (!text) return [];
    return text.replace(/[\s,.!??!。、~"'’‘“”]/g, '').split('');
  },

  // ====== MODAL (generic add / form dialog) ======
  openModal(title, bodyHTML, onMount) {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'sModalOverlay';
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <button class="modal-close" id="sModalClose" title="关闭">✕</button>
        </div>
        <div class="modal-body" id="sModalBody">${bodyHTML}</div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => overlay.classList.add('show'));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal();
    });
    document.getElementById('sModalClose').addEventListener('click', () => this.closeModal());

    if (onMount) onMount(document.getElementById('sModalBody'));
  },

  closeModal() {
    const existing = document.getElementById('sModalOverlay');
    if (existing) existing.remove();
    document.body.style.overflow = '';
  },

  // ====== CUSTOM DATA HELPERS ======
  getCustom(key) {
    return this.storage.get('custom_' + key, []);
  },
  setCustom(key, arr) {
    this.storage.set('custom_' + key, arr);
  },
  addCustom(key, item) {
    const arr = this.getCustom(key);
    arr.push(item);
    this.setCustom(key, arr);
    return arr;
  },
  removeCustom(key, id) {
    const arr = this.getCustom(key).filter(x => x.id !== id);
    this.setCustom(key, arr);
    return arr;
  },

  // ====== MERGED DATA (built-in + custom) ======
  getSpeakingCategories() {
    const base = S_DATA.speaking.categories;
    const custom = this.getCustom('speaking');
    if (custom.length) {
      return [...base, { id: 'custom', name: '我的语句', icon: '⭐', color: '#9F7AEA', custom: true, sentences: custom }];
    }
    return base;
  },
  getSpeakingTotal() {
    return this.getSpeakingCategories().reduce((s, c) => s + c.sentences.length, 0);
  },
  getDialogueScenarios() {
    return [...S_DATA.dialogue.scenarios, ...this.getCustom('dialogue')];
  },
  getDramaClips() {
    return [...S_DATA.drama.clips, ...this.getCustom('drama')];
  },

  // ====== HELPERS ======
  escapeHtml(s) {
    return (s == null ? '' : String(s))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  escapeAttr(s) {
    return (s == null ? '' : String(s))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  formatDate(date) {
    const d = new Date(date);
    return `${d.getMonth()+1}月${d.getDate()}日`;
  },

  getDayOffset() {
    // Days since a fixed epoch for word rotation
    const epoch = new Date('2024-01-01');
    const today = new Date();
    return Math.floor((today - epoch) / (1000 * 60 * 60 * 24));
  },
};

// ====== BOOTSTRAP ======
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => S_APP.init());
} else {
  S_APP.init();
}
