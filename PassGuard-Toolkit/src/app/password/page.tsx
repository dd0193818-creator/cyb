"use client";

import React from 'react';
import { PasswordChecker } from '../../components/PasswordChecker';

export default function PasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      {/* Reuse the same header from the main layout – the navigation bar includes the new /password link */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-4 text-center space-y-2 relative z-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Password Strength Checker
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Apne password ki security live check karein aur jaanein use crack karne me kitna time lagega.
        </p>
      </div>
      <div className="max-w-2xl mx-auto px-4 pb-12 relative z-10">
        <PasswordChecker />
      </div>
    </div>
  );
}
