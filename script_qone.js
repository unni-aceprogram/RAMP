// script_qone.js
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

    startButton.style.display = "none"; // Hide start button on questions
    container.style.display = "block";

    startTimer();
  }

  function startTimer() {
    let timeLeft = 20; // seconds
    const timerDiv = document.getElementById("timer");
    timerDiv.textContent = timeLeft + "s";
    timerDiv.className = "timer green";

    timerInterval = setInterval(() => {
      timeLeft--;
      timerDiv.textContent = timeLeft + "s";

      if (timeLeft <= 5) {
        timerDiv.className = "timer red";
        alertElement.style.display = "block";
      }
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alertElement.style.display = "none";
        submitAnswer(currentIndex, true); // auto-submit with no answer (timeout)
      }
    }, 1000);
  }

  function submitAnswer(index, timedOut = false) {
    clearInterval(timerInterval);

    const options = document.querySelectorAll('input[name="option"]');
    let selected = -1;
    options.forEach(opt => {
      if (opt.checked) selected = parseInt(opt.value);
    });

    if (!timedOut && selected === -1) {
      alert("Please select an option before submitting.");
      startTimer();
      return;
    }

    const q = quizData[index];
    const isCorrect = selected === q.answer_index;

    if (isCorrect) {
      score++;
      if (soundEnabled) correctSound.play();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      if (soundEnabled) wrongSound.play();
    }

    showExplanation(q.explanation, isCorrect);

    answeredQuestions.push({ question: q.question, yourAnswer: selected === -1 ? "No Answer" : q.options[selected], correctAnswer: q.options[q.answer_index], correct: isCorrect });

    currentIndex++;
    if (currentIndex < quizData.length) {
      startButton.textContent = "Next Question";
      startButton.style.display = "inline-block";
      container.style.display = "none";
      questionCounter.textContent = "Paused";
    } else {
      showFinalScore();
    }
  }

  function showExplanation(text, correct) {
    scoreContainer.innerHTML = `
      <div style="background: ${correct ? '#d4edda' : '#f8d7da'}; color: ${correct ? '#155724' : '#721c24'}; border-radius: 5px; padding: 15px; margin-top: 10px;">
        <strong>${correct ? "Correct!" : "Incorrect."}</strong> ${text}
      </div>
    `;
  }

  function showFinalScore() {
    container.style.display = "none";
    startButton.style.display = "none";
    questionCounter.textContent = "Quiz Completed!";

    const totalQuestions = quizData.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    scoreContainer.innerHTML = `
      <h3>Your Score: ${score} / ${totalQuestions} (${percentage}%)</h3>
      <button id="download-pdf-btn">Download Score PDF</button>
      <button id="return-home-btn" style="margin-left: 15px;">Return to Home</button>
    `;

    // Save pass state if score >= 50%
    if (percentage >= 50) {
      markQuizAsPassedIfEligible();
    }

    document.getElementById("download-pdf-btn").onclick = () => downloadPDF();
    document.getElementById("return-home-btn").onclick = () => {
      window.location.href = "index.html";
    };
  }

  // Mark quiz as passed in localStorage with proper user and quiz number keys
  function markQuizAsPassedIfEligible() {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("User not found. Please login again.");
      return;
    }
    // Get quiz number from data attribute of h2
    const quizNum = document.querySelector('h2')?.dataset.quiznum || '1';
    const key = `${user}_quiz${quizNum}_passed`;
    localStorage.setItem(key, 'true');
  }

  function downloadPDF() {
    const doc = new jsPDF();
    doc.text("Quiz Score Report", 20, 20);
    doc.text(`User: ${localStorage.getItem("user") || "Unknown"}`, 20, 30);
    doc.text(`Quiz: Quiz ${document.querySelector('h2').dataset.quiznum}`, 20, 40);
    doc.text(`Score: ${score} / ${quizData.length}`, 20, 50);
    doc.save("quiz_score.pdf");
  }

  startButton.addEventListener("click", () => {
    if (startButton.textContent === "Start Quiz" || startButton.textContent === "Next Question") {
      renderQuestion(currentIndex);
      scoreContainer.innerHTML = "";
    }
  });

});
