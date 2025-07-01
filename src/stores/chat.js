import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useJobsStore } from './jobs';
export const useChatStore = defineStore('chat', () => {
    const messages = ref([]);
    const isTyping = ref(false);
    const isListening = ref(false);
    const isProcessingVoice = ref(false);
    const isProcessingImage = ref(false);
    const integrations = ref([]);
    const voiceEnabled = ref(false);
    let mediaRecorder = null;
    let audioChunks = [];
    let recognition = null;
    // Initialize speech recognition
    const initSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    processUserQuery(finalTranscript, 'voice');
                }
            };
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                isListening.value = false;
            };
            recognition.onend = () => {
                isListening.value = false;
            };
            voiceEnabled.value = true;
        }
    };
    const addMessage = (content, isUser, type = 'text', metadata) => {
        const message = {
            id: Date.now().toString(),
            content,
            isUser,
            timestamp: new Date().toISOString(),
            type,
            ...metadata
        };
        messages.value.push(message);
        // Send to integrations if it's a system message
        if (!isUser && shouldTriggerIntegration(message)) {
            sendToIntegrations(message);
        }
    };
    const processUserQuery = async (query, inputType = 'text') => {
        addMessage(query, true, inputType);
        isTyping.value = true;
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        const response = generateAIResponse(query);
        addMessage(response.content, false, 'text', { jobReferences: response.jobReferences });
        isTyping.value = false;
    };
    const startVoiceRecording = async () => {
        if (!voiceEnabled.value)
            return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                await processVoiceMessage(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
            isProcessingVoice.value = true;
        }
        catch (error) {
            console.error('Error starting voice recording:', error);
        }
    };
    const stopVoiceRecording = () => {
        if (mediaRecorder && isProcessingVoice.value) {
            mediaRecorder.stop();
            isProcessingVoice.value = false;
        }
    };
    const startVoiceListening = () => {
        if (recognition && voiceEnabled.value) {
            isListening.value = true;
            recognition.start();
        }
    };
    const stopVoiceListening = () => {
        if (recognition && isListening.value) {
            recognition.stop();
            isListening.value = false;
        }
    };
    const processVoiceMessage = async (audioBlob) => {
        isProcessingVoice.value = true;
        try {
            // Simulate speech-to-text processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockTranscriptions = [
                "What's the status of job 2024-001?",
                "Show me all urgent jobs",
                "Which machines are currently running?",
                "Any quality issues today?",
                "When is the next delivery due?"
            ];
            const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
            const audioUrl = URL.createObjectURL(audioBlob);
            addMessage(transcription, true, 'voice', {
                audioUrl,
                voiceTranscription: transcription,
                confidence: 0.85 + Math.random() * 0.15
            });
            // Process the transcribed query
            await processUserQuery(transcription, 'voice');
        }
        catch (error) {
            console.error('Error processing voice message:', error);
        }
        finally {
            isProcessingVoice.value = false;
        }
    };
    const processImageForPartLookup = async (imageFile) => {
        isProcessingImage.value = true;
        try {
            // Simulate image processing delay
            await new Promise(resolve => setTimeout(resolve, 3000));
            // Mock part matches based on image analysis
            const mockMatches = [
                {
                    partNumber: 'PN-12345',
                    partName: 'Hydraulic Cylinder Housing',
                    similarity: 0.94,
                    imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
                    currentJobs: ['J2024-001'],
                    lastUsed: '2024-01-12',
                    material: 'Aluminum 6061',
                    dimensions: { length: 150, width: 100, height: 75 }
                },
                {
                    partNumber: 'PN-67890',
                    partName: 'Cylinder Housing Variant',
                    similarity: 0.87,
                    imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
                    currentJobs: [],
                    lastUsed: '2024-01-08',
                    material: 'Aluminum 6061',
                    dimensions: { length: 155, width: 105, height: 80 }
                },
                {
                    partNumber: 'PN-11111',
                    partName: 'Similar Housing Design',
                    similarity: 0.76,
                    imageUrl: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg',
                    currentJobs: ['J2024-003'],
                    lastUsed: '2024-01-10',
                    material: 'Steel 4140',
                    dimensions: { length: 145, width: 95, height: 70 }
                }
            ];
            const imageUrl = URL.createObjectURL(imageFile);
            const analysisText = `Found ${mockMatches.length} similar parts with ${Math.round(mockMatches[0].similarity * 100)}% confidence match.`;
            addMessage(analysisText, true, 'image', {
                imageUrl,
                partMatches: mockMatches
            });
            // Generate AI response about the parts
            const response = `I found ${mockMatches.length} similar parts in our system:\n\n` +
                mockMatches.map(match => `**${match.partNumber}** (${Math.round(match.similarity * 100)}% match)\n` +
                    `• ${match.partName}\n` +
                    `• Material: ${match.material}\n` +
                    `• Current Jobs: ${(match.currentJobs?.length ?? 0) > 0 ? (match.currentJobs ?? []).join(', ') : 'None'}\n` +
                    `• Last Used: ${match.lastUsed}`).join('\n\n');
            addMessage(response, false, 'part-lookup', { partMatches: mockMatches });
            return mockMatches;
        }
        catch (error) {
            console.error('Error processing image:', error);
            return [];
        }
        finally {
            isProcessingImage.value = false;
        }
    };
    const generateAIResponse = (query) => {
        const jobsStore = useJobsStore();
        const lowerQuery = query.toLowerCase();
        // Enhanced responses with voice-friendly formatting
        if (lowerQuery.includes('status') || lowerQuery.includes('how is') || lowerQuery.includes('what\'s the status')) {
            if (lowerQuery.includes('j2024-001') || lowerQuery.includes('hydraulic')) {
                return {
                    content: "Job J2024-001, the Hydraulic Cylinder Housing, is currently running on CNC-001 with John Smith as the operator. We've completed 35 out of 50 parts, that's 70% complete. The job is on track for the January 15th due date with 28 hours logged against an estimated 40 hours.",
                    jobReferences: ['1']
                };
            }
            return {
                content: `Here's our current job status overview: We have ${jobsStore.jobsByStatus.running} jobs running, ${jobsStore.jobsByStatus.setup} in setup, ${jobsStore.jobsByStatus['on-hold']} on hold, ${jobsStore.jobsByStatus.pending} pending, and ${jobsStore.jobsByStatus.completed} completed jobs. Would you like details on any specific job?`
            };
        }
        // Voice-optimized responses for common queries
        if (lowerQuery.includes('machine') || lowerQuery.includes('cnc')) {
            return {
                content: "Current machine status: CNC-001 is running the Hydraulic Cylinder Housing with John Smith. CNC-002 is in setup for the Gear Assembly with Sarah Johnson. CNC-003 is available for the next job. All machines are operational with no maintenance issues reported."
            };
        }
        if (lowerQuery.includes('urgent') || lowerQuery.includes('priority')) {
            return {
                content: "We have one urgent job currently on hold: Job J2024-004, the Valve Body for Fluid Dynamics Company. It's experiencing a material quality issue and we're waiting for replacement material. The job was 27% complete before being put on hold."
            };
        }
        // Default response
        return {
            content: "I understand you're asking about shop operations. I can help with job status, machine assignments, due dates, operator schedules, or any other manufacturing questions. You can ask me using voice or text, and even show me photos of parts for identification."
        };
    };
    const shouldTriggerIntegration = (message) => {
        // Check if message contains urgent keywords or job references
        const urgentKeywords = ['urgent', 'critical', 'down', 'issue', 'problem', 'alert'];
        return urgentKeywords.some(keyword => message.content.toLowerCase().includes(keyword));
    };
    const sendToIntegrations = async (message) => {
        const activeIntegrations = integrations.value.filter(i => i.enabled);
        for (const integration of activeIntegrations) {
            try {
                await sendToIntegration(integration, message);
            }
            catch (error) {
                console.error(`Failed to send to ${integration.name}:`, error);
            }
        }
    };
    const sendToIntegration = async (integration, message) => {
        const payload = {
            text: `🏭 JobLine.ai Alert: ${message.content}`,
            timestamp: message.timestamp,
            source: 'JobLine.ai Chat Assistant'
        };
        switch (integration.type) {
            case 'slack':
                if (integration.config.webhookUrl) {
                    await fetch(integration.config.webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                }
                break;
            case 'teams':
                if (integration.config.webhookUrl) {
                    const teamsPayload = {
                        "@type": "MessageCard",
                        "@context": "http://schema.org/extensions",
                        "summary": "JobLine.ai Alert",
                        "themeColor": "0076D7",
                        "sections": [{
                                "activityTitle": "JobLine.ai Manufacturing Alert",
                                "activitySubtitle": new Date(message.timestamp).toLocaleString(),
                                "text": message.content
                            }]
                    };
                    await fetch(integration.config.webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(teamsPayload)
                    });
                }
                break;
            case 'webhook':
                if (integration.config.webhookUrl) {
                    await fetch(integration.config.webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                }
                break;
        }
    };
    const addIntegration = async (integration) => {
        const newIntegration = {
            ...integration,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        integrations.value.push(newIntegration);
    };
    const testIntegration = async (integrationId) => {
        const integration = integrations.value.find(i => i.id === integrationId);
        if (!integration)
            return false;
        try {
            const testMessage = {
                id: 'test',
                content: 'Test message from JobLine.ai - Integration is working correctly!',
                isUser: false,
                timestamp: new Date().toISOString(),
                type: 'text'
            };
            await sendToIntegration(integration, testMessage);
            return true;
        }
        catch (error) {
            console.error('Integration test failed:', error);
            return false;
        }
    };
    const clearChat = () => {
        messages.value = [];
    };
    // Initialize speech recognition on store creation
    initSpeechRecognition();
    return {
        messages,
        isTyping,
        isListening,
        isProcessingVoice,
        isProcessingImage,
        integrations,
        voiceEnabled,
        addMessage,
        processUserQuery,
        startVoiceRecording,
        stopVoiceRecording,
        startVoiceListening,
        stopVoiceListening,
        processImageForPartLookup,
        addIntegration,
        testIntegration,
        clearChat
    };
});
