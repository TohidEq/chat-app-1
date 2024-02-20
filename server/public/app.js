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
  activity.textContent = "";
  const { name, text, time } = data;

  const li = document.createElement("li");
  li.className = "post";
  if (name === nameInput.value) li.className = "post post--left";
  if (name !== nameInput.value && name !== "Admin")
    li.className = "post post--right";
  if (name !== "Admin") {
    li.innerHTML = `<div class="post__header ${name === nameInput ? "post__header--user" : "post__header--reply"}">
    <span class="post__header--name">${name}</span>
    <span class="post__header--time">${time}</span>
    </div>
    <div class="post__text">${text}</div>
    `;
  } else {
    li.innerHTML = `
  <div class="post__text">${text}</div>
`;
  }

  chatDisplay.appendChild(li);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
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

socket.on("userList", ({ users }) => {
  showUsers(users);
});

socket.on("roomList", ({ rooms }) => {
  showRooms(rooms);
});

function showUsers(users) {
  usersList.textContent = "";
  if (users) {
    usersList.innerHTML = `
      <em>
        Users in ${chatRoomInput.value}:
      </em>
      `;
    users.forEach((users, i) => {
      usersList.textContent += ` ${user.name}`;
      if (users.length > 1 && i !== users.length - 1) {
        usersList.textContent += ",";
      }
    });
  }
}

function showRooms(rooms) {
  roomsList.textContent = "";
  if (rooms) {
    roomsList.innerHTML = `
      <em>
        Active Rooms:
      </em>
      `;
    rooms.forEach((room, i) => {
      roomsList.textContent += ` ${room}`;
      if (rooms.length > 1 && i !== rooms.length - 1) {
        roomsList.textContent += ",";
      }
    });
  }
}
