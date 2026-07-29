/**
 * S - Daily Vocabulary Module
 * Leveled daily words, favorites, review, history, custom words
 */

const S_VOCAB = {
  currentLevel: 'beginner',
  currentView: 'daily', // 'daily' | 'review' | 'learned' | 'custom'
  searchHistory: '',
  searchCustom: '',

  init() {},

  render() {
    const container = document.getElementById('module-vocabulary');
    const favorites = S_APP.storage.get('vocabFavorites', []);
    const learnedWords = S_APP.storage.get('vocabLearned', []);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">📚 每日单词</h1>
          <p class="page-subtitle">每日10词，分级进阶，积累词汇量</p>
        </div>
      </div>

      <div class="vocab-controls">
        <div class="level-selector">
          <button class="level-btn ${this.currentLevel==='beginner'?'active':''}" data-level="beginner">初级</button>
          <button class="level-btn ${this.currentLevel==='intermediate'?'active':''}" data-level="intermediate">中级</button>
          <button class="level-btn ${this.currentLevel==='advanced'?'active':''}" data-level="advanced">高级</button>
        </div>
        <div style="display:flex;gap:6px;margin-left:auto;flex-wrap:wrap;">
          <button class="btn btn-sm ${this.currentView==='daily'?'btn-primary':'btn-secondary'}" data-view="daily">每日推送</button>
          <button class="btn btn-sm ${this.currentView==='review'?'btn-primary':'btn-secondary'}" data-view="review">复习收藏 (${favorites.length})</button>
          <button class="btn btn-sm ${this.currentView==='learned'?'btn-primary':'btn-secondary'}" data-view="learned">已学单词 (${learnedWords.length})</button>
          <button class="btn btn-sm ${this.currentView==='custom'?'btn-primary':'btn-secondary'}" data-view="custom">我的单词</button>
          <button class="btn btn-sm btn-accent" id="addCustomWord">➕ 添加单词</button>
        </div>
      </div>

      <div id="vocabContent"></div>
    `;

    // Bind level buttons
    container.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentLevel = btn.dataset.level;
        this.render();
      });
    });

    // Bind view buttons
    container.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentView = btn.dataset.view;
        this.render();
      });
    });

    document.getElementById('addCustomWord')?.addEventListener('click', () => this.openAddModal());

    this.renderContent();
  },

  renderContent() {
    const content = document.getElementById('vocabContent');
    if (!content) return;
    if (this.currentView === 'review') this.renderReview(content);
    else if (this.currentView === 'learned') this.renderLearned(content);
    else if (this.currentView === 'custom') this.renderCustom(content);
    else this.renderDaily(content);
  },

  // ---------- DAILY ----------
  renderDaily(content) {
    const dayOffset = S_APP.getDayOffset();
    const words = S_DATA.getDailyWords(this.currentLevel, dayOffset);
    const favorites = S_APP.storage.get('vocabFavorites', []);
    const learnedWords = S_APP.storage.get('vocabLearned', []);

    const learnedToday = words.filter(w => learnedWords.includes(w.word)).length;
    const allDone = learnedToday === words.length;

    content.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
        <span class="text-muted text-sm">📅 第 ${dayOffset + 1} 天 · ${this.levelLabel(this.currentLevel)} · ${words.length} 个单词</span>
        <span class="badge ${allDone ? 'badge-success' : 'badge-warning'}">今日进度 ${learnedToday}/${words.length}</span>
      </div>

      ${allDone ? `
        <div class="complete-banner">
          <div class="complete-emoji">🎉</div>
          <div class="complete-title">今日 10 词已全部学完！</div>
          <div class="complete-desc">太棒了！明天这里会自动更新一批新单词，坚持就是胜利 ✿</div>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" data-goto="learned">📖 查看已学单词</button>
            <button class="btn btn-secondary btn-sm" data-goto="custom">➕ 添加我的单词</button>
          </div>
        </div>
      ` : `
        <div style="margin-bottom:12px;">
          <button class="btn btn-sm btn-accent" id="markAllLearned">✅ 全部标记为已学</button>
        </div>
      `}

      <div class="vocab-list">
        ${words.map((w, i) => this.renderVocabCard(w, i, favorites, learnedWords)).join('')}
      </div>
    `;

    content.querySelectorAll('[data-goto]').forEach(b => {
      b.addEventListener('click', () => {
        this.currentView = b.dataset.goto;
        this.render();
      });
    });

    const markBtn = document.getElementById('markAllLearned');
    markBtn?.addEventListener('click', () => {
      words.forEach(w => this.markLearned(w, this.currentLevel));
      S_APP.toast('已标记全部单词为已学！', 'success');
      this.render();
    });

    this.bindCardEvents(content, words, true);
  },

  markLearned(w, level) {
    const learnedWords = S_APP.storage.get('vocabLearned', []);
    if (!learnedWords.includes(w.word)) {
      learnedWords.push(w.word);
      S_APP.storage.set('vocabLearned', learnedWords);
      S_APP.addXP(3);
    }
    // History (dedup by word, keep first learned date)
    const history = S_APP.storage.get('vocabHistory', []);
    if (!history.find(h => h.word === w.word)) {
      history.push({ word: w.word, level: level, date: S_APP.getToday() });
      S_APP.storage.set('vocabHistory', history);
    }
  },

  toggleLearned(w) {
    const learned = S_APP.storage.get('vocabLearned', []);
    const history = S_APP.storage.get('vocabHistory', []);
    const word = w.word;
    if (learned.includes(word)) {
      S_APP.storage.set('vocabLearned', learned.filter(x => x !== word));
      S_APP.storage.set('vocabHistory', history.filter(h => h.word !== word));
      S_APP.toast('已取消已学标记', 'info');
    } else {
      if (!learned.includes(word)) { learned.push(word); S_APP.storage.set('vocabLearned', learned); S_APP.addXP(3); S_APP.recordTask(); }
      if (!history.find(h => h.word === word)) {
        history.push({ word, level: w.level || this.currentLevel, date: S_APP.getToday() });
        S_APP.storage.set('vocabHistory', history);
      }
      S_APP.toast('已标记为已学！+3 XP', 'success');
    }
  },

  // ---------- REVIEW (favorites) ----------
  renderReview(content) {
    const favorites = S_APP.storage.get('vocabFavorites', []);
    if (favorites.length === 0) {
      content.innerHTML = `
        <div class="card"><div class="card-body text-center" style="padding:60px;">
          <div style="font-size:3rem;margin-bottom:16px;">📋</div>
          <h3 style="margin-bottom:8px;">还没有收藏的单词</h3>
          <p class="text-muted">在每日单词中点击爱心收藏，即可在此复习</p>
          <button class="btn btn-primary mt-16" onclick="S_VOCAB.currentView='daily';S_VOCAB.render();">去学习单词</button>
        </div></div>`;
      return;
    }
    const allWords = [...S_DATA.vocabulary.beginner, ...S_DATA.vocabulary.intermediate, ...S_DATA.vocabulary.advanced];
    const favWords = allWords.filter(w => favorites.includes(w.word));
    content.innerHTML = `
      <div style="margin-bottom:16px;">
        <span class="text-muted text-sm">📋 复习模式 · 共 ${favWords.length} 个收藏单词</span>
      </div>
      <div class="vocab-list">
        ${favWords.map((w, i) => this.renderVocabCard(w, i, favorites, [])).join('')}
      </div>`;
    this.bindCardEvents(content, favWords, false);
  },

  // ---------- LEARNED (已学单词) ----------
  resolveWord(word) {
    let w = [...S_DATA.vocabulary.beginner, ...S_DATA.vocabulary.intermediate, ...S_DATA.vocabulary.advanced].find(x => x.word === word);
    if (!w) w = S_APP.getCustom('vocab').find(x => x.word === word);
    return w || null;
  },

  renderLearned(content) {
    let history = S_APP.storage.get('vocabHistory', []);
    const q = this.searchHistory.trim().toLowerCase();
    if (q) {
      history = history.filter(h => {
        const w = this.resolveWord(h.word);
        return (h.word && h.word.toLowerCase().includes(q)) ||
               (w && (w.meaning.includes(this.searchHistory.trim()) || (w.roman||'').toLowerCase().includes(q)));
      });
    }
    const learnedWords = S_APP.storage.get('vocabLearned', []);
    const favorites = S_APP.storage.get('vocabFavorites', []);
    const items = history.map(h => this.resolveWord(h.word)).filter(Boolean);

    content.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:8px;flex-wrap:wrap;">
        <span class="text-muted text-sm">✅ 已学单词 · 共 ${learnedWords.length} 个（点击 🔊 重听发音，再点"已学"可取消标记）</span>
        <input type="text" class="form-input" id="historySearch" placeholder="🔍 搜索单词 / 释义" value="${this.searchHistory}" style="max-width:220px;">
      </div>
      ${items.length === 0 ? `
        <div class="card"><div class="card-body text-center" style="padding:50px;">
          <div style="font-size:2.5rem;margin-bottom:12px;">📚</div>
          <p class="text-muted">${q ? '没有匹配的单词' : '还没有已学单词，去「每日推送」学几个吧！'}</p>
        </div></div>` :
        `<div class="vocab-list">
          ${items.map((w, i) => this.renderVocabCard(w, i, favorites, learnedWords)).join('')}
        </div>`
      }
    `;

    const search = document.getElementById('historySearch');
    search?.addEventListener('input', (e) => {
      this.searchHistory = e.target.value;
      this.renderLearned(content);
    });
    this.bindCardEvents(content, items, false);
  },

  findWord(word) {
    return [...S_DATA.vocabulary.beginner, ...S_DATA.vocabulary.intermediate, ...S_DATA.vocabulary.advanced].find(w => w.word === word);
  },

  // ---------- CUSTOM ----------
  renderCustom(content) {
    let custom = S_APP.getCustom('vocab');
    const q = this.searchCustom.trim().toLowerCase();
    if (q) custom = custom.filter(w => w.word.toLowerCase().includes(q) || (w.meaning||'').toLowerCase().includes(q) || (w.roman||'').toLowerCase().includes(q));

    content.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:8px;flex-wrap:wrap;">
        <span class="text-muted text-sm">➕ 我的单词 · 共 ${S_APP.getCustom('vocab').length} 个（点击右上角"添加单词"扩充你的词库）</span>
        <input type="text" class="form-input" id="customSearch" placeholder="🔍 搜索" value="${this.searchCustom}" style="max-width:200px;">
      </div>
      ${custom.length === 0 ? `
        <div class="card"><div class="card-body text-center" style="padding:50px;">
          <div style="font-size:2.5rem;margin-bottom:12px;">📝</div>
          <p class="text-muted">${q ? '没有匹配的单词' : '还没有自建单词，点击"添加单词"把想学的内容加进来吧！'}</p>
        </div></div>` :
        `<div class="vocab-list">
          ${custom.map((w, i) => this.renderCustomCard(w, i)).join('')}
        </div>`
      }
    `;

    const search = document.getElementById('customSearch');
    search?.addEventListener('input', (e) => {
      this.searchCustom = e.target.value;
      this.renderCustom(content);
    });
    this.bindCustomEvents(content);
  },

  renderCustomCard(w, index) {
    const favorites = S_APP.storage.get('vocabFavorites', []);
    const learnedWords = S_APP.storage.get('vocabLearned', []);
    const isFav = favorites.includes(w.word);
    const isLearned = learnedWords.includes(w.word);
    return `
      <div class="vocab-card custom-card" data-word="${w.word}">
        <div class="vocab-main">
          <div class="vocab-header">
            <span class="vocab-word">${w.word}</span>
            ${w.roman ? `<span class="vocab-roman">[${w.roman}]</span>` : ''}
            <span class="badge badge-purple">自建</span>
            ${isLearned ? '<span class="badge badge-success">已学</span>' : ''}
          </div>
          <div class="vocab-meaning">${w.meaning || ''}</div>
          ${w.sentence ? `<div class="vocab-sentence">
            <div class="vocab-sentence-ko">${w.sentence}
              <button class="audio-btn" style="width:32px;height:32px;font-size:0.85rem;" onclick="S_VOCAB.playText('${this.escapeAttr(w.sentence)}')">🔊</button>
            </div>
            <div class="vocab-sentence-zh">${w.sentenceTr || ''}</div>
          </div>` : ''}
          ${w.tip ? `<div class="vocab-tip"><span class="vocab-tip-icon">💡</span><span>${w.tip}</span></div>` : ''}
        </div>
        <div class="vocab-actions">
          <button class="audio-btn" onclick="S_VOCAB.playText('${this.escapeAttr(w.word)}')" title="听发音">🔊</button>
          <button class="fav-btn ${isFav ? 'active' : ''}" data-fav="${this.escapeAttr(w.word)}" title="收藏">${isFav ? '❤️' : '🤍'}</button>
          <button class="btn btn-sm ${isLearned ? 'btn-secondary' : 'btn-primary'}" data-learn="${this.escapeAttr(w.word)}">${isLearned ? '已学' : '标记已学'}</button>
          <button class="btn btn-sm btn-ghost" data-del="${w.id}" title="删除">🗑️</button>
        </div>
      </div>
    `;
  },

  bindCustomEvents(container) {
    container.querySelectorAll('[data-fav]').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.fav;
        const favorites = S_APP.storage.get('vocabFavorites', []);
        if (favorites.includes(word)) { favorites.splice(favorites.indexOf(word), 1); S_APP.toast('已取消收藏', 'info'); }
        else { favorites.push(word); S_APP.toast('已加入收藏 ❤️', 'success'); }
        S_APP.storage.set('vocabFavorites', favorites);
        this.render();
      });
    });
    container.querySelectorAll('[data-learn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.learn;
        const w = S_APP.getCustom('vocab').find(x => x.word === word);
        if (w) this.toggleLearned(w);
        this.render();
      });
    });
    container.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        S_APP.removeCustom('vocab', btn.dataset.del);
        S_APP.toast('已删除该单词', 'info');
        this.render();
      });
    });
  },

  // ---------- SHARED CARD ----------
  renderVocabCard(w, index, favorites, learnedWords) {
    const isFav = favorites.includes(w.word);
    const isLearned = learnedWords.includes(w.word);
    return `
      <div class="vocab-card ${isFav ? 'favorite' : ''}" data-word="${w.word}">
        <div class="vocab-main">
          <div class="vocab-header">
            <span class="vocab-word">${w.word}</span>
            <span class="vocab-roman">[${w.roman}]</span>
            ${isLearned ? '<span class="badge badge-success">已学</span>' : ''}
          </div>
          <div class="vocab-meaning">${w.meaning}</div>
          <div class="vocab-sentence">
            <div class="vocab-sentence-ko">
              ${w.sentence}
              <button class="audio-btn" style="width:32px;height:32px;font-size:0.85rem;" onclick="S_VOCAB.playText('${this.escapeAttr(w.sentence)}')">🔊</button>
            </div>
            <div class="vocab-sentence-zh">${w.sentenceTr}</div>
          </div>
          <div class="vocab-tip"><span class="vocab-tip-icon">💡</span><span>${w.tip}</span></div>
        </div>
        <div class="vocab-actions">
          <button class="audio-btn" onclick="S_VOCAB.playText('${this.escapeAttr(w.word)}')" title="听发音">🔊</button>
          <button class="fav-btn ${isFav ? 'active' : ''}" data-fav="${w.word}" title="收藏">${isFav ? '❤️' : '🤍'}</button>
          <button class="btn btn-sm ${isLearned ? 'btn-secondary' : 'btn-primary'}" data-learn="${w.word}">${isLearned ? '已学' : '标记已学'}</button>
        </div>
      </div>
    `;
  },

  bindCardEvents(container, words, isDaily) {
    container.querySelectorAll('[data-fav]').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.fav;
        const favorites = S_APP.storage.get('vocabFavorites', []);
        if (favorites.includes(word)) { favorites.splice(favorites.indexOf(word), 1); S_APP.toast('已取消收藏', 'info'); }
        else { favorites.push(word); S_APP.toast('已加入收藏 ❤️', 'success'); }
        S_APP.storage.set('vocabFavorites', favorites);
        this.render();
      });
    });
    container.querySelectorAll('[data-learn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.learn;
        const w = words.find(x => x.word === word) || this.resolveWord(word);
        if (w) this.toggleLearned(w);
        this.render();
      });
    });
  },

  // ---------- ADD MODAL ----------
  openAddModal() {
    const body = `
      <div class="form-group">
        <label>韩语单词 *</label>
        <input type="text" class="form-input" id="cwWord" placeholder="예: 비행기">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>罗马音</label>
          <input type="text" class="form-input" id="cwRoman" placeholder="bihaenggi">
        </div>
        <div class="form-group">
          <label>难度</label>
          <select class="form-input" id="cwLevel">
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>中文释义 *</label>
        <input type="text" class="form-input" id="cwMeaning" placeholder="例: 飞机">
      </div>
      <div class="form-group">
        <label>例句（韩语）</label>
        <input type="text" class="form-input" id="cwSentence" placeholder="예: 비행기를 탔어요.">
      </div>
      <div class="form-group">
        <label>例句翻译</label>
        <input type="text" class="form-input" id="cwSentenceTr" placeholder="我坐了飞机。">
      </div>
      <div class="form-group">
        <label>记忆提示</label>
        <input type="text" class="form-input" id="cwTip" placeholder="记忆小技巧">
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
        <button class="btn btn-secondary" onclick="S_APP.closeModal()">取消</button>
        <button class="btn btn-primary" id="cwSave">保存单词</button>
      </div>
    `;
    S_APP.openModal('➕ 添加我的单词', body, () => {
      document.getElementById('cwSave').addEventListener('click', () => {
        const word = document.getElementById('cwWord').value.trim();
        const meaning = document.getElementById('cwMeaning').value.trim();
        if (!word || !meaning) { S_APP.toast('请填写韩语单词和中文释义', 'warning'); return; }
        const item = {
          id: 'cw_' + Date.now(),
          word,
          roman: document.getElementById('cwRoman').value.trim(),
          meaning,
          sentence: document.getElementById('cwSentence').value.trim(),
          sentenceTr: document.getElementById('cwSentenceTr').value.trim(),
          tip: document.getElementById('cwTip').value.trim(),
          level: document.getElementById('cwLevel').value,
        };
        S_APP.addCustom('vocab', item);
        S_APP.toast('单词已添加！可在"我的单词"中学习 ❤️', 'success');
        S_APP.closeModal();
        this.currentView = 'custom';
        this.render();
      });
    });
  },

  playText(text) {
    S_APP.speak(text, { rate: 0.8 });
  },

  escapeAttr(s) {
    return (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;');
  },

  levelLabel(level) {
    return { beginner: '初级', intermediate: '中级', advanced: '高级' }[level] || '初级';
  },
};
