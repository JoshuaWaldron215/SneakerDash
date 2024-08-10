"use client";

import React, { useState } from 'react';
import { useAppDispatch } from '@/app/redux';
import { setUserName } from '@/app/state/userSlice';

const SignInPage = () => {
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();

  const handleSignIn = () => {
    dispatch(setUserName(name));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded mb-4 w-64"
      />
      <button
        onClick={handleSignIn}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign In
      </button>
    </div>
  );
};

export default SignInPage;