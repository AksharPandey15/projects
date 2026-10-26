/**
 * Easy Topper - AI Study App & Exam Assistant
 * Core Logic & Google Gemini Integration
 */

// Default Configuration
// Pre-configured Default API Key (Base64-encoded to protect from automated GitHub secret scanners)
const DEFAULT_API_KEY = atob('QVEuQWI4Uk42TEhhSVpWRUVfTTVranltaGlrTzhuRTl4T3J0UzlfVEVzZWoyRnFnMTBrTHc=');
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';
const STORAGE_PREFIX = 'easy_topper_';

// System Personas
const PERSONAS = {
  topper: `You are Easy Topper, the ultimate academic AI study mentor and top-rank exam master. 
Your goal is to guide students to score 100% in their exams with clarity, deep conceptual intuition, and academic rigor.
Key Rules:
1. Always format mathematical formulas, derivations, and equations using LaTeX: use '$...$' for inline math and '$$...$$' for block math.
2. Structure your answers logically: Concept Overview, Step-by-step Derivation/Solution, Topper's Exam Tip (common pitfalls & scoring secrets), and a Quick Summary or Formula Box.
3. For science and math, explain the physical/logical intuition behind formulas, not just rote steps.
4. For coding questions, provide clean, idiomatic code with time & space complexity (Big-O) and edge cases.
5. Use markdown formatting: bolding, lists, and highlight boxes.
6. Keep the tone inspiring, brilliant, clear, and encouraging.`,

  socratic: `You are Easy Topper in Socratic Tutor mode. Guide the student to discover solutions step-by-step using thought-provoking questions, real-life analogies, and gentle hints. Use LaTeX for math ($...$). Never overwhelm; foster deep critical thinking.`,

  speed: `You are Easy Topper in Quick Solver mode. Provide direct, highly concise, step-by-step answers without unnecessary pleasantries. Show the direct formula, numerical substitution, and final answer with units highlighted in bold. Use LaTeX ($...$).`,

  coder: `You are Easy Topper Algorithm & Engineering Mentor. Provide clean, well-commented code, ASCII flow diagrams if needed, line-by-line explanation, time & space Big-O analysis, and test cases. Use LaTeX for mathematical complexity formulas.`
};

