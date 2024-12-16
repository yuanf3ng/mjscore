type ToastType = 'success' | 'error' | 'warning';

interface ToastEvent {
  message: string;
  type: ToastType;
}

export const showToast = (message: string, type: ToastType = 'success') => {
  const event = new CustomEvent<ToastEvent>('showToast', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
};