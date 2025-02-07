import formatData from "./helper.js";
const loader = document.getElementById("loader");
const container = document.getElementById("container");
const questionText = document.getElementById("question-text");
const answerList = document.querySelectorAll(".answer-text");
const scoreText = document.getElementById("score");
const nextButton = document.getElementById("next-button");
const questionNumber = document.getElementById("question-number");

const COREECT_BONUS = 10;
const BASE_URL =
  "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";
let formatedData = null;
let questionIndex = 0;
let correctAnswer = null;
let score = 0;
let isAccepted = true;

const fetchData = async () => {
  const response = await fetch(BASE_URL);
  const json = await response.json();
  formatedData = formatData(json.results);
  //  console.log(formatedData);
  start();
};
const start = () => {
  showQuestion();
  loader.style.display = "none";
  container.style.display = "block";
};
const showQuestion = () => {
  questionNumber.innerText = questionIndex + 1;
  const { question, answer, correctAnswerIndex } = formatedData[questionIndex];
  // console.log(answer, answerList);
  correctAnswer = correctAnswerIndex;
  console.log(correctAnswer);
  questionText.innerText = question;
  answerList.forEach((button, index) => {
    button.innerText = answer[index];
  });
};
const checkAnswer = (event, index) => {
  if (!isAccepted) return;
  isAccepted = false;
  const isCorrect = index === correctAnswer ? true : false;
  if (isCorrect) {
    event.target.classList.add("correct");
    score += COREECT_BONUS;
    scoreText.innerText = score;
  } else {
    event.target.classList.add("incorrect");
    answerList[correctAnswer].classList.add("correct");
  }
};

const nexthandler = () => {
  questionIndex++;
  if (questionIndex < formatedData.length) {
    isAccepted = true;
    removeClasses();
    showQuestion();
  } else {
    localStorage.setItem("score", JSON.stringify(score))
   window.location.assign("/end.html")
  }
};
const removeClasses = () => {
  answerList.forEach((button) => (button.className = "answer-text"));
};
window.addEventListener("load", fetchData);
nextButton.addEventListener("click", nexthandler);
answerList.forEach((button, index) => {
  const handler = () => checkAnswer(index);
  button.addEventListener("click", (event) => checkAnswer(event, index));
});
