"use client";

import { useState } from "react";

export default function IssueTap({menu}:{menu:string[]}) {

    const [activeTab, setActiveTab] = useState('전체');
    
    return (
    <div className="flex gap-8 border-b border-white/5 mb-8">
        {menu.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-black tracking-widest transition-all ${
              activeTab === tab ? 'text-[#00FFA3] border-b-2 border-[#00FFA3]' : 'text-gray-500'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
    )

}