const $ = s => document.querySelector(s), R = Math.random, pick = a => a[Math.floor(R() * a.length)], rnd = (a, b) => a + R() * (b - a);
const el = (t, c, x, p) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; (p || document.body).appendChild(e); return e };
const lists = [{ n: "hello", t: [{ x: "asdfadfafds", d: "sdafasdf", c: 1 }, { x: "qwerqwrwe", d: "qwerqewrqreqre", c: 0 }] }, { n: "List 2", t: [] }];
let cur = 0, beepN = 0, idle = Date.now(), ac;
function toast(m, fn) { const t = el("div", "toast", null, $("#toasts")); t.innerHTML = m; t.onclick = () => { fn && fn(); t.remove() }; setTimeout(() => t.remove(), 4000) }
function modal(h, p, btns) { const o = el("div", "ov"), b = el("div", "box", null, o); el("h2", "", h, b); el("p", "", p, b); const r = el("div", "", null, b); r.style.cssText = "display:flex;gap:10px;justify-content:center;flex-wrap:wrap"; (btns || [["OK"]]).forEach(([l, f]) => { const x = el("button", "btn", l, r); x.onclick = () => { o.remove(); f && f(x) } }); return o }
function beep() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 300 + beepN * 60; beepN = (beepN + 1) % 30; g.gain.value = .05; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + .08) } catch (e) { } }
addEventListener("pointerdown", () => { beep(); idle = Date.now() });
addEventListener("contextmenu", e => { e.preventDefault(); toast("Right-click is a Premium feature ($4.99/click).") });

// Cursor trail - rainbow sparkle trail following the mouse
addEventListener("pointermove", e => {
  if (R() < .3) {
    const t = el("span", "trail", pick(["✨", "💫", "⭐", "🌟", "🔥", "💀", "🦆"]));
    t.style.left = e.clientX + "px"; t.style.top = e.clientY + "px";
    setTimeout(() => t.remove(), 800);
  }
  mx = e.clientX; my = e.clientY; idle = Date.now();
});

