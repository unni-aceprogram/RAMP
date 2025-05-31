// Run after everything loaded
window.addEventListener('load', () => {
  window.jsPDF = window.jspdf.jsPDF;

  const progressBar = document.getElementById("progress-bar");
  const questionCounter = document.getElementById("question-counter");
  const container = document.getElementById("quiz-container");
  const scoreContainer = document.getElementById("score-container");
  const correctSound = document.getElementById("correct-sound");
  const wrongSound = document.getElementById("wrong-sound");
  const startButton = document.getElementById("start-button");
  const alertElement = document.getElementById("alert");

  let currentIndex = 0;
  let score = 0;
  let startTime = 0;
  let timerInterval = null;
  let answeredQuestions = [];
  let soundEnabled = true;

  const quizData = [
    {
      question: "What is the IATA code for Indira Gandhi International Airport in Delhi?",
      options: ["DEL", "BOM", "BLR", "MAA"],
      answer_index: 0,
      explanation: "The IATA code for Indira Gandhi International Airport in Delhi is DEL. It is the busiest airport in India and among the top 20 busiest airports in the world."
    },
    {
      question: "What is the IATA code for Jharsuguda Airport in Odisha?",
      options: ["PYG", "JRG", "KJB", "DBR"],
      answer_index: 1,
      explanation: "The IATA code for Jharsuguda Airport is JRG. It is also known as Veer Surendra Sai Airport, named after a legendary freedom fighter from Odisha."
    }
  ];

  // Sound toggle function
  window.toggleSound = function () {
    soundEnabled = !soundEnabled;
    correctSound.muted = !soundEnabled;
    wrongSound.muted = !soundEnabled;
    document.getElementById("sound-icon").textContent = soundEnabled ? "🔊" : "🔇";
    document.getElementById("sound-text").textContent = soundEnabled ? "Sound ON" : "Sound OFF";
  };

  function renderQuestion(index) {
    clearInterval(timerInterval);
    alertElement.style.display = "none";

    const q = quizData[index];
    container.innerHTML = `
      <div class="card">
        <div class="header"><div class="timer green" id="timer"></div></div>
        <div class="question">${q.question}</div>
        <div class="options">
          ${q.options.map((opt, i) => `
            <label>
              <input type="radio" name="option" value="${i}">
              ${opt}
            </label>`).join("")}
        </div>
        <button class="btn" id="submit-btn">Submit</button>
      </div>
    `;

    questionCounter.textContent = `Q ${index + 1} / ${quizData.length}`;
    document.getElementById("submit-btn").onclick = () => submitAnswer(index);

    progressBar.style.width = `${(index / quizData.length) * 100}%`;

    startButton.style.display = "none"; // HIDE Home Page button on question pages
    startTimer();
  }

  function submitAnswer(index) {
    if (answeredQuestions[index] === true) return; // Already answered

    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) return; // No option selected

    document.getElementById("submit-btn").disabled = true;
    clearInterval(timerInterval);
    alertElement.style.display = "none";

    const correctIndex = quizData[index].answer_index;
    const allOptions = document.querySelectorAll('input[name="option"]');
    allOptions.forEach(opt => opt.disabled = true);

    const selectedLabel = selected.closest("label");
    const correctLabel = allOptions[correctIndex].closest("label");
    const isCorrect = parseInt(selected.value, 10) === correctIndex;

    if (isCorrect) {
      score++;
      selectedLabel.classList.add("correct");
      answeredQuestions[index] = true;
    } else {
      selectedLabel.classList.add("wrong");
      correctLabel.classList.add("correct");
      answeredQuestions[index] = {
        userAnswer: parseInt(selected.value, 10),
        correctAnswer: correctIndex
      };
    }

    showResult(isCorrect);

    const explanation = quizData[index].explanation;
    const card = document.querySelector(".card");

    const explanationDiv = document.createElement("div");
    explanationDiv.className = "explanation";
    explanationDiv.textContent = `Explanation: ${explanation}`;

    const nextButton = document.createElement("button");
    nextButton.className = "btn";
    nextButton.textContent = currentIndex + 1 < quizData.length ? "Next Question" : "Finish Quiz";
    nextButton.onclick = () => {
      currentIndex++;
      if (currentIndex < quizData.length) {
        renderQuestion(currentIndex);
      } else {
        endQuiz();
      }
    };

    card.appendChild(explanationDiv);
    card.appendChild(nextButton);
    explanationDiv.scrollIntoView({ behavior: "smooth", block: "start" });

    // Update progress bar on answer submit
    progressBar.style.width = `${((currentIndex + 1) / quizData.length) * 100}%`;
  }

  function startTimer() {
    let remainingTime = 30;
    const timer = document.getElementById("timer");
    timer.textContent = `Time: ${remainingTime}s`;
    timer.className = "timer green";
    alertElement.style.display = "none";

    timerInterval = setInterval(() => {
      remainingTime--;
      timer.textContent = `Time: ${remainingTime}s`;

      if (remainingTime <= 10) {
        timer.className = "timer red";
        if (container.style.display === "block") alertElement.style.display = "block";
      } else {
        alertElement.style.display = "none";
      }

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        alertElement.style.display = "none";
        // Auto-submit with no answer if timer expires
        if (!document.querySelector('input[name="option"]:checked')) {
          // Mark as unanswered and show correct answer
          answeredQuestions[currentIndex] = {
            userAnswer: null,
            correctAnswer: quizData[currentIndex].answer_index
          };
          disableOptionsAndShowCorrect();
        }
        submitAnswer(currentIndex);
      }
    }, 1000);
  }

  // Disable options and highlight correct answer - used when time expires without answer
  function disableOptionsAndShowCorrect() {
    const allOptions = document.querySelectorAll('input[name="option"]');
    const correctIndex = quizData[currentIndex].answer_index;
    allOptions.forEach(opt => opt.disabled = true);
    const correctLabel = allOptions[correctIndex].closest("label");
    correctLabel.classList.add("correct");
  }

  function showResult(correct) {
    const sound = correct ? correctSound : wrongSound;
    sound.currentTime = 0;
    if (soundEnabled) sound.play();

    if (correct) {
      triggerConfetti();
      setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
      }, 2400);
    }
  }

  const triggerConfetti = throttle(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ff0', '#ff5c5c', '#5c5cff', '#4caf50']
    });
  }, 1000);

  function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return fn(...args);
      }
    };
  }

  // Start quiz - reset and show first question
  window.startQuiz = function () {
    score = 0;
    currentIndex = 0;
    answeredQuestions = new Array(quizData.length).fill(false);

    scoreContainer.innerHTML = "";
    container.style.display = "block";
    alertElement.style.display = "none";
    startButton.style.display = "none"; // hide start/home button on quiz start
    questionCounter.textContent = `Q 1 / ${quizData.length}`;
    progressBar.style.width = "0%";

    renderQuestion(currentIndex);
    startTime = Date.now();
    // startTimer is called inside renderQuestion already
  };

  // End quiz - show results and history buttons
  function endQuiz() {
    clearInterval(timerInterval);
    alertElement.style.display = "none";

    const totalQuestions = quizData.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(1);

    scoreContainer.innerHTML = `
      <div class="highlight-latest-result">🎉 You scored ${score} / ${totalQuestions} (${percentage}%)</div>
      <div class="score-display">
        <p>Your Score: ${score} out of ${totalQuestions}</p>
        <p>Percentage: ${percentage}%</p>
        <p>Time Taken: ${Math.floor((Date.now() - startTime) / 1000)} seconds</p>
        <div class="history-actions">
          <button class="btn" onclick="viewHistory()">📖 View History</button>
          <button class="btn" onclick="restartQuiz()">🔄 Restart Quiz</button>
          <button class="btn" onclick="viewIncorrectAnswers()">❌ View Incorrect Answers</button>
          <button class="btn" onclick="generatePDF()">📄 Download History (PDF)</button>
        </div>
      </div>
    `;

    container.style.display = "none";
    progressBar.style.width = "100%";
    saveScore(score, totalQuestions);
    markQuizAsPassedIfEligible(score, totalQuestions);

    // Show the startButton as Home Page button here
  startButton.style.display = "block";
  startButton.textContent = "Home Page";
  startButton.style.margin = "20px auto";     // add this line
  startButton.style.width = "fit-content";    // add this line (optional)
  startButton.onclick = () => {
    window.location.href = "index.html";
  };
}

