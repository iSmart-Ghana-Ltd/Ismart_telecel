import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-12">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                <div className="flex justify-center gap-6 mb-4 font-medium">
                    <a href="#" className="hover:text-telecel-red transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-telecel-red transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-telecel-red transition-colors">Telecel Help</a>
                </div>
                <p>© {new Date().getFullYear()} Telecel Ghana. All rights reserved.</p>
                <p className="mt-2 text-xs opacity-70">Empowering Students within you.</p>
            </div>
        </footer>
    );
};

export default Footer;
