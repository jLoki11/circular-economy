// nav buttons
document.getElementById("startMemory").onclick = function() {
  document.querySelectorAll("main section").forEach(function(s) {
    s.classList.remove("active");
  });
  document.getElementById("memory").classList.add("active");
  buildBoard();
};

document.querySelectorAll("nav button").forEach(function(b) {
  b.onclick = function() {
    document.querySelectorAll("main section").forEach(function(s) {
      s.classList.remove("active");
    });
    document.getElementById(b.dataset.target).classList.add("active");
  };
});


var memoryCards = [
  {group:"Recycle",type:"term",content:"Recyclen"},
  {group:"Recycle",type:"img",content:"https://i.imgur.com/uQBbIxo.jpeg"},
  {group:"Reduce",type:"term",content:"Reduzieren"},
  {group:"Reduce",type:"img",content:"https://i.imgur.com/kXetSwT.jpeg"},
  {group:"Repair",type:"term",content:"Reparieren"},
  {group:"Repair",type:"video",content:'<video controls style="width:100%;height:100%;"><source src="Repair.mp4" type="video/mp4"></video>'},
  {group:"Reuse",type:"term",content:"Wiederverwenden"},
  {group:"Reuse",type:"video",content:'<video controls style="width:100%;height:100%;"><source src="Reuse.mp4" type="video/mp4"></video>'},
  {group:"Upcycling",type:"term",content:"Wiederverwertung"},
  {group:"Upcycling",type:"text",content:"Wie______ung"},
  {group:"Sharing",type:"term",content:"Teilen"},
  {group:"Sharing",type:"video",content:'<video controls style="width:100%;height:100%;"><source src="Sharing.mp4" type="video/mp4"></video>'},
  {group:"Compost",type:"term",content:"Kompostieren"},
  {group:"Compost",type:"img",content:"https://i.imgur.com/eC87rcn.jpeg"},
  {group:"Remanufacture",type:"term",content:"Wiederaufbereitung"},
  {group:"Remanufacture",type:"img",content:"https://i.imgur.com/OF2u0jw.jpeg"}
];

var quiz = [
  {
    q: "Was bedeutet Recyclen?",
    a: ["Dinge wegwerfen", "Materialien wiederverwenden", "Neu kaufen", "Verbrennen"],
    correct: 1
  },
  {
    q: "Was bedeutet Reduzieren?",
    a: ["Mehr konsumieren", "Weniger Ressourcen verbrauchen", "Alles reparieren", "Tauschen"],
    correct: 1
  },
  {
    q: "Was ist Wiederverwertung?",
    a: ["Reparieren", "Altes in etwas Besseres verwandeln", "Wegwerfen", "Verkaufen"],
    correct: 1
  }
];

var quizIndex = 0;

var erklaerungen = {
  Recycle: "♻️ Recyceln bedeutet, Materialien wiederzuverwenden, um neue Produkte herzustellen.",
  Reduce: "📉 Reduzieren heißt, weniger Ressourcen zu verbrauchen und Abfall zu vermeiden.",
  Repair: "🔧 Reparieren verlängert die Lebensdauer von Produkten.",
  Reuse: "🔁 Wiederverwenden bedeutet, Dinge mehrfach zu verwenden statt sie wegzuwerfen.",
  Upcycling: "✨ Wiederverwertung verwandelt alte Produkte in etwas Neues und Wertvolleres.",
  Sharing: "🤝 Teilen spart Ressourcen, weil mehrere Menschen ein Produkt nutzen.",
  Compost: "🌱 Kompostieren verwandelt Bioabfälle in nährstoffreiche Erde.",
  Remanufacture: "🏭 Wiederaufbereitung bedeutet, alte Produkte industriell neu aufzubereiten."
};

var first = null;
var lock = false;

// mischen (von stackoverflow)
function shuffle(arr) {
  return arr.sort(function() { return Math.random() - 0.5; });
}

