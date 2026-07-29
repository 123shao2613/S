/**
 * S - Phonics Learning Module
 * 40 Korean letters with TTS, mouth diagrams, examples
 */

const S_PHONICS = {
  currentTab: 'all',
  detailEl: null,

  init() {
    this.detailEl = document.getElementById('phonicsDetail');
    if (!this.detailEl) {
      this.detailEl = document.createElement('div');
      this.detailEl.id = 'phonicsDetail';
      this.detailEl.className = 'phonics-detail';
      document.body.appendChild(this.detailEl);
    }
  },

  render() {
    const container = document.getElementById('module-phonics');
    const studied = S_APP.storage.get('phonicsStudied', []);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">🔤 音标学习</h1>
          <p class="page-subtitle">掌握韩语40个字母的发音，从零开始打牢基础</p>
        </div>
        <div class="badge badge-primary">已学 ${studied.length}/40</div>
      </div>

      <div class="phonics-tabs">
        <div class="phonics-tab active" data-tab="all">全部 (${S_DATA.phonics.consonants.length + S_DATA.phonics.vowels.length})</div>
        <div class="phonics-tab" data-tab="consonants">基本辅音 (${S_DATA.phonics.consonants.filter(c=>c.type==='basic').length})</div>
        <div class="phonics-tab" data-tab="tense">紧辅音 (${S_DATA.phonics.consonants.filter(c=>c.type==='tense').length})</div>
        <div class="phonics-tab" data-tab="vowels">基本元音 (${S_DATA.phonics.vowels.filter(v=>v.type==='basic').length})</div>
        <div class="phonics-tab" data-tab="compound">复合元音 (${S_DATA.phonics.vowels.filter(v=>v.type==='compound').length})</div>
      </div>

      <div id="phonicsGrid" class="phonics-grid"></div>
    `;

    // Bind tabs
    container.querySelectorAll('.phonics-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.phonics-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = tab.dataset.tab;
        this.renderGrid();
      });
    });

    this.renderGrid();
  },

  renderGrid() {
    const grid = document.getElementById('phonicsGrid');
    if (!grid) return;

    const studied = S_APP.storage.get('phonicsStudied', []);
    let items = [];

    switch(this.currentTab) {
      case 'consonants':
        items = S_DATA.phonics.consonants.filter(c => c.type === 'basic');
        break;
      case 'tense':
        items = S_DATA.phonics.consonants.filter(c => c.type === 'tense');
        break;
      case 'vowels':
        items = S_DATA.phonics.vowels.filter(v => v.type === 'basic');
        break;
      case 'compound':
        items = S_DATA.phonics.vowels.filter(v => v.type === 'compound');
        break;
      default:
        items = [...S_DATA.phonics.consonants, ...S_DATA.phonics.vowels];
    }

    grid.innerHTML = items.map(item => {
      const isStudied = studied.includes(item.letter);
      const typeClass = item.type === 'tense' ? 'tense' : (item.type === 'compound' ? 'compound' : '');
      return `
        <div class="phonics-card ${typeClass} ${isStudied ? 'studied' : ''}" data-letter="${item.letter}">
          <div class="phonics-letter">${item.letter}</div>
          <div class="phonics-roman">${item.roman}</div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.phonics-card').forEach(card => {
      card.addEventListener('click', () => {
        const letter = card.dataset.letter;
        this.showDetail(letter);
      });
    });
  },

  showDetail(letter) {
    const item = [...S_DATA.phonics.consonants, ...S_DATA.phonics.vowels].find(i => i.letter === letter);
    if (!item) return;

    // Mark as studied
    const studied = S_APP.storage.get('phonicsStudied', []);
    if (!studied.includes(letter)) {
      studied.push(letter);
      S_APP.storage.set('phonicsStudied', studied);
      S_APP.addXP(5);
      S_APP.recordTask();
    }

    const typeLabel = item.type === 'tense' ? '紧辅音' : (item.type === 'compound' ? '复合元音' : (S_DATA.phonics.consonants.includes(item) ? '基本辅音' : '基本元音'));
    const typeBadge = item.type === 'tense' ? 'badge-accent' : (item.type === 'compound' ? 'badge-info' : 'badge-primary');

    this.detailEl.innerHTML = `
      <div class="phonics-detail-card">
        <div class="phonics-detail-header">
          <div style="display:flex;align-items:center;gap:16px;">
            <div class="phonics-detail-letter" style="color:${item.type === 'tense' ? 'var(--accent)' : (item.type === 'compound' ? 'var(--info)' : 'var(--text)')}">${item.letter}</div>
            <div>
              <span class="badge ${typeBadge}">${typeLabel}</span>
              <div style="font-size:1rem;color:var(--text-muted);margin-top:4px;">[${item.roman}]</div>
            </div>
          </div>
          <button class="phonics-detail-close" onclick="S_PHONICS.closeDetail()">✕</button>
        </div>

        <div class="phonics-detail-body">
          <div class="phonics-detail-row">
            <div class="phonics-mouth-svg">
              ${S_APP.generateMouthSVG(item.mouth)}
            </div>
            <div class="phonics-detail-info">
              <div class="phonics-info-item">
                <div class="phonics-info-label">发音说明</div>
                <div class="phonics-info-value">${item.sound}</div>
              </div>
              <div class="phonics-info-item">
                <div class="phonics-info-label">口型要点</div>
                <div class="phonics-info-value">${item.desc}</div>
              </div>
              <div class="phonics-info-item">
                <div class="phonics-info-label">罗马音标</div>
                <div class="phonics-info-value" style="font-size:1.2rem;font-family:monospace;color:var(--primary);">/${item.roman}/</div>
              </div>
            </div>
          </div>

          <div class="phonics-example-box">
            <button class="audio-btn" onclick="S_PHONICS.playExample('${item.example}')">🔊</button>
            <div>
              <div class="phonics-example-word">${item.example}</div>
              <div style="font-size:0.85rem;color:var(--text-muted);">[${item.exampleRoman}] ${item.exampleMeaning}</div>
            </div>
          </div>

          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" style="flex:1;" onclick="S_PHONICS.playLetter('${item.letter}')">
              🔊 听字母发音
            </button>
            <button class="btn btn-secondary" style="flex:1;" onclick="S_PHONICS.playExample('${item.example}')">
              🔊 听例词发音
            </button>
          </div>

          <div style="margin-top:12px;padding:10px 14px;background:var(--primary-50);border:1px dashed var(--primary);border-radius:var(--r-sm);font-size:0.82rem;color:var(--text-muted);">
            💡 <strong>字母名称 / 读音：</strong> <span style="font-family:'Noto Sans KR',sans-serif;font-weight:700;color:var(--primary);font-size:1rem;">${this.getLetterSoundText(item)}</span>
            ${item.type === 'basic' || item.type === 'tense'
              ? `（字母名叫「${item.name}」，实际发音出现在音节里，如 ${item.example}）`
              : '（元音直接读作该音节，如 ' + item.example + '）'}
          </div>

          <div style="margin-top:16px;padding:12px;background:var(--surface-alt);border-radius:var(--r-sm);font-size:0.8rem;color:var(--text-muted);">
            💡 <strong>学习提示：</strong> 点击"听字母发音"跟读练习，注意口型位置。熟练掌握每个字母的发音是学习韩语的第一步。
          </div>
        </div>
      </div>
    `;

    this.detailEl.classList.add('show');

    // Auto-play
    setTimeout(() => this.playLetter(item.letter), 300);

    // Update grid to show studied state
    this.renderGrid();
    // Update header count
    const headerBadge = document.querySelector('#module-phonics .badge');
    if (headerBadge) headerBadge.textContent = `已学 ${studied.length}/40`;
  },

  closeDetail() {
    this.detailEl.classList.remove('show');
    S_APP.stopSpeak();
  },

  // Build the actual pronounceable text for a letter:
  // - consonants are read by their OFFICIAL NAME (기역/니은/디귿…), then a
  //   syllable that demonstrates the real sound (가). This matches how proper
  //   Korean-learning apps (e.g. 羊驼韩语) pronounce the alphabet.
  // - vowels are spoken via their example syllable (e.g. ㅏ -> 아)
  getLetterSoundText(item) {
    if (item.type === 'basic' || item.type === 'tense') {
      return item.name + ', ' + item.example;
    }
    return item.example;
  },

  playLetter(letter) {
    const item = [...S_DATA.phonics.consonants, ...S_DATA.phonics.vowels].find(i => i.letter === letter);
    if (!item) return;
    S_APP.speak(this.getLetterSoundText(item), {
      rate: 0.7,
      onStart: () => this.setPlayingState(true),
      onEnd: () => this.setPlayingState(false),
    });
  },

  playExample(example) {
    S_APP.speak(example, {
      rate: 0.8,
      onStart: () => this.setPlayingState(true),
      onEnd: () => this.setPlayingState(false),
    });
  },

  setPlayingState(playing) {
    document.querySelectorAll('.audio-btn').forEach(btn => {
      if (playing) btn.classList.add('playing');
      else btn.classList.remove('playing');
    });
  },
};
