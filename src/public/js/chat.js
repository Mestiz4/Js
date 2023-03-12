const socket = socket();

let user = JSON.parse(sessionStorage.getItem("user")) || prompt("Ingrese correo electrónico:");
sessionStorage.setItem("user", JSON.stringify(user));

let sendMessageForm = document.getElementById("sendMessage");

sendMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = e.target[0].value.trim();
  socket.emit("newMessage", { user, message });
  e.target.reset();
});

socket.on("messagesListUpdated", () => {
  location.reload();
});