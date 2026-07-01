const API_BASE = 'http://localhost:5000/api';

const state = {
  auth: null,
  projects: [],
  skills: [],
  messages: [],
  notifications: [],
  analytics: { totalVisitors: 0, dailyVisitors: 0, pageViews: 0, mostViewedProjects: [], recentEvents: [], projects: [] },
  messageFilter: 'all',
  socket: null
};

const els = {
  loginScreen: document.getElementById('loginScreen'),
  dashboardScreen: document.getElementById('dashboardScreen'),
  loginForm: document.getElementById('loginForm'),
  statusText: document.getElementById('statusText'),
  dashboardTitle: document.getElementById('dashboardTitle'),
  dashboardSubtitle: document.getElementById('dashboardSubtitle'),
  connectionStatus: document.getElementById('connectionStatus'),
  activityList: document.getElementById('activityList'),
  projectList: document.getElementById('projectList'),
  skillList: document.getElementById('skillList'),
  messageList: document.getElementById('messageList'),
  messageListSecondary: document.getElementById('messageListSecondary'),
  notificationList: document.getElementById('notificationList'),
  analyticsSummary: document.getElementById('analyticsSummary'),
  engagementFeed: document.getElementById('engagementFeed'),
  analyticsMeta: document.getElementById('analyticsMeta'),
  logoutBtn: document.getElementById('logoutBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  openPortfolioBtn: document.getElementById('openPortfolioBtn'),
  projectForm: document.getElementById('projectForm'),
  skillForm: document.getElementById('skillForm'),
  messageSearch: document.getElementById('messageSearch'),
  visitorCount: document.getElementById('visitorCount'),
  messageCount: document.getElementById('messageCount'),
  projectCount: document.getElementById('projectCount'),
  notificationCount: document.getElementById('notificationCount')
};

function setStatus(message, isError = false) {
  if (!els.statusText) return;
  els.statusText.textContent = message;
  els.statusText.style.color = isError ? '#fb7185' : '#14b8a6';
  showToast(message, isError);
}

function showToast(message, isError = false) {
  let toast = document.getElementById('dashboardToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dashboardToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.color = isError ? '#fb7185' : '#14b8a6';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function setConnectionStatus(connected) {
  if (!els.connectionStatus) return;
  els.connectionStatus.textContent = connected ? 'Live connection active' : 'Connecting…';
  els.connectionStatus.classList.toggle('online', connected);
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function api(path, options = {}) {
  const token = localStorage.getItem('portfolio_admin_token');
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || 'Request failed');
  return result;
}

function addActivity(title, description) {
  if (!els.activityList) return;
  const entry = document.createElement('div');
  entry.className = 'item';
  entry.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(description)}</span>`;
  els.activityList.prepend(entry);
  while (els.activityList.children.length > 8) {
    els.activityList.removeChild(els.activityList.lastChild);
  }
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
}

function connectRealtime() {
  if (typeof io === 'undefined') return;
  if (state.socket) return;

  const socket = io('http://localhost:5000', {
    transports: ['websocket'],
    withCredentials: true
  });
  state.socket = socket;

  socket.on('connect', () => {
    setConnectionStatus(true);
    addActivity('Realtime connected', 'Socket.io is streaming updates.');
  });
  socket.on('disconnect', () => setConnectionStatus(false));
  socket.on('visitor:new', () => {
    addActivity('New visitor', 'A visitor just interacted with your portfolio.');
    loadAnalytics(true);
  });
  socket.on('message:new', () => {
    addActivity('New message', 'A new portfolio message arrived.');
    loadMessages(true);
  });
  socket.on('project:updated', () => {
    addActivity('Project updated', 'Recent project changes were synced.');
    loadProjects(true);
  });
  socket.on('skill:updated', () => {
    addActivity('Skill updated', 'A skill listing was updated.');
    loadSkills(true);
  });
  socket.on('notification:new', () => {
    addActivity('Notification', 'A live notification was received.');
    loadNotifications(true);
  });
}

async function login(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const result = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then((r) => r.json());
    if (!result.success) throw new Error(result.message || 'Login failed');
    localStorage.setItem('portfolio_admin_token', result.data.accessToken);
    state.auth = result.data.user;
    els.loginScreen.classList.add('hidden');
    els.dashboardScreen.classList.remove('hidden');
    setStatus('Signed in successfully');
    await loadDashboard();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadProjects(silent = false) {
  try {
    const { data } = await api('/projects');
    state.projects = data || [];
    renderProjects();
    renderStats();
    if (!silent) setStatus('Projects synced');
  } catch (error) {
    console.warn('Load projects failed', error);
  }
}

async function loadSkills(silent = false) {
  try {
    const { data } = await api('/skills');
    state.skills = data || [];
    renderSkills();
    renderStats();
    if (!silent) setStatus('Skills synced');
  } catch (error) {
    console.warn('Load skills failed', error);
  }
}

async function loadMessages(silent = false) {
  try {
    const { data } = await api('/messages');
    state.messages = data || [];
    renderMessages();
    renderStats();
    if (!silent) setStatus('Inbox synced');
  } catch (error) {
    console.warn('Load messages failed', error);
  }
}

async function loadNotifications(silent = false) {
  try {
    const { data } = await api('/notifications');
    state.notifications = data || [];
    renderNotifications();
    renderStats();
    if (!silent) setStatus('Notifications synced');
  } catch (error) {
    console.warn('Load notifications failed', error);
  }
}

async function loadAnalytics(silent = false) {
  try {
    const [summaryRes, liveRes] = await Promise.all([api('/analytics/summary'), api('/analytics/live')]);
    state.analytics = {
      ...(summaryRes.data || {}),
      ...(liveRes.data || {}),
      recentEvents: liveRes.data?.recentEvents || []
    };
    renderAnalytics();
    renderStats();
    if (!silent) setStatus('Analytics synced');
  } catch (error) {
    console.warn('Load analytics failed', error);
  }
}

async function loadDashboard(silent = false) {
  try {
    await Promise.all([loadProjects(silent), loadSkills(silent), loadMessages(silent), loadNotifications(silent), loadAnalytics(silent)]);
    connectRealtime();
    if (!silent) {
      addActivity('Dashboard ready', 'Live portfolio admin dashboard is connected.');
      setStatus('Dashboard synced with MongoDB');
    }
    if (els.dashboardTitle) els.dashboardTitle.textContent = `Welcome back, ${state.auth?.name || 'Admin'}`;
    if (els.dashboardSubtitle) els.dashboardSubtitle.textContent = 'Manage content, messages, analytics, and live engagement from one optimized workspace.';
    if (els.analyticsMeta) {
      els.analyticsMeta.textContent = `Last sync ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  } catch (error) {
    setStatus(error.message, true);
  }
}

