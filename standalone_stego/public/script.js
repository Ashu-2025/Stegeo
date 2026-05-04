// --- Tab Switching Logic ---
function switchTab(tab) {
    const encodeSection = document.getElementById('encode');
    const decodeSection = document.getElementById('decode');
    const encodeBtn = document.getElementById('tab-encode');
    const decodeBtn = document.getElementById('tab-decode');

    if (tab === 'encode') {
        encodeSection.classList.remove('hidden');
        decodeSection.classList.add('hidden');
        encodeBtn.classList.add('active');
        decodeBtn.classList.remove('active');
    } else {
        encodeSection.classList.add('hidden');
        decodeSection.classList.remove('hidden');
        encodeBtn.classList.remove('active');
        decodeBtn.classList.add('active');
    }
}

// --- Helper: Preview Image ---
const imageInput = document.getElementById('imageInput');
const dropzone = document.getElementById('dropzone');
const imagePreview = document.getElementById('imagePreview');
const previewContainer = document.getElementById('previewContainer');

dropzone.onclick = () => imageInput.click();

imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
            imagePreview.src = re.target.result;
            previewContainer.classList.remove('hidden');
            dropzone.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
};

// --- Encode Logic ---
const encodeForm = document.getElementById('encodeForm');
const encodeBtn = document.getElementById('encodeBtn');
const resultArea = document.getElementById('resultArea');
const resultImage = document.getElementById('resultImage');
const downloadLink = document.getElementById('downloadLink');
const shareBtn = document.getElementById('shareBtn');

encodeForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('message', document.getElementById('message').value);
    formData.append('password', document.getElementById('password').value);

    encodeBtn.disabled = true;
    encodeBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Processing...';
    lucide.createIcons();

    try {
        const response = await fetch('/api/hide', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            resultImage.src = data.imageUrl;
            downloadLink.href = data.imageUrl;
            resultArea.classList.remove('hidden');
            
            // Store the full URL for sharing
            shareBtn.dataset.url = data.fullUrl;
        } else {
            alert(data.error || 'Encoding failed');
        }
    } catch (err) {
        alert('Server error. Make sure the backend is running.');
    } finally {
        encodeBtn.disabled = false;
        encodeBtn.innerHTML = '<i data-lucide="cpu"></i> Process & Hide';
        lucide.createIcons();
    }
};

// --- Decode Logic ---
const decodeForm = document.getElementById('decodeForm');
const decodeBtn = document.getElementById('decodeBtn');
const decodedResult = document.getElementById('decodedResult');
const messageOutput = document.getElementById('messageOutput');

decodeForm.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', document.getElementById('decodeImageInput').files[0]);
    formData.append('password', document.getElementById('decodePassword').value);

    decodeBtn.disabled = true;
    decodeBtn.innerHTML = 'Extracting...';

    try {
        const response = await fetch('/api/extract', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            messageOutput.textContent = data.message;
            decodedResult.classList.remove('hidden');
        } else {
            alert(data.error || 'Extraction failed');
        }
    } catch (err) {
        alert('Server error.');
    } finally {
        decodeBtn.disabled = false;
        decodeBtn.textContent = 'Extract Message';
    }
};

// --- Share Logic ---
shareBtn.onclick = async () => {
    const shareUrl = shareBtn.dataset.url;
    
    if (!shareUrl) return;

    if (navigator.share) {
        try {
            const response = await fetch(shareUrl);
            const blob = await response.blob();
            const file = new File([blob], 'secret-image.png', { type: 'image/png' });

            await navigator.share({
                title: 'Secret Image',
                text: 'I have hidden a secret message for you inside this image. Use StegoShare to reveal it!',
                files: [file]
            });
        } catch (err) {
            try {
                await navigator.share({
                    title: 'Secret Image',
                    url: shareUrl
                });
            } catch (e) {
                console.error('Share failed', e);
            }
        }
    } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = shareUrl;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('Share API not supported. Link copied!');
    }
};
