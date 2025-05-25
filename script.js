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
      retrievedMessageDiv.classList.remove('hid