function buildBoard() {
  var board = document.getElementById("memoryBoard");
  board.innerHTML = "";
  var karten = shuffle([...memoryCards]);

  karten.forEach(function(c) {
    var div = document.createElement("div");
    div.className = "card";
    div.dataset.group = c.group;

    var back = "";
    if (c.type === "term" || c.type === "text") {
      back = "<strong>" + c.content + "</strong>";
    }
    if (c.type === "img") {
      back = '<img src="' + c.content + '" style="width:100%"/>';
    }
    if (c.type === "video") {
      back = c.content;
    }

    div.innerHTML = '<div class="cardInner"><div class="face front">?</div><div class="face back">' + back + '</div></div>';
    div.onclick = function() { flip(div); };
    board.appendChild(div);
  });
}

function zeigePopup(text) {
  var popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "#ffffff";
  popup.style.padding = "20px";
  popup.style.border = "4px solid #2dc653";
  popup.style.borderRadius = "16px";
  popup.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
  popup.style.zIndex = "9999";
  popup.style.textAlign = "center";
  popup.innerHTML = '<p>' + text + '</p><button onclick="this.parentElement.remove()">OK</button>';
  document.body.appendChild(popup);
}

function flip(c) {
  if (lock || c.classList.contains("flipped")) return;
  c.classList.add("flipped");

  if (!first) {
    first = c;
    return;
  }

  lock = true;

  setTimeout(function() {
    if (first.dataset.group === c.dataset.group) {
      first.classList.add("matched");
      c.classList.add("matched");
      zeigePopup(erklaerungen[c.dataset.group]);
    } else {
      first.classList.remove("flipped");
      c.classList.remove("flipped");
    }

    first = null;
    lock = false;

    var alleDone = document.querySelectorAll(".card:not(.matched)").length === 0;
    if (alleDone) {
      setTimeout(function() { startQuiz(); }, 800);
    }
  }, 900);
}

document.getElementById("resetMemory").onclick = function() {
  first = null;
  lock = false;
  document.getElementById("memoryBoard").innerHTML = "";
  buildBoard();
};

document.getElementById("nextQuizBtn").onclick = function() {
  quizIndex++;
  var btn = document.getElementById("nextQuizBtn");

  if (quizIndex >= quiz.length) {
    document.getElementById("quizQuestion").textContent = "🎉 Quiz abgeschlossen!";
    document.getElementById("quizAnswers").innerHTML = "";
    document.getElementById("quizFeedback").textContent = "";
    btn.textContent = "Spiel schließen!";
    btn.onclick = quizEnde;
    return;
  }
  loadQuiz();
};

var MEMORY_REFLECTIONS = [
  "Welcher Begriff war für dich neu?",
  "Welches Paar war am schwierigsten zu finden?",
  "Was bedeutet Circular Economy für dich jetzt?",
  "Wie kannst du das Gelernte im Alltag anwenden?"
];
var memRefIndex = 0;
var memAnswers = [];

function startQuiz() {
  document.querySelectorAll("main section").forEach(function(s) { s.classList.remove("active"); });
  document.getElementById("memoryQuiz").classList.add("active");
  quizIndex = 0;
  loadQuiz();
}

function loadQuiz() {
  var q = quiz[quizIndex];
  document.getElementById("quizQuestion").textContent = q.q;

  var answersDiv = document.getElementById("quizAnswers");
  var feedback = document.getElementById("quizFeedback");
  answersDiv.innerHTML = "";
  feedback.textContent = "";

  q.a.forEach(function(answer, i) {
    var btn = document.createElement("button");
    btn.textContent = answer;
    btn.onclick = function() {
      if (i === q.correct) {
        feedback.textContent = "✅ Richtig!";
      } else {
        feedback.textContent = "❌ Falsch!";
      }
    };
    answersDiv.appendChild(btn);
  });
}

function closeGame() {
  document.querySelectorAll("main section").forEach(function(s) {
    s.classList.remove("active");
  });
  document.getElementById("start").classList.add("active");
  var btn = document.getElementById("presentationBtn");
  if (btn) btn.style.display = "block";
}

function quizEnde() {
  document.querySelectorAll("main section").forEach(function(s) {
    s.classList.remove("active");
  });
  document.getElementById("start").classList.add("active");
}


