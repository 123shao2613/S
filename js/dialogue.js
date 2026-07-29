/**
 * S - Dialogue Practice Module
 * Scenario-based conversations with AI role-play, custom scenarios
 */

const S_DIALOGUE = {
  currentScenario: null,
  currentStep: 0,
  messages: [],
  completedScenarios: [],

  init() {
    this.completedScenarios = S_APP.storage.get('dialogueCompleted', []);
  },

  getScenarios() { return S_APP.getDialogueScenarios(); },

  render() {
    const container = document.getElementById('module-dialogue');
    const scenarios = this.getScenarios();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">💬 对话练习</h1>
          <p class="page-subtitle">模拟真实场景，与 AI 角色对话，实时纠正错误</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="badge badge-primary">已完成 ${this.completedScenarios.length}/${scenarios.length}</span>
          <button class="btn btn-sm btn-accent" id="addScenarioBtn">➕ 添加场景</button>
        </div>
      </div>

      <div class="dialogue-scenarios" id="dialogueScenarios">
        ${scenarios.map(s => `
          <div class="dialogue-scenario-card ${this.currentScenario === s.id ? 'active' : ''}" data-scenario="${s.id}">
            <div class="dialogue-scenario-icon">${s.icon}</div>
            <div class="dialogue-scenario-name">${s.name}${s.custom ? ' <span class="badge badge-purple">自建</span>' : ''}</div>
            <div class="dialogue-scenario-desc">${s.desc}</div>
            ${this.completedScenarios.includes(s.id) ? '<div style="margin-top:8px;"><span class="badge badge-success">✓ 已完成</span></div>' : ''}
            ${s.custom ? `<button class="scenario-del" data-del="${s.id}" title="删除">🗑️</button>` : ''}
          </div>
        `).join('')}
      </div>

      <div id="dialogueContent"></div>
    `;

    container.querySelectorAll('.dialogue-scenario-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-del]')) return;
        this.currentScenario = card.dataset.scenario;
        this.currentStep = 0;
        this.messages = [];
        this.render();
      });
    });
    container.querySelectorAll('[data-del]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        S_APP.removeCustom('dialogue', b.dataset.del);
        if (this.currentScenario === b.dataset.del) { this.currentScenario = null; this.messages = []; }
        S_APP.toast('已删除自定义场景', 'info');
        this.render();
      });
    });
    document.getElementById('addScenarioBtn')?.addEventListener('click', () => this.openAddModal());

    this.renderContent();
  },

  renderContent() {
    const content = document.getElementById('dialogueContent');
    if (!content) return;

    if (!this.currentScenario) {
      content.innerHTML = `
        <div class="card"><div class="card-body text-center" style="padding:60px;">
          <div style="font-size:3rem;margin-bottom:16px;">💬</div>
          <h3 style="margin-bottom:8px;">选择一个对话场景</h3>
          <p class="text-muted">点击上方的场景卡片，开始与 AI 角色对话练习</p>
        </div></div>`;
      return;
    }

    const scenario = this.getScenarios().find(s => s.id === this.currentScenario);
    if (!scenario) return;

    if (this.messages.length === 0 && this.currentStep < scenario.steps.length) {
      const step = scenario.steps[this.currentStep];
      this.messages.push({ role: 'ai', korean: step.ai, chinese: step.aiTr });
    }

    const isCompleted = this.currentStep >= scenario.steps.length;

    content.innerHTML = `
      <div class="dialogue-chat-area">
        <div class="dialogue-header">
          <span class="dialogue-header-icon">${scenario.icon}</span>
          <div class="dialogue-header-info">
            <div class="dialogue-header-title">${scenario.name}</div>
            <div class="dialogue-header-role">AI 扮演：${scenario.aiRole} · 你的角色：${scenario.userRole}</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="S_DIALOGUE.restart()">🔄 重新开始</button>
        </div>

        <div class="dialogue-messages" id="dialogueMessages">
          ${this.messages.map(m => this.renderMessage(m)).join('')}
          ${isCompleted ? this.renderCompleted(scenario) : ''}
        </div>

        ${!isCompleted ? this.renderOptions(scenario) : ''}
      </div>
    `;

    const msgContainer = document.getElementById('dialogueMessages');
    if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;

    content.querySelectorAll('.dialogue-option-btn').forEach(btn => {
      btn.addEventListener('click', () => this.selectOption(scenario, parseInt(btn.dataset.option)));
    });
    content.querySelectorAll('[data-audio]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        S_APP.speak(btn.dataset.audio, { rate: 0.85 });
      });
    });
  },

  renderMessage(m) {
    const audioBtn = m.role === 'ai'
      ? `<button class="audio-btn" style="width:28px;height:28px;font-size:0.75rem;margin-left:8px;" data-audio="${this.escapeAttr(m.korean)}">🔊</button>`
      : '';
    return `
      <div class="dialogue-msg ${m.role}">
        <div class="dialogue-msg-ko">${m.korean}${audioBtn}</div>
        <div class="dialogue-msg-zh">${m.chinese}</div>
      </div>
      ${m.feedback ? `<div class="dialogue-feedback ${m.feedback.correct ? 'correct' : ''}">${m.feedback.correct ? '✅' : '💡'} ${m.feedback.text}</div>` : ''}
    `;
  },

  renderOptions(scenario) {
    const step = scenario.steps[this.currentStep];
    if (!step) return '';
    return `
      <div class="dialogue-options">
        <div class="dialogue-options-title">💬 请选择你的回复：</div>
        <div class="dialogue-option-list">
          ${step.options.map((opt, i) => `
            <div class="dialogue-option-btn" data-option="${i}">
              <span class="dialogue-option-no">${i + 1}</span>
              <span class="dialogue-option-body">
                <span class="dialogue-option-ko">${opt.text}</span>
                <span class="dialogue-option-zh">${opt.textTr}</span>
              </span>
              <button class="audio-btn dialogue-option-audio" data-audio="${this.escapeAttr(opt.text)}" title="听发音">🔊</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderCompleted(scenario) {
    const wasCompleted = this.completedScenarios.includes(scenario.id);
    if (!wasCompleted) {
      this.completedScenarios.push(scenario.id);
      S_APP.storage.set('dialogueCompleted', this.completedScenarios);
      S_APP.addXP(30);
      S_APP.recordTask();
    }
    return `
      <div class="dialogue-completed">
        <div class="dialogue-completed-icon">🎉</div>
        <div class="dialogue-completed-title">对话完成！</div>
        <div class="dialogue-completed-desc">你已完成「${scenario.name}」场景对话练习 ${!wasCompleted ? '· +30 XP' : ''}</div>
        <div style="display:flex;gap:8px;justify-content:center;">
          <button class="btn btn-primary" onclick="S_DIALOGUE.restart()">🔄 再练一次</button>
          <button class="btn btn-secondary" onclick="S_DIALOGUE.currentScenario=null;S_DIALOGUE.render();">选择其他场景</button>
        </div>
      </div>
    `;
  },

  selectOption(scenario, optionIdx) {
    const step = scenario.steps[this.currentStep];
    if (!step) return;
    const option = step.options[optionIdx];

    this.messages.push({ role: 'user', korean: option.text, chinese: option.textTr });
    this.messages.push({ role: 'feedback', feedback: { correct: option.correct, text: option.feedback } });
    S_APP.speak(option.text, { rate: 0.85 });

    this.currentStep++;
    if (this.currentStep < scenario.steps.length) {
      setTimeout(() => {
        const nextStep = scenario.steps[this.currentStep];
        this.messages.push({ role: 'ai', korean: nextStep.ai, chinese: nextStep.aiTr });
        S_APP.speak(nextStep.ai, { rate: 0.85 });
        this.renderContent();
      }, 1500);
    }
    this.renderContent();
  },

  restart() {
    this.currentStep = 0;
    this.messages = [];
    this.renderContent();
  },

  // ---------- ADD CUSTOM SCENARIO ----------
  openAddModal() {
    let stepCount = 0;
    const body = `
      <div class="form-row">
        <div class="form-group" style="flex:2;">
          <label>场景名称 *</label>
          <input type="text" class="form-input" id="dsName" placeholder="예: 공항에서">
        </div>
        <div class="form-group" style="flex:1;">
          <label>图标 (emoji)</label>
          <input type="text" class="form-input" id="dsIcon" value="🎭" maxlength="2">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>AI 角色</label><input type="text" class="form-input" id="dsAiRole" placeholder="예: 공항 직원"></div>
        <div class="form-group"><label>你的角色</label><input type="text" class="form-input" id="dsUserRole" placeholder="예: 여행객"></div>
      </div>
      <div class="form-group">
        <label>场景简介</label>
        <input type="text" class="form-input" id="dsDesc" placeholder="예: 在机场办理值机与安检">
      </div>

      <div class="steps-editor">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div class="font-bold">💬 对话轮次</div>
          <button class="btn btn-sm btn-secondary" id="dsAddStep">+ 添加一轮</button>
        </div>
        <div id="dsSteps"></div>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
        <button class="btn btn-secondary" onclick="S_APP.closeModal()">取消</button>
        <button class="btn btn-primary" id="dsSave">保存场景</button>
      </div>
    `;

    S_APP.openModal('➕ 添加对话场景', body, () => {
      const stepsContainer = document.getElementById('dsSteps');
      const addStep = () => {
        stepCount++;
        const idx = stepCount;
        const block = document.createElement('div');
        block.className = 'step-block';
        block.innerHTML = `
          <div class="step-head">
            <span class="step-no">第 ${idx} 轮</span>
            <button class="btn btn-sm btn-ghost step-del">🗑️ 删除</button>
          </div>
          <div class="form-group"><label>AI 说（韩语）*</label><input type="text" class="form-input ds-ai-ko" placeholder="예: 어서 오세요!"></div>
          <div class="form-group"><label>AI 说（翻译）</label><input type="text" class="form-input ds-ai-tr" placeholder="欢迎！"></div>
          <div class="opt-list">
            ${[1,2,3].map(n => `
              <div class="opt-row">
                <div class="opt-head">选项 ${n}${n===1 ? ' <span class="text-muted text-sm">(至少1个正确)</span>' : ''}</div>
                <div class="form-row">
                  <input type="text" class="form-input ds-opt-ko" placeholder="你的回答(韩语)">
                  <input type="text" class="form-input ds-opt-tr" placeholder="翻译">
                </div>
                <div class="form-row">
                  <label class="chk"><input type="checkbox" class="ds-opt-correct"> 正确回答</label>
                  <input type="text" class="form-input ds-opt-fb" placeholder="反馈提示">
                </div>
              </div>
            `).join('')}
          </div>
        `;
        block.querySelector('.step-del').addEventListener('click', () => block.remove());
        stepsContainer.appendChild(block);
      };

      // Start with 2 steps
      addStep(); addStep();
      document.getElementById('dsAddStep').addEventListener('click', addStep);

      document.getElementById('dsSave').addEventListener('click', () => {
        const name = document.getElementById('dsName').value.trim();
        if (!name) { S_APP.toast('请填写场景名称', 'warning'); return; }
        const stepBlocks = stepsContainer.querySelectorAll('.step-block');
        const steps = [];
        for (const sb of stepBlocks) {
          const aiKo = sb.querySelector('.ds-ai-ko').value.trim();
          if (!aiKo) { S_APP.toast('每轮都需要填写 AI 说的韩语', 'warning'); return; }
          const options = [];
          sb.querySelectorAll('.opt-row').forEach(or => {
            const ko = or.querySelector('.ds-opt-ko').value.trim();
            if (!ko) return; // skip empty option
            options.push({
              text: ko,
              textTr: or.querySelector('.ds-opt-tr').value.trim(),
              correct: or.querySelector('.ds-opt-correct').checked,
              feedback: or.querySelector('.ds-opt-fb').value.trim() || (or.querySelector('.ds-opt-correct').checked ? '很好！' : '再想想，看看正确回答的提示。'),
            });
          });
          if (options.length === 0) { S_APP.toast('每轮至少需要一个用户回答选项', 'warning'); return; }
          if (!options.some(o => o.correct)) { S_APP.toast('每轮至少需要勾选一个"正确回答"', 'warning'); return; }
          steps.push({
            ai: aiKo,
            aiTr: sb.querySelector('.ds-ai-tr').value.trim(),
            options,
          });
        }
        if (steps.length === 0) { S_APP.toast('请至少添加一轮对话', 'warning'); return; }

        const item = {
          id: 'ds_' + Date.now(),
          name,
          icon: document.getElementById('dsIcon').value.trim() || '🎭',
          color: '#9F7AEA',
          description: document.getElementById('dsDesc').value.trim() || '自定义对话场景',
          aiRole: document.getElementById('dsAiRole').value.trim() || 'AI',
          userRole: document.getElementById('dsUserRole').value.trim() || '你',
          custom: true,
          steps,
        };
        S_APP.addCustom('dialogue', item);
        S_APP.toast('场景已添加！🎭', 'success');
        S_APP.closeModal();
        this.currentScenario = item.id;
        this.currentStep = 0;
        this.messages = [];
        this.render();
      });
    });
  },

  escapeAttr(s) {
    return (s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;');
  },
};
