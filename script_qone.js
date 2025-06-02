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
    "question": "<div class=\"question\">What does the acronym RAMP stand for?<span class=\"asked-in\"></span></div>",
    "options": ["Rapid Aircraft Maintenance Place", "Region of Aircraft Movement and Parking", "Runway and Maneuvering Platform", "Ramp and Apron Management Point"],
    "answer_index": 1,
    "explanation": "RAMP stands for 'Region of Aircraft Movement and Parking'—the area where aircraft are parked, moved, and serviced."
  },
  {
    "question": "<div class=\"question\">What is the function of the AEP at an airport?<span class=\"asked-in\"></span></div>",
    "options": ["It is used for fueling aircraft", "It’s a safety checklist", "It grants access to airside areas", "It is a baggage tracking system"],
    "answer_index": 2,
    "explanation": "AEP stands for Aerodrome Entry Permit. It grants restricted access to the airside and must be visible at all times."
  },
  {
    "question": "<div class=\"question\">Which of the following is not part of the Personal Protective Equipment (PPE) kit?<span class=\"asked-in\"></span></div>",
    "options": ["Ramp Jacket", "Safety Shoes", "Helmet", "Earplugs"],
    "answer_index": 2,
    "explanation": "The PPE kit includes Ramp Jacket, Safety Shoes, Earplugs, Safety Gloves, Cap, Face Shield, Rainwear and Rain Boots—but not a helmet."
  },
  {
    "question": "<div class=\"question\">What is a 'bay' in the context of airport ramp operations?<span class=\"asked-in\"></span></div>",
    "options": ["Aircraft refueling point", "Parking spot for planes", "Passenger check-in counter", "Taxi lane for aircraft"],
    "answer_index": 1,
    "explanation": "A bay is an individual parking spot for aircraft, such as Bay 20 or Bay 34."
  },
  {
    "question": "<div class=\"question\">What is the purpose of the Tail Clearance Line (TCL)?<span class=\"asked-in\"></span></div>",
    "options": ["Guides passengers during boarding", "Helps locate lost baggage", "Ensures aircraft tail doesn’t hit adjacent structures", "Marks the stop point for nose wheel"],
    "answer_index": 2,
    "explanation": "The TCL ensures that the aircraft tail remains safely within designated space to avoid collisions."
  },
  {
    "question": "<div class=\"question\">Which of these vehicles is used to move aircraft or baggage trolleys?<span class=\"asked-in\"></span></div>",
    "options": ["Passenger Ramp", "Trussel", "TUG", "Water Cart"],
    "answer_index": 2,
    "explanation": "The TUG is used to tow aircraft and baggage trolleys at the airport."
  },
  {
    "question": "<div class=\"question\">Which color code is used to mark the Equipment Restraint Area (ERA)?<span class=\"asked-in\"></span></div>",
    "options": ["Yellow", "White", "Red", "Blue"],
    "answer_index": 2,
    "explanation": "Red is used to mark restricted areas like the ERA and the No Parking Zone under the aerobridge."
  },
  {
    "question": "<div class=\"question\">What is the speed limit for ground vehicles on service roads within the airport?<span class=\"asked-in\"></span></div>",
    "options": ["30 km/h", "20 km/h", "10 km/h", "15 km/h"],
    "answer_index": 3,
    "explanation": "The speed limit on service roads is 15 km/h to ensure safety on the ramp."
  },
  {
    "question": "<div class=\"question\">What does the 'Safety Diamond' refer to in ramp operations?<span class=\"asked-in\"></span></div>",
    "options": ["Aircraft maintenance schedule", "A restricted safety zone marked around aircraft", "Fuel tank indicator", "Type of apron design"],
    "answer_index": 1,
    "explanation": "The Safety Diamond is an imaginary shape created using cones around the aircraft to indicate a low-speed safety zone."
  },
  {
    "question": "<div class=\"question\">Which equipment connects ATR aircraft with the ground crew for boarding?<span class=\"asked-in\"></span></div>",
    "options": ["Trestle", "Passenger Ramp", "Aerobridge", "GPU"],
    "answer_index": 0,
    "explanation": "The trestle is a specialized step system used for boarding ATR aircraft."
  },
  {
    "question": "<div class=\"question\">Which statement is a correct Do for airside safety?<span class=\"asked-in\"></span></div>",
    "options": ["Use your phone while walking", "Report hazards immediately", "Walk under aerobridge in motion", "Ignore PPE rules"],
    "answer_index": 1,
    "explanation": "One of the key Do's is to report any hazards or unsafe behavior immediately."
  },
  {
    "question": "<div class=\"question\">What speed should you maintain inside the Safety Diamond zone?<span class=\"asked-in\"></span></div>",
    "options": ["15 km/h", "10 km/h", "5 km/h", "30 km/h"],
    "answer_index": 2,
    "explanation": "Inside the Safety Diamond zone, the speed limit is strictly 5 km/h to ensure maximum safety around aircraft."
  },
  {
    "question": "<div class=\"question\">Why are wing walkers necessary during aircraft parking?<span class=\"asked-in\"></span></div>",
    "options": ["To handle passenger queries", "To guide the aircraft using marshalling bats", "To ensure wings don’t hit obstacles", "To connect power to the aircraft"],
    "answer_index": 2,
    "explanation": "Wing walkers check for obstacles near the wings as aircraft don’t have side mirrors. They ensure a safe, scratch-free parking."
  },
{
    "question": "<div class=\"question\">What is the purpose of the center line in airside markings?<span class=\"asked-in\"></span></div>",
    "options": ["To show where passengers should board", "To guide the aircraft straight into the bay", "To mark the jet blast area", "To indicate safety zones for vehicles"],
    "answer_index": 1,
    "explanation": "The center line is a yellow line that guides the aircraft straight into the bay, much like lane markings for cars."
  },
  {
    "question": "<div class=\"question\">Why is it unsafe to stand inside an aerobridge while it is moving?<span class=\"asked-in\"></span></div>",
    "options": ["Because it is too noisy", "Because there’s no air conditioning", "Because it's like standing on a moving conveyor belt", "Because passengers may get lost"],
    "answer_index": 2,
    "explanation": "Standing inside a moving aerobridge is dangerous—like being on a moving conveyor belt heading towards an aircraft. Safety first!"
  },
  {
    "question": "<div class=\"question\">What is the minimum distance to maintain from the aircraft door when aligning the passenger ramp?<span class=\"asked-in\"></span></div>",
    "options": ["2 feet horizontally and 5 feet vertically", "No minimum distance required", "2 inches horizontally and 7 inches vertically", "1 meter away in all directions"],
    "answer_index": 2,
    "explanation": "You must maintain a 2-inch gap from the aircraft door and stay 7 inches below it to avoid damage."
  },
  {
    "question": "<div class=\"question\">Why is wing walking mandatory both during day and night operations?<span class=\"asked-in\"></span></div>",
    "options": ["To save fuel during taxiing", "Because night lighting is enough", "To guide planes safely regardless of lighting", "To assist in loading luggage"],
    "answer_index": 2,
    "explanation": "Wing walking is mandatory at all times to ensure aircraft are guided safely, especially during low visibility like at night."
  },
  {
    "question": "<div class=\"question\">Who does the marshaller signal during taxiing out from a Pushback Bay?<span class=\"asked-in\"></span></div>",
    "options": ["Ground staff only", "Passengers", "The wing walker", "The cockpit crew"],
    "answer_index": 3,
    "explanation": "In a Pushback Bay, the marshaller guides the cockpit crew using signals to ensure safe pushback."
  },

  {
    "question": "<div class=\"question\">Why can't vehicles be parked under the aerobridge?<span class=\"asked-in\"></span></div>",
    "options": ["It blocks the aircraft view", "It can cause tire punctures", "Aerobridge movement can pose a safety hazard", "Passengers might trip over them"],
    "answer_index": 2,
    "explanation": "Vehicles should not park under the aerobridge because it could move and cause damage—like a falling tree during a storm."
  },
  {
    "question": "<div class=\"question\">Which visual system helps guide aircraft to park precisely in VDGS bays?<span class=\"asked-in\"></span></div>",
    "options": ["Radar system", "Ground traffic lights", "Visual Docking Guidance System", "Aircraft GPS"],
    "answer_index": 2,
    "explanation": "VDGS (Visual Docking Guidance System) assists aircraft in precise docking, functioning like a ground GPS."
  },
  {
    "question": "<div class=\"question\">Who is responsible for pressing the emergency stop button in VDGS bays if required?<span class=\"asked-in\"></span></div>",
    "options": ["Aircraft Captain", "Passenger", "Marshaller", "Flight attendant"],
    "answer_index": 2,
    "explanation": "The marshaller stands by the emergency stop button, ready to intervene for safety."
  },
  {
    "question": "<div class=\"question\">What signal is given to the cockpit crew during taxiing from a Power Out Bay?<span class=\"asked-in\"></span></div>",
    "options": ["Taxi-out clearance from ATC", "Wave of hands", "Wing-walking signal", "Runway exit confirmation"],
    "answer_index": 2,
    "explanation": "During taxiing out from a Power Out Bay, wing-walking signals are given to the cockpit crew for communication and clearance."
  },
  {
    "question": "<div class=\"question\">What must the nose wheel align with during aircraft parking?<span class=\"asked-in\"></span></div>",
    "options": ["Tail clearance mark", "Taxiway intersection", "Stop point", "Wing marker"],
    "answer_index": 2,
    "explanation": "The nose wheel must align precisely with the yellow stop point for correct aircraft positioning."
  },
  {
    "question": "<div class=\"question\">Why are wing walkers essential even with a center line present?<span class=\"asked-in\"></span></div>",
    "options": ["To entertain passengers", "To check for side clearance since aircraft lack mirrors", "To control aerobridge alignment", "To fuel the plane"],
    "answer_index": 1,
    "explanation": "Aircraft don't have side mirrors, so wing walkers are crucial for checking side clearance and preventing collisions."
  },
  {
    "question": "<div class=\"question\">Which details are included in the ETA-15 arrival report?<span class=\"asked-in\"></span></div>",
    "options": ["Passenger list, cargo weight", "Flight ETA, Allocation, A/C Registration, Bay number", "Fuel status, route plan", "Aircraft crew details"],
    "answer_index": 1,
    "explanation": "ETA-15 includes Allocation, Flight ETA, Aircraft Registration, and Bay number to prepare for arrival."
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
    "You’re so close! Take another look at your answers and try once more.",
    "Keep pushing forward! Every try is progress, and your effort really counts.",
    "Don’t give up now—practice makes perfect, and you’re getting closer with each attempt.",
    "This attempt didn’t go as planned, but each step is a step toward success."
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

