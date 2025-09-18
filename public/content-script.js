// Safety Shield Content Script
class SafetyShieldContent {
    constructor() {
        this.warningOverlay = null;
        this.isWarningShown = false;
        this.safetyIndicator = null;
        this.currentSafetyLevel = null;
        this.currentApiResponse = null;

        this.init();
    }
    
    init() {
        // Listen for messages from popup and background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });

        // Create the safety indicator overlay
        this.createSafetyIndicator();

        console.log('Safety Shield content script loaded');
    }
    
    handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'showTestWarning':
                this.showWarningOverlay();
                sendResponse({ success: true });
                break;

            case 'hideWarning':
                this.hideWarningOverlay();
                sendResponse({ success: true });
                break;

            case 'updateSafetyStatus':
                this.updateSafetyStatus(request.safetyLevel, request.apiResponse);
                sendResponse({ success: true });
                break;

            default:
                sendResponse({ success: false, error: 'Unknown action' });
        }
    }
    
    showWarningOverlay() {
        if (this.isWarningShown) {
            return;
        }
        
        // Create overlay container
        this.warningOverlay = document.createElement('div');
        this.warningOverlay.id = 'safety-shield-warning-overlay';
        this.warningOverlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(220, 53, 69, 0.95) !important;
            z-index: 2147483647 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            padding: 20px !important;
            box-sizing: border-box !important;
        `;
        
        // Create warning content
        const warningContent = document.createElement('div');
        warningContent.style.cssText = `
            background: white !important;
            color: #333 !important;
            border-radius: 12px !important;
            padding: 40px !important;
            max-width: 600px !important;
            width: 100% !important;
            text-align: center !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
            border: 4px solid #dc3545 !important;
            box-sizing: border-box !important;
        `;
        
        warningContent.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px; font-size: 18px; color: #6c757d;">
                <span>🛡️</span>
                <span>Safety Shield Protection</span>
            </div>
            
            <div style="font-size: 80px; margin-bottom: 20px;">⚠️</div>
            
            <h1 style="font-size: 32px; font-weight: bold; color: #dc3545; margin-bottom: 20px; margin-top: 0;">
                DANGEROUS WEBSITE BLOCKED
            </h1>
            
            <div style="font-size: 20px; line-height: 1.6; margin-bottom: 30px; color: #333;">
                <p style="margin: 0;">This website has been identified as potentially dangerous and has been blocked for your safety.</p>
            </div>
            
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px;">
                <button id="safety-shield-go-back" style="
                    background: #28a745 !important;
                    color: white !important;
                    border: none !important;
                    padding: 20px 40px !important;
                    font-size: 20px !important;
                    font-weight: bold !important;
                    border-radius: 8px !important;
                    cursor: pointer !important;
                    min-width: 200px !important;
                    transition: background-color 0.2s !important;
                ">
                    ← Go Back to Safety
                </button>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: left;">
                <h3 style="color: #dc3545; margin-bottom: 15px; font-size: 18px; margin-top: 0;">Why was this site blocked?</h3>
                <div id="safety-shield-warning-details">
                    <ul style="margin-left: 20px; margin-bottom: 0;">
                        <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">This website has been identified as potentially dangerous</li>
                        <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">Our security system detected suspicious activity</li>
                        <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">Common threats include phishing, malware, and scam websites</li>
                        <li style="margin-bottom: 0; font-size: 16px; line-height: 1.4;">Your safety is our top priority</li>
                    </ul>
                </div>
            </div>
            
            <div style="padding-top: 20px; border-top: 1px solid #dee2e6;">
                <button id="safety-shield-continue" style="
                    background: #6c757d !important;
                    color: white !important;
                    border: none !important;
                    padding: 12px 24px !important;
                    font-size: 14px !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    transition: background-color 0.2s !important;
                ">
                    Continue Anyway (Not Recommended)
                </button>
            </div>
        `;
        
        this.warningOverlay.appendChild(warningContent);
        
        // Add event listeners
        const goBackBtn = warningContent.querySelector('#safety-shield-go-back');
        const continueBtn = warningContent.querySelector('#safety-shield-continue');
        
        goBackBtn.addEventListener('click', () => {
            this.goBack();
        });
        
        goBackBtn.addEventListener('mouseenter', () => {
            goBackBtn.style.background = '#218838';
        });
        
        goBackBtn.addEventListener('mouseleave', () => {
            goBackBtn.style.background = '#28a745';
        });
        
        continueBtn.addEventListener('click', () => {
            this.continueAnyway();
        });
        
        continueBtn.addEventListener('mouseenter', () => {
            continueBtn.style.background = '#5a6268';
        });
        
        continueBtn.addEventListener('mouseleave', () => {
            continueBtn.style.background = '#6c757d';
        });
        
        // Update warning details with API data if available
        this.updateWarningDetails(warningContent);

        // Add to page
        document.body.appendChild(this.warningOverlay);
        this.isWarningShown = true;

        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';

        console.log('Warning overlay shown');
    }
    
    hideWarningOverlay() {
        if (this.warningOverlay && this.warningOverlay.parentNode) {
            this.warningOverlay.parentNode.removeChild(this.warningOverlay);
            this.warningOverlay = null;
            this.isWarningShown = false;
            
            // Restore scrolling
            document.body.style.overflow = '';
            
            console.log('Warning overlay hidden');
        }
    }
    
    goBack() {
        // Try to go back in history
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // If no history, go to a safe page
            window.location.href = 'about:blank';
        }
        
        this.hideWarningOverlay();
    }
    
    continueAnyway() {
        // For demo purposes, just hide the overlay
        // In a real implementation, this might log the user's choice
        this.hideWarningOverlay();
        
        console.log('User chose to continue anyway');
    }

    updateWarningDetails(warningContent) {
        const detailsDiv = warningContent.querySelector('#safety-shield-warning-details');
        if (!detailsDiv || !this.currentApiResponse) {
            return;
        }

        const riskScore = this.currentApiResponse.risk_blended !== undefined ?
            this.currentApiResponse.risk_blended : this.currentApiResponse.risk;

        let detailsHtml = `
            <div style="margin-bottom: 15px; padding: 10px; background: #fff; border-radius: 6px; border-left: 4px solid #dc3545;">
                <strong>Risk Score:</strong> ${(riskScore * 100).toFixed(1)}% (High Risk)
            </div>
        `;

        if (this.currentApiResponse.reasons && this.currentApiResponse.reasons.length > 0) {
            detailsHtml += `<div style="margin-bottom: 15px;"><strong>Specific Reasons:</strong></div>`;
            detailsHtml += `<ul style="margin-left: 20px; margin-bottom: 15px;">`;
            this.currentApiResponse.reasons.forEach(reason => {
                detailsHtml += `<li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">${reason}</li>`;
            });
            detailsHtml += `</ul>`;
        } else {
            detailsHtml += `
                <ul style="margin-left: 20px; margin-bottom: 0;">
                    <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">High risk score detected by our security analysis</li>
                    <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">This website may contain malicious content or be used for phishing</li>
                    <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">Proceeding could put your personal information at risk</li>
                    <li style="margin-bottom: 0; font-size: 16px; line-height: 1.4;">We recommend going back to safety</li>
                </ul>
            `;
        }

        detailsDiv.innerHTML = detailsHtml;
    }

    createSafetyIndicator() {
        // Create the left-side safety indicator (bigger and more prominent)
        this.safetyIndicator = document.createElement('div');
        this.safetyIndicator.id = 'safety-shield-indicator';
        this.safetyIndicator.style.cssText = `
            position: fixed !important;
            left: 20px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 180px !important;
            height: 80px !important;
            background: #f8f9fa !important;
            border: 3px solid #dee2e6 !important;
            border-radius: 15px !important;
            z-index: 2147483646 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            font-size: 16px !important;
            font-weight: bold !important;
            color: #6c757d !important;
            cursor: pointer !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
            transition: all 0.3s ease !important;
            opacity: 0.95 !important;
            text-align: center !important;
        `;

        this.safetyIndicator.innerHTML = `
            <div id="safety-shield-indicator-icon" style="font-size: 28px; margin-bottom: 4px;">🛡️</div>
            <div id="safety-shield-indicator-text" style="font-size: 14px; font-weight: 600;">Checking...</div>
        `;

        // Add click handler to show more details
        this.safetyIndicator.addEventListener('click', () => {
            this.showSafetyDetails();
        });

        // Add hover effects
        this.safetyIndicator.addEventListener('mouseenter', () => {
            this.safetyIndicator.style.opacity = '1';
            this.safetyIndicator.style.transform = 'translateY(-50%) scale(1.05)';
            this.safetyIndicator.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.2)';
        });

        this.safetyIndicator.addEventListener('mouseleave', () => {
            this.safetyIndicator.style.opacity = '0.95';
            this.safetyIndicator.style.transform = 'translateY(-50%) scale(1)';
            this.safetyIndicator.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        });

        // Add to page
        document.body.appendChild(this.safetyIndicator);

        console.log('Safety indicator created');
    }

    updateSafetyStatus(safetyLevel, apiResponse) {
        this.currentSafetyLevel = safetyLevel;
        this.currentApiResponse = apiResponse;

        if (!this.safetyIndicator) {
            this.createSafetyIndicator();
        }

        const icon = this.safetyIndicator.querySelector('#safety-shield-indicator-icon');
        const text = this.safetyIndicator.querySelector('#safety-shield-indicator-text');

        switch (safetyLevel) {
            case 'safe':
                this.safetyIndicator.style.background = '#d4edda';
                this.safetyIndicator.style.borderColor = '#28a745';
                this.safetyIndicator.style.color = '#155724';
                icon.textContent = '✅';
                text.textContent = 'SAFE';
                break;

            case 'warning':
                this.safetyIndicator.style.background = '#fff3cd';
                this.safetyIndicator.style.borderColor = '#ffc107';
                this.safetyIndicator.style.color = '#856404';
                icon.textContent = '⚠️';
                text.textContent = 'CAUTION';
                break;

            case 'danger':
                this.safetyIndicator.style.background = '#f8d7da';
                this.safetyIndicator.style.borderColor = '#dc3545';
                this.safetyIndicator.style.color = '#721c24';
                icon.textContent = '🚨';
                text.textContent = 'HIGH RISK';

                // Auto-show warning for high risk sites (≥50% risk)
                setTimeout(() => {
                    this.showWarningOverlay();
                }, 1000);
                break;

            default:
                this.safetyIndicator.style.background = '#f8f9fa';
                this.safetyIndicator.style.borderColor = '#dee2e6';
                this.safetyIndicator.style.color = '#6c757d';
                icon.textContent = '🛡️';
                text.textContent = 'CHECKING...';
        }

        console.log('Safety status updated:', safetyLevel, apiResponse);
    }

    showSafetyDetails() {
        if (!this.currentApiResponse) {
            alert('No safety information available for this website.');
            return;
        }

        const riskScore = this.currentApiResponse.risk_blended !== undefined ?
            this.currentApiResponse.risk_blended : this.currentApiResponse.risk;

        let message = `Website Safety Report:\n\n`;
        message += `URL: ${this.currentApiResponse.url}\n`;
        message += `Risk Score: ${(riskScore * 100).toFixed(1)}%\n`;
        message += `Status: ${this.currentSafetyLevel.toUpperCase()}\n`;

        if (this.currentApiResponse.official) {
            message += `✅ This is an official/trusted website\n`;
        }

        if (this.currentApiResponse.reasons && this.currentApiResponse.reasons.length > 0) {
            message += `\nReasons:\n`;
            this.currentApiResponse.reasons.forEach(reason => {
                message += `• ${reason}\n`;
            });
        }

        alert(message);
    }
}

// Initialize content script
const safetyShield = new SafetyShieldContent();
