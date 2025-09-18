// Safety Shield Content Script
class SafetyShieldContent {
    constructor() {
        this.warningOverlay = null;
        this.isWarningShown = false;
        
        this.init();
    }
    
    init() {
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });
        
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
                <ul style="margin-left: 20px; margin-bottom: 0;">
                    <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">This demonstration shows how Safety Shield protects you from dangerous websites</li>
                    <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">In the real version, sites would be blocked based on known threat databases</li>
                    <li style="margin-bottom: 8px; font-size: 16px; line-height: 1.4;">Common threats include phishing, malware, and scam websites</li>
                    <li style="margin-bottom: 0; font-size: 16px; line-height: 1.4;">Your safety is our top priority</li>
                </ul>
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
}

// Initialize content script
const safetyShield = new SafetyShieldContent();
