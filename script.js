const resultEl = document.getElementById("result");
const historyEl = document.getElementById("historyList");
const drawBtn = document.getElementById("drawBtn");
const clearBtn = document.getElementById("clearBtn");

let count = 0;

// 번호 구간별 공 색상
function getColorClass(num) {
  if (num <= 10) return "yellow";
  if (num <= 20) return "blue";
  if (num <= 30) return "red";
  if (num <= 40) return "gray";
  return "green";
}

// 1~45 중 중복 없이 7개 뽑기 (앞 6개 = 본번호, 마지막 = 보너스)
function drawNumbers() {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);

  // Fisher-Yates 셔플
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const main = pool.slice(0, 6).sort((a, b) => a - b);
  const bonus = pool[6];
  return { main, bonus };
}

function createBall(num, delay = 0) {
  const ball = document.createElement("div");
  ball.className = "ball " + getColorClass(num);
  ball.textContent = num;
  ball.style.animationDelay = delay + "s";
  return ball;
}

function createPlus() {
  const plus = document.createElement("span");
  plus.className = "plus";
  plus.textContent = "+";
  return plus;
}

function render({ main, bonus }) {
  resultEl.innerHTML = "";
  main.forEach((num, i) => resultEl.appendChild(createBall(num, i * 0.12)));
  resultEl.appendChild(createPlus());
  resultEl.appendChild(createBall(bonus, main.length * 0.12));
}

function addHistory({ main, bonus }) {
  count++;
  const li = document.createElement("li");

  const idx = document.createElement("span");
  idx.className = "idx";
  idx.textContent = count + ".";
  li.appendChild(idx);

  main.forEach(num => li.appendChild(createBall(num)));
  li.appendChild(createPlus());
  li.appendChild(createBall(bonus));

  historyEl.prepend(li); // 최신 기록이 위로
}

drawBtn.addEventListener("click", () => {
  const numbers = drawNumbers();
  render(numbers);
  addHistory(numbers);
});

clearBtn.addEventListener("click", () => {
  historyEl.innerHTML = "";
  resultEl.innerHTML = '<span class="placeholder">아직 뽑은 번호가 없어요</span>';
  count = 0;
});

// 제휴 문의 폼 (Formspree)
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formStatus.className = "form-status";
  formStatus.textContent = "보내는 중...";

  try {
    const res = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error();
    contactForm.reset();
    formStatus.classList.add("success");
    formStatus.textContent = "문의가 접수되었어요. 감사합니다!";
  } catch {
    formStatus.classList.add("error");
    formStatus.textContent = "전송에 실패했어요. 잠시 후 다시 시도해주세요.";
  } finally {
    submitBtn.disabled = false;
  }
});
