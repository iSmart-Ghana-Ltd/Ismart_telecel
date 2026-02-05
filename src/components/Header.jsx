import React, { useState } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavClick = (section) => {
        // Smooth scroll to section or handle navigation
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img 
                            src="/telecellogo.png" 
                            alt="Telecel Logo" 
                            className="w-10 h-10 object-contain"
                        />
                        <div>
                            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E30613] to-[#CC050F]">
                                Telecel
                            </div>
                            <div className="text-xs text-gray-500">Staff & Student Bundles</div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <button 
                            onClick={() => handleNavClick('home')}
                            className="text-gray-600 hover:text-telecel-red transition-colors font-medium"
                        >
                            Home
                        </button>
                        <button 
                            onClick={() => handleNavClick('bundles')}
                            className="text-telecel-red border-b-2 border-telecel-red pb-1 font-medium"
                        >
                            Bundles
                        </button>
                        <button 
                            onClick={() => handleNavClick('how-it-works')}
                            className="text-gray-600 hover:text-telecel-red transition-colors font-medium"
                        >
                            How It Works
                        </button>
                        <button 
                            onClick={() => handleNavClick('faq')}
                            className="text-gray-600 hover:text-telecel-red transition-colors font-medium"
                        >
                            FAQ
                        </button>
                        <button 
                            onClick={() => handleNavClick('contact')}
                            className="text-gray-600 hover:text-telecel-red transition-colors font-medium"
                        >
                            Contact
                        </button>
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden lg:block">
                        <button 
                            onClick={() => handleNavClick('bundles')}
                            className="bg-[#E30613] hover:bg-[#CC050F] text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-6 h-0.5 bg-gray-600 mb-1.5 transition-all"></div>
                        <div className="w-6 h-0.5 bg-gray-600 mb-1.5 transition-all"></div>
                        <div className="w-6 h-0.5 bg-gray-600 transition-all"></div>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 py-4 border-t border-gray-200">
                        <nav className="flex flex-col gap-4">
                            <button 
                                onClick={() => handleNavClick('home')}
                                className="text-left text-gray-600 hover:text-telecel-red transition-colors font-medium py-2"
                            >
                                Home
                            </button>
                            <button 
                                onClick={() => handleNavClick('bundles')}
                                className="text-left text-telecel-red font-medium py-2 border-l-4 border-telecel-red pl-4"
                            >
                                Bundles
                            </button>
                            <button 
                                onClick={() => handleNavClick('how-it-works')}
                                className="text-left text-gray-600 hover:text-telecel-red transition-colors font-medium py-2"
                            >
                                How It Works
                            </button>
                            <button 
                                onClick={() => handleNavClick('faq')}
                                className="text-left text-gray-600 hover:text-telecel-red transition-colors font-medium py-2"
                            >
                                FAQ
                            </button>
                            <button 
                                onClick={() => handleNavClick('contact')}
                                className="text-left text-gray-600 hover:text-telecel-red transition-colors font-medium py-2"
                            >
                                Contact
                            </button>
                            <button 
                                onClick={() => handleNavClick('bundles')}
                                className="bg-[#E30613] text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 mt-4"
                            >
                                Get Started
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