// --- Puzzle ---

var selected = null;
var gridData = Array(24).fill(null);
var energy = { LED: -5, Bulb: 10, Solar: -12, Insulation: -8, HeatPump: -10, Recycle: -6 };
var labels = {
  LED: "LED",
  Bulb: "Glühbirne",
  Solar: "Solar",
  Insulation: "Dämmung",
  HeatPump: "Wärmepumpe",
  Recycle: "Recycling"
};

document.querySelectorAll("[data-item]").forEach(function(b) {
  b.onclick = function() { selected = b.dataset.item; };
});

var explanations = {
  LED: "LED-Lampen verbrauchen deutlich weniger Strom als klassische Glühbirnen und haben eine längere Lebensdauer.",
  Bulb: "Glühbirnen wandeln viel Energie in Wärme statt Licht um und sind daher sehr ineffizient.",
  Solar: "Solarenergie nutzt die Sonne als Energiequelle und reduziert den Verbrauch fossiler Energie.",
  Insulation: "Gute Dämmung verhindert Wärmeverlust und reduziert den Energiebedarf zum Heizen.",
  HeatPump: "Wärmepumpen nutzen Umweltwärme und arbeiten sehr effizient im Vergleich zu klassischen Heizsystemen.",
  Recycle: "Recycling spart Energie, da weniger neue Rohstoffe produziert werden müssen."
};

function puzzleErgebnis(text, good) {
  var popup = document.getElementById("puzzlePopup");
  var txt = document.getElementById("puzzlePopupText");
  txt.textContent = text;
  popup.classList.remove("green", "red");
  popup.classList.add(good ? "green" : "red");
  popup.style.display = "flex";
}

document.getElementById("closePuzzleBtn").onclick = function() {
  document.getElementById("puzzlePopup").style.display = "none";
};

// meldung fuer puzzle
var puzzleMessage = document.getElementById("puzzleMessage");
if (!puzzleMessage) {
  puzzleMessage = document.createElement("div");
  puzzleMessage.id = "puzzleMessage";
  puzzleMessage.style.marginTop = "10px";
  puzzleMessage.style.fontWeight = "bold";
  puzzleMessage.style.color = "#1b4332";
  document.getElementById("puzzle").appendChild(puzzleMessage);
}

function updateGrid() {
  var gridPuzzle = document.getElementById("gridPuzzle");
  gridPuzzle.innerHTML = "";
  var used = 50;
  var message = "";

  gridData.forEach(function(v, i) {
    var c = document.createElement("div");
    c.className = "puzzle-cell" + (v ? " filled" : "");
    c.textContent = v ? labels[v] : "";

    c.onclick = function() {
      gridData[i] = selected;
      updateGrid();
    };

    if (v) {
      used += energy[v];
      if (energy[v] < 0) {
        message = labels[v] + " senkt den Energieverbrauch! ✅ " + explanations[v];
      } else if (energy[v] > 0) {
        message = labels[v] + " erhöht den Energieverbrauch! ⚠️ " + explanations[v];
      }
    }
    gridPuzzle.appendChild(c);
  });

  statsPuzzle.textContent = "Energieverbrauch: " + used + " kWh";
  puzzleMessage.textContent = message;

  var resultBox = document.getElementById("puzzleResult");

  if (gridData.every(function(cell) { return cell !== null; })) {
    var resultText = "";
    var puzzleSec = document.getElementById("puzzle");

    if (used <= -100) {
      resultText = "🌱 Perfekt! Sehr nachhaltige Lösung!";
      puzzleSec.style.background = "#d4edda";
    } else if (used <= -50) {
      resultText = "👍 Gute Lösung – energieeffizient!";
      puzzleSec.style.background = "#dff0d8";
    } else if (used <= 0) {
      resultText = "⚖️ Mittelmäßig – geht noch besser.";
      puzzleSec.style.background = "#fff3cd";
    } else {
      resultText = "⚠️ Hoher Energieverbrauch – versuche nachhaltiger zu wählen!";
      puzzleSec.style.background = "#f8d7da";
    }

    resultBox.textContent = resultText;
    var isGood = used <= 0;
    puzzleErgebnis(resultText, isGood);
  } else {
    resultBox.textContent = "";
    document.getElementById("puzzle").style.background = "";
  }
}

