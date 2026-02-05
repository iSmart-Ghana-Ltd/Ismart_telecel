import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BundleForm from './components/BundleForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-12 md:py-16 flex-grow">
        <div id="home" className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start justify-center max-w-6xl mx-auto">
          {/* Left Column: Hero/Visual */}
          <div className="w-full md:w-1/2">
            <HeroSection />
          </div>

          {/* Right Column: Form */}
          <div className="w-full md:w-1/2">
            <BundleForm />
          </div>
        </div>

        {/* Additional sections for navigation */}
        <section id="how-it-works" className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-telecel-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Your Code</h3>
              <p className="text-gray-600">Contact your institution to receive your exclusive staff/student bundle code</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-telecel-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Enter Details</h3>
              <p className="text-gray-600">Fill in your bundle code and phone number on our activation form</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-telecel-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Enjoy Benefits</h3>
              <p className="text-gray-600">Instantly activate your bundle and start enjoying exclusive rates</p>
            </div>
          </div>
        </section>

        <section id="faq" className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Who is eligible for staff & student bundles?</h3>
              <p className="text-gray-600">These exclusive bundles are available to staff and students of participating educational institutions.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">How do I get my institution's bundle code?</h3>
              <p className="text-gray-600">Contact your institution's administration or IT department to receive your unique bundle code.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Can I use multiple bundle codes?</h3>
              <p className="text-gray-600">Each bundle code can only be used once per phone number. Please check with your institution for multiple activation options.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="mt-20 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-8">Our support team is here to assist you with any questions about your staff & student bundles.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#E30613] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#CC050F] transition-colors">
              Call Support
            </button>
            <button className="border-2 border-[#E30613] text-[#E30613] px-8 py-3 rounded-full font-semibold hover:bg-[#E30613] hover:text-white transition-colors">
              Email Support
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Simple floating action button or chat widget placeholder (bottom right) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-all hover:scale-105 border border-gray-100">
          <img 
            src="/telecellogo.png" 
            alt="Telecel Logo" 
            className="w-10 h-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
