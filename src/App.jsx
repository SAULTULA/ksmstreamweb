import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Pricing from './components/Pricing/Pricing';
import Summary from './components/Summary/Summary';
import AndroidSection from './components/AndroidSection/AndroidSection';
import SignupForm from './components/SignupForm/SignupForm';
import Terms from './components/Terms/Terms';
import Footer from './components/Footer/Footer';
import WhatsAppFAB from './components/WhatsAppFAB/WhatsAppFAB';
import './index.css';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Summary />
        <AndroidSection />
        <SignupForm />
        <Terms />
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}
