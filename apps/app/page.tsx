'use client'
import toast, { Toaster } from 'react-hot-toast';

const notify = () => toast('Here is your toast.');

export default function Page() {

  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{
        }}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: 'var(--content-background-body-base)',
            color: 'var(--content-presentation-global-primary)',
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'var(--content-presentation-global-primary)',
              secondary: 'var(--content-presentation-global-secondary)',
            },
          },
        }}
      />
    </div>
  );
}