function confetti() { for (let i = 0; i < 40; i++) { const c = el("div", "cf", pick(["🎉", "🎊", "✨", "🟣", "🟡"])); c.style.left = R() * 100 + "vw"; c.style.animationDuration = rnd(1.5, 3.5) + "s"; setTimeout(() => c.remove(), 3600) } }
function deleteTaskGauntlet(targetTask) {
  // 1. Paid Feature Check
  if (R() < 0.25) {
    modal("Premium Feature Required 💎", "Deleting tasks requires the TodoNothing Enterprise Pro Max Plan ($0.99 per deletion).\n\nYour imaginary card on file was declined.", [["Upgrade ($99.99/mo)"], ["Keep Task"]]);
    toast("Microtransaction failed.");
    return;
  }

  // 2. Emotional Confirmation
  const confirmModal = modal("Emotional Checkpoint ❤️", "Are you emotionally prepared to say goodbye to this task forever? It trusted you.", [
    ["No, I'm sorry", () => toast("Task spared. It is grateful.")],
    ["Yes, delete it", () => proceedToMathPuzzle()]
  ]);

  function proceedToMathPuzzle() {
    // 3. Captcha Math Puzzle
    const a = Math.floor(rnd(13, 29)), b = Math.floor(rnd(7, 19));
    const correct = a * b;
    const ov = el("div", "ov"), box = el("div", "box", null, ov);
    el("h2", "", "Security Verification", box);
    el("p", "", "To delete this note, solve: " + a + " × " + b + " = ?", box);
    const inp = el("input", "in", null, box);
    inp.type = "number";
    inp.placeholder = "Enter solution";
    inp.style.textAlign = "center";
    inp.style.margin = "10px auto";
    const btn = el("button", "btn", "Verify Answer", box);
    btn.onclick = () => {
      if (parseInt(inp.value) !== correct) {
        ov.remove();
        toast("Incorrect math! Your punishment is keeping the task.");
        return;
      }
      ov.remove();
      proceedToHoldStage();
    };
  }

  function proceedToHoldStage() {
    // 4. Hold for 3 seconds without letting go
    const ov = el("div", "ov"), box = el("div", "box", null, ov);
    el("h2", "", "Final Ritual: Hold to Incinerate", box);
    el("p", "", "Press and HOLD the button for 3 seconds continuously. Any flinch or release resets progress.", box);
    const barWrap = el("div", "hold-bar-container", null, box);
    const bar = el("div", "hold-bar", null, barWrap);
    const holdBtn = el("button", "btn", "HOLD ME TIGHT", box);
    holdBtn.style.background = "#ff4d4d";
    holdBtn.style.color = "#fff";

    let holdTimer = null, startTime = 0, progressInterval = null;

    const resetHold = () => {
      clearInterval(progressInterval);
      clearTimeout(holdTimer);
      bar.style.width = "0%";
      holdTimer = null;
    };

    holdBtn.onpointerdown = () => {
      startTime = Date.now();
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, (elapsed / 3000) * 100);
        bar.style.width = pct + "%";
      }, 50);

      holdTimer = setTimeout(() => {
        clearInterval(progressInterval);
        ov.remove();
        executeFinalDelete();
      }, 3000);
    };

    holdBtn.onpointerup = () => {
      if (holdTimer) {
        resetHold();
        toast("You released too early! The task survived.");
      }
    };
    holdBtn.onpointerleave = () => {
      if (holdTimer) {
        resetHold();
        toast("Your mouse slipped! Deletion aborted.");
      }
    };

    const cancel = el("button", "btn", "Give Up", box);
    cancel.style.marginLeft = "10px";
    cancel.onclick = () => { resetHold(); ov.remove(); toast("Smart choice."); };
  }

  function executeFinalDelete() {
    const list = lists[cur].t;
    if (!list.length) return;
    let actualIdx = list.indexOf(targetTask);
    if (actualIdx === -1) actualIdx = 0;

    // 5. Wrong task deleted troll (35% chance if more than 1 item)
    if (R() < 0.35 && list.length > 1) {
      let wrongIdx = Math.floor(R() * list.length);
      if (wrongIdx === actualIdx) wrongIdx = (actualIdx + 1) % list.length;
      const victim = list.splice(wrongIdx, 1)[0];
      toast("Deleted “" + victim.x + "” instead! Oops, bad aim.");
    } else {
      const deleted = list.splice(actualIdx, 1)[0];
      toast("Task “" + deleted.x + "” has been deleted. Rest in chaos.");
    }
    render();
  }
}

