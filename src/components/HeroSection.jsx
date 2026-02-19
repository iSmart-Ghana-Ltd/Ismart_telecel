import React from 'react';

const HeroSection = () => {
    return (
        <div id="home" className="relative h-[600px] w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl group">
            <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop"
                alt="Students using mobile devices"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Red Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-telecel-red/60 via-transparent to-transparent opacity-80" />

            {/* Glassmorphism Card */}
            <div className="absolute bottom-10 left-10 right-10 backdrop-blur-md bg-white/20 border border-white/30 p-6 rounded-2xl text-white">
                <div className="flex gap-1 mb-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/80" />)}
                </div>
                <h3 className="text-2xl font-bold mb-1">Student Bundle</h3>
                <p className="text-white/90 text-sm">
                    Exclusive Telecel bundles designed for students. Enjoy special rates and benefits.
                </p>
            </div>
        </div>
    );
};

export default HeroSection;
