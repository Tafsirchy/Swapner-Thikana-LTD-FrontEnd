import toast from 'react-hot-toast';

// Success Toast
export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#059669',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
  });
};

// Error Toast
export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px',
    },
  });
};

// Loading Toast
export const showLoading = (message) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      padding: '16px',
      borderRadius: '8px',
    },
  });
};

// Dismiss Toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Promise Toast
export const showPromiseToast = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Error occurred',
    },
    {
      position: 'top-right',
      style: {
        padding: '16px',
        borderRadius: '8px',
      },
    }
  );
};

export default toast;
