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

            await this.updateSiteStatus();
        }
    }
    
    async updateSiteStatus() {
        const statusMessage = document.getElementById('status-message');
        const statusIcon = document.getElementById('status-icon');

        if (!this.currentTab) return;

        try {
            // Get safety information from storage
            const key = `safety_${this.currentTab.id}`;
            const result = await chrome.storage.local.get([key]);
            const safetyInfo = result[key];

            if (safetyInfo && safetyInfo.apiResponse) {
                this.displayApiSafetyInfo(safetyInfo, statusMessage, statusIcon);
            } else {
                // Fallback to basic check while API data loads
                this.displayBasicSafetyInfo(statusMessage, statusIcon);

                // Try to get fresh data
                setTimeout(async () => {
                    const freshResult = await chrome.storage.local.get([key]);
                    const freshSafetyInfo = freshResult[key];
                    if (freshSafetyInfo && freshSafetyInfo.apiResponse) {
                        this.displayApiSafetyInfo(freshSafetyInfo, statusMessage, statusIcon);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error getting safety info:', error);
            this.displayBasicSafetyInfo(statusMessage, statusIcon);
        }
    }

    displayApiSafetyInfo(safetyInfo, statusMessage, statusIcon) {
        const apiResponse = safetyInfo.apiResponse;
        const safetyLevel = safetyInfo.safetyLevel;
        const riskScore = apiResponse.risk_blended !== undefined ? apiResponse.risk_blended : apiResponse.risk;
        const riskPercentage = (riskScore * 100).toFixed(1);

        let message = '';
        let iconText = '';
        let bgColor = '';
        let className = '';

        switch (safetyLevel) {
            case 'safe':
                message = `<p><strong>✅ Safe Website</strong></p>
                          <p>Risk Score: ${riskPercentage}% (Low Risk)</p>`;
                if (apiResponse.official) {
                    message += `<p>🏛️ Official/Trusted Website</p>`;
                }
                if (apiResponse.reasons && apiResponse.reasons.length > 0) {
                    message += `<p><em>${apiResponse.reasons[0]}</em></p>`;
                }
                iconText = '✅';
                bgColor = '#e8f5e8';
                className = 'status-message status-safe';
                break;

            case 'warning':
                message = `<p><strong>⚠️ Caution Advised</strong></p>
                          <p>Risk Score: ${riskPercentage}% (Medium Risk)</p>
                          <p>Please be careful on this website.</p>`;
                iconText = '⚠️';
                bgColor = '#fff3cd';
                className = 'status-message status-warning';
                break;

            case 'danger':
                message = `<p><strong>🚨 High Risk Website</strong></p>
                          <p>Risk Score: ${riskPercentage}% (High Risk)</p>
                          <p>This website may be dangerous!</p>`;
                iconText = '🚨';
                bgColor = '#f8d7da';
                className = 'status-message status-danger';
                break;

            default:
                message = `<p>Risk Score: ${riskPercentage}%</p>`;
                iconText = '🛡️';
                bgColor = '#f8f9fa';
                className = 'status-message';
        }

        statusMessage.innerHTML = message;
        statusMessage.className = className;
        statusIcon.textContent = iconText;
        statusIcon.style.background = bgColor;

        // Update the safety details section
        this.updateSafetyDetails(safetyInfo);
    }

    displayBasicSafetyInfo(statusMessage, statusIcon) {
        const isHttps = this.currentTab.url.startsWith('https://');

        if (isHttps) {
            statusMessage.innerHTML = '<p>🔍 Checking website safety...</p><p><small>Connecting to security API...</small></p>';
            statusMessage.className = 'status-message';
            statusIcon.textContent = '🔍';
            statusIcon.style.background = '#f8f9fa';
        } else {
            statusMessage.innerHTML = '<p>⚠️ This website is not using a secure connection.</p>';
            statusMessage.className = 'status-message status-warning';
            statusIcon.textContent = '⚠️';
            statusIcon.style.background = '#fff3cd';
        }
    }

    updateSafetyDetails(safetyInfo) {
        const safetyDetails = document.getElementById('safety-details');
        if (!safetyDetails) return;

        const apiResponse = safetyInfo.apiResponse;
        const safetyLevel = safetyInfo.safetyLevel;

        let detailsHtml = '';

        switch (safetyLevel) {
            case 'safe':
                detailsHtml = `
                    <p class="small-text">
                        ✅ <strong>This website is safe to browse.</strong><br>
                        Our security analysis found no threats or suspicious activity.
                    </p>
                `;
                break;

            case 'warning':
                detailsHtml = `
                    <p class="small-text">
                        ⚠️ <strong>Exercise caution on this website.</strong><br>
                        Be careful with personal information and verify any requests.
                    </p>
                `;
                break;

            case 'danger':
                detailsHtml = `
                    <p class="small-text">
                        🚨 <strong>This website may be dangerous.</strong><br>
                        We recommend avoiding this site or proceeding with extreme caution.
                    </p>
                `;
                break;

            default:
                detailsHtml = `
                    <p class="small-text">
                        🔍 <strong>Website analysis in progress...</strong><br>
                        Please wait while we check this site's safety.
                    </p>
                `;
        }

        safetyDetails.innerHTML = detailsHtml;
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
                this.analyzeEmailSafety(response.content);
            } else {
                console.log('No valid email content received:', response);
                const emailSafety = document.getElementById('email-safety');
                emailSafety.innerHTML = `
                    <span class="safety-icon">❌</span>
                    <span>No email content found. Please open an email in Gmail and try again.</span>
                `;
                emailSafety.style.background = '#f8d7da';
                emailSafety.style.color = '#721c24';
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

    async analyzeEmailSafety(content) {
        const emailSafety = document.getElementById('email-safety');

        // Show loading state
        emailSafety.innerHTML = `
            <span class="safety-icon">🔍</span>
            <span>Analyzing email safety...</span>
        `;
        emailSafety.style.background = '#f8f9fa';
        emailSafety.style.color = '#6c757d';

        try {
            // Call the email safety API
            const apiResponse = await this.callEmailSafetyAPI(content);
            this.displayEmailSafetyResult(apiResponse);
        } catch (error) {
            console.error('Error analyzing email safety:', error);
            // Fallback to basic analysis
            this.displayBasicEmailSafety(content);
        }
    }

    async callEmailSafetyAPI(content) {
        const apiUrl = 'https://html-detect-754322588434.australia-southeast1.run.app/message/check';

        // Extract just the email address from sender (remove display name)
        const senderEmail = this.extractEmailAddress(content.sender || '');

        // Prepare the payload according to the API specification
        const payload = {
            content: content.body || '',
            urls: content.urls || [],
            headers: {
                From: senderEmail
            }
        };

        console.log('Sending email data to API:', payload);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Email safety API response:', result);
        return result;
    }

    displayEmailSafetyResult(apiResponse) {
        const emailSafety = document.getElementById('email-safety');

        // Use overall_risk for email decisions as specified
        const riskScore = apiResponse.overall_risk || 0;
        const riskPercentage = (riskScore * 100).toFixed(1);

        // Apply the specified thresholds: <0.20 = Safe, 0.20–0.60 = Caution, ≥0.60 = High risk
        let safetyLevel, icon, message, bgColor, textColor;

        if (apiResponse.official) {
            // If official, hide risk and set as safe
            safetyLevel = 'safe';
            icon = '✅';
            message = 'This email is from an official/trusted source';
            bgColor = '#d4edda';
            textColor = '#155724';
        } else if (riskScore < 0.20) {
            safetyLevel = 'safe';
            icon = '✅';
            message = `This email looks safe (Risk: ${riskPercentage}%)`;
            bgColor = '#d4edda';
            textColor = '#155724';
        } else if (riskScore < 0.60) {
            safetyLevel = 'caution';
            icon = '⚠️';
            message = `Be cautious with this email (Risk: ${riskPercentage}%)`;
            bgColor = '#fff3cd';
            textColor = '#856404';
        } else {
            safetyLevel = 'danger';
            icon = '🚨';
            message = `HIGH RISK EMAIL - Be very careful! (Risk: ${riskPercentage}%)`;
            bgColor = '#f8d7da';
            textColor = '#721c24';
        }

        // Update the popup safety indicator
        emailSafety.innerHTML = `
            <span class="safety-icon">${icon}</span>
            <span>${message}</span>
        `;
        emailSafety.style.background = bgColor;
        emailSafety.style.color = textColor;

        // Store the API response for potential detailed view
        this.emailSafetyResponse = apiResponse;

        // Add click handler for detailed information
        emailSafety.classList.add('clickable');
        emailSafety.title = 'Click for detailed safety information';
        emailSafety.onclick = () => this.showDetailedEmailSafety(apiResponse);

        // Create prominent side notification
        this.showSideNotification(safetyLevel, icon, message, apiResponse);
    }

    async showSideNotification(safetyLevel, icon, message, apiResponse) {
        try {
            // Send message to content script to show side notification
            await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'showEmailSafetyNotification',
                safetyLevel: safetyLevel,
                icon: icon,
                message: message,
                apiResponse: apiResponse
            });

            console.log('Side notification sent to content script');
        } catch (error) {
            console.error('Error showing side notification:', error);
        }
    }

    displayBasicEmailSafety(content) {
        const emailSafety = document.getElementById('email-safety');

        // Fallback to basic keyword analysis if API fails
        const suspiciousWords = ['urgent', 'verify account', 'click here', 'suspended', 'winner', 'congratulations', 'prize', 'act now', 'limited time'];
        const text = (content.subject + ' ' + content.body).toLowerCase();

        let isSuspicious = false;
        for (const word of suspiciousWords) {
            if (text.includes(word)) {
                isSuspicious = true;
                break;
            }
        }

        let safetyLevel, icon, message;

        if (isSuspicious) {
            safetyLevel = 'caution';
            icon = '⚠️';
            message = 'Be cautious - this email contains suspicious phrases';
            emailSafety.innerHTML = `
                <span class="safety-icon">${icon}</span>
                <span>${message}</span>
            `;
            emailSafety.style.background = '#fff3cd';
            emailSafety.style.color = '#856404';
        } else {
            safetyLevel = 'safe';
            icon = '✅';
            message = 'This email looks safe (basic analysis)';
            emailSafety.innerHTML = `
                <span class="safety-icon">${icon}</span>
                <span>${message}</span>
            `;
            emailSafety.style.background = '#d4edda';
            emailSafety.style.color = '#155724';
        }

        // Show side notification for basic analysis too
        this.showSideNotification(safetyLevel, icon, message, { basic_analysis: true });
    }

    showDetailedEmailSafety(apiResponse) {
        const riskScore = apiResponse.overall_risk || 0;
        const senderScore = apiResponse.sender?.score || 0;
        const contentScore = apiResponse.content?.score || 0;

        let details = `📧 Email Safety Analysis\n\n`;
        details += `Overall Risk: ${(riskScore * 100).toFixed(1)}%\n`;
        details += `Sender Risk: ${(senderScore * 100).toFixed(1)}%\n`;
        details += `Content Risk: ${(contentScore * 100).toFixed(1)}%\n\n`;

        if (apiResponse.official) {
            details += `✅ Official/Trusted Source: Yes\n\n`;
        }

        if (apiResponse.reasons && apiResponse.reasons.length > 0) {
            details += `Risk Factors:\n`;
            apiResponse.reasons.forEach(reason => {
                details += `• ${reason}\n`;
            });
        }

        details += `\n💡 Safety Thresholds:\n`;
        details += `• Safe: < 20%\n`;
        details += `• Caution: 20% - 60%\n`;
        details += `• High Risk: ≥ 60%`;

        alert(details);
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

    extractEmailAddress(senderString) {
        if (!senderString) return '';

        // Handle different sender formats:
        // "Name <email@domain.com>" -> "email@domain.com"
        // "email@domain.com" -> "email@domain.com"
        // "Name email@domain.com" -> "email@domain.com"

        // First try to extract from angle brackets
        const angleMatch = senderString.match(/<([^>]+@[^>]+)>/);
        if (angleMatch) {
            return angleMatch[1].trim();
        }

        // Then try to find any email pattern in the string
        const emailMatch = senderString.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
            return emailMatch[1].trim();
        }

        // If no email found, return empty string
        return '';
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
