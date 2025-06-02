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
    "question": "<div class=\"question\">What does FOD stand for on the airport ramp?</div>",
    "options": ["Foreign Object Device", "Flight Operations Division", "Foreign Object Debris", "Field Operations Duty"],
    "answer_index": 2,
    "explanation": "FOD stands for Foreign Object Debris, referring to anything on the ramp that shouldn't be there—like tools, stones, or trash."
  },
  {
    "question": "<div class=\"question\">When should a FOD check be conducted?</div>",
    "options": ["Once a day during shift change", "Before arrival only", "Pre-arrival, pre-departure, and post-departure", "Every hour on the hour"],
    "answer_index": 2,
    "explanation": "FOD checks are done three times: pre-arrival, pre-departure, and post-departure to ensure ramp safety."
  },
  {
    "question": "<div class=\"question\">What is the safe distance to maintain from the front of a jet engine when it's running?</div>",
    "options": ["10 meters", "3 meters", "5.79 meters", "15 meters"],
    "answer_index": 2,
    "explanation": "5.79 meters is the minimum safe distance from the front of an operating jet engine to avoid jet ingest."
  },
  {
    "question": "<div class=\"question\">What does jet blast refer to?</div>",
    "options": ["Air sucked in from the front", "High-velocity air expelled from the rear of the engine", "Engine oil leak", "Loud engine noise"],
    "answer_index": 1,
    "explanation": "Jet blast is the high-speed air expelled from the rear of a jet engine, which can be dangerous."
  },
  {
    "question": "<div class=\"question\">Before approaching an aircraft, what must be confirmed according to ramp safety procedure?</div>",
    "options": ["Cabin lights are on", "Ground staff are nearby", "Engines off, ACB off, chocks in place, and engineer's thumbs up", "Fueling is completed"],
    "answer_index": 2,
    "explanation": "Approach is only safe after engines are off, ACB is off, chocks are placed, and the engineer signals all-clear."
  },
  {
    "question": "<div class=\"question\">Where is the ACB located on an Airbus aircraft?</div>",
    "options": ["On each wing", "Only under the tail", "Top and bottom of the fuselage", "Near the engine nacelle"],
    "answer_index": 2,
    "explanation": "On Airbus aircraft, ACB lights are located on the top and bottom of the fuselage."
  },
  {
    "question": "<div class=\"question\">How many cones are used for an Airbus A320 under normal weather conditions?</div>",
    "options": ["8", "11", "10", "6"],
    "answer_index": 1,
    "explanation": "11 cones are used to mark the safe zone around the A320 during normal weather conditions."
  },
  {
    "question": "<div class=\"question\">How many chocks are used for an ATR in high wind conditions?</div>",
    "options": ["12", "8", "6", "10"],
    "answer_index": 2,
    "explanation": "The ATR uses 6 chocks regardless of wind conditions."
  },
  {
    "question": "<div class=\"question\">What should be done with FOD items found on the ramp?</div>",
    "options": ["Hand over to the pilot", "Place in the FOD bin", "Throw in regular trash", "Leave near the aircraft tires"],
    "answer_index": 1,
    "explanation": "All FOD items must be placed in the designated FOD bin to avoid hazards."
  },
  {
    "question": "<div class=\"question\">Which aircraft has six passenger doors: L1, L3, L4, R1, R3, R4?</div>",
    "options": ["ATR", "A321", "A320", "B737"],
    "answer_index": 1,
    "explanation": "The Airbus A321 has six passenger doors, unlike the A320 or ATR."
  },
  {
    "question": "<div class=\"question\">In windy conditions above 25 knots, what must be done with cones?</div>",
    "options": ["Add more cones", "Attach cones to ropes", "Remove all cones", "Double their placement"],
    "answer_index": 2,
    "explanation": "All cones must be removed when wind speed exceeds 25 knots to avoid them becoming flying hazards."
  },
  {
    "question": "<div class=\"question\">What is 'Hotel Mode' in an ATR aircraft?</div>",
    "options": ["Crew rest mode", "Passenger entertainment mode", "Power from APU when engines are off", "External power via GPU"],
    "answer_index": 2,
    "explanation": "Hotel Mode refers to using the aircraft's APU to power systems while engines are off."
  },
  {
    "question": "<div class=\"question\">Which doors are used in a 3-door operation for the Airbus A320?</div>",
    "options": ["L1, L4, R1", "L1, L2, R1", "L1, L3, R3", "L2, L4, R2"],
    "answer_index": 1,
    "explanation": "The A320 uses L1, L2, and R1 for 3-door operations."
  },
  {
    "question": "<div class=\"question\">What makes the ATR aircraft visually distinct compared to the A320 or A321?</div>",
    "options": ["It has four engines", "It uses propellers and has a smaller passenger capacity", "It is double-decker", "It lacks landing gear"],
    "answer_index": 1,
    "explanation": "The ATR uses propellers, not jet engines, and has a smaller passenger capacity, making it visually distinct."
  },
{
    "question": "What is the purpose of the Load Distribution Message (LDM) in aircraft operations?",
    "options": [
      "To display fuel consumption rates",
      "To track in-flight turbulence",
      "To balance passengers and cargo to maintain aircraft stability",
      "To list emergency procedures"
    ],
    "answer_index": 2,
    "explanation": "The LDM helps ensure proper balance of passengers, cargo, and baggage so the aircraft doesn't become unstable during flight."
  },
  {
    "question": "What are the three main columns found in the Load Instruction Report (LIR)?",
    "options": [
      "Initial Load, Extra Load, Final Load",
      "Cargo In, Cargo Out, Cargo Final",
      "Arrival Load, Planned Loading, Final Loading",
      "Passenger Count, Cargo Weight, Mail Load"
    ],
    "answer_index": 2,
    "explanation": "The LIR contains three columns: Arrival Load, Planned Loading, and Final Loading to reflect what’s already onboard, planned to load, and finally loaded."
  },
  {
    "question": "Where should Human Remains (HUM) be loaded on an Airbus aircraft?",
    "options": [
      "Compartment 3 with pets",
      "Bulk hold (compartment 5), head facing the aircraft nose",
      "Main cargo deck, tail-facing",
      "Next to regular baggage in compartment 1"
    ],
    "answer_index": 1,
    "explanation": "HUM must be loaded in the bulk hold (compartment 5), head facing the nose, to ensure respect and proper handling during flight."
  },
  {
    "question": "At what wind speed should ramp operations start being shut down according to the wind chart?",
    "options": [
      "Above 60 knots",
      "10-20 knots",
      "30-40 knots",
      "15-25 knots"
    ],
    "answer_index": 0,
    "explanation": "At 60 knots and above, operations must be stopped due to extreme safety risks on the ramp."
  },
  {
    "question": "What is the correct action if a ramp staff notices a crack in an aircraft engine?",
    "options": [
      "Ignore it if the flight is urgent",
      "Report to the Aircraft Engineer and Safety Team immediately",
      "Call the airline manager",
      "Fix it using basic tools on site"
    ],
    "answer_index": 1,
    "explanation": "Cracks must be reported immediately to the Aircraft Engineer and Safety Team to prevent accidents."
  },
  {
    "question": "Which of the following is NOT a type of boarding pass mentioned in the training?",
    "options": [
      "DigiYatra Boarding Pass",
      "Manual Boarding Pass",
      "Smartwatch Boarding Pass",
      "Web Check-in Boarding Pass"
    ],
    "answer_index": 2,
    "explanation": "Smartwatch boarding pass is not mentioned in the transcript; only DigiYatra, Manual, Web Check-in, Kiosk, and Counter-issued passes are."
  },
  {
    "question": "How should hazards be reported according to the SMS (Safety Management System) procedure?",
    "options": [
      "Directly call airport police",
      "Use the SMS form or the 6E Breez platform",
      "Send a message to the pilot",
      "Leave a note at the ramp office"
    ],
    "answer_index": 1,
    "explanation": "Hazards should be reported using the SMS form or the digital option on 6E Breez to ensure proper documentation and follow-up."
  },
  {
    "question": "What does SSR on a boarding pass indicate?",
    "options": [
      "Flight status update",
      "Special Service Request like wheelchair type needed",
      "Seat number change",
      "Security clearance level"
    ],
    "answer_index": 1,
    "explanation": "SSR (Special Service Request) codes guide staff in providing specific assistance, such as the appropriate wheelchair type."
  },
  {
    "question": "What is the correct response if a customer leaves dissatisfied at the airport?",
    "options": [
      "Email the CEO directly",
      "Report it to PSHD with details like name, PNR, and recovery action taken",
      "Do nothing unless asked",
      "Offer a free upgrade"
    ],
    "answer_index": 1,
    "explanation": "Such cases must be reported to PSHD with the customer’s name, PNR, issue summary, and what assistance was offered."
  },
  {
    "question": "Which of these is a correct disability type that affects how people interact with the world?",
    "options": [
      "Tired Legs",
      "Food Allergy",
      "Autism Spectrum Disorder (ASD)",
      "Motion Sickness"
    ],
    "answer_index": 2,
    "explanation": "ASD is a recognized neurodevelopmental condition affecting communication and behavior, and is listed in the transcript."
  },
  {
    "question": "What is a key safety measure when handling Human Remains (HUM) on the ramp?",
    "options": [
      "Strap it with two safety belts and place it upside-down",
      "Always load it near the cockpit for supervision",
      "Use two straps and ensure 'This Side Up' labels are followed correctly",
      "Keep it next to live animals for companionship"
    ],
    "answer_index": 2,
    "explanation": "HUM must be secured with two straps and loaded as labeled—always head forward and 'This Side Up' adhered to strictly."
  }
  ];

  function getCurrentUser() {
    return localStorage.getItem('user') || 'guest';
  }

  function getUserAttempts() {
    const user = getCurrentUser();
    return parseInt(localStorage.getItem(`attempts_${user}`) || "0", 10);
  }

  function setUserAttempts(count) {
    const user = getCurrentUser();
    localStorage.setItem(`attempts_${user}`, count.toString());
  }

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

    startButton.style.display = "none";
    startTimer();
  }

  function submitAnswer(index) {
    if (answeredQuestions[index] === true) return;

    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) return;

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

    progressBar.style.width = `${((currentIndex + 1) / quizData.length) * 100}%`;
  }

  function startTimer() {
    let remainingTime = 60;
    const timer = document.getElementById("timer");
    timer.textContent = `Time: ${remainingTime}s`;
    timer.className = "timer green";
    alertElement.style.display = "none";

    timerInterval = setInterval(() => {
      remainingTime--;
      timer.textContent = `Time: ${remainingTime}s`;

      if (remainingTime <= 10) {
        timer.className = "timer red";
        alertElement.style.display = "block";
      } else {
        alertElement.style.display = "none";
      }

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        alertElement.style.display = "none";

        // Instead of auto-submitting or moving to next, just notify the user
        const timerDiv = document.getElementById("timer");
        timerDiv.textContent = "Time's up!";
        timerDiv.className = "timer red";

        alert("Time's up! Please choose an option and click Submit to continue.");
        // Let user still select and submit manually
      }
    }, 1000);
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

  window.startQuiz = function () {
    const attempts = getUserAttempts();

    if (attempts >= 4) {
      alert("You have used all 4 attempts. The quiz is now locked and you cannot try again.");
      return;
    }

    alert(`Attempt ${attempts + 1} of 4. You have ${4 - attempts} attempts remaining.`);

    score = 0;
    currentIndex = 0;
    answeredQuestions = new Array(quizData.length).fill(false);

    scoreContainer.innerHTML = "";
    container.style.display = "block";
    alertElement.style.display = "none";
    startButton.style.display = "none";
    questionCounter.textContent = `Q 1 / ${quizData.length}`;
    progressBar.style.width = "0%";

    renderQuestion(currentIndex);
    startTime = Date.now();
  };

  function endQuiz() {
    clearInterval(timerInterval);
    alertElement.style.display = "none";

    const totalQuestions = quizData.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(1);

    const passed = percentage >= 90;

    if (!passed) {
      let attempts = getUserAttempts();
      attempts++;
      setUserAttempts(attempts);
    }

    const attempts = getUserAttempts();

    let failMessage = "";
    if (!passed) {
      const failMessages = [
    "Almost there! You didn’t pass this time, but reviewing your answers will help you improve.",
    "Remember, every mistake is a learning opportunity—keep at it!",
    "Your persistence is key! Each attempt builds your knowledge and skill.",
    "This time was tough, but your dedication is what counts. Keep going!"
  ];
      failMessage = failMessages[Math.min(attempts - 1, failMessages.length - 1)];
    }

    scoreContainer.innerHTML = `
      <div class="highlight-latest-result">🎉 You scored ${score} / ${totalQuestions} (${percentage}%)</div>
      <div style="font-weight:bold; font-size:1.2em; margin: 10px auto 20px auto; color: ${passed ? 'green' : 'red'}; text-align: center; width: fit-content;">
        ${passed ? "🎉 Congratulations, You Passed!" : failMessage}
      </div>

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

    startButton.style.display = "block";
    startButton.textContent = "Home Page";
    startButton.style.margin = "20px auto";
    startButton.style.width = "fit-content";
    startButton.onclick = () => {
      window.location.href = "index.html";
    };
  }

  window.restartQuiz = function () {
    const attempts = getUserAttempts();
    if (attempts >= 4) {
      alert("You have used all 4 attempts. The quiz is now locked and you cannot try again.");
      return;
    }
    startQuiz();
  };

  function saveScore(score, totalQuestions) {
    const user = getCurrentUser();
    let history = JSON.parse(localStorage.getItem(`history_${user}`) || "[]");

    history.push({
      date: new Date().toISOString(),
      score,
      total: totalQuestions,
      timeTaken: Math.floor((Date.now() - startTime) / 1000)
    });

    localStorage.setItem(`history_${user}`, JSON.stringify(history));
  }

  function markQuizAsPassedIfEligible(score, total) {
    const user = getCurrentUser();
    if ((score / total) >= 0.9) {
      localStorage.setItem(`passed_${user}`, "true");
    }
  }

  window.viewHistory = function () {
    const user = getCurrentUser();
    const history = JSON.parse(localStorage.getItem(`history_${user}`) || "[]");

    if (!history.length) {
      alert("No history available.");
      return;
    }

    let msg = "Your Quiz History:\n";
    history.forEach((h, i) => {
      msg += `${i + 1}. Date: ${new Date(h.date).toLocaleString()}, Score: ${h.score}/${h.total}, Time: ${h.timeTaken}s\n`;
    });

    alert(msg);
  };

  window.viewIncorrectAnswers = function () {
    let msg = "Incorrect Answers:\n";

    answeredQuestions.forEach((ans, idx) => {
      if (ans && ans !== true) {
        const q = quizData[idx];
        msg += `Q${idx + 1}: ${q.question}\nYour Answer: ${q.options[ans.userAnswer] || "No Answer"}\nCorrect Answer: ${q.options[ans.correctAnswer]}\n\n`;
      }
    });

    if (msg === "Incorrect Answers:\n") msg = "No incorrect answers to show.";

    alert(msg);
  };

  window.generatePDF = function () {
    const user = getCurrentUser();
    const history = JSON.parse(localStorage.getItem(`history_${user}`) || "[]");
    if (!history.length) {
      alert("No history available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Quiz History", 10, 10);

    let y = 20;
    history.forEach((h, i) => {
      const line = `${i + 1}. Date: ${new Date(h.date).toLocaleString()}, Score: ${h.score}/${h.total}, Time: ${h.timeTaken}s`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("quiz-history.pdf");
  };

  container.style.display = "none";
  alertElement.style.display = "none";

  startButton.onclick = startQuiz;

  document.getElementById("sound-icon").textContent = "🔊";
  document.getElementById("sound-text").textContent = "Sound ON";
});
