document.addEventListener("DOMContentLoaded", () => {
  const host = `http://localhost:8080`;
  const inputField = document.getElementById("message-field");
  const messageContainer = document.querySelector(".messages");
  const clientName = prompt(`Please enter your name to join the chat`);

  const socket = io(host);

  function displayMessage(message, position = "right") {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", position);
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
  }

  function handleNewUser(userName) {
    if (userName) {
      socket.emit("new-user-joined", userName);

      socket.on(`user-joined`, (joinedUserName) => {
        displayMessage(`${joinedUserName}: joined the chat.`, "right");
      });
    } else {
      inputField.disabled = true;
    }
  }

  function sendMessage() {
    const message = inputField.value.trim();
    if (message !== "") {
      displayMessage(`You: ${message}`, `right`);
      socket.emit("send", message);
      inputField.value = "";
    } else {
      alert(`Cannot send empty msg`);
    }
  }

  function receiveMessage(userReply) {
    displayMessage(`${userReply.userName}: ${userReply.message}`, "left");
  }

  function displayWelcomeMessage(userName) {
    const welcomeMessage = userName
      ? `Welcome, ${userName}! Thanks for choosing us.`
      : "Hello, Guest";
    displayMessage(welcomeMessage, "left");
  }

  function scrollToBottom(scrollHeight) {
    messageContainer.parentNode.scrollTop = scrollHeight;
  }

  function leaveChat() {
    socket.emit("leave-chat", clientName);
    displayMessage("You left the chat", "left");
    inputField.disabled = true;
  }

  displayWelcomeMessage(clientName);
  handleNewUser(clientName);

  inputField.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendMessage();
      scrollToBottom(messageContainer.scrollHeight);
    }
  });

  document.querySelector('.buttons').addEventListener('click', (e) => {
    if (e.target.id === `send-button`) {
      sendMessage()
    } else if (e.target.id === `leave-chat-button`) {
      leaveChat()
    }
  })

  socket.on(`receive`, receiveMessage);

  socket.on(`left`, (userName) => {
    displayMessage(`${userName}: left the chat`, 'left')
  });
});