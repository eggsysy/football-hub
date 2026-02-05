// src/app/profile/page.tsx
import React from 'react';

export default function ProfilePage() {
  return (
    <main className="p-12 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter">
          User Profile
        </h1>
        <p className="text-slate-500 font-medium">Manage your GoalStrkr account and preferences.</p>
      </header>
      
      <div className="grid gap-8">
        {/* Placeholder for Profile Details */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Account Security</h2>
          <div className="h-32 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
            <span className="text-slate-300 font-bold italic">Login & Password settings coming soon</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-800">App Preferences</h2>
          <div className="h-32 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
            <span className="text-slate-300 font-bold italic">Dark Mode & Notification toggles coming soon</span>
          </div>
        </div>
      </div>
    </main>
  );
}