/**
 * API Service for connecting to MoTA Backend
 * Backend endpoints:
 * - POST /chat - Send a query and get AI response
 * - GET /documents - List all uploaded documents
 * - POST /upload - Upload a new document
 * - POST /tts - Text to speech conversion
 */

/**
 * API Configuration for MoTA RAG Chatbot
 * =======================================
 * 
 * Environment Detection:
 * - HTTPS (Vercel/Production): Uses proxy to avoid mixed-content issues
 * - HTTP localhost: Connects directly to local backend
 * - HTTP other: Connects to configured production server
 * 
 * To change backend URL:
 * 1. For local development: Backend runs on localhost:8000
 * 2. For production: Set PRODUCTION_BACKEND_URL below
 */

// ============================================
// 🔧 CONFIGURATION - PRODUCTION BACKEND
// ============================================
const PRODUCTION_BACKEND_URL = 'https://tribot.tribal.gov.in/api/v1';

// 🔑 PUBLIC API KEY — Set your API Key here or pass via window.MoTA_PUBLIC_API_KEY
const PUBLIC_API_KEY = 'mota-pub-tribot-api-key';

const API_CONFIG = {
    // API Base URL - pointing to official production API
    BASE_URL: PRODUCTION_BACKEND_URL,

    // Public API Key for client requests
    API_KEY: PUBLIC_API_KEY || (typeof window !== 'undefined' && (window.MoTA_PUBLIC_API_KEY || localStorage.getItem('mota_public_api_key'))) || '',

    // Set to true to use mock responses when backend is unavailable
    USE_MOCK_FALLBACK: false,

    // Request timeout in milliseconds
    TIMEOUT: 45000,

    // Enable debug logging
    DEBUG: false
};

// Log configuration for debugging
if (API_CONFIG.DEBUG) {
    console.log('[MoTA API] Configuration:', {
        baseUrl: API_CONFIG.BASE_URL,
        protocol: window.location.protocol,
        hostname: window.location.hostname
    });
}

/**
 * Chat API - Send a message and get AI response
 * Connects to /api/v1/chat on https://tribot.tribal.gov.in
 */
async function sendChatMessage(query, chat_history = [], session_id = null, language = 'eng') {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        };

        // Format message history for /api/v1/chat endpoint
        let messages = [];
        if (chat_history && chat_history.length > 0) {
            messages = chat_history.map(m => ({
                role: (m.role === 'user' || m.sender === 'user') ? 'user' : 'assistant',
                content: m.content || m.text || ''
            }));
            const lastMsg = messages[messages.length - 1];
            if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== query) {
                messages.push({ role: 'user', content: query });
            }
        } else {
            messages = [{ role: 'user', content: query }];
        }

        const bodyPayload = {
            query: query,
            messages: messages,
            language: language || 'eng',
            top_k: 10
        };
        if (session_id) {
            bodyPayload.conversation_id = session_id;
            bodyPayload.session_id = session_id;
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}/chat`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(bodyPayload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            response_type: data.response_type || 'plain_text',
            answer: data.answer || '',
            items: data.items || [],
            table_headers: data.table_headers || [],
            table_rows: data.table_rows || [],
            actions: data.actions || [],
            sources: data.sources || [],
            session_id: data.session_id,
            confidence_level: data.confidence_level || 'high',
            confidence: data.confidence_level === 'high' ? 95 : (data.confidence_level === 'low' ? 45 : 85),
            turn_number: data.turn_number || 1,
            lang: data.lang || 'english'
        };
    } catch (error) {
        console.error('Chat API Error:', error);

        if (API_CONFIG.USE_MOCK_FALLBACK && !localStorage.getItem('mota_token')) {
            console.warn("Using Mock Response (Public Mode)");
            return getMockResponse(query);
        }

        return {
            success: false,
            error: error.message || 'Unable to connect to the server.',
            answer: 'Sorry, I\'m unable to connect to the Ministry of Tribal Affairs AI server at the moment. Please try again later.'
        };
    }
}


/**
 * Helper to get Auth & API Key Headers
 */
function getAuthHeaders() {
    const headers = {};
    const token = localStorage.getItem('mota_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const apiKey = API_CONFIG.API_KEY || (typeof window !== 'undefined' && (window.MoTA_PUBLIC_API_KEY || localStorage.getItem('mota_public_api_key')));
    if (apiKey) {
        headers['x-api-key'] = apiKey;
        headers['X-API-KEY'] = apiKey;
        if (!token) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }
    }

    return headers;
}

/**
 * Upload Document API
 */
async function uploadDocument(file, metadata = {}) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        // Append all metadata fields
        Object.keys(metadata).forEach(key => {
            if (metadata[key]) { // Only append if value exists
                formData.append(key, metadata[key]);
            }
        });

        const response = await fetch(`${API_CONFIG.BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                ...getAuthHeaders() // Add Auth Token
            },
            body: formData,
        });

        if (response.status === 401 || response.status === 403) {
            throw new Error('Unauthorized: Please login first.');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: data.status === 'success',
            status: data.status,
            filename: data.filename,
            message: data.message
        };
    } catch (error) {
        console.error('Upload API Error:', error);
        return {
            success: false,
            status: 'error',
            message: error.message || 'Failed to upload document.'
        };
    }
}