document.getElementById("startPuzzle").onclick = function() {
  document.getElementById("introPuzzle").classList.remove("active");
  document.getElementById("puzzle").classList.add("active");
  updateGrid();
};

document.getElementById("resetPuzzle").onclick = function() {
  gridData = Array(24).fill(null);
  updateGrid();
};


// --- Produktleben ---

var PRODUCTS = [
  {name:"Laptop", co2:120, cond:70, eff:60, sat:50},
  {name:"Smartphone", co2:80, cond:60, eff:70, sat:60},
  {name:"Tablet", co2:90, cond:65, eff:65, sat:55},
  {name:"Kaffeemaschine", co2:50, cond:50, eff:50, sat:50},
  {name:"Fahrrad", co2:30, cond:90, eff:80, sat:70},
  {name:"Waschmaschine", co2:140, cond:75, eff:55, sat:45},
  {name:"Fernseher", co2:110, cond:65, eff:50, sat:60},
  {name:"Spielkonsole", co2:95, cond:70, eff:45, sat:80},
  {name:"Schulrucksack", co2:20, cond:80, eff:90, sat:60}
];

var currentProduct = {};
var round = 1;
var points = 0;

function pickProduct() {
  var idx = Math.floor(Math.random() * PRODUCTS.length);
  return JSON.parse(JSON.stringify(PRODUCTS[idx]));
}

function showPopup(text) {
  var popup = document.getElementById("actionPopup");
  popup.textContent = text;
  popup.style.display = "block";
  popup.style.opacity = 0;
  popup.style.transform = "translateY(-20px)";

  setTimeout(function() {
    popup.style.transition = "opacity 0.3s, transform 0.3s";
    popup.style.opacity = 1;
    popup.style.transform = "translateY(0)";
  }, 10);

  setTimeout(function() {
    popup.style.opacity = 0;
    popup.style.transform = "translateY(-20px)";
  }, 1200);

  setTimeout(function() {
    popup.style.display = "none";
  }, 1500);
}

function updateUI() {
  document.getElementById("productName").textContent = currentProduct.name;
  roundBox.textContent = round;
  pointsBox.textContent = points;
  co2Box.textContent = currentProduct.co2;
  condBox.textContent = currentProduct.cond;
  effBox.textContent = currentProduct.eff;
  satBox.textContent = currentProduct.sat;

  var bars = [
    {el: barCO2, value: currentProduct.co2},
    {el: barCond, value: currentProduct.cond},
    {el: barEff, value: currentProduct.eff},
    {el: barSat, value: currentProduct.sat}
  ];
  bars.forEach(function(b) {
    var w = Math.max(b.value * 2, 10) + "px";
    b.el.style.width = w;
    b.el.textContent = b.value;
  });
}

function log(t) {
  logBox.innerHTML += "<div>" + t + "</div>";
  logBox.scrollTop = logBox.scrollHeight;
}

function zufallsEvent() {
  var r = Math.random();
  if (r < 0.15) {
    currentProduct.co2 += 15;
    log("⚠ Transport verursacht CO₂ (+15).");
  } else if (r < 0.25) {
    currentProduct.cond -= 10;
    log("⚠ Produktdefekt (-10).");
  } else if (r < 0.35) {
    currentProduct.eff -= 5;
    log("⚠ Effizienz sinkt (-5).");
  } else if (r < 0.45) {
    currentProduct.sat += 10;
    log("🎉 Zufriedenheit steigt (+10).");
  } else if (r < 0.50) {
    currentProduct.eff += 10;
    currentProduct.co2 -= 5;
    log("♻ Bonus-Upcycling Effizienz +10, CO₂ -5");
  }
}

