console.log("Script loaded");

// Firebase imports
import { db } from './firebase-config.js';
import { collection, addDoc, getDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
  }).catch(error => {
    console.error("Error retrieving message:", error);
  });
}

// Generate encrypted message and link
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById('generateLink');

  generateBtn.addEventListener('click', async () => {
    console.log("Button clicked");

    const message = document.getElementById('messageInput').value.trim();
    if (!message) {
      alert("Please enter a message before generating a link.");
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
        <br><br><button id="copyBtn">📋 Copy to Clipboard</button>
      `;

      // Add listener to the new button
      document.getElementById('copyBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(link).then(() => {
          alert('Link copied! Send it safely. This message will expire after viewing.');
        }).catch(err => {
          console.error("Clipboard error:", err);
          alert("Failed to copy link to clipboard.");
        });
      });
    } catch (error) {
      console.error("Error generating link:", error);
      alert("Failed to generate secure link. Please try again.");
    }
  });
});