function showStartScreen() {
  // Reset UI state
  scoreContainer.innerHTML = "";
  container.style.display = "none";
  alertElement.style.display = "none";
  progressBar.style.width = "0%";
  questionCounter.textContent = "";

  // Show start button centered with "Start Quiz"
  startButton.style.display = "block";
  startButton.style.margin = "20px auto";  // add this to center horizontally
  startButton.style.textAlign = "center";
  startButton.style.width = "fit-content";  // optional
  startButton.textContent = "Start Quiz";
  startButton.onclick = startQuiz;
}


  // Restart quiz — called when Restart Quiz clicked (inside container)
  window.restartQuiz = function () {
    showStartScreen();
  };

  function markQuizAsPassedIfEligible(score, totalQuestions) {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) {
      const user = localStorage.getItem('user');
      const title = document.querySelector('h2')?.textContent?.toLowerCase() || '';
      const quizMatch = title.match(/quiz\s*(\d+)/i);
      if (user && quizMatch) {
        const quizNum = quizMatch[1];
        const key = `${user}_quiz${quizNum}_passed`;
        localStorage.setItem(key, 'true');
      }
    }
  }

  function saveScore(score, totalQuestions) {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const percentage = Math.round((score / totalQuestions) * 100);
    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

    history.push({
      title: document.querySelector("h2")?.textContent || "Quiz",
      score,
      totalQuestions,
      percentage,
      time: `${Math.floor(totalTime / 60)}m ${totalTime % 60}s`,
      date: new Date().toLocaleString()
    });

    let attempts = parseInt(localStorage.getItem("quizAttempts") || "0", 10);
    attempts++;
    localStorage.setItem("quizAttempts", attempts.toString());
    localStorage.setItem("quizHistory", JSON.stringify(history));
  }

  window.viewIncorrectAnswers = function () {
    let incorrectHTML = `
      <h3>Incorrect Answers</h3>
      <table class="history-table">
        <thead><tr><th>Question</th><th>Your Answer</th><th>Correct Answer</th></tr></thead>
        <tbody>
    `;

    answeredQuestions.forEach((ans, i) => {
      if (ans !== true && ans !== false && ans != null) {
        incorrectHTML += `
          <tr>
            <td>${quizData[i].question}</td>
            <td>${ans.userAnswer !== null && ans.userAnswer !== undefined ? quizData[i].options[ans.userAnswer] : 'No Answer'}</td>
            <td>${quizData[i].options[ans.correctAnswer]}</td>
          </tr>
        `;
      }
    });

    incorrectHTML += "</tbody></table>";
    scoreContainer.innerHTML = incorrectHTML;
    container.style.display = "none";

    // SHOW Home Page button here
    startButton.style.display = "inline-block";
    startButton.textContent = "Home Page";
    startButton.onclick = () => {
      window.location.href = "index.html";
    };
  };

  window.viewHistory = function () {
    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    if (history.length === 0) {
      scoreContainer.innerHTML = "<p>No history available.</p>";
      return;
    }

    let historyHTML = `
      <h3>Quiz History</h3>
      <table class="history-table">
        <thead><tr><th>Date</th><th>Score</th><th>Percentage</th><th>Time Taken</th></tr></thead>
        <tbody>
    `;

    history.forEach((entry) => {
      historyHTML += `
        <tr>
          <td>${entry.date}</td>
          <td>${entry.score} / ${entry.totalQuestions}</td>
          <td>${entry.percentage}%</td>
          <td>${entry.time}</td>
        </tr>
      `;
    });

    historyHTML += "</tbody></table>";
    scoreContainer.innerHTML = historyHTML;
    container.style.display = "none";

    // SHOW Home Page button here
    startButton.style.display = "inline-block";
    startButton.textContent = "Home Page";
    startButton.onclick = () => {
      window.location.href = "index.html";
    };
  };

  window.generatePDF = function () {
    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    if (history.length === 0) {
      alert("No quiz history to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Quiz History", 10, 20);
    doc.setFontSize(12);
    let y = 30;

    history.forEach((entry, index) => {
      doc.text(`${index + 1}. ${entry.title}`, 10, y);
      y += 8;
      doc.text(`   Score: ${entry.score} / ${entry.totalQuestions}`, 10, y);
      y += 8;
      doc.text(`   Percentage: ${entry.percentage}%`, 10, y);
      y += 8;
      doc.text(`   Time Taken: ${entry.time}`, 10, y);
      y += 8;
      doc.text(`   Date: ${entry.date}`, 10, y);
      y += 12;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("quiz_history.pdf");
  };

  // Initialize with start screen
  showStartScreen();
});