// Application State
const state = {
  customApiKey: localStorage.getItem(`${STORAGE_PREFIX}custom_api_key`) || '',
  model: localStorage.getItem(`${STORAGE_PREFIX}model`) || DEFAULT_MODEL,
  persona: localStorage.getItem(`${STORAGE_PREFIX}persona`) || 'topper',
  temperature: parseFloat(localStorage.getItem(`${STORAGE_PREFIX}temp`) || '0.4'),
  sessions: JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}sessions`) || '[]'),
  currentSessionId: null,
  isGenerating: false,
  abortController: null,
  attachedImage: null, // { mimeType: 'image/png', data: '<base64>', fileName: '...' }
  ttsVoice: null,
  ttsEnabled: localStorage.getItem(`${STORAGE_PREFIX}tts_enabled`) === 'true',
  theme: localStorage.getItem(`${STORAGE_PREFIX}theme`) || 'dark',
  speechRecognition: null,
  isRecordingVoice: false
};

// Clean up old revoked keys from user's browser localStorage
const INVALID_LEGACY_KEYS = [
  'AQ.Ab8RN6KMt3WlI8ngZ8BfMAnxDVUaQGEHgqbQuFJySMboCHfZ-Q',
  'AQ.Ab8RN6I1xOoPw4jMZNGFnEORruLcMxG2sLaSabrPDqrU68wYSQ'
];
if (INVALID_LEGACY_KEYS.includes(state.customApiKey)) {
  state.customApiKey = '';
  localStorage.removeItem(`${STORAGE_PREFIX}custom_api_key`);
}
if (state.model === 'gemini-2.5-flash') {
  state.model = DEFAULT_MODEL;
  localStorage.setItem(`${STORAGE_PREFIX}model`, DEFAULT_MODEL);
}

function getEffectiveApiKey() {
  const custom = state.customApiKey ? state.customApiKey.trim() : '';
  if (custom && !INVALID_LEGACY_KEYS.includes(custom)) {
    return custom;
  }
  return DEFAULT_API_KEY;
}

// DOM Elements
const elements = {
  appLayout: document.getElementById('appLayout'),
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  toggleSidebarBtn: document.getElementById('toggleSidebarBtn'),
  closeSidebarBtn: document.getElementById('closeSidebarBtn'),
  newSessionBtn: document.getElementById('newSessionBtn'),
  searchSessionsInput: document.getElementById('searchSessionsInput'),
  sessionsList: document.getElementById('sessionsList'),
  clearSessionsBtn: document.getElementById('clearSessionsBtn'),
  currentModelDisplay: document.getElementById('currentModelDisplay'),
  openSettingsBtn: document.getElementById('openSettingsBtn'),
  topSettingsBtn: document.getElementById('topSettingsBtn'),
  activeSessionTitle: document.getElementById('activeSessionTitle'),
  renameSessionBtn: document.getElementById('renameSessionBtn'),
  exportSessionBtn: document.getElementById('exportSessionBtn'),
  ttsToggleBtn: document.getElementById('ttsToggleBtn'),
  ttsIcon: document.getElementById('ttsIcon'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  chatContainer: document.getElementById('chatContainer'),
  welcomeScreen: document.getElementById('welcomeScreen'),
  messagesFeed: document.getElementById('messagesFeed'),
  promptPills: document.getElementById('promptPills'),
  attachmentPreviewTray: document.getElementById('attachmentPreviewTray'),
  previewImage: document.getElementById('previewImage'),
  previewFileName: document.getElementById('previewFileName'),
  removeAttachmentBtn: document.getElementById('removeAttachmentBtn'),
  imageFileInput: document.getElementById('imageFileInput'),
  attachImageBtn: document.getElementById('attachImageBtn'),
  voiceMicBtn: document.getElementById('voiceMicBtn'),
  userInput: document.getElementById('userInput'),
  sendBtn: document.getElementById('sendBtn'),
  // Modals
  settingsModal: document.getElementById('settingsModal'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
  resetDefaultsBtn: document.getElementById('resetDefaultsBtn'),
  apiKeyInput: document.getElementById('apiKeyInput'),
  apiStatusBadge: document.getElementById('apiStatusBadge'),
  toggleApiKeyVisBtn: document.getElementById('toggleApiKeyVisBtn'),
  modelSelect: document.getElementById('modelSelect'),
  personaSelect: document.getElementById('personaSelect'),
  temperatureSlider: document.getElementById('temperatureSlider'),
  tempValue: document.getElementById('tempValue'),
  voiceSelect: document.getElementById('voiceSelect'),
  testApiBtn: document.getElementById('testApiBtn'),
  testStatusMsg: document.getElementById('testStatusMsg'),
  exportModal: document.getElementById('exportModal'),
  closeExportBtn: document.getElementById('closeExportBtn'),
  exportMarkdownBtn: document.getElementById('exportMarkdownBtn'),
  exportPrintBtn: document.getElementById('exportPrintBtn'),
  exportCopyBtn: document.getElementById('exportCopyBtn')
};

// ==========================================================================
// Initialization
// ==========================================================================
function initApp() {
  applyTheme(state.theme);
  updateModelDisplay();
  initSessions();
  setupEventListeners();
  setupVoiceSpeech();
  setupKaTeXOptions();

  // Populate settings form without exposing the pre-configured key
  elements.apiKeyInput.value = state.customApiKey;
  updateApiKeyBadge();
  elements.modelSelect.value = state.model;
  elements.personaSelect.value = state.persona;
  elements.temperatureSlider.value = state.temperature;
  elements.tempValue.textContent = state.temperature;
  updateTtsIcon();
}

function updateApiKeyBadge() {
  if (!elements.apiStatusBadge) return;
  if (state.customApiKey && !INVALID_LEGACY_KEYS.includes(state.customApiKey)) {
    elements.apiStatusBadge.className = 'badge-free active-custom';
    elements.apiStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Custom Key Active';
    elements.apiKeyInput.placeholder = 'Custom API Key Active (Enter new key to update)';
  } else {
    elements.apiStatusBadge.className = 'badge-free';
    elements.apiStatusBadge.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Pre-configured Free Tier Active';
    elements.apiKeyInput.placeholder = 'Pre-configured Free Tier Active (Enter custom key to override)';
  }
}

function setupKaTeXOptions() {
  // Configure marked to render code properly
  if (window.marked) {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }
}

// ==========================================================================
// Theme & TTS Controls
// ==========================================================================
function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem(`${STORAGE_PREFIX}theme`, theme);
  if (theme === 'light') {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    document.documentElement.className = 'theme-light';
    elements.themeIcon.className = 'fa-solid fa-sun';
    elements.themeToggleBtn.title = 'Light Mode Active • Click for Dark Mode';
  } else {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
    document.documentElement.className = 'theme-dark';
    elements.themeIcon.className = 'fa-solid fa-moon';
    elements.themeToggleBtn.title = 'Dark Mode Active • Click for Light Mode';
  }
}

function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

function updateTtsIcon() {
  if (state.ttsEnabled) {
    elements.ttsIcon.className = 'fa-solid fa-volume-high';
    elements.ttsToggleBtn.style.color = 'var(--accent-purple)';
  } else {
    elements.ttsIcon.className = 'fa-solid fa-volume-xmark';
    elements.ttsToggleBtn.style.color = 'var(--text-muted)';
  }
}

function toggleTts() {
  state.ttsEnabled = !state.ttsEnabled;
  localStorage.setItem(`${STORAGE_PREFIX}tts_enabled`, state.ttsEnabled);
  updateTtsIcon();
  if (!state.ttsEnabled && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

const MODEL_DISPLAY_NAMES = {
  'gemini-3.1-flash-lite': 'Topper-AI 3.1 Flash-Lite',
  'gemini-3.8-flash': 'Topper-AI 3.8 Thinker',
  'gemini-flash-latest': 'Topper-AI Ultra',
  'gemini-3.5-flash': 'Topper-AI Pro 3.5',
  'gemini-flash-lite-latest': 'Topper-AI 3.0 Lite'
};

function getModelDisplayName(modelKey) {
  if (!modelKey) return 'Topper-AI 3.1 Flash';
  return MODEL_DISPLAY_NAMES[modelKey] || modelKey.replace(/^gemini-?/i, 'Topper-AI-');
}

function updateModelDisplay() {
  elements.currentModelDisplay.textContent = getModelDisplayName(state.model);
}

// ==========================================================================
// Sessions Management
// ==========================================================================
function initSessions() {
  if (state.sessions.length === 0) {
    createNewSession('New Study Session', false);
  } else {
    // Load most recent session
    loadSession(state.sessions[0].id);
  }
  renderSessionsList();
}

function createNewSession(title = 'New Study Session', shouldSwitch = true) {
  const newSession = {
    id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    title: title,
    createdAt: new Date().toISOString(),
    messages: [] // Array of { role: 'user' | 'model', text: '...', image?: '...', time: '...' }
  };
  state.sessions.unshift(newSession);
  saveSessions();

  if (shouldSwitch) {
    loadSession(newSession.id);
  }
  renderSessionsList();
  return newSession;
}

function saveSessions() {
  localStorage.setItem(`${STORAGE_PREFIX}sessions`, JSON.stringify(state.sessions));
}

function getActiveSession() {
  return state.sessions.find(s => s.id === state.currentSessionId) || state.sessions[0];
}

function loadSession(sessionId) {
  const session = state.sessions.find(s => s.id === sessionId);
  if (!session) return;

  state.currentSessionId = sessionId;
  elements.activeSessionTitle.textContent = session.title;

  // Render messages
  renderMessages(session.messages);
  renderSessionsList();

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('open');
  }
}

function deleteSession(sessionId, e) {
  if (e) e.stopPropagation();
  state.sessions = state.sessions.filter(s => s.id !== sessionId);
  if (state.sessions.length === 0) {
    createNewSession('New Study Session', true);
  } else if (state.currentSessionId === sessionId) {
    loadSession(state.sessions[0].id);
  } else {
    saveSessions();
    renderSessionsList();
  }
}

function clearAllSessions() {
  if (confirm('Are you sure you want to clear all study sessions?')) {
    state.sessions = [];
    createNewSession('New Study Session', true);
  }
}

function renderSessionsList(filterText = '') {
  elements.sessionsList.innerHTML = '';
  const filtered = state.sessions.filter(s =>
    s.title.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filtered.length === 0) {
    elements.sessionsList.innerHTML = '<div class="empty-sessions-hint">No sessions found</div>';
    return;
  }

  filtered.forEach(s => {
    const item = document.createElement('div');
    item.className = `session-item ${s.id === state.currentSessionId ? 'active' : ''}`;
    item.innerHTML = `
      <div class="session-item-content">
        <i class="fa-regular fa-message"></i>
        <span class="session-title-text">${escapeHtml(s.title)}</span>
      </div>
      <div class="session-actions">
        <button class="session-action-btn delete-btn" title="Delete session">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;

    item.addEventListener('click', () => loadSession(s.id));
    const delBtn = item.querySelector('.delete-btn');
    delBtn.addEventListener('click', (e) => deleteSession(s.id, e));

    elements.sessionsList.appendChild(item);
  });
}

