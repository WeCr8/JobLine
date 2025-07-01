// File type validation
export function isValidFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
}
// File size validation (maxSize in bytes)
export function isValidFileSize(file, maxSize) {
    return file.size <= maxSize;
}
// Base64 encode (browser)
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// Base64 decode to Blob
export function base64ToBlob(base64, mimeType = '') {
    const byteString = atob(base64.split(',')[1] || base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
}
// Blob to File
export function blobToFile(blob, fileName) {
    return new File([blob], fileName, { type: blob.type });
}
// Image compression/resizing (browser, returns a Blob)
export function resizeImage(file, maxWidth, maxHeight, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;
            const aspect = width / height;
            if (width > maxWidth) {
                width = maxWidth;
                height = Math.round(width / aspect);
            }
            if (height > maxHeight) {
                height = maxHeight;
                width = Math.round(height * aspect);
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return reject(new Error('Canvas not supported'));
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (blob)
                    resolve(blob);
                else
                    reject(new Error('Image compression failed'));
            }, file.type, quality);
        };
        img.onerror = reject;
        fileToBase64(file).then((base64) => {
            img.src = base64;
        }).catch(reject);
    });
}
