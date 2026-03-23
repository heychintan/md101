/* ══════════════════════════════════════════════════════════
   DATA PRODUCT MATURITY ASSESSMENT — LOGIC v2
   Requires before this script:
   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
   ══════════════════════════════════════════════════════════ */
var DPMA=(function(){
"use strict";

/* ── DATA ── */
var AXES=['Definition & Scope','Ownership','Discoverability','Documentation','Quality','SLAs & Reliability','Governance','Consumption & Value','Reusability'];
var AXES_SHORT=['Definition','Ownership','Discovery','Docs','Quality','SLAs','Governance','Consumption','Reuse'];
var TOTAL=9;

var QUESTIONS=[
  {cat:'Dimension 1 — Definition & Scope',text:'How clearly is your data product defined — its purpose, boundaries, and the business problem it solves?',opts:[
    'No formal definition — the data product\'s scope is unclear or undefined',
    'Informally described but undocumented; only key individuals understand its scope',
    'Formally documented with clear purpose, business context, and intended consumers',
    'Well-defined with SLAs, versioning, and aligned to strategic objectives',
    'Continuously refined based on consumer feedback and business value metrics']},
  {cat:'Dimension 2 — Ownership',text:'How clearly are data product owners and their accountability defined within your organisation?',opts:[
    'No ownership — data is managed ad hoc by whoever is available',
    'Informal ownership exists but responsibilities are undocumented',
    'Ownership roles formally defined with documented responsibilities',
    'Owners accountable for quality, SLAs, and actively manage their products',
    'Ownership embedded in culture; owners drive cross-domain innovation']},
  {cat:'Dimension 3 — Discoverability',text:'How easily can data consumers find and access your data product through catalogs or marketplaces?',opts:[
    'No catalog — consumers must ask individuals to find data',
    'Basic inventory exists but metadata is sparse and hard to navigate',
    'Data catalog with rich metadata enables self-service discovery',
    'Data marketplace with ratings, SLAs, and lineage supports confident reuse',
    'AI-powered discovery proactively recommends data products to consumers']},
  {cat:'Dimension 4 — Documentation',text:'How complete and self-service is the documentation accompanying your data product?',opts:[
    'No documentation — consumers rely entirely on tribal knowledge',
    'Some documentation exists but is outdated or incomplete',
    'Consistent schema, lineage, and usage guidance maintained',
    'Rich self-service documentation enables consumers to onboard independently',
    'Living documentation auto-generated; consumers self-serve at scale']},
  {cat:'Dimension 5 — Quality',text:'To what extent does your organisation monitor and enforce data quality standards for this product?',opts:[
    'No monitoring — quality issues are discovered reactively by consumers',
    'Basic checks exist but are manual and inconsistently applied',
    'Standardized quality rules automated and applied consistently',
    'Proactive quality monitoring with SLAs, alerting, and trend analysis',
    'ML-driven anomaly detection and self-healing pipelines ensure continuous quality']},
  {cat:'Dimension 6 — SLAs & Reliability',text:'How well are service level agreements (SLAs) defined and enforced for your data product?',opts:[
    'No SLAs — availability and freshness are entirely unpredictable',
    'Informal expectations exist but are not formally agreed or tracked',
    'SLAs documented and tracked with regular reporting to stakeholders',
    'Automated SLA monitoring with alerts, escalation, and consumer notifications',
    'SLAs dynamically adjusted based on usage patterns and business criticality']},
  {cat:'Dimension 7 — Governance',text:'How mature is the governance framework — access controls, lineage, and compliance for your data product?',opts:[
    'No governance — data policies absent or unenforced',
    'Some policies exist but compliance is inconsistent',
    'Formal governance with documented policies enforced organization-wide',
    'Automated policy enforcement with auditable lineage and access controls',
    'Federated governance enabling domain autonomy within a global compliance framework']},
  {cat:'Dimension 8 — Consumption & Value Delivery',text:'How effectively is your data product consumed and does it demonstrably deliver business value?',opts:[
    'No consumption tracking — value delivery is unknown or unmeasured',
    'Some usage observed but no formal value measurement exists',
    'Usage metrics tracked and linked to defined business KPIs',
    'ROI modelled; data product prioritised based on demonstrated business value',
    'Data product drives competitive differentiation with continuously optimised value streams']},
  {cat:'Dimension 9 — Reusability & Interoperability',text:'How reusable and interoperable is your data product across different teams, domains, and systems?',opts:[
    'Built for one use case — tightly coupled and not reusable',
    'Occasionally reused but requires significant manual effort each time',
    'Standardised APIs and contracts enable reuse across multiple teams',
    'Semantic layer and common standards enable cross-domain composition',
    'Universal interoperability with automated schema evolution and zero-friction integration']}
];

var LEVELS={
  1:{num:'LEVEL 1',name:'Ad Hoc',pct:10,desc:'Reactive, unstructured approach. Data is a byproduct, not a product. No standards exist and delivery is inconsistent. Your weakest dimension is defining your overall maturity level.'},
  2:{num:'LEVEL 2',name:'Emerging',pct:20,desc:'Initial recognition of data as valuable. Basic practices exist but are inconsistent. Often point-to-point data delivery and use-case driven. Focus on the dimensions where you scored lowest.'},
  3:{num:'LEVEL 3',name:'Defined',pct:40,desc:'Standardized processes and clear ownership. Data products are intentionally designed with repeatable patterns. Strengthen weaker dimensions to reach the Managed level.'},
  4:{num:'LEVEL 4',name:'Managed',pct:60,desc:'Proactive management with monitoring and automation. Data products are strategic assets with measurable outcomes. Address remaining weak areas to achieve full Optimised status.'},
  5:{num:'LEVEL 5',name:'Optimised',pct:80,desc:'Continuous improvement and innovation. Data products drive competitive advantage and faster time-to-market. Maintain a culture of continuous innovation across all dimensions.'}
};

var RECS={
  'Definition & Scope':[null,
    'Start by informally documenting what data this product contains and who the intended consumers are. Hold a scoping session with key stakeholders.',
    'Formalise a data product charter — capture purpose, boundaries, owner, and consumer use cases in a shared document.',
    'Add versioning, SLA commitments, and link the product definition to strategic business objectives.',
    'Establish a feedback loop with consumers to continuously refine scope based on evolving business needs and usage analytics.'],
  'Ownership':[null,
    'Identify and informally assign a person responsible for this data product. Communicate this to relevant stakeholders.',
    'Formalise the ownership model — document roles, responsibilities, and escalation paths in your data governance wiki.',
    'Extend accountability to SLA performance and quality metrics. Establish regular owner reviews and data product health reports.',
    'Embed ownership in your team culture — include data product stewardship in job descriptions, OKRs, and hiring criteria.'],
  'Discoverability':[null,
    'Create a basic data inventory spreadsheet or wiki page listing available data products and their owners.',
    'Implement a data catalog (e.g. DataHub, Atlan, Collibra) and populate it with metadata, tags, and descriptions.',
    'Add usage ratings, SLA information, and lineage to your catalog. Enable consumer reviews and trusted-dataset badges.',
    'Integrate AI-powered search and proactive recommendations into your data catalog to surface relevant products automatically.'],
  'Documentation':[null,
    'Write a one-page summary covering the data product schema, source systems, and common use cases.',
    'Maintain a living data dictionary with field-level descriptions, lineage, and example queries updated per release.',
    'Build self-service onboarding guides so consumers can use the product without requiring direct support.',
    'Automate documentation generation from code and schema changes. Ensure documentation is always current and versioned.'],
  'Quality':[null,
    'Implement basic row-count and null-check validations. Create a simple issue log for quality incidents.',
    'Standardise quality rules in code and apply them automatically on every pipeline run. Publish a quality scorecard.',
    'Add proactive monitoring with alerting thresholds and trend analysis. Include quality metrics in your SLA commitments.',
    'Deploy ML-based anomaly detection and implement self-healing pipeline patterns that resolve common quality issues automatically.'],
  'SLAs & Reliability':[null,
    'Agree on informal expectations around data freshness and availability with key consumers. Write them down.',
    'Formalise SLA agreements — define freshness windows, uptime targets, and incident response times in a data contract.',
    'Automate SLA monitoring and build dashboards visible to consumers. Set up alerting and escalation for breaches.',
    'Implement dynamic SLA tiers based on consumer criticality. Use historical data to continuously optimise reliability commitments.'],
  'Governance':[null,
    'Identify which data in your product is sensitive (PII, financial) and apply basic access restrictions immediately.',
    'Document access policies and publish data lineage. Establish a review process for access requests.',
    'Automate policy enforcement using tools like Apache Ranger or your cloud IAM. Enable audit logging.',
    'Implement federated governance — empower domains to self-govern within a global policy framework with automated compliance checks.'],
  'Consumption & Value':[null,
    'Start tracking who is using your data product and for what purpose. A simple access log analysis is a good starting point.',
    'Define and measure KPIs tied to business outcomes enabled by this product. Share results with stakeholders quarterly.',
    'Build a consumption dashboard. Model ROI and use it to prioritise product investment and roadmap decisions.',
    'Establish a continuous value optimisation programme — use consumption analytics to proactively identify and monetise new use cases.'],
  'Reusability':[null,
    'Document which other teams or use cases could benefit from reusing this data product. Share proactively.',
    'Publish a stable API or standard output format that other teams can consume without needing custom pipelines.',
    'Adopt a semantic layer and common data contracts to enable cross-domain composition without tight coupling.',
    'Implement automated schema evolution with backward compatibility guarantees. Achieve zero-friction integration across all domains.']
};

/* ── STATE ── */
var answers=new Array(TOTAL).fill(null);
var currentQ=0;
var activeTabs=new Set(AXES);
var SHARE_BASE='https://www.moderndata101.com/maturity';

/* ══════════════════════════════════════════
   HiDPI CANVAS HELPER
   ══════════════════════════════════════════ */
function setupHiDPI(canvas,w,h){
  var dpr=window.devicePixelRatio||1;
  canvas.width=w*dpr;
  canvas.height=h*dpr;
  canvas.style.width=w+'px';
  canvas.style.height=h+'px';
  var ctx=canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  return ctx;
}

/* ── ENCODING / DECODING ── */
function encodeAnswers(ans){
  var num=0;
  for(var i=0;i<TOTAL;i++){num=num*5+(((ans[i]||1)-1))}
  return 'v1-'+num.toString(36);
}
function decodeAnswers(str){
  if(!str)return null;
  var parts=str.split('-');
  if(parts[0]!=='v1'||!parts[1])return null;
  var num=parseInt(parts[1],36);
  if(isNaN(num))return null;
  var ans=[];
  for(var i=TOTAL-1;i>=0;i--){ans[i]=(num%5)+1;num=Math.floor(num/5)}
  for(var j=0;j<TOTAL;j++){if(ans[j]<1||ans[j]>5)return null}
  return ans;
}

/* ══════════════════════════════════════════
   BUILD QUESTIONS
   ══════════════════════════════════════════ */
function buildQuestions(){
  var container=document.getElementById('dpma-questions');
  if(!container)return;
  var html='';
  QUESTIONS.forEach(function(q,qi){
    var isFirst=qi===0,isLast=qi===TOTAL-1;
    html+='<div class="dpma-qcard'+(isFirst?' active':'')+'" data-q="'+qi+'">';
    html+='<div class="dpma-qlayout"><div class="dpma-qcontent">';
    html+='<div class="dpma-qcat">'+q.cat+'</div>';
    html+='<div class="dpma-qnum">'+(qi+1<10?'0':'')+(qi+1)+' / 0'+TOTAL+'</div>';
    html+='<div class="dpma-qtext">'+q.text+'</div>';
    html+='<div class="dpma-options">';
    q.opts.forEach(function(o,oi){
      html+='<div class="dpma-opt" data-val="'+(oi+1)+'">';
      html+='<div class="dpma-opt-radio"></div>';
      html+='<span class="dpma-opt-score">L'+(oi+1)+'</span>';
      html+='<span class="dpma-opt-text">'+o+'</span></div>';
    });
    html+='</div>';
    html+='<div class="dpma-qnav">';
    html+='<button class="dpma-btn dpma-btn-prev"'+(isFirst?' disabled':'')+'>&#8592; Back</button>';
    html+='<button class="dpma-btn dpma-btn-next'+(isLast?' dpma-submit':'')+'" disabled>'+(isLast?'View Results &#8594;':'Next &#8594;')+'</button>';
    html+='</div></div>';
    html+='<div class="dpma-radar-panel"><div class="dpma-radar-label">Maturity Fingerprint</div>';
    html+='<canvas class="dpma-mini-radar" width="260" height="240"></canvas></div>';
    html+='</div></div>';
  });
  container.innerHTML=html;
  bindQuestionEvents();
}

/* ── BIND EVENTS ── */
function bindQuestionEvents(){
  var cards=document.querySelectorAll('.dpma-qcard');
  cards.forEach(function(card,qi){
    card.querySelectorAll('.dpma-opt').forEach(function(opt){
      opt.addEventListener('click',function(){
        card.querySelectorAll('.dpma-opt').forEach(function(o){o.classList.remove('selected')});
        this.classList.add('selected');
        answers[qi]=parseInt(this.getAttribute('data-val'));
        card.querySelector('.dpma-btn-next').disabled=false;
        updateProgress();
        refreshMiniRadars();
      });
    });
    card.querySelector('.dpma-btn-prev').addEventListener('click',function(){
      if(currentQ>0){currentQ--;showQuestion(currentQ)}
    });
    card.querySelector('.dpma-btn-next').addEventListener('click',function(){
      if(this.classList.contains('dpma-submit')){showResults()}
      else{currentQ++;showQuestion(currentQ)}
    });
  });
}

function showQuestion(idx){
  var cards=document.querySelectorAll('.dpma-qcard');
  cards.forEach(function(c){c.classList.remove('active')});
  cards[idx].classList.add('active');
  var card=cards[idx];
  card.querySelector('.dpma-btn-prev').disabled=(idx===0);
  card.querySelector('.dpma-btn-next').disabled=(answers[idx]===null);
  card.querySelectorAll('.dpma-opt').forEach(function(opt){
    var v=parseInt(opt.getAttribute('data-val'));
    opt.classList.toggle('selected',v===answers[idx]);
  });
  refreshMiniRadars();
  var el=document.getElementById('dpma');
  if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ── PROGRESS ── */
function updateProgress(){
  var done=answers.filter(function(a){return a!==null}).length;
  var pct=Math.round((done/TOTAL)*100);
  var fill=document.getElementById('dpmaFill');
  var pctEl=document.getElementById('dpmaPct');
  if(fill)fill.style.width=pct+'%';
  if(pctEl)pctEl.textContent=pct+'%';
}

/* ══════════════════════════════════════════
   RADAR DRAWING — SHARED CORE
   Draws onto a 2D context at logical size.
   ══════════════════════════════════════════ */
function getPrimary(){
  return getComputedStyle(document.documentElement).getPropertyValue('--md-primary').trim()||'#E8884A';
}

function drawRadarCore(ctx,W,H,R,opts){
  var cx=W/2,cy=H/2+opts.cyOffset;
  var N=TOTAL;
  var primary=getPrimary();
  var fontBody=getComputedStyle(document.documentElement).getPropertyValue('--md-font-body').trim()||'Century Gothic, Verdana, sans-serif';
  var labelSize=opts.labelSize||12;
  var dotSize=opts.dotSize||4;
  var lineW=opts.lineW||2;
  var showLevelLabels=opts.showLevelLabels||false;

  ctx.clearRect(0,0,W*2,H*2); // safe clear for HiDPI

  // Grid rings
  for(var l=1;l<=5;l++){
    var r=(R*l)/5;
    ctx.beginPath();
    for(var i=0;i<N;i++){
      var a=(2*Math.PI*i/N)-Math.PI/2;
      var x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle='rgba(255,255,255,.1)';
    ctx.lineWidth=1;
    ctx.stroke();

    if(showLevelLabels){
      ctx.fillStyle='rgba(255,255,255,.25)';
      ctx.font='600 10px '+fontBody;
      ctx.textAlign='center';
      ctx.fillText('L'+l,cx,cy-r+13);
    }
  }

  // Spokes
  for(var i=0;i<N;i++){
    var a=(2*Math.PI*i/N)-Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a));
    ctx.strokeStyle='rgba(255,255,255,.07)';
    ctx.lineWidth=1;
    ctx.setLineDash([4,4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Labels
  var labelR=R+opts.labelPad;
  for(var i=0;i<N;i++){
    var a=(2*Math.PI*i/N)-Math.PI/2;
    var lx=cx+labelR*Math.cos(a);
    var ly=cy+labelR*Math.sin(a);
    var isActive=opts.activeCheck?opts.activeCheck(i):true;
    var hasAnswer=answers[i]!==null;
    ctx.fillStyle=isActive?(hasAnswer||opts.forceActiveLabels?'rgba(245,240,235,.85)':'rgba(255,255,255,.25)'):'rgba(255,255,255,.2)';
    ctx.font='600 '+labelSize+'px '+fontBody;
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(AXES_SHORT[i],lx,ly);
  }

  // Data polygon
  var pts=[];
  for(var i=0;i<N;i++){
    var val=opts.valFn?opts.valFn(i):(answers[i]||0);
    var r2=(val/5)*R;
    var a=(2*Math.PI*i/N)-Math.PI/2;
    pts.push({x:cx+r2*Math.cos(a),y:cy+r2*Math.sin(a)});
  }
  ctx.beginPath();
  pts.forEach(function(p,i){i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)});
  ctx.closePath();
  ctx.fillStyle='rgba(200,90,25,.32)';
  ctx.fill();
  ctx.strokeStyle=primary;
  ctx.lineWidth=lineW;
  ctx.stroke();

  // Dots
  pts.forEach(function(p,i){
    var val=opts.valFn?opts.valFn(i):(answers[i]||0);
    if(val>0){
      ctx.beginPath();
      ctx.arc(p.x,p.y,dotSize,0,Math.PI*2);
      ctx.fillStyle=primary;
      ctx.fill();
    }
  });
}

/* ── MINI RADAR ── */
function drawMiniRadar(canvas){
  var cssW=260,cssH=240;
  var ctx=setupHiDPI(canvas,cssW,cssH);
  var R=Math.min(cssW,cssH)*.32;
  drawRadarCore(ctx,cssW,cssH,R,{
    cyOffset:6,
    labelPad:22,
    labelSize:9,
    dotSize:3.5,
    lineW:1.5,
    forceActiveLabels:false
  });
}

function refreshMiniRadars(){
  document.querySelectorAll('.dpma-mini-radar').forEach(function(c){drawMiniRadar(c)});
}

/* ── FULL RADAR (results) ── */
function drawFullRadar(){
  var canvas=document.getElementById('dpmaRadar');
  if(!canvas)return;
  var cssW=460,cssH=420;
  var ctx=setupHiDPI(canvas,cssW,cssH);
  var R=Math.min(cssW,cssH)*.36;
  drawRadarCore(ctx,cssW,cssH,R,{
    cyOffset:10,
    labelPad:32,
    labelSize:13,
    dotSize:5,
    lineW:2.5,
    showLevelLabels:true,
    forceActiveLabels:true,
    activeCheck:function(i){return activeTabs.has(AXES[i])},
    valFn:function(i){return activeTabs.has(AXES[i])?(answers[i]||0):0}
  });
}

/* ── DONUT ── */
function drawDonut(pct){
  var canvas=document.getElementById('dpmaDonut');
  if(!canvas)return;
  var cssW=110,cssH=110;
  var ctx=setupHiDPI(canvas,cssW,cssH);
  var cx=cssW/2,cy=cssH/2;
  var r=Math.min(cssW,cssH)*.42;
  var inner=r*.6;
  var mid=(r+inner)/2;
  var lw=r-inner;
  var primary=getPrimary();
  // background ring
  ctx.beginPath();ctx.arc(cx,cy,mid,0,Math.PI*2);
  ctx.strokeStyle='#2a2a2a';ctx.lineWidth=lw;ctx.stroke();
  // value arc
  var start=-Math.PI/2;
  var end=start+(pct/100)*Math.PI*2;
  ctx.beginPath();ctx.arc(cx,cy,mid,start,end);
  ctx.strokeStyle=primary;ctx.lineWidth=lw;ctx.lineCap='round';ctx.stroke();
}

/* ── TABS ── */
function buildTabs(){
  var el=document.getElementById('dpmaTabs');
  if(!el)return;
  el.innerHTML='';
  AXES.forEach(function(ax){
    var btn=document.createElement('button');
    btn.className='dpma-tab'+(activeTabs.has(ax)?' active':'');
    btn.innerHTML='<span class="dpma-tab-dot"></span>'+AXES_SHORT[AXES.indexOf(ax)];
    btn.addEventListener('click',function(){
      if(activeTabs.has(ax)){if(activeTabs.size>1)activeTabs.delete(ax)}else{activeTabs.add(ax)}
      this.classList.toggle('active',activeTabs.has(ax));
      drawFullRadar();
    });
    el.appendChild(btn);
  });
}

/* ══════════════════════════════════════════
   SHOW RESULTS
   ══════════════════════════════════════════ */
function showResults(){
  var finalLevel=Math.min.apply(null,answers.map(function(a){return a||1}));
  var lvl=LEVELS[finalLevel];

  document.getElementById('dpmaLvlNum').textContent=lvl.num;
  document.getElementById('dpmaLvlBadge').textContent=lvl.name;
  document.getElementById('dpmaMeans').textContent=lvl.desc;
  document.getElementById('dpmaDonutPct').textContent=lvl.pct+'%';

  var sorted=AXES.map(function(ax,i){return{ax:ax,score:answers[i]||1}}).sort(function(a,b){return a.score-b.score});
  document.getElementById('dpmaLowest').textContent=sorted[0].ax;

  var strengths=sorted.filter(function(d){return d.score>=4}).reverse();
  var sl=document.getElementById('dpmaStrengths');
  sl.innerHTML=strengths.length>0?strengths.map(function(s){return'<li>'+s.ax+' (L'+s.score+')</li>'}).join(''):'<li>No strengths yet — keep building!</li>';

  var weaknesses=sorted.filter(function(d){return d.score<=3});
  var rhtml='';
  if(weaknesses.length>0){
    rhtml='<div class="dpma-recs"><div class="dpma-recs-title">Recommendations to Advance Your Weakest Dimensions</div>';
    weaknesses.forEach(function(w){
      var rec=RECS[w.ax]&&RECS[w.ax][w.score];
      if(rec){
        rhtml+='<div class="dpma-rec"><div class="dpma-rec-dim">'+w.ax+' <span class="dpma-rec-badge">L'+w.score+' &rarr; L'+(w.score+1)+'</span></div><div class="dpma-rec-text">'+rec+'</div></div>';
      }
    });
    rhtml+='</div>';
  }
  document.getElementById('dpmaRecs').innerHTML=rhtml;

  document.getElementById('dpma-questions').style.display='none';
  document.getElementById('dpma-results').style.display='block';
  var fill=document.getElementById('dpmaFill');
  var pctEl=document.getElementById('dpmaPct');
  if(fill)fill.style.width='100%';
  if(pctEl)pctEl.textContent='100%';

  // push hash to URL without reload
  if(window.history&&window.history.replaceState){
    var url=new URL(window.location);
    url.searchParams.set('result',encodeAnswers(answers));
    window.history.replaceState({},'',url);
  }

  activeTabs=new Set(AXES);
  buildTabs();
  setTimeout(function(){drawFullRadar();drawDonut(lvl.pct)},120);

  var el=document.getElementById('dpma');
  if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ── RETAKE ── */
function retake(){
  answers=new Array(TOTAL).fill(null);
  currentQ=0;
  activeTabs=new Set(AXES);
  document.querySelectorAll('.dpma-qcard').forEach(function(card){
    card.querySelectorAll('.dpma-opt').forEach(function(o){o.classList.remove('selected')});
    var btn=card.querySelector('.dpma-btn-next');
    if(btn)btn.disabled=true;
  });
  document.getElementById('dpma-questions').style.display='block';
  document.getElementById('dpma-results').style.display='none';
  showQuestion(0);
  updateProgress();
  if(window.history&&window.history.replaceState){
    var url=new URL(window.location);
    url.searchParams.delete('result');
    window.history.replaceState({},'',url);
  }
}

/* ── SHAREABLE LINK ── */
function getShareLink(){return SHARE_BASE+'?result='+encodeAnswers(answers)}

function copyLink(){
  var link=getShareLink();
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(link).then(function(){toast('Link copied to clipboard!')}).catch(function(){fallbackCopy(link)});
  }else{fallbackCopy(link)}
}
function fallbackCopy(text){
  var ta=document.createElement('textarea');
  ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
  document.body.appendChild(ta);ta.select();
  try{document.execCommand('copy');toast('Link copied to clipboard!')}catch(e){toast('Could not copy — try manually')}
  document.body.removeChild(ta);
}

/* ══════════════════════════════════════════
   PDF — draws a dedicated high-res radar
   directly into the PDF for maximum quality
   ══════════════════════════════════════════ */
function downloadPDF(){
  var resultsEl=document.getElementById('dpma-results-inner');
  if(!resultsEl){toast('No results to export');return}
  toast('Generating PDF...');

  // Create an offscreen canvas at print resolution for the radar
  var radarW=920,radarH=840;
  var offCanvas=document.createElement('canvas');
  offCanvas.width=radarW;offCanvas.height=radarH;
  var offCtx=offCanvas.getContext('2d');
  offCtx.fillStyle='#0A0A0A';
  offCtx.fillRect(0,0,radarW,radarH);
  // Draw radar at 2x logical for crispness
  var logW=radarW/2,logH=radarH/2;
  offCtx.scale(2,2);
  var R=Math.min(logW,logH)*.36;
  drawRadarCore(offCtx,logW,logH,R,{
    cyOffset:10,
    labelPad:34,
    labelSize:14,
    dotSize:6,
    lineW:3,
    showLevelLabels:true,
    forceActiveLabels:true,
    activeCheck:function(){return true},
    valFn:function(i){return answers[i]||0}
  });

  // Build PDF
  try{
    var jsPDF=window.jspdf.jsPDF;
    var pdf=new jsPDF('p','mm','a4');
    var pw=pdf.internal.pageSize.getWidth();
    var ph=pdf.internal.pageSize.getHeight();
    var mx=16,y=16;

    // Background
    pdf.setFillColor(10,10,10);
    pdf.rect(0,0,pw,ph,'F');

    // Title
    pdf.setFont('helvetica','bold');
    pdf.setFontSize(22);
    pdf.setTextColor(245,240,235);
    pdf.text('Data Product Maturity Assessment',mx,y+6);
    y+=14;
    pdf.setFontSize(10);
    pdf.setTextColor(176,168,158);
    pdf.text('Generated '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})+' | moderndata101.com',mx,y);
    y+=6;

    // Orange divider
    pdf.setDrawColor(232,136,74);
    pdf.setLineWidth(0.6);
    pdf.line(mx,y,pw-mx,y);
    y+=10;

    // Level + Score
    var finalLevel=Math.min.apply(null,answers.map(function(a){return a||1}));
    var lvl=LEVELS[finalLevel];
    pdf.setFontSize(14);
    pdf.setTextColor(245,240,235);
    pdf.text(lvl.num,mx,y);
    y+=8;
    pdf.setFillColor(232,136,74);
    pdf.roundedRect(mx,y-4,pdf.getTextWidth(lvl.name)+12,10,1,1,'F');
    pdf.setTextColor(0,0,0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica','bold');
    pdf.text(lvl.name,mx+6,y+3);
    y+=14;

    // Means
    pdf.setTextColor(176,168,158);
    pdf.setFontSize(9);
    pdf.setFont('helvetica','normal');
    var meansLines=pdf.splitTextToSize(lvl.desc,pw-mx*2);
    pdf.text(meansLines,mx,y);
    y+=meansLines.length*4.5+8;

    // Radar image
    var radarImg=offCanvas.toDataURL('image/png');
    var radarDrawW=pw-mx*2;
    var radarDrawH=radarDrawW*(radarH/radarW);
    if(y+radarDrawH>ph-30){
      radarDrawH=ph-30-y;
      radarDrawW=radarDrawH*(radarW/radarH);
    }
    pdf.addImage(radarImg,'PNG',(pw-radarDrawW)/2,y,radarDrawW,radarDrawH);
    y+=radarDrawH+8;

    // Dimension scores table
    if(y+60<ph-20){
      pdf.setFontSize(10);
      pdf.setFont('helvetica','bold');
      pdf.setTextColor(245,240,235);
      pdf.text('Dimension Scores',mx,y);
      y+=6;
      AXES.forEach(function(ax,i){
        var score=answers[i]||1;
        pdf.setFontSize(9);
        pdf.setFont('helvetica','normal');
        pdf.setTextColor(176,168,158);
        pdf.text(ax,mx,y);
        pdf.setTextColor(232,136,74);
        pdf.setFont('helvetica','bold');
        pdf.text('L'+score,pw-mx-10,y);
        // score bar
        var barX=mx+80,barW=pw-mx*2-90,barH=2.5;
        pdf.setFillColor(34,34,34);
        pdf.rect(barX,y-2,barW,barH,'F');
        pdf.setFillColor(232,136,74);
        pdf.rect(barX,y-2,barW*(score/5),barH,'F');
        y+=7;
      });
      y+=6;
    }

    // Recommendations on page 2 if needed
    var weaknesses=AXES.map(function(ax,i){return{ax:ax,score:answers[i]||1}}).filter(function(d){return d.score<=3}).sort(function(a,b){return a.score-b.score});
    if(weaknesses.length>0){
      if(y+30>ph-20){pdf.addPage();pdf.setFillColor(10,10,10);pdf.rect(0,0,pw,ph,'F');y=16}
      pdf.setFontSize(10);pdf.setFont('helvetica','bold');pdf.setTextColor(245,240,235);
      pdf.text('Recommendations',mx,y);y+=7;
      weaknesses.forEach(function(w){
        var rec=RECS[w.ax]&&RECS[w.ax][w.score];
        if(!rec)return;
        if(y+16>ph-20){pdf.addPage();pdf.setFillColor(10,10,10);pdf.rect(0,0,pw,ph,'F');y=16}
        pdf.setFontSize(9);pdf.setFont('helvetica','bold');pdf.setTextColor(232,136,74);
        pdf.text(w.ax+' (L'+w.score+' \u2192 L'+(w.score+1)+')',mx,y);y+=4.5;
        pdf.setFont('helvetica','normal');pdf.setTextColor(176,168,158);
        var recLines=pdf.splitTextToSize(rec,pw-mx*2);
        pdf.text(recLines,mx,y);y+=recLines.length*4.2+6;
      });
    }

    // Footer on last page
    pdf.setFontSize(7);pdf.setTextColor(107,99,92);
    pdf.text('Share: '+getShareLink(),mx,ph-6);

    pdf.save('data-product-maturity-assessment.pdf');
    toast('PDF downloaded!');
  }catch(err){
    console.error('PDF generation failed:',err);
    toast('PDF generation failed — see console');
  }
}

/* ── TOAST ── */
function toast(msg){
  var t=document.getElementById('dpmaToast');
  if(!t)return;
  t.textContent=msg;t.classList.add('show');
  clearTimeout(t._timer);
  t._timer=setTimeout(function(){t.classList.remove('show')},2800);
}

/* ── CHECK URL ── */
function checkURLParams(){
  var params=new URLSearchParams(window.location.search);
  var code=params.get('result');
  if(!code)return false;
  var decoded=decodeAnswers(code);
  if(!decoded)return false;
  answers=decoded;
  return true;
}

/* ── INIT ── */
function init(){
  buildQuestions();
  var hasResult=checkURLParams();
  if(hasResult){
    showResults();
    setTimeout(function(){
      var el=document.getElementById('dpma');
      if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
    },300);
  }else{
    showQuestion(0);
    updateProgress();
    refreshMiniRadars();
  }
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
else{init()}

return{retake:retake,copyLink:copyLink,downloadPDF:downloadPDF,encodeAnswers:encodeAnswers,decodeAnswers:decodeAnswers};
})();
