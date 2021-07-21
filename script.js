var iconFile;
var rows = 2;
var arrIcon;
var sliderFlag = true;
var canvas1 = document.getElementById("canvas1");
var canvas2 = document.getElementById("canvas2");
var ctx = canvas1.getContext("2d");
var ctx2 = canvas2.getContext("2d");
var errorTimeOut, sliderTimer;
var progressTimer;
var intervalEndGame;
var time;
var z = -2;
(function dotes() {
  for (let index = 0; index < 8; index++) {
    z--;
    document.querySelectorAll(".dot")[index].style.zIndex = z;
    document.querySelectorAll(".dot")[index].style.top =
      Math.floor(Math.random() * 500) + "px";
    document.querySelectorAll(".dot")[index].style.left =
      Math.floor(Math.random() * 330) + "px";
    setInterval(function () {
      document.querySelectorAll(".dot")[index].style.top =
        Math.floor(Math.random() * 500) + "px";
      document.querySelectorAll(".dot")[index].style.left =
        Math.floor(Math.random() * 330) + "px";
    }, 4000);
  }
})();

(function polygons() {
  const a = (2 * Math.PI) / 6;
  var r = 115;
  var flag = "t";

  var c = setInterval(drawHexagon1, 80);
  function drawHexagon1() {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    var x = 150;
    var y = 150;
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255,0.4)";
    ctx.fill();

    if (r == 100) flag = "f";
    if (flag == "f") r++;
    if (r == 115) flag = "t";
    if (flag == "t") r--;
  }

  var r2 = 85;
  var flag2 = "t";

  var c2 = setInterval(drawHexagon2, 80);
  function drawHexagon2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    var x = 150;
    var y = 150;
    ctx2.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx2.lineTo(x + r2 * Math.cos(a * i), y + r2 * Math.sin(a * i));
    }
    ctx2.closePath();
    ctx2.fillStyle = "rgba(255, 255, 255,0.4)";
    ctx2.fill();

    if (r2 == 80) flag2 = "f";
    if (flag2 == "f") r2++;
    if (r2 == 90) flag2 = "t";
    if (flag2 == "t") r2--;
  }
})();

function openGame() {
  arrIcon = [];
  buttonsStructureCreation();
  getIconFile();
  localStorage.setItem("score", 0);
  showInstructions(2000);
  startFullTimer(120, document.getElementById("timeCounter"));
}

function fillButtons() {
  for (let i = 0; i < rows * 3; i++) {
    createButton(i, getRandomShape(i), getRandomLetter(i), getRandomColor());
  }
  generateRandomSlider();
}

function buttonsStructureCreation() {
  for (let i = 0; i < rows; i++) {
    var btnContainerRow = document.createElement("div");
    btnContainerRow.className = "btnContainerRow";
    document.getElementById("buttonsContainer").appendChild(btnContainerRow);
    for (let j = 0; j < 3; j++) {
      var btn = document.createElement("div");
      btn.className = "choosenBtn";
      btnContainerRow.appendChild(btn);
    }
  }
}

function getIconFile() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        iconFile = JSON.parse(xhr.responseText);
        fillButtons();
      }
    }
  };
  xhr.open("GET", "icons.json");
  xhr.send("");
}

function getRandomShape(i) {
  var iconIndex = Math.floor(Math.random() * 130);
  currenticonClass = iconFile.icons[iconIndex].class;
  var flagIconShape = 0;
  while (flagIconShape < i) {
    var oldIconClass = document
      .getElementsByClassName("choosenBtn")
      [flagIconShape].getAttribute("data-fontawesome");
    if (oldIconClass == currenticonClass) {
      iconIndex = Math.floor(Math.random() * 130);
      currenticonClass = iconFile.icons[iconIndex].class;
      flagIconShape = 0;
      continue;
    } else {
      flagIconShape++;
    }
  }
  return currenticonClass;
}

function getRandomLetter(i) {
  var currentIconLetter = String.fromCharCode(
    Math.floor(Math.random() * (90 - 65 + 1)) + 65
  );
  var flagIconLetter = 0;
  while (flagIconLetter < i) {
    var oldIconLetter = document
      .getElementsByClassName("choosenBtn")
      [flagIconLetter].getAttribute("data-letter");
    if (oldIconLetter == currentIconLetter) {
      currentIconLetter = String.fromCharCode(
        Math.floor(Math.random() * (90 - 65 + 1)) + 65
      );
      flagIconLetter = 0;
      continue;
    } else {
      flagIconLetter++;
    }
  }
  return currentIconLetter;
}

function getRandomColor() {
  var currentIconColor =
    "#" + Math.floor(Math.random() * 16777215).toString(16);
  return currentIconColor;
}

function createButton(
  i,
  currenticonClass,
  currentIconLetter,
  currentIconColor
) {
  var btn = document.getElementsByClassName("choosenBtn")[i];
  btn.innerHTML =
    '<i class="' +
    currenticonClass +
    '" style="color:' +
    currentIconColor +
    ' ;"></i><span> = ' +
    currentIconLetter +
    "</span>";
  btn.setAttribute("data-letter", currentIconLetter);
  btn.setAttribute("data-fontawesome", currenticonClass);
  btn.setAttribute("onclick", "iconMatching(this);");
  arrIcon[i] = {
    iconClassName: currenticonClass,
    iconColor: currentIconColor,
    iconLetter: currentIconLetter,
  };
}