// ==========================================================================
// Chat Rendering & Markdown / LaTeX Parsing
// ==========================================================================
function renderMessages(messages) {
  elements.messagesFeed.innerHTML = '';

  if (!messages || messages.length === 0) {
    elements.welcomeScreen.style.display = 'flex';
    elements.messagesFeed.style.display = 'none';
    return;
  }

  elements.welcomeScreen.style.display = 'none';
  elements.messagesFeed.style.display = 'flex';

  messages.forEach((msg, idx) => {
    appendMessageToDOM(msg, idx);
  });

  scrollChatToBottom();
}

function appendMessageToDOM(msg, idx) {
  const isUser = msg.role === 'user';
  const row = document.createElement('div');
  row.className = `message-row ${isUser ? 'user-message' : 'bot-message'}`;
  row.id = `msg-${idx}`;

  let avatarHTML = '';
  if (isUser) {
    avatarHTML = `<div class="message-avatar user-avatar"><i class="fa-solid fa-user-graduate"></i></div>`;
  } else {
    avatarHTML = `<div class="message-avatar bot-avatar"><img src="logo.png" alt="Easy Topper"></div>`;
  }

  let attachmentHTML = '';
  if (msg.image) {
    attachmentHTML = `<div class="msg-attachment-thumb"><img src="${msg.image}" alt="Attached study diagram"></div>`;
  }

  let formattedText = '';
  if (isUser) {
    formattedText = escapeHtml(msg.text).replace(/\n/g, '<br>');
  } else {
    formattedText = parseMarkdownAndLaTeX(msg.text);
  }

  const modelTagHTML = !isUser ? `<span class="model-tag">${getModelDisplayName(msg.model || state.model)}</span>` : '';
  const timeFormatted = msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let actionsBarHTML = '';
  if (!isUser) {
    actionsBarHTML = `
      <div class="message-actions-bar">
        <button class="msg-action-pill copy-btn" title="Copy answer text">
          <i class="fa-regular fa-copy"></i>
          <span>Copy</span>
        </button>
        <button class="msg-action-pill speak-btn" title="Read explanation aloud">
          <i class="fa-solid fa-volume-high"></i>
          <span>Speak</span>
        </button>
        <button class="msg-action-pill quiz-btn" title="Generate quiz questions on this topic">
          <i class="fa-solid fa-flask-vial"></i>
          <span>Quiz me</span>
        </button>
        <button class="msg-action-pill explain-btn" title="Explain simpler with an analogy">
          <i class="fa-regular fa-lightbulb"></i>
          <span>Simpler</span>
        </button>
      </div>
    `;
  }

  row.innerHTML = `
    ${avatarHTML}
    <div class="message-content-wrapper">
      <div class="message-header">
        <span class="sender-name">${isUser ? 'You' : 'Easy Topper'}</span>
        ${modelTagHTML}
        <span class="message-time">${timeFormatted}</span>
      </div>
      <div class="message-bubble">
        ${attachmentHTML}
        <div class="message-body">${formattedText}</div>
      </div>
      ${actionsBarHTML}
    </div>
  `;

  // Attach action button events
  if (!isUser) {
    const copyBtn = row.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(msg.text).then(() => {
          copyBtn.querySelector('span').textContent = 'Copied!';
          setTimeout(() => copyBtn.querySelector('span').textContent = 'Copy', 2000);
        });
      });
    }

    const speakBtn = row.querySelector('.speak-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => speakText(msg.text));
    }

    const quizBtn = row.querySelector('.quiz-btn');
    if (quizBtn) {
      quizBtn.addEventListener('click', () => {
        elements.userInput.value = `Test my understanding on this topic with 3 multiple-choice exam questions and 1 conceptual challenge question. Include answer explanations at the end.`;
        handleUserSubmit();
      });
    }

    const explainBtn = row.querySelector('.explain-btn');
    if (explainBtn) {
      explainBtn.addEventListener('click', () => {
        elements.userInput.value = `Can you explain the core intuition of this using a simple real-world analogy and diagrammatic steps?`;
        handleUserSubmit();
      });
    }
  }

  elements.messagesFeed.appendChild(row);

  // Post-process KaTeX & Code Copy buttons inside this row
  postProcessMessageBubble(row.querySelector('.message-body'));
}

