const openRosterBtn = document.getElementById("openRosterBtn");
const rosterModal = document.getElementById("rosterModal");
const closeRosterBtn = document.getElementById("closeRosterBtn");
const rosterOverlay = document.getElementById("rosterOverlay");


// Open modal
openRosterBtn.addEventListener("click", function () {

    rosterModal.classList.add("active");

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

});


// Close modal
function closeRosterModal() {

    rosterModal.classList.remove("active");

    // Restore scrolling
    document.body.style.overflow = "";

}


closeRosterBtn.addEventListener("click", closeRosterModal);


rosterOverlay.addEventListener("click", closeRosterModal);


// Close with ESC key
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeRosterModal();
    }

});