/**
 * Get Documents List API
 */
async function getDocuments() {
    try {
        // Use public API endpoint for document listing
        const response = await fetch(`${API_CONFIG.BASE_URL}/public/documents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform public API response format to expected format
        const documents = data.documents.map(doc => {
            // Robust date parsing
            let timestamp = Date.now() / 1000;
            if (doc.created_at) {
                const d = new Date(doc.created_at);
                if (!isNaN(d.getTime())) {
                    timestamp = d.getTime() / 1000;
                }
            }

            return {
                id: doc.id,
                filename: doc.title || 'Untitled',
                size: doc.file_size || 0,
                uploadDate: timestamp,
                category: doc.category || 'General',
                status: 'Indexed',
                visibility: doc.visibility || 'public'
            };
        });

        return {
            success: true,
            documents: documents
        };
    } catch (error) {
        console.error('Documents API Error:', error);
        return {
            success: false,
            documents: [],
            error: 'Failed to fetch documents list.'
        };
    }
}

/**
 * Get System Stats API (using public endpoint)
 */
async function getStats() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/public/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform backend response to expected frontend format
        // by_source_type contains: chromadb_sync, upload, etc. (source types, not file types)
        const sourceTypes = data.by_source_type || {};
        const totalDocs = data.total_documents || 0;

        // Count PDFs vs other files (most synced docs are from PDFs)
        const uploadCount = sourceTypes.upload || 0;
        const syncedCount = sourceTypes.chromadb_sync || 0;

        return {
            success: true,
            data: {
                totalDocuments: totalDocs,
                totalCategories: data.total_categories || 0,
                totalSizeFormatted: data.total_size_formatted || '0 KB',
                pdfCount: totalDocs, // Most documents are from PDFs
                otherCount: 0,
                chatQueries: 0, // Not tracked by backend yet
                kbStatus: 'Online',
                avgResponseTime: 245 // Placeholder
            }
        };
    } catch (error) {
        console.error('Stats API Error:', error);
        return {
            success: false,
            error: 'Failed to fetch stats.'
        };
    }
}

/**
 * Text to Speech API
 */
async function textToSpeech(text) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/tts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check content type - if JSON, it's an error response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'TTS service error');
        }

        // Return audio blob
        const audioBlob = await response.blob();

        // Check if blob is valid (not empty)
        if (!audioBlob || audioBlob.size === 0) {
            throw new Error('Received empty audio response');
        }

        return {
            success: true,
            audioBlob,
            audioUrl: URL.createObjectURL(audioBlob)
        };
    } catch (error) {
        console.error('TTS API Error:', error);
        return {
            success: false,
            error: error.message || 'Text-to-speech service unavailable.'
        };
    }
}

/**
 * Play audio response with fallback to browser TTS
 */
async function playAudioResponse(text) {
    try {
        const result = await textToSpeech(text);
        if (result.success && result.audioUrl) {
            const audio = new Audio(result.audioUrl);

            // Add error handler for audio playback
            audio.onerror = (e) => {
                console.warn('Audio playback failed, falling back to browser TTS');
                useBrowserTTS(text);
            };

            await audio.play();
            return true;
        } else {
            // Fallback to browser TTS
            console.warn('TTS API unavailable, using browser speech synthesis');
            useBrowserTTS(text);
            return true;
        }
    } catch (error) {
        console.warn('Audio playback error, using browser TTS:', error);
        useBrowserTTS(text);
        return false;
    }
}

/**
 * Browser TTS fallback
 */
function useBrowserTTS(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

/**
 * Check backend health
 */
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/`, {
            method: 'GET',
            timeout: 5000
        });

        if (response.ok) {
            const data = await response.json();
            return {
                online: true,
                status: data.status
            };
        }
        return { online: false };
    } catch (error) {
        return { online: false };
    }
}

/**
 * Mock Response Generator (Fallback when backend is offline)
 */
