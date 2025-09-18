import React from 'react';
import { Phone, ExternalLink, Shield, AlertCircle, Users, FileText } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export const SupportPage: React.FC = () => {
  const { speakText } = useAccessibility();

  const resources = [
    {
      name: 'Scamwatch',
      purpose: 'For reporting scams and getting up-to-date information about current scam trends.',
      phone: '1300 795 995',
      website: 'scamwatch.gov.au',
      icon: AlertCircle,
      description: 'Run by the Australian Competition and Consumer Commission (ACCC), Scamwatch provides information to help you recognize, avoid and report scams.'
    },
    {
      name: 'Australian Cyber Security Centre (ACSC)',
      purpose: 'The government\'s lead agency for cyber security advice and incident response.',
      phone: '1300 292 371',
      website: 'cyber.gov.au',
      icon: Shield,
      description: 'Provides cyber security advice for individuals, businesses, and government. Report cyber incidents and get the latest threat information.'
    },
    {
      name: 'IDCARE',
      purpose: 'Australia\'s national identity and cyber support service for identity theft and misuse.',
      phone: '1800 595 160',
      website: 'idcare.org',
      icon: Users,
      description: 'Free service providing case management and remediation support for identity compromise and cyber incidents affecting individuals and businesses.'
    },
    {
      name: 'ReportCyber',
      purpose: 'The Australian government\'s central place to report cybercrime and cyber security incidents.',
      phone: 'Online reporting only',
      website: 'reportcyber.gov.au',
      icon: FileText,
      description: 'Report cybercrime incidents online. Your reports help law enforcement and government agencies understand cyber threats and protect the community.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
      {/* Page Title */}
      <div className="text-center">
        <h1 
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 cursor-pointer"
          onClick={() => speakText('Help and Support in Australia')}
        >
          Help and Support in Australia
        </h1>
        <p 
          className="text-xl text-gray-600 cursor-pointer"
          onClick={() => speakText('Official Australian resources for cybersecurity help and support')}
        >
          Official Australian resources for cybersecurity help and support
        </p>
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <Phone className="h-8 w-8 text-red-500 flex-shrink-0" />
          <div>
            <h2 
              className="text-2xl font-bold text-red-700 mb-2 cursor-pointer"
              onClick={() => speakText('In an Emergency')}
            >
              In an Emergency
            </h2>
            <p 
              className="text-xl text-red-700 cursor-pointer"
              onClick={() => speakText('If you are in immediate danger or need emergency assistance, call 000 (triple zero) immediately.')}
            >
              If you are in immediate danger or need emergency assistance, call <strong>000 (triple zero)</strong> immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Support Resources */}
      <div className="space-y-8">
        <h2 
          className="text-3xl font-bold text-gray-800 cursor-pointer"
          onClick={() => speakText('Official Support Services')}
        >
          Official Support Services
        </h2>

        {resources.map((resource, index) => (
          <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-8 hover:border-blue-300 transition-colors duration-200">
            <div className="flex items-start gap-6">
              <resource.icon className="h-16 w-16 text-blue-500 flex-shrink-0 mt-2" />
              <div className="flex-1">
                <h3 
                  className="text-2xl font-bold text-gray-800 mb-2 cursor-pointer"
                  onClick={() => speakText(resource.name)}
                >
                  {resource.name}
                </h3>
                
                <p 
                  className="text-xl text-gray-600 mb-4 cursor-pointer"
                  onClick={() => speakText(resource.purpose)}
                >
                  {resource.purpose}
                </p>
                
                <p 
                  className="text-lg text-gray-700 mb-4 cursor-pointer"
                  onClick={() => speakText(resource.description)}
                >
                  {resource.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <span 
                      className="text-xl font-semibold text-gray-800 cursor-pointer"
                      onClick={() => speakText(`Phone: ${resource.phone}`)}
                    >
                      {resource.phone}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-blue-500" />
                    <span 
                      className="text-xl font-semibold text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={() => speakText(`Website: ${resource.website}`)}
                    >
                      {resource.website}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Help Section */}
      <section className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
        <h2 
          className="text-3xl font-bold text-gray-800 mb-6 cursor-pointer"
          onClick={() => speakText('Getting Help')}
        >
          Getting Help
        </h2>
        <div className="space-y-4 text-xl text-gray-700">
          <p 
            className="cursor-pointer"
            onClick={() => speakText('All services listed are free and operated by the Australian government or trusted organizations.')}
          >
            All services listed are <strong>free</strong> and operated by the Australian government or trusted organizations.
          </p>
          <p 
            className="cursor-pointer"
            onClick={() => speakText('Most services are available 24 hours a day, 7 days a week.')}
          >
            Most services are available <strong>24 hours a day, 7 days a week</strong>.
          </p>
          <p 
            className="cursor-pointer"
            onClick={() => speakText('Don\'t hesitate to call multiple services if you need different types of help.')}
          >
            Don't hesitate to call multiple services if you need different types of help.
          </p>
          <p 
            className="cursor-pointer"
            onClick={() => speakText('If you\'re not sure which service to contact, start with Scamwatch - they can guide you to the right resource.')}
          >
            If you're not sure which service to contact, start with <strong>Scamwatch</strong> - they can guide you to the right resource.
          </p>
        </div>
      </section>
    </div>
  );
};