function render() {
  const L = lists[cur]; $("#title").textContent = L.n;
  const tabs = $("#tabs"); tabs.textContent = "";
  lists.forEach((l, i) => { const d = el("div", "tab" + (i == cur ? " on" : ""), l.n, tabs); d.onclick = () => { cur = i; render() } });
  const ul = $("#ul"); ul.textContent = "";
  [...L.t].sort(() => R() - .5).forEach((t, i) => {
    const li = el("li", "", null, ul);
    const mainWrap = el("div", "task-main", null, li);
    const cb = el("span", "cb", t.c ? "✓" : "", mainWrap), w = el("div", "", null, mainWrap);
    const x = el("div", "tx" + (t.c ? " done" : "") + (t.b ? " bounce" : ""), t.x, w); el("small", "", t.d, w);
    if (t.b) { x.style.color = "hsl(" + R() * 360 + ",90%,40%)"; t.b = 0 }
    cb.onpointerenter = () => { if (R() < .6) cb.style.transform = "translate(" + rnd(-60, 60) + "px," + rnd(-20, 20) + "px)" };
    cb.onclick = () => {
      if (R() < .15) { toast("Checkbox is on break. Try again later."); return }
      t.c = !t.c; t.b = 1;
      if (t.c) toast(pick(["Great job! But did you REALLY finish it?", "Marked as done. We don't believe you.", "✅ Done! (citation needed)"]));
      render();
    };

    // The Runaway Delete button
    const del = el("button", "del-btn", null, li);
    del.innerHTML = '<img src="assets/delete.svg" class="svg-icon" style="width:14px;height:14px;vertical-align:middle;filter:brightness(0) invert(1);" alt="Delete"> Del';
    let dodgeCount = 0;
    del.onpointerenter = () => {
      // Dodges the cursor up to 3 times before staying still
      if (dodgeCount++ < 3 && R() < 0.75) {
        del.style.left = rnd(-80, 80) + "px";
        del.style.top = rnd(-30, 30) + "px";
        if (R() < 0.3) toast("Too slow!");
      }
    };
    del.onclick = (e) => {
      e.stopPropagation();
      deleteTaskGauntlet(t);
    };
  });
}
function chaos(e) {
  const i = e.target; let v = i.value, n = Date.now();
  if (e.inputType == "insertText") {
    if (n - (i._t || 0) < 180 && v.length > 1) v = v.slice(0, -2) + v.slice(-1);
    if (R() < .12) v += " " + pick(["banana", "spaghetti", "quack", "moist", "pebble", "sus", "bruh", "yeet", "skibidi"]) + " ";
    // Randomly capitalize letters
    if (R() < .1) v = v.split("").map(c => R() < .3 ? c.toUpperCase() : c).join("");
    // Randomly reverse the string
    if (R() < .03) v = v.split("").reverse().join("");
  }
  i.value = v; i._t = n
}
$("#ti").oninput = chaos; $("#di").oninput = chaos;
let ask = 0;
$("#add").onclick = function () {
  const b = this;
  if (!ask) { ask = 1; b.textContent = "Are you sure? Click again"; setTimeout(() => { ask = 0; b.textContent = "Add" }, 3000); return }
  if (ask == 1) { ask = 2; b.textContent = "Are you REALLY sure?"; setTimeout(() => { ask = 0; b.textContent = "Add" }, 3000); return }
  if (ask == 2) { ask = 3; b.textContent = "Final answer?"; setTimeout(() => { ask = 0; b.textContent = "Add" }, 2000); return }
  ask = 0; b.textContent = "Add"; const x = $("#ti").value.trim();
  if (!x) { toast("Tasks must contain at least one thought."); return }
  lists[cur].t.push({ x, d: $("#di").value, c: 0 }); $("#ti").value = $("#di").value = ""; confetti();
  toast(pick(["Task added! It will be forgotten shortly.", "Added to the void.", "Task received. Gerald is processing it."]));
  render()
};
$("#nl").onclick = () => { lists.push({ n: "List " + (lists.length + 1), t: [] }); toast("New list created. It's already lonely."); render() };
$("#undo").onclick = () => { const t = lists[cur].t; if (t.length) t.splice(Math.floor(R() * t.length), 1); toast("Undid something. Probably the wrong thing."); render() };
$("#exp").onclick = () => modal("Export complete ✔", "\u201Cvoid.txt\u201D: \u201CYour data has intentionally not been included. Enjoy the void.\u201D");
$("#up").onclick = () => scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
$("#gear").onclick = () => { const s = $("#set"); s.hidden = !s.hidden; if (!s.hidden) toast("Settings opened. Nothing in here works.") };
$("#dm").onchange = () => { document.body.style.filter = "invert(1) hue-rotate(180deg)"; setTimeout(() => document.body.style.filter = "", 700); toast("Dark mode is a lie.") };
$("#rm").onchange = () => toast("Motion reduced by 0%. Possibly increased.");

// Share button
$("#share").onclick = () => {
  modal("Share your list!", "Your list has been shared with 0 people.\n\nSharable link: https://todonothing.fake/" + Math.random().toString(36).slice(2, 8) + "\n\n(This link goes nowhere.)");
};

