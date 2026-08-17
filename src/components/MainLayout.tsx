// src/components/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingChatbot from './FloatingChatbot';

const MainLayout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* This is where your page components will be rendered */}
      </main>
      <FloatingChatbot /> {
        
      }
    </div>
  );
};

export default MainLayout;