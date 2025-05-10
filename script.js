// Initialize Supabase
const SUPABASE_URL = "https://wvwlclmaiagbktsowazy.supabase.co"; // Replace with your actual Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2d2xjbG1haWFnYmt0c293YXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDM5MTIsImV4cCI6MjA2MjM3OTkxMn0.nUdAsTggRbSOnsXYEHewD1CrCEyMLk9FBbk5wivAtXs"; // Replace with your actual Supabase Anon Key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Debugging Helper Function
function debug(message) {
  const debugOutput = document.getElementById('debug-output');
  if (debugOutput) {
    debugOutput.innerHTML += `<div>${message}</div>`;
  } else {
    console.log(message); // Fallback to console if debug area is not available
  }
}

// Wait for the DOM to Load Before Running Scripts
document.addEventListener('DOMContentLoaded', () => {
  debug('DOM fully loaded.');

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

  // Ensure Elements Are Found
  if (!loginBtn || !usernameInput) {
    debug('Error: Login button or username input not found.');
    return;
  }

  debug('Login button and username input found.');

  // Login or Sign-Up
  loginBtn.addEventListener('click', async () => {
    debug('Login button clicked.');

    const username = usernameInput.value.trim();
    if (!username) {
      alert("Please enter a username.");
      debug('Alert: Username is empty.');
      return;
    }

    try {
      // Create an email-like username
      const email = `${username}@example.com`;
      const password = "defaultpassword"; // Default password for all users

      // Attempt to sign up or log in the user
      let { user, error } = await supabase.auth.signUp({ email, password });
      if (error && error.message.includes("already registered")) {
        // If user already exists, attempt to log in
        ({ user, error } = await supabase.auth.signInWithPassword({ email, password }));
      }

      if (error) {
        debug(`Login error: ${error.message}`);
        alert(`Login failed: ${error.message}`);
        return;
      }

      currentUser = user;
      alert(`Welcome, ${username}!`);
      debug(`User logged in with username: ${username}`);

      // Hide Login Section and Show Chat Room Section
      loginSection.classList.add('hidden');
      chatRoomSection.classList.remove('hidden');
    } catch (err) {
      debug(`Unexpected error during login: ${err}`);
      alert("An unexpected error occurred during login. Please try again.");
    }
  });

  // Join or Create Room
  joinRoomBtn.addEventListener('click', async () => {
    debug('Join Room button clicked.');

    currentRoom = roomCodeInput.value.trim();
    if (!currentRoom) {
      alert("Please enter a room code.");
      debug('Alert: Room code is empty.');
      return;
    }

    try {
      // Check if the room exists
      let { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', currentRoom)
        .single();

      if (error && error.code === "PGRST116") {
        // Room does not exist, create it
        const { error: insertError } = await supabase
          .from('rooms')
          .insert([{ room_code: currentRoom, created_by: currentUser.id }]);
        if (insertError) {
          debug(`Error creating room: ${insertError.message}`);
          alert(`Failed to create room: ${insertError.message}`);
          return;
        }
        alert(`Room ${currentRoom} created successfully!`);
        debug(`Room ${currentRoom} created.`);
      } else if (error) {
        debug(`Error checking room: ${error.message}`);
        alert(`Failed to join room: ${error.message}`);
        return;
      }

      // Join the room
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
    } catch (err) {
      debug(`Unexpected error joining room: ${err}`);
      alert("An unexpected error occurred while joining the room. Please try again.");
    }
  });

  // Load Existing Messages
  async function loadMessages() {
    debug('Loading existing messages...');
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_code', currentRoom)
        .order('created_at', { ascending: true });

      if (error) {
        debug(`Error loading messages: ${error.message}`);
        alert("Failed to load existing messages.");
        return;
      }

      outputDiv.innerHTML = ""; // Clear chat
      messages.forEach((message) => {
        printOutput(`<b>${message.sender}:</b> ${message.message}`);
      });
      debug('Messages loaded successfully.');
    } catch (err) {
      debug(`Unexpected error loading messages: ${err}`);
      alert("An unexpected error occurred while loading messages.");
    }
  }

  // Send Message or Handle Commands
  sendBtn.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    if (!message) {
      alert("Please enter a message.");
      debug('Alert: Message is empty.');
      return;
    }

    if (message.startsWith("/")) {
      handleCommand(message);
      return;
    }

    try {
      const { error } = await supabase.from('messages').insert([
        {
          room_code: currentRoom,
          sender: currentUser.id, // Use the user ID to align with the schema
          message: message
        }
      ]);

      if (error) {
        debug(`Error sending message: ${error.message}`);
        alert("Failed to send the message.");
      } else {
        messageInput.value = ""; // Clear input
        debug(`Message sent: ${message}`);
      }
    } catch (err) {
      debug(`Unexpected error sending message: ${err}`);
      alert("An unexpected error occurred while sending the message.");
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
});