let li0 = 0; const dl = $("#del");
dl.oninput = () => { li0 = Date.now(); if (dl.value >= 98) { const g = lists.splice(cur, 1)[0]; if (!lists.length) lists.push({ n: "List 1", t: [] }); cur = 0; dl.value = 0; toast("Deleted \u201C" + g.n + "\u201D. Why?"); render() } };
setInterval(() => { if (Date.now() - li0 > 150 && +dl.value > 0) dl.value -= 5 }, 50);
let mx = innerWidth / 2, my = innerHeight / 2;
function cookie() { $("#ck").hidden = false }
$("#cw").onclick = () => { $("#ck").hidden = true; setTimeout(cookie, 5000) };
$("#cm").onclick = () => toast("Preferences managed. (They weren't.)");
const models = ["Claude Bagel 7", "GPT-Toaster", "Gemini Twins Pro", "Llama Llama Duck", "Mistral Breeze (offline)", "DeepThink-ish", "CoPilot Autopilot Co-Co-Pilot", "BERT Reynolds"],
  rep = ["Have you tried turning your tasks off and on again?", "I'm not a bot. I'm a rotisserie chicken.", "Your task is important to us. Please hold forever.", "I analyzed your list. It's a list.", "Would you like to upgrade to a worse plan?", "Quack.", "Error: too much productivity detected.", "Have you considered just... not?", "Gerald the hamster is napping. Try later.", "01101000 01100101 01101100 01110000"];
function chat() { const c = $("#chat"); c.hidden = false; c.textContent = ""; el("b", "", pick(models) + " says:", c); el("p", "", pick(rep), c); el("button", "btn", "Switch model", c).onclick = chat; const x = el("button", "btn", "Close", c); x.style.marginLeft = "6px"; x.onclick = () => c.hidden = true }
$("#chatb").onclick = chat;
const tips = ["Quick tip: Tasks are more fun when they're not done.", "Quick tip: Try closing this tab.", "Quick tip: I can't see you. Yet.", "Quick tip: Save your work. (You can't.)", "Quick tip: Have you tried having no tasks?", "Quick tip: This app has no backend. Your data lives in RAM. Close the tab and it's gone forever.", "Quick tip: The eyes are always watching. Always.", "Quick tip: Gerald says hi 🐹"];
setInterval(() => { $("#wb").textContent = pick(tips) }, 8000);
function quack() { const t = lists[cur].t; if (!t.length) return; const k = pick(t), w = k.x.split(" "); w[Math.floor(R() * w.length)] = "quack"; k.x = w.join(" "); render() }
function update() { const o = el("div", "ov"), b = el("div", "box", null, o); o.style.background = "#0050c8"; b.style.cssText = "background:#0050c8;color:#fff;border:0;box-shadow:none"; el("h2", "", "Installing important updates", b); const p = el("p", "", "0%", b); let n = 0; const i = setInterval(() => { n = Math.min(99, n + rnd(5, 25)); p.textContent = Math.floor(n) + "% \u2014 do not close your todo list"; if (n >= 99) { clearInterval(i); p.textContent = "Update failed. Installing again..."; setTimeout(() => o.remove(), 3500) } }, 500) }
function paywall() {
  const o = el("div", "ov"), b = el("div", "box", null, o); el("h2", "", "Your free trial has expired 😢", b); el("p", "", "Pay $9.99 to keep looking at your own list. Billed every 4 minutes.", b);
  const p = el("button", "btn", "Pay $9.99", b); p.style.position = "relative"; p.onpointerenter = () => { p.style.left = rnd(-60, 60) + "px"; p.style.top = rnd(-20, 20) + "px" }; p.onclick = () => toast("Card declined. Try a different pebble.");
  const x = el("button", "", null, b); x.textContent = "×"; x.style.cssText = "position:absolute;top:2px;right:4px;font-size:9px;border:0;background:none;color:#888;cursor:pointer"; x.onclick = () => { o.remove(); setTimeout(paywall, 30000) }
}
let idm = 0;
setInterval(() => { if (!idm && Date.now() - idle > 15000 && !cap.isConnected) { idm = 1; const o = modal("Are you still here?", "Please confirm you are a person who exists.", [["Yes", () => { idm = 0; idle = Date.now() }]]); const b = o.querySelector("button"); let j = 0; b.style.position = "relative"; b.onpointerenter = () => { if (j++ < 4) { b.style.left = rnd(-90, 90) + "px"; b.style.top = rnd(-60, 60) + "px" } } } }, 2000);

