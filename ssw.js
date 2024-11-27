//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount;
let scoreCount = 0;
let count = 11;
let countdown;

//Questions and Options array

const quizArray = [
  {
    id: "0",
    question: "من هو الصحابي الذي قال عنه النبي: لو كان نبي من بعدي لكان هو؟",
    options: ["عمر بن الخطاب", "أبو بكر الصديق", "علي بن أبي طالب", "عثمان بن عفان"],
    correct: "عمر بن الخطاب",
  },
  {
    id: "1",
    question: "قال رسول الله صلى الله عليه وسلم: من صام رمضان إيماناً واحتساباً غفر له ما تقدم من ...؟",
    options: ["ذنبه", "ماله", "صحته", "عمره"],
    correct: "ذنبه",
  },
  {
    id: "2",
    question: "قال رسول الله: أقرب ما يكون العبد من ربه وهو ...؟",
    options: ["في الصدقة", "في الصلاة", "في السجود", "في الصيام"],
    correct: "في السجود",
  },
  {
    id: "3",
    question: "قال رسول الله صلى الله عليه وسلم: من غشنا ...؟",
    options: ["أثيم", "فاسق", "ليس منا", "مذنب"],
    correct: "ليس منا",
  },
  {
    id: "4",
    question: "أي الأعمال أحب إلى الله كما قال النبي؟",
    options: ["بر الوالدين", "الجهاد في سبيل الله", "الصلاة على وقتها", "الحج"],
    correct: "الصلاة على وقتها",
  },
  {
    id: "5",
    question: "عن أي شيء سئل رسول الله فقال: الدين النصيحة؟",
    options: ["النفاق", "الأمانة", "الصدق", "الإخلاص"],
    correct: "الإخلاص",
  },
  {
    id: "6",
    question: "قال رسول الله صلى الله عليه وسلم: كل مسكر حرام، وكل خمر ...؟",
    options: ["مكروه", "خمر", "مفسد", "طاهر"],
    correct: "خمر",
  },
  {
    id: "7",
    question: "قال رسول الله: خيركم خيركم ...؟",
    options: ["للأصدقاء", "للأقارب", "للأمة", "لأهله"],
    correct: "لأهله",
  },
  {
    id: "8",
    question: "ما هو أفضل الدعاء يوم عرفة كما قال النبي؟",
    options: ["اللهم ارزقني الجنة", "لا إله إلا الله وحده لا شريك له", "رب اغفر لي", "اللهم أنت ربي لا إله إلا أنت"],
    correct: "لا إله إلا الله وحده لا شريك له",
  },
  {
    id: "9",
    question: "قال رسول الله: إنما الأعمال ...؟",
    options: ["بالمقاصد", "بالنيات", "بالكلام", "بالأفعال"],
    correct: "بالنيات",
  },
  {
    id: "10",
    question: "قال رسول الله: أحب الأعمال إلى الله أدومها وإن ...؟",
    options: ["كانت قليلة", "كانت طويلة", "لم تظهر", "لم تتكرر"],
    correct: "كانت قليلة",
  },
  {
    id: "11",
    question: "قال رسول الله: من كان يؤمن بالله واليوم الآخر فليقل ...؟",
    options: ["الصلاة والسلام على النبي", "خيراً أو ليصمت", "لا إله إلا الله", "آمنت بالله ورسله"],
    correct: "خيراً أو ليصمت",
  },
  {
    id: "12",
    question: "قال رسول الله: تبسمك في وجه أخيك ...؟",
    options: ["عبادة", "صدقة", "محبة", "خير"],
    correct: "صدقة",
  },
  {
    id: "13",
    question: "قال رسول الله: الدين ...؟",
    options: ["النصيحة", "الصدق", "الإخلاص", "التقوى"],
    correct: "النصيحة",
  },
  {
    id: "14",
    question: "ما هو الحديث الذي ينصح بإتباعه الرسول؟",
    options: ["لا ضرر ولا ضرار", "أدوا الزكاة", "صوموا رمضان", "أحسنوا لأهلكم"],
    correct: "لا ضرر ولا ضرار",
  },
  {
    id: "15",
    question: "قال رسول الله: المسلم من سلم المسلمون من ...؟",
    options: ["يده ولسانه", "عيبه", "طمعه", "كذبه"],
    correct: "يده ولسانه",
  },
  {
    id: "16",
    question: "قال رسول الله: الطهور شطر ...؟",
    options: ["الإيمان", "الصلاة", "الصيام", "التوبة"],
    correct: "الإيمان",
  },
  {
    id: "17",
    question: "قال رسول الله: من غفر لغيره غفر الله له، ومن عفا عفى الله عنه",
    options: ["العفو", "الرحمة", "الغفران", "الصبر"],
    correct: "العفو",
  },
  {
    id: "18",
    question: "ما هو الحديث الذي يحث على الدعاء للغير؟",
    options: ["إنما الأعمال بالنيات", "أحب الأعمال إلى الله", "ما نقص مال من صدقة", "دعاء المسلم لأخيه بظهر الغيب مستجاب"],
    correct: "دعاء المسلم لأخيه بظهر الغيب مستجاب",
  },
  {
    id: "19",
    question: "قال رسول الله: من كان يؤمن بالله واليوم الآخر فلا يؤذي ...؟",
    options: ["أخاه المسلم", "أهله", "الناس", "جاره"],
    correct: "جاره",
  },
  {
    id: "20",
    question: "قال رسول الله: اللهم أرزقني حسن الخاتمة واجعلني من ...",
    options: ["المهتدين", "الصالحين", "الشاكرين", "المؤمنين"],
    correct: "الصالحين",
  },
  {
    id: "21",
    question: "قال رسول الله: لا يؤمن أحدكم حتى يحب لأخيه ...؟",
    options: ["ما يحب لنفسه", "أن يهتدي", "أن يتعلم", "أن يكون أفضل منه"],
    correct: "ما يحب لنفسه",
  },
  {
    id: "22",
    question: "قال رسول الله: من لا يشكر الناس ...؟",
    options: ["لا يستحق الخير", "لا يشكر الله", "لا يرضى", "لا يفوز"],
    correct: "لا يشكر الله",
  },
  {
    id: "23",
    question: "قال رسول الله: إذا مات ابن آدم انقطع عمله إلا من ...؟",
    options: ["ولد صالح يدعو له", "مال صالح ينفق", "علم ينتفع به", "صدقة جارية"],
    correct: "صدقة جارية",
  },
  {
    id: "24",
    question: "قال رسول الله: من صلى علي صلاة واحدة صلى الله عليه بها ...؟",
    options: ["عشرًا", "عشرون", "مئة", "ألف"],
    correct: "عشرًا",
  }
];



