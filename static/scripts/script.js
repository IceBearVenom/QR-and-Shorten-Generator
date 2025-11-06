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

document.getElementById("qrForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = formData.get("data-qr");

    // Trigger file download
    const link = document.createElement("a");
    link.href = `/generate-qr?data_qr=${encodeURIComponent(data)}`;
    link.download = "qrcode.png";
    link.click();

    // Redirect to home after 2 seconds
    setTimeout(() => {
        window.location.href = "/";
    }, 5000);
});