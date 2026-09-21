document.addEventListener('DOMContentLoaded', async () => {

    /* --- State Variables --- */
    let isExpanded = false;
    let messageHistory = [];
    let isBackendOnline = false;

    /* --- DOM Elements --- */
    const floatingBtn = document.getElementById('floatingChatBtn');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const expandBtn = document.getElementById('expandBtn');
    const newChatBtn = document.getElementById('newChatBtn');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    const messagesArea = document.getElementById('messagesArea');
    const quickQueries = document.getElementById('quickQueries');
    const typingIndicator = document.getElementById('typingIndicator');
    const voiceBtn = document.getElementById('voiceBtn');
    const languageSelect = document.getElementById('languageSelect');

    /* --- Chatbot Toggle Logic --- */
    if (floatingBtn && chatbotPanel) {
        floatingBtn.addEventListener('click', () => {
            chatbotPanel.classList.add('open');
            floatingBtn.style.display = 'none';
            if (chatInput) chatInput.focus();
        });
    }

    if (closeChatBtn && chatbotPanel) {
        closeChatBtn.addEventListener('click', () => {
            chatbotPanel.classList.remove('open');
            floatingBtn.style.display = 'flex';
        });
    }

    /* --- Expand / Collapse Panel Logic --- */
    function toggleExpand() {
        isExpanded = !isExpanded;
        chatbotPanel.classList.toggle('expanded', isExpanded);
        const icon = expandBtn.querySelector('i');
        if (isExpanded) {
            icon.className = 'ri-contract-left-right-line';
            expandBtn.title = "Collapse";
        } else {
            icon.className = 'ri-expand-left-right-line';
            expandBtn.title = "Expand";
        }
    }

    if (expandBtn) {
        expandBtn.addEventListener('click', toggleExpand);
    }

    /* --- New Chat Logic --- */
    function startNewChat() {
        messageHistory = [];
        if (messagesArea) {
            messagesArea.innerHTML = `
                <div class="message-row bot">
                    <div class="message-bubble">
                        Namaste! 🙏 I am <strong>Jago</strong>, your digital assistant for the Ministry of Tribal Affairs.
                        <br><br>
                        How can I assist you today?
                    </div>
                </div>
            `;
        }

        // Show quick queries again
        if (quickQueries) {
            quickQueries.style.display = 'block';
            messagesArea.appendChild(quickQueries);
        }
    }

    if (newChatBtn) {
        newChatBtn.addEventListener('click', startNewChat);
    }

    /* --- Quick Queries Listener --- */
    if (quickQueries) {
        quickQueries.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-query-btn')) {
                const query = e.target.textContent.trim();
                if (chatInput) {
                    chatInput.value = query;
                    sendMessage();
                }
            }
        });
    }

    /* --- Message Handling --- */
    async function sendMessage() {
        const text = chatInput ? chatInput.value.trim() : '';
        if (!text) return;

        // Hide quick queries after first message
        if (quickQueries) {
            quickQueries.style.display = 'none';
        }

        // User Message
        appendMessage(text, 'user');
        if (chatInput) chatInput.value = '';
        messageHistory.push({ sender: 'user', text });

        // Show typing indicator
        showTyping(true);

        try {
            if (!window.MoTAAPI) {
                throw new Error("API service not loaded");
            }

            const chatHistoryForAPI = messageHistory.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));
            const selectedLanguage = languageSelect ? languageSelect.value : 'eng';
            const response = await window.MoTAAPI.sendChatMessage(text, chatHistoryForAPI, null, selectedLanguage);

            showTyping(false);

            if (!response || !response.success) {
                throw new Error(response?.error || "Backend request failed");
            }

            await typeBotMessage(response.answer, {
                confidence: response.confidence || 85
            });

            messageHistory.push({ sender: 'bot', text: response.answer });

        } catch (error) {
            showTyping(false);
            appendMessage("Sorry, I'm unable to connect to the Ministry of Tribal Affairs AI server at the moment. Please try again later.", 'bot', { confidence: 0 });
        }
    }

    function formatResponse(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    // Standard append for User
    function appendMessage(text, sender, metadata = {}) {
        if (!messagesArea) return;
        const div = document.createElement('div');
        div.className = `message-row ${sender}`;
        div.innerHTML = `<div class="message-bubble">${text}</div>`;
        messagesArea.appendChild(div);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // Typewriter for Bot
    async function typeBotMessage(text, metadata = {}) {
        if (!messagesArea) return;

        const div = document.createElement('div');
        div.className = 'message-row bot';

        // 1. Bubble
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.style.position = 'relative';
        div.appendChild(bubble);

        messagesArea.appendChild(div);
        messagesArea.scrollTop = messagesArea.scrollHeight;

        // 2. Type Text (Word by Word)
        const chunks = text.split(/(\s+)/);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            bubble.innerHTML += chunk.replace(/\n/g, '<br>');
            messagesArea.scrollTop = messagesArea.scrollHeight;

            if (chunk.trim().length > 0) {
                await new Promise(r => setTimeout(r, 50));
            } else {
                await new Promise(r => setTimeout(r, 10));
            }
        }

        // 3. Apply Formatting
        bubble.innerHTML = formatResponse(text);

        // 4. Append Actions (Below Bubble at Bottom)
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        actionsDiv.innerHTML = `
            <button onclick="copyMessage(this)" class="msg-action-btn" title="Copy">
                <i class="ri-file-copy-line"></i>
            </button>
            <button onclick="thumbsUp(this)" class="msg-action-btn" title="Helpful">
               <i class="ri-thumb-up-line"></i>
            </button>
            <button onclick="thumbsDown(this)" class="msg-action-btn" title="Not helpful">
               <i class="ri-thumb-down-line"></i>
            </button>
        `;
        div.appendChild(actionsDiv);

        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function showTyping(show) {
        if (typingIndicator) {
            typingIndicator.style.display = show ? 'flex' : 'none';
            if (show && messagesArea) {
                messagesArea.scrollTop = messagesArea.scrollHeight;
            }
        }
    }

    /* --- Event Listeners --- */
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    /* --- Voice Input --- */
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();

                const langMap = {
                    'eng': 'en-IN',
                    'en': 'en-IN',
                    'hin': 'hi-IN',
                    'hi': 'hi-IN',
                    'gnd': 'hi-IN',
                    'sat': 'sat-IN',
                    'mun': 'hi-IN',
                    'bhili': 'hi-IN',
                    'bettakuruba': 'kn-IN',
                    'garo': 'en-IN',
                    'kokborok': 'bn-IN',
                    'koya': 'te-IN',
                    'kui': 'or-IN'
                };
                recognition.lang = langMap[languageSelect?.value] || 'en-IN';
                recognition.interimResults = false;

                recognition.onstart = () => {
                    voiceBtn.style.background = 'var(--red-500)';
                    voiceBtn.style.color = 'white';
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (chatInput) chatInput.value = transcript;
                };

                recognition.onend = () => {
                    voiceBtn.style.background = 'var(--gray-100)';
                    voiceBtn.style.color = 'var(--gray-600)';
                };

                recognition.onerror = () => {
                    voiceBtn.style.background = 'var(--gray-100)';
                    voiceBtn.style.color = 'var(--gray-600)';
                    alert('Voice recognition failed. Please try again.');
                };

                recognition.start();
            } else {
                alert('Voice recognition is not supported in your browser.');
            }
        });
    }

    /* --- Custom Language Dropdown Logic --- */
    const langDropdownWrapper = document.getElementById('langDropdownWrapper');
    const langPillBtn = document.getElementById('langPillBtn');
    const currentLangLabel = document.getElementById('currentLangLabel');
    const langItems = document.querySelectorAll('.lang-item');

    if (langPillBtn && langDropdownWrapper) {
        langPillBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdownWrapper.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!langDropdownWrapper.contains(e.target)) {
                langDropdownWrapper.classList.remove('open');
            }
        });

        langItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const langCode = item.getAttribute('data-lang');
                const langLabel = item.getAttribute('data-label') || item.querySelector('.lang-name')?.textContent;

                // Update active state
                langItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Update label & hidden input value
                if (currentLangLabel) currentLangLabel.textContent = langLabel;
                if (languageSelect) {
                    languageSelect.value = langCode;
                    languageSelect.dispatchEvent(new Event('change'));
                }

                langDropdownWrapper.classList.remove('open');
            });
        });
    }

    /* --- Language Change Placeholder Update --- */
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            const placeholders = {
                'eng': 'Ask about schemes, scholarships, eligibility...',
                'hin': 'योजनाओं, छात्रवृत्ति, पात्रता के बारे में पूछें...',
                'gnd': 'योजना, छात्रवृत्ति बद्दल विचारा (Gondi)...',
                'sat': 'ᱥᱠᱤᱢ, ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤ ᱢᱮ (Santali)...',
                'mun': 'योजना, छात्रवृत्ति विषय रे कुलि पे (Mundari)...',
                'bhili': 'योजना, छात्रवृत्ति बाबत पूछो (Bhili)...',
                'bettakuruba': 'Ask in Bettakuruba...',
                'garo': 'Skim-rang, scholarship-ni gimin singbo (Garo)...',
                'kokborok': 'Hukum, scholarship ni bisingtwi swngdi (Kokborok)...',
                'koya': 'పథకాలు, స్కాలర్‌షిప్‌ల గురించి అడగండి (Koya)...',
                'kui': 'ଯୋଜନା, ବୃତ୍ତି ବିଷୟରେ ପଚାରନ୍ତୁ (Kui)...'
            };
            if (chatInput) chatInput.placeholder = placeholders[lang] || placeholders['eng'];
        });
    }

});

