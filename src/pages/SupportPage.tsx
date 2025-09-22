import React, { useState } from 'react';
import { Phone, ExternalLink, Shield, AlertCircle, Users, FileText, CreditCard, Heart, BookOpen, ArrowRight, CheckCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const SupportPage: React.FC = () => {
  const { speakText } = useAccessibility();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('timeline');

  const questions = [
    {
      id: 'situation',
      question: 'What best describes your current situation?',
      options: [
        { value: 'scammed', label: 'I think I\'ve been scammed', icon: AlertCircle },
        { value: 'suspicious', label: 'I received something suspicious', icon: HelpCircle },
        { value: 'identity', label: 'My identity may have been stolen', icon: Shield },
        { value: 'financial', label: 'I lost money or gave financial details', icon: CreditCard },
        { value: 'emotional', label: 'I need emotional support', icon: Heart },
        { value: 'prevention', label: 'I want to learn how to stay safe', icon: BookOpen },
        { value: 'helping', label: 'I want to help someone else', icon: Users }
      ]
    },
    {
      id: 'scam_type',
      question: 'What type of scam or suspicious activity?',
      condition: (answers) => ['scammed', 'suspicious'].includes(answers[0]),
      options: [
        { value: 'email', label: 'Suspicious email or phishing', icon: FileText },
        { value: 'phone', label: 'Phone call or SMS scam', icon: Phone },
        { value: 'online', label: 'Fake website or online shopping', icon: ExternalLink },
        { value: 'romance', label: 'Dating or romance scam', icon: Heart },
        { value: 'investment', label: 'Investment or cryptocurrency scam', icon: CreditCard },
        { value: 'tech', label: 'Tech support or computer scam', icon: Shield },
        { value: 'impersonation', label: 'Government or business impersonation', icon: Users },
        { value: 'other', label: 'Other or not sure', icon: HelpCircle }
      ]
    },
    {
      id: 'financial_impact',
      question: 'What financial impact have you experienced?',
      condition: (answers) => ['scammed', 'financial'].includes(answers[0]),
      options: [
        { value: 'no_money', label: 'No money lost, but gave personal details', icon: Shield },
        { value: 'small', label: 'Lost under $1,000', icon: CreditCard },
        { value: 'medium', label: 'Lost $1,000 - $10,000', icon: CreditCard },
        { value: 'large', label: 'Lost over $10,000', icon: AlertCircle },
        { value: 'ongoing', label: 'Ongoing unauthorized transactions', icon: AlertCircle },
        { value: 'credit', label: 'Credit cards or loans taken in my name', icon: Shield },
        { value: 'unsure', label: 'Not sure yet', icon: HelpCircle }
      ]
    },
    {
      id: 'personal_info',
      question: 'What personal information was compromised?',
      condition: (answers) => ['scammed', 'identity', 'suspicious'].includes(answers[0]),
      options: [
        { value: 'none', label: 'No personal information shared', icon: CheckCircle },
        { value: 'basic', label: 'Name, address, phone number', icon: FileText },
        { value: 'financial', label: 'Bank details, credit card numbers', icon: CreditCard },
        { value: 'identity', label: 'Driver\'s license, passport, Medicare', icon: Shield },
        { value: 'passwords', label: 'Passwords or PINs', icon: AlertCircle },
        { value: 'photos', label: 'Photos or personal documents', icon: FileText },
        { value: 'everything', label: 'Multiple types of information', icon: AlertCircle },
        { value: 'unsure', label: 'Not sure what they have', icon: HelpCircle }
      ]
    },
    {
      id: 'urgency',
      question: 'How urgent is your situation?',
      options: [
        { value: 'immediate', label: 'I need help right now - emergency', icon: AlertCircle },
        { value: 'today', label: 'I need help today', icon: Phone },
        { value: 'soon', label: 'I need help in the next few days', icon: FileText },
        { value: 'information', label: 'I just want information and advice', icon: BookOpen }
      ]
    },
    {
      id: 'actions',
      question: 'What have you already done?',
      options: [
        { value: 'nothing', label: 'Nothing yet - I just realized', icon: HelpCircle },
        { value: 'bank', label: 'I contacted my bank/financial institution', icon: CreditCard },
        { value: 'police', label: 'I contacted police', icon: Users },
        { value: 'scamwatch', label: 'I reported to Scamwatch', icon: AlertCircle },
        { value: 'idcare', label: 'I contacted IDCARE', icon: Shield },
        { value: 'multiple', label: 'I contacted multiple services', icon: CheckCircle },
        { value: 'research', label: 'I\'m researching what to do', icon: BookOpen }
      ]
    },
    {
      id: 'emotional_state',
      question: 'How are you feeling about this situation?',
      condition: (answers) => !['prevention', 'helping'].includes(answers[0]),
      options: [
        { value: 'calm', label: 'I\'m handling it well', icon: CheckCircle },
        { value: 'worried', label: 'I\'m worried but managing', icon: HelpCircle },
        { value: 'stressed', label: 'I\'m very stressed and anxious', icon: AlertCircle },
        { value: 'overwhelmed', label: 'I feel overwhelmed and need support', icon: Heart },
        { value: 'angry', label: 'I\'m angry and want justice', icon: Users },
        { value: 'embarrassed', label: 'I\'m embarrassed this happened', icon: Heart }
      ]
    },
    {
      id: 'support_network',
      question: 'Do you have support from family or friends?',
      condition: (answers) => !['prevention', 'helping'].includes(answers[0]),
      options: [
        { value: 'strong', label: 'Yes, I have strong support', icon: Users },
        { value: 'some', label: 'I have some support', icon: Users },
        { value: 'limited', label: 'Limited support available', icon: HelpCircle },
        { value: 'none', label: 'I\'m dealing with this alone', icon: Heart },
        { value: 'prefer_alone', label: 'I prefer to handle this myself', icon: CheckCircle }
      ]
    }
  ];

  const getRecommendations = () => {
    const situation = answers[0];
    const scamType = answers[1];
    const financialImpact = answers[2];
    const personalInfo = answers[3];
    const urgency = answers[4];
    const actions = answers[5];
    const emotionalState = answers[6];
    const supportNetwork = answers[7];

    let recommendations = [];
    let detailedSteps = [];
    let resources = [];
    let preventionTips = [];

    // IMMEDIATE EMERGENCY RESPONSES
    if (urgency === 'immediate') {
      if (financialImpact === 'ongoing' || (situation === 'financial' && personalInfo === 'financial')) {
        recommendations.push({
          priority: 'URGENT',
          title: 'Stop All Financial Activity NOW',
          description: 'Immediately contact your bank to freeze accounts and stop unauthorized transactions.',
          phone: 'Number on back of your card',
          action: 'Call Bank Now',
          icon: AlertCircle,
          color: 'red',
          details: [
            'Call the emergency number on your card immediately',
            'Report unauthorized transactions',
            'Request immediate account freeze',
            'Ask for new cards to be issued',
            'Get reference numbers for all actions taken'
          ]
        });
      }

      if (emotionalState === 'overwhelmed' || situation === 'emotional') {
        recommendations.push({
          priority: 'URGENT',
          title: 'Crisis Support Available 24/7',
          description: 'Professional crisis counselors available right now.',
          phone: '13 11 14',
          website: 'lifeline.org.au',
          action: 'Call Lifeline',
          icon: Heart,
          color: 'purple',
          details: [
            'Available 24 hours a day, 7 days a week',
            'Trained crisis counselors',
            'Completely confidential',
            'Can help with immediate emotional support',
            'Can connect you to local services'
          ]
        });
      }
    }

    // SCAM TYPE SPECIFIC RECOMMENDATIONS
    if (scamType === 'email') {
      recommendations.push({
        priority: urgency === 'immediate' ? 'HIGH' : 'MEDIUM',
        title: 'Email/Phishing Scam Response',
        description: 'Specific steps for email-based scams and phishing attempts.',
        phone: '1300 302 502',
        website: 'scamwatch.gov.au',
        action: 'Report Email Scam',
        icon: FileText,
        color: 'orange',
        details: [
          'Do not click any links in the suspicious email',
          'Do not download any attachments',
          'Forward the email to report@phishing.gov.au',
          'Report to Scamwatch with full email headers',
          'Check if you entered details on any linked websites',
          'If you clicked links, run antivirus scan immediately'
        ]
      });
    }

    if (scamType === 'phone') {
      recommendations.push({
        priority: 'HIGH',
        title: 'Phone/SMS Scam Response',
        description: 'Immediate actions for phone and text message scams.',
        phone: '1300 302 502',
        website: 'scamwatch.gov.au',
        action: 'Report Phone Scam',
        icon: Phone,
        color: 'orange',
        details: [
          'Block the phone number immediately',
          'Do not call back or respond to texts',
          'Report the number to Scamwatch',
          'If you gave information, contact relevant institutions',
          'Consider changing your phone number if harassment continues',
          'Report to your phone provider for blocking'
        ]
      });
    }

    if (scamType === 'romance') {
      recommendations.push({
        priority: 'HIGH',
        title: 'Romance Scam Support',
        description: 'Specialized support for dating and romance scams.',
        phone: '1300 302 502',
        website: 'scamwatch.gov.au/types-of-scams/dating-romance',
        action: 'Get Romance Scam Help',
        icon: Heart,
        color: 'red',
        details: [
          'Stop all communication with the scammer immediately',
          'Do not send any more money or gifts',
          'Report to dating platform where you met',
          'Keep all communications as evidence',
          'Consider counseling - romance scams cause deep emotional trauma',
          'Join support groups for romance scam victims'
        ]
      });
    }

    if (scamType === 'investment') {
      recommendations.push({
        priority: 'HIGH',
        title: 'Investment Scam Response',
        description: 'Immediate actions for investment and cryptocurrency scams.',
        phone: '1300 300 630',
        website: 'asic.gov.au',
        action: 'Report Investment Scam',
        icon: CreditCard,
        color: 'red',
        details: [
          'Stop all payments to the investment platform immediately',
          'Report to ASIC (Australian Securities and Investments Commission)',
          'Report to Scamwatch',
          'Contact your bank about recovering funds',
          'Keep all documentation and communications',
          'Be aware of recovery scams offering to get your money back'
        ]
      });
    }

    // FINANCIAL IMPACT RESPONSES
    if (financialImpact === 'large' || financialImpact === 'credit') {
      recommendations.push({
        priority: 'HIGH',
        title: 'Major Financial Loss Response',
        description: 'Comprehensive response for significant financial impact.',
        phone: '1800 595 160',
        website: 'idcare.org',
        action: 'Get IDCARE Support',
        icon: Shield,
        color: 'blue',
        details: [
          'Contact IDCARE for comprehensive case management',
          'File police report for major financial crimes',
          'Contact all financial institutions',
          'Place fraud alerts on all accounts',
          'Consider legal advice for large losses',
          'Document everything for insurance claims'
        ]
      });
    }

    // IDENTITY THEFT RESPONSES
    if (personalInfo === 'identity' || personalInfo === 'everything') {
      recommendations.push({
        priority: 'HIGH',
        title: 'Identity Theft Recovery',
        description: 'Complete identity theft recovery process.',
        phone: '1800 595 160',
        website: 'idcare.org',
        action: 'Start Identity Recovery',
        icon: Shield,
        color: 'blue',
        details: [
          'Contact IDCARE immediately for case management',
          'Place fraud alerts with credit reporting agencies',
          'Contact Medicare, Centrelink, ATO if relevant documents stolen',
          'Apply for new identity documents',
          'Monitor credit reports regularly',
          'Consider credit monitoring services'
        ]
      });
    }

    // STANDARD REPORTING RECOMMENDATIONS
    if (situation === 'scammed' || situation === 'suspicious') {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Report to Scamwatch',
        description: 'Australia\'s official scam reporting and information service.',
        phone: '1300 302 502',
        website: 'scamwatch.gov.au',
        email: 'info@scamwatch.gov.au',
        action: 'Report Scam',
        icon: AlertCircle,
        color: 'orange',
        details: [
          'Report online at scamwatch.gov.au',
          'Provide as much detail as possible',
          'Include screenshots and evidence',
          'Get latest scam warnings and trends',
          'Access recovery resources',
          'Help protect others from similar scams'
        ]
      });
    }

    // POLICE REPORTING
    if (financialImpact === 'large' || financialImpact === 'credit' || urgency === 'immediate') {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Contact Police',
        description: 'File official police report for serious crimes.',
        phone: '000 (Emergency) / 131 444',
        website: 'police.gov.au',
        action: 'File Police Report',
        icon: Users,
        color: 'blue',
        details: [
          'Call 000 if immediate danger or crime in progress',
          'Call 131 444 for non-emergency police assistance',
          'Visit local police station to file report',
          'Bring all evidence and documentation',
          'Get police report number for insurance/bank claims',
          'Ask about victim support services'
        ]
      });
    }

    // EMOTIONAL SUPPORT BASED ON STATE
    if (emotionalState === 'stressed' || emotionalState === 'overwhelmed' || emotionalState === 'embarrassed') {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Mental Health Support',
        description: 'Professional support for the emotional impact of scams.',
        phone: '1300 22 4636',
        website: 'beyondblue.org.au',
        action: 'Get Emotional Support',
        icon: Heart,
        color: 'purple',
        details: [
          'Beyond Blue: 1300 22 4636 (24/7 support)',
          'Lifeline: 13 11 14 (crisis support)',
          'Free counseling sessions available',
          'Online chat support available',
          'Support groups for scam victims',
          'Remember: being scammed is not your fault'
        ]
      });
    }

    // DOCUMENTATION AND EVIDENCE
    if (actions === 'nothing' || actions === 'research') {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Document Everything',
        description: 'Preserve evidence and create detailed records.',
        action: 'Start Documentation',
        icon: FileText,
        color: 'green',
        details: [
          'Screenshot all communications and websites',
          'Save emails with full headers',
          'Record phone numbers and call times',
          'List all financial transactions',
          'Keep receipts and bank statements',
          'Create timeline of events',
          'Store everything in a secure folder'
        ]
      });
    }

    // PREVENTION AND EDUCATION
    if (situation === 'prevention' || urgency === 'information') {
      recommendations.push({
        priority: 'LOW',
        title: 'Scam Prevention Education',
        description: 'Learn how to recognize and avoid scams.',
        website: 'scamwatch.gov.au/get-help/protect-yourself',
        action: 'Learn Prevention',
        icon: BookOpen,
        color: 'green',
        details: [
          'Learn common scam warning signs',
          'Understand how scammers operate',
          'Set up account alerts and monitoring',
          'Practice safe online habits',
          'Share knowledge with family and friends',
          'Stay updated on latest scam trends'
        ]
      });
    }

    // HELPING OTHERS
    if (situation === 'helping') {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Helping Someone Else',
        description: 'How to support someone who has been scammed.',
        website: 'scamwatch.gov.au/get-help/help-for-family-friends',
        action: 'Get Guidance',
        icon: Users,
        color: 'blue',
        details: [
          'Listen without judgment - avoid saying "I told you so"',
          'Help them report to appropriate authorities',
          'Assist with documentation and evidence gathering',
          'Support them emotionally - scams cause shame and trauma',
          'Help monitor their accounts and credit',
          'Connect them with professional support services'
        ]
      });
    }

    // ADDITIONAL RESOURCES BASED ON SUPPORT NETWORK
    if (supportNetwork === 'none' || supportNetwork === 'limited') {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Community Support Services',
        description: 'Local support services and community resources.',
        phone: '1800 200 422',
        website: 'cota.org.au',
        action: 'Find Local Support',
        icon: Users,
        color: 'green',
        details: [
          'Council on the Ageing (COTA) support services',
          'Local community centers and support groups',
          'Financial counseling services',
          'Legal aid services for scam victims',
          'Volunteer support programs',
          'Senior support networks in your area'
        ]
      });
    }

    // RECOVERY SCAM WARNING
    if (financialImpact !== 'no_money' && financialImpact !== 'none') {
      recommendations.push({
        priority: 'HIGH',
        title: 'Beware of Recovery Scams',
        description: 'Warning about scammers who target scam victims.',
        action: 'Learn About Recovery Scams',
        icon: AlertCircle,
        color: 'red',
        details: [
          'Scammers often target previous victims',
          'Never pay upfront fees to "recover" your money',
          'Legitimate services don\'t ask for payment first',
          'Be suspicious of unsolicited recovery offers',
          'Only work with official government agencies',
          'Report recovery scam attempts immediately'
        ]
      });
    }

    return {
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { 'URGENT': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      detailedSteps: getDetailedSteps(),
      resources: getAdditionalResources(),
      preventionTips: getPreventionTips()
    };
  };

  const getDetailedSteps = () => {
    return [
      {
        title: 'Immediate Actions (First 24 Hours)',
        steps: [
          'Stop all communication with the scammer',
          'Contact your bank/financial institutions',
          'Change passwords on all affected accounts',
          'Run antivirus scan on your devices',
          'Document everything with screenshots',
          'Report to Scamwatch and relevant authorities'
        ]
      },
      {
        title: 'Short Term Actions (First Week)',
        steps: [
          'File police report if significant loss',
          'Contact IDCARE if identity compromised',
          'Place fraud alerts on credit reports',
          'Contact all affected service providers',
          'Seek emotional support if needed',
          'Review and secure all online accounts'
        ]
      },
      {
        title: 'Long Term Recovery (Ongoing)',
        steps: [
          'Monitor credit reports regularly',
          'Follow up on all reports and cases',
          'Consider legal action for large losses',
          'Learn about scam prevention',
          'Share experience to help others',
          'Maintain security practices'
        ]
      }
    ];
  };

  const getAdditionalResources = () => {
    return [
      {
        category: 'Government Services',
        resources: [
          { name: 'Scamwatch', phone: '1300 302 502', website: 'scamwatch.gov.au' },
          { name: 'IDCARE', phone: '1800 595 160', website: 'idcare.org' },
          { name: 'ASIC', phone: '1300 300 630', website: 'asic.gov.au' },
          { name: 'ACMA', phone: '1800 803 772', website: 'acma.gov.au' }
        ]
      },
      {
        category: 'Mental Health Support',
        resources: [
          { name: 'Lifeline', phone: '13 11 14', website: 'lifeline.org.au' },
          { name: 'Beyond Blue', phone: '1300 22 4636', website: 'beyondblue.org.au' },
          { name: 'Suicide Call Back Service', phone: '1300 659 467', website: 'suicidecallbackservice.org.au' }
        ]
      },
      {
        category: 'Financial Support',
        resources: [
          { name: 'National Debt Helpline', phone: '1800 007 007', website: 'ndh.org.au' },
          { name: 'Financial Counselling Australia', phone: '1800 007 007', website: 'financialcounsellingaustralia.org.au' },
          { name: 'Legal Aid', phone: 'Varies by state', website: 'nationallegalaid.org' }
        ]
      }
    ];
  };

  const getPreventionTips = () => {
    return [
      {
        category: 'Email Safety',
        tips: [
          'Never click links in suspicious emails',
          'Check sender addresses carefully',
          'Be wary of urgent or threatening language',
          'Verify requests through official channels',
          'Use spam filters and keep them updated'
        ]
      },
      {
        category: 'Phone Safety',
        tips: [
          'Never give personal details to unsolicited callers',
          'Hang up and call back on official numbers',
          'Be suspicious of high-pressure tactics',
          'Don\'t trust caller ID - it can be spoofed',
          'Register with Do Not Call Register'
        ]
      },
      {
        category: 'Online Safety',
        tips: [
          'Use strong, unique passwords',
          'Enable two-factor authentication',
          'Keep software and browsers updated',
          'Shop only on secure websites (https://)',
          'Be cautious on social media'
        ]
      }
    ];
  };

  const getNextQuestion = (currentStep: number, answers: string[]) => {
    for (let i = currentStep + 1; i < questions.length; i++) {
      const question = questions[i];
      if (!question.condition || question.condition(answers)) {
        return i;
      }
    }
    return -1; // No more questions
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);

    const nextStep = getNextQuestion(currentStep, newAnswers);
    if (nextStep !== -1) {
      setCurrentStep(nextStep);
    }
  };

  const goBack = () => {
    // Find the previous question that should be shown
    for (let i = currentStep - 1; i >= 0; i--) {
      const question = questions[i];
      if (!question.condition || question.condition(answers.slice(0, i))) {
        setCurrentStep(i);
        // Remove answers for questions after this step
        const newAnswers = answers.slice(0, i + 1);
        setAnswers(newAnswers);
        return;
      }
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers([]);
  };

  const isComplete = () => {
    // Check if we've answered all applicable questions
    const nextStep = getNextQuestion(currentStep, answers);
    return nextStep === -1 && answers[currentStep] !== undefined;
  };

  const getCurrentQuestion = () => {
    return questions[currentStep];
  };

  const handleActionClick = (rec: any) => {
    speakText(rec.action);

    // If there's a website, open it
    if (rec.website) {
      const url = rec.website.startsWith('http') ? rec.website : `https://${rec.website}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    // If there's a phone number, try to call it
    else if (rec.phone) {
      window.location.href = `tel:${rec.phone.replace(/\s/g, '')}`;
    }
    // If there's an email, open email client
    else if (rec.email) {
      window.location.href = `mailto:${rec.email}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 cursor-pointer"
          onClick={() => speakText('Get Personalized Help and Support')}
        >
          Get Personalized Help
        </h1>
        <p
          className="text-lg text-gray-600 cursor-pointer"
          onClick={() => speakText('Answer a few questions to get the right support for your situation')}
        >
          Answer a few questions to get the right support for your situation
        </p>
      </div>

      {!isComplete() ? (
        /* Questionnaire */
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {answers.length} answers provided
              </span>
            </div>
            <div className="w-full bg-gray-300 border border-gray-400 rounded-full h-3">
              <div
                className="bg-blue-600 border border-blue-700 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(((answers.length + 1) / questions.length) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question */}
          <div className="mb-6">
            <h2
              className="text-xl md:text-2xl font-bold text-gray-800 mb-4 cursor-pointer"
              onClick={() => speakText(getCurrentQuestion().question)}
            >
              {getCurrentQuestion().question}
            </h2>

            <div className={`grid gap-4 ${
              getCurrentQuestion().options.length > 4
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}>
              {getCurrentQuestion().options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-400 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-center gap-3">
                    <option.icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 flex-shrink-0" />
                    <span
                      className="text-base font-medium text-gray-800 cursor-pointer leading-tight"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(option.label);
                      }}
                    >
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={goBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white border border-gray-800 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={restart}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white border border-red-800 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Start Over
            </button>
          </div>
        </div>
      ) : (
        /* Recommendations - Compact Horizontal Layout */
        <div className="space-y-6">
          <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2
              className="text-2xl font-bold text-gray-800 mb-2 cursor-pointer"
              onClick={() => speakText('Your Personalized Recommendations')}
            >
              Your Personalized Recommendations
            </h2>
            <p
              className="text-base text-gray-600 cursor-pointer"
              onClick={() => speakText('Based on your answers, here are the best resources for your situation')}
            >
              Based on your answers, here are the best resources for your situation
            </p>
          </div>

          {/* Priority Recommendations - Horizontal Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {getRecommendations().recommendations.map((rec, index) => (
              <div key={index} className={`bg-white border-2 border-${rec.color}-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-full bg-${rec.color}-100 flex-shrink-0`}>
                    <rec.icon className={`h-5 w-5 text-${rec.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        rec.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        rec.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold text-gray-800 cursor-pointer mb-2 leading-tight"
                      onClick={() => speakText(rec.title)}
                    >
                      {rec.title}
                    </h3>

                    <p
                      className="text-sm text-gray-600 mb-3 cursor-pointer line-clamp-2"
                      onClick={() => speakText(rec.description)}
                    >
                      {rec.description}
                    </p>

                    {/* Contact Information - Compact */}
                    <div className="space-y-1 mb-3 text-sm">
                      {rec.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <a
                            href={`tel:${rec.phone.replace(/\s/g, '')}`}
                            className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer truncate underline"
                            onClick={() => speakText(`Calling ${rec.phone}`)}
                          >
                            {rec.phone}
                          </a>
                        </div>
                      )}

                      {rec.website && (
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <a
                            href={rec.website.startsWith('http') ? rec.website : `https://${rec.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 cursor-pointer hover:text-blue-800 truncate underline"
                            onClick={() => speakText(`Opening website ${rec.website}`)}
                          >
                            {rec.website}
                          </a>
                        </div>
                      )}

                      {rec.email && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <a
                            href={`mailto:${rec.email}`}
                            className="text-blue-600 hover:text-blue-800 cursor-pointer truncate underline"
                            onClick={() => speakText(`Sending email to ${rec.email}`)}
                          >
                            {rec.email}
                          </a>
                        </div>
                      )}
                    </div>

                    <button
                      className={`w-full px-4 py-2 bg-${rec.color}-500 hover:bg-${rec.color}-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-${rec.color}-500 text-sm`}
                      onClick={() => handleActionClick(rec)}
                    >
                      {rec.action}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Additional Information - Tabbed Layout */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex flex-wrap gap-2 mb-4 border-b">
              {['timeline', 'resources', 'prevention', 'contacts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'timeline' && '📅 Timeline'}
                  {tab === 'resources' && '🆘 Resources'}
                  {tab === 'prevention' && '🛡️ Prevention'}
                  {tab === 'contacts' && '📞 Contacts'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recovery Timeline</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {getRecommendations().detailedSteps.map((phase, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-800 mb-2 text-sm">{phase.title}</h4>
                        <ul className="space-y-1">
                          {phase.steps.slice(0, 3).map((step, stepIndex) => (
                            <li key={stepIndex} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                {stepIndex + 1}
                              </span>
                              <span onClick={() => speakText(step)} className="cursor-pointer">
                                {step.length > 50 ? step.substring(0, 50) + '...' : step}
                              </span>
                            </li>
                          ))}
                          {phase.steps.length > 3 && (
                            <li className="text-xs text-gray-500 italic">+{phase.steps.length - 3} more steps</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Support Resources</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {getRecommendations().resources.map((category, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-800 mb-3 text-sm">{category.category}</h4>
                        <div className="space-y-2">
                          {category.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex} className="bg-white border border-gray-200 rounded p-2">
                              <h5 className="font-semibold text-gray-800 text-xs mb-1" onClick={() => speakText(resource.name)}>
                                {resource.name}
                              </h5>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <a
                                    href={`tel:${resource.phone.replace(/\s/g, '')}`}
                                    onClick={() => speakText(`Calling ${resource.phone}`)}
                                    className="cursor-pointer text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {resource.phone}
                                  </a>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" />
                                  <a
                                    href={resource.website.startsWith('http') ? resource.website : `https://${resource.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => speakText(`Opening website ${resource.website}`)}
                                    className="cursor-pointer text-blue-600 hover:text-blue-800 truncate underline"
                                  >
                                    {resource.website}
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'prevention' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Prevention Tips for the Future</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {getRecommendations().preventionTips.map((category, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-800 mb-3 text-sm">{category.category}</h4>
                        <ul className="space-y-2">
                          {category.tips.slice(0, 4).map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2">
                              <Shield className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span
                                className="text-xs text-gray-700 cursor-pointer"
                                onClick={() => speakText(tip)}
                              >
                                {tip.length > 60 ? tip.substring(0, 60) + '...' : tip}
                              </span>
                            </li>
                          ))}
                          {category.tips.length > 4 && (
                            <li className="text-xs text-gray-500 italic">+{category.tips.length - 4} more tips</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Emergency Contacts & Important Reminders</h3>

                  {/* Emergency Contacts - Compact Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                      { name: 'Emergency', phone: '000', icon: AlertCircle, color: 'red' },
                      { name: 'Lifeline', phone: '13 11 14', icon: Heart, color: 'purple' },
                      { name: 'Scamwatch', phone: '1300 302 502', icon: Shield, color: 'orange' },
                      { name: 'IDCARE', phone: '1800 595 160', icon: Users, color: 'blue' }
                    ].map((contact, index) => (
                      <div key={index} className={`bg-${contact.color}-500 border border-${contact.color}-600 rounded-lg p-3 text-center text-white`}>
                        <contact.icon className="h-6 w-6 mx-auto mb-1" />
                        <h4 className="font-bold text-sm mb-1" onClick={() => speakText(contact.name)}>
                          {contact.name}
                        </h4>
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, '')}`}
                          className="text-xs font-semibold hover:underline"
                          onClick={() => speakText(`Calling ${contact.phone}`)}
                        >
                          {contact.phone}
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Important Reminders - Compact List */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 text-sm">⚠️ Important Reminders</h4>
                    <ul className="space-y-2">
                      {[
                        'Legitimate organizations never ask for passwords over the phone',
                        'You are not to blame - scammers are professionals',
                        'Recovery takes time - be patient with the process',
                        'Beware of recovery scams targeting previous victims'
                      ].map((reminder, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span
                            className="text-xs text-gray-700 cursor-pointer"
                            onClick={() => speakText(reminder)}
                          >
                            {reminder}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact Summary and Actions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Situation Summary - Compact */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📋 Your Situation Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <strong>Situation:</strong> {questions[0].options.find(opt => opt.value === answers[0])?.label}
                  </div>
                  {answers[1] && questions[1] && (
                    <div className="bg-white p-2 rounded border">
                      <strong>Type:</strong> {questions[1].options.find(opt => opt.value === answers[1])?.label}
                    </div>
                  )}
                  {answers[4] && (
                    <div className="bg-white p-2 rounded border">
                      <strong>Urgency:</strong> {questions[4].options.find(opt => opt.value === answers[4])?.label}
                    </div>
                  )}
                  {answers[5] && (
                    <div className="bg-white p-2 rounded border">
                      <strong>Actions:</strong> {questions[5].options.find(opt => opt.value === answers[5])?.label}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Compact */}
              <div className="flex flex-col gap-3 lg:w-64">
                <button
                  onClick={restart}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 justify-center border border-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Start Over
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 justify-center border border-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FileText className="h-5 w-5" />
                  Print Guide
                </button>
              </div>
            </div>

            {/* Final Encouragement - Compact */}
            <div className="mt-6 bg-green-600 text-white rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-200" />
                <span
                  className="font-semibold cursor-pointer"
                  onClick={() => speakText('You\'re taking the right steps. Recovery takes time, but you\'re not alone.')}
                >
                  You're taking the right steps. Recovery takes time, but you're not alone.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};