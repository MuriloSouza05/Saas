/**
 * Utility to fix Radix UI Dialog body freeze issues
 * This fixes the common issue where pointer-events: none gets stuck on body
 */

export const fixDialogBodyFreeze = () => {
  // Force remove pointer-events: none from body
  if (document.body.style.pointerEvents === 'none') {
    document.body.style.pointerEvents = '';
  }
  
  // Also check for any data attributes that might cause issues
  const body = document.body;
  if (body.getAttribute('data-scroll-locked') === 'true') {
    body.removeAttribute('data-scroll-locked');
  }
  
  // Force restore body overflow if hidden
  if (body.style.overflow === 'hidden') {
    body.style.overflow = '';
  }
};

export const createSafeDialogHandler = (callback: () => void) => {
  return () => {
    try {
      // Use setTimeout to ensure the callback runs after React's cleanup
      setTimeout(() => {
        callback();
        // Force fix any potential body freeze
        fixDialogBodyFreeze();
      }, 0);
    } catch (error) {
      console.error('Dialog handler error:', error);
      // Ensure we still fix the body even if there's an error
      fixDialogBodyFreeze();
      callback();
    }
  };
};

export const createSafeDialogCloseHandler = (onOpenChange: (open: boolean) => void) => {
  return createSafeDialogHandler(() => {
    onOpenChange(false);
  });
};

// Hook to automatically fix dialog issues on unmount
export const useDialogFix = () => {
  React.useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      fixDialogBodyFreeze();
    };
  }, []);
};

// Custom onOpenChange handler that includes the fix
export const createSafeOnOpenChange = (onOpenChange: (open: boolean) => void) => {
  return (open: boolean) => {
    if (!open) {
      // When closing dialog, apply the fix
      setTimeout(() => {
        fixDialogBodyFreeze();
      }, 100); // Small delay to let Radix finish its cleanup
    }
    onOpenChange(open);
  };
};
