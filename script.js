console.log("Script loaded");

// Check if user is visiting a shared link
const hashKey = window.location.hash.slice(1);
const retrievedMessageDiv = document.getElementById('retrievedMessage');

if (hashKey) {
  const [docId, key] = atob(hashKey).split(':');

  getDoc(doc(db, 'messages', docId)).then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      const decrypted = CryptoJS.AES.decrypt(data.text, key).toString(CryptoJS.enc.Utf8);
      retrievedMessageDiv.textContent = decrypted;
      retrievedMessageDiv.classList.remove('hidden');
      deleteDoc(doc(db, 'messages', docId)); // Auto-delete after viewing
    } else {
      retrievedMessageDiv.textContent = 'This message no longer exists.';
      retrievedMessageDiv.classList.remove('hidden');
    }
  });
}

// ✅ Clean: Single listener, full logic + logging
document.getElementById('generateLink').addEventListener('click', async () => {
  console.log("Button clicked");

  const message = document.getElementById('messageInput').value;
  if (!message) {
    alert("Please enter a message before generating the link.");
    return;
  }

  const key = CryptoJS.lib.WordArray.random(16).toString();
  const encrypted = CryptoJS.AES.encrypt(message, key).toString();

  try {
    const docRef = await addDoc(collection(db, 'messages'), { text: encrypted });
    const link = `${window.location.origin}${window.location.pathname}#${btoa(docRef.id + ':' + key)}`;

    document.getElementById('generatedLink').innerHTML = `
      <strong>Secure Link:</strong><br>
      <a href="${link}" target="_blank">${link}</a>
      <br><br><button onclick
