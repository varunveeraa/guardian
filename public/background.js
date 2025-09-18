// Safety Shield Background Script
class SafetyShieldBackground {
    constructor() {
        this.apiUrl = 'https://html-detect-754322588434.australia-southeast1.run.app/check';
        this.init();
    }
    
    init() {
        // Listen for extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstallation(details);
        });
        
        // Listen for tab updates to check website safety
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.handleTabUpdate(tabId, changeInfo, tab);
        });
        
        // Listen for tab activation
        chrome.tabs.onActivated.addListener((activeInfo) => {
            this.handleTabActivation(activeInfo);
        });
        
        console.log('Safety Shield background script initialized');
    }
    
    handleInstallation(details) {
        if (details.reason === 'install') {
            console.log('Safety Shield installed');
            
            // Set default icon
            this.updateIcon('safe');
            
            // Show welcome notification (optional)
            this.showWelcomeNotification();
        }
    }
    
    handleTabUpdate(tabId, changeInfo, tab) {
        // Only process when the page is completely loaded
        if (changeInfo.status === 'complete' && tab.url) {
            this.checkWebsiteSafety(tab);
        }
    }
    
    handleTabActivation(activeInfo) {
        // Get tab information and update icon
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (tab && tab.url) {
                this.checkWebsiteSafety(tab);
            }
        });
    }
    
    async checkWebsiteSafety(tab) {
        if (!tab.url) return;

        // Skip chrome:// and extension pages
        if (tab.url.startsWith('chrome://') ||
            tab.url.startsWith('chrome-extension://') ||
            tab.url.startsWith('moz-extension://')) {
            return;
        }

        try {
            // Call the API to check website safety
            const apiResponse = await this.callSafetyAPI(tab.url);
            const safetyLevel = this.determineSafetyLevel(apiResponse);

            // Update extension icon based on safety level
            this.updateIcon(safetyLevel, tab.id);

            // Store safety information for popup and content script
            this.storeSafetyInfo(tab.id, {
                url: tab.url,
                safetyLevel: safetyLevel,
                apiResponse: apiResponse,
                timestamp: Date.now()
            });

            // Send safety info to content script for overlay
            chrome.tabs.sendMessage(tab.id, {
                action: 'updateSafetyStatus',
                safetyLevel: safetyLevel,
                apiResponse: apiResponse
            }).catch(error => {
                // Content script might not be ready yet, that's okay
                console.log('Content script not ready for safety update:', error.message);
            });

        } catch (error) {
            console.error('Error checking website safety:', error);
            // Fallback to basic analysis
            const safetyLevel = this.analyzeSafety(tab.url);
            this.updateIcon(safetyLevel, tab.id);
            this.storeSafetyInfo(tab.id, {
                url: tab.url,
                safetyLevel: safetyLevel,
                timestamp: Date.now(),
                error: error.message
            });
        }
    }
    
    async callSafetyAPI(url) {
        const apiUrl = `${this.apiUrl}?url=${encodeURIComponent(url)}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    }

    determineSafetyLevel(apiResponse) {
        // Use risk_blended if available, otherwise fall back to risk
        const riskScore = apiResponse.risk_blended !== undefined ? apiResponse.risk_blended : apiResponse.risk;

        // Updated thresholds for better protection:
        // <0.20 = Safe, 0.20–0.50 = Caution, ≥0.50 = High risk
        if (riskScore < 0.20) {
            return 'safe';
        } else if (riskScore < 0.50) {
            return 'warning';
        } else {
            return 'danger';
        }
    }

    analyzeSafety(url) {
        try {
            const urlObj = new URL(url);

            // Basic checks for demonstration (fallback when API fails)
            if (urlObj.protocol === 'https:') {
                // HTTPS is generally safer
                if (this.isKnownSafeSite(urlObj.hostname)) {
                    return 'safe';
                } else {
                    return 'safe'; // Default to safe for HTTPS sites
                }
            } else if (urlObj.protocol === 'http:') {
                // HTTP is less secure
                return 'warning';
            } else {
                return 'warning';
            }
        } catch (error) {
            console.error('Error analyzing URL safety:', error);
            return 'warning';
        }
    }
    
    isKnownSafeSite(hostname) {
        // List of known safe sites (for demonstration)
        const safeSites = [
            'google.com',
            'gmail.com',
            'mail.google.com',
            'youtube.com',
            'facebook.com',
            'amazon.com',
            'microsoft.com',
            'apple.com',
            'wikipedia.org',
            'github.com'
        ];
        
        return safeSites.some(site => 
            hostname === site || hostname.endsWith('.' + site)
        );
    }
    
    updateIcon(safetyLevel, tabId = null) {
        let iconPath;
        let badgeText = '';
        let badgeColor = '';
        
        switch (safetyLevel) {
            case 'safe':
                iconPath = {
                    "16": "icons/icon-safe-16.png",
                    "32": "icons/icon-safe-32.png",
                    "48": "icons/icon-safe-48.png",
                    "128": "icons/icon-safe-128.png"
                };
                badgeColor = '#28a745';
                break;
                
            case 'warning':
                iconPath = {
                    "16": "icons/icon-warning-16.png",
                    "32": "icons/icon-warning-32.png",
                    "48": "icons/icon-warning-48.png",
                    "128": "icons/icon-warning-128.png"
                };
                badgeText = '!';
                badgeColor = '#ffc107';
                break;
                
            case 'danger':
                iconPath = {
                    "16": "icons/icon-danger-16.png",
                    "32": "icons/icon-danger-32.png",
                    "48": "icons/icon-danger-48.png",
                    "128": "icons/icon-danger-128.png"
                };
                badgeText = '⚠';
                badgeColor = '#dc3545';
                break;
                
            default:
                iconPath = {
                    "16": "icons/icon-16.png",
                    "32": "icons/icon-32.png",
                    "48": "icons/icon-48.png",
                    "128": "icons/icon-128.png"
                };
        }
        
        // Update icon
        const actionOptions = { path: iconPath };
        if (tabId) {
            actionOptions.tabId = tabId;
        }
        
        chrome.action.setIcon(actionOptions);
        
        // Update badge
        if (badgeText) {
            const badgeOptions = { text: badgeText };
            if (tabId) {
                badgeOptions.tabId = tabId;
            }
            chrome.action.setBadgeText(badgeOptions);
            chrome.action.setBadgeBackgroundColor({ color: badgeColor });
        } else {
            const clearBadgeOptions = { text: '' };
            if (tabId) {
                clearBadgeOptions.tabId = tabId;
            }
            chrome.action.setBadgeText(clearBadgeOptions);
        }
    }
    
    storeSafetyInfo(tabId, info) {
        // Store safety information for the popup to access
        const key = `safety_${tabId}`;
        chrome.storage.local.set({ [key]: info });
    }
    
    showWelcomeNotification() {
        // Optional: Show a welcome notification
        // This would require the "notifications" permission in manifest
        console.log('Welcome to Safety Shield! Your browsing protection is now active.');
    }
}

// Initialize background script
const safetyShieldBackground = new SafetyShieldBackground();
