import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children }) {
  const { isDark } = useTheme();
  
  return (
    <div 
      className="min-h-screen flex flex-col transition-colors overflow-x-hidden"
      style={{
        backgroundColor: isDark ? '#111827' : '#ffffff',
        color: isDark ? '#f9fafb' : '#111827'
      }}
    >
      <header 
        className="border-b transition-colors"
        style={{
          borderColor: isDark ? '#374151' : '#e5e7eb',
          backgroundColor: isDark ? '#111827' : '#ffffff'
        }}
      >
        <div className="w-full px-0">
          <Header />
        </div>
      </header>
      <main 
        className="flex-1 transition-colors overflow-x-hidden"
        style={{
          backgroundColor: isDark ? '#111827' : '#ffffff'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 w-full">
          {children}
        </div>
      </main>
      <div 
        className="border-t transition-colors"
        style={{
          borderColor: isDark ? '#374151' : '#e5e7eb',
          backgroundColor: isDark ? '#111827' : '#ffffff'
        }}
      >
        <div className="w-full px-0">
          <Footer />
        </div>
      </div>
    </div>
  );
}