function renderStats() {
  if (els.visitorCount) els.visitorCount.textContent = state.analytics?.totalVisitors || 0;
  if (els.messageCount) els.messageCount.textContent = (state.messages || []).filter((m) => m.status === 'unread').length;
  if (els.projectCount) els.projectCount.textContent = (state.projects || []).filter((p) => p.status === 'active').length;
  if (els.notificationCount) els.notificationCount.textContent = (state.notifications || []).filter((n) => !n.isRead).length;
}

function renderProjects() {
  if (!els.projectList) return;
  els.projectList.innerHTML = '';
  if (!state.projects.length) {
    els.projectList.innerHTML = '<div class="item"><strong>No projects yet</strong><span>Create your first launch-ready project.</span></div>';
    return;
  }
  state.projects.forEach((project) => {
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `
      <strong>${escapeHtml(project.title)}</strong>
      <span>${escapeHtml(project.description)}</span>
      <div class="meta">
        <span class="pill">${escapeHtml(project.status || 'active')}</span>
        <span class="pill secondary">${escapeHtml((project.technologies || []).join(', ') || 'General')}</span>
      </div>`;
    els.projectList.appendChild(card);
  });
}

function renderSkills() {
  if (!els.skillList) return;
  els.skillList.innerHTML = '';
  if (!state.skills.length) {
    els.skillList.innerHTML = '<div class="item"><strong>No skills yet</strong><span>Add the skills you want visible on your portfolio.</span></div>';
    return;
  }
  state.skills.forEach((skill) => {
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `
      <strong>${escapeHtml(skill.name)}</strong>
      <span>${escapeHtml(skill.category)} • ${escapeHtml(skill.level)}</span>`;
    els.skillList.appendChild(card);
  });
}

