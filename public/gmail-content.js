// Gmail Content Script for Safety Shield - Simplified Version
console.log('Gmail content script starting...');

// Simple message listener - no classes, just functions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Gmail content script received message:', request);

    if (request.action === 'ping') {
        console.log('Responding to ping');
        sendResponse({ success: true, message: 'Gmail content script is working!' });
        return true;
    }

    if (request.action === 'getEmailContent') {
        console.log('Getting email content...');

        try {
            const emailData = extractEmailContent();
            console.log('Email data extracted:', emailData);
            sendResponse({ success: true, content: emailData });
        } catch (error) {
            console.error('Error extracting email:', error);
            sendResponse({ success: false, error: error.message });
        }
        return true;
    }

    if (request.action === 'showEmailSafetyNotification') {
        console.log('Showing email safety notification:', request);
        try {
            showEmailSafetyNotification(request.safetyLevel, request.icon, request.message, request.apiResponse);
            sendResponse({ success: true });
        } catch (error) {
            console.error('Error showing email safety notification:', error);
            sendResponse({ success: false, error: error.message });
        }
        return true;
    }

    sendResponse({ success: false, error: 'Unknown action: ' + request.action });
    return true;
});

function extractEmailContent() {
    console.log('Starting email extraction...');

    // Check if we're actually viewing an email (not just inbox)
    const url = window.location.href;
    const isEmailOpen = url.includes('#inbox/') || url.includes('#sent/') || url.includes('#drafts/') ||
                       url.includes('#spam/') || url.includes('#trash/') || url.includes('#label/');

    // Also check for email-specific DOM elements
    const hasEmailContent = document.querySelector('.ii.gt') ||
                           document.querySelector('[data-message-id]') ||
                           document.querySelector('.a3s.aiL');

    if (!isEmailOpen || !hasEmailContent) {
        console.log('Not viewing an individual email - inbox/list view detected');
        return {
            sender: 'No Email Selected',
            subject: 'Please open an email to analyze',
            body: 'You are currently viewing your inbox or email list. Please click on a specific email to open it, then try the Safety Shield extension again.',
            timestamp: new Date().toISOString()
        };
    }

    console.log('Individual email detected - proceeding with extraction');

    // Only try to expand content if we're in a stable email view
    // Avoid expansion if URL suggests we might be in a transitional state
    if (!url.includes('storage') && !url.includes('one.google.com')) {
        expandCollapsedContent();
    } else {
        console.log('Skipping content expansion - detected potential navigation state');
    }

    // Simple extraction - just get whatever text we can find
    const emailData = {
        sender: 'Unknown Sender',
        subject: 'No Subject',
        body: 'No content found',
        urls: [],
        timestamp: new Date().toISOString()
    };

    // Try to find sender
    const senderSelectors = [
        '[email]',
        '.go span[email]',
        '.hP',
        '.gD',
        'span[title*="@"]'
    ];

    for (const selector of senderSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            const email = element.getAttribute('email');
            const text = element.textContent?.trim();
            if (email) {
                emailData.sender = `${text || 'Unknown'} <${email}>`;
                break;
            } else if (text && text.includes('@')) {
                emailData.sender = text;
                break;
            }
        }
    }

    // Try to find subject - improved selectors
    const subjectSelectors = [
        'h2[data-thread-perm-id]',
        '.hP',
        '.bog',
        'h2',
        '[data-legacy-thread-id] h2',
        '.aYF',
        '.ii.gt h2',
        '[role="main"] h2'
    ];

    for (const selector of subjectSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent?.trim()) {
            let subject = element.textContent.trim();
            // Remove common Gmail interface text
            if (!subject.includes('Inbox') && !subject.includes('Gmail') && subject.length > 3) {
                emailData.subject = subject;
                break;
            }
        }
    }

    // Try to find body - improved approach to get full content
    const bodySelectors = [
        '.ii.gt .a3s.aiL',
        '.a3s.aiL',
        '[role="listitem"] .a3s',
        '.ii.gt',
        '[data-message-id] .a3s',
        '.adn.ads .a3s'
    ];

    let fullBodyText = '';

    // Try to collect all email content sections - don't break early
    for (const selector of bodySelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
            if (element && element.textContent?.trim()) {
                const text = element.textContent.trim();
                // More lenient duplicate checking - only skip if text is already fully contained
                if (text.length > 20 && !fullBodyText.includes(text)) {
                    fullBodyText += (fullBodyText ? '\n\n' : '') + text;
                }
            }
        }
    }

    // If we still don't have much content, try broader selectors
    if (fullBodyText.length < 200) {
        const broadSelectors = [
            '[role="main"] .ii.gt',
            '[role="main"] .adn',
            '[role="main"] .gs',
            '.nH .if .ii.gt',
            '[role="main"]'
        ];

        for (const selector of broadSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (element && element.textContent?.trim()) {
                    const text = element.textContent.trim();
                    if (text.length > fullBodyText.length && !fullBodyText.includes(text.substring(0, 100))) {
                        fullBodyText = text;
                        break;
                    }
                }
            }
            if (fullBodyText.length > 500) break;
        }
    }

    if (fullBodyText) {
        // Clean up the text but preserve more content
        fullBodyText = fullBodyText
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/^\s+|\s+$/g, '') // Trim
            .replace(/\n\s*\n/g, '\n'); // Remove empty lines
            // Removed character limit - let's show the full content

        if (fullBodyText.length > 50) {
            emailData.body = fullBodyText;
            console.log(`Email body extracted: ${fullBodyText.length} characters`);
        }
    }

    // Extract URLs from the email
    emailData.urls = extractUrlsFromEmail();

    console.log('Final email data:', emailData);
    return emailData;
}

