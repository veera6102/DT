document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll on nav link click handled natively by CSS scroll-behavior
  // But add keyboard focus for SPA-like experience:
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetID = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetID);
      if (target) {
        target.focus({preventScroll: true});
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

  // FAQ toggle with proper aria-expanded and aria-controls support
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const isVisible = answer.classList.contains('visible');

      // Close all answers
      faqQuestions.forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.nextElementSibling.classList.remove('visible');
      });

      // Toggle this one if it was not open
      if (!isVisible) {
        answer.classList.add('visible');
        button.setAttribute('aria-expanded', 'true');
      }
    });

    // Make FAQ expandable by keyboard
    button.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });

  // Contact form validation and submission
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    alert(`Thank you, ${name}! Your message has been sent successfully.`);
    form.reset();
  });

  function validateEmail(email) {
    // Basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Quiz demo functionality
  const quizData = [
    {
      question: "What is personalized learning?",
      answers: [
        {text: "One-size-fits-all approach", correct: false},
        {text: "Tailored educational content", correct: true},
        {text: "Only textbook learning", correct: false},
        {text: "Learning without feedback", correct: false},
      ],
    },
    {
      question: "Which feature motivates students using rewards?",
      answers: [
        {text: "Adaptive quizzes", correct: false},
        {text: "Gamification", correct: true},
        {text: "Instant feedback", correct: false},
        {text: "Visual aids", correct: false},
      ],
    },
    {
      question: "What helps students identify weak areas?",
      answers: [
        {text: "Inconsistent performance", correct: false},
        {text: "Progress tracking", correct: true},
        {text: "Boring lessons", correct: false},
        {text: "Stress and burnout", correct: false},
      ],
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;

  const questionEl = document.getElementById('question');
  const answersEl = document.getElementById('answers');
  const nextBtn = document.getElementById('next-btn');
  const scoreEl = document.getElementById('score');

  function loadQuestion() {
    resetAnswers();
    const current = quizData[currentQuestionIndex];
    questionEl.textContent = current.question;
    current.answers.forEach(({text, correct}) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.type = 'button';
      btn.textContent = text;
      btn.dataset.correct = correct;
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', selectAnswer);
      answersEl.appendChild(btn);
    });
    nextBtn.disabled = true;
    scoreEl.textContent = '';
    scoreEl.classList.add('hidden');
  }

  function resetAnswers() {
    while (answersEl.firstChild) {
      answersEl.removeChild(answersEl.firstChild);
    }
  }

  function selectAnswer(e) {
    const selectedBtn = e.target;
    const correct = selectedBtn.dataset.correct === 'true';

    Array.from(answersEl.children).forEach(btn => {
      btn.disabled = true;
      btn.classList.remove('selected');
      if (btn.dataset.correct === 'true') {
        btn.style.backgroundColor = '#28a745';  // green
        btn.style.color = '#fff';
      } else {
        btn.style.backgroundColor = '#dc3545';  // red
        btn.style.color = '#fff';
      }
      btn.setAttribute('aria-pressed', 'false');
    });

    if (correct) {
      score++;
      selectedBtn.style.backgroundColor = '#218838'; // darker green
    } else {
      selectedBtn.style.backgroundColor = '#c82333'; // darker red
    }
    selectedBtn.classList.add('selected');
    selectedBtn.setAttribute('aria-pressed', 'true');
    nextBtn.disabled = false;
  }

  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      loadQuestion();
    } else {
      showScore();
    }
  });

  function showScore() {
    questionEl.textContent = `Quiz Complete! Your score: ${score} out of ${quizData.length}.`;
    resetAnswers();
    nextBtn.disabled = true;
    scoreEl.classList.remove('hidden');
    scoreEl.textContent = `Excellent effort! Keep up the great work to reach your goals.`;
  }

  // Initialize quiz on page load
  loadQuestion();
});
