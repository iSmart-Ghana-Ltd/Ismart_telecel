import React, { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

const BundleForm = () => {
    const generateSessionId = () => {
        // Generate a 14-character timestamp string (yyyyMMddHHmmss) which is
        // a standard format for many telecommunications and USSD gateways.
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Add a small 2-digit random number to ensure uniqueness if generated in the same second
        const randomStr = String(Math.floor(Math.random() * 100)).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}${randomStr}`;
    };

    // Initialize bundle code from localStorage or default
    const [network, setNetwork] = useState('Telecel');
    const [bundleCode, setBundleCode] = useState(() => {
        const saved = localStorage.getItem('telecelBundleCode');
        return saved || '797*10';
    });
    const [phone, setPhone] = useState('');
    const [studentId, setStudentId] = useState('');
    const [showIdField, setShowIdField] = useState(false);
    const [showBundleModal, setShowBundleModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showCancellationModal, setShowCancellationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showRetryModal, setShowRetryModal] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [bundleOptions, setBundleOptions] = useState([]);
    const [selectedBundle, setSelectedBundle] = useState('');
    const [retryMessage, setRetryMessage] = useState('');

    // Save bundle code to localStorage whenever it changes
    useEffect(() => {
        if (bundleCode) {
            localStorage.setItem('telecelBundleCode', bundleCode);
        }
    }, [bundleCode]);

    // Format bundle code before submission
    const formatBundleCode = (code) => {
        let formattedCode = code;

        // Auto-add * at the beginning if not present
        if (formattedCode && !formattedCode.startsWith('*')) {
            formattedCode = '*' + formattedCode;
        }

        // Auto-add # at the end if not present and it looks like a bundle code
        if (formattedCode && !formattedCode.endsWith('#') && formattedCode.includes('*')) {
            // Check if it looks like a bundle code (has numbers after *)
            const afterAsterisk = formattedCode.substring(1);
            if (afterAsterisk && /\d/.test(afterAsterisk)) {
                formattedCode = formattedCode + '#';
            }
        }

        return formattedCode;
    };

    // Format phone number before submission
    const formatPhoneNumber = (number) => {
        let formattedNumber = number;

        // Auto-add 233 if starting with 0 and it's 10 digits
        if (formattedNumber.startsWith('0') && formattedNumber.length === 10) {
            formattedNumber = '233' + formattedNumber.substring(1);
        }

        return formattedNumber;
    };
    const parseBundleOptions = (message) => {
        const lines = message.split('\n');
        const options = [];

        lines.forEach(line => {
            const match = line.match(/(\d+)\)\s+(.+?)\s+-\s+(.+)/);
            if (match) {
                options.push({
                    id: match[1],
                    price: match[2],
                    data: match[3]
                });
            }
        });

        return options;
    };
    const [showMenuOptions, setShowMenuOptions] = useState(false);
    const [sessionId, setSessionId] = useState(generateSessionId());
    const API_BASE_URL = import.meta.env.DEV ? '/api/vodafone' : 'https://gravitas.ismartghana.com/api/vodafone';

    const networks = [
        { name: 'Telecel', color: 'bg-telecel-red text-white', icon: '🔴' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!showIdField) {
            // Step 1: Show ID field and send initial request with bundle code
            if (bundleCode && phone) {
                // Format inputs before submission
                const formattedBundleCode = formatBundleCode(bundleCode);
                const formattedPhone = formatPhoneNumber(phone);

                setIsLoading(true);
                try {
                    const payload = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ussd>
    <msg>${formattedBundleCode}</msg>
    <sessionid>${sessionId}</sessionid>
    <msisdn>${formattedPhone}</msisdn>
    <type>1</type>
</ussd>`;

                    console.log('Sending initial request:', payload);

                    const response = await fetch(API_BASE_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/xml',
                            'Accept': 'text/xml',
                        },
                        body: payload
                    });

                    const responseText = await response.text();
                    console.log('API Response:', responseText);

                    if (response.ok) {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(responseText, "text/xml");
                        const msgElement = xmlDoc.querySelector('msg');
                        const typeElement = xmlDoc.querySelector('type');

                        const type = typeElement ? typeElement.textContent : '';
                        const message = msgElement ? msgElement.textContent : '';

                        if (type === '3' || message.toLowerCase().includes('error')) {
                            setRetryMessage(message || 'An error occurred. Please try again.');
                            setShowRetryModal(true);
                            setSessionId(generateSessionId());
                        } else {
                            if (message) {
                                setApiResponse(message);
                            }
                            setShowIdField(true);
                        }
                    } else {
                        console.error('API call failed:', response.status, response.statusText);
                        if (response.status === 404) {
                            alert('API endpoint not found (404). The API URL may be incorrect. Please check the server configuration.');
                        } else {
                            alert(`Request failed: ${response.status} ${response.statusText}`);
                        }
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
                        alert('CORS Error: The API server is not configured for cross-origin requests. Please contact the server administrator to enable CORS for this domain.');
                    } else {
                        alert('An error occurred. Please check your connection and try again.');
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        } else if (!showBundleModal) {
            // Step 2: Send student ID and get bundle options
            if (!studentId.trim()) {
                alert('Please enter your student ID');
                return;
            }

            // Format phone number before submission
            const formattedPhone = formatPhoneNumber(phone);

            setIsLoading(true);
            try {
                const payload = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ussd>
    <msg>${studentId}</msg>
    <sessionid>${sessionId}</sessionid>
    <msisdn>${formattedPhone}</msisdn>
    <type>1</type>
</ussd>`;

                console.log('Sending student ID:', payload);

                const response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/xml',
                        'Accept': 'text/xml',
                    },
                    body: payload
                });

                const responseText = await response.text();
                console.log('Student ID Response:', responseText);

                if (response.ok) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(responseText, "text/xml");
                    const msgElement = xmlDoc.querySelector('msg');

                    if (msgElement) {
                        const message = msgElement.textContent;
                        setApiResponse(message);

                        // Parse bundle options and show modal
                        const options = parseBundleOptions(message);
                        if (options.length > 0) {
                            setBundleOptions(options);
                            setShowBundleModal(true);
                        }
                    }
                } else {
                    console.error('API call failed:', response.status, response.statusText);
                    setSessionId(generateSessionId());
                    alert(`Student ID verification failed: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error submitting student ID:', error);
                if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
                    alert('CORS Error: The API server is not configured for cross-origin requests. Please contact the server administrator to enable CORS for this domain.');
                } else {
                    alert('An error occurred. Please check your connection and try again.');
                }
            } finally {
                setIsLoading(false);
            }
        } else if (!selectedBundle) {
            // Step 3: Show bundle options for selection
            return; // Just show the options, don't proceed
        } else {
            // Step 4: Activate selected bundle
            activateBundle(selectedBundle);
        }
    };

    // Handle bundle selection from modal
    const handleBundleSelection = (option) => {
        setSelectedBundle(option.id);
    };

    // Activate selected bundle
    const activateBundle = async (optionId) => {
        setIsActivating(true);
        try {
            // Format phone number before submission
            const formattedPhone = formatPhoneNumber(phone);

            const payload = `<?xml version="1.0" encoding="UTF-8"?>
<ussd>
    <msg>${optionId}</msg>
    <sessionid>${sessionId}</sessionid>
    <msisdn>${formattedPhone}</msisdn>
    <type>59160</type>
</ussd>`;

            console.log('Sending bundle selection:', payload);

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml',
                    'Accept': 'text/xml',
                },
                body: payload
            });

            const responseText = await response.text();
            console.log('Bundle Selection Response:', responseText);

            if (response.ok) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(responseText, "text/xml");
                const msgElement = xmlDoc.querySelector('msg');

                if (msgElement) {
                    const message = msgElement.textContent;

                    // Check if this is a confirmation request
                    if (message.toLowerCase().includes('confirm') || (message.includes('1') && message.includes('2'))) {
                        // Show confirmation modal
                        setApiResponse(message);
                        setShowConfirmationModal(true);
                    } else if (message.toLowerCase().includes('cancelled') || message.toLowerCase().includes('bundle cancelled')) {
                        // Show cancellation modal
                        setShowBundleModal(false);
                        setShowCancellationModal(true);
                    } else if (message.toLowerCase().includes('member id not verified') || message.toLowerCase().includes('student id not verified')) {
                        // Show retry modal
                        setShowBundleModal(false);
                        setRetryMessage('Member ID not verified. Please check your ID and try again.');
                        setShowRetryModal(true);
                    } else if (message.toLowerCase().includes('an error occurred while processing') || message.toLowerCase().includes('error occurred')) {
                        // Show retry modal
                        setShowBundleModal(false);
                        setRetryMessage('An error occurred while processing. Please try again.');
                        setShowRetryModal(true);
                        setShowSuccessModal(true);
                    }
                }
            } else {
                console.error('API call failed:', response.status, response.statusText);
                setSessionId(generateSessionId());
                alert(`Bundle activation failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error activating bundle:', error);
            if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
                alert('CORS Error: The API server is not configured for cross-origin requests. Please contact the server administrator to enable CORS for this domain.');
            } else {
                alert('An error occurred. Please check your connection and try again.');
            }
        } finally {
            setIsActivating(false);
        }
    };

    // Handle confirmation response
    const handleConfirmation = async (confirm) => {
        setIsConfirming(true);
        try {
            // Format phone number before submission
            const formattedPhone = formatPhoneNumber(phone);

            const payload = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ussd>
    <msg>${confirm ? '1' : '2'}</msg>
    <sessionid>${sessionId}</sessionid>
    <msisdn>${formattedPhone}</msisdn>
    <type>1</type>
</ussd>`;

            console.log('Sending confirmation:', payload);

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml',
                    'Accept': 'text/xml',
                },
                body: payload
            });

            const responseText = await response.text();
            console.log('Confirmation Response:', responseText);

            if (response.ok) {
                if (confirm) {
                    setShowConfirmationModal(false);
                    setShowSuccessModal(true);
                } else {
                    setShowConfirmationModal(false);
                    setShowCancellationModal(true);
                }
            } else {
                console.error('API call failed:', response.status, response.statusText);
                setSessionId(generateSessionId());
                alert(`Confirmation failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error sending confirmation:', error);
            if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
                alert('CORS Error: The API server is not configured for cross-origin requests. Please contact the server administrator to enable CORS for this domain.');
            } else {
                alert('An error occurred. Please check your connection and try again.');
            }
        } finally {
            setIsConfirming(false);
        }
    };

    // Helper to forcefully kill the session on the backend
    const abortUSSDSession = async () => {
        if (!sessionId || !phone) return;

        try {
            const formattedPhone = formatPhoneNumber(phone);
            const payload = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ussd>
    <msg>0</msg>
    <sessionid>${sessionId}</sessionid>
    <msisdn>${formattedPhone}</msisdn>
    <type>3</type>
</ussd>`;

            console.log('Sending abort request:', payload);

            // Send silently in the background
            await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/xml',
                    'Accept': 'text/xml',
                },
                body: payload
            }).catch(e => console.error('Silent abort failed:', e));
        } catch (error) {
            console.error('Error aborting session:', error);
        }
    };

    // Reset form helper
    const resetForm = () => {
        // Only abort if we progressed past the initial screen (have a phone number and open session)
        if (showIdField) {
            abortUSSDSession();
        }

        // Keep bundle code, reset everything else
        setPhone('');
        setStudentId('');
        setNetwork('Telecel');
        setShowIdField(false);
        setShowBundleModal(false);
        setShowConfirmationModal(false);
        setShowCancellationModal(false);
        setShowSuccessModal(false);
        setSelectedBundle('');
        setApiResponse(null);
        setBundleOptions([]);
        setSessionId(generateSessionId());
        setIsActivating(false);
        setIsConfirming(false);
    };

    // Reset and retry helper (preserves bundle code)
    const resetAndRetry = () => {
        // Only abort if we progressed past the initial screen (have a phone number and open session)
        if (showIdField) {
            abortUSSDSession();
        }

        // Keep bundle code and phone, reset everything else
        setStudentId('');
        setShowIdField(false);
        setShowBundleModal(false);
        setShowConfirmationModal(false);
        setShowCancellationModal(false);
        setShowSuccessModal(false);
        setShowRetryModal(false);
        setSelectedBundle('');
        setApiResponse(null);
        setBundleOptions([]);
        setRetryMessage('');
        setSessionId(generateSessionId());
        setIsActivating(false);
        setIsConfirming(false);
        setIsLoading(false);
    };

    return (
        <div id="bundles" className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-center h-[600px]">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Get Your Student Bundle</h2>
                <p className="text-gray-600 mb-6">Exclusive offers for students</p>

                <div className="bg-gradient-to-r from-telecel-red/10 to-red-600/10 p-4 rounded-xl mb-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/telecellogo.png"
                            alt="Telecel Logo"
                            className="w-12 h-12 object-contain"
                        />
                        <div>
                            <div className="font-semibold text-gray-800">Network: Telecel</div>
                            <div className="text-sm text-gray-600">Exclusive student rates</div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bundle Code</label>
                    <input
                        type="text"
                        value={bundleCode}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-600 cursor-not-allowed"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                    <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-telecel-red/20 focus:border-telecel-red transition-all"
                        required
                    />
                </div>

                {showIdField && !showBundleModal && (
                    <div className="animate-fadeIn">
                        <label className="block text-gray-700 font-semibold mb-2">Student ID</label>
                        <input
                            type="text"
                            placeholder="Enter your student ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-telecel-red/20 focus:border-telecel-red transition-all"
                            required
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#E30613] hover:bg-[#CC050F] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {showIdField ? 'Verifying...' : 'Processing...'}
                        </span>
                    ) : (
                        showBundleModal ? 'Activate Selected Bundle' : showIdField ? 'Verify Student ID' : 'Continue'
                    )}
                </button>
            </form>

            {/* Bundle Selection Modal */}
            {showBundleModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Select a Bundle</h3>
                        <div className="space-y-3 mb-6">
                            {bundleOptions.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => handleBundleSelection(option)}
                                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedBundle === option.id
                                        ? 'border-[#E30613] bg-red-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-[#E30613]">{option.price}</div>
                                            <div className="text-sm text-gray-700">{option.data}</div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 transition-all ${selectedBundle === option.id
                                            ? 'border-[#E30613] bg-[#E30613]'
                                            : 'border-gray-300'
                                            }`}>
                                            {selectedBundle === option.id && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={resetForm}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => selectedBundle && activateBundle(selectedBundle)}
                                disabled={!selectedBundle || isActivating}
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedBundle
                                    ? 'bg-[#E30613] text-white hover:bg-[#CC050F]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isActivating ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Activating...
                                    </span>
                                ) : (
                                    'Activate'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Confirm Bundle Activation</h3>
                            <div className="text-sm text-gray-600 whitespace-pre-line">{apiResponse}</div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleConfirmation(false)}
                                disabled={isConfirming}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                                {isConfirming ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Cancelling...
                                    </span>
                                ) : (
                                    'Cancel (2)'
                                )}
                            </button>
                            <button
                                onClick={() => handleConfirmation(true)}
                                disabled={isConfirming}
                                className="flex-1 px-4 py-2 bg-[#E30613] text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[#CC050F] transition-colors"
                            >
                                {isConfirming ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Confirming...
                                    </span>
                                ) : (
                                    'Confirm (1)'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Retry Modal */}
            {showRetryModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 1v1m0 3h-6m-6 0v6h6m2-2v-6h-2m2 6v-6h-2"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Retry Needed</h3>
                        <p className="text-gray-600 mb-6">{retryMessage}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRetryModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={resetAndRetry}
                                className="flex-1 px-4 py-2 bg-[#E30613] text-white rounded-lg text-sm font-medium hover:bg-[#CC050F] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancellation Modal */}
            {showCancellationModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Bundle Cancelled</h3>
                        <p className="text-gray-600 mb-6">The bundle activation has been cancelled. You can start again with the same bundle code.</p>
                        <button
                            onClick={resetForm}
                            className="w-full bg-[#E30613] text-white py-3 rounded-xl font-medium hover:bg-[#CC050F] transition-colors"
                        >
                            Start Again
                        </button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Bundle Purchased!</h3>
                        <p className="text-gray-600 mb-6">You'll receive a payment prompt shortly. Data will be activated after payment.</p>
                        <button
                            onClick={resetForm}
                            className="w-full bg-[#E30613] text-white py-3 rounded-xl font-medium hover:bg-[#CC050F] transition-colors"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BundleForm;
