// Clipboard utilities

export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
    return Promise.resolve();
  }
}

export async function readFromClipboard() {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.readText();
  } else {
    return Promise.reject(new Error('Clipboard API not supported'));
  }
} 