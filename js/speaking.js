/**
 * S - Speaking Practice Module
 * Scenario sentences with TTS, recording, pronunciation scoring, history, custom
 */

const S_SPEAKING = {
  currentCategory: 0,
  currentSentence: 0,
  isRecording: false,
  lastScore: null,
  userRecordingUrl: null,
  currentView: 'practice', // 'practice' | 'history'
  searchHistory: '',
  suppressAutoplay: false,

  init() {},

  getCategories() { return S_APP.getSpeakingCategories(); },

  render() {
    const container = document.getElementById('module-speaking');
    const categories = this.getCategories();
    const practiced = S_APP.storage.get('speakingPracticed', []);
    const scores = S_APP.storage.get('speakingScores', []);

    if (this.currentCategory >= categories.length) this.currentCategory = 0;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">🎤 语句跟读</h1>
          <p class="page-subtitle">跟读标准发音，AI 智能评分，精准纠正发音</p>
        </div>
        <div style="display:flex;gap:8px;">
          <span class="badge badge-primary">已练 ${practiced.length} 句</span>
          <span class="badge badge-success">平均分 ${scores.length > 0 ? Math.round(scores.reduce((a,b)=>a+b)/scores.length) : 0}</span>
        </div>
      </div>

      <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">
        <button class="btn btn-sm ${this.currentView==='practice'?'btn-primary':'btn-secondary'}" data-view="practice">跟读练习</button>
        <button class="btn btn-sm ${this.currentView==='history'?'btn-primary':'btn-secondary'}" data-view="history">跟读历史</button>
        <button class="btn btn-sm btn-accent" id="addSentenceBtn" style="margin-left:auto;">➕ 添加语句</button>
      </div>

      ${this.currentView === 'history'
        ? '<div id="speakingHistoryArea"></div>'
        : `
          <div class="speaking-categories" id="speakingCategories"></div>
          <div id="speakingPracticeArea"></div>
        `
      }
    `;

    container.querySelectorAll('[data-view]').forEach(b => {
      b.addEventListener('click', () => { this.currentView = b.dataset.view; this.render(); });
    });
    document.getElementById('addSentenceBtn')?.addEventListener('click', () => this.openAddModal());

    if (this.currentView === 'history') {
      this.renderHistory(document.getElementById('speakingHistoryArea'));
    } else {
      this.renderCategories();
      this.renderPracticeArea();
    }
  },

  renderCategories() {
    const wrap = document.getElementById('speakingCategories');
    if (!wrap) return;
    const categories = this.getCategories();
    const practiced = S_APP.storage.get('speakingPracticed', []);
    wrap.innerHTML = categories.map((cat, i) => {
      const done = cat.sentences.filter(s => practiced.includes(s.korean)).length;
      return `
        <div class="speaking-cat-card ${i === this.currentCategory ? 'active' : ''}" data-cat="${i}">
          <div class="speaking-cat-icon">${cat.icon}</div>
          <div class="speaking-cat-name">${cat.name}${cat.custom ? ' <span class="badge badge-purple">自建</span>' : ''}</div>
          <div class="speaking-cat-count">${done}/${cat.sentences.length} 句</div>
          ${cat.custom ? `<button class="cat-del" data-delcat="${i}" title="删除板块">🗑️</button>` : ''}
        </div>`;
    }).join('');

    wrap.querySelectorAll('.speaking-cat-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-delcat]')) return;
        this.currentCategory = parseInt(card.dataset.cat);
        this.currentSentence = 0;
        this.lastScore = null;
        this.userRecordingUrl = null;
        this.render();
      });
    });
    wrap.querySelectorAll('[data-delcat]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const cat = categories[parseInt(b.dataset.delcat)];
        if (cat && cat.custom) {
          // delete all custom sentences in this category
          const custom = S_APP.getCustom('speaking').filter(s => !cat.sentences.find(x => x.id === s.id));
          S_APP.setCustom('speaking', custom);
          S_APP.toast('已删除"我的语句"板块', 'info');
          if (this.currentCategory >= this.getCategories().length) this.currentCategory = 0;
          this.render();
        }
      });
    });
  },

  renderPracticeArea() {
    const area = document.getElementById('speakingPracticeArea');
    if (!area) return;

    const categories = this.getCategories();
    const cat = categories[this.currentCategory];
    const sentence = cat.sentences[this.currentSentence];
    const practiced = S_APP.storage.get('speakingPracticed', []);
    const isPracticed = practiced.includes(sentence.korean);
    const syllables = sentence.syllables || S_APP.splitSyllables(sentence.korean);

    area.innerHTML = `
      <div class="speaking-practice-area">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:8px;">
          <div>
            <span style="font-size:1.5rem;">${cat.icon}</span>
            <span style="font-size:1rem;font-weight:700;margin-left:8px;">${cat.name}</span>
            ${isPracticed ? '<span class="badge badge-success" style="margin-left:8px;">✓ 已跟读</span>' : ''}
          </div>
          <span class="text-muted text-sm">第 ${this.currentSentence + 1} / ${cat.sentences.length} 句</span>
        </div>

        <div class="speaking-sentence-display">
          <div class="speaking-sentence-ko">${sentence.korean}</div>
          <div class="speaking-syllables" id="syllableContainer">
            ${syllables.map(s => `<span class="syllable">${s}</span>`).join('')}
          </div>
          ${sentence.roman ? `<div class="speaking-sentence-roman">${sentence.roman}</div>` : ''}
          <div class="speaking-sentence-zh">${sentence.chinese}</div>
        </div>

        <div class="speaking-controls">
          <button class="speaking-btn play" id="playBtn" title="播放标准发音">▶</button>
          <button class="speaking-btn record" id="recordBtn" title="按住录音跟读">🎤</button>
          <button class="speaking-btn next" id="nextBtn" title="下一句">⏭</button>
        </div>

        <div id="scoreArea"></div>

        <div class="speaking-nav">
          <button class="btn btn-secondary btn-sm" id="prevBtn" ${this.currentSentence === 0 ? 'disabled' : ''}>← 上一句</button>
          <div class="speaking-progress">进度：${this.currentSentence + 1} / ${cat.sentences.length}</div>
          <button class="btn btn-secondary btn-sm" id="nextBtn2" ${this.currentSentence === cat.sentences.length - 1 ? 'disabled' : ''}>下一句 →</button>
        </div>

        <div style="margin-top:20px;padding:16px;background:var(--info-50);border-radius:var(--r);font-size:0.8rem;color:var(--text-secondary);">
          ℹ️ <strong>使用说明：</strong> 点击 ▶ 播放标准发音，点击 🎤 开始录音跟读，系统将自动评分并标注发音不准的音节。绿色=正确，黄色=部分正确，红色=需改进。
        </div>
      </div>
    `;

    document.getElementById('playBtn').addEventListener('click', () => this.playStandard(sentence.korean));
    document.getElementById('recordBtn').addEventListener('click', () => {
      if (this.isRecording) this.stopAndScore(sentence);
      else this.startRecording();
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => this.nextSentence());
    document.getElementById('nextBtn2')?.addEventListener('click', () => this.nextSentence());
    document.getElementById('prevBtn')?.addEventListener('click', () => this.prevSentence());

    if (!this.suppressAutoplay) {
      setTimeout(() => this.playStandard(sentence.korean), 500);
    }
    this.suppressAutoplay = false;
  },

  playStandard(text) {
    const btn = document.getElementById('playBtn');
    if (btn) { btn.classList.add('playing'); btn.textContent = '⏸'; }
    S_APP.speak(text, {
      rate: 0.8,
      onEnd: () => { if (btn) { btn.classList.remove('playing'); btn.textContent = '▶'; } },
      onError: () => { if (btn) { btn.classList.remove('playing'); btn.textContent = '▶'; } }
    });
  },

  async startRecording() {
    const btn = document.getElementById('recordBtn');
    if (btn) { btn.classList.add('recording'); btn.textContent = '⏹'; }
    this.isRecording = true;
    this.recognitionPromise = S_APP.recognizeSpeech(10000);
    const success = await S_APP.startRecording();
    if (!success) {
      this.isRecording = false;
      if (btn) { btn.classList.remove('recording'); btn.textContent = '🎤'; }
    }
  },

  async stopAndScore(sentence) {
    const btn = document.getElementById('recordBtn');
    if (btn) { btn.classList.remove('recording'); btn.textContent = '🎤'; }
    this.isRecording = false;

    const scoreArea = document.getElementById('scoreArea');
    scoreArea.innerHTML = `
      <div class="speaking-score-area">
        <div style="font-size:1.5rem;margin-bottom:8px;">⏳</div>
        <div class="text-muted">正在分析发音...</div>
      </div>`;

    const recording = await S_APP.stopRecording();
    const recognitionResult = await this.recognitionPromise;

    let scoreResult;
    if (recognitionResult && recognitionResult.success && recognitionResult.transcript) {
      scoreResult = S_APP.scorePronunciation(sentence.korean, recognitionResult.transcript);
    } else {
      scoreResult = S_APP.simulateScore(sentence.korean);
    }

    this.lastScore = scoreResult;
    this.displayScore(scoreResult, sentence);

    // Save score
    const scores = S_APP.storage.get('speakingScores', []);
    scores.push(scoreResult.score);
    S_APP.storage.set('speakingScores', scores);

    // Mark practiced (unique) + history (with date)
    const practiced = S_APP.storage.get('speakingPracticed', []);
    if (!practiced.includes(sentence.korean)) {
      practiced.push(sentence.korean);
      S_APP.storage.set('speakingPracticed', practiced);
      S_APP.addXP(8);
      S_APP.recordTask();
    }
    const history = S_APP.storage.get('speakingHistory', []);
    history.push({
      korean: sentence.korean,
      chinese: sentence.chinese,
      category: this.getCategories()[this.currentCategory].name,
      date: S_APP.getToday(),
      score: scoreResult.score,
    });
    S_APP.storage.set('speakingHistory', history);

    if (recording && recording.url) this.userRecordingUrl = recording.url;

    // Refresh counts & practiced badge without replaying audio
    this.suppressAutoplay = true;
    this.renderCategories();
  },

  displayScore(result, sentence) {
    const scoreArea = document.getElementById('scoreArea');
    const scoreClass = result.score >= 80 ? 'high' : (result.score >= 50 ? 'mid' : 'low');
    const scoreEmoji = result.score >= 80 ? '🌟' : (result.score >= 50 ? '👍' : '💪');
    const scoreMsg = result.score >= 80 ? '发音非常标准！' : (result.score >= 50 ? '还不错，继续加油！' : '需要多加练习哦');
    const syllables = sentence.syllables || S_APP.splitSyllables(sentence.korean);

    const syllableContainer = document.getElementById('syllableContainer');
    if (syllableContainer && result.syllableResults.length > 0) {
      const syls = syllableContainer.querySelectorAll('.syllable');
      result.syllableResults.forEach((sr, i) => { if (syls[i]) syls[i].className = `syllable ${sr.status}`; });
    } else if (syllableContainer) {
      // color all syllables by overall score when no per-syllable data
      const all = result.score >= 80 ? 'correct' : (result.score >= 50 ? 'partial' : 'incorrect');
      syllableContainer.querySelectorAll('.syllable').forEach(s => s.className = `syllable ${all}`);
    }

    const methodLabel = result.method === 'recognition' ? '语音识别评分' : (result.method === 'simulated' ? '模拟评分' : '基础评分');

    scoreArea.innerHTML = `
      <div class="speaking-score-area">
        <div class="score-circle ${scoreClass}">${result.score}</div>
        <div style="font-size:1.1rem;font-weight:700;margin-bottom:4px;">${scoreEmoji} ${scoreMsg}</div>
        <div class="text-muted text-sm">${methodLabel}${result.score >= 80 ? ' · 已记录到跟读历史 ✓' : ''}</div>

        ${result.syllableResults.length > 0 ? `
          <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;border-radius:50%;background:var(--success);display:inline-block;"></span><span class="text-sm">正确 ${result.syllableResults.filter(s=>s.status==='correct').length}</span></div>
            <div style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;border-radius:50%;background:var(--warning);display:inline-block;"></span><span class="text-sm">部分正确 ${result.syllableResults.filter(s=>s.status==='partial').length}</span></div>
            <div style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;border-radius:50%;background:var(--danger);display:inline-block;"></span><span class="text-sm">需改进 ${result.syllableResults.filter(s=>s.status==='incorrect').length}</span></div>
          </div>` : ''}

        <div style="margin-top:16px;display:flex;gap:8px;justify-content:center;">
          <button class="btn btn-sm btn-primary" onclick="S_SPEAKING.replayStandard()">🔊 重听标准</button>
          ${this.userRecordingUrl ? `<button class="btn btn-sm btn-secondary" onclick="S_SPEAKING.replayUser()">🔊 听我的录音</button>` : ''}
          <button class="btn btn-sm btn-accent" onclick="S_SPEAKING.retry()">🔄 再试一次</button>
        </div>
      </div>
    `;
  },

  replayStandard() {
    const cat = this.getCategories()[this.currentCategory];
    const sentence = cat.sentences[this.currentSentence];
    this.playStandard(sentence.korean);
  },

  replayUser() {
    if (this.userRecordingUrl) new Audio(this.userRecordingUrl).play();
  },

  retry() {
    this.lastScore = null;
    this.renderPracticeArea();
  },

  nextSentence() {
    const cat = this.getCategories()[this.currentCategory];
    if (this.currentSentence < cat.sentences.length - 1) {
      this.currentSentence++;
      this.lastScore = null;
      this.userRecordingUrl = null;
      this.renderPracticeArea();
    } else {
      S_APP.toast('已完成本场景全部句子！🎉', 'success');
    }
  },

  prevSentence() {
    if (this.currentSentence > 0) {
      this.currentSentence--;
      this.lastScore = null;
      this.userRecordingUrl = null;
      this.renderPracticeArea();
    }
  },

  // ---------- HISTORY ----------
  renderHistory(area) {
    if (!area) return;
    let history = S_APP.storage.get('speakingHistory', []);
    const q = this.searchHistory.trim().toLowerCase();
    if (q) history = history.filter(h => (h.korean && h.korean.toLowerCase().includes(q)) || (h.chinese && h.chinese.toLowerCase().includes(q)) || (h.category && h.category.includes(this.searchHistory.trim())));

    const groups = {};
    history.forEach(h => { (groups[h.date] = groups[h.date] || []).push(h); });
    const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    area.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:8px;flex-wrap:wrap;">
        <span class="text-muted text-sm">📖 跟读历史 · 共 ${S_APP.storage.get('speakingHistory', []).length} 条记录</span>
        <input type="text" class="form-input" id="spHistorySearch" placeholder="🔍 搜索句子/板块" value="${this.searchHistory}" style="max-width:220px;">
      </div>
      ${dates.length === 0 ? `
        <div class="card"><div class="card-body text-center" style="padding:50px;">
          <div style="font-size:2.5rem;margin-bottom:12px;">🎤</div>
          <p class="text-muted">${q ? '没有匹配的记录' : '还没有跟读记录，去跟读几句试试吧！'}</p>
        </div></div>` :
        dates.map(d => `
          <div class="history-group">
            <div class="history-date">📅 ${d} · 跟读 ${groups[d].length} 句</div>
            <div class="history-list">
              ${groups[d].map(h => {
                const sc = h.score >= 80 ? 'high' : (h.score >= 50 ? 'mid' : 'low');
                return `<div class="history-row">
                  <div class="h-row-main">
                    <div class="h-row-ko">${h.korean} <button class="audio-btn audio-mini" onclick="S_APP.speak('${this.escapeAttr(h.korean)}',{rate:0.8})">🔊</button></div>
                    <div class="h-row-zh">${h.chinese} · <span class="text-muted">${h.category}</span></div>
                  </div>
                  <div class="score-pill ${sc}">${h.score}分</div>
                </div>`;
              }).join('')}
            </div>
          </div>`).join('')
      }
    `;

    const search = document.getElementById('spHistorySearch');
    search?.addEventListener('input', (e) => { this.searchHistory = e.target.value; this.renderHistory(area); });
  },

  // ---------- ADD MODAL ----------
  openAddModal() {
    const body = `
      <div class="form-group">
        <label>韩语句子 *</label>
        <input type="text" class="form-input" id="csKo" placeholder="예: 여기서 명동까지 어떻게 가요?">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>罗马音</label>
          <input type="text" class="form-input" id="csRo" placeholder="yeogiseo Myeongdongkkaji eotteoke gayo?">
        </div>
        <div class="form-group">
          <label>中文翻译 *</label>
          <input type="text" class="form-input" id="csZh" placeholder="从这里到明洞怎么走？">
        </div>
      </div>
      <p class="text-muted text-sm">保存后将进入"我的语句"板块，可正常跟读评分。</p>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
        <button class="btn btn-secondary" onclick="S_APP.closeModal()">取消</button>
        <button class="btn btn-primary" id="csSave">保存语句</button>
      </div>
    `;
    S_APP.openModal('➕ 添加我的语句', body, () => {
      document.getElementById('csSave').addEventListener('click', () => {
        const korean = document.getElementById('csKo').value.trim();
        const chinese = document.getElementById('csZh').value.trim();
        if (!korean || !chinese) { S_APP.toast('请填写韩语句子和中文翻译', 'warning'); return; }
        const item = {
          id: 'cs_' + Date.now(),
          korean,
          roman: document.getElementById('csRo').value.trim(),
          chinese,
        };
        S_APP.addCustom('speaking', item);
        S_APP.toast('语句已添加！可在"我的语句"板块跟读 ⭐', 'success');
        S_APP.closeModal();
        this.currentView = 'practice';
        this.currentCategory = this.getCategories().length - 1;
        this.currentSentence = 0;
        this.render();
      });
    });
  },

  escapeAttr(s) {
    return (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;');
  },
};
