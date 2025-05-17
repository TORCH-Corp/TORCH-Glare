'use client'
import toast from 'react-hot-toast';
import { Toaster } from '../lib/components/Toast';

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
  return (
    <div data-theme="dark" className="p-4 space-y-4">
      <div className="flex flex-col gap-2">
        <button
          onClick={notifySuccess}
          className="px-4 py-2 bg-background-presentation-state-success-secondary text-content-presentation-global-primary rounded-md hover:opacity-90 transition-opacity"
        >
          Show Success Toast
        </button>

        <button
          onClick={notifyError}
          className="px-4 py-2 bg-background-presentation-state-negative-secondary text-content-presentation-global-primary rounded-md hover:opacity-90 transition-opacity"
        >
          Show Error Toast
        </button>

        <button
          onClick={notifyWarning}
          className="px-4 py-2 bg-background-presentation-state-warning-secondary text-content-presentation-global-primary rounded-md hover:opacity-90 transition-opacity"
        >
          Show Warning Toast
        </button>

        <button
          onClick={notifyInfo}
          className="px-4 py-2 bg-background-presentation-state-information-secondary text-content-presentation-global-primary rounded-md hover:opacity-90 transition-opacity"
        >
          Show Info Toast
        </button>

        <button
          onClick={notifyPromise}
          className="px-4 py-2 bg-background-presentation-action-primary text-content-presentation-action-light-primary rounded-md hover:opacity-90 transition-opacity"
        >
          Show Promise Toast
        </button>
      </div>

      <Toaster />
    </div>
  );
}




