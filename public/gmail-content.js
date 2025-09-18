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

console.log('Gmail Safety Shield content script loaded and ready!');
