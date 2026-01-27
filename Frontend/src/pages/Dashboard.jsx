import React, { useState } from 'react';

import ProductsSetting from '../components/dashbord/productsSetting';
import OffersSetting from '../components/dashbord/offersSetting';
import { Archive, Plus, MessageSquare } from 'lucide-react';

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState('products');

    const menuItems = [
    { id: 'products', icon: Archive, label: 'المنتجات' },
    { id: 'offers', icon: Plus, label: 'العروض' },
    { id: 'reviews', icon: MessageSquare, label: 'الآراء' },
  ];

    const renderContent = () => {
        switch (activeSection) {
            case 'products':
                return <ProductsSetting />;
            case 'offers':
                return <OffersSetting />;
            default:
                return <ProductsSetting />;
        }
    };
    return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <div className="w-16 bg-white shadow-lg flex flex-col items-center py-6 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative group ${
                isActive 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
              title={item.label}
            >
              <Icon size={24} />
              
              {/* Tooltip */}
              <span className="absolute right-16 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}