function renderMessages() {
  if (!els.messageList) return;
  const query = (state.messageFilter || 'all').toLowerCase();
  const filtered = (state.messages || []).filter((message) => {
    if (query === 'all') return true;
    return message.status === query;
  });
  els.messageList.innerHTML = '';
  if (!filtered.length) {
    els.messageList.innerHTML = '<div class="item"><strong>No matching messages</strong><span>New portfolio submissions will appear here.</span></div>';
    return;
  }
  filtered.slice(0, 8).forEach((message) => {
    const card = document.createElement('div');
    card.className = 'item message-card';
    card.innerHTML = `
      <div class="message-head">
        <strong>${escapeHtml(message.name)}</strong>
        <span class="pill ${message.status === 'unread' ? 'accent' : 'secondary'}">${escapeHtml(message.status || 'unread')}</span>
      </div>
      <span>${escapeHtml(message.email)}</span>
      <p>${escapeHtml(message.message)}</p>
      <div class="message-actions">
        <button class="mini-btn" data-action="mark-read" data-id="${message._id}">Mark read</button>
        <button class="mini-btn danger" data-action="delete" data-id="${message._id}">Delete</button>
      </div>`;
    els.messageList.appendChild(card);
  });
}

function renderNotifications() {
  if (!els.notificationList) return;
  els.notificationList.innerHTML = '';
  if (!state.notifications.length) {
    els.notificationList.innerHTML = '<div class="item"><strong>No notifications yet</strong><span>Realtime activity will appear here.</span></div>';
    return;
  }
  state.notifications.slice(0, 6).forEach((notification) => {
    const card = document.createElement('div');
    card.className = 'item';
    card.innerHTML = `<strong>${escapeHtml(notification.title)}</strong><span>${escapeHtml(notification.message)}</span>`;
    els.notificationList.appendChild(card);
  });
}

function renderAnalytics() {
  if (!els.analyticsSummary) return;
  const projects = state.analytics?.mostViewedProjects || [];
  const recentEvents = state.analytics?.recentEvents || [];
  if (els.engagementFeed) {
    els.engagementFeed.innerHTML = recentEvents.length ? recentEvents.slice(0, 6).map((event) => `
      <div class="item">
        <strong>${escapeHtml(event.eventType || 'Event')}</strong>
        <span>${escapeHtml(event.page || 'Portfolio')}</span>
        <small>${escapeHtml(formatDate(event.createdAt))}</small>
      </div>`).join('') : '<div class="item"><strong>No recent events</strong><span>Engagement will appear here as visitors interact with your site.</span></div>';
  }
  els.analyticsSummary.innerHTML = `
    <div class="analytics-grid">
      <div class="stat-card compact"><span class="label">Daily Visitors</span><span class="value">${state.analytics?.dailyVisitors || 0}</span></div>
      <div class="stat-card compact"><span class="label">Page Views</span><span class="value">${state.analytics?.pageViews || 0}</span></div>
      <div class="stat-card compact"><span class="label">Tracked Projects</span><span class="value">${state.analytics?.projects?.length || 0}</span></div>
    </div>
    <div class="insight-list">
      ${projects.length ? projects.map((item) => `
        <div class="insight-item">
          <div class="insight-top"><strong>${escapeHtml(item.project?.title || 'Project')}</strong><span>${item.count} views</span></div>
          <div class="bar"><span style="width:${Math.min(100, item.count * 12)}%"></span></div>
        </div>`).join('') : '<div class="item"><strong>No project views yet</strong><span>Visitor engagement data will appear here.</span></div>'}
    </div>
    <div class="insight-list secondary">
      ${recentEvents.length ? recentEvents.slice(0, 4).map((event) => `
        <div class="insight-item">
          <div class="insight-top"><strong>${escapeHtml(event.eventType || 'Event')}</strong><span>${escapeHtml(event.page || 'Portfolio')}</span></div>
          <small>${escapeHtml(formatDate(event.createdAt))}</small>
        </div>`).join('') : '<div class="item"><strong>No recent events</strong><span>Live portfolio interactions will populate this feed.</span></div>'}
    </div>`;
}