function expandCollapsedContent() {
    // Be much more specific about what we click to avoid navigation issues
    console.log('Attempting to expand collapsed email content...');

    // Only look for expand buttons within the email content area
    const emailContainer = document.querySelector('.ii.gt') || document.querySelector('[role="main"]');
    if (!emailContainer) {
        console.log('No email container found - skipping expansion');
        return;
    }

    // Look for very specific "show trimmed content" links within the email
    const trimmedLinks = emailContainer.querySelectorAll('span[role="link"], div[role="button"]');
    for (const link of trimmedLinks) {
        const text = link.textContent?.toLowerCase() || '';
        const ariaLabel = link.getAttribute('aria-label')?.toLowerCase() || '';

        // Only click if it's clearly a "show trimmed content" or "show quoted text" button
        if ((text.includes('show trimmed') || text.includes('show quoted') ||
             ariaLabel.includes('show trimmed') || ariaLabel.includes('show quoted')) &&
            !text.includes('storage') && !text.includes('google one') && !ariaLabel.includes('storage')) {
            try {
                link.click();
                console.log('Expanded collapsed content:', text || ariaLabel);
            } catch (e) {
                console.log('Failed to expand content:', e.message);
            }
        }
    }

    // Look for Gmail's specific collapsed message classes, but be more careful
    const specificExpandButtons = emailContainer.querySelectorAll('.aiz[role="button"], .ajz[role="button"]');
    for (const button of specificExpandButtons) {
        const text = button.textContent?.toLowerCase() || '';
        const ariaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';

        // Only click if it doesn't contain navigation-related text
        if (!text.includes('storage') && !text.includes('google one') && !text.includes('account') &&
            !ariaLabel.includes('storage') && !ariaLabel.includes('google one') && !ariaLabel.includes('account')) {
            try {
                button.click();
                console.log('Expanded message part');
            } catch (e) {
                console.log('Failed to expand message part:', e.message);
            }
        }
    }
}

function extractUrlsFromEmail() {
    console.log('Extracting URLs from email...');
    const urls = new Set(); // Use Set to avoid duplicates

    // First, look for actual HTML links in the email content
    const emailContainer = document.querySelector('.ii.gt') || document.querySelector('[role="main"]');
    if (emailContainer) {
        // Find all anchor tags with href attributes
        const links = emailContainer.querySelectorAll('a[href]');
        for (const link of links) {
            const href = link.getAttribute('href');
            if (href && isValidUrl(href)) {
                // Clean up Gmail's redirect URLs
                const cleanUrl = cleanGmailUrl(href);
                if (cleanUrl) {
                    urls.add(cleanUrl);
                }
            }
        }
    }

    // Also extract URLs from the text content using regex
    const bodySelectors = [
        '.ii.gt .a3s.aiL',
        '.a3s.aiL',
        '[role="listitem"] .a3s',
        '.ii.gt',
        '[data-message-id] .a3s'
    ];

    for (const selector of bodySelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
            if (element && element.textContent) {
                const textUrls = extractUrlsFromText(element.textContent);
                textUrls.forEach(url => urls.add(url));
            }
        }
    }

    const urlArray = Array.from(urls);
    console.log(`Found ${urlArray.length} unique URLs:`, urlArray);
    return urlArray;
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function cleanGmailUrl(gmailUrl) {
    // Gmail often wraps URLs in redirects like:
    // https://www.google.com/url?q=https://example.com&sa=D&source=gmail&ust=...
    try {
        const url = new URL(gmailUrl);

        // If it's a Google redirect, extract the actual URL
        if (url.hostname === 'www.google.com' && url.pathname === '/url' && url.searchParams.has('q')) {
            const actualUrl = url.searchParams.get('q');
            if (actualUrl && isValidUrl(actualUrl)) {
                return actualUrl;
            }
        }

        // If it's already a clean URL, return it
        if (isValidUrl(gmailUrl)) {
            return gmailUrl;
        }
    } catch (e) {
        console.log('Error cleaning Gmail URL:', e.message);
    }

    return null;
}