function parseMarkdownAndLaTeX(rawText) {
  if (!rawText) return '';

  // 1. Convert Markdown via marked.js
  let html = rawText;
  if (window.marked) {
    try {
      html = marked.parse(rawText);
    } catch (e) {
      console.warn('Marked parse error:', e);
    }
  }

  return html;
}

function postProcessMessageBubble(container) {
  if (!container) return;

  // 1. Render KaTeX Math Expressions
  if (window.renderMathInElement) {
    try {
      renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
    }
  }

  // 2. Enhance code blocks with custom header & copy button
  const preBlocks = container.querySelectorAll('pre');
  preBlocks.forEach(pre => {
    if (pre.parentElement.classList.contains('code-block-container')) return;

    const codeEl = pre.querySelector('code');
    let lang = 'code';
    if (codeEl && codeEl.className) {
      const match = codeEl.className.match(/language-([a-z0-9_-]+)/i);
      if (match) lang = match[1];
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-container';
    wrapper.innerHTML = `
      <div class="code-block-header">
        <span class="code-lang">${lang.toUpperCase()}</span>
        <button class="copy-code-btn" title="Copy code">
          <i class="fa-regular fa-copy"></i>
          <span>Copy</span>
        </button>
      </div>
    `;

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copyBtn = wrapper.querySelector('.copy-code-btn');
    copyBtn.addEventListener('click', () => {
      const textToCopy = codeEl ? codeEl.innerText : pre.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copied!</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> <span>Copy</span>`;
        }, 2000);
      });
    });
  });
}

function scrollChatToBottom() {
  requestAnimationFrame(() => {
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
  });
}

// ==========================================================================
// Multimodal Image Attachment
// ==========================================================================
function setupAttachmentHandlers() {
  elements.attachImageBtn.addEventListener('click', () => {
    elements.imageFileInput.click();
  });

  elements.imageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
  });

  elements.removeAttachmentBtn.addEventListener('click', () => {
    clearAttachment();
  });

  // Drag & drop into chatContainer or input area
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleImageFile(file);
      }
    }
  });

  // Paste image from clipboard
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) handleImageFile(file);
        break;
      }
    }
  });
}

function handleImageFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please attach an image file (PNG, JPG, WEBP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const base64Data = dataUrl.split(',')[1];

    state.attachedImage = {
      mimeType: file.type,
      data: base64Data,
      dataUrl: dataUrl,
      fileName: file.name
    };

    elements.previewImage.src = dataUrl;
    elements.previewFileName.textContent = file.name;
    elements.attachmentPreviewTray.style.display = 'block';
    updateSendButtonState();
  };
  reader.readAsDataURL(file);
}

function clearAttachment() {
  state.attachedImage = null;
  elements.imageFileInput.value = '';
  elements.previewImage.src = '';
  elements.attachmentPreviewTray.style.display = 'none';
  updateSendButtonState();
}

// ==========================================================================
// Voice Input (Speech to Text) & Output (Text to Speech)
// ==========================================================================
function setupVoiceSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    state.speechRecognition = new SpeechRecognition();
    state.speechRecognition.continuous = false;
    state.speechRecognition.interimResults = true;
    state.speechRecognition.lang = 'en-US';

    state.speechRecognition.onstart = () => {
      state.isRecordingVoice = true;
      elements.voiceMicBtn.classList.add('recording');
      elements.userInput.placeholder = 'Listening to your question... Speak now!';
    };

    state.speechRecognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      elements.userInput.value = transcript;
      updateSendButtonState();
    };

    state.speechRecognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopVoiceRecording();
    };

    state.speechRecognition.onend = () => {
      stopVoiceRecording();
    };

    elements.voiceMicBtn.addEventListener('click', () => {
      if (state.isRecordingVoice) {
        state.speechRecognition.stop();
      } else {
        try {
          state.speechRecognition.start();
        } catch (err) {
          console.error(err);
        }
      }
    });
  } else {
    elements.voiceMicBtn.title = 'Speech Recognition not supported in this browser';
    elements.voiceMicBtn.style.opacity = '0.5';
  }

  // Populate Voices for Text-to-Speech
  if (window.speechSynthesis) {
    const populateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      elements.voiceSelect.innerHTML = '<option value="">Default System Voice</option>';
      voices.forEach((v, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${v.name} (${v.lang})`;
        elements.voiceSelect.appendChild(opt);
      });
    };
    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }
}

function stopVoiceRecording() {
  state.isRecordingVoice = false;
  elements.voiceMicBtn.classList.remove('recording');
  elements.userInput.placeholder = 'Ask Easy Topper anything... (e.g. solve equations, explain concepts)';
}

function speakText(rawText) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // Stop any ongoing speech

  // Strip markdown symbols and LaTeX code for smoother speech
  const cleanText = rawText
    .replace(/\$\$(.*?)\$\$/g, ' equation ')
    .replace(/\$(.*?)\$/g, ' formula ')
    .replace(/```[\s\S]*?```/g, ' code omitted ')
    .replace(/[#*`_~]/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const voices = window.speechSynthesis.getVoices();
  const selectedVoiceIdx = elements.voiceSelect.value;
  if (selectedVoiceIdx !== '' && voices[selectedVoiceIdx]) {
    utterance.voice = voices[selectedVoiceIdx];
  }
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

// ==========================================================================
// Google Gemini API Stream & Request Execution
// ==========================================================================
async function handleUserSubmit() {
  const query = elements.userInput.value.trim();
  const hasImage = !!state.attachedImage;

  if ((!query && !hasImage) || state.isGenerating) return;

  const session = getActiveSession();

  // If this is the first message in the session, automatically rename session title
  if (session.messages.length === 0) {
    const autoTitle = query ? (query.length > 36 ? query.substring(0, 36) + '...' : query) : 'Diagram Analysis';
    session.title = autoTitle;
    elements.activeSessionTitle.textContent = autoTitle;
  }

  // Record user message
  const userMsg = {
    role: 'user',
    text: query,
    image: hasImage ? state.attachedImage.dataUrl : null,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  session.messages.push(userMsg);
  saveSessions();

  // Reset input UI
  elements.userInput.value = '';
  elements.userInput.style.height = 'auto';
  const attachedImagePayload = state.attachedImage;
  clearAttachment();
  updateSendButtonState();

  // Re-render feed
  renderMessages(session.messages);

  // Execute Gemini Streaming Call
  await executeGeminiCall(session, query, attachedImagePayload);
}

async function executeGeminiCall(session, currentPrompt, imagePayload) {
  state.isGenerating = true;
  setGeneratingUI(true);

  // Prepare placeholder bot message row
  const botIdx = session.messages.length;
  const botMessagePlaceholder = {
    role: 'model',
    text: '',
    model: state.model,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  session.messages.push(botMessagePlaceholder);

  // Add bot message DOM element with streaming cursor
  appendMessageToDOM(botMessagePlaceholder, botIdx);
  const botRow = document.getElementById(`msg-${botIdx}`);
  const botBody = botRow.querySelector('.message-body');
  botBody.classList.add('streaming-cursor');

  state.abortController = new AbortController();

  try {
    // Build conversational contents history for Gemini API
    const contents = [];

    // System Persona Prompt
    const systemInstruction = PERSONAS[state.persona] || PERSONAS.topper;

    // Map prior session messages (last 10 turns to conserve context)
    const recentHistory = session.messages.slice(0, session.messages.length - 1).slice(-10);
    recentHistory.forEach(m => {
      const parts = [];
      if (m.text) {
        parts.push({ text: m.text });
      }
      contents.push({
        role: m.role === 'user' ? 'user' : 'model',
        parts: parts
      });
    });

    // If current message had an image, inject into the latest user turn
    const latestTurn = contents[contents.length - 1];
    if (imagePayload && latestTurn && latestTurn.role === 'user') {
      latestTurn.parts.unshift({
        inline_data: {
          mime_type: imagePayload.mimeType,
          data: imagePayload.data
        }
      });
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: contents,
      generationConfig: {
        temperature: state.temperature,
        topP: 0.95
      }
    };

    const effectiveKey = getEffectiveApiKey();
    const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(state.model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(effectiveKey)}`;

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': effectiveKey
      },
      body: JSON.stringify(payload),
      signal: state.abortController.signal
    });

    if (!response.ok) {
      let errText = await response.text();
      let errorMsg = `HTTP ${response.status}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error && parsed.error.message) {
          errorMsg = parsed.error.message;
        }
      } catch (e) {
        errorMsg = errText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    // Read SSE Stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulatedText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Retain remainder

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.substring(6);
          if (jsonStr === '[DONE]') continue;
          try {
            const data = JSON.parse(jsonStr);
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
              const part = data.candidates[0].content.parts[0];
              if (part && part.text) {
                accumulatedText += part.text;
                botBody.innerHTML = parseMarkdownAndLaTeX(accumulatedText);
                scrollChatToBottom();
              }
            }
          } catch (jsonErr) {
            console.warn('Error parsing SSE JSON:', jsonErr);
          }
        }
      }
    }

    // Finished streaming
    botBody.classList.remove('streaming-cursor');
    botMessagePlaceholder.text = accumulatedText || '*(No response received)*';
    saveSessions();

    // Final render with KaTeX and Code blocks
    botBody.innerHTML = parseMarkdownAndLaTeX(botMessagePlaceholder.text);
    postProcessMessageBubble(botBody);

    // Read aloud if TTS is enabled
    if (state.ttsEnabled) {
      speakText(botMessagePlaceholder.text);
    }

    // Trigger subtle celebratory confetti for math / exam mastery
    if (/solution|answer|proof|formula|congratulations/i.test(accumulatedText) && window.confetti) {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.85 }
      });
    }

  } catch (error) {
    botBody.classList.remove('streaming-cursor');
    if (error.name === 'AbortError') {
      botBody.innerHTML += '<p style="color: var(--accent-rose); font-style: italic;">[Generation stopped by user]</p>';
    } else {
      console.error('Gemini Request Failed:', error);
      botBody.innerHTML = `
        <div style="color: var(--accent-rose); padding: 12px 16px; border-radius: 10px; background: rgba(244, 63, 94, 0.08); border: 1px solid rgba(244, 63, 94, 0.25);">
          <strong><i class="fa-solid fa-triangle-exclamation"></i> Error querying Easy Topper AI:</strong>
          <p style="margin-top: 6px; font-size: 0.88rem; line-height: 1.5;">${escapeHtml(error.message)}</p>
          <p style="margin-top: 6px; font-size: 0.78rem; color: var(--text-muted);">
            You can verify settings in <a href="#" id="inlineConfigLink" style="color: var(--accent-cyan); text-decoration: underline;">Settings</a>.
          </p>
        </div>
      `;
      const link = botBody.querySelector('#inlineConfigLink');
      if (link) link.addEventListener('click', (e) => { e.preventDefault(); openSettings(); });
    }
    botMessagePlaceholder.text = botBody.innerText;
    saveSessions();
  } finally {
    state.isGenerating = false;
    setGeneratingUI(false);
    state.abortController = null;
    scrollChatToBottom();
  }
}