function iconMatching(elem) {
  var currentSlider = document.getElementById("currentSlider");
  var score;
  if (
    elem.getAttribute("data-letter") ==
    currentSlider.getAttribute("data-letter")
  ) {
    score = parseInt(localStorage.getItem("score"));
    score++;
    localStorage.setItem("score", score);
    if (score == 10) {
      document.getElementById("ExcellentContainer").style.display = "block";
      setTimeout(() => {
        document.getElementById("ExcellentContainer").style.display = "none";
      }, 1000);
      localStorage.setItem("score", 0);
      score = 0;
      document.getElementById("levelProgress").value =
        document.getElementById("levelProgress").value + 1;
      document.getElementById("timeLevelCounter").textContent =
        document.getElementById("levelProgress").value + "/13";
    }
    document.getElementById("scoreNumber").innerHTML = score;
    document.querySelectorAll("circle")[1].style.strokeDashoffset =
      125 - (125 * (10 * score)) / 100;
    document.getElementById("pass").play();
    document.querySelector("#correctMark").style.display = "block";
    clearTimeout(errorTimeOut);
    setTimeout(() => {
      document.querySelector("#correctMark").style.display = "none";
    }, 300);
    removeIcon(elem);

    generateRandomSlider();
    startFullTimer1(30);
  } else {
    showInstructions(1500);
    for (let i = 0; i < arrIcon.length; i++) {
      if (arrIcon[i].iconLetter == currentSlider.getAttribute("data-letter")) {
        errorAction();
        document.getElementsByClassName("choosenBtn")[i].innerHTML =
          '<i class="' +
          arrIcon[i].iconClassName +
          '" style="color:' +
          arrIcon[i].iconColor +
          ' ;"></i><span> = ' +
          arrIcon[i].iconLetter +
          "</span>";
      }
    }
    startFullTimer1(30);
  }
}

function errorAction() {
  clearInterval(progressTimer);
  document.getElementById("error").play();
  document.getElementById("currentSlider").classList.add("animationDiv");
  document.getElementById("originalDiv").classList.add("animationDiv");
  document.getElementById("overlay").classList.add("animationDiv");
  setTimeout(() => {
    document.getElementById("currentSlider").classList.remove("animationDiv");
    document.getElementById("originalDiv").classList.remove("animationDiv");
    document.getElementById("overlay").classList.remove("animationDiv");
  }, 300);
  generateRandomSlider();
}

function removeIcon(elem) {
  elem.innerHTML = "<span>" + elem.getAttribute("data-letter") + "</span>";
  elem.style.lineHeight = "1.5";
}

function generateRandomSlider() {
  var nextSlider = document.getElementById("nextSlider");
  var currentSlider = document.getElementById("currentSlider");

  if (sliderFlag == true) {
    rondomSliderIcon = arrIcon[Math.floor(Math.random() * arrIcon.length)];
    currentSlider.innerHTML =
      '<i class="' +
      rondomSliderIcon.iconClassName +
      '" style="color:' +
      rondomSliderIcon.iconColor +
      ' ;"></i>';
    currentSlider.setAttribute("data-letter", rondomSliderIcon.iconLetter);
    sliderFlag = false;
  } else {
    currentSlider.innerHTML = nextSlider.innerHTML;
    currentSlider.setAttribute(
      "data-letter",
      nextSlider.getAttribute("data-letter")
    );
  }
  var rondomSliderIcon = arrIcon[Math.floor(Math.random() * arrIcon.length)];
  nextSlider.innerHTML =
    '<i class="' +
    rondomSliderIcon.iconClassName +
    '" style="color:' +
    rondomSliderIcon.iconColor +
    ' ;"></i>';
  nextSlider.setAttribute("data-letter", rondomSliderIcon.iconLetter);
  startFullTimer1(30);
}

function startFullTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;

  intervalEndGame = setInterval(function () {
    minutes = parseInt(timer / 60);
    seconds = parseInt(timer % 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;
    time = --timer;
    if (timer < 0) {
      clearInterval(intervalEndGame);
      document.getElementsByClassName("game")[0].style.opacity = "0.7";
      document.getElementById("endGame").style.opacity = "0.95";
      document.getElementById("finalScore").textContent += localStorage.getItem(
        "score"
      );
      document.getElementById(
        "levelEnds"
      ).textContent += document.getElementById("levelProgress").value;
      document.getElementById("endGame").style.display = "block";
      document.getElementsByClassName("game")[0].style.pointerEvents = "none";
      clearInterval(progressTimer);
    }
  }, 1000);
}

function startFullTimer1(second) {
  clearInterval(progressTimer);
  let counter = second;
  document.getElementById("timerProgress").setAttribute("max", 30);
  document.getElementById("timerProgress").setAttribute("value", counter);
  progressTimer = setInterval(() => {
    document.getElementById("timerProgress").setAttribute("value", counter);
    counter--;
    if (counter < 0) {
      errorAction();
      document.getElementById("timerProgress").setAttribute("max", 30);
      counter = 30;
    }
  }, 1000);
}

function startGameAgain() {
  location.reload();
}

function showInstructions(sec) {
  document.getElementById("instructions").style.display = "block";
  var timeoutInstructions = setTimeout(() => {
    document.getElementById("instructions").style.display = "none";
    clearTimeout(timeoutInstructions);
  }, sec);
}

function chgPlay() {
  clearInterval(progressTimer);
  clearInterval(intervalEndGame);
  document.getElementsByClassName("game")[0].style.opacity = "0.7";
  document.getElementById("endGame").style.opacity = "0.95";
  document.getElementById("pauseDiv").style.display = "block";
  document.getElementById("continueGame").style.display = "block";
}

function continuePlay() {
  document.getElementsByClassName("game")[0].style.opacity = "1";
  document.getElementById("pauseDiv").style.display = "none";
  document.getElementById("continueGame").style.display = "none";
  startFullTimer1(
    document.getElementById("timerProgress").getAttribute("value")
  );
  startFullTimer(time, document.getElementById("timeCounter"));
}
