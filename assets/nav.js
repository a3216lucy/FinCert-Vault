/* 高業考前重點 — 側邊選單（每頁共用） */
(function () {
  var SITE = [
    { group: "入門", base: "/", chapters: [["beginner-guide.html", "導讀"]] },
    {
      group: "投資學",
      base: "/investment/",
      chapters: [
        ["ch01-investment-tools.html", "1｜各類投資工具"],
        ["ch02-bond-features.html", "2｜債券特性與種類"],
        ["ch03-bond-duration.html", "3｜債券存續期間與價格"],
        ["ch04-stock-valuation.html", "4｜股價評估與報酬率"],
        ["ch05-technical-analysis.html", "5｜股票技術分析"],
        ["ch06-risk-capm.html", "6｜風險指標與 CAPM"],
        ["ch07-cml-sml.html", "7｜E(R)、CML、SML"],
        ["ch08-efficient-market.html", "8｜投資態度、策略與效率市場"],
        ["ch09-derivatives.html", "9｜衍生性金融商品與選擇權"],
        ["ch10-economic-indicators.html", "10｜經濟指標與貨幣政策"],
      ],
    },
    {
      group: "財務分析",
      base: "/finance/",
      chapters: [
        ["ch01-accounting-basics.html", "1｜會計觀念、原則與三大報表"],
        ["ch02-current-assets.html", "2｜資產類別－流動資產"],
        ["ch03-noncurrent-assets.html", "3｜資產類別－非流動資產"],
        ["ch04-liabilities.html", "4｜負債類別"],
        ["ch05-equity.html", "5｜權益類別"],
        ["ch06-income-statement.html", "6｜綜合損益表"],
        ["ch07-leverage.html", "7｜損益兩平與槓桿比率"],
        ["ch08-eps-quality.html", "8｜盈餘計算與評估品質"],
        ["ch09-cash-flow.html", "9｜現金流量表"],
        ["ch10-statement-analysis.html", "10｜財報編制與分析方法"],
        ["ch11-capital-budgeting.html", "11｜投資融資決策與租賃"],
        ["ch12-ratios.html", "12｜財務比率分析"],
        ["ch13-formulas.html", "13｜常用公式整理"],
      ],
    },
    {
      group: "證券法規與實務",
      base: "/regulations/",
      chapters: [
        ["ch01-company-law.html", "1｜公司法相關規定"],
        ["ch02-corp-governance.html", "2｜股份有限公司組織"],
        ["ch03-disclosure.html", "3｜公開發行公司管理"],
        ["ch04-securities-issuance.html", "4｜有價證券募集與發行"],
        ["ch05-securities-firms.html", "5｜證券商、證交所與集保事業"],
        ["ch06-underwriting.html", "6｜承銷制度與上市櫃申請"],
        ["ch07-trading-practice.html", "7｜股票交易實務"],
        ["ch08-markets.html", "8｜集中與店頭市場"],
        ["ch09-margin-trading.html", "9｜信用交易與借券"],
        ["ch10-funds.html", "10｜投信投顧事業與基金"],
        ["ch11-legal-liability.html", "11｜法律責任與爭議解決"],
      ],
    },
    {
      group: "考前速記",
      base: "/",
      chapters: [["memory-tips.html", "記憶技巧與口訣"]],
    },
  ];

  function buildNav() {
    var current = window.location.pathname.replace(/\/+$/, "");
    var html = "";
    html += '<a class="sidebar-brand" href="/index.html">';
    html += '<span class="eyebrow">證券商高級業務員</span>';
    html += "<h1>高業考前重點</h1>";
    html += "</a><nav>";
    SITE.forEach(function (section) {
      html += '<div class="nav-group-title">' + section.group + "</div>";
      section.chapters.forEach(function (ch) {
        var href = section.base + ch[0];
        var isCurrent = current === href.replace(/\/+$/, "");
        html +=
          '<a class="nav-link' +
          (isCurrent ? " current" : "") +
          '" href="' +
          href +
          '">' +
          ch[1] +
          "</a>";
      });
    });
    html += "</nav>";
    return html;
  }

  var COLLAPSE_KEY = "gy-sidebar-collapsed";
  var THEME_KEY = "gy-theme";
  function isDesktop() {
    return window.innerWidth > 880;
  }
  function getStoredCollapsed() {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }
  function setStoredCollapsed(val) {
    try {
      localStorage.setItem(COLLAPSE_KEY, val ? "1" : "0");
    } catch (e) {}
  }
  function getStoredTheme() {
    try {
      var theme = localStorage.getItem(THEME_KEY);
      return theme === "light" || theme === "dark" ? theme : null;
    } catch (e) {
      return null;
    }
  }
  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
  function isDarkTheme() {
    var theme = document.documentElement.getAttribute("data-theme");
    return theme
      ? theme === "dark"
      : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function init() {
    var mount = document.getElementById("site-nav");
    if (!mount) return;
    var shell = mount.parentElement;

    var scrim = document.createElement("div");
    scrim.className = "nav-scrim";

    var toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "開啟選單");
    toggle.innerHTML = "☰";

    mount.className = "sidebar";
    mount.innerHTML = buildNav();

    var collapseBtn = document.createElement("button");
    collapseBtn.className = "sidebar-collapse-btn";
    collapseBtn.setAttribute("aria-label", "收合選單");
    collapseBtn.innerHTML = "‹";
    var brand = mount.querySelector(".sidebar-brand");
    if (brand) {
      brand.appendChild(collapseBtn);
    }

    var nav = mount.querySelector("nav");

    // ---- 全站搜尋（固定在頁面最上方的 header，跟側邊欄收合與否無關） ----
    var siteHeader = document.createElement("div");
    siteHeader.className = "site-header";
    var searchWrap = document.createElement("div");
    searchWrap.className = "site-search";
    searchWrap.innerHTML =
      '<input type="text" class="site-search-input" placeholder="搜尋全站內容…" autocomplete="off" />' +
      '<div class="site-search-results" hidden></div>';
    siteHeader.appendChild(searchWrap);
    document.body.insertBefore(siteHeader, document.body.firstChild);

    var searchInput = searchWrap.querySelector(".site-search-input");
    var searchResults = searchWrap.querySelector(".site-search-results");
    var searchIndex = null;
    var searchIndexPromise = null;

    function loadSearchIndex() {
      if (!searchIndexPromise) {
        searchIndexPromise = fetch("/assets/search-index.json")
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            searchIndex = data;
            return data;
          })
          .catch(function () {
            searchIndex = [];
            return [];
          });
      }
      return searchIndexPromise;
    }

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, function (c) {
        return (
          { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
            c
          ] || c
        );
      });
    }

    function renderResults(query) {
      if (!query) {
        searchResults.innerHTML = "";
        searchResults.hidden = true;
        return;
      }
      var q = query.toLowerCase();
      var scored = [];
      (searchIndex || []).forEach(function (item) {
        var h = item.heading.toLowerCase();
        var s = item.snippet.toLowerCase();
        var p = item.page.toLowerCase();
        var score = -1;
        if (h.indexOf(q) !== -1) score = 2;
        else if (p.indexOf(q) !== -1) score = 1;
        else if (s.indexOf(q) !== -1) score = 0;
        if (score >= 0) scored.push({ item: item, score: score });
      });
      scored.sort(function (a, b) {
        return b.score - a.score;
      });
      var top = scored.slice(0, 8);
      if (!top.length) {
        searchResults.innerHTML =
          '<div class="site-search-empty">找不到符合的內容</div>';
        searchResults.hidden = false;
        return;
      }
      searchResults.innerHTML = top
        .map(function (r) {
          var item = r.item;
          var href =
            item.url + "#:~:text=" + encodeURIComponent(item.heading);
          return (
            '<a class="site-search-item" href="' +
            href +
            '">' +
            '<span class="site-search-heading">' +
            escapeHtml(item.heading) +
            "</span>" +
            '<span class="site-search-page">' +
            escapeHtml(item.page) +
            "</span>" +
            '<span class="site-search-snippet">' +
            escapeHtml(item.snippet.slice(0, 70)) +
            "…</span>" +
            "</a>"
          );
        })
        .join("");
      searchResults.hidden = false;
    }

    searchInput.addEventListener("focus", loadSearchIndex);
    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim();
      if (!query) {
        renderResults("");
        return;
      }
      loadSearchIndex().then(function () {
        renderResults(query);
      });
    });
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        searchInput.value = "";
        renderResults("");
        searchInput.blur();
      }
    });
    document.addEventListener("click", function (e) {
      if (!searchWrap.contains(e.target)) {
        searchResults.hidden = true;
      }
    });
    searchInput.addEventListener("focus", function () {
      if (searchInput.value.trim()) searchResults.hidden = false;
    });

    var themeToggle = document.createElement("button");
    themeToggle.type = "button";
    themeToggle.className = "theme-toggle";
    if (nav) mount.insertBefore(themeToggle, nav);

    function updateThemeToggle() {
      var isDark = isDarkTheme();
      themeToggle.innerHTML =
        '<span class="theme-icon" aria-hidden="true">' +
        (isDark ? "☀" : "☾") +
        "</span>" +
        (isDark ? "切換為淺色模式" : "切換為深色模式");
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "切換為淺色模式" : "切換為深色模式",
      );
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }

    var storedTheme = getStoredTheme();
    if (storedTheme) applyTheme(storedTheme);
    updateThemeToggle();

    document.body.insertBefore(scrim, document.body.firstChild);
    document.body.insertBefore(toggle, document.body.firstChild);

    function openMobile() {
      mount.classList.add("open");
      scrim.classList.add("show");
    }
    function closeMobile() {
      mount.classList.remove("open");
      scrim.classList.remove("show");
    }

    function collapseDesktop(persist) {
      if (shell) shell.classList.add("desktop-collapsed");
      document.body.classList.add("desktop-collapsed");
      if (persist) setStoredCollapsed(true);
    }
    function expandDesktop(persist) {
      if (shell) shell.classList.remove("desktop-collapsed");
      document.body.classList.remove("desktop-collapsed");
      if (persist) setStoredCollapsed(false);
    }

    if (isDesktop() && getStoredCollapsed()) {
      collapseDesktop(false);
    }

    toggle.addEventListener("click", function () {
      if (isDesktop()) {
        expandDesktop(true);
      } else {
        mount.classList.contains("open") ? closeMobile() : openMobile();
      }
    });
    collapseBtn.addEventListener("click", function () {
      collapseDesktop(true);
    });
    themeToggle.addEventListener("click", function () {
      var nextTheme = isDarkTheme() ? "light" : "dark";
      applyTheme(nextTheme);
      setStoredTheme(nextTheme);
      updateThemeToggle();
    });
    scrim.addEventListener("click", closeMobile);
    mount.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMobile();
    });
    document.addEventListener("click", function (e) {
      if (!isDesktop()) return;
      if (shell && shell.classList.contains("desktop-collapsed")) return;
      if (
        mount.contains(e.target) ||
        toggle.contains(e.target) ||
        siteHeader.contains(e.target)
      )
        return;
      collapseDesktop(true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
