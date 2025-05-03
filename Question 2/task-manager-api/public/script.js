let currentController = null;   // keeps track of the in-flight request

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('nameInput');

  // Allow Enter key to trigger search
  input.addEventListener('keyup', e => {
    if (e.key === 'Enter') searchPatient();
  });

  // Create User form handler
  document.getElementById('createUserForm').addEventListener('submit', async e => {
    e.preventDefault();
    await createUser();
  });
});

async function searchPatient() {
  const nameInput = document.getElementById('nameInput');
  const resultDiv = document.getElementById('result');
  const query = nameInput.value.trim();

  resultDiv.innerHTML = '';

  if (!query) {
    resultDiv.innerHTML = '<p style="color:red;">Please enter a name.</p>';
    nameInput.focus();
    return;
  }

  // Abort previous fetch
  if (currentController) currentController.abort();

  const controller = new AbortController();
  currentController = controller;
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  resultDiv.innerHTML = '<p>Searching…</p>';

  try {
    const url = `http://localhost:3000/api/users?name=${encodeURIComponent(query)}`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const html = data.map(p => `
        <div class="card" data-id="${p.user_id}">
          <p><strong>Username:</strong> ${p.username ?? '—'}</p>
          <p><strong>Email:</strong> ${p.email ?? '—'}</p>
          <button onclick="showUpdateForm(${p.user_id}, '${escapeHtml(p.username)}', '${escapeHtml(p.email ?? '')}')">Edit</button>
          <button onclick="deleteUser(${p.user_id})">Delete</button>
          <div class="updateFormContainer" id="updateForm-${p.user_id}" style="display:none; margin-top:10px;">
            <input type="text" id="updateUsername-${p.user_id}" value="${p.username ?? ''}" />
            <input type="email" id="updateEmail-${p.user_id}" value="${p.email ?? ''}" />
            <button onclick="updateUser(${p.user_id})">Save</button>
            <button onclick="hideUpdateForm(${p.user_id})">Cancel</button>
            <div id="updateResult-${p.user_id}"></div>
          </div>
        </div>
      `).join('');
      resultDiv.innerHTML = `<p style="color:green;">${data.length} result(s) found:</p>${html}`;
    } else {
      resultDiv.innerHTML = '<p style="color:orange;">No patients found with that name.</p>';
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      if (controller !== currentController) return;
      resultDiv.innerHTML = '<p style="color:red;">Request timed out. Please try again.</p>';
    } else {
      console.error(err);
      resultDiv.innerHTML = `<p style="color:red;">Error fetching data. ${err.message}</p>`;
    }
  } finally {
    clearTimeout(timeoutId);
    if (controller === currentController) currentController = null;
  }
}

// Escape HTML special characters (basic)
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (match) => {
    const escape = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return escape[match];
  });
}

// Show edit form for user
function showUpdateForm(id, username, email) {
  document.getElementById(`updateForm-${id}`).style.display = 'block';
}

// Hide edit form for user
function hideUpdateForm(id) {
  document.getElementById(`updateForm-${id}`).style.display = 'none';
}

// Update user
async function updateUser(userId) {
  const username = document.getElementById(`updateUsername-${userId}`).value.trim();
  const email = document.getElementById(`updateEmail-${userId}`).value.trim();
  const updateResult = document.getElementById(`updateResult-${userId}`);

  if (!username) {
    updateResult.innerHTML = '<p style="color:red;">Username is required.</p>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email: email || null }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to update user');
    }

    const data = await response.json();
    updateResult.innerHTML = `<p style="color:green;">User ${data.username} updated.</p>`;

    // Optionally hide form or refresh search
    setTimeout(() => hideUpdateForm(userId), 1500);

  } catch (error) {
    updateResult.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

// Delete user
async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to delete user');
    }

    const data = await response.json();
    alert(data.message);

    // Refresh search results after deletion
    searchPatient();

  } catch (error) {
    alert(`Error deleting user: ${error.message}`);
  }
}

// Create new user
async function createUser() {
  const username = document.getElementById('newUsername').value.trim();
  const email = document.getElementById('newEmail').value.trim();
  const createUserResult = document.getElementById('createUserResult');

  if (!username) {
    createUserResult.innerHTML = '<p style="color:red;">Username is required.</p>';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email: email || null }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to create user');
    }

    const data = await response.json();
    createUserResult.innerHTML = `<p style="color:green;">User created with ID ${data.user_id}.</p>`;
    
    // Reset form
    document.getElementById('createUserForm').reset();

    // Refresh results
    searchPatient();

  } catch (error) {
    createUserResult.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}