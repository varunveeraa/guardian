// Safety Shield Popup Script
class SafetyShieldPopup {
    constructor() {
        this.currentTab = null;
        this.isGmail = false;
        this.emailContent = null;
        
        this.init();
    }
    
    async init() {
        // Get current tab information
        await this.getCurrentTab();
        
        // Check if we're on Gmail
        this.checkGmailContext();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update the popup view based on context
        this.updatePopupView();
    }
    
    async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tab;
        } catch (error) {
            console.error('Error getting current tab:', error);
        }
    }
    
    checkGmailContext() {
        if (!this.currentTab) return;
        
        const url = this.currentTab.url;
        this.isGmail = url.includes('mail.google.com') || url.includes('gmail.com');
        
        console.log('Gmail context:', this.isGmail, 'URL:', url);
    }
    
    setupEventListeners() {
        // Test warning button
        const testWarningBtn = document.getElementById('test-warning-btn');
        if (testWarningBtn) {
            testWarningBtn.addEventListener('click', () => {
                this.showTestWarning();
            });
        }
    }
    
    async updatePopupView() {
        const normalView = document.getElementById('normal-view');
        const gmailView = document.getElementById('gmail-view');
        
        if (this.isGmail) {
            // Show Gmail view and load email content
            normalView.classList.add('hidden');
            gmailView.classList.remove('hidden');
            
            await this.loadEmailContent();
        } else {
            // Show normal view
            normalView.classList.remove('hidden');
            gmailView.classList.add('hidden');
            
            this.updateSiteStatus();
        }
    }
    
    updateSiteStatus() {
        const statusMessage = document.getElementById('status-message');
        const statusIcon = document.getElementById('status-icon');
        
        if (!this.currentTab) return;
        
        // For now, we'll show a basic safe status
        // In future iterations, this will check against real threat databases
        const isHttps = this.currentTab.url.startsWith('https://');
        
        if (isHttps) {
            statusMessage.innerHTML = '<p>This website appears to be safe and secure! 🔒</p>';
            statusMessage.className = 'status-message status-safe';
            statusIcon.textContent = '🛡️';
            statusIcon.style.background = '#e8f5e8';
        } else {
            statusMessage.innerHTML = '<p>⚠️ This website is not using a secure connection.</p>';
            statusMessage.className = 'status-message status-warning';
            statusIcon.textContent = '⚠️';
            statusIcon.style.background = '#fff3cd';
        }
    }
    
    async loadEmailContent() {
        const emailContentDiv = document.getElementById('email-content');
        const emailSafety = document.getElementById('email-safety');

        console.log('Loading email content for tab:', this.currentTab.id);

        try {
            // Add a small delay to ensure content scripts are loaded
            await new Promise(resolve => setTimeout(resolve, 500));

            // First, test if the Gmail content script is responding
            console.log('Testing Gmail content script connection...');
            const pingResponse = await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'ping'
            });

            console.log('Ping response:', pingResponse);

            if (!pingResponse || !pingResponse.success) {
                throw new Error('Gmail content script not responding');
            }

            // Now request the email content
            console.log('Requesting email content...');
            const response = await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'getEmailContent'
            });

            console.log('Gmail content script response:', response);

            if (response && response.success && response.content) {
                this.emailContent = response.content;
                this.displayEmailContent(response.content);
                this.analyzeEmailSafety(response.content);
            } else {
                console.log('No valid email content received:', response);
                emailContentDiv.innerHTML = '<div class="loading">No email content found. Please open an email in Gmail and try again.</div>';
            }
        } catch (error) {
            console.error('Error loading email content:', error);

            // Try to provide more specific error messages
            if (error.message && error.message.includes('Could not establish connection')) {
                emailContentDiv.innerHTML = '<div class="loading">Gmail content script not loaded. Please refresh the Gmail page and try again.</div>';
            } else if (error.message && error.message.includes('not responding')) {
                emailContentDiv.innerHTML = '<div class="loading">Cannot connect to Gmail content script. Please refresh the Gmail page and try again.</div>';
            } else {
                emailContentDiv.innerHTML = '<div class="loading">Unable to read email content. Please make sure you have an email open and try refreshing the page.</div>';
            }
        }
    }
    
    displayEmailContent(content) {
        const emailContentDiv = document.getElementById('email-content');
        
        if (content.subject || content.body || content.sender) {
            let html = '';
            
            if (content.sender) {
                html += `<div style="margin-bottom: 10px;"><strong>From:</strong> ${this.escapeHtml(content.sender)}</div>`;
            }
            
            if (content.subject) {
                html += `<div style="margin-bottom: 10px;"><strong>Subject:</strong> ${this.escapeHtml(content.subject)}</div>`;
            }
            
            if (content.body) {
                html += `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">`;
                html += `<strong>Message:</strong><br><br>`;
                html += this.escapeHtml(content.body.substring(0, 500));
                if (content.body.length > 500) {
                    html += '...';
                }
                html += `</div>`;
            }
            
            emailContentDiv.innerHTML = html;
        } else {
            emailContentDiv.innerHTML = '<div class="loading">Email content is empty or could not be read.</div>';
        }
    }
    
    analyzeEmailSafety(content) {
        const emailSafety = document.getElementById('email-safety');
        
        // Basic safety analysis (will be enhanced in future iterations)
        const suspiciousWords = ['urgent', 'verify account', 'click here', 'suspended', 'winner', 'congratulations', 'prize'];
        const text = (content.subject + ' ' + content.body).toLowerCase();
        
        let isSuspicious = false;
        for (const word of suspiciousWords) {
            if (text.includes(word)) {
                isSuspicious = true;
                break;
            }
        }
        
        if (isSuspicious) {
            emailSafety.innerHTML = `
                <span class="safety-icon">⚠️</span>
                <span>Be cautious - this email contains suspicious phrases</span>
            `;
            emailSafety.style.background = '#fff3cd';
            emailSafety.style.color = '#856404';
        } else {
            emailSafety.innerHTML = `
                <span class="safety-icon">✅</span>
                <span>This email looks safe</span>
            `;
            emailSafety.style.background = '#d4edda';
            emailSafety.style.color = '#155724';
        }
    }
    
    async showTestWarning() {
        try {
            // Send message to content script to show warning overlay
            await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'showTestWarning'
            });
            
            // Close the popup after showing warning
            window.close();
        } catch (error) {
            console.error('Error showing test warning:', error);
            alert('Unable to show warning overlay. Please refresh the page and try again.');
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SafetyShieldPopup();
});
