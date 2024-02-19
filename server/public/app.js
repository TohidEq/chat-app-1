const socket = io("ws://localhost:3500");

const nameInput = document.querySelector("#name");
const chatRoomInput = document.querySelector("#room");
const msgInput = document.querySelector("#message");

const usersList = document.querySelector(".users-list");
const roomsList = document.querySelector(".rooms-list");
const activity = document.querySelector(".activity");
const chatDisplay = document.querySelector(".chat-display");

function sendMessage(e) {
  e.preventDefault();
  if (nameInput.value && msgInput.value && chatRoomInput.value) {
    socket.emit("message", {
      name: nameInput.value,
      text: msgInput.value,
    });
    msgInput.value = "";
  }
  msgInput.focus();
}
document.querySelector(".form-msg").addEventListener("submit", sendMessage);

function enterRoom(e) {
  e.preventDefault();
  if (nameInput.value && chatRoomInput.value) {
    socket.emit("enterRoom", {
      name: nameInput.value,
      room: chatRoomInput.value,
    });
  }
}
document.querySelector(".form-join").addEventListener("submit", enterRoom);

// Listen for messages
socket.on("message", (data) => {
  const li = document.createElement("li");
  li.textContent = data;
  chatDisplay.appendChild(li);
});

msgInput.addEventListener("keypress", () => {
  socket.emit("activity", nameInput.value);
});

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typihng...`;
  // clear after 2 s
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.textContent = "";
  }, 2000);
});

