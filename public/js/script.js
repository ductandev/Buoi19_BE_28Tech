// Show Alert
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("date-time"))
    const closeAlert = document.querySelector("[close-alert]")
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
// End Show Alert

// Button go back
const buttonGoBack = document.querySelectorAll("[button-go-back]")
if (buttonGoBack.length > 0) {
    buttonGoBack.forEach(button => {
        button.addEventListener("click", () => {
            history.back();
        })
    })
}
// End Button go back
