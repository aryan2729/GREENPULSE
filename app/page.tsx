'use client';
import { useStore, PageId } from '@/store/useStore';
import Navbar from '@/components/ui/Navbar';
import HomePage from '@/components/ui/HomePage';
import MapPage from '@/components/map/MapPage';
import CitizenPage from '@/components/citizen/CitizenPage';
import CommunityPage from '@/components/community/CommunityPage';
import RewardsPage from '@/components/rewards/RewardsPage';
import AdminPage from '@/components/admin/AdminPage';
import SOSModal from '@/components/safety/SOSModal';
import { useEffect, useRef } from 'react';

export default function App() {
  const { activePage, showSOS, darkMode, setHydrated, _hydrated } = useStore();
  const prevPage = useRef<PageId>(activePage);

  // Fix hydration: set alias client-side only after mount
  useEffect(() => {
    setHydrated();
  }, []);

  // Scroll to top on every page change
  useEffect(() => {
    if (prevPage.current !== activePage) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      prevPage.current = activePage;
    }
  }, [activePage]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-950' : 'bg-[#f0f7f2]'}`}>
      <Navbar />
      {activePage === 'home'      && <HomePage />}
      {activePage === 'map'       && <MapPage />}
      {activePage === 'citizen'   && <CitizenPage />}
      {activePage === 'community' && <CommunityPage />}
      {activePage === 'rewards'   && <RewardsPage />}
      {activePage === 'admin'     && <AdminPage />}
      {showSOS && <SOSModal />}
    </div>
  );
}
