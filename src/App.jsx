import React, { useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BundleForm from './components/BundleForm';
import Footer from './components/Footer';


// Current app version. Increment this whenever deploying major changes.
const CURRENT_VERSION = "1.0.1";

function App() {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Add a timestamp to prevent the browser from caching this fetch request
        const response = await fetch(`/version.json?t=${new Date().getTime()}`);
        if (response.ok) {
          const data = await response.json();
          // If the server's version is different from the app's version, force a reload
          if (data.version && data.version !== CURRENT_VERSION) {
            console.log(`New version detected (${data.version}). Reloading...`);
            window.location.reload(true);
          }
        }
      } catch (error) {
        console.error("Failed to check app version:", error);
      }
    };

    checkVersion();
    
    // Check every 5 minutes if the app stays open without refreshing
    const interval = setInterval(checkVersion, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
              <p className="text-gray-600">Contact your student administration to receive your exclusive student bundle code.</p>
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
              <h3 className="font-semibold text-lg mb-2">Who is eligible for student bundles?</h3>
              <p className="text-gray-600">These exclusive bundles are available to students.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">How do I get my student bundle code?</h3>
              <p className="text-gray-600">Contact your student administration to receive your unique bundle code.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Can I use multiple bundle codes?</h3>
              <p className="text-gray-600">Each bundle code can only be used once per phone number. Please check with your student administration for multiple activation options.</p>
            </div>
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