/* --- Global Helper Functions --- */
function copyMessage(btn) {
    const row = btn.closest('.message-row') || btn.parentElement.parentElement;
    const bubble = row ? row.querySelector('.message-bubble') : btn.parentElement.previousElementSibling;
    if (!bubble) return;

    const text = bubble.innerText.trim();

    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = '<i class="ri-check-line" style="font-size: 0.75rem; color: var(--green-600);"></i>';
        setTimeout(() => {
            btn.innerHTML = '<i class="ri-file-copy-line" style="font-size: 0.75rem;"></i>';
        }, 2000);
    });
}

function thumbsUp(btn) {
    btn.style.background = 'var(--green-100)';
    btn.innerHTML = '<i class="ri-thumb-up-fill" style="font-size: 0.75rem; color: var(--green-600);">';
    // Disable sibling buttons
    const siblings = btn.parentElement.querySelectorAll('button');
    siblings.forEach(s => {
        if (s !== btn && s.title !== 'Copy') {
            s.disabled = true;
            s.style.opacity = '0.5';
        }
    });
}

function thumbsDown(btn) {
    btn.style.background = 'var(--red-100)';
    btn.innerHTML = '<i class="ri-thumb-down-fill" style="font-size: 0.75rem; color: var(--red-600);">';
    // Disable sibling buttons
    const siblings = btn.parentElement.querySelectorAll('button');
    siblings.forEach(s => {
        if (s !== btn && s.title !== 'Copy') {
            s.disabled = true;
            s.style.opacity = '0.5';
        }
    });
}