function getMockResponse(input) {
    input = input.toLowerCase();

    // Scholarship queries
    if (input.includes('scholarship')) {
        return {
            success: true,
            answer: "MoTA offers several scholarships for ST students:\n\n• Pre-Matric Scholarship: For classes 9-10, up to ₹225/month\n• Post-Matric Scholarship: For classes 11+, up to ₹1,200/month\n• National Fellowship: For M.Phil/Ph.D, ₹25,000-31,000/month\n• Top Class Education: Full scholarship at premier institutions\n\nWould you like details on eligibility or application process?",
            confidence: 94,
            scheme: "Scholarships",
            isMock: true
        };
    }

    // EMRS queries
    if (input.includes('emrs') || input.includes('eklavya') || input.includes('admission')) {
        return {
            success: true,
            answer: "EMRS (Eklavya Model Residential Schools) provide quality education for ST students:\n\n• Eligibility: ST students from Class 6 to Class 12\n• Selection: Through entrance test conducted by states\n• Facilities: Free education, boarding, uniforms, books\n• Current Status: 740+ schools operational across India\n\nAdmission process varies by state. Would you like state-specific information?",
            confidence: 91,
            scheme: "EMRS",
            isMock: true
        };
    }

    // Van Dhan queries
    if (input.includes('van dhan') || input.includes('vikas') || input.includes('livelihood')) {
        return {
            success: true,
            answer: "Van Dhan Vikas Program empowers tribal communities:\n\n• Objective: Promote tribal entrepreneurship through MFP value addition\n• Structure: Van Dhan Vikas Kendras (VDVKs) with 300 members each\n• Support: ₹15 Lakh per VDVK for infrastructure & working capital\n• Products: Honey, mahua, tamarind, lac, bamboo crafts, etc.\n• Status: 3,000+ VDVKs benefiting 10+ Lakh tribal gatherers\n\nInterested in setting up a VDVK in your area?",
            confidence: 89,
            scheme: "VDVK",
            isMock: true
        };
    }

    // PM-JANMAN
    if (input.includes('pm-janman') || input.includes('janman') || input.includes('pvtg')) {
        return {
            success: true,
            answer: "PM-JANMAN (Pradhan Mantri Janjati Adivasi Nyaya Maha Abhiyan):\n\n• Budget: ₹24,000 Crore for holistic development\n• Focus: 75 PVTG (Particularly Vulnerable Tribal Groups) communities\n• Coverage: 22,000+ villages across 18 States/UTs\n• Key Areas: Housing, roads, healthcare, education, livelihood\n\nThis is a transformative initiative for the most vulnerable tribal communities.",
            confidence: 96,
            scheme: "PM-JANMAN",
            isMock: true
        };
    }

    // Greeting
    if (input.includes('hello') || input.includes('hi') || input.includes('namaste')) {
        return {
            success: true,
            answer: "Namaste! 🙏 I am Tribot, your assistant for tribal welfare information.\n\nI can help you with:\n• Scholarship schemes and applications\n• EMRS school admissions\n• Livelihood programs (Van Dhan, SHGs)\n• PM-JANMAN initiatives\n• Forest Rights Act queries\n• ST Certificate procedures\n\nHow may I assist you today?",
            confidence: 100,
            isMock: true
        };
    }

    // Default response
    return {
        success: true,
        answer: "I can help you with information about:\n\n• Scholarships: Pre-matric, Post-matric, Fellowships\n• Education: EMRS, Top Class Education Scheme\n• Livelihood: Van Dhan Vikas, Tribal Cooperatives\n• Welfare: PM-JANMAN, Forest Rights Act\n• Documentation: ST Certificate procedures\n\nPlease ask a specific question about any of these topics!",
        confidence: 85,
        isMock: true
    };
}

/**
 * Delete Document API
 */
async function deleteDocument(docId) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/public/documents/${docId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            message: data.message || 'Document deleted successfully'
        };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Start Web Crawler
 */
async function startCrawler() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/start-crawler`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            message: data.message
        };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Stop Web Crawler
 */
async function stopCrawler() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/stop-crawler`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            message: data.message
        };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Start Web Crawler with specific URL
 */
async function startCrawlerWithUrl(url, max_depth = 2) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/start-crawler`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ url: url, max_depth: max_depth })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: true,
            message: data.message
        };
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get Crawler Logs
 */
async function getCrawlerLogs(limit = 100) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/crawler-logs?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { status: "error", error: error.message, logs: [], is_running: false };
    }
}


/**
 * Get Document View URL (for PDF preview)
 */
function getDocumentViewUrl(docId) {
    return `${API_CONFIG.BASE_URL}/public/documents/${docId}/view`;
}

/**
 * Get Document Download URL
 */
function getDocumentDownloadUrl(docId) {
    return `${API_CONFIG.BASE_URL}/public/documents/${docId}/download`;
}

// Export for use in other scripts
window.MoTAAPI = {
    sendChatMessage,
    uploadDocument,
    getDocuments,
    getStats,
    deleteDocument,           // ✅ Added delete function
    startCrawler,             // Added startCrawler function
    startCrawlerWithUrl,      // Added specific URL start function  
    stopCrawler,              // Added stopCrawler function
    getCrawlerLogs,           // Added getCrawlerLogs function
    getDocumentViewUrl,       // ✅ Added view URL helper
    getDocumentDownloadUrl,   // ✅ Added download URL helper
    textToSpeech,
    playAudioResponse,
    checkBackendHealth,
    getMockResponse,
    config: API_CONFIG
};
