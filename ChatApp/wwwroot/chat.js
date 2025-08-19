const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .withAutomaticReconnect()
    .build();

const messagesList = document.getElementById("messagesList");
const sendForm = document.getElementById("sendForm");
const messageInput = document.getElementById("messageInput");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

connection.on("ReceiveMessage", (user, message, timestampUtc) => {
    const line = document.createElement("div");
    const date = new Date(timestampUtc);
    const hhmm = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    line.textContent = `[${hhmm}] ${user}: ${message}`;
    messagesList.appendChild(line);
    messagesList.scrollTop = messagesList.scrollHeight;
});

async function start() {
    try {
        await connection.start();
        sendButton.disabled = false;
    } catch (err) {
        console.error("Connection error. Retrying in 3s...", err);
        setTimeout(start, 3000);
    }
}
start();

sendForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = (userInput.value || "").trim() || "Unknown";
    const msg = (messageInput.value || "").trim();
    if (!msg) return;

    connection.invoke("SendMessage", user, msg).catch(err => console.error(err));
    messageInput.value = "";
    messageInput.focus();
});
