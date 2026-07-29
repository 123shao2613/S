/**
 * S - Dashboard Module
 * Learning statistics, progress tracking, check-in calendar
 */

const S_DASHBOARD = {
  charts: {},

  init() {},

  render() {
    const container = document.getElementById('module-dashboard');
    const xp = S_APP.storage.get('xp', 0);
    const levelInfo = S_APP.getLevelInfo();
    const checkins = S_APP.storage.get('checkins', []);
    const phonicsStudied = S_APP.storage.get('phonicsStudied', []);
    const vocabLearned = S_APP.storage.get('vocabLearned', []);
    const vocabFavorites = S_APP.storage.get('vocabFavorites', []);
    const speakingPracticed = S_APP.storage.get('speakingPracticed', []);
    const speakingScores = S_APP.storage.get('speakingScores', []);
    const dialogueCompleted = S_APP.storage.get('dialogueCompleted', []);
    const dramaWatched = S_APP.storage.get('dramaWatched', []);
    const streak = S_APP.getStreak();

    const avgScore = speakingScores.length > 0
      ? Math.round(speakingScores.reduce((a,b) => a+b, 0) / speakingScores.length)
      : 0;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">📊 学习仪表盘</h1>
          <p class="page-subtitle">追踪你的韩语学习之旅，每一天的进步都看得见</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="badge badge-primary">Lv.${levelInfo.level} ${levelInfo.title}</span>
          <span class="badge badge-success">${xp} XP</span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="dashboard-grid">
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">${streak}</div>
          <div class="stat-label">连续打卡天数</div>
          <div class="stat-trend up">坚持就是胜利！</div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">🔤</div>
          <div class="stat-value">${phonicsStudied.length}<span style="font-size:1rem;color:var(--text-muted);">/40</span></div>
          <div class="stat-label">已学音标</div>
          <div class="stat-trend ${phonicsStudied.length > 0 ? 'up' : ''}">${phonicsStudied.length === 40 ? '全部完成！' : '继续加油'}</div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon">📚</div>
          <div class="stat-value">${vocabLearned.length}</div>
          <div class="stat-label">已学单词</div>
          <div class="stat-trend up">收藏 ${vocabFavorites.length} 个</div>
        </div>
        <div class="stat-card pink">
          <div class="stat-icon">🎤</div>
          <div class="stat-value">${avgScore}<span style="font-size:1rem;color:var(--text-muted);">分</span></div>
          <div class="stat-label">跟读平均分</div>
          <div class="stat-trend ${avgScore >= 70 ? 'up' : ''}">已练 ${speakingPracticed.length} 句</div>
        </div>
      </div>

      ${typeof S_FLOWER !== 'undefined' ? S_FLOWER.widgetHTML() : ''}

      <!-- Charts -->
      <div class="dashboard-charts">
        <div class="chart-card">
          <div class="chart-title">📈 近14天学习活跃度</div>
          <div class="chart-canvas-wrap">
            <canvas id="activityChart"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <div class="chart-title">🎯 学习模块进度</div>
          <div class="chart-canvas-wrap">
            <canvas id="moduleChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Calendar -->
      <div class="calendar-card">
        <div class="calendar-header">
          <div class="calendar-title">📅 打卡日历</div>
          <span class="text-muted text-sm">本月打卡 ${this.getMonthCheckins(checkins).length} 天</span>
        </div>
        <div class="calendar-grid" id="calendarGrid">
          ${this.renderCalendar(checkins)}
        </div>
      </div>

      <!-- Module Progress -->
      <div class="chart-title mb-16">📚 各模块学习进度</div>
      <div class="dashboard-modules">
        <div class="module-progress-card" onclick="S_APP.navigate('phonics')">
          <div class="module-progress-header">
            <span class="module-progress-icon">🔤</span>
            <span class="module-progress-name">音标学习</span>
          </div>
          <div class="module-progress-bar">
            <div class="module-progress-fill" style="width:${(phonicsStudied.length/40)*100}%;background:linear-gradient(90deg,#9F7AEA,#C4A8E8);"></div>
          </div>
          <div class="module-progress-text">${phonicsStudied.length} / 40 个字母已学</div>
        </div>

        <div class="module-progress-card" onclick="S_APP.navigate('vocabulary')">
          <div class="module-progress-header">
            <span class="module-progress-icon">📚</span>
            <span class="module-progress-name">每日单词</span>
          </div>
          <div class="module-progress-bar">
            <div class="module-progress-fill" style="width:${Math.min((vocabLearned.length/45)*100,100)}%;background:linear-gradient(90deg,#FCD34D,#FBBF24);"></div>
          </div>
          <div class="module-progress-text">${vocabLearned.length} 个单词已学 · 收藏 ${vocabFavorites.length}</div>
        </div>

        <div class="module-progress-card" onclick="S_APP.navigate('speaking')">
          <div class="module-progress-header">
            <span class="module-progress-icon">🎤</span>
            <span class="module-progress-name">语句跟读</span>
          </div>
          <div class="module-progress-bar">
            <div class="module-progress-fill" style="width:${Math.min((speakingPracticed.length/S_APP.getSpeakingTotal())*100,100)}%;background:linear-gradient(90deg,#F472B6,#F9A8D4);"></div>
          </div>
          <div class="module-progress-text">${speakingPracticed.length} / ${S_APP.getSpeakingTotal()} 句已练 · 均分 ${avgScore}</div>
        </div>

        <div class="module-progress-card" onclick="S_APP.navigate('dialogue')">
          <div class="module-progress-header">
            <span class="module-progress-icon">💬</span>
            <span class="module-progress-name">对话练习</span>
          </div>
          <div class="module-progress-bar">
            <div class="module-progress-fill" style="width:${(dialogueCompleted.length/S_APP.getDialogueScenarios().length)*100}%;background:linear-gradient(90deg,#7DD3FC,#BAE6FD);"></div>
          </div>
          <div class="module-progress-text">${dialogueCompleted.length} / ${S_APP.getDialogueScenarios().length} 个场景完成</div>
        </div>

        <div class="module-progress-card" onclick="S_APP.navigate('drama')">
          <div class="module-progress-header">
            <span class="module-progress-icon">🎬</span>
            <span class="module-progress-name">经典台词</span>
          </div>
          <div class="module-progress-bar">
            <div class="module-progress-fill" style="width:${(dramaWatched.length/S_APP.getDramaClips().length)*100}%;background:linear-gradient(90deg,#6EE7B7,#A7F3D0);"></div>
          </div>
          <div class="module-progress-text">${dramaWatched.length} / ${S_APP.getDramaClips().length} 个片段已看</div>
        </div>

        <div class="module-progress-card" onclick="S_APP.doCheckin()">
          <div class="module-progress-header">
            <span class="module-progress-icon">🏆</span>
            <span class="module-progress-name">累计成就</span>
          </div>
          <div class="module-progress-bar">
            <div class="module-progress-fill" style="width:${Math.min((checkins.length/30)*100,100)}%;background:linear-gradient(90deg,#9F7AEA,#F472B6,#FCD34D);"></div>
          </div>
          <div class="module-progress-text">总打卡 ${checkins.length} 天 · Lv.${levelInfo.level}</div>
        </div>
      </div>

      <div style="margin-top:24px;padding:20px;background:var(--surface);border-radius:var(--r-md);border:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <span style="font-size:1.5rem;">🚀</span>
          <span style="font-size:1rem;font-weight:700;">学习建议</span>
        </div>
        <div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.8;">
          ${this.getStudyAdvice(phonicsStudied.length, vocabLearned.length, speakingPracticed.length, dialogueCompleted.length, dramaWatched.length)}
        </div>
      </div>
    `;

    // Render charts after DOM is ready
    setTimeout(() => {
      this.renderActivityChart(checkins);
      this.renderModuleChart(phonicsStudied, vocabLearned, speakingPracticed, dialogueCompleted, dramaWatched);
    }, 100);
  },

  renderCalendar(checkins) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayHeaders = ['日', '一', '二', '三', '四', '五', '六'];
    let html = dayHeaders.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isChecked = checkins.includes(dateStr);
      const isToday = d === today;
      html += `<div class="calendar-day ${isChecked ? 'checked' : ''} ${isToday ? 'today' : ''}">${d}</div>`;
    }

    return html;
  },

  getMonthCheckins(checkins) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return checkins.filter(dateStr => {
      const d = new Date(dateStr);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  },

  renderActivityChart(checkins) {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;

    // Generate last 14 days data
    const labels = [];
    const data = [];
    const now = new Date();
    now.setHours(0,0,0,0);

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      labels.push(`${d.getMonth()+1}/${d.getDate()}`);
      data.push(checkins.includes(dateStr) ? 1 : 0);
    }

    if (this.charts.activity) this.charts.activity.destroy();

    this.charts.activity = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '打卡',
          data: data,
          backgroundColor: data.map(v => v ? '#9F7AEA' : '#FCE4EC'),
          borderRadius: 10,
          barThickness: 22,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ctx.raw === 1 ? '已打卡' : '未打卡'
            }
          }
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true,
            max: 1.2,
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 }, color: '#9CA3AF' }
          }
        }
      }
    });
  },

  renderModuleChart(phonics, vocab, speaking, dialogue, drama) {
    const canvas = document.getElementById('moduleChart');
    if (!canvas) return;

    if (this.charts.module) this.charts.module.destroy();

    this.charts.module = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['音标', '单词', '跟读', '对话', '韩剧'],
        datasets: [{
          data: [
            phonics.length,
            vocab.length,
            speaking.length,
            dialogue.length,
            drama.length
          ],
          backgroundColor: [
            '#9F7AEA',
            '#FCD34D',
            '#F472B6',
            '#7DD3FC',
            '#6EE7B7'
          ],
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 10,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 11 }, padding: 12, usePointStyle: true, pointStyle: 'circle' }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw} 项`
            }
          }
        }
      }
    });
  },

  getStudyAdvice(phonics, vocab, speaking, dialogue, drama) {
    const tips = [];

    if (phonics < 40) {
      tips.push(`🔤 音标学习：已完成 ${phonics}/40，建议每天学习3-5个新字母，打好发音基础。`);
    } else {
      tips.push(`✅ 音标学习：40个字母全部学完！可以进入词汇和句子练习阶段。`);
    }

    if (vocab < 20) {
      tips.push(`📚 每日单词：已学 ${vocab} 个，坚持每天背10个单词，一个月就能积累300+词汇量。`);
    } else if (vocab < 50) {
      tips.push(`📚 每日单词：已学 ${vocab} 个，词汇量稳步增长，建议开始尝试中级词汇。`);
    } else {
      tips.push(`📚 每日单词：已学 ${vocab} 个，词汇量丰富！注意定期复习收藏的单词。`);
    }

    if (speaking === 0) {
      tips.push(`🎤 语句跟读：还没有开始跟读练习，建议从"问候寒暄"场景开始，每天练习3-5句。`);
    } else {
      tips.push(`🎤 语句跟读：已练习 ${speaking} 句，继续坚持，发音会越来越地道！`);
    }

    if (dialogue < S_DATA.dialogue.scenarios.length) {
      tips.push(`💬 对话练习：已完成 ${dialogue}/${S_DATA.dialogue.scenarios.length} 个场景，多练习不同场景提升实战能力。`);
    } else {
      tips.push(`💬 对话练习：全部场景已完成！可以尝试反复练习，追求更自然的表达。`);
    }

    if (drama < S_DATA.drama.clips.length) {
      tips.push(`🎬 经典台词：已看 ${drama}/${S_APP.getDramaClips().length} 段，在真实语境中学习是最有效的方式之一。`);
    }

    return tips.map(t => `<div style="margin-bottom:4px;">${t}</div>`).join('');
  },
};