function ladeAktionen() {
  actionsArea.innerHTML = "";

  var actions = [
    {text: "🔧 Reparieren", fn: function() {
      currentProduct.cond += 15; currentProduct.sat -= 5; points += 15;
      showPopup("🔧 Reparatur verlängert Nutzung");
    }},
    {text: "♻ Recycling", fn: function() {
      currentProduct.co2 -= 40; points += 25;
      showPopup("♻ Material wird zurückgewonnen");
    }},
    {text: "🆕 Neukauf", fn: function() {
      currentProduct.co2 += 60; currentProduct.cond = 100; currentProduct.sat += 20; points += 10;
      showPopup("🆕 Komfort steigt, CO₂ steigt");
    }},
    {text: "♻ Upcycling", fn: function() {
      currentProduct.eff += 10; points += 20;
      showPopup("♻ Effizienz steigt");
    }},
    {text: "🤝 Sharing", fn: function() {
      currentProduct.sat += 15; currentProduct.co2 -= 10; points += 15;
      showPopup("🤝 Zufriedenheit steigt");
    }},
    {text: "💻 Softwareupdate", fn: function() {
      currentProduct.eff += 15; points += 10;
      showPopup("💻 Effizienz steigt deutlich");
    }}
  ];

  actions.forEach(function(a) {
    var btn = document.createElement("button");
    btn.innerHTML = a.text;
    btn.onclick = function() {
      a.fn();
      zufallsEvent();
      nextRound();
    };
    actionsArea.appendChild(btn);
  });
}

var REFLECTIONS = [
  "Welche Entscheidung hast du am häufigsten getroffen – und warum?",
  "Welche Aktion hatte den größten Einfluss auf den CO₂-Wert?",
  "Gab es eine Situation, in der Komfort wichtiger war als Nachhaltigkeit?",
  "Was würdest du beim nächsten Durchgang anders machen?",
  "Wo begegnest du diesem Produkt im echten Leben?"
];

var refIndex = 0;
var answers = [];

function reflexion() {
  reflectionBox.style.display = "block";
  refIndex = 0;
  answers = [];
  reflectionAnswer.style.display = "block";
  nextReflection.style.display = "inline-block";
  naechsteFrage();
}

function naechsteFrage() {
  reflectionQuestion.textContent = REFLECTIONS[refIndex];
  reflectionAnswer.value = "";
  reflectionProgress.textContent = "Frage " + (refIndex + 1) + " von " + REFLECTIONS.length;
}

nextReflection.onclick = function() {
  answers.push(reflectionAnswer.value);
  refIndex++;

  if (refIndex >= REFLECTIONS.length) {
    reflectionQuestion.textContent = "Danke für deine Reflexion!";
    reflectionAnswer.style.display = "none";
    nextReflection.style.display = "none";
    reflectionProgress.textContent = "Reflexion abgeschlossen ✔";

    var result = bewertung();
    zeigeEnde(result.text, result.score);
    console.log("Schülerantworten:", answers);
    return;
  }
  naechsteFrage();
};

function neuesSpiel() {
  round = 1;
  points = 0;
  logBox.innerHTML = "";
  actionsArea.innerHTML = "";
  reflectionBox.style.display = "none";
  rankingBox.style.display = "none";
  document.getElementById("skipBtn").disabled = false;

  currentProduct = pickProduct();
  ladeAktionen();
  updateUI();
}

function nextRound() {
  round++;

  if (round > 6) {
    log("Spiel beendet – reflektiere Entscheidungen.");
    actionsArea.innerHTML = "";
    document.getElementById("skipBtn").disabled = true;
    reflexion();
    return;
  }

  currentProduct = pickProduct();
  log("Neues Produkt: " + currentProduct.name);
  ladeAktionen();
  updateUI();
}

function bewertung() {
  var score = (300 - currentProduct.co2) + currentProduct.cond + currentProduct.eff + currentProduct.sat + points;
  var text = "";

  if (score > 600) text = "🌟 Sehr nachhaltig!";
  else if (score > 500) text = "👍 Nachhaltig";
  else if (score > 400) text = "⚠ Mittel";
  else text = "❌ Wenig nachhaltig";

  return {score: score, text: text};
}

