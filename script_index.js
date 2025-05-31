let theme = localStorage.getItem('theme') || 'Millennial';

function applyTheme(newTheme) {
  theme = newTheme;
  localStorage.setItem('theme', theme);
  const buttonLabel = theme === 'Millennial' ? 'Millennial (Study Mode)' : 'GenZ (Story Mode)';
  document.getElementById('theme-toggle').textContent = buttonLabel;

  const loggedInUser = localStorage.getItem('user');
  if (loggedInUser) {
    updateUIForUser(loggedInUser);
  }
}

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const emailPattern = /^[a-zA-Z0-9._%+-]+@goindigo\.in$/;

  if (!emailPattern.test(username)) {
    alert("Please use a valid goindigo.in email address.");
    return;
  }

  if (password !== 'admin$908' && password !== 'IndiGo$562') {
    alert("Incorrect password. Hint: Please contact Krishnanunni");
    return;
  }

  localStorage.setItem('user', username);
  cleanOldKeys(username); // ✅ Clean up old keys
  showUser(username);
  updateUIForUser(username);
}

function logout() {
  localStorage.removeItem('user');
  clearButtonStates();
  document.getElementById('login-page').style.display = 'block';
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('user-info').style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.title = 'Flight Manager';
}

function showUser(email) {
  let namePart = email.split('@')[0];
  if (namePart.includes('.')) {
    namePart = namePart.split('.')[0];
  }
  namePart = namePart.replace(/\d+$/g, '');
  const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
  const initials = displayName.charAt(0).toUpperCase();
  document.getElementById('user-initials').textContent = initials;
  document.getElementById('username-display').textContent = `👋 Welcome, ${displayName}`;
  document.title = `Welcome, ${displayName} - Flight Manager`;
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('user-info').style.display = 'flex';
}

function isDayPassed(user, day) {
  return localStorage.getItem(`${user}_${day}_${theme}_passed`) === 'true';
}

function clearButtonStates() {
  const buttons = document.querySelectorAll('.day-button');
  buttons.forEach(button => {
    button.classList.remove('passed');
    button.classList.remove('locked');
  });
}

function updateUIForUser(user) {
  const buttons = document.querySelectorAll('.day-button');
  buttons.forEach(button => {
    const day = button.getAttribute('data-day');
    if (isDayPassed(user, day)) {
      button.classList.add('passed');
    } else {
      button.classList.remove('passed');
    }
  });

  buttons.forEach((button, index) => {
    if (index === 0) {
      button.classList.remove('locked');
      return;
    }
    const prevDay = buttons[index - 1].getAttribute('data-day');
    if (!isDayPassed(user, prevDay)) {
      button.classList.add('locked');
    } else {
      button.classList.remove('locked');
    }
  });
}

function cleanOldKeys(user) {
  const keysToClear = Object.keys(localStorage).filter(key =>
    key.startsWith(`${user}_`) &&
    !key.includes('_Millennial_passed') &&
    !key.includes('_GenZ_passed') &&
    !key.includes('_E') &&
    !key.includes('_G')
  );
  keysToClear.forEach(key => localStorage.removeItem(key));
}

document.querySelectorAll('.day-button').forEach(button => {
  button.addEventListener('click', () => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      alert('Please log in first.');
      return;
    }

    if (button.classList.contains('locked')) {
      alert('This day is locked. Please complete previous days first.');
      return;
    }

    const page = button.getAttribute('data-day');
    localStorage.setItem(`${loggedInUser}_${page}_${theme}_passed`, 'true'); // ✅ Track per theme
    updateUIForUser(loggedInUser);

    const suffix = theme === 'Millennial' ? '_E' : '_G';
    window.location.href = `${page}${suffix}.html`;
  });
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  if (theme === 'Millennial') {
    applyTheme('GenZ');
  } else {
    applyTheme('Millennial');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const loggedInUser = localStorage.getItem('user');
  if (loggedInUser) {
    showUser(loggedInUser);
    updateUIForUser(loggedInUser);
  }

  applyTheme(theme);
});