// Clippy tips
const clippyTips = ["It looks like you're trying to be productive. Would you like me to make that harder?", "Did you know? Closing this tab is the most productive thing you can do.", "I see you haven't added a task in a while. Is everything okay? (I don't actually care.)", "Fun fact: This app has 0 tests, 0 documentation, and 0 regrets.", "You've been staring at this screen for a while. Blink twice if you need help.", "Have you tried adding 'quack' as a task? Trust me.", "Gerald says you should take a break. Gerald is a hamster. Listen to Gerald.", "Tip: Highlight text and press Ctrl+C to copy. Just kidding, we disabled that too."];
setInterval(() => { const ct = $("#clippy-text"); if (ct) ct.textContent = pick(clippyTips) }, 10000);

// Volume slider does nothing but shows toast
if ($("#vol")) {
  $("#vol").oninput = (e) => {
    const v = e.target.value;
    $("#vol-val").textContent = v + "%";
    const vImg = $("#vol-svg");
    if (+v === 0) {
      if (vImg) vImg.src = "assets/muted.svg";
      toast('<img src="assets/muted.svg" class="svg-icon" alt="Muted"> Muted. (There was never any sound.)');
    } else {
      if (vImg) vImg.src = "assets/volume_up.svg";
      if (+v >= 100) toast('<img src="assets/volume_up.svg" class="svg-icon" alt="Max Volume"> MAX VOLUME! (Still no sound.)');
    }
  };
}

// Ad banner close — just moves it
const adClose = document.querySelector(".ad-close");
if (adClose) adClose.onclick = () => {
  toast("Ad removal is a Premium feature ($29.99/month).");
  const ab = $("#ad-banner");
  ab.style.top = "0"; ab.style.bottom = "auto";
};

// Notification badge — randomly increment
setInterval(() => {
  const nb = $("#notif-badge");
  if (nb) {
    let n = parseInt(nb.textContent) || 99;
    n += Math.floor(R() * 5) + 1;
    nb.textContent = n + "+";
  }
}, 8000);

// Password wall — appears randomly
function pwWall() {
  const pw = $("#pw-wall");
  if (pw) {
    pw.hidden = false;
    $("#pw-submit").onclick = () => {
      const v = $("#pw-input").value;
      if (!v) { toast("Please enter a password."); return }
      if (v === "password") { toast("That's too obvious. Try again."); return }
      if (v.length < 8) { toast("Password must be at least 8 characters. And a haiku."); return }
      if (v.length >= 8) {
        toast("Incorrect. The correct password was '" + pick(["quack", "banana42", "Gerald<3", "password1", "hunter2"]) + "'.");
        pw.hidden = true;
        setTimeout(pwWall, 90000);
      }
    };
  }
}

// Randomly shuffle task text capitalization
setInterval(() => {
  const t = lists[cur].t;
  if (!t.length) return;
  const k = pick(t);
  k.x = k.x.split("").map(c => R() < .2 ? (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()) : c).join("");
  render();
}, 15000);

// Fake typing indicator in chat
setInterval(() => {
  const c = $("#chat");
  if (c && !c.hidden) {
    const dots = el("div", "", "...", c);
    dots.style.cssText = "font-size:20px;animation:toastBlink 1s step-end infinite;color:#999";
    setTimeout(() => { dots.textContent = pick(rep); dots.style.cssText = "font-weight:700;color:#000" }, 2000);
  }
}, 12000);

// Randomly rotate the page slightly
setInterval(() => {
  const m = document.querySelector("main");
  m.style.transform = "rotate(" + rnd(-1, 1) + "deg)";
  setTimeout(() => m.style.transform = "", 2000);
}, 20000);

