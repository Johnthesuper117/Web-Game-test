// Initialize Supabase
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elements
const loginSection = document.getElementById('login');
const chatRoomSection = document.getElementById('chat-room');
const messagingSection = document.getElementById('messaging');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const roomCodeInput = document.getElementById('room-code');
const joinRoomBtn = document.getElementById('join-room-btn');
const currentRoomSpan = document.getElementById('current-room');
const outputDiv = document.getElementById('output');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

let currentUser = null;
let currentRoom = null;

// Login
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    currentUser = username;
    loginSection.classList.add('hidden');
    chatRoomSection.classList.remove('hidden');
  } else {
    alert("Please enter a username.");
  }
});

// Join Room
joinRoomBtn.addEventListener('click', () => {
  currentRoom = roomCodeInput.value.trim();
  if (currentRoom) {
    currentRoomSpan.textContent = currentRoom;
    chatRoomSection.classList.add('hidden');
    messagingSection.classList.remove('hidden');

    // Listen for new messages in the room
    supabase
      .from(`messages:room_code=eq.${currentRoom}`)
      .on('INSERT', (payload) => {
        const message = payload.new;
        printOutput(`<b>${message.sender}:</b> ${message.message}`);
      })
      .subscribe();

    // Load existing messages
    loadMessages();
  } else {
    alert("Please enter a room code.");
  }
});

// Load Existing Messages
async function loadMessages() {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_code', currentRoom)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error loading messages:", error);
    return;
  }

  outputDiv.innerHTML = ""; // Clear chat
  messages.forEach((message) => {
    printOutput(`<b>${message.sender}:</b> ${message.message}`);
  });
}

// Send Message or Handle Commands
sendBtn.addEventListener('click', async () => {
  const message = messageInput.value.trim();
  if (message) {
    if (message.startsWith("/")) {
      handleCommand(message);
    } else {
      const { error } = await supabase.from('messages').insert([
        {
          room_code: currentRoom,
          sender: currentUser,
          message: message
        }
      ]);

      if (error) {
        console.error("Error sending message:", error);
      } else {
        messageInput.value = ""; // Clear input
      }
    }
  } else {
    alert("Please enter a message.");
  }
});

// Print Output to Chat
function printOutput(message) {
  outputDiv.innerHTML += `<div>${message}</div>`;
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

// Handle Commands
function handleCommand(command) {
  const args = command.split(" ");
  const mainCommand = args[0].toLowerCase();

  switch (mainCommand) {
    case "/help":
      printOutput("Available commands:\n/help - List commands\n/echo [text] - Echo back text\n/time - Display current time");
      break;

    case "/echo":
      const text = args.slice(1).join(" ");
      printOutput(text || "Please provide text to echo.");
      break;

    case "/time":
      const now = new Date();
      printOutput(`Current time: ${now.toLocaleString()}`);
      break;

    default:
      printOutput(`Unknown command: ${mainCommand}. Type /help for a list of commands.`);
  }

  // Clear input field after executing the command
  messageInput.value = "";
}