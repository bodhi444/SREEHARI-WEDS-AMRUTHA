import { listenForRSVPs } from './firebase-config.js';

// Simple hardcoded password for static site
// (Not highly secure, but prevents random guests from seeing the list)
const ADMIN_PWD = "wed"; 

document.addEventListener("DOMContentLoaded", () => {
  const authScreen = document.getElementById('authScreen');
  const dashboard = document.getElementById('dashboard');
  const pwdInput = document.getElementById('adminPwd');
  const loginBtn = document.getElementById('loginBtn');

  function attemptLogin() {
    if (pwdInput.value === ADMIN_PWD) {
      authScreen.style.display = 'none';
      dashboard.style.display = 'block';
      loadData();
    } else {
      alert("Incorrect password!");
      pwdInput.value = '';
    }
  }

  loginBtn.addEventListener('click', attemptLogin);
  pwdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });
});

function loadData() {
  const tableBody = document.querySelector('#rsvpTable tbody');
  
  listenForRSVPs((data) => {
    tableBody.innerHTML = ''; // Clear loading/old data
    
    let totalAttending = 0;
    let totalGuests = 0;
    let totalDeclined = 0;

    if (!data) {
      tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center">No RSVPs yet.</td></tr>';
      return;
    }

    // Convert Firebase object to array and sort by newest first
    const rsvpList = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    rsvpList.forEach(rsvp => {
      // Update stats
      if (rsvp.attending) {
        totalAttending++;
        totalGuests += (rsvp.guests || 1);
      } else {
        totalDeclined++;
      }

      // Create row
      const tr = document.createElement('tr');
      
      // Date formatting
      let dateStr = "Just now";
      if (rsvp.timestamp) {
        const d = new Date(rsvp.timestamp);
        dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }

      const statusTag = rsvp.attending 
        ? '<span class="tag yes">Attending</span>'
        : '<span class="tag no">Declined</span>';
        
      const guestCount = rsvp.attending ? rsvp.guests : '-';

      tr.innerHTML = `
        <td style="font-weight:bold">${escapeHTML(rsvp.name)}</td>
        <td>${statusTag}</td>
        <td>${guestCount}</td>
        <td style="color:#666; font-size:13px">${dateStr}</td>
      `;
      tableBody.appendChild(tr);
    });

    // Update UI Stats
    document.getElementById('statAttending').textContent = totalAttending;
    document.getElementById('statGuests').textContent = totalGuests;
    document.getElementById('statDeclined').textContent = totalDeclined;
  });
}

// Basic sanitization
function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
