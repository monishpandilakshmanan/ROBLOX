const form = document.querySelector("#loginForm");
const identity = document.querySelector("#identity");
const password = document.querySelector("#password");
const message = document.querySelector("#message");
const title = document.querySelector("#formTitle");
const subtitle = document.querySelector("#formSubtitle");
const submitButton = document.querySelector("#submitButton");
const switchPrompt = document.querySelector("#switchPrompt");
const switchMode = document.querySelector("#switchMode");
let mode = "login";

function showMessage(text) {
  message.textContent = text;
  message.classList.add("visible");
}

function setMode(nextMode) {
  mode = nextMode;
  const signingUp = mode === "signup";
  title.textContent = signingUp ? "Join GAMEHUB" : "Welcome to GAMEHUB";
  subtitle.textContent = signingUp ? "Create your player profile." : "Your next adventure starts here.";
  submitButton.textContent = signingUp ? "Create Account" : "Log In";
  switchPrompt.textContent = signingUp ? "Already have an account?" : "Don't have an account?";
  switchMode.textContent = signingUp ? "Log In" : "Sign Up";
  password.autocomplete = signingUp ? "new-password" : "current-password";
  message.classList.remove("visible");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!identity.value.trim() || !password.value) {
    showMessage("Enter your username/email and password to continue.");
    return;
  }
  // Front-end demonstration only: credentials are deliberately not sent or stored.
  showMessage(mode === "signup"
    ? "Demo sign-up complete! Connect a secure authentication backend to create real accounts."
    : "This is a UI demo, so no login was attempted and your password was not sent or saved. Connect a secure authentication service to enable sign-in.");
  password.value = "";
});

switchMode.addEventListener("click", () => setMode(mode === "login" ? "signup" : "login"));
document.querySelector("#topSignup").addEventListener("click", () => setMode("signup"));

document.querySelector("#forgotButton").addEventListener("click", () => {
  showMessage("Password recovery is a demo here. Add a verified email recovery flow through your authentication provider.");
});
document.querySelector("#codeButton").addEventListener("click", () => {
  showMessage("One-time codes are not sent by this demo. Configure email OTP with your authentication provider to enable this option.");
});
document.querySelector("#quickButton").addEventListener("click", () => {
  showMessage("Quick sign-in is a placeholder. Connect an identity provider or secure device-based sign-in to enable it.");
});
document.querySelector("#helpLink").addEventListener("click", (event) => {
  event.preventDefault();
  showMessage("For a production site, link this area to your GAMEHUB support page.");
});
