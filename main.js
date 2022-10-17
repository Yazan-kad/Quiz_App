//Select Elements 
let countSpan = document.querySelector(".count span");
let bulletsSpanCountiner = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsCountainer = document.querySelector(".results");
let counrdownElement = document.querySelector(".countdown");

//Set Option
let currentIndex = 0;
let rightAnswers = 0;
let countdownIntervel;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionObject =JSON.parse(this.responseText);
            let qcount = questionObject.length;
            console.log(qcount);


            //Create Bullets + Set Question Count
            createBullets(qcount);


            //Add Question Data
            addQuestionData(questionObject[currentIndex], qcount);

            //Start Count Down
            countdown(10, qcount);

            //Click On Submit
            submitButton.onclick = () => {
                //Get Right  Answer
                let theRightAnswer = questionObject[currentIndex].right_answer;
                
                //Incress Index
                currentIndex++

                //Check The Answer
                checkAnswer(theRightAnswer, qcount);

                //Remove Pervious Question
                quizArea.innerHTML="";
                answerArea.innerHTML="";

                //Add Question Data
                addQuestionData(questionObject[currentIndex], qcount);

                //Handel Bullets Class
                handelBullets();

                //Start Count Down
                clearInterval(countdownIntervel);
                countdown(10, qcount);

                //Show Results
                showResults(qcount);    
            }
        }
    }
    myRequest.open("GET", "html_questions.json", true);
    myRequest.send();
}
getQuestions()


function createBullets(num) {
    countSpan.innerHTML = num;

    //Create Span
    for (let i = 0; i < num; i++) {
        //Create Bullet
        let theBullets = document.createElement("span");

        //check If Its First Span
        if ( i === 0) {
            theBullets.className= 'on';
        }
        //Append Bllues To Main Bullets Container
        bulletsSpanCountiner.appendChild(theBullets);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        //Create H2 Question Title
    let questionTitle = document.createElement("h2");

    //Create Question Text
    let questionText = document.createTextNode(obj.title);

    //Append Text To H2
    questionTitle.appendChild(questionText);

    //Append H2 To quiz Area
    quizArea.appendChild(questionTitle);

    //Create The Answers
    for (let i = 1; i <= 4; i++) {
        //Create Main Answer Div
        let mainDiv = document.createElement("div");

        //Add Class To Main Div
        mainDiv.className = 'answer';

        //Create Radio Input
        let radioInput = document.createElement("input");

        //Add Type + Name + Id + Data-Atttribute
        radioInput.name = 'question';
        radioInput.type = 'radio';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        //Make First Option Selected
        if (i === 1) {
            radioInput.checked = true;
        }
        //Create Label
        let theLabel = document.createElement("label")

        //Add For Attrubite
        theLabel.htmlFor = `answer_${i}`;

        //Create Label Text
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);

        //Add The Text To Label
        theLabel.appendChild(theLabelText);

        //Add Input + Label to Main Div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        //Append All Divs To Answer Area 
        answerArea.appendChild(mainDiv);
    }
    }

}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let  i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++
        console.log("Good Answer");
    }
}

function handelBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = 'on';
        }
    })
}

function showResults(count) {
    let theResults;
    if(currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers > (count / 2) && rightAnswers < count) {
            theResults =`<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good.`;
        } else if (rightAnswers === count) {
            theResults =`<span class="perfect">Perfect</span>, ${rightAnswers} From ${count} Is Perfect.`;
        } else {
            theResults =`<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is Bad.`;
        }


        resultsCountainer.innerHTML = theResults;
        resultsCountainer.style.padding = '10px';
        resultsCountainer.style.backgroundColor = 'white';
        resultsCountainer.style.marginTop = '10px';

    }
}

function countdown (duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownIntervel = setInterval( () => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes =minutes < 10 ? `0${minutes}` : minutes;
            seconds =seconds < 10 ? `0${seconds}` : seconds;

            counrdownElement.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0) {
                clearInterval(countdownIntervel);
                submitButton.click();
            }
        },1000)
    }
}