function extractUrlsFromText(text) {
    // Regex to find URLs in text
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
    const matches = text.match(urlRegex) || [];

    return matches.filter(url => {
        // Additional validation and cleaning
        try {
            // Remove trailing punctuation that might be part of sentence
            const cleanUrl = url.replace(/[.,;:!?]+$/, '');
            return isValidUrl(cleanUrl) ? cleanUrl : null;
        } catch (e) {
            return null;
        }
    }).filter(Boolean);
}

function showEmailSafetyNotification(safetyLevel, icon, message, apiResponse) {
    console.log('Creating email safety notification:', safetyLevel, message);

    // Remove any existing notification
    const existingNotification = document.getElementById('email-safety-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create the notification element
    const notification = document.createElement('div');
    notification.id = 'email-safety-notification';

    // Determine colors and styles based on safety level
    let backgroundColor, borderColor, textColor, shadowColor;

    switch (safetyLevel) {
        case 'safe':
            backgroundColor = '#d4edda';
            borderColor = '#28a745';
            textColor = '#155724';
            shadowColor = 'rgba(40, 167, 69, 0.3)';
            break;
        case 'caution':
            backgroundColor = '#fff3cd';
            borderColor = '#ffc107';
            textColor = '#856404';
            shadowColor = 'rgba(255, 193, 7, 0.3)';
            break;
        case 'danger':
            backgroundColor = '#f8d7da';
            borderColor = '#dc3545';
            textColor = '#721c24';
            shadowColor = 'rgba(220, 53, 69, 0.3)';
            break;
        default:
            backgroundColor = '#f8f9fa';
            borderColor = '#6c757d';
            textColor = '#495057';
            shadowColor = 'rgba(108, 117, 125, 0.3)';
    }

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 320px;
        background: ${backgroundColor};
        border: 3px solid ${borderColor};
        border-radius: 12px;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 16px;
        font-weight: 600;
        color: ${textColor};
        box-shadow: 0 8px 32px ${shadowColor}, 0 4px 16px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        cursor: pointer;
        transition: all 0.3s ease;
        animation: slideInRight 0.5s ease-out;
    `;

    // Add the content
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span style="font-size: 24px;">${icon}</span>
            <span style="font-size: 18px; font-weight: 700;">Safety Shield</span>
        </div>
        <div style="font-size: 16px; line-height: 1.4; margin-bottom: 12px;">
            ${message}
        </div>
        <div style="font-size: 12px; opacity: 0.8; text-align: center;">
            Click for details • Auto-close in 10s
        </div>
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateY(-50%) translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateY(-50%) translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateY(-50%) translateX(0);
                opacity: 1;
            }
            to {
                transform: translateY(-50%) translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add hover effect
    notification.addEventListener('mouseenter', () => {
        notification.style.transform = 'translateY(-50%) scale(1.02)';
        notification.style.boxShadow = `0 12px 40px ${shadowColor}, 0 6px 20px rgba(0, 0, 0, 0.15)`;
    });

    notification.addEventListener('mouseleave', () => {
        notification.style.transform = 'translateY(-50%) scale(1)';
        notification.style.boxShadow = `0 8px 32px ${shadowColor}, 0 4px 16px rgba(0, 0, 0, 0.1)`;
    });

    // Add click handler for detailed information
    notification.addEventListener('click', () => {
        showDetailedEmailSafety(apiResponse);
    });

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 10000);

    console.log('Email safety notification displayed');
}

function showDetailedEmailSafety(apiResponse) {
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

console.log('Gmail Safety Shield content script loaded and ready!');
