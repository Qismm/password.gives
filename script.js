const typeBtns = document.querySelectorAll('.type-btn');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const numbersToggle = document.getElementById('numbers');
const symbolsToggle = document.getElementById('symbols');
const toggles = document.getElementById('toggles');
const passwordEl = document.getElementById('password');
const copyBtn = document.getElementById('copy');
const refreshBtn = document.getElementById('refresh');
const copiedEl = document.getElementById('copied');

let currentType = 'random';

const words = [
  'apple','river','cloud','stone','light','night','ocean','forest','mountain','valley',
  'silver','golden','quiet','brave','swift','gentle','bright','dark','warm','cool',
  'storm','breeze','flame','shadow','crystal','ember','frost','thunder','meadow','canyon',
  'harbor','summit','horizon','whisper','echo','pulse','spark','drift','tide','blaze'
];

function generateRandom(len, nums, syms) {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (nums) chars += '0123456789';
  if (syms) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  const array = new Uint32Array(len);
  crypto.getRandomValues(array);
  for (let i = 0; i < len; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

function generateMemorable(len, nums, syms) {
  // Build with words, insert numbers/symbols to reach roughly target length
  let result = '';
  while (result.length < len) {
    const word = words[Math.floor(Math.random() * words.length)];
    result += word.charAt(0).toUpperCase() + word.slice(1);
    if (result.length >= len) break;
    if (nums && Math.random() > 0.4) {
      result += Math.floor(Math.random() * 90 + 10);
    } else if (syms && Math.random() > 0.5) {
      const symsList = '!@#$%&*';
      result += symsList[Math.floor(Math.random() * symsList.length)];
    }
  }
  return result.slice(0, len);
}

function generatePin(len) {
  let result = '';
  const array = new Uint32Array(len);
  crypto.getRandomValues(array);
  for (let i = 0; i < len; i++) {
    result += array[i] % 10;
  }
  return result;
}

function generate() {
  const len = parseInt(lengthSlider.value);
  const nums = numbersToggle.checked;
  const syms = symbolsToggle.checked;
  let pass = '';
  if (currentType === 'random') {
    pass = generateRandom(len, nums, syms);
  } else if (currentType === 'memorable') {
    pass = generateMemorable(len, nums, syms);
  } else {
    pass = generatePin(len);
  }
  passwordEl.textContent = pass;
}

function updateUI() {
  if (currentType === 'pin') {
    lengthSlider.min = 4;
    lengthSlider.max = 12;
    if (lengthSlider.value > 12) lengthSlider.value = 6;
    toggles.style.display = 'none';
  } else if (currentType === 'memorable') {
    lengthSlider.min = 8;
    lengthSlider.max = 32;
    toggles.style.display = 'flex';
  } else {
    lengthSlider.min = 8;
    lengthSlider.max = 64;
    toggles.style.display = 'flex';
  }
  lengthValue.textContent = lengthSlider.value;
  generate();
}

typeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    typeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;
    if (currentType === 'pin') {
      lengthSlider.value = 6;
    } else if (currentType === 'memorable') {
      lengthSlider.value = 16;
    } else {
      lengthSlider.value = 20;
    }
    updateUI();
  });
});

lengthSlider.addEventListener('input', () => {
  lengthValue.textContent = lengthSlider.value;
  generate();
});

numbersToggle.addEventListener('change', generate);
symbolsToggle.addEventListener('change', generate);

copyBtn.addEventListener('click', async () => {
  const originalText = copyBtn.textContent;
  try {
    await navigator.clipboard.writeText(passwordEl.textContent);
    copyBtn.textContent = 'Copied';
    setTimeout(() => copyBtn.textContent = originalText, 1500);
  } catch (e) {
    // fallback
    const range = document.createRange();
    range.selectNode(passwordEl);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    copyBtn.textContent = 'Copied';
    setTimeout(() => copyBtn.textContent = originalText, 1500);
  }
});

refreshBtn.addEventListener('click', generate);

// init
updateUI();

// Modals
document.getElementById('open-faq').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('faq-modal').classList.add('active');
});
document.getElementById('open-dmca').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('dmca-modal').classList.add('active');
});
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay').classList.remove('active');
  });
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
});