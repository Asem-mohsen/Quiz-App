// Select element
let countSpan = document.querySelector(".quiz-info .count span");
let Bullets = document.querySelector(".bullets");
let BulletsSpanContainer = document.querySelector(".bullets .spans");
let QuestionContainer = document.querySelector(".Quiz-area");
let AnswersArea = document.querySelector(".asnwers-area");
let SubmitButton = document.querySelector(".submit-button");
let ResultContainer = document.querySelector(".results");
let CountDownElement = document.querySelector(".count-down");

//Set Option

let CurrentIndex = 0;
let RightAnswers = 0;
let CountDownInterval;

function GetQuestions() {
  let MyRequest = new XMLHttpRequest();

  MyRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let QuestionsObject = JSON.parse(this.responseText);
      let QuestionsCount = QuestionsObject.length;

      // Create Bullets  + set Questions Count
      CreateBullets(QuestionsCount);

      // Add Question data
      addQuestionData(QuestionsObject[CurrentIndex], QuestionsCount);

      //Start CountDown
      CountDown(100, QuestionsCount);

      // click on Submit Button
      SubmitButton.onclick = () => {
        //Get Right answer
        let TheRightAnswer = QuestionsObject[CurrentIndex].right_answer;

        //Increase Index
        CurrentIndex++;

        //Check The answer
        CheckAnswer(TheRightAnswer, QuestionsCount);

        // Remove Previous Question
        QuestionContainer.innerHTML = "";
        AnswersArea.innerHTML = "";

        //Add Question Data
        addQuestionData(QuestionsObject[CurrentIndex], QuestionsCount);

        //Handle Bullets class
        handleBullets();

              //Start CountDown
              clearInterval(CountDownInterval);
      CountDown(100, QuestionsCount);
       
        //Show Result
        ShowResults(QuestionsCount);
      };
    }
  };
  MyRequest.open("GET", "../JSON/Questions.json", true);
  MyRequest.send();
}

GetQuestions();

function CreateBullets(num) {
  countSpan.innerHTML = num;

  // create spans
  for (let i = 0; i < num; i++) {
    // Create Span
    let TheBullet = document.createElement("span");

    //Check if first span add on
    if (i === 0) {
      TheBullet.className = "on";
    }

    //Append Bullet to man Bullet Container
    BulletsSpanContainer.appendChild(TheBullet);
  }
}
function addQuestionData(obj, count) {
  if (CurrentIndex < count) {
    //Create H2 question
    let Questiontitle = document.createElement("h2");

    // Create question Text
    let QuestionText = document.createTextNode(obj["title"]);

    //append text to h2
    Questiontitle.appendChild(QuestionText);

    //apend h2 question into quiz-area
    QuestionContainer.appendChild(Questiontitle);

    //Create the answers
    for (let i = 1; i <= 4; i++) {
      // Create answer div
      let Mydiv = document.createElement("div");

      //Add class to mydic
      Mydiv.className = "answer";

      //Create radio input
      let RadioInput = document.createElement("input");

      //Add type and name and id and data attribute to the input
      RadioInput.name = "questions";
      RadioInput.type = "radio";
      RadioInput.id = `answer_${i}`;
      RadioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option checked
      if (i === 1) {
        RadioInput.checked = true;
      }

      //Create label
      let TheLabel = document.createElement("label");

      //Add for Attribute inside label
      TheLabel.htmlFor = `answer_${i}`;

      //Create label text
      let ThelabelText = document.createTextNode(obj[`answer_${i}`]);

      //Add the text into the label
      TheLabel.appendChild(ThelabelText);

      //Add the label and input to main div
      Mydiv.appendChild(RadioInput);
      Mydiv.appendChild(TheLabel);

      //Append All divs to Answers Area
      AnswersArea.appendChild(Mydiv);
    }
  }
}

function CheckAnswer(RightAnswer, count) {
  let answers = document.getElementsByName("questions");
  let ChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      ChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (RightAnswer === ChoosenAnswer) {
    RightAnswers++;
  }
}
function handleBullets() {
  let BulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(BulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (CurrentIndex === index) {
      span.className = "on";
    }
  });
}

function ShowResults(count) {
  let TheResult;

  if (CurrentIndex === count) {
    QuestionContainer.remove();
    AnswersArea.remove();
    SubmitButton.remove();
    Bullets.remove();

    if (RightAnswers > count / 2 && RightAnswers < count) {
      TheResult = `<span class="good"> Good </span>, ${RightAnswers} out of ${count}. `;
    } else if (RightAnswers === count) {
      TheResult = `<span class="perfect"> Perfcet </span>, ${RightAnswers} out of ${count}. `;
    } else {
      TheResult = `<span class="bad"> Bad </span>, ${RightAnswers} out of ${count}. `;
    }
    ResultContainer.innerHTML = TheResult;
    ResultContainer.style.padding = "10px";
    ResultContainer.style.backgroundColor = "White";
    ResultContainer.style.marginTop = "10px";
  }
}

function CountDown(duration, count){
    if (CurrentIndex < count ) {
   let minutes, seconds;
   
   CountDownInterval = setInterval(function(){

    minutes = parseInt(duration / 60);
    seconds = parseInt(duration % 60 );

    minutes = minutes <10 ? `0${minutes}`:minutes;
    seconds = seconds <10 ? `0${seconds}`:seconds;

CountDownElement.innerHTML = `${minutes}:${seconds}`;

if(--duration < 0 ){
    clearInterval(CountDownInterval);
    SubmitButton.click();

}

   },1000);
   
    }

}
