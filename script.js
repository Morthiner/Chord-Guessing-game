const chords = [
    { name: 'C Major', notes: ['C', 'E', 'G'] },
    { name: 'D Major', notes: ['D', 'F#', 'A'] },
    { name: 'E Major', notes: ['E', 'G#', 'B'] },
    { name: 'F Major', notes: ['F', 'A', 'C'] },
    { name: 'G Major', notes: ['G', 'B', 'D'] },
    { name: 'A Major', notes: ['A', 'C#', 'E'] },
    { name: 'B Major', notes: ['B', 'D#', 'F#'] }
    
  ];

  let score = 0;
  let tries = 0;

  function generateRandomChord() {
    const randomIndex = Math.floor(Math.random() * chords.length);
    const correctChord = chords[randomIndex];

    const chordPool = chords.slice();

    chordPool.splice(randomIndex, 1);

    const shuffledChordPool = shuffleOptions(chordPool);

    const alternatives = [correctChord, ...shuffledChordPool.slice(0, 6)];

    const shuffledAlternatives = shuffleOptions(alternatives);

    const buttonsContainer = document.getElementById('buttons-container');
    buttonsContainer.innerHTML = '';
    shuffledAlternatives.forEach(chord => {
      const button = document.createElement('button');
      button.textContent = chord.name;
      button.onclick = () => checkGuess(chord.name, correctChord.name, button);
      buttonsContainer.appendChild(button);
    });

    playChord(correctChord.notes);

    tries++;
    document.getElementById('tries').innerText = tries;
  }

  function checkGuess(playerGuess, correctChord, selectedButton) {
    if (playerGuess === correctChord) {
      selectedButton.classList.add('correct');
      score++;
    } else {
      selectedButton.classList.add('wrong');
      highlightCorrectButton(correctChord);
    }

    document.getElementById('score').innerText = score;
  }

  function highlightCorrectButton(correctChord) {
    const buttonsContainer = document.getElementById('buttons-container');
    const buttons = buttonsContainer.getElementsByTagName('button');

    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].textContent === correctChord) {
        buttons[i].classList.add('correct');
      }
    }
  }

  function shuffleOptions(options) {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }

  function playChord(notes) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const gainNode = audioContext.createGain();
    const attackTime = 0.1; // in seconds
    const releaseTime = 0.8; // in seconds

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + releaseTime);

    gainNode.connect(audioContext.destination);

    notes.forEach((note, index) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle'; // Sounds best
        oscillator.frequency.setValueAtTime(noteToFrequency(note), audioContext.currentTime + index * 0.1);
        oscillator.connect(gainNode);
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + releaseTime);
    });
}

  function noteToFrequency(note) {
    const notesMap = {
      'C': 261.63,
      'C#': 277.18,
      'D': 293.66,
      'D#': 311.13,
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99,
      'G': 392.00,
      'G#': 415.30,
      'A': 440.00,
      'A#': 466.16,
      'B': 493.88,
    };

    return notesMap[note];
  }


  function addMajorChordButtons() {
    const majorChordsContainer = document.getElementById('major-chords');

    chords.forEach(chord => {
      const button = document.createElement('button');
      button.textContent = chord.name;
      button.classList.add('major-chord-button');
      button.onclick = () => playChord(chord.notes);
      majorChordsContainer.appendChild(button);
    });
  }

  addMajorChordButtons();
