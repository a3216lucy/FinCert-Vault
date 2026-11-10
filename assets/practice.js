/* 練習模式（點選項才對答案）＋錯題本記錄 — 由 nav.js 載入 */
(function () {
  if (window.GYPractice) return; // 工具頁會自己先載入一次
  var MODE_KEY = "gy-practice-mode";
  var BOOK_KEY = "gy-wrongbook";

  function load(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  // 由網址找科目與章名（章節表在 nav.js 的 window.GY_SITE）
  function pageInfo(path) {
    var site = window.GY_SITE || [];
    for (var i = 0; i < site.length; i++) {
      for (var j = 0; j < site[i].chapters.length; j++) {
        if (site[i].base + site[i].chapters[j][0] === path) {
          return { subj: site[i].group, title: site[i].chapters[j][1] };
        }
      }
    }
    return { subj: "", title: "" };
  }

  function qnoOf(q) {
    if (q.getAttribute("data-qno")) return q.getAttribute("data-qno");
    var el = q.querySelector(".qno");
    return el ? el.textContent.trim() : "";
  }

  // 存一份「乾淨」的題目 HTML，錯題本不用再回頭抓章節頁
  function cleanHtml(q, qno) {
    var clone = q.cloneNode(true);
    clone.querySelectorAll(".opt.picked").forEach(function (o) {
      o.classList.remove("picked");
    });
    var el = clone.querySelector(".qno");
    if (el) el.textContent = qno;
    return clone.innerHTML;
  }

  function recordWrong(q) {
    var page = q.getAttribute("data-page") || window.location.pathname;
    var qno = qnoOf(q);
    var id = page + "#" + qno;
    var book = load(BOOK_KEY, {});
    var entry = book[id];
    if (!entry) {
      var info = pageInfo(page);
      entry = book[id] = {
        page: page,
        qno: qno,
        subj: info.subj,
        title: info.title,
        html: cleanHtml(q, qno),
        wrong: 0,
        note: "",
        fix: "",
      };
    }
    entry.wrong += 1;
    entry.last = Date.now();
    save(BOOK_KEY, book);
  }

  function grade(q, opt) {
    q.classList.add("answered");
    if (opt) opt.classList.add("picked");
    var ok = !!(opt && opt.classList.contains("right"));
    if (!ok) recordWrong(q);
    q.dispatchEvent(
      new CustomEvent("gy-graded", { bubbles: true, detail: { ok: ok } }),
    );
    return ok;
  }

  function isLive(q) {
    return (
      document.body.classList.contains("practice-on") || !!q.closest(".quiz")
    );
  }

  document.addEventListener("click", function (e) {
    var opt = e.target.closest(".q-item .opt");
    if (!opt) return;
    var q = opt.closest(".q-item");
    if (!isLive(q) || q.classList.contains("answered")) return;
    var quiz = q.closest(".quiz");
    if (quiz && quiz.classList.contains("quiz-exam")) {
      // 模擬考：只記下選擇、可以改選，交卷才對答案
      q.querySelectorAll(".opt.picked").forEach(function (o) {
        o.classList.remove("picked");
      });
      opt.classList.add("picked");
      q.dispatchEvent(new CustomEvent("gy-picked", { bubbles: true }));
      return;
    }
    grade(q, opt);
  });

  window.GYPractice = {
    BOOK_KEY: BOOK_KEY,
    load: load,
    save: save,
    pageInfo: pageInfo,
    grade: grade,
  };

  // ---- 章節頁的開關（只在有考古題、且不是刷題頁時出現） ----
  if (!document.querySelector(".q-item") || document.querySelector(".quiz"))
    return;
  var themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  var modeToggle = document.createElement("button");
  modeToggle.type = "button";
  modeToggle.className = "theme-toggle";
  themeToggle.parentNode.insertBefore(modeToggle, themeToggle.nextSibling);

  function setMode(on) {
    document.body.classList.toggle("practice-on", on);
    if (on) {
      document.querySelectorAll(".q-item.answered").forEach(function (q) {
        q.classList.remove("answered");
        q.querySelectorAll(".opt.picked").forEach(function (o) {
          o.classList.remove("picked");
        });
      });
    }
    modeToggle.innerHTML =
      '<span class="theme-icon" aria-hidden="true">✎</span>' +
      (on ? "練習模式：開（點選項才對答案）" : "練習模式：關（答案直接顯示）");
    modeToggle.setAttribute("aria-pressed", String(on));
  }

  setMode(load(MODE_KEY, false) === true);
  modeToggle.addEventListener("click", function () {
    var on = !document.body.classList.contains("practice-on");
    save(MODE_KEY, on);
    setMode(on);
  });
})();
