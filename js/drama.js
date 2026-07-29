/**
 * S - Korean Drama Appreciation Module
 * Classic drama clips with bilingual subtitles and vocabulary, custom clips
 */

const S_DRAMA = {
  currentClip: null,
  currentLine: 0,
  subtitleMode: 'both', // 'both' | 'ko' | 'zh'
  autoPlay: false,
  playTimer: null,

  init() {},

  getClips() { return S_APP.getDramaClips(); },

  render() {
    const container = document.getElementById('module-drama');
    const watchedClips = S_APP.storage.get('dramaWatched', []);
    const clips = this.getClips();

    const bannerColors = [
      'linear-gradient(135deg, #FF6B9D, #C44569)',
      'linear-gradient(135deg, #74C0FC, #1971C2)',
      'linear-gradient(135deg, #69DB7C, #2F9E44)',
      'linear-gradient(135deg, #FFA94D, #E8590C)',
      'linear-gradient(135deg, #B197FC, #7048E8)',
      'linear-gradient(135deg, #FFD43B, #F08C00)',
    ];

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">🎬 经典台词</h1>
          <p class="page-subtitle">精选韩剧经典台词，双语字幕，在真实语境中提升听力与语感</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="badge badge-primary">已学 ${watchedClips.length}/${clips.length}</span>
          <button class="btn btn-sm btn-accent" id="addClipBtn">➕ 添加台词</button>
        </div>
      </div>

      <div class="drama-list">
        ${clips.map((clip, i) => `
          <div class="drama-card ${this.currentClip === clip.id ? 'active' : ''}" data-clip="${clip.id}">
            <div class="drama-card-banner" style="background:${bannerColors[i % bannerColors.length]}">
              ${this.getGenreEmoji(clip.genre)}
            </div>
            <div class="drama-card-title">${clip.title}${clip.custom ? ' <span class="badge badge-purple">自建</span>' : ''}</div>
            <div class="drama-card-info">
              <span class="badge badge-primary">${clip.genre}</span>
              <span class="text-muted text-sm">${clip.lines.length} 句</span>
            </div>
            <div class="drama-card-desc">${clip.desc}</div>
            ${watchedClips.includes(clip.id) ? '<div style="margin-top:6px;"><span class="badge badge-success">✓ 已学</span></div>' : ''}
            ${clip.custom ? `<button class="clip-del" data-del="${clip.id}" title="删除">🗑️</button>` : ''}
          </div>
        `).join('')}
      </div>

      <div id="dramaPlayerArea"></div>
    `;

    container.querySelectorAll('.drama-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-del]')) return;
        this.currentClip = card.dataset.clip;
        this.currentLine = 0;
        this.autoPlay = false;
        this.render();
      });
    });
    container.querySelectorAll('[data-del]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        S_APP.removeCustom('drama', b.dataset.del);
        if (this.currentClip === b.dataset.del) { this.currentClip = null; this.currentLine = 0; }
        S_APP.toast('已删除自定义片段', 'info');
        this.render();
      });
    });
    document.getElementById('addClipBtn')?.addEventListener('click', () => this.openAddModal());

    this.renderPlayer();
  },

  renderPlayer() {
    const area = document.getElementById('dramaPlayerArea');
    if (!area) return;
    if (!this.currentClip) {
      area.innerHTML = `
        <div class="card"><div class="card-body text-center" style="padding:60px;">
          <div style="font-size:3rem;margin-bottom:16px;">🎬</div>
          <h3 style="margin-bottom:8px;">选择一段经典台词</h3>
          <p class="text-muted">点击上方的台词卡片，开始沉浸式学习</p>
        </div></div>`;
      return;
    }

    const clip = this.getClips().find(c => c.id === this.currentClip);
    if (!clip) return;
    const line = clip.lines[this.currentLine];
    const watchedClips = S_APP.storage.get('dramaWatched', []);

    area.innerHTML = `
      <div class="drama-player">
        <div class="drama-player-header">
          <div>
            <div class="drama-player-title">${clip.title}</div>
            <div class="text-muted text-sm">${clip.genre} · ${clip.desc}</div>
          </div>
          <div class="drama-subtitle-toggle">
            <button class="subtitle-mode-btn ${this.subtitleMode==='both'?'active':''}" data-mode="both">双语</button>
            <button class="subtitle-mode-btn ${this.subtitleMode==='ko'?'active':''}" data-mode="ko">韩语</button>
            <button class="subtitle-mode-btn ${this.subtitleMode==='zh'?'active':''}" data-mode="zh">中文</button>
          </div>
        </div>

        <div class="drama-stage">
          <div class="drama-stage-scene">Scene ${this.currentLine + 1} / ${clip.lines.length}</div>
          ${this.subtitleMode !== 'zh' ? `<div class="drama-subtitle-ko">${line.korean}</div>` : ''}
          ${this.subtitleMode !== 'ko' ? `<div class="drama-subtitle-zh">${line.chinese}</div>` : ''}
          <div class="drama-words-bar">
            ${line.words.map(w => `<div class="drama-word-chip"><span class="w-ko">${w.w}</span><span class="w-zh">${w.m}</span></div>`).join('')}
          </div>
        </div>

        <div class="drama-controls">
          <button class="drama-play-btn" id="dramaPlayBtn" title="播放/暂停">${this.autoPlay ? '⏸' : '▶'}</button>
          <div class="drama-progress-bar">
            <div class="drama-line-list">
              ${clip.lines.map((_, i) => `<div class="drama-line-dot ${i === this.currentLine ? 'active' : ''} ${i < this.currentLine ? 'done' : ''}" data-line="${i}" title="第 ${i+1} 句"></div>`).join('')}
            </div>
            <div class="drama-line-text">
              ${this.currentLine + 1} / ${clip.lines.length} ·
              <button class="btn btn-ghost btn-sm" onclick="S_DRAMA.playCurrent()">🔊 播放本句</button>
              <button class="btn btn-ghost btn-sm" onclick="S_DRAMA.repeatAfter()">🎤 跟读</button>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" id="dramaPrevBtn" ${this.currentLine === 0 ? 'disabled' : ''}>← 上一句</button>
          <button class="btn btn-secondary btn-sm" id="dramaNextBtn" ${this.currentLine === clip.lines.length - 1 ? 'disabled' : ''}>下一句 →</button>
        </div>

        <div style="padding:16px 24px;border-top:1px solid var(--border-light);background:var(--surface-alt);">
          <div class="text-sm font-bold mb-8">📝 全部台词</div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${clip.lines.map((l, i) => `
              <div style="display:flex;gap:8px;align-items:flex-start;padding:8px;border-radius:var(--r-sm);cursor:pointer;transition:var(--t);background:${i===this.currentLine?'var(--primary-50)':'transparent'};" class="drama-line-row" data-line="${i}">
                <span style="color:var(--text-muted);font-size:0.75rem;min-width:20px;">${i+1}</span>
                <div style="flex:1;">
                  <div style="font-family:'Noto Sans KR',sans-serif;font-size:0.9rem;color:var(--text);${i===this.currentLine?'font-weight:700;':''}">${l.korean}</div>
                  <div class="text-muted text-sm">${l.chinese}</div>
                </div>
                <button class="audio-btn" style="width:28px;height:28px;font-size:0.7rem;" data-audio-line="${i}">🔊</button>
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;

    area.querySelectorAll('.subtitle-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => { this.subtitleMode = btn.dataset.mode; this.renderPlayer(); });
    });
    document.getElementById('dramaPlayBtn')?.addEventListener('click', () => {
      if (this.autoPlay) this.stopAutoPlay(); else this.startAutoPlay(clip);
    });
    document.getElementById('dramaPrevBtn')?.addEventListener('click', () => this.prevLine(clip));
    document.getElementById('dramaNextBtn')?.addEventListener('click', () => this.nextLine(clip));
    area.querySelectorAll('.drama-line-dot').forEach(dot => {
      dot.addEventListener('click', () => { this.currentLine = parseInt(dot.dataset.line); this.renderPlayer(); this.playCurrent(); });
    });
    area.querySelectorAll('.drama-line-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('[data-audio-line]')) return;
        this.currentLine = parseInt(row.dataset.line);
        this.renderPlayer();
        this.playCurrent();
      });
    });
    area.querySelectorAll('[data-audio-line]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.audioLine);
        this.currentLine = idx;
        S_APP.speak(clip.lines[idx].korean, { rate: 0.85 });
        this.renderPlayer();
      });
    });

    if (this.currentLine === clip.lines.length - 1) {
      if (!watchedClips.includes(clip.id)) {
        watchedClips.push(clip.id);
        S_APP.storage.set('dramaWatched', watchedClips);
        S_APP.addXP(15);
        S_APP.recordTask();
        S_APP.toast('学完一段台词！+15 XP 🎬', 'success');
      }
    }
    if (this.autoPlay) setTimeout(() => this.playCurrent(), 300);
  },

  playCurrent() {
    const clip = this.getClips().find(c => c.id === this.currentClip);
    if (!clip) return;
    const line = clip.lines[this.currentLine];
    S_APP.speak(line.korean, {
      rate: 0.8,
      onEnd: () => {
        if (this.autoPlay) {
          this.playTimer = setTimeout(() => {
            if (this.currentLine < clip.lines.length - 1) this.nextLine(clip);
            else this.stopAutoPlay();
          }, 1500);
        }
      }
    });
  },

  repeatAfter() {
    const clip = this.getClips().find(c => c.id === this.currentClip);
    if (!clip) return;
    const line = clip.lines[this.currentLine];
    S_APP.speak(line.korean, {
      rate: 0.75,
      onEnd: () => { S_APP.toast('请跟读：' + line.korean, 'info'); S_SPEAKING.startRecording?.(); }
    });
  },

  startAutoPlay(clip) {
    this.autoPlay = true;
    const btn = document.getElementById('dramaPlayBtn');
    if (btn) btn.textContent = '⏸';
    this.playCurrent();
  },

  stopAutoPlay() {
    this.autoPlay = false;
    if (this.playTimer) { clearTimeout(this.playTimer); this.playTimer = null; }
    S_APP.stopSpeak();
    const btn = document.getElementById('dramaPlayBtn');
    if (btn) btn.textContent = '▶';
  },

  nextLine(clip) {
    if (this.currentLine < clip.lines.length - 1) {
      this.currentLine++;
      this.renderPlayer();
      if (this.autoPlay) setTimeout(() => this.playCurrent(), 300);
    } else { this.stopAutoPlay(); S_APP.toast('已播放到最后一句', 'info'); }
  },

  prevLine(clip) {
    if (this.currentLine > 0) {
      this.currentLine--;
      this.renderPlayer();
      if (this.autoPlay) setTimeout(() => this.playCurrent(), 300);
    }
  },

  getGenreEmoji(genre) {
    const map = { '浪漫': '💕', '治愈': '🌙', '励志': '✨', '温情': '🏡', '自定义': '⭐' };
    return map[genre] || '🎬';
  },

  // ---------- ADD CUSTOM CLIP ----------
  openAddModal() {
    const body = `
      <div class="form-row">
        <div class="form-group" style="flex:2;"><label>台词标题 *</label><input type="text" class="form-input" id="dcTitle" placeholder="예: 공항에서의 작별"></div>
        <div class="form-group" style="flex:1;"><label>类型</label><input type="text" class="form-input" id="dcGenre" value="自定义"></div>
      </div>
      <div class="form-group"><label>简介</label><input type="text" class="form-input" id="dcDesc" placeholder="예: 机场送别的名场面"></div>

      <div class="extract-tabs">
        <div class="extract-tab active" data-tab="manual">✍️ 手动添加</div>
        <div class="extract-tab" data-tab="video">📹 从视频提取</div>
      </div>

      <div class="extract-panel active" id="panelManual">
        <div class="steps-editor">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <div class="font-bold">🎞️ 台词</div>
            <button class="btn btn-sm btn-secondary" id="dcAddLine">+ 添加一句</button>
          </div>
          <div id="dcLines"></div>
        </div>
      </div>

      <div class="extract-panel" id="panelVideo">
        <div class="form-group">
          <label>上传视频 / 音频文件</label>
          <input type="file" class="form-input" id="dcVideoFile" accept="video/*,audio/*">
        </div>
        <div class="extract-video-wrap" id="dcVideoWrap"></div>
        <div class="extract-hint">💡 播放视频，边听边把听到的韩文台词逐行输入到下方（每行一句）。也可点"🎤 语音录入"用麦克风识别，识别结果会自动填入。</div>
        <div class="form-group">
          <label>提取到的韩文台词（每行一句）</label>
          <textarea class="form-input" id="dcExtractText" rows="6" placeholder="예: 사랑한다면 당연히 말해야지.&#10;우리 엄마가 제일 예쁘지?"></textarea>
        </div>
        <div class="extract-actions">
          <button class="btn btn-sm btn-secondary" id="dcMicBtn">🎤 语音录入</button>
          <button class="btn btn-sm btn-secondary" id="dcPreviewBtn">👀 预览解析</button>
        </div>
        <div id="dcExtractPreview" style="margin-top:8px;"></div>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
        <button class="btn btn-secondary" onclick="S_APP.closeModal()">取消</button>
        <button class="btn btn-primary" id="dcSave">保存台词</button>
      </div>
    `;

    S_APP.openModal('➕ 添加台词', body, () => {
      let activeTab = 'manual';

      // Tab switching
      document.querySelectorAll('.extract-tab').forEach(t => {
        t.addEventListener('click', () => {
          document.querySelectorAll('.extract-tab').forEach(x => x.classList.remove('active'));
          document.querySelectorAll('.extract-panel').forEach(x => x.classList.remove('active'));
          t.classList.add('active');
          document.getElementById(t.dataset.tab === 'manual' ? 'panelManual' : 'panelVideo').classList.add('active');
          activeTab = t.dataset.tab;
        });
      });

      // Manual lines editor
      const linesContainer = document.getElementById('dcLines');
      const addLine = () => {
        const block = document.createElement('div');
        block.className = 'step-block';
        block.innerHTML = `
          <div class="step-head">
            <span class="step-no">台词</span>
            <button class="btn btn-sm btn-ghost step-del">🗑️ 删除</button>
          </div>
          <div class="form-group"><label>韩语 *</label><input type="text" class="form-input dc-line-ko" placeholder="예: 안녕히 가세요."></div>
          <div class="form-group"><label>中文</label><input type="text" class="form-input dc-line-zh" placeholder="再见。"></div>
          <div class="form-group"><label>重点词汇（选填，格式：词:义，多个用逗号分隔）</label><input type="text" class="form-input dc-line-words" placeholder="예: 안녕히:平安地, 가다:走"></div>
        `;
        block.querySelector('.step-del').addEventListener('click', () => block.remove());
        linesContainer.appendChild(block);
      };
      addLine(); addLine(); addLine();
      document.getElementById('dcAddLine').addEventListener('click', addLine);

      // Video upload -> inline player
      const fileInput = document.getElementById('dcVideoFile');
      const wrap = document.getElementById('dcVideoWrap');
      fileInput.addEventListener('change', () => {
        const f = fileInput.files[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        const isVideo = f.type.startsWith('video');
        wrap.innerHTML = isVideo
          ? `<video src="${url}" controls></video>`
          : `<audio src="${url}" controls></audio>`;
      });

      const escapeHtml = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const parseText = () => {
        const raw = document.getElementById('dcExtractText').value.trim();
        return raw.split('\n').map(s => s.trim()).filter(Boolean)
          .map(k => ({ korean: k, chinese: '', words: [] }));
      };

      // Mic recognition -> append to textarea
      document.getElementById('dcMicBtn').addEventListener('click', async () => {
        const ta = document.getElementById('dcExtractText');
        const r = await S_APP.recognizeSpeech(8000);
        if (r.success && r.transcript) {
          ta.value = (ta.value ? ta.value.replace(/\s*$/, '') + '\n' : '') + r.transcript + '\n';
          ta.scrollTop = ta.scrollHeight;
          S_APP.toast('已识别并填入，请核对', 'success');
        } else {
          S_APP.toast('语音识别不可用或没识别到内容（可手动输入）', 'warning');
        }
      });

      // Preview parsed lines
      document.getElementById('dcPreviewBtn').addEventListener('click', () => {
        const lines = parseText();
        const prev = document.getElementById('dcExtractPreview');
        prev.innerHTML = lines.length
          ? `<div class="extract-hint">共解析出 <strong>${lines.length}</strong> 句台词：</div>` +
            lines.map(l => `<div style="font-family:'Noto Sans KR',sans-serif;padding:4px 0;border-bottom:1px dashed var(--border-light);">${escapeHtml(l.korean)}</div>`).join('')
          : '<p class="text-muted text-sm">还没有可解析的台词</p>';
      });

      // Save
      document.getElementById('dcSave').addEventListener('click', () => {
        const title = document.getElementById('dcTitle').value.trim();
        if (!title) { S_APP.toast('请填写台词标题', 'warning'); return; }
        let lines = [];
        if (activeTab === 'video') {
          lines = parseText();
          if (lines.length === 0) { S_APP.toast('请先输入或提取韩文台词', 'warning'); return; }
        } else {
          const lineBlocks = linesContainer.querySelectorAll('.step-block');
          for (const lb of lineBlocks) {
            const ko = lb.querySelector('.dc-line-ko').value.trim();
            if (!ko) { S_APP.toast('每句都需要填写韩语台词', 'warning'); return; }
            const wordsRaw = lb.querySelector('.dc-line-words').value.trim();
            const words = [];
            if (wordsRaw) {
              wordsRaw.split(/[,，]/).forEach(pair => {
                const parts = pair.split(/[:：]/);
                const w = parts[0] && parts[0].trim();
                const m = (parts[1] && parts[1].trim()) || '';
                if (w) words.push({ w, m });
              });
            }
            lines.push({ korean: ko, chinese: lb.querySelector('.dc-line-zh').value.trim(), words });
          }
          if (lines.length === 0) { S_APP.toast('请至少添加一句台词', 'warning'); return; }
        }

        const item = {
          id: 'dc_' + Date.now(),
          title,
          genre: document.getElementById('dcGenre').value.trim() || '自定义',
          desc: document.getElementById('dcDesc').value.trim() || '自定义台词',
          custom: true,
          lines,
        };
        S_APP.addCustom('drama', item);
        S_APP.toast('台词已添加！🎬', 'success');
        S_APP.closeModal();
        this.currentClip = item.id;
        this.currentLine = 0;
        this.render();
      });
    });
  },
};