restartBtn.onclick = neuesSpiel;

document.getElementById("startProductIntro").onclick = function() {
  document.getElementById("introProduct").classList.remove("active");
  document.getElementById("productlife").classList.add("active");
  neuesSpiel();
};

skipBtn.onclick = nextRound;


// puzzle bilder
var puzzleImages = {
  LED: "https://media.istockphoto.com/id/166288716/de/foto/led-lichter-gl%C3%BChbirne.jpg?s=612x612&w=0&k=20&c=llWs1i_xFbuBK8zJvtWq61oQyImNleDHheM2zyFgxQg=",
  Bulb: "https://media.istockphoto.com/id/1400469622/de/foto/led-gl%C3%BChfaden-wolfram-vintage-gl%C3%BChbirne-isoliert-auf-wei%C3%9Fem-hintergrund.jpg?s=2048x2048&w=is&k=20&c=KabzOtnM5LEYh8HmfhaDqIuTTzpigflS1U9aN4GlOdQ=",
  Solar: "https://media.istockphoto.com/id/1419268083/de/foto/dach-eines-einfamilienhauses-mit-photovoltaikanlage.jpg?s=612x612&w=0&k=20&c=Rw29kWIaN4lyv8M5uMO8hC5TmMUomD3mqEW1XwGaPTc=",
  Insulation: "https://media.istockphoto.com/id/1466942035/de/foto/ein-bauarbeiter-isoliert-ein-geb%C3%A4ude-mit-styropor-installation-von-polystyrol-an-der-fassade.jpg?s=2048x2048&w=is&k=20&c=RvE1hOeDuwF-SIlVpt47LdrfAIN3JnMr-pxBGbDa8s8=",
  HeatPump: "https://media.istockphoto.com/id/2084114078/de/foto/w%C3%A4rmepumpe-nachhaltige-heizl%C3%B6sung-f%C3%BCr-moderne-h%C3%A4user-umweltfreundliche-w%C3%A4rmepumpentechnik-vor.jpg?s=2048x2048&w=is&k=20&c=ihp4uGFYbibPPF-cFhRCeaaO1xnbkSnVSXuOb3SZ1Qk=",
  Recycle: "https://media.istockphoto.com/id/1498317079/de/foto/recycling-symbol-auf-dem-waldhintergrund-%C3%B6kologisches-konzept-%C3%B6kologie-recycling-und-zero.jpg?s=2048x2048&w=is&k=20&c=7NuyOk47_OvKegcvr0TwDESYpCBqDl9ED3hX3rWzXpg="
};

document.querySelectorAll("[data-item]").forEach(function(btn) {
  var key = btn.dataset.item;
  var label = btn.textContent;
  btn.innerHTML = '<img src="' + puzzleImages[key] + '"><span>' + label + '</span>';
});

// auswahl hervorheben
document.querySelectorAll("[data-item]").forEach(function(b) {
  b.addEventListener("click", function() {
    selected = b.dataset.item;
    document.querySelectorAll("[data-item]").forEach(function(btn) {
      btn.style.outline = "none";
    });
    b.style.outline = "4px solid #ffbe0b";
  });
});


// ende popup
function zeigeEnde(text, score) {
  var popup = document.getElementById("finalPopup");
  document.getElementById("finalText").textContent = text;
  document.getElementById("finalScore").textContent = "Score: " + score;

  popup.classList.remove("green", "yellow", "red");
  if (score > 600) {
    popup.classList.add("green");
  } else if (score > 450) {
    popup.classList.add("yellow");
  } else {
    popup.classList.add("red");
  }
  popup.style.display = "flex";
}

function schliessePopup() {
  document.getElementById("finalPopup").style.display = "none";
}

function fertig() {
  document.querySelectorAll("main section").forEach(function(s) {
    s.classList.remove("active");
  });
  document.getElementById("abschluss").classList.add("active");
}

function neustart() {
  document.querySelectorAll("main section").forEach(function(s) {
    s.classList.remove("active");
  });
  document.getElementById("start").classList.add("active");
}