async function handleProjectSubmit(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.currentTarget));
  try {
    await api('/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        description: payload.description,
        technologies: payload.technologies.split(',').map((item) => item.trim()).filter(Boolean),
        githubLink: payload.githubLink,
        liveDemoLink: payload.liveDemoLink,
        status: payload.status || 'active'
      })
    });
    event.currentTarget.reset();
    addActivity('Project created', 'Your new portfolio project is now in MongoDB.');
    await loadDashboard(true);
    setStatus('Project saved');
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function handleSkillSubmit(event) {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(event.currentTarget));
  try {
    await api('/skills', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name,
        category: payload.category,
        level: payload.level || 'intermediate'
      })
    });
    event.currentTarget.reset();
    addActivity('Skill created', 'The new technical skill has been saved.');
    await loadDashboard(true);
    setStatus('Skill saved');
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function handleMessageAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const { action, id } = button.dataset;
  if (!id) return;
  try {
    if (action === 'mark-read') {
      await api(`/messages/${id}`, { method: 'PUT', body: JSON.stringify({ status: 'read' }) });
      addActivity('Message updated', 'The selected message was marked as read.');
    } else if (action === 'delete') {
      await api(`/messages/${id}`, { method: 'DELETE' });
      addActivity('Message removed', 'The selected message was removed.');
    }
    await loadMessages(true);
    renderStats();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function logout() {
  try {
    await api('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.warn(error);
  } finally {
    localStorage.removeItem('portfolio_admin_token');
    els.dashboardScreen.classList.add('hidden');
    els.loginScreen.classList.remove('hidden');
    setStatus('Signed out');
  }
}

function ensureAuthenticated() {
  const token = localStorage.getItem('portfolio_admin_token');
  if (!token) {
    els.dashboardScreen.classList.add('hidden');
    els.loginScreen.classList.remove('hidden');
  }
}

function bindEvents() {
  if (els.loginForm) els.loginForm.addEventListener('submit', login);
  if (els.logoutBtn) els.logoutBtn.addEventListener('click', logout);
  if (els.refreshBtn) els.refreshBtn.addEventListener('click', () => loadDashboard());
  if (els.openPortfolioBtn) els.openPortfolioBtn.addEventListener('click', () => window.open('../index.html', '_blank'));
  if (els.projectForm) els.projectForm.addEventListener('submit', handleProjectSubmit);
  if (els.skillForm) els.skillForm.addEventListener('submit', handleSkillSubmit);
  if (els.messageList) els.messageList.addEventListener('click', handleMessageAction);
  if (els.messageListSecondary) els.messageListSecondary.addEventListener('click', handleMessageAction);
  if (els.messageSearch) {
    els.messageSearch.addEventListener('input', (event) => {
      state.messageFilter = event.target.value || 'all';
      renderMessages();
    });
  }

  document.querySelectorAll('.section-nav button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.section-nav button').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('.panel-section').forEach((section) => section.classList.remove('active'));
      document.getElementById(button.dataset.panel)?.classList.add('active');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'r' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      loadDashboard();
    }
  });

  setInterval(() => {
    if (localStorage.getItem('portfolio_admin_token')) {
      loadDashboard(true);
    }
  }, 30000);
}

ensureAuthenticated();
bindEvents();

if (localStorage.getItem('portfolio_admin_token')) {
  els.loginScreen.classList.add('hidden');
  els.dashboardScreen.classList.remove('hidden');
  loadDashboard();
}