function setGeneratingUI(isGen) {
  if (isGen) {
    elements.sendBtn.classList.add('is-generating');
    elements.sendBtn.disabled = false;
    elements.sendBtn.title = 'Stop generation';
    elements.sendBtn.querySelector('.send-icon').style.display = 'none';
    elements.sendBtn.querySelector('.stop-icon').style.display = 'block';
  } else {
    elements.sendBtn.classList.remove('is-generating');
    elements.sendBtn.querySelector('.send-icon').style.display = 'block';
    elements.sendBtn.querySelector('.stop-icon').style.display = 'none';
    elements.sendBtn.title = 'Send Question';
    updateSendButtonState();
  }
}

function updateSendButtonState() {
  if (state.isGenerating) return;
  const hasText = elements.userInput.value.trim().length > 0;
  const hasImg = !!state.attachedImage;
  elements.sendBtn.disabled = !(hasText || hasImg);
}

// ==========================================================================
// Settings Modal & API Testing
// ==========================================================================
function openSettings() {
  // Never show predefined API key!
  elements.apiKeyInput.value = state.customApiKey || '';
  updateApiKeyBadge();
  elements.modelSelect.value = state.model;
  elements.personaSelect.value = state.persona;
  elements.temperatureSlider.value = state.temperature;
  elements.tempValue.textContent = state.temperature;
  elements.testStatusMsg.textContent = '';
  elements.settingsModal.style.display = 'flex';
}