//Restart Quiz
restart.addEventListener("click", () => {
  initial();
  displayContainer.classList.remove("hide");
  scoreContainer.classList.add("hide");
});

// Next Button
nextBtn.addEventListener(
  "click",
  (displayNext = () => {
    //increment questionCount
    questionCount += 1;
    // إذا كان السؤال الأخير
    if (questionCount == quizArray.length) {
      // إخفاء حاوية الأسئلة وعرض النتيجة
      displayContainer.classList.add("hide");
      scoreContainer.classList.remove("hide");
      // النتيجة
      userScore.innerHTML =
        "نتيجتتك هيه " + scoreCount + " من " + questionCount;
    } else {
      // عرض رقم السؤال
      countOfQuestion.innerHTML =
        questionCount + 1 + " من " + quizArray.length + " سؤال";
      // عرض السؤال
      quizDisplay(questionCount);
      count = 11;  // إعادة ضبط المؤقت
      clearInterval(countdown);
      timeLeft.style.color = "";  // إعادة اللون إلى الوضع الافتراضي
      timerDisplay();
    }
  })
);

// Timer
const timerDisplay = () => {
  countdown = setInterval(() => {
    count--;
    timeLeft.innerHTML = `${count} ثواني`;

    // عندما يتبقى ثلاث ثواني، غيّر اللون إلى الأحمر
    if (count === 3) {
      timeLeft.style.color = "red";  // تغيير اللون إلى الأحمر
      timeLeft.style.backgroundColor = "rgb(255, 233, 233)";
      timeLeft.style.outline = "rgb(255, 233, 233) solid 4px";
      timeLeft.style.borderRadius = "10px";
    }

    // عندما ينتهي الوقت، أعِد اللون إلى الوضع الطبيعي
    if (count === 0) {
      clearInterval(countdown);
      timeLeft.style.color = "";  // تغيير اللون إلى الأحمر
      timeLeft.style.backgroundColor = "";
      timeLeft.style.outline = "";
      timeLeft.style.borderRadius = "";
      displayNext();
    }
  }, 1000);
};


//Display quiz
const quizDisplay = (questionCount) => {
  let quizCards = document.querySelectorAll(".container-mid");
  //Hide other cards
  quizCards.forEach((card) => {
    card.classList.add("hide");
  });
  //display current question card
  quizCards[questionCount].classList.remove("hide");
};

//Quiz Creation
function quizCreator() {
  //randomly sort questions
  quizArray.sort(() => Math.random() - 0.5);
  //generate quiz
  for (let i of quizArray) {
    //randomly sort options
    i.options.sort(() => Math.random() - 0.5);
    //quiz card creation
    let div = document.createElement("div");
    div.classList.add("container-mid", "hide");
    //question number
    countOfQuestion.innerHTML = 1 + " من " + quizArray.length + " سؤال";
    //question
    let question_DIV = document.createElement("p");
    question_DIV.classList.add("question");
    question_DIV.innerHTML = i.question;
    div.appendChild(question_DIV);
    //options
    div.innerHTML += `
    <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
     <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
      <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
       <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
    `;
    quizContainer.appendChild(div);
  }
}

//Checker Function to check if option is correct or not
function checker(userOption) {
  let userSolution = userOption.innerText;
  let question =
    document.getElementsByClassName("container-mid")[questionCount];
  let options = question.querySelectorAll(".option-div");

  //if user clicked answer == correct option stored in object
  if (userSolution === quizArray[questionCount].correct) {
    userOption.classList.add("correct");
    scoreCount++;
  } else {
    userOption.classList.add("incorrect");
    //For marking the correct option
    options.forEach((element) => {
      if (element.innerText == quizArray[questionCount].correct) {
        element.classList.add("correct");
      }
    });
  }

  //clear interval(stop timer)
  clearInterval(countdown);
  //disable all options
  options.forEach((element) => {
    element.disabled = true;
  });
}

//initial setup
function initial() {
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  count = 11;
  clearInterval(countdown);
  timerDisplay();
  quizCreator();
  quizDisplay(questionCount);
}

//when user click on start button
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  displayContainer.classList.remove("hide");
  initial();
});

//hide quiz and display start screen
document.addEventListener('DOMContentLoaded', function() {
  startScreen.classList.remove("hide");
  displayContainer.classList.add("hide");
});

