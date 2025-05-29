'use client'
import toast from 'react-hot-toast';
import { Toaster } from '../lib/components/Toast';
import { useEffect } from 'react';

const notifySuccess = () => toast.success('Operation completed successfully!');
const notifyError = () => toast.error('An error occurred while processing your request.');
const notifyWarning = () => toast.loading('Please review your changes before proceeding.');
const notifyInfo = () => toast('Here is some important information for you.');

// Simulate an async operation
const simulateAsyncOperation = () => {
  return new Promise((resolve, reject) => {
    const shouldSucceed = Math.random() > 0.3; // 70% chance of success
    setTimeout(() => {
      if (shouldSucceed) {
        resolve('Data fetched successfully!');
      } else {
        reject(new Error('Failed to fetch data'));
      }
    }, 2000);
  });
};

const notifyPromise = async () => {
  const promise = simulateAsyncOperation();

  toast.promise(promise, {
    loading: 'Fetching data...',
    success: (data) => `${data}`,
    error: (err) => `Error: ${err.message}`,
  });
};

export default function Page() {

  useEffect(() => {
    notifySuccess();
    notifyError();
    notifyWarning();
    notifyInfo();
  }, []);

  return (
    <div data-theme="dark" className="p-4 space-y-4">

      <Toaster />
    </div>
  );
}