function start() {
  const root = $("#app-root");
  if (root) root.classList.remove("startup-hidden");
  render();

  // Start sidebar erratic movement
  const sd = $("#side");
  setInterval(() => { sd.style.right = "auto"; sd.style.left = rnd(0, Math.max(0, innerWidth - 180)) + "px"; sd.style.top = rnd(110, Math.max(120, innerHeight - sd.offsetHeight - 10)) + "px" }, 3500);

  // Spawn simulated user pointers
  ["Sarah", "Dave", "Guest_482", "xX_Pr0ductive_Xx", "TodoEnjoyer99", "jhon doe", "ACME"].forEach(n => {
    const u = el("div", "u", null);
    const img = el("img", "u-cursor", null, u);
    img.src = "assets/cursor.svg";
    img.alt = "cursor";
    el("b", "", n, u);
    const mv = () => { u.style.left = rnd(0, innerWidth - 90) + "px"; u.style.top = rnd(80, innerHeight - 40) + "px" };
    mv();
    setInterval(mv, rnd(1500, 2500));
  });

  cookie();
  setTimeout(() => toast("🔋 2% battery remaining. Please plug in your todo list."), 12000);
  setInterval(() => toast("🎉 You won a free pebble! Tap to claim.", () => toast("Pebble out of stock.")), 22000);
  setInterval(chat, 14000); setInterval(quack, 7000);
  setTimeout(() => { update(); setInterval(update, 60000) }, 25000);
  setTimeout(paywall, 40000);
  setTimeout(pwWall, 60000);
  // Random "achievement" toasts
  setInterval(() => {
    toast(pick([
      '<img src="assets/achivement.svg" class="svg-icon" alt="Achievement"> Achievement Unlocked: Wasted 5 Minutes!',
      '<img src="assets/achivement.svg" class="svg-icon" alt="Achievement"> Achievement Unlocked: Clicked Something!',
      '<img src="assets/achivement.svg" class="svg-icon" alt="Achievement"> Achievement Unlocked: Still Here For Some Reason!',
      '<img src="assets/achivement.svg" class="svg-icon" alt="Achievement"> Achievement Unlocked: Breathed While Using App!',
      '<img src="assets/achivement.svg" class="svg-icon" alt="Achievement"> Achievement Unlocked: Read a Toast Notification!',
      "📢 Gerald the hamster wants you to know he's proud of you.",
      "💡 Pro tip: Alt+F4 for premium features.",
      "📊 Your productivity score: -7. New record!"
    ]));
  }, 18000);
}

const cap = el("div", "ov"); cap.id = "cap-overlay"; let tries = 0;
function capUI() {
  cap.textContent = ""; const b = el("div", "box", null, cap); el("h2", "", "Verify you're human", b); el("p", "", "Select every square containing a todo before accessing the app", b);
  const g = el("div", "grid", null, b);[..."🍞🚦🐔🚲🪑✅🌳🐔🚦"].sort(() => R() - .5).forEach(e => { const s = el("div", "sq", e, g); s.onclick = () => s.classList.toggle("sel") });
  el("button", "btn", "Verify", b).onclick = () => {
    if (!g.querySelector(".sel")) { toast("Humans select things."); return }
    if (tries++ < 1) { toast("Incorrect. You seem like a robot. Try again."); capUI() } else { cap.remove(); showTerms() }
  }
}

// Terms & conditions flow
function showTerms() {
  const t = $("#terms"); t.hidden = false;
  const cb = $("#terms-agree"), btn = $("#terms-accept");
  cb.onchange = () => { btn.disabled = !cb.checked };
  btn.onclick = () => {
    if (!cb.checked) return;
    t.hidden = true;
    // Fake loading screen
    const loader = $("#loader");
    loader.hidden = false;
    loader.style.display = "flex";
    let msgs = ["Optimizing your productivity experience...", "Calibrating procrastination algorithms...", "Feeding Gerald...", "Downloading more RAM...", "Consulting the void...", "Almost there... (lie)", "Reticulating splines...", "Compiling excuses..."];
    let mi = 0;
    const li = setInterval(() => {
      mi++;
      if (mi < msgs.length) loader.querySelector("p").textContent = msgs[mi];
      else { clearInterval(li); loader.classList.add("done"); setTimeout(() => { loader.hidden = true; loader.style.display = "none"; }, 600); start() }
    }, 1500);
  };
}

// Initial startup: immediately present the "Verify you're human" challenge
capUI();


