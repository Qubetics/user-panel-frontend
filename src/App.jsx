import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import NetworkAnalytics from './components/NetworkAnalytics';
import QuickStart from './components/QuickStart';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <NetworkAnalytics />
      <QuickStart />
      <Footer />
    </div>
  );
}

export default App;