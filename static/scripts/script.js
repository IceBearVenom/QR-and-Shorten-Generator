// ============= VARIABLES =============
const mainContainer = document.querySelectorAll('.main-container');

function clickDisplay(btn){
    // Get Parent
    const btnParent = btn.parentElement.parentElement;
    const buttonParent = btn.parentElement;
    // Change Button Color
    Array.from(buttonParent.children).forEach(child => {
        child.classList.remove('selected');
    })
    // Check Class
    Array.from(btnParent.children).forEach(child => {
        // Reset Class
        child.classList.remove('selected');
        // Checking
        if (child.className === 'main-container'){
            if (child.id.includes(btn.id)){
                // Display Selected
                child.classList.add('selected');
                // Change Button Color
                btn.classList.add('selected');
            }
        }
    })
}

// QR Submit 
document.getElementById("qrForm").addEventListener("submit", async (e) => {
    // Basic Setup
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = formData.get('data-qr');
    const outputParent = document.getElementById('output');

    // Send data via fetch
    const response = await fetch(`/generate-qr?data_qr=${encodeURIComponent(data)}`);
    if (!response.ok){
        return;
    }

    // Convert image to blob
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    // Show in <img>
    const imgPreview = document.createElement('img');
    imgPreview.src = imageUrl;

    // Optional: Add download button
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.innerText = "Download";
    downloadLink.onclick = afterDownload;

    // Append Children
    outputParent.appendChild(imgPreview);
    outputParent.appendChild(downloadLink);

    downloadLink.download = "qrcode.png";
});
async function afterDownload (btn){
    // Get Parent
    const btnParent = btn.parentElement;
    // Clearing
    console.log(btnParent);
    // Back To Main Page
    window.location.href = "/";
}
// Shorten URL Submit
document.getElementById('shortForm').addEventListener("submit", async (e) => {
    // Basic Setup
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = formData.get("data-shorten");
    const outputParent = document.getElementById('output');
    let urlOutput = "";

    // Send Data via Fetch
    await fetch(`/generate-shorten?data_shorten=${encodeURIComponent(data)}`)
        .then(res => res.json())
        .then(data => urlOutput = data.short_url);

    let formattedOutput = `
        <p id="outputUrl">${urlOutput}</p>
        <i class="bi bi-copy" title="Copy Url" onclick="copyUrl(this)"></i>`;

    // Add to Output
    outputParent.innerHTML = formattedOutput;
})

function copyUrl(btn){
    // Load element
    const btnParent = btn.parentElement;
    // Get Child
    const outputUrl = btnParent.querySelector('#outputUrl');
    // Copying
    navigator.clipboard.writeText(outputUrl.innerText)
    .then(() => {
        window.location.href = "/";
    })
    .catch(err => {
        console.error("Failed to copy: ", err);
    });
}