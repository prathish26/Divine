/* ==========================================================================
   chat-assistant.js — Siri Live Icon & Voice-Enabled Assistant
   Divine Technologies AI Voice & Text Interface
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const trigger = document.getElementById('aiAssistantTrigger');
  const chatWindow = document.getElementById('aiAssistantWindow');
  const closeBtn = document.getElementById('aiAssistantClose');
  const form = document.getElementById('aiAssistantForm');
  const input = document.getElementById('aiAssistantInput');
  const messagesContainer = document.getElementById('aiAssistantMessages');
  const micBtn = document.getElementById('aiAssistantMic');
  const headerOrb = document.getElementById('aiHeaderOrb');
  const triggerOrb = document.getElementById('aiTriggerOrb');
  const chips = document.querySelectorAll('.ai-chip');

  if (!trigger || !chatWindow) return;

  // Toggle Chat Window
  function toggleChat(open) {
    const shouldOpen = typeof open === 'boolean' ? open : !chatWindow.classList.contains('is-open');
    if (shouldOpen) {
      chatWindow.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      input.focus();
    } else {
      chatWindow.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      stopVoiceRecognition();
    }
  }

  trigger.addEventListener('click', () => toggleChat());
  closeBtn.addEventListener('click', () => toggleChat(false));

  // Auto scroll to bottom of messages
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Format Time
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Add a message to chat
  function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg--${sender}`;
    msgDiv.innerHTML = `
      <div class="ai-msg__bubble">${text}</div>
      <span class="ai-msg__time">${getCurrentTime()}</span>
    `;
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
  }

  // Assistant Knowledge & Response Engine
  function generateBotResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('guarantee') || q.includes('100%') || q.includes('risk') || q.includes('warranty')) {
      return "Divine Technologies provides a **100% Commercial Outcome Guarantee**. We tie all fees to measurable technical milestones. If we don't hit the agreed production criteria, you pay nothing.";
    }

    if (q.includes('google cloud') || q.includes('bigquery') || q.includes('gcp') || q.includes('data warehouse') || q.includes('looker')) {
      return "Our **Google Cloud & Data Analytics practice** specializes in BigQuery data warehousing, automated ETL pipelines, Looker BI reporting, and autonomous AI data agents on Vertex AI.";
    }

    if (q.includes('migrate') || q.includes('oracle') || q.includes('moderniz') || q.includes('legacy')) {
      return "We perform zero-downtime database migrations (including Oracle → BigQuery) and legacy codebase modernization using automated semantic translation and synthetic validation testing.";
    }

    if (q.includes('agent') || q.includes('ai') || q.includes('llm') || q.includes('gemini')) {
      return "We engineer autonomous AI & Data agents that connect directly to your data warehouse, allowing non-technical business users to run natural language analysis and generate instant dashboards.";
    }

    if (q.includes('price') || q.includes('cost') || q.includes('engagement') || q.includes('hire') || q.includes('start')) {
      return "We deploy dedicated AI-native pods with fixed sprint pricing tied to outcome milestones. You can click **'Start an Engagement'** or email `engagements@divinetechnologies.com` to schedule a 30-minute scoping call.";
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return "Hello! I am your Divine Technologies AI Assistant. How can I help you explore our services, Google Cloud capabilities, or our 100% outcome guarantee?";
    }

    return "Thank you for asking! Divine Technologies builds AI-native software, enterprise cloud data solutions, and agentic workflows. Would you like details on our **Google Cloud practice**, **Migration services**, or **Outcome Guarantee**?";
  }

  // Handle Send
  function handleSendMessage(text) {
    const userText = text.trim();
    if (!userText) return;

    addMessage('user', userText);
    input.value = '';

    // Show typing state / slight delay for realism
    setTimeout(() => {
      const response = generateBotResponse(userText);
      addMessage('bot', response);
    }, 450);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage(input.value);
  });

  // Quick Chips
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      handleSendMessage(chip.dataset.query || chip.textContent);
    });
  });

  // ==========================================================================
  // VOICE INPUT (Siri Live Waveform & Web Speech API)
  // ==========================================================================
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isRecording = false;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRecording = true;
      micBtn.classList.add('is-recording');
      micBtn.setAttribute('title', 'Listening... click to stop');
      if (headerOrb) headerOrb.classList.add('siri-orb--listening');
      if (triggerOrb) triggerOrb.classList.add('siri-orb--listening');
      input.placeholder = 'Listening... Speak now';
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          input.value = event.results[i][0].transcript;
          handleSendMessage(input.value);
        } else {
          interimTranscript += event.results[i][0].transcript;
          input.value = interimTranscript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopVoiceRecognition();
      input.placeholder = 'Type a message...';
    };

    recognition.onend = () => {
      stopVoiceRecognition();
      input.placeholder = 'Type a message or use voice...';
    };
  }

  function stopVoiceRecognition() {
    if (recognition && isRecording) {
      try {
        recognition.stop();
      } catch (e) {}
    }
    isRecording = false;
    if (micBtn) micBtn.classList.remove('is-recording');
    if (headerOrb) headerOrb.classList.remove('siri-orb--listening');
    if (triggerOrb) triggerOrb.classList.remove('siri-orb--listening');
  }

  function startVoiceRecognition() {
    if (!recognition) {
      alert('Voice input is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }
    if (isRecording) {
      stopVoiceRecognition();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.warn('Recognition start error:', e);
      }
    }
  }

  if (micBtn) {
    micBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startVoiceRecognition();
    });
  }
});
