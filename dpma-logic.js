var DPMA = (function () {
  "use strict";

  /* ── DATA ── */
  var AXES = [
    "Definition & Scope",
    "Ownership",
    "Discoverability",
    "Documentation",
    "Quality",
    "SLAs & Reliability",
    "Governance",
    "Consumption & Value",
    "Reusability",
  ];
  var AXES_SHORT = [
    "Definition",
    "Ownership",
    "Discovery",
    "Docs",
    "Quality",
    "SLAs",
    "Governance",
    "Consumption",
    "Reuse",
  ];
  var TOTAL = 9;

  var STAGE_NAMES = {
    "Definition & Scope": ["Table / View", "Curated Dataset", "Defined Data Product", "Productized Asset", "Composable Product"],
    Ownership: ["Unowned", "Technical Owner", "Data Product Owner", "Product Team", "Product Operating Model"],
    Discoverability: ["Tribal Knowledge", "Documented Lists", "Cataloged", "Self-Service Access", "Data Marketplace"],
    Documentation: ["None", "Partial", "Business-Ready", "Standardised", "Machine-Readable"],
    Quality: ["Assumed Correct", "Manual Checks", "Defined Quality Rules", "Monitored & Enforced", "Self-Healing"],
    "SLAs & Reliability": ["Unknown", "Best Effort", "Defined SLAs", "Enforced SLOs", "Predictive Reliability"],
    Governance: ["Manual Access", "Tool-Based Access", "Centralised Governance", "Embedded Governance", "Continuous Compliance"],
    "Consumption & Value": ["Unknown Usage", "Anecdotal", "Measured Adoption", "Outcome-Driven", "Strategic Asset"],
    Reusability: ["One-Off", "Limited Reuse", "Designed for Reuse", "Interoperable", "Composable Product"],
  };

  var QUESTIONS = [
    {
      cat: "Dimension 1 — Definition & Scope",
      text: "How clearly is your data product defined — its purpose, boundaries, and the business problem it solves?",
      opts: [
        "No formal definition — the data product's scope is unclear or undefined",
        "Informally described but undocumented; only key individuals understand its scope",
        "Formally documented with clear purpose, business context, and intended consumers",
        "Well-defined with SLAs, versioning, and aligned to strategic objectives",
        "Continuously refined based on consumer feedback and business value metrics",
      ],
    },
    {
      cat: "Dimension 2 — Ownership",
      text: "How clearly are data product owners and their accountability defined within your organisation?",
      opts: [
        "No ownership — data is managed ad hoc by whoever is available",
        "Informal ownership exists but responsibilities are undocumented",
        "Ownership roles formally defined with documented responsibilities",
        "Owners accountable for quality, SLAs, and actively manage their products",
        "Ownership embedded in culture; owners drive cross-domain innovation",
      ],
    },
    {
      cat: "Dimension 3 — Discoverability",
      text: "How easily can data consumers find and access your data product through catalogs or marketplaces?",
      opts: [
        "No catalog — consumers must ask individuals to find data",
        "Basic inventory exists but metadata is sparse and hard to navigate",
        "Data catalog with rich metadata enables self-service discovery",
        "Data marketplace with ratings, SLAs, and lineage supports confident reuse",
        "AI-powered discovery proactively recommends data products to consumers",
      ],
    },
    {
      cat: "Dimension 4 — Documentation",
      text: "How complete and self-service is the documentation accompanying your data product?",
      opts: [
        "No documentation — consumers rely entirely on tribal knowledge",
        "Some documentation exists but is outdated or incomplete",
        "Consistent schema, lineage, and usage guidance maintained",
        "Rich self-service documentation enables consumers to onboard independently",
        "Living documentation auto-generated; consumers self-serve at scale",
      ],
    },
    {
      cat: "Dimension 5 — Quality",
      text: "To what extent does your organisation monitor and enforce data quality standards for this product?",
      opts: [
        "No monitoring — quality issues are discovered reactively by consumers",
        "Basic checks exist but are manual and inconsistently applied",
        "Standardized quality rules automated and applied consistently",
        "Proactive quality monitoring with SLAs, alerting, and trend analysis",
        "ML-driven anomaly detection and self-healing pipelines ensure continuous quality",
      ],
    },
    {
      cat: "Dimension 6 — SLAs & Reliability",
      text: "How well are service level agreements (SLAs) defined and enforced for your data product?",
      opts: [
        "No SLAs — availability and freshness are entirely unpredictable",
        "Informal expectations exist but are not formally agreed or tracked",
        "SLAs documented and tracked with regular reporting to stakeholders",
        "Automated SLA monitoring with alerts, escalation, and consumer notifications",
        "SLAs dynamically adjusted based on usage patterns and business criticality",
      ],
    },
    {
      cat: "Dimension 7 — Governance",
      text: "How mature is the governance framework — access controls, lineage, and compliance for your data product?",
      opts: [
        "No governance — data policies absent or unenforced",
        "Some policies exist but compliance is inconsistent",
        "Formal governance with documented policies enforced organization-wide",
        "Automated policy enforcement with auditable lineage and access controls",
        "Federated governance enabling domain autonomy within a global compliance framework",
      ],
    },
    {
      cat: "Dimension 8 — Consumption & Value Delivery",
      text: "How effectively is your data product consumed and does it demonstrably deliver business value?",
      opts: [
        "No consumption tracking — value delivery is unknown or unmeasured",
        "Some usage observed but no formal value measurement exists",
        "Usage metrics tracked and linked to defined business KPIs",
        "ROI modelled; data product prioritised based on demonstrated business value",
        "Data product drives competitive differentiation with continuously optimised value streams",
      ],
    },
    {
      cat: "Dimension 9 — Reusability & Interoperability",
      text: "How reusable and interoperable is your data product across different teams, domains, and systems?",
      opts: [
        "Built for one use case — tightly coupled and not reusable",
        "Occasionally reused but requires significant manual effort each time",
        "Standardised APIs and contracts enable reuse across multiple teams",
        "Semantic layer and common standards enable cross-domain composition",
        "Universal interoperability with automated schema evolution and zero-friction integration",
      ],
    },
  ];

  var LEVELS = {
    1: {
      num: "LEVEL 1",
      name: "Ad Hoc",
      pct: 10,
      desc: "You have a reactive, unstructured approach to data management. Data is treated as a byproduct rather than as a product in its own right.",
    },
    2: {
      num: "LEVEL 2",
      name: "Emerging",
      pct: 20,
      desc: "There is initial recognition of data as valuable at this stage. Basic data practices exist, but are very inconsistent across the organisation. Data delivery is often point-to-point and driven by specific use cases.",
    },
    3: {
      num: "LEVEL 3",
      name: "Defined",
      pct: 40,
      desc: "This level is characterised by standardised processes and clear ownership structures. Data products are intentionally designed.",
    },
    4: {
      num: "LEVEL 4",
      name: "Managed",
      pct: 60,
      desc: "Your organisation demonstrates proactive management with monitoring and automation capabilities. Data products are treated as strategic assets.",
    },
    5: {
      num: "LEVEL 5",
      name: "Optimised",
      pct: 80,
      desc: "At this highest level, organisations embrace continuous improvement and innovation. Data products drive competitive advantage and enable faster time-to-market.",
    },
  };

  var RECS = {
    "Definition & Scope": [
      null,
      "Identify a small number of frequently used tables and apply lightweight transformations to make them usable for a specific team or use case. Introduce informal but consistent naming conventions and document which project or team the dataset supports. The goal is to move from raw storage to intentional, team-level curation.",
      "Explicitly define what the dataset represents, where it comes from, and who it is for. Document inputs, outputs, and intended usage, and assign a unique identifier. Introduce basic schema versioning and start tracking changes so consumers can rely on stability.",
      "Treat your data like a software product by creating formal data contracts that specify schema, SLAs, quality guarantees, and backward compatibility policies. Implement semantic versioning (v1.0, v1.1, v2.0) with clear deprecation timelines for breaking changes. Build stable access interfaces like REST APIs, GraphQL endpoints, or SQL views that abstract underlying complexity. Establish lifecycle management processes, including release notes, migration guides for version changes, and sunset policies.",
      null,
    ],
    Ownership: [
      null,
      "Create a simple ownership registry mapping each critical data asset to a technical contact person, typically the engineer or analyst who built it. Use a spreadsheet, or add ownership tags in your data catalog. Ensure this person is identified as the go-to for questions or issues, even if their responsibility is reactive. Communicate ownership assignments to stakeholders so they know who to contact when problems occur.",
      "Appoint formal Data Product Owners who are accountable not just for technical maintenance but for the business value and strategic direction of the data product. Define clear responsibilities, including maintaining quality, ensuring availability, gathering user feedback, prioritising enhancements, and managing the product roadmap. Document these ownership assignments in your data catalog with contact information and escalation paths.",
      "Form cross-functional squads for your most critical data products, bringing together data engineers, analytics engineers, data analysts, and governance specialists. Establish clear team charters defining scope, success metrics, and operating principles. Implement structured prioritisation processes using frameworks like RICE (Reach, Impact, Confidence, Effort) or weighted scoring. Create formal escalation paths with defined SLAs for different issue severities.",
      null,
    ],
    Discoverability: [
      null,
      "Create a simple inventory of your data assets; start with a shared spreadsheet or wiki page listing key datasets, their locations, brief descriptions, update frequency, and owner contact information. Encourage teams to contribute entries for datasets they create or maintain. Focus on your most-used or most-critical data assets first rather than attempting comprehensive coverage.",
      "Implement a data catalog tool (DataHub, Alation, Collibra, or cloud-native options like AWS Glue Catalog) and migrate your documented lists into it. Configure automated metadata harvesting to keep catalog entries up-to-date. Enrich catalog entries with business descriptions, tags, data classifications, lineage information, and sample queries. Establish basic access request workflows.",
      "Automate access provisioning by integrating your catalog with identity management systems (Okta, Azure AD) and implementing role-based access control. Add fitness-for-purpose indicators in your catalog: data quality scores, freshness metrics, usage statistics, and user ratings that help users evaluate if data meets their needs. Implement self-service approval workflows with clear SLAs.",
      null,
    ],
    Documentation: [
      null,
      "Start adding basic descriptions to your most important datasets, even simple notes are better than nothing. Document field-level descriptions explaining what each column represents in plain language. Create simple lineage diagrams showing where data originates and where it flows. Focus on the top 10\u201320 most-used datasets first to get quick wins.",
      "Work with business stakeholders to create a business glossary defining terms in business language. For every metric, document the calculation logic, grain (daily/monthly, customer/account level), business rules, and edge cases. Add usage guidance explaining appropriate use cases, known limitations, and common pitfalls. Implement automated lineage tracking.",
      "Establish organisation-wide documentation standards and semantic data models that ensure consistency across all teams. Implement documentation-as-code where metadata, business definitions, and lineage are versioned alongside transformation code in Git. Deploy end-to-end lineage tracking tools that automatically capture dependencies and enable impact analysis.",
      null,
    ],
    Quality: [
      null,
      "Build a library of validation SQL queries for your critical datasets \u2014 simple checks like row count validations, null checks on key columns, range checks on numeric fields, and referential integrity checks. Run these queries manually on a regular schedule (weekly or after major data loads). Document the queries in a shared location with explanations of what each checks for.",
      "Define explicit data quality rules for each data product covering: freshness (data updated within expected timeframe), completeness (no unexpected nulls or missing records), accuracy (values within reasonable ranges), and validity (values conform to business rules). Implement data quality testing frameworks like Great Expectations, dbt tests, or Soda to codify and execute these rules systematically.",
      "Automate all quality checks to run on every data refresh or as part of your orchestration workflows (Airflow, Dagster, Prefect). Build real-time monitoring dashboards showing quality status across your data ecosystem with clear red/yellow/green indicators. Implement automated alerting that notifies data product owners when quality thresholds are breached, with severity levels and clear escalation paths.",
      null,
    ],
    "SLAs & Reliability": [
      null,
      "Document current refresh patterns for your key datasets \u2014 when do pipelines typically run, and how long do they take? Create a simple status page showing the last successful refresh time for critical datasets. Set up basic monitoring in your orchestration tool to track pipeline completion times. Send manual notifications to stakeholders when delays occur.",
      "Work directly with data consumers to understand their actual freshness requirements. Document formal SLAs for each data product specifying: update frequency (hourly, daily, weekly), expected latency (data available within X hours of source update), availability windows, and acceptable downtime. Publish these SLAs in your data catalog and include them in data contracts.",
      "Implement comprehensive monitoring that tracks SLA compliance in real-time and automatically raises incidents when SLAs are breached. Define Service Level Objectives (SLOs) with error budgets that balance reliability with development velocity. Create incident response playbooks documenting step-by-step remediation procedures for different types of SLA violations.",
      null,
    ],
    Governance: [
      null,
      "Implement the identity and access management (IAM) capabilities of your data platform (Snowflake RBAC, Databricks Unity Catalog, BigQuery IAM). Define basic roles aligned with job functions (analyst, engineer, data scientist, admin) and begin manually assigning users to these roles. Start with coarse-grained controls at the database or schema level before tackling table or column-level permissions.",
      "Establish a centralised data governance function or committee responsible for defining and enforcing policies. Create a data classification scheme (public, internal, confidential, restricted) with associated access policies for each classification level. Implement a governance platform that provides centralised policy definition and enforcement across your data ecosystem.",
      "Embed governance policies directly into data products through policy-as-code where access controls, masking rules, and quality requirements are defined alongside data transformations. Implement automated policy enforcement using tools like Immuta, Privacera, or native platform features that dynamically apply access controls and masking without manual intervention. Deploy comprehensive audit logging.",
      null,
    ],
    "Consumption & Value": [
      null,
      "Start gathering anecdotal evidence of data usage through informal channels. When teams mention using your data assets in meetings or conversations, document these use cases. Create feedback channels like Slack channels, email lists, or Teams where data consumers can ask questions and share experiences.",
      "Implement usage tracking using your data platform\u2019s built-in capabilities \u2014 most platforms provide query logs, access logs, and usage analytics. Build dashboards showing key adoption metrics: number of active users, query frequency, data volume consumed, most popular datasets, and usage trends over time. Implement systematic feedback collection through surveys.",
      "Connect data product metrics to tangible business outcomes \u2014 work with business leaders to understand how each data product contributes to revenue, cost reduction, customer satisfaction, or operational efficiency. Implement FinOps practices that measure the cost to produce, store, and maintain each data product and compare against the business value delivered.",
      null,
    ],
    Reusability: [
      null,
      "When building new data assets, ask yourself: \u201CCould another team use this?\u201D Design datasets to be slightly more generic than your immediate use case requires, and avoid hardcoding assumptions specific to one report or dashboard. Document your datasets sufficiently that others can discover and understand them. Create simple interfaces like views that make your data easier for others to consume.",
      "Design data products explicitly for multiple consumers from day one. Establish stable schemas with versioning that maintains backward compatibility when changes are necessary. Create formal data contracts specifying the interface, SLAs, and quality guarantees consumers can depend on. Adopt industry-standard data formats (Parquet, Avro, JSON) and protocols (REST APIs, JDBC/ODBC, SQL).",
      "Adopt industry-standard APIs and protocols that work across different tools and platforms, like REST APIs, GraphQL for flexible queries, gRPC for high-performance, and JDBC/ODBC for SQL access. Implement standard metadata schemas (Apache Atlas, DCAT) that enable seamless integration with various tools. Build pre-built connectors or adapters for popular tools in your ecosystem.",
      null,
    ],
  };

  /* ── STATE ── */
  var answers = new Array(TOTAL).fill(null);
  var currentQ = 0;
  var activeTabs = new Set(AXES);
  var SCROLL_TARGET = "#assessment";
  var BTN_CLASS = "button is-maturity";
  var BTN_CLASS_SECONDARY = "button is-maturity is-secondary";

  /* ══════════════════════════════════════════
   HiDPI CANVAS HELPER
   ══════════════════════════════════════════ */
  function setupHiDPI(canvas, w, h) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return ctx;
  }

  /* ── ENCODING / DECODING ── */
  function encodeAnswers(ans) {
    var num = 0;
    for (var i = 0; i < TOTAL; i++) {
      num = num * 5 + ((ans[i] || 1) - 1);
    }
    return "v1-" + num.toString(36);
  }
  function decodeAnswers(str) {
    if (!str) return null;
    var parts = str.split("-");
    if (parts[0] !== "v1" || !parts[1]) return null;
    var num = parseInt(parts[1], 36);
    if (isNaN(num)) return null;
    var ans = [];
    for (var i = TOTAL - 1; i >= 0; i--) {
      ans[i] = (num % 5) + 1;
      num = Math.floor(num / 5);
    }
    for (var j = 0; j < TOTAL; j++) {
      if (ans[j] < 1 || ans[j] > 5) return null;
    }
    return ans;
  }

  /* ══════════════════════════════════════════
   BUILD QUESTIONS
   ══════════════════════════════════════════ */
  function buildQuestions() {
    var container = document.getElementById("dpma-questions");
    if (!container) return;
    var html = "";
    QUESTIONS.forEach(function (q, qi) {
      var isFirst = qi === 0,
        isLast = qi === TOTAL - 1;
      html +=
        '<div class="dpma-qcard' +
        (isFirst ? " active" : "") +
        '" data-q="' +
        qi +
        '">';
      html += '<div class="dpma-qlayout"><div class="dpma-qcontent">';
      html += '<div class="dpma-qcat">' + q.cat + "</div>";
      html +=
        '<div class="dpma-qnum">' +
        (qi + 1 < 10 ? "0" : "") +
        (qi + 1) +
        " / 0" +
        TOTAL +
        "</div>";
      html += '<div class="dpma-qtext">' + q.text + "</div>";
      html += '<div class="dpma-options">';
      var axisKey = AXES[qi];
      var stages = STAGE_NAMES[axisKey] || [];
      q.opts.forEach(function (o, oi) {
        var stageName = stages[oi] || "";
        html += '<div class="dpma-opt" data-val="' + (oi + 1) + '">';
        html += '<div class="dpma-opt-radio"></div>';
        html += '<span class="dpma-opt-score">L' + (oi + 1) + "</span>";
        html += '<span class="dpma-opt-text"><strong>' + stageName + ":</strong> " + o + "</span></div>";
      });
      html += "</div>";
      html += '<div class="dpma-qnav">';
      html +=
        '<button class="dpma-btn dpma-btn-prev ' +
        BTN_CLASS_SECONDARY +
        '"' +
        (isFirst ? " disabled" : "") +
        ">&#8592; Back</button>";
      html +=
        '<button class="dpma-btn dpma-btn-next ' +
        (isLast ? "dpma-submit " : "") +
        BTN_CLASS +
        '" disabled>' +
        (isLast ? "View Results &#8594;" : "Next &#8594;") +
        "</button>";
      html += "</div></div>";
      html +=
        '<div class="dpma-radar-panel"><div class="dpma-radar-label">Maturity Fingerprint</div>';
      html +=
        '<canvas class="dpma-mini-radar" width="260" height="240"></canvas></div>';
      html += "</div></div>";
    });
    container.innerHTML = html;
    bindQuestionEvents();
  }

  /* ── BIND EVENTS ── */
  function bindQuestionEvents() {
    var cards = document.querySelectorAll(".dpma-qcard");
    cards.forEach(function (card, qi) {
      card.querySelectorAll(".dpma-opt").forEach(function (opt) {
        opt.addEventListener("click", function () {
          card.querySelectorAll(".dpma-opt").forEach(function (o) {
            o.classList.remove("selected");
          });
          this.classList.add("selected");
          answers[qi] = parseInt(this.getAttribute("data-val"));
          card.querySelector(".dpma-btn-next").disabled = false;
          updateProgress();
          refreshMiniRadars();
        });
      });
      card
        .querySelector(".dpma-btn-prev")
        .addEventListener("click", function () {
          if (currentQ > 0) {
            currentQ--;
            showQuestion(currentQ);
          }
        });
      card
        .querySelector(".dpma-btn-next")
        .addEventListener("click", function () {
          if (this.classList.contains("dpma-submit")) {
            showResults();
          } else {
            currentQ++;
            showQuestion(currentQ);
          }
        });
    });
  }

  function showQuestion(idx) {
    var cards = document.querySelectorAll(".dpma-qcard");
    cards.forEach(function (c) {
      c.classList.remove("active");
    });
    cards[idx].classList.add("active");
    var card = cards[idx];
    card.querySelector(".dpma-btn-prev").disabled = idx === 0;
    card.querySelector(".dpma-btn-next").disabled = answers[idx] === null;
    card.querySelectorAll(".dpma-opt").forEach(function (opt) {
      var v = parseInt(opt.getAttribute("data-val"));
      opt.classList.toggle("selected", v === answers[idx]);
    });
    refreshMiniRadars();
    if (idx > 0) {
      var el = document.querySelector(SCROLL_TARGET);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /* ── PROGRESS ── */
  function updateProgress() {
    var done = answers.filter(function (a) {
      return a !== null;
    }).length;
    var pct = Math.round((done / TOTAL) * 100);
    var fill = document.getElementById("dpmaFill");
    var pctEl = document.getElementById("dpmaPct");
    if (fill) fill.style.width = pct + "%";
    if (pctEl) pctEl.textContent = pct + "%";
  }

  /* ══════════════════════════════════════════
   RADAR DRAWING — SHARED CORE
   Draws onto a 2D context at logical size.
   ══════════════════════════════════════════ */
  function getPrimary() {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue("--md-primary")
        .trim() || "#E8884A"
    );
  }

  function drawRadarCore(ctx, W, H, R, opts) {
    var cx = W / 2,
      cy = H / 2 + opts.cyOffset;
    var N = TOTAL;
    var primary = getPrimary();
    var fontBody =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--md-font-body")
        .trim() || "Century Gothic, Verdana, sans-serif";
    var labelSize = opts.labelSize || 12;
    var dotSize = opts.dotSize || 4;
    var lineW = opts.lineW || 2;
    var showLevelLabels = opts.showLevelLabels || false;

    ctx.clearRect(0, 0, W * 2, H * 2); // safe clear for HiDPI

    // Grid rings
    for (var l = 1; l <= 5; l++) {
      var r = (R * l) / 5;
      ctx.beginPath();
      for (var i = 0; i < N; i++) {
        var a = (2 * Math.PI * i) / N - Math.PI / 2;
        var x = cx + r * Math.cos(a),
          y = cy + r * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (showLevelLabels) {
        ctx.fillStyle = "rgba(255,255,255,.25)";
        ctx.font = "600 10px " + fontBody;
        ctx.textAlign = "center";
        ctx.fillText("L" + l, cx, cy - r + 13);
      }
    }

    // Spokes
    for (var i = 0; i < N; i++) {
      var a = (2 * Math.PI * i) / N - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.strokeStyle = "rgba(255,255,255,.07)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Labels
    var labelR = R + opts.labelPad;
    for (var i = 0; i < N; i++) {
      var a = (2 * Math.PI * i) / N - Math.PI / 2;
      var lx = cx + labelR * Math.cos(a);
      var ly = cy + labelR * Math.sin(a);
      var isActive = opts.activeCheck ? opts.activeCheck(i) : true;
      var hasAnswer = answers[i] !== null;
      ctx.fillStyle = isActive
        ? hasAnswer || opts.forceActiveLabels
          ? "rgba(245,240,235,.85)"
          : "rgba(255,255,255,.25)"
        : "rgba(255,255,255,.2)";
      ctx.font = "600 " + labelSize + "px " + fontBody;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(AXES_SHORT[i], lx, ly);
    }

    // Data polygon
    var pts = [];
    for (var i = 0; i < N; i++) {
      var val = opts.valFn ? opts.valFn(i) : answers[i] || 0;
      var r2 = (val / 5) * R;
      var a = (2 * Math.PI * i) / N - Math.PI / 2;
      pts.push({ x: cx + r2 * Math.cos(a), y: cy + r2 * Math.sin(a) });
    }
    ctx.beginPath();
    pts.forEach(function (p, i) {
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(200,90,25,.32)";
    ctx.fill();
    ctx.strokeStyle = primary;
    ctx.lineWidth = lineW;
    ctx.stroke();

    // Dots
    pts.forEach(function (p, i) {
      var val = opts.valFn ? opts.valFn(i) : answers[i] || 0;
      if (val > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = primary;
        ctx.fill();
      }
    });
  }

  /* ── MINI RADAR ── */
  function drawMiniRadar(canvas) {
    var cssW = 260,
      cssH = 240;
    var ctx = setupHiDPI(canvas, cssW, cssH);
    var R = Math.min(cssW, cssH) * 0.32;
    drawRadarCore(ctx, cssW, cssH, R, {
      cyOffset: 6,
      labelPad: 22,
      labelSize: 9,
      dotSize: 3.5,
      lineW: 1.5,
      forceActiveLabels: false,
    });
  }

  function refreshMiniRadars() {
    document.querySelectorAll(".dpma-mini-radar").forEach(function (c) {
      drawMiniRadar(c);
    });
  }

  /* ── FULL RADAR (results) ── */
  function drawFullRadar() {
    var canvas = document.getElementById("dpmaRadar");
    if (!canvas) return;
    var cssW = 460,
      cssH = 420;
    var ctx = setupHiDPI(canvas, cssW, cssH);
    var R = Math.min(cssW, cssH) * 0.36;
    drawRadarCore(ctx, cssW, cssH, R, {
      cyOffset: 10,
      labelPad: 32,
      labelSize: 13,
      dotSize: 5,
      lineW: 2.5,
      showLevelLabels: true,
      forceActiveLabels: true,
      activeCheck: function (i) {
        return activeTabs.has(AXES[i]);
      },
      valFn: function (i) {
        return activeTabs.has(AXES[i]) ? answers[i] || 0 : 0;
      },
    });
  }

  /* ── DONUT ── */
  function drawDonut(pct) {
    var canvas = document.getElementById("dpmaDonut");
    if (!canvas) return;
    var cssW = 110,
      cssH = 110;
    var ctx = setupHiDPI(canvas, cssW, cssH);
    var cx = cssW / 2,
      cy = cssH / 2;
    var r = Math.min(cssW, cssH) * 0.42;
    var inner = r * 0.6;
    var mid = (r + inner) / 2;
    var lw = r - inner;
    var primary = getPrimary();
    // background ring
    ctx.beginPath();
    ctx.arc(cx, cy, mid, 0, Math.PI * 2);
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = lw;
    ctx.stroke();
    // value arc
    var start = -Math.PI / 2;
    var end = start + (pct / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, mid, start, end);
    ctx.strokeStyle = primary;
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  /* ── TABS ── */
  function buildTabs() {
    var el = document.getElementById("dpmaTabs");
    if (!el) return;
    el.innerHTML = "";
    AXES.forEach(function (ax) {
      var btn = document.createElement("button");
      btn.className = "dpma-tab" + (activeTabs.has(ax) ? " active" : "");
      btn.innerHTML =
        '<span class="dpma-tab-dot"></span>' + AXES_SHORT[AXES.indexOf(ax)];
      btn.addEventListener("click", function () {
        if (activeTabs.has(ax)) {
          if (activeTabs.size > 1) activeTabs.delete(ax);
        } else {
          activeTabs.add(ax);
        }
        this.classList.toggle("active", activeTabs.has(ax));
        drawFullRadar();
      });
      el.appendChild(btn);
    });
  }

  /* ══════════════════════════════════════════
   SHOW RESULTS
   ══════════════════════════════════════════ */
  function showResults() {
    var finalLevel = Math.min.apply(
      null,
      answers.map(function (a) {
        return a || 1;
      }),
    );
    var lvl = LEVELS[finalLevel];

    document.getElementById("dpmaLvlNum").textContent = lvl.num;
    document.getElementById("dpmaLvlBadge").textContent = lvl.name;
    document.getElementById("dpmaMeans").textContent = lvl.desc;
    document.getElementById("dpmaDonutPct").textContent = lvl.pct + "%";

    var sorted = AXES.map(function (ax, i) {
      return { ax: ax, score: answers[i] || 1 };
    }).sort(function (a, b) {
      return a.score - b.score;
    });
    var lowest = sorted.filter(function (d) {
      return d.score <= 3;
    });
    var lowestEl = document.getElementById("dpmaLowest");
    lowestEl.innerHTML =
      lowest.length > 0
        ? lowest
            .map(function (d) {
              return "<li>" + d.ax + " (L" + d.score + ")</li>";
            })
            .join("")
        : "<li>None — all dimensions are strong!</li>";

    var strengths = sorted
      .filter(function (d) {
        return d.score >= 4;
      })
      .reverse();
    var sl = document.getElementById("dpmaStrengths");
    sl.innerHTML =
      strengths.length > 0
        ? strengths
            .map(function (s) {
              return "<li>" + s.ax + " (L" + s.score + ")</li>";
            })
            .join("")
        : "<li>No strengths yet — keep building!</li>";

    var weaknesses = sorted.filter(function (d) {
      return d.score <= 3;
    });
    var rhtml = "";
    if (weaknesses.length > 0) {
      rhtml =
        '<div class="dpma-recs-title">Recommendations to Advance Your Weakest Dimensions</div>';
      rhtml += '<div class="dpma-recs">';
      weaknesses.forEach(function (w) {
        var rec = RECS[w.ax] && RECS[w.ax][w.score];
        if (rec) {
          var stages = STAGE_NAMES[w.ax] || [];
          var fromStage = stages[w.score - 1] || "";
          var toStage = stages[w.score] || "";
          rhtml +=
            '<div class="dpma-rec"><div class="dpma-rec-dim">' +
            w.ax +
            ' <span class="dpma-rec-badge">L' +
            w.score +
            " (" + fromStage + ")" +
            " &rarr; L" +
            (w.score + 1) +
            " (" + toStage + ")" +
            '</span></div><div class="dpma-rec-text">' +
            rec +
            "</div></div>";
        }
      });
      rhtml += "</div>";
    }
    document.getElementById("dpmaRecs").innerHTML = rhtml;

    document.getElementById("dpma-questions").style.display = "none";
    document.getElementById("dpma-results").style.display = "block";
    var progressEl = document.querySelector(".dpma-progress");
    if (progressEl) progressEl.style.display = "none";
    var headEl = document.getElementById("assessment-head");
    if (headEl) headEl.style.display = "none";

    // push hash to URL without reload
    if (window.history && window.history.replaceState) {
      var url = new URL(window.location);
      url.searchParams.set("result", encodeAnswers(answers));
      window.history.replaceState({}, "", url);
    }

    activeTabs = new Set(AXES);
    buildTabs();
    setTimeout(function () {
      drawFullRadar();
      drawDonut(lvl.pct);
    }, 120);
  }

  /* ── RETAKE ── */
  function retake() {
    answers = new Array(TOTAL).fill(null);
    currentQ = 0;
    activeTabs = new Set(AXES);
    document.querySelectorAll(".dpma-qcard").forEach(function (card) {
      card.querySelectorAll(".dpma-opt").forEach(function (o) {
        o.classList.remove("selected");
      });
      var btn = card.querySelector(".dpma-btn-next");
      if (btn) btn.disabled = true;
    });
    document.getElementById("dpma-questions").style.display = "block";
    document.getElementById("dpma-results").style.display = "none";
    var progressEl = document.querySelector(".dpma-progress");
    if (progressEl) progressEl.style.display = "";
    var headEl = document.getElementById("assessment-head");
    if (headEl) headEl.style.display = "";
    showQuestion(0);
    updateProgress();
    if (window.history && window.history.replaceState) {
      var url = new URL(window.location);
      url.searchParams.delete("result");
      window.history.replaceState({}, "", url);
    }
  }

  /* ── SHAREABLE LINK ── */
  function getShareLink() {
    var url = new URL(window.location);
    url.searchParams.set("result", encodeAnswers(answers));
    return url.toString();
  }

  function copyLink() {
    var link = getShareLink();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(link)
        .then(function () {
          toast("Link copied to clipboard!");
        })
        .catch(function () {
          fallbackCopy(link);
        });
    } else {
      fallbackCopy(link);
    }
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      toast("Link copied to clipboard!");
    } catch (e) {
      toast("Could not copy — try manually");
    }
    document.body.removeChild(ta);
  }

  /* ══════════════════════════════════════════
   PDF — builds an HTML report in a new tab
   with the radar chart embedded as an image.
   User can print / Save-as-PDF from there.
   ══════════════════════════════════════════ */
  function downloadPDF() {
    var resultsEl = document.getElementById("dpma-results-inner");
    if (!resultsEl) {
      toast("No results to export");
      return;
    }
    toast("Generating report...");

    /* ── 1. High-res radar as data-URL ── */
    var radarW = 920,
      radarH = 840;
    var offCanvas = document.createElement("canvas");
    offCanvas.width = radarW;
    offCanvas.height = radarH;
    var offCtx = offCanvas.getContext("2d");
    offCtx.fillStyle = "#0A0A0A";
    offCtx.fillRect(0, 0, radarW, radarH);
    offCtx.scale(2, 2);
    var logW = radarW / 2,
      logH = radarH / 2;
    var R = Math.min(logW, logH) * 0.36;
    drawRadarCore(offCtx, logW, logH, R, {
      cyOffset: 10,
      labelPad: 34,
      labelSize: 14,
      dotSize: 6,
      lineW: 3,
      showLevelLabels: true,
      forceActiveLabels: true,
      activeCheck: function () {
        return true;
      },
      valFn: function (i) {
        return answers[i] || 0;
      },
    });
    var radarDataUrl = offCanvas.toDataURL("image/png");

    /* ── 2. Compute data ── */
    var finalLevel = Math.min.apply(
      null,
      answers.map(function (a) {
        return a || 1;
      }),
    );
    var lvl = LEVELS[finalLevel];
    var sorted = AXES.map(function (ax, i) {
      return { ax: ax, score: answers[i] || 1 };
    }).sort(function (a, b) {
      return a.score - b.score;
    });
    var lowest = sorted.filter(function (d) {
      return d.score <= 3;
    });
    var strengths = sorted
      .filter(function (d) {
        return d.score >= 4;
      })
      .reverse();
    var weaknesses = sorted.filter(function (d) {
      return d.score <= 3;
    });
    var shareLink = getShareLink();
    var dateStr = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    var retakeUrl = window.location.origin + window.location.pathname;

    /* ── 3. Donut as SVG ── */
    var donutPct = lvl.pct;
    var donutR = 42,
      donutStroke = 12;
    var donutCirc = 2 * Math.PI * donutR;
    var donutDash = (donutPct / 100) * donutCirc;
    var donutSvg =
      '<svg width="110" height="110" viewBox="0 0 110 110" style="display:block;margin:0 auto">' +
      '<circle cx="55" cy="55" r="' +
      donutR +
      '" fill="none" stroke="#2a2a2a" stroke-width="' +
      donutStroke +
      '"/>' +
      '<circle cx="55" cy="55" r="' +
      donutR +
      '" fill="none" stroke="#E8884A" stroke-width="' +
      donutStroke +
      '"' +
      ' stroke-linecap="round" stroke-dasharray="' +
      donutDash +
      " " +
      donutCirc +
      '" transform="rotate(-90 55 55)"/>' +
      '<text x="55" y="55" text-anchor="middle" dominant-baseline="central" fill="#F5F0EB"' +
      ' font-family="Georgia,serif" font-size="20">' +
      donutPct +
      "%</text></svg>";

    /* ── 4. Build dimension scores HTML ── */
    var scoresHtml = "";
    AXES.forEach(function (ax, i) {
      var s = answers[i] || 1;
      var pct = Math.round((s / 5) * 100);
      scoresHtml +=
        '<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #222">' +
        '<span style="flex:0 0 200px;font-size:13px;color:#B0A89E">' +
        ax +
        "</span>" +
        '<span style="flex:1;height:4px;background:#222;border-radius:2px;position:relative;overflow:hidden">' +
        '<span style="position:absolute;left:0;top:0;height:100%;width:' +
        pct +
        '%;background:#E8884A;border-radius:2px"></span></span>' +
        '<span style="flex:0 0 28px;font-size:12px;font-weight:700;color:#E8884A;text-align:right">L' +
        s +
        "</span></div>";
    });

    /* ── 5. Build strengths HTML ── */
    var strengthsHtml =
      strengths.length > 0
        ? strengths
            .map(function (s) {
              return (
                '<li style="font-size:13px;color:#B0A89E;line-height:1.6">' +
                s.ax +
                " (L" +
                s.score +
                ")</li>"
              );
            })
            .join("")
        : '<li style="font-size:13px;color:#B0A89E;line-height:1.6">No strengths yet — keep building!</li>';

    /* ── 6. Build recs HTML ── */
    var recsHtml = "";
    if (weaknesses.length > 0) {
      weaknesses.forEach(function (w) {
        var rec = RECS[w.ax] && RECS[w.ax][w.score];
        if (!rec) return;
        var stages = STAGE_NAMES[w.ax] || [];
        var fromStage = stages[w.score - 1] || "";
        var toStage = stages[w.score] || "";
        recsHtml +=
          '<div style="padding:14px 0;border-bottom:1px solid #222">' +
          '<div style="font-size:12px;font-weight:700;color:#E8884A;margin-bottom:4px;display:flex;align-items:center;gap:8px">' +
          w.ax +
          '<span style="background:rgba(232,136,74,.08);border:1px solid rgba(232,136,74,.18);color:#E8884A;font-size:9px;padding:2px 8px;letter-spacing:1px">L' +
          w.score +
          " (" + fromStage + ")" +
          " &rarr; L" +
          (w.score + 1) +
          " (" + toStage + ")" +
          "</span>" +
          "</div>" +
          '<div style="font-size:13px;color:#B0A89E;line-height:1.7">' +
          rec +
          "</div></div>";
      });
    }

    /* ── 7. Full HTML document ── */
    var html =
      '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">' +
      "<title>Data Product Maturity Assessment — Results</title>" +
      "<style>" +
      "*{margin:0;padding:0;box-sizing:border-box}" +
      'html,body{background:#0A0A0A;min-height:100%;color:#F5F0EB;font-family:"Century Gothic",Verdana,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.5}' +
      ".wrap{max-width:720px;margin:0 auto;padding:48px 32px 60px}" +
      "h1{font-family:Georgia,serif;font-size:36px;line-height:1.15;margin-bottom:6px}" +
      "h1 span{color:#E8884A}" +
      ".date{font-size:12px;color:#6B635C;margin-bottom:32px}" +
      ".divider{height:1px;background:#E8884A;margin-bottom:32px}" +
      ".level-row{display:flex;align-items:center;gap:20px;margin-bottom:32px}" +
      ".level-box{background:#161616;border:1px solid #222;padding:20px 28px;flex:1}" +
      ".level-num{font-family:Georgia,serif;font-size:16px;letter-spacing:2px;margin-bottom:8px}" +
      ".level-badge{background:#E8884A;color:#000;font-family:Georgia,serif;font-size:20px;font-weight:700;padding:8px 24px;display:inline-block}" +
      ".donut-wrap{flex:0 0 110px}" +
      ".radar-wrap{text-align:center;margin-bottom:32px}" +
      ".radar-wrap img{width:100%;max-width:460px;height:auto}" +
      ".section{margin-bottom:28px}" +
      ".section-title{font-family:Georgia,serif;font-size:16px;font-weight:700;margin-bottom:12px}" +
      ".means-box{background:#161616;border:1px solid #222;border-left:3px solid #E8884A;padding:18px 22px}" +
      ".means-box p{font-size:13px;color:#B0A89E;line-height:1.7}" +
      ".bd-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}" +
      ".bd-card{background:#161616;border:1px solid #222;padding:18px}" +
      ".bd-card-title{font-size:13px;font-weight:800;margin-bottom:10px}" +
      ".bd-lowest{list-style:disc;padding-left:18px;display:flex;flex-direction:column;gap:5px}" +
      ".bd-lowest li{font-size:12px;color:#B0A89E;line-height:1.45;font-weight:400}" +
      ".strengths{list-style:disc;padding-left:18px;display:flex;flex-direction:column;gap:5px}" +
      ".recs-box{background:#161616;border:1px solid #222;border-left:3px solid #E8884A;padding:20px}" +
      ".recs-title{font-size:14px;font-weight:800;margin-bottom:14px;letter-spacing:.5px}" +
      ".scores-box{background:#161616;border:1px solid #222;padding:20px}" +
      ".share-section{background:#161616;border:1px solid #222;padding:20px 22px;margin-top:32px}" +
      ".share-label{font-size:13px;color:#B0A89E;margin-bottom:6px}" +
      ".share-link{font-size:12px;color:#E8884A;word-break:break-all;text-decoration:none}" +
      ".share-link:hover{text-decoration:underline}" +
      ".branding{display:flex;align-items:center;gap:14px;margin-top:40px;padding-top:24px;border-top:1px solid #222}" +
      ".branding img{width:125px;height:43px;object-fit:contain}" +
      ".branding-text{font-size:11px;color:#6B635C;line-height:1.5}" +
      ".branding-text a{color:#E8884A;text-decoration:none}" +
      ".branding-text a:hover{text-decoration:underline}" +
      "@media print{body{background:#0A0A0A;-webkit-print-color-adjust:exact;print-color-adjust:exact}.wrap{padding:24px}}" +
      "@media(max-width:600px){.bd-grid{grid-template-columns:1fr}.level-row{flex-wrap:wrap}}" +
      '</style></head><body><div class="wrap">';

    /* Header */
    html += "<h1>Your Data Product Maturity <span>Assessment</span></h1>";
    html += '<div class="date">Generated ' + dateStr + "</div>";
    html += '<div class="divider"></div>';

    /* Level + Donut */
    html += '<div class="level-row"><div class="level-box">';
    html += '<div class="level-num">' + lvl.num + "</div>";
    html += '<div class="level-badge">' + lvl.name + "</div>";
    html += '</div><div class="donut-wrap">' + donutSvg + "</div></div>";

    /* What this means */
    html +=
      '<div class="section"><div class="section-title">What this means for your organisation</div>';
    html += '<div class="means-box"><p>' + lvl.desc + "</p></div></div>";

    /* Radar chart */
    html +=
      '<div class="radar-wrap"><img src="' +
      radarDataUrl +
      '" alt="Maturity Fingerprint Radar"></div>';

    /* Dimension scores */
    html +=
      '<div class="section"><div class="section-title">Dimension Scores</div>';
    html += '<div class="scores-box">' + scoresHtml + "</div></div>";

    /* Breakdown at a glance */
    html +=
      '<div class="section"><div class="section-title">Dimension breakdown at a glance</div>';
    html += '<div class="bd-grid">';
    html +=
      '<div class="bd-card"><div class="bd-card-title" style="color:#E8884A">Weakest Dimensions &#9888;&#65039;</div>';
    html +=
      '<ul class="bd-lowest">' +
      (lowest.length > 0
        ? lowest
            .map(function (d) {
              return "<li>" + d.ax + " (L" + d.score + ")</li>";
            })
            .join("")
        : "<li>None — all dimensions are strong!</li>") +
      "</ul></div>";
    html +=
      '<div class="bd-card"><div class="bd-card-title" style="color:#8BC34A">Your Strengths &#128170;</div>';
    html += '<ul class="strengths">' + strengthsHtml + "</ul></div>";
    html += "</div></div>";

    /* Recommendations */
    if (recsHtml) {
      html +=
        '<div class="section"><div class="section-title">Recommendations to Advance Your Weakest Dimensions</div>';
      html += '<div class="recs-box">' + recsHtml + "</div></div>";
    }

    /* Share link */
    html += '<div class="share-section">';
    html +=
      '<div class="share-label">View your results or retake the assessment at</div>';
    html +=
      '<a class="share-link" href="' +
      shareLink +
      '" target="_blank">' +
      shareLink +
      "</a>";
    html += "</div>";

    /* Branding */
    html += '<div class="branding">';
    html +=
      '<img src="https://cdn.prod.website-files.com/6538b3836b3dce952f05ff81/69c176b77aa84ff24e1ed1ec_MD101%20LOGO%20White%201.png" alt="Modern Data 101">';
    html += '<div class="branding-text">An initiative by Modern Data 101<br>';
    html +=
      '<a href="https://moderndata101.com/data-product-maturity" target="_blank">moderndata101.com/data-product-maturity</a></div>';
    html += "</div>";

    html += "</div>";

    /* Auto-download PDF script — loads html2canvas + jsPDF in the new tab */
    html +=
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"><\/script>';
    html +=
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"><\/script>';
    html += "<script>";
    html += 'window.addEventListener("load",function(){';
    html += "  setTimeout(function(){";
    html += '    var el=document.querySelector(".wrap");';
    html += '    var wrap=document.querySelector(".wrap");';
    html +=
      '    html2canvas(wrap,{backgroundColor:"#0A0A0A",scale:2,useCORS:true}).then(function(canvas){';
    html += '      var imgData=canvas.toDataURL("image/png");';
    html += "      var pw=210;";
    html += "      var scale=pw/wrap.offsetWidth;";
    html += "      var imgH=(canvas.height*pw)/canvas.width;";
    html += '      var pdf=new jspdf.jsPDF("p","mm",[pw,imgH]);';
    html += '      pdf.addImage(imgData,"PNG",0,0,pw,imgH);';
    html += '      var links=wrap.querySelectorAll("a[href]");';
    html += "      links.forEach(function(a){";
    html += "        var r=a.getBoundingClientRect();";
    html += "        var wr=wrap.getBoundingClientRect();";
    html += "        var x=(r.left-wr.left)*scale;";
    html += "        var y=(r.top-wr.top)*scale;";
    html += "        var w=r.width*scale;";
    html += "        var h=r.height*scale;";
    html += "        pdf.link(x,y,w,h,{url:a.href});";
    html += "      });";
    html += '      pdf.save("data-product-maturity-assessment.pdf");';
    html += "      setTimeout(function(){window.close()},600);";
    html += "    });";
    html += "  },400);";
    html += "});";
    html += "<\/script>";

    html += "</body></html>";

    /* ── 8. Open in new tab ── */
    var win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      toast("PDF will download shortly...");
    } else {
      toast("Pop-up blocked — please allow pop-ups and try again");
    }
  }

  /* ── TOAST ── */
  function toast(msg) {
    var t = document.getElementById("dpmaToast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
      t.classList.remove("show");
    }, 2800);
  }

  /* ── CHECK URL ── */
  function checkURLParams() {
    var params = new URLSearchParams(window.location.search);
    var code = params.get("result");
    if (!code) return false;
    var decoded = decodeAnswers(code);
    if (!decoded) return false;
    answers = decoded;
    return true;
  }

  /* ── INIT ── */
  function init() {
    buildQuestions();
    var hasResult = checkURLParams();
    if (hasResult) {
      showResults();
      setTimeout(function () {
        var el = document.querySelector(SCROLL_TARGET);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } else {
      showQuestion(0);
      updateProgress();
      refreshMiniRadars();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    retake: retake,
    copyLink: copyLink,
    downloadPDF: downloadPDF,
    encodeAnswers: encodeAnswers,
    decodeAnswers: decodeAnswers,
  };
})();