async function speakMessage(btn) {
    const row = btn.closest('.message-row') || btn.parentElement.parentElement;
    const bubble = row ? row.querySelector('.message-bubble') : btn.parentElement.previousElementSibling;
    if (!bubble) return;

    const clone = bubble.cloneNode(true);
    const stats = clone.querySelector('div');
    if (stats && stats.style.borderTop) stats.remove();
    const text = clone.innerText.trim();

    btn.innerHTML = '<i class="ri-loader-4-line" style="font-size: 0.75rem; animation: spin 1s linear infinite;"></i>';

    // Try TTS API first
    if (window.MoTAAPI) {
        const result = await window.MoTAAPI.textToSpeech(text);
        if (result.success) {
            const audio = new Audio(result.audioUrl);
            audio.play();
            btn.innerHTML = '<i class="ri-volume-up-fill" style="font-size: 0.75rem; color: var(--blue-600);"></i>';
            audio.onended = () => {
                btn.innerHTML = '<i class="ri-volume-up-line" style="font-size: 0.75rem;"></i>';
            };
            return;
        }
    }

    // Fallback to browser TTS
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.onend = () => {
            btn.innerHTML = '<i class="ri-volume-up-line" style="font-size: 0.75rem;"></i>';
        };
        speechSynthesis.speak(utterance);
        btn.innerHTML = '<i class="ri-volume-up-fill" style="font-size: 0.75rem; color: var(--blue-600);"></i>';
    } else {
        btn.innerHTML = '<i class="ri-volume-up-line" style="font-size: 0.75rem;"></i>';
        alert('Text-to-speech is not available.');
    }
}

// Add CSS for spin animation
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);