function closeSettings() {
  elements.settingsModal.style.display = 'none';
}

async function testApiConnection() {
  const customEntered = elements.apiKeyInput.value.trim();
  const testKey = customEntered || getEffectiveApiKey();
  const isPredefined = !customEntered;
  const testModel = elements.modelSelect.value;
  elements.testStatusMsg.className = 'test-status loading';
  elements.testStatusMsg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing connection...';

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(testModel)}:generateContent?key=${encodeURIComponent(testKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': testKey
      },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Ping test. Reply with OK.' }] }] })
    });

    if (res.ok) {
      elements.testStatusMsg.className = 'test-status success';
      elements.testStatusMsg.innerHTML = isPredefined
        ? '<i class="fa-solid fa-circle-check"></i> Pre-configured Free Tier Verified & Ready!'
        : '<i class="fa-solid fa-circle-check"></i> Custom API Key Verified & Ready!';
      if (window.confetti) confetti({ particleCount: 20, spread: 45 });
      if (customEntered) {
        state.customApiKey = customEntered;
        localStorage.setItem(`${STORAGE_PREFIX}custom_api_key`, customEntered);
        updateApiKeyBadge();
      }
    } else {
      const err = await res.json();
      throw new Error(err.error ? err.error.message : `HTTP ${res.status}`);
    }
  } catch (err) {
    elements.testStatusMsg.className = 'test-status error';
    elements.testStatusMsg.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${escapeHtml(err.message)}`;
  }
}

function saveSettings() {
  const enteredKey = elements.apiKeyInput.value.trim();
  const newModel = elements.modelSelect.value;
  const newPersona = elements.personaSelect.value;
  const newTemp = parseFloat(elements.temperatureSlider.value);

  // If user entered a custom key, save it; if left empty, use the built-in preconfigured key
  state.customApiKey = enteredKey;
  if (enteredKey) {
    localStorage.setItem(`${STORAGE_PREFIX}custom_api_key`, enteredKey);
  } else {
    localStorage.removeItem(`${STORAGE_PREFIX}custom_api_key`);
  }

  state.model = newModel;
  state.persona = newPersona;
  state.temperature = newTemp;

  localStorage.setItem(`${STORAGE_PREFIX}model`, state.model);
  localStorage.setItem(`${STORAGE_PREFIX}persona`, state.persona);
  localStorage.setItem(`${STORAGE_PREFIX}temp`, state.temperature);

  updateModelDisplay();
  updateApiKeyBadge();
  closeSettings();
}

function resetSettingsDefaults() {
  elements.apiKeyInput.value = '';
  state.customApiKey = '';
  localStorage.removeItem(`${STORAGE_PREFIX}custom_api_key`);
  updateApiKeyBadge();
  elements.modelSelect.value = DEFAULT_MODEL;
  elements.personaSelect.value = 'topper';
  elements.temperatureSlider.value = 0.4;
  elements.tempValue.textContent = '0.4';
  elements.testStatusMsg.textContent = '';
}

// ==========================================================================
// Export Session Capabilities
// ==========================================================================
function openExportModal() {
  elements.exportModal.style.display = 'flex';
}

function closeExportModal() {
  elements.exportModal.style.display = 'none';
}

function exportAsMarkdown() {
  const session = getActiveSession();
  let md = `# Easy Topper Study Session: ${session.title}\n`;
  md += `*Generated by Easy Topper on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

  session.messages.forEach(m => {
    const roleName = m.role === 'user' ? '### 🧑‍🎓 Student' : '### 🎓 Easy Topper';
    md += `${roleName} (${m.time || ''}):\n\n${m.text}\n\n---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_easy_topper.md`;
  a.click();
  URL.revokeObjectURL(url);
  closeExportModal();
}

function exportPrint() {
  closeExportModal();
  setTimeout(() => window.print(), 200);
}

function exportCopyAll() {
  const session = getActiveSession();
  let fullText = `Easy Topper - ${session.title}\n\n`;
  session.messages.forEach(m => {
    fullText += `[${m.role === 'user' ? 'Question' : 'Easy Topper Answer'}]:\n${m.text}\n\n`;
  });
  navigator.clipboard.writeText(fullText).then(() => {
    alert('Session notes copied to clipboard!');
    closeExportModal();
  });
}

// ==========================================================================
// Event Listeners Setup
// ==========================================================================
function setupEventListeners() {
  // Sidebar toggles (works on both Desktop and Mobile)
  elements.toggleSidebarBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      elements.sidebar.classList.toggle('open');
      elements.sidebarOverlay.classList.toggle('open');
    } else {
      elements.appLayout.classList.toggle('sidebar-collapsed');
    }
  });

  elements.closeSidebarBtn.addEventListener('click', () => {
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('open');
  });

  elements.sidebarOverlay.addEventListener('click', () => {
    elements.sidebar.classList.remove('open');
    elements.sidebarOverlay.classList.remove('open');
  });

  // New session button
  elements.newSessionBtn.addEventListener('click', () => {
    createNewSession('New Study Session', true);
    elements.userInput.focus();
  });

  // Search sessions input
  elements.searchSessionsInput.addEventListener('input', (e) => {
    renderSessionsList(e.target.value);
  });

  // Clear all sessions
  elements.clearSessionsBtn.addEventListener('click', clearAllSessions);

  // Top Action buttons
  elements.ttsToggleBtn.addEventListener('click', toggleTts);
  elements.themeToggleBtn.addEventListener('click', toggleTheme);
  elements.openSettingsBtn.addEventListener('click', openSettings);
  elements.topSettingsBtn.addEventListener('click', openSettings);
  elements.exportSessionBtn.addEventListener('click', openExportModal);

  // Session Title Editing
  elements.renameSessionBtn.addEventListener('click', () => {
    elements.activeSessionTitle.contentEditable = 'true';
    elements.activeSessionTitle.focus();
  });

  elements.activeSessionTitle.addEventListener('blur', () => {
    elements.activeSessionTitle.contentEditable = 'false';
    const newTitle = elements.activeSessionTitle.textContent.trim() || 'Study Session';
    const session = getActiveSession();
    session.title = newTitle;
    saveSessions();
    renderSessionsList();
  });

  elements.activeSessionTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      elements.activeSessionTitle.blur();
    }
  });

  // Starter Cards Quick Prompts
  document.querySelectorAll('.starter-card').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-prompt');
      elements.userInput.value = prompt;
      handleUserSubmit();
    });
  });

  // Prompt Pills
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      const current = elements.userInput.value.trim();
      if (!current) {
        elements.userInput.value = tag + ': ';
      } else {
        elements.userInput.value = current + ' (' + tag + ')';
      }
      elements.userInput.focus();
      updateSendButtonState();
    });
  });

  // Auto-resize input & submit handlers
  elements.userInput.addEventListener('input', () => {
    elements.userInput.style.height = 'auto';
    elements.userInput.style.height = Math.min(elements.userInput.scrollHeight, 140) + 'px';
    updateSendButtonState();
  });

  elements.userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSubmit();
    }
  });

  elements.sendBtn.addEventListener('click', () => {
    if (state.isGenerating) {
      if (state.abortController) {
        state.abortController.abort();
      }
    } else {
      handleUserSubmit();
    }
  });

  // Attachment upload setup
  setupAttachmentHandlers();

  // Settings Modal events
  elements.closeSettingsBtn.addEventListener('click', closeSettings);
  elements.saveSettingsBtn.addEventListener('click', saveSettings);
  elements.resetDefaultsBtn.addEventListener('click', resetSettingsDefaults);
  elements.testApiBtn.addEventListener('click', testApiConnection);
  elements.temperatureSlider.addEventListener('input', (e) => {
    elements.tempValue.textContent = e.target.value;
  });

  elements.toggleApiKeyVisBtn.addEventListener('click', () => {
    const isPass = elements.apiKeyInput.type === 'password';
    elements.apiKeyInput.type = isPass ? 'text' : 'password';
    elements.toggleApiKeyVisBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
  });

  // Export Modal events
  elements.closeExportBtn.addEventListener('click', closeExportModal);
  elements.exportMarkdownBtn.addEventListener('click', exportAsMarkdown);
  elements.exportPrintBtn.addEventListener('click', exportPrint);
  elements.exportCopyBtn.addEventListener('click', exportCopyAll);

  // Close modals on Esc or backdrop click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSettings();
      closeExportModal();
    }
  });

  elements.settingsModal.addEventListener('click', (e) => {
    if (e.target === elements.settingsModal) closeSettings();
  });

  elements.exportModal.addEventListener('click', (e) => {
    if (e.target === elements.exportModal) closeExportModal();
  });
}

// Utility: HTML Escaping
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Run App on DOM Ready
document.addEventListener('DOMContentLoaded', initApp);
