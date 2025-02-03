const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
});

console.log(
  typeof moment !== "undefined"
    ? "Moment.js is loaded"
    : "Moment.js is NOT loaded"
);

const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-from");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("client-total", (data) => {
  clientsTotal.innerHTML = `Total clients : ${data}`;
  console.log(data);
});

function sendMessage() {
  //   console.log(messageInput.value);
  if (messageInput.value === "") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("chatMessage", (data) => {
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
  const element = `<li class="${
    isOwnMessage ? "message-right" : "message-left"
  }">
          <p class="message">
            ${data.message}
            <span>${data.name}🕒 ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>`;
  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `✍ ${nameInput.value} is typing a message`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: `✍ ${nameInput.value} is typing a message`,
  });
});
messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = ` <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>`;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
