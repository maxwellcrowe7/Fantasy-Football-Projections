const TEAMS = {
  AFC: {
    East: ["Buffalo Bills","Miami Dolphins","New England Patriots","New York Jets"],
    North: ["Baltimore Ravens","Cincinnati Bengals","Cleveland Browns","Pittsburgh Steelers"],
    South: ["Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Tennessee Titans"],
    West: ["Denver Broncos","Kansas City Chiefs","Las Vegas Raiders","Los Angeles Chargers"]
  },
  NFC: {
    East: ["Dallas Cowboys","New York Giants","Philadelphia Eagles","Washington Commanders"],
    North: ["Chicago Bears","Detroit Lions","Green Bay Packers","Minnesota Vikings"],
    South: ["Atlanta Falcons","Carolina Panthers","New Orleans Saints","Tampa Bay Buccaneers"],
    West: ["Arizona Cardinals","Los Angeles Rams","San Francisco 49ers","Seattle Seahawks"]
  }
};

// muted: resting bg (very pale tint)  |  vivid: hover bg (slightly more saturated)  |  border: active outline
const TEAM_COLORS = {
  "Buffalo Bills":           { muted:"#dde8f5", vivid:"#c0d4ee", border:"#4a6ea8" },
  "Miami Dolphins":          { muted:"#d0f0f0", vivid:"#a8e4e4", border:"#007a80" },
  "New England Patriots":    { muted:"#d8e4f0", vivid:"#b8cce0", border:"#003060" },
  "New York Jets":           { muted:"#d0eadc", vivid:"#b0d8c0", border:"#1a6040" },
  "Baltimore Ravens":        { muted:"#e0d8f0", vivid:"#c8b8e4", border:"#3a2870" },
  "Cincinnati Bengals":      { muted:"#fde0cc", vivid:"#f8c8a4", border:"#b04000" },
  "Cleveland Browns":        { muted:"#fde8cc", vivid:"#f8d0a0", border:"#884400" },
  "Pittsburgh Steelers":     { muted:"#faf0cc", vivid:"#f4e098", border:"#987800" },
  "Houston Texans":          { muted:"#d8e4f0", vivid:"#b8cce0", border:"#002840" },
  "Indianapolis Colts":      { muted:"#d8e4f4", vivid:"#b8cce8", border:"#003070" },
  "Jacksonville Jaguars":    { muted:"#ccece8", vivid:"#a8dcd4", border:"#006050" },
  "Tennessee Titans":        { muted:"#d4e0f0", vivid:"#b4c8e4", border:"#0c2c60" },
  "Denver Broncos":          { muted:"#fde0cc", vivid:"#f8c8a4", border:"#c04000" },
  "Kansas City Chiefs":      { muted:"#fad4d4", vivid:"#f4b0b0", border:"#a01020" },
  "Las Vegas Raiders":       { muted:"#e8e8e8", vivid:"#d4d4d4", border:"#606060" },
  "Los Angeles Chargers":    { muted:"#cce4f8", vivid:"#a8d4f4", border:"#0060a0" },
  "Dallas Cowboys":          { muted:"#d4e4f4", vivid:"#b4cce8", border:"#0030a0" },
  "New York Giants":         { muted:"#d8d8f0", vivid:"#b8b8e4", border:"#102070" },
  "Philadelphia Eagles":     { muted:"#cce0dc", vivid:"#a8d0c8", border:"#005060" },
  "Washington Commanders":   { muted:"#f0d8d8", vivid:"#e4b8b8", border:"#701010" },
  "Chicago Bears":           { muted:"#d4dce8", vivid:"#b8c8dc", border:"#0c2040" },
  "Detroit Lions":           { muted:"#cce0f4", vivid:"#a8d0f0", border:"#0058a0" },
  "Green Bay Packers":       { muted:"#d4ecd8", vivid:"#b4d8bc", border:"#205030" },
  "Minnesota Vikings":       { muted:"#e8d8f4", vivid:"#d4b8ec", border:"#4a2080" },
  "Atlanta Falcons":         { muted:"#f4d4d4", vivid:"#ecb4b4", border:"#901428" },
  "Carolina Panthers":       { muted:"#cce4f8", vivid:"#a8d4f4", border:"#0070b0" },
  "New Orleans Saints":      { muted:"#f0ecd8", vivid:"#e4d8b0", border:"#806030" },
  "Tampa Bay Buccaneers":    { muted:"#f4d4d4", vivid:"#ecb4b4", border:"#a00808" },
  "Arizona Cardinals":       { muted:"#f0d4dc", vivid:"#e4b4c0", border:"#801428" },
  "Los Angeles Rams":        { muted:"#dcd8f0", vivid:"#c4bce4", border:"#1a2880" },
  "San Francisco 49ers":     { muted:"#f4d4cc", vivid:"#ecb8ac", border:"#980000" },
  "Seattle Seahawks":        { muted:"#ccd8e8", vivid:"#a8c4dc", border:"#002244" },
};

const TEAM_CONF = {};
const TEAM_DIV = {};
for (const [conf, divs] of Object.entries(TEAMS)) {
  for (const [div, teams] of Object.entries(divs)) {
    teams.forEach(t => { TEAM_CONF[t] = conf; TEAM_DIV[t] = div; });
  }
}

// ─── Player stat view mode (global, persisted) ───
let projView = localStorage.getItem("ff_proj_view") || "pass";
function setProjView(v) {
  projView = v;
  localStorage.setItem("ff_proj_view", v);
  renderMain();
}

// Pass view: QB cols with derived stats inline after their group
const PASS_INPUT_COLS = [
  { key: "games",     label: "GP",     grp: "meta", pos: ["QB","RB","WR","TE","HYBRID"] },
  { key: "passAtt",  label: "Att",    grp: "pass", pos: ["QB","HYBRID"] },
  { key: "passComp", label: "Comp",   grp: "pass", pos: ["QB","HYBRID"] },
  { key: "compPct",  label: "Comp%",  grp: "pass", pos: ["QB","HYBRID"], derived: true },
  { key: "passYds",  label: "Yds",    grp: "pass", pos: ["QB","HYBRID"] },
  { key: "ypa",      label: "YPA",    grp: "pass", pos: ["QB","HYBRID"], derived: true },
  { key: "passTD",   label: "TD",     grp: "pass", pos: ["QB","HYBRID"] },
  { key: "tdPct",    label: "TD%",    grp: "pass", pos: ["QB","HYBRID"], derived: true },
  { key: "passInt",  label: "Int",    grp: "pass", pos: ["QB","HYBRID"] },
  { key: "intPct",   label: "Int%",   grp: "pass", pos: ["QB","HYBRID"], derived: true },
  { key: "rushAtt",  label: "Att",    grp: "rush", pos: ["HYBRID"] },
  { key: "rushYds",  label: "RYds",   grp: "rush", pos: ["HYBRID"] },
  { key: "rushTD",   label: "RTD",    grp: "rush", pos: ["HYBRID"] },
  { key: "ypc_rush", label: "YPC",  grp: "rush", pos: ["HYBRID"], derived: true },
];
const PASS_DERIVED_COLS = []; // now inline above

// Rush/Rec view: derived stats inline after their respective groups
const RUSHREC_INPUT_COLS = [
  { key: "games",     label: "GP",     grp: "meta", pos: ["QB","RB","WR","TE","HYBRID"] },
  { key: "rushAtt",   label: "Att",    grp: "rush", pos: ["QB","RB","WR","TE"] },
  { key: "rushYds",   label: "RYds",   grp: "rush", pos: ["QB","RB","WR","TE"] },
  { key: "rushTD",    label: "RTD",    grp: "rush", pos: ["QB","RB","WR","TE"] },
  { key: "ypc",       label: "YPC",    grp: "rush", pos: ["QB","RB","WR","TE"], derived: true },
  { key: "rushShare", label: "Ru.Sh%", grp: "rush", pos: ["QB","RB","WR","TE"], derived: true },
  { key: "targets",   label: "Tgt",    grp: "recv", pos: ["QB","WR","TE","RB"] },
  { key: "tgtShare",  label: "Tgt%",   grp: "recv", pos: ["QB","WR","TE","RB"], derived: true },
  { key: "rec",       label: "Rec",    grp: "recv", pos: ["QB","WR","TE","RB"] },
  { key: "catchPct",  label: "Catch%", grp: "recv", pos: ["QB","WR","TE","RB"], derived: true },
  { key: "recYds",    label: "Rec.Y",  grp: "recv", pos: ["QB","WR","TE","RB"] },
  { key: "ypr",       label: "Y/Tgt",  grp: "recv", pos: ["QB","WR","TE","RB"], derived: true },
  { key: "ypc_rec",   label: "Y/Rec",  grp: "recv", pos: ["QB","WR","TE","RB"], derived: true },
  { key: "recTD",     label: "Rec.TD", grp: "recv", pos: ["QB","WR","TE","RB"] },
];
const RUSHREC_DERIVED_COLS = []; // now inline above

// Legacy STAT_COLS kept for footer totals compatibility
const STAT_COLS = [
  { key: "passAtt",  label: "Att",    grp: "pass", pos: ["QB"] },
  { key: "passComp", label: "Comp",   grp: "pass", pos: ["QB"] },
  { key: "passYds",  label: "P.Yds",  grp: "pass", pos: ["QB"] },
  { key: "passTD",   label: "P.TD",   grp: "pass", pos: ["QB"] },
  { key: "passInt",  label: "Int",    grp: "pass", pos: ["QB"] },
  { key: "targets",  label: "Tgt",    grp: "recv", pos: ["WR","TE","RB"] },
  { key: "rec",      label: "Rec",    grp: "recv", pos: ["WR","TE","RB"] },
  { key: "recYds",   label: "Rec.Y",  grp: "recv", pos: ["WR","TE","RB"] },
  { key: "recTD",    label: "Rec.TD", grp: "recv", pos: ["WR","TE","RB"] },
  { key: "rushAtt",  label: "Att",    grp: "rush", pos: ["QB","RB","WR"] },
  { key: "rushYds",  label: "RYds",   grp: "rush", pos: ["QB","RB","WR"] },
  { key: "rushTD",   label: "RTD",  grp: "rush", pos: ["QB","RB","WR"] },
];

const TEAM_STAT_FIELDS = [
  // Play totals
  { key: "totalPlays",   label: "Total Plays",          group: "plays", span: 1 },
  { key: "passRate",     label: "Pass Play % / Rush Play %", group: "plays", span: 2, split: true },
  { key: "passPlays",    label: "Pass Plays",            group: "plays", span: 1 },
  { key: "rushPlays",    label: "Rush Plays",            group: "plays", span: 1 },
  // Passing
  { key: "targets",      label: "Targets",               group: "pass",  span: 1 },
  { key: "deadPassPlays",label: "Dead Plays",            group: "pass",  span: 1 },
  { key: "passAtt",      label: "Pass Attempts",         group: "pass",  span: 1 },
  { key: "sacks",        label: "Sacks",                 group: "pass",  span: 1 },
  { key: "passComp",     label: "Completions",           group: "pass",  span: 1 },
  { key: "compPct",      label: "COMP%",                 group: "pass",  span: 1, derived: true },
  { key: "passYds",      label: "Gross Pass Yards",      group: "pass",  span: 1 },
  { key: "yardsPerSack", label: "Yards/Sack",            group: "pass",  span: 1 },
  { key: "sackYds",      label: "Sack Yards",            group: "pass",  span: 1 },
  { key: "netPassYds",   label: "Net Pass Yards",        group: "pass",  span: 1, derived: true },
  { key: "passTD",       label: "Pass Touchdowns",       group: "pass",  span: 1 },
  { key: "passInt",      label: "Interceptions",         group: "pass",  span: 1 },
  { key: "tdPct",        label: "Touchdown%",           group: "pass",  span: 1, derived: true },
  { key: "intPct",       label: "Interception%",        group: "pass",  span: 1, derived: true },
  { key: "ypa",          label: "YPA",                   group: "pass",  span: 1, derived: true },
  // Target distribution
  { key: "tgtPct",       label: "Target%",              group: "tgt",   span: 1, derived: true },
  { key: "wrTgt",        label: "WR Targets",            group: "tgt",   span: 1 },
  { key: "wrTgtPct",     label: "WR TGT%",               group: "tgt",   span: 1, derived: true },
  { key: "teTgt",        label: "TE Targets",            group: "tgt",   span: 1 },
  { key: "teTgtPct",     label: "TE TGT%",               group: "tgt",   span: 1, derived: true },
  { key: "rbTgt",        label: "RB Targets",            group: "tgt",   span: 1 },
  { key: "rbTgtPct",     label: "RB TGT%",               group: "tgt",   span: 1, derived: true },
  // Rush
  { key: "rushAtt",      label: "Rush Attempts",         group: "rush",  span: 1, derived: true },
  { key: "rushYds",      label: "Rush Yards",            group: "rush",  span: 1 },
  { key: "ypc",          label: "YPC",                   group: "rush",  span: 1, derived: true },
  { key: "rushTD",       label: "Rush Touchdowns",       group: "rush",  span: 1 },
  // Summary
  { key: "grossTotalYds",label: "Gross Yards",           group: "summary", span: 1, derived: true },
  { key: "totalYds",     label: "Net Yards",             group: "summary", span: 1, derived: true },
  { key: "totalTD",      label: "TOTAL Touchdowns",      group: "summary", span: 1, derived: true },
  { key: "nyTD",         label: "Net Yards/Touchdown",   group: "summary", span: 1, derived: true },
];

const POSITIONS = ["QB","RB","WR","TE","K"];
const MISC_POSITIONS = ["QB","RB","WR","TE"];
const POS_ORDER = ["QB","RB","WR","TE","K"];

// team stat key that each player col maps to for delta comparison
const PLAYER_TO_TEAM = {
  passAtt:  "passAtt",
  passComp: "passComp",
  passYds:  "passYds",
  passTD:   "passTD",
  passInt:  "passInt",
  targets:  "targets",
  rec:      "passComp",
  recYds:   "passYds",
  recTD:    "passTD",
  rushAtt:  "rushAtt",
  rushYds:  "rushYds",
  ypc:      "ypc",
  rushTD:   "rushTD",
};

// Budget summary items
const BUDGET_ITEMS = [
  { label: "Pass yards",  playerCols: ["passYds","recYds"],  teamKey: "passYds" },
  { label: "Pass TDs",    playerCols: ["passTD","recTD"],    teamKey: "passTD" },
  { label: "Rush yards",  playerCols: ["rushYds"],           teamKey: "rushYds" },
  { label: "Rush TDs",    playerCols: ["rushTD"],            teamKey: "rushTD" },
];

const TEAM_ABBR = {
  "Buffalo Bills":"BUF","Miami Dolphins":"MIA","New England Patriots":"NE","New York Jets":"NYJ",
  "Baltimore Ravens":"BAL","Cincinnati Bengals":"CIN","Cleveland Browns":"CLE","Pittsburgh Steelers":"PIT",
  "Houston Texans":"HOU","Indianapolis Colts":"IND","Jacksonville Jaguars":"JAX","Tennessee Titans":"TEN",
  "Denver Broncos":"DEN","Kansas City Chiefs":"KC","Las Vegas Raiders":"LV","Los Angeles Chargers":"LAC",
  "Dallas Cowboys":"DAL","New York Giants":"NYG","Philadelphia Eagles":"PHI","Washington Commanders":"WSH",
  "Chicago Bears":"CHI","Detroit Lions":"DET","Green Bay Packers":"GB","Minnesota Vikings":"MIN",
  "Atlanta Falcons":"ATL","Carolina Panthers":"CAR","New Orleans Saints":"NO","Tampa Bay Buccaneers":"TB",
  "Arizona Cardinals":"ARI","Los Angeles Rams":"LAR","San Francisco 49ers":"SF","Seattle Seahawks":"SEA",
};

const TEAM_LOGOS = {
  "Buffalo Bills":"Bills","Miami Dolphins":"Dolphins","New England Patriots":"Patriots","New York Jets":"Jets",
  "Baltimore Ravens":"Ravens","Cincinnati Bengals":"Bengals","Cleveland Browns":"Browns","Pittsburgh Steelers":"Steelers",
  "Houston Texans":"Texans","Indianapolis Colts":"Colts","Jacksonville Jaguars":"Jaguars","Tennessee Titans":"Titans",
  "Denver Broncos":"Broncos","Kansas City Chiefs":"Chiefs","Las Vegas Raiders":"Raiders","Los Angeles Chargers":"Chargers",
  "Dallas Cowboys":"Cowboys","New York Giants":"Giants","Philadelphia Eagles":"Eagles","Washington Commanders":"Commanders",
  "Chicago Bears":"Bears","Detroit Lions":"Lions","Green Bay Packers":"Packers","Minnesota Vikings":"Vikings",
  "Atlanta Falcons":"Falcons","Carolina Panthers":"Panthers","New Orleans Saints":"Saints","Tampa Bay Buccaneers":"Buccaneers",
  "Arizona Cardinals":"Cardinals","Los Angeles Rams":"Rams","San Francisco 49ers":"49ers","Seattle Seahawks":"Seahawks",
};

// ─── Supabase ────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://vxykjkuqhtfrzfktymja.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eWtqa3VxaHRmcnpma3R5bWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzOTM0MjgsImV4cCI6MjA5ODk2OTQyOH0.zKoNEyWSIOLYMNbRRlLtj5OOX0oRdV7jJ_mD7ONZXKU';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const SB_APP = 'ff-projections';

let currentUser = null;
let sbSaveTimer = null;

function sbSave() {
  if (!currentUser) return;
  clearTimeout(sbSaveTimer);
  sbSaveTimer = setTimeout(async () => {
    const payload = buildFullPayload();
    await sb.from('app_state').upsert(
      { user_id: currentUser.id, app: SB_APP, data: payload, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,app' }
    );
  }, 2000);
}

function buildFullPayload() {
  const teamLocks = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('ff_locks_')) {
      try { teamLocks[k] = JSON.parse(localStorage.getItem(k) || '{}'); } catch(e) {}
    }
  }
  return {
    version: '2',
    state,
    selectedTeam,
    rankingsState:       JSON.parse(localStorage.getItem('ff_rankings_v1')         || '{}'),
    teamStatus:          JSON.parse(localStorage.getItem('ff_team_status')          || '{}'),
    colorOverrides:      JSON.parse(localStorage.getItem('ff_color_overrides')      || '{}'),
    draftState:          JSON.parse(localStorage.getItem('ff_draft_v1')             || 'null') || { leagues: [], activeLeague: 0 },
    scoringPresets:      JSON.parse(localStorage.getItem('ff_scoring_presets')      || 'null'),
    activeScoringPreset: localStorage.getItem('ff_active_scoring_preset') || '0',
    colDisplay:          JSON.parse(localStorage.getItem('ff_col_display')          || '{}'),
    teamLocks,
  };
}

function applyFullPayload(payload) {
  if (!payload.state) return false;
  state = payload.state;
  if (payload.selectedTeam !== undefined) selectedTeam = payload.selectedTeam;
  if (payload.rankingsState)               localStorage.setItem('ff_rankings_v1',         JSON.stringify(payload.rankingsState));
  if (payload.teamStatus)                  localStorage.setItem('ff_team_status',          JSON.stringify(payload.teamStatus));
  if (payload.colorOverrides)              localStorage.setItem('ff_color_overrides',      JSON.stringify(payload.colorOverrides));
  if (payload.draftState)                  localStorage.setItem('ff_draft_v1',             JSON.stringify(payload.draftState));
  if (payload.scoringPresets)              localStorage.setItem('ff_scoring_presets',      JSON.stringify(payload.scoringPresets));
  if (payload.activeScoringPreset !== undefined) localStorage.setItem('ff_active_scoring_preset', payload.activeScoringPreset);
  if (payload.colDisplay)                  localStorage.setItem('ff_col_display',          JSON.stringify(payload.colDisplay));
  if (payload.teamLocks) {
    Object.entries(payload.teamLocks).forEach(([k, v]) => {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
    });
  }
  return true;
}

async function loadFromSupabase() {
  const { data } = await sb.from('app_state').select('data').eq('app', SB_APP).single();
  if (data?.data && applyFullPayload(data.data)) return true;
  loadState(); // fall back to localStorage if no cloud data
  return false;
}

async function sendMagicLink() {
  const email = document.getElementById('login-email').value.trim();
  if (!email) return;
  const msg = document.getElementById('login-msg');
  msg.textContent = 'Sending…';
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } });
  msg.textContent = error ? error.message : `Check ${email} for your sign-in link.`;
}

async function signOut() {
  await sb.auth.signOut();
}

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-root').style.display = '';
}
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app-root').style.display = 'none';
}

async function initAuth() {
  // Hide app until we know auth state
  document.getElementById('app-root').style.display = 'none';

  sb.auth.onAuthStateChange(async (event, session) => {
    currentUser = session?.user || null;
    if (currentUser) {
      showApp();
      await loadFromSupabase();
      bootApp();
    } else {
      showLogin();
    }
  });

  const { data: { session } } = await sb.auth.getSession();
  if (!session) showLogin();
}
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "ff_projections_v1";
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, selectedTeam })); } catch(e) {}
  sbSave();
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.state) state = parsed.state;
    if (parsed.selectedTeam) selectedTeam = parsed.selectedTeam;
  } catch(e) {}
}

let state = {};
let selectedTeam = null;

// ─── Undo history ───
const MAX_UNDO = 30;
let undoStack = [];
let undoDebounceTimer = null;

function pushUndo(debounce = false) {
  if (debounce) {
    clearTimeout(undoDebounceTimer);
    undoDebounceTimer = setTimeout(() => {
      undoStack.push(JSON.stringify(state));
      if (undoStack.length > MAX_UNDO) undoStack.shift();
    }, 600);
  } else {
    clearTimeout(undoDebounceTimer);
    undoStack.push(JSON.stringify(state));
    if (undoStack.length > MAX_UNDO) undoStack.shift();
  }
}

function undo() {
  if (undoStack.length === 0) return;
  state = JSON.parse(undoStack.pop());
  saveState();
  renderMain();
  refreshSidebarDots();
}

document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    undo();
  }
});

const POS_PLURAL = { QB: "QBs", RB: "RBs", WR: "WRs", TE: "TEs" };

function miscName(pos, teamName) {
  const short = teamName.replace(/^.+ /, ""); // last word = nickname
  return `Other ${POS_PLURAL[pos] || pos} - ${short}`;
}

function tk(name) { return name.replace(/\s+/g, "_"); }

function ensureTeam(name) {
  const k = tk(name);
  if (!state[k]) {
    state[k] = { teamStats: {}, players: [], staging: [] };
    ["QB","RB","WR","TE"].forEach(pos => {
      state[k].players.push({
        id: `misc_${pos}_${k}`,
        name: miscName(pos, name),
        pos,
        misc: true,
        stats: { games: 17 }
      });
    });
  }
  if (!state[k].staging) state[k].staging = [];
  // Backfill games=17 and updated names for misc rows that predate these fields
  state[k].players.forEach(p => {
    if (p.misc) {
      if (p.stats.games === undefined || p.stats.games === "") p.stats.games = 17;
      // Update name if it's the old format "Other QB" → "Other QBs - Patriots"
      if (/^Other (QB|RB|WR|TE)$/.test(p.name)) p.name = miscName(p.pos, name);
    }
  });
  return state[k];
}

function hasData(name) {
  const k = tk(name);
  if (!state[k]) return false;
  const d = state[k];
  return Object.values(d.teamStats).some(v => v !== "" && v !== undefined) ||
         d.players.filter(p => !p.misc).length > 0;
}

function getTeamStatus(name) {
  try { return JSON.parse(localStorage.getItem("ff_team_status") || "{}")[name] || "none"; } catch(e) { return "none"; }
}
function setTeamStatus(name, status) {
  try {
    const s = JSON.parse(localStorage.getItem("ff_team_status") || "{}");
    s[name] = status;
    localStorage.setItem("ff_team_status", JSON.stringify(s));
  } catch(e) {}
}
function cycleTeamStatus(name) {
  const cycle = { none: "progress", progress: "done", done: "none" };
  setTeamStatus(name, cycle[getTeamStatus(name)]);
  refreshSidebarDots();
  // Refresh the pill in the header if this team is open
  const pill = document.querySelector(".team-status-pill");
  if (pill && selectedTeam === name) updateStatusPill(pill, name);
}
function updateStatusPill(pill, name) {
  const status = getTeamStatus(name);
  const titles = { none: "Not started — click to update", progress: "In progress — click to update", done: "Done — click to update" };
  pill.className = `team-status-pill status-${status}`;
  pill.title = titles[status];
  pill.innerHTML = `<span class="pill-dot"></span>`;
}

// ─── Team stat locks ───
function getTeamLocks(teamName) {
  try { return JSON.parse(localStorage.getItem(`ff_locks_${teamName}`) || "{}"); } catch(e) { return {}; }
}
function setTeamLock(teamName, key, locked) {
  const locks = getTeamLocks(teamName);
  if (locked) locks[key] = true; else delete locks[key];
  try { localStorage.setItem(`ff_locks_${teamName}`, JSON.stringify(locks)); } catch(e) {}
}
function isLocked(teamName, key) {
  return !!getTeamLocks(teamName)[key];
}

// ─── Team stat derived calculations ───
function calcTeamDerived(ts) {
  const d = {};
  const totalPlays = parseFloat(ts.totalPlays || 0);
  const passPlays  = parseFloat(ts.passPlays  || 0);
  const rushPlays  = parseFloat(ts.rushPlays  || 0);
  const passAtt    = parseFloat(ts.passAtt    || 0);
  const passComp   = parseFloat(ts.passComp   || 0);
  const passYds    = parseFloat(ts.passYds    || 0);
  const passTD     = parseFloat(ts.passTD     || 0);
  const sacks      = parseFloat(ts.sacks      || 0);
  const yps        = parseFloat(ts.yardsPerSack || 0);
  const rushYds    = parseFloat(ts.rushYds    || 0);
  const rushTD     = parseFloat(ts.rushTD     || 0);
  const targets    = parseFloat(ts.targets    || 0);
  const deadPlays  = parseFloat(ts.deadPassPlays || 0);

  if (totalPlays > 0) {
    d.passRate = ((passPlays / totalPlays) * 100).toFixed(1);
    d.rushRate = ((rushPlays / totalPlays) * 100).toFixed(1);
  }
  // deadPassPlays: derived only when passPlays, passAtt, sacks are all set as inputs
  if (ts.passPlays !== undefined && ts.passPlays !== "" &&
      ts.passAtt   !== undefined && ts.passAtt   !== "" &&
      ts.sacks     !== undefined && ts.sacks     !== "") {
    d.deadPassPlays = Math.round(passPlays - passAtt - sacks);
  }
  // targets: derived when passAtt and deadPassPlays are both inputs
  if (ts.passAtt !== undefined && ts.passAtt !== "" &&
      ts.deadPassPlays !== undefined && ts.deadPassPlays !== "") {
    d.targets = Math.round(passAtt - deadPlays);
  }
  if (passAtt > 0 && passComp > 0) d.compPct = ((passComp / passAtt) * 100).toFixed(1);
  if (sacks > 0 && yps > 0) d.sackYds = Math.round(sacks * yps);
  const sackYds = (sacks > 0 && yps > 0) ? Math.round(sacks * yps) : 0;
  if (passYds > 0) d.netPassYds = Math.round(passYds - sackYds);
  if (rushPlays > 0) d.ypc = (rushYds / rushPlays).toFixed(1);
  // Summary display stats
  if (passYds > 0 || rushYds > 0) d.totalYds = Math.round((passYds - sackYds) + rushYds);
  if (passTD > 0 || rushTD > 0) d.totalTD = Math.round(passTD + rushTD);

  // Rate stats
  const passAttVal = parseFloat(ts.passAtt || 0);
  const passTDVal  = parseFloat(ts.passTD  || 0);
  const passIntVal = parseFloat(ts.passInt || 0);
  const tgtsVal    = parseFloat(ts.targets || 0);
  if (passAttVal > 0) {
    if (passTDVal  > 0) d.tdPct  = ((passTDVal  / passAttVal) * 100).toFixed(1);
    if (passIntVal > 0) d.intPct = ((passIntVal / passAttVal) * 100).toFixed(1);
    if (passYds    > 0) d.ypa    = (passYds / passAttVal).toFixed(1);
  }
  if (tgtsVal > 0 && passAttVal > 0) d.tgtPct = ((tgtsVal / passAttVal) * 100).toFixed(1);

  // Target distribution
  const wrTgt = parseFloat(ts.wrTgt || 0);
  const teTgt = parseFloat(ts.teTgt || 0);
  const rbTgt = parseFloat(ts.rbTgt || 0);
  const tgtSum = wrTgt + teTgt + rbTgt;
  const tgtDenom = targets > 0 ? targets : tgtSum;
  if (tgtDenom > 0) {
    if (wrTgt > 0) d.wrTgtPct = ((wrTgt / tgtDenom) * 100).toFixed(1);
    if (teTgt > 0) d.teTgtPct = ((teTgt / tgtDenom) * 100).toFixed(1);
    if (rbTgt > 0) d.rbTgtPct = ((rbTgt / tgtDenom) * 100).toFixed(1);
  }

  // Rush attempts locked to rush plays
  const rushPlaysVal = parseFloat(ts.rushPlays || 0);
  if (rushPlaysVal > 0) d.rushAtt = rushPlaysVal;

  // Summary
  const rushYdsVal = parseFloat(ts.rushYds || 0);
  const rushTDVal  = parseFloat(ts.rushTD  || 0);
  if (passYds > 0 || rushYdsVal > 0) d.grossTotalYds = Math.round(passYds + rushYdsVal);
  const nyTDTotal = parseFloat(d.totalTD || (passTDVal + rushTDVal));
  if ((d.totalYds || 0) > 0 && nyTDTotal > 0) d.nyTD = Math.round(parseFloat(d.totalYds) / nyTDTotal);

  return d;
}

// ─── Team stat cascade ───
// Helper: when passPlays changes, propagate upward to totalPlays/passRate
function _cascadePassPlaysUp(ts, locks) {
  const passPlays = parseFloat(ts.passPlays || 0);
  const rushPlays = parseFloat(ts.rushPlays || 0);
  if (!locks.totalPlays) {
    ts.totalPlays = Math.round(passPlays + rushPlays);
    if (ts.totalPlays > 0 && !locks.passRate) {
      ts.passRate = ((passPlays / ts.totalPlays) * 100).toFixed(1);
      ts.rushRate = (100 - parseFloat(ts.passRate)).toFixed(1);
    }
  } else {
    const totalPlays = parseFloat(ts.totalPlays || 0);
    ts.rushPlays = totalPlays - passPlays;
    if (totalPlays > 0 && !locks.passRate) {
      ts.passRate = ((passPlays / totalPlays) * 100).toFixed(1);
      ts.rushRate = (100 - parseFloat(ts.passRate)).toFixed(1);
    }
  }
}

// Helper: when passAtt changes, cascade to passPlays (if sacks known) then upward
// Also resolves sacks sideways if passPlays is already known
function _cascadePassAttUp(ts, locks) {
  const passAtt   = parseFloat(ts.passAtt   || 0);
  const deadPlays = parseFloat(ts.deadPassPlays || 0);

  if (ts.sacks !== undefined && ts.sacks !== "" && !locks.passPlays) {
    // sacks known → compute passPlays and cascade up
    ts.passPlays = Math.round(passAtt + parseFloat(ts.sacks || 0));
    _cascadePassPlaysUp(ts, locks);
  } else if (ts.passPlays !== undefined && ts.passPlays !== "" && !locks.sacks) {
    // passPlays already known → resolve sacks sideways
    ts.sacks = Math.round(parseFloat(ts.passPlays || 0) - passAtt);
  }
  // Cascade down to targets if deadPassPlays is known, or derive deadPassPlays if targets known
  if (ts.deadPassPlays !== undefined && ts.deadPassPlays !== "" && !locks.targets) {
    ts.targets = Math.round(passAtt - deadPlays);
  } else if (ts.targets !== undefined && ts.targets !== "" && !locks.deadPassPlays) {
    ts.deadPassPlays = Math.round(passAtt - parseFloat(ts.targets || 0));
  }
}

function cascadeTeamStat(teamName, changedKey, newVal) {
  const data = ensureTeam(teamName);
  const ts = data.teamStats;
  const locks = getTeamLocks(teamName);

  ts[changedKey] = newVal === "" ? "" : parseFloat(newVal);
  ts._totalPlaysConflict = false;

  const v = parseFloat(newVal || 0);
  const totalPlays = parseFloat(ts.totalPlays || 0);
  const passPlays  = parseFloat(ts.passPlays  || 0);
  const rushPlays  = parseFloat(ts.rushPlays  || 0);

  // ── Tier 1: targets / deadPassPlays → passAtt ──
  if (changedKey === "targets") {
    if (ts.deadPassPlays !== undefined && ts.deadPassPlays !== "" && !locks.passAtt) {
      ts.passAtt = Math.round(v + parseFloat(ts.deadPassPlays || 0));
      _cascadePassAttUp(ts, locks);
    } else if (ts.passAtt !== undefined && ts.passAtt !== "" && !locks.deadPassPlays) {
      // passAtt locked/known → derive deadPassPlays
      ts.deadPassPlays = Math.round(parseFloat(ts.passAtt || 0) - v);
    }
    return;
  }
  if (changedKey === "deadPassPlays") {
    if (ts.targets !== undefined && ts.targets !== "" && !locks.passAtt) {
      ts.passAtt = Math.round(parseFloat(ts.targets || 0) + v);
      _cascadePassAttUp(ts, locks);
    } else if (ts.passAtt !== undefined && ts.passAtt !== "" && !locks.targets) {
      // passAtt locked/known → derive targets
      ts.targets = Math.round(parseFloat(ts.passAtt || 0) - v);
    }
    return;
  }

  // ── Tier 2: passAtt / sacks → passPlays ──
  if (changedKey === "passAtt") {
    _cascadePassAttUp(ts, locks);
    return;
  }
  if (changedKey === "sacks") {
    if (ts.passAtt !== undefined && ts.passAtt !== "" && !locks.passPlays) {
      ts.passPlays = Math.round(parseFloat(ts.passAtt || 0) + v);
      _cascadePassPlaysUp(ts, locks);
    } else if (ts.passPlays !== undefined && ts.passPlays !== "" && !locks.passAtt) {
      ts.passAtt = Math.round(parseFloat(ts.passPlays || 0) - v);
      const derivedAtt = parseFloat(ts.passAtt || 0);
      if (ts.deadPassPlays !== undefined && ts.deadPassPlays !== "" && !locks.targets) {
        ts.targets = Math.round(derivedAtt - parseFloat(ts.deadPassPlays || 0));
      } else if (ts.targets !== undefined && ts.targets !== "" && !locks.deadPassPlays) {
        ts.deadPassPlays = Math.round(derivedAtt - parseFloat(ts.targets || 0));
      }
    }
    // sack yards side-chain
    if (v > 0) {
      if (ts.yardsPerSack !== undefined && ts.yardsPerSack !== "" && !locks.sackYds)
        ts.sackYds = Math.round(v * parseFloat(ts.yardsPerSack || 0) * 10) / 10;
      else if (ts.sackYds !== undefined && ts.sackYds !== "" && !locks.yardsPerSack)
        ts.yardsPerSack = Math.round((parseFloat(ts.sackYds || 0) / v) * 10) / 10;
    }
    return;
  }
  if (changedKey === "sackYds") {
    if (ts.sacks !== undefined && ts.sacks !== "" && parseFloat(ts.sacks) > 0 && !locks.yardsPerSack)
      ts.yardsPerSack = Math.round((v / parseFloat(ts.sacks)) * 10) / 10;
    else if (ts.yardsPerSack !== undefined && ts.yardsPerSack !== "" && parseFloat(ts.yardsPerSack) > 0 && !locks.sacks)
      ts.sacks = Math.round(v / parseFloat(ts.yardsPerSack));
    return;
  }
  if (changedKey === "yardsPerSack") {
    if (ts.sacks !== undefined && ts.sacks !== "" && parseFloat(ts.sacks) > 0 && !locks.sackYds)
      ts.sackYds = Math.round(parseFloat(ts.sacks) * v * 10) / 10;
    else if (ts.sackYds !== undefined && ts.sackYds !== "" && v > 0 && !locks.sacks)
      ts.sacks = Math.round(parseFloat(ts.sackYds) / v);
    return;
  }

  if (changedKey === "passRate") {
    // rushRate is ALWAYS 100 - passRate, lock doesn't apply between these two
    ts.rushRate = (100 - v).toFixed(1);
    // update pass/rush plays if total plays is known
    if (totalPlays > 0 && !locks.passPlays) {
      ts.passPlays = Math.round(totalPlays * (v / 100));
      if (!locks.rushPlays) ts.rushPlays = totalPlays - ts.passPlays;
    }

  } else if (changedKey === "rushRate") {
    // passRate is ALWAYS 100 - rushRate, lock doesn't apply between these two
    ts.passRate = (100 - v).toFixed(1);
    if (totalPlays > 0 && !locks.rushPlays) {
      ts.rushPlays = Math.round(totalPlays * (v / 100));
      if (!locks.passPlays) ts.passPlays = totalPlays - ts.rushPlays;
    }

  } else if (changedKey === "passPlays") {
    // Upward: update totalPlays/rates
    if (!locks.totalPlays) {
      ts.totalPlays = Math.round(v + rushPlays);
      if (ts.totalPlays > 0 && !locks.passRate) {
        ts.passRate = ((v / ts.totalPlays) * 100).toFixed(1);
        ts.rushRate = (100 - parseFloat(ts.passRate)).toFixed(1);
      }
    } else {
      if (!locks.rushPlays) {
        ts.rushPlays = totalPlays - v;
        if (totalPlays > 0 && !locks.passRate) {
          ts.passRate = ((v / totalPlays) * 100).toFixed(1);
          ts.rushRate = (100 - parseFloat(ts.passRate)).toFixed(1);
        }
      }
    }
    // Downward: cascade to passAtt (if sacks known) then targets
    // Or resolve sacks sideways if passAtt is already known
    if (ts.sacks !== undefined && ts.sacks !== "" && !locks.passAtt) {
      ts.passAtt = Math.round(v - parseFloat(ts.sacks || 0));
      if (ts.deadPassPlays !== undefined && ts.deadPassPlays !== "" && !locks.targets) {
        ts.targets = Math.round(ts.passAtt - parseFloat(ts.deadPassPlays || 0));
      }
    } else if (ts.passAtt !== undefined && ts.passAtt !== "" && !locks.sacks) {
      ts.sacks = Math.round(v - parseFloat(ts.passAtt || 0));
    }

  } else if (changedKey === "rushPlays") {
    if (!locks.totalPlays) {
      ts.totalPlays = Math.round(passPlays + v);
      if (ts.totalPlays > 0 && !locks.passRate) {
        ts.passRate = ((passPlays / ts.totalPlays) * 100).toFixed(1);
        ts.rushRate = (100 - parseFloat(ts.passRate)).toFixed(1);
      }
    } else {
      if (!locks.passPlays) {
        ts.passPlays = totalPlays - v;
        if (totalPlays > 0 && !locks.passRate) {
          ts.passRate = ((ts.passPlays / totalPlays) * 100).toFixed(1);
          ts.rushRate = (100 - parseFloat(ts.passRate)).toFixed(1);
        }
        // Downward from recalculated passPlays
        if (ts.sacks !== undefined && ts.sacks !== "" && !locks.passAtt) {
          ts.passAtt = Math.round(ts.passPlays - parseFloat(ts.sacks || 0));
          if (ts.deadPassPlays !== undefined && ts.deadPassPlays !== "" && !locks.targets) {
            ts.targets = Math.round(ts.passAtt - parseFloat(ts.deadPassPlays || 0));
          }
        }
      }
    }

  } else if (changedKey === "totalPlays") {
    if (locks.passRate) {
      const rate = parseFloat(ts.passRate || 0);
      if (!locks.passPlays) ts.passPlays = Math.round(v * (rate / 100));
      if (!locks.rushPlays) ts.rushPlays = v - ts.passPlays;
      if (!locks.rushRate) ts.rushRate = (100 - rate).toFixed(1);
    } else if (locks.passPlays && !locks.rushPlays) {
      ts.rushPlays = Math.round(v - passPlays);
      if (!locks.passRate) {
        ts.passRate = ((passPlays / v) * 100).toFixed(1);
        ts.rushRate = (100 - parseFloat(ts.passRate)).toFixed(1);
      }
    } else if (locks.rushPlays && !locks.passPlays) {
      ts.passPlays = Math.round(v - rushPlays);
      if (!locks.passRate) {
        ts.passRate = ((ts.passPlays / v) * 100).toFixed(1);
        ts.rushRate = (100 - parseFloat(ts.passRate)).toFixed(1);
      }
    } else {
      ts._totalPlaysConflict = true;
      return;
    }
    // Downward from (possibly updated) passPlays
    const newPassPlays = parseFloat(ts.passPlays || 0);
    if (ts.sacks !== undefined && ts.sacks !== "" && !locks.passAtt) {
      ts.passAtt = Math.round(newPassPlays - parseFloat(ts.sacks || 0));
      if (ts.deadPassPlays !== undefined && ts.deadPassPlays !== "" && !locks.targets) {
        ts.targets = Math.round(ts.passAtt - parseFloat(ts.deadPassPlays || 0));
      }
    }
  } else if (["wrTgt","teTgt","rbTgt","tgtPct","wrTgtPct","teTgtPct","rbTgtPct"].includes(changedKey)) {
    _cascadeTargetGroup(ts, locks, changedKey, v);
  }

  // After any target change, also cascade to target group
  if (changedKey === "targets") {
    _cascadeTargetGroup(ts, locks, changedKey, v);
  }
}

function _cascadeTargetGroup(ts, locks, changedKey, v) {
  // Apply the changed value first
  if (changedKey !== "targets") ts[changedKey] = v;

  const tgt = parseFloat(ts.targets || 0);
  const wrK = ts.wrTgt !== undefined && ts.wrTgt !== "";
  const teK = ts.teTgt !== undefined && ts.teTgt !== "";
  const rbK = ts.rbTgt !== undefined && ts.rbTgt !== "";
  const wr  = wrK ? parseFloat(ts.wrTgt) : 0;
  const te  = teK ? parseFloat(ts.teTgt) : 0;
  const rb  = rbK ? parseFloat(ts.rbTgt) : 0;

  // If one positional is locked and total is known, adjust the third to maintain the total
  if (tgt > 0 && ["wrTgt","teTgt","rbTgt"].includes(changedKey)) {
    const posKeys = ["wrTgt","teTgt","rbTgt"];
    const lockedPos = posKeys.filter(k => locks[k]);
    const otherPos = posKeys.find(k => k !== changedKey && !locks[k]);
    if (lockedPos.length === 1 && otherPos) {
      const lockedVal = parseFloat(ts[lockedPos[0]] || 0);
      ts[otherPos] = Math.round(tgt - lockedVal - v);
    }
  }

  // Derive missing positional count when total + 2 positionals are known
  if (tgt > 0) {
    if (wrK && teK && !rbK && !locks.rbTgt) ts.rbTgt = Math.round(tgt - wr - te);
    if (wrK && rbK && !teK && !locks.teTgt) ts.teTgt = Math.round(tgt - wr - rb);
    if (teK && rbK && !wrK && !locks.wrTgt) ts.wrTgt = Math.round(tgt - te - rb);
  }

  // If all 3 positionals known, cascade up to total if not locked
  if (wrK && teK && rbK && !locks.targets) {
    ts.targets = Math.round(wr + te + rb);
  }

  // Recompute percentages from counts
  const total = parseFloat(ts.targets || 0);
  const wrF = parseFloat(ts.wrTgt || 0);
  const teF = parseFloat(ts.teTgt || 0);
  const rbF = parseFloat(ts.rbTgt || 0);
  if (total > 0) {
    if (!locks.wrTgtPct) ts.wrTgtPct = parseFloat((wrF / total * 100).toFixed(1));
    if (!locks.teTgtPct) ts.teTgtPct = parseFloat((teF / total * 100).toFixed(1));
    if (!locks.rbTgtPct) ts.rbTgtPct = parseFloat((rbF / total * 100).toFixed(1));
  }

  // If % changed, derive count from total
  if (["wrTgtPct","teTgtPct","rbTgtPct"].includes(changedKey) && total > 0) {
    if (changedKey === "wrTgtPct" && !locks.wrTgt) ts.wrTgt = Math.round(total * v / 100);
    if (changedKey === "teTgtPct" && !locks.teTgt) ts.teTgt = Math.round(total * v / 100);
    if (changedKey === "rbTgtPct" && !locks.rbTgt) ts.rbTgt = Math.round(total * v / 100);
  }
}

function buildSidebar() {
  const sb = document.getElementById("sidebar");
  let html = "";
  for (const conf of ["AFC","NFC"]) {
    const confColor = conf === "AFC" ? "#d04040" : "#4080c8";
    html += `<div class="conf-block" style="--conf-color:${confColor}"><div class="conf-label">${conf}</div>`;
    for (const div of ["East","North","South","West"]) {
      html += `<div class="div-block"><div class="div-label">${div}</div><div class="div-grid">`;
      for (const team of TEAMS[conf][div]) {
        const short = team.replace(/^.+ /, "");
        const c = TEAM_COLORS[team] || {};
        const style = c.muted ? `style="--tc-bar:${c.border}"` : "";
        html += `<button class="team-btn" data-team="${team}" ${style} onclick="selectTeam(this.dataset.team)"><span class="team-name">${short}</span><span class="dot"></span></button>`;
      }
      html += `</div></div>`;
    }
    html += `</div>`;
  }
  sb.innerHTML = html;
}

function refreshSidebarDots() {
  document.querySelectorAll(".team-btn").forEach(btn => {
    const status = getTeamStatus(btn.dataset.team);
    btn.classList.toggle("active", btn.dataset.team === selectedTeam);
    btn.classList.remove("status-none", "status-progress", "status-done");
    btn.classList.add(`status-${status}`);
  });
}

// ─── Team stats collapse ───
function toggleTeamStats(teamName) {
  teamStatsCollapsed[teamName] = !teamStatsCollapsed[teamName];
  localStorage.setItem("ff_ts_collapsed", JSON.stringify(teamStatsCollapsed));
  renderMain();
}

// ─── Historical stats panel ───
function openHistPanel(key) {
  if (!PROJ_TO_DATA[key]) return; // no data mapping
  histPanelKey = (histPanelKey === key) ? null : key; // toggle
  renderMain();
}

function buildHistPanel(teamName) {
  if (!histPanelKey || !PROJ_TO_DATA[histPanelKey]) return "";
  const dataCol = PROJ_TO_DATA[histPanelKey];

  // Find which group this key belongs to
  let groupKey = null;
  for (const [gk, keys] of Object.entries(PROJ_STAT_GROUPS)) {
    if (keys.includes(histPanelKey)) { groupKey = gk; break; }
  }
  const groupKeys = groupKey ? PROJ_STAT_GROUPS[groupKey] : [histPanelKey];

  // Get last 5 years of data for this team + league avg
  // selectedTeam is full name e.g. "Seattle Seahawks" — find matching abbr
  const teamAbbr = Object.entries(ABBR_TO_NICKNAME).find(([abbr, nick]) =>
    teamName.includes(nick)
  )?.[0];
  if (!teamAbbr) return "";

  const teamRows = HIST_DATA
    .filter(r => r.Team === teamAbbr && r.Year != null)
    .sort((a, b) => b.Year - a.Year)
    .slice(0, 5);
  const avgRows = HIST_DATA
    .filter(r => r.Team === "League AVG" && r.Year != null)
    .sort((a, b) => b.Year - a.Year)
    .slice(0, 5);

  if (teamRows.length === 0) return "";

  const years = teamRows.map(r => r.Year);

  // Build columns: the focal stat first, then rest of group
  const colKeys = [histPanelKey, ...groupKeys.filter(k => k !== histPanelKey)];
  const KEY_LABELS = { passRate: "Pass Play%", rushRate: "Rush Play%", rushAtt: "Rush Plays" };
  const colLabels = colKeys.map(k => {
    if (KEY_LABELS[k]) return KEY_LABELS[k];
    const f = TEAM_STAT_FIELDS.find(f => f.key === k);
    return f ? f.label : k;
  });

  function getVal(row, key) {
    const col = PROJ_TO_DATA[key];
    if (!col) return "—";
    const deriveFn = HIST_DERIVED[col];
    const v = deriveFn ? deriveFn(row) : row[col];
    if (v == null || v === "") return "—";
    return formatDataCell(v, col);
  }

  const headers = `<tr><th>Year</th>${colLabels.map((l,i) => `<th${i===0?' style="color:var(--accent)"':''}>${l}</th>`).join("")}</tr>`;

  const teamRowsHtml = teamRows.map(r =>
    `<tr><td>${r.Year}</td>${colKeys.map((k,i) => `<td${i===0?' class="hist-focal"':''}>${getVal(r,k)}</td>`).join("")}</tr>`
  ).join("");

  const avgRowsHtml = avgRows.map(r =>
    `<tr class="hist-avg"><td>Avg ${r.Year}</td>${colKeys.map((k,i) => `<td${i===0?' class="hist-focal"':''}>${getVal(r,k)}</td>`).join("")}</tr>`
  ).join("");

  const focalField = TEAM_STAT_FIELDS.find(f => f.key === histPanelKey);
  const title = focalField ? focalField.label : histPanelKey;

  return `<div class="hist-panel">
    <div class="hist-panel-header">
      <span class="hist-panel-title">${title} — Last 5 Years</span>
      <button class="hist-panel-close" onclick="openHistPanel('${histPanelKey}');event.stopPropagation()">✕</button>
    </div>
    <table class="hist-panel-table">
      <thead>${headers}</thead>
      <tbody>${teamRowsHtml}${avgRowsHtml}</tbody>
    </table>
  </div>`;
}

// ─── Reconcile team stats on load ───
// Fills in any unlocked cell that is fully determined by its neighbors,
// without triggering the full cascade (which would overwrite intentional values).
function reconcileTeamStats(teamName) {
  const data = ensureTeam(teamName);
  const ts = data.teamStats;
  const locks = getTeamLocks(teamName);
  let changed = true;
  // Iterate until stable (one pass may unlock the next)
  let guard = 0;
  while (changed && guard++ < 10) {
    changed = false;
    // Tier 1: targets + deadPassPlays = passAtt
    if (_hasVal(ts, "targets") && _hasVal(ts, "deadPassPlays") && !_hasVal(ts, "passAtt") && !locks.passAtt) {
      ts.passAtt = Math.round(parseFloat(ts.targets) + parseFloat(ts.deadPassPlays));
      changed = true;
    }
    if (_hasVal(ts, "passAtt") && _hasVal(ts, "deadPassPlays") && !_hasVal(ts, "targets") && !locks.targets) {
      ts.targets = Math.round(parseFloat(ts.passAtt) - parseFloat(ts.deadPassPlays));
      changed = true;
    }
    if (_hasVal(ts, "passAtt") && _hasVal(ts, "targets") && !_hasVal(ts, "deadPassPlays") && !locks.deadPassPlays) {
      ts.deadPassPlays = Math.round(parseFloat(ts.passAtt) - parseFloat(ts.targets));
      changed = true;
    }
    // Tier 2: passAtt + sacks = passPlays
    if (_hasVal(ts, "passAtt") && _hasVal(ts, "sacks") && !_hasVal(ts, "passPlays") && !locks.passPlays) {
      ts.passPlays = Math.round(parseFloat(ts.passAtt) + parseFloat(ts.sacks));
      changed = true;
    }
    if (_hasVal(ts, "passPlays") && _hasVal(ts, "sacks") && !_hasVal(ts, "passAtt") && !locks.passAtt) {
      ts.passAtt = Math.round(parseFloat(ts.passPlays) - parseFloat(ts.sacks));
      changed = true;
    }
    if (_hasVal(ts, "passPlays") && _hasVal(ts, "passAtt") && !_hasVal(ts, "sacks") && !locks.sacks) {
      ts.sacks = Math.round(parseFloat(ts.passPlays) - parseFloat(ts.passAtt));
      changed = true;
    }
    // Tier 3: passPlays + rushPlays = totalPlays
    if (_hasVal(ts, "passPlays") && _hasVal(ts, "rushPlays") && !_hasVal(ts, "totalPlays") && !locks.totalPlays) {
      ts.totalPlays = Math.round(parseFloat(ts.passPlays) + parseFloat(ts.rushPlays));
      changed = true;
    }
    if (_hasVal(ts, "totalPlays") && _hasVal(ts, "rushPlays") && !_hasVal(ts, "passPlays") && !locks.passPlays) {
      ts.passPlays = Math.round(parseFloat(ts.totalPlays) - parseFloat(ts.rushPlays));
      changed = true;
    }
    if (_hasVal(ts, "totalPlays") && _hasVal(ts, "passPlays") && !_hasVal(ts, "rushPlays") && !locks.rushPlays) {
      ts.rushPlays = Math.round(parseFloat(ts.totalPlays) - parseFloat(ts.passPlays));
      changed = true;
    }
  }
}

function selectTeam(name) {
  selectedTeam = name;
  histPanelKey = null;
  localStorage.setItem('ff_last_team', name);
  reconcileTeamStats(name);
  refreshSidebarDots();
  renderMain();
}

// ─── Main render ───

// ─── Stat cell drag order ───
// ─── Stat cell order ───
function getStatCellOrder(group, fields) {
  try {
    const saved = JSON.parse(localStorage.getItem('ff_stat_cell_order') || '{}');
    const order = saved[group];
    if (Array.isArray(order)) {
      const reordered = order.map(k => fields.find(f => f.key === k)).filter(Boolean);
      fields.forEach(f => { if (!reordered.find(r => r.key === f.key)) reordered.push(f); });
      return reordered;
    }
  } catch(e) {}
  return fields;
}

function saveStatCellOrder(group, keys) {
  try {
    const saved = JSON.parse(localStorage.getItem('ff_stat_cell_order') || '{}');
    saved[group] = keys;
    localStorage.setItem('ff_stat_cell_order', JSON.stringify(saved));
  } catch(e) {}
}

// Shim so drag code still compiles
function getStatCellPositions(group, fields) {
  return getStatCellOrder(group, fields).map(f => ({ field: f, col: 0 }));
}
function saveStatCellPositions(group, posMap) {}
function getEmptySlots(positions, dragField) { return []; }

let _tsDragKey = null, _tsDragGroup = null;
let _tsInsertIdx = null;
let _tsDropSlot = null;

function onTsCellDragStart(e, key, group) {
  _tsDragKey = key; _tsDragGroup = group; _tsInsertIdx = null; _tsDropSlot = null;
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => {
    const el = document.querySelector('.ts-cell[data-tskey="'+key+'"]');
    if (!el) return;
    el.classList.add('ts-dragging');
    const dragField = TEAM_STAT_FIELDS.find(f => f.key === key);
    if (!dragField) return;
    const grid = el.closest('.team-stats-grid');
    if (!grid) return;
    const fields = TEAM_STAT_FIELDS.filter(f => f.group === group);

    const emptySlots = getEmptySlots(positions, dragField);
    emptySlots.forEach(col => {
      const slot = document.createElement('div');
      slot.className = 'ts-empty-slot' + (dragField.half ? ' ts-half' : '');
      slot.style.gridColumn = col + ' / span ' + (dragField.span || 2);
      slot.dataset.slotCol = col;
      slot.addEventListener('dragover', ev => {
        ev.preventDefault(); ev.stopPropagation();
        document.querySelectorAll('.ts-empty-slot.ts-slot-hover').forEach(s => s.classList.remove('ts-slot-hover'));
        slot.classList.add('ts-slot-hover');
        hideInsertLine();
        _tsInsertIdx = null;
        _tsDropSlot = col;
      });
      slot.addEventListener('dragleave', () => slot.classList.remove('ts-slot-hover'));
      slot.addEventListener('drop', ev => {
        ev.preventDefault(); ev.stopPropagation();
        dropToSlot(group, key, col);
      });
      grid.appendChild(slot);
    });
  }, 0);
}

function onTsCellDragOver(e, el) {
  e.preventDefault();
}

function _tsDragOverHandler(e) {
  if (!_tsDragKey) return;
  e.preventDefault();

  // Find the grid belonging to this group
  const grids = document.querySelectorAll('.team-stats-grid');
  let activeGrid = null;
  for (const g of grids) {
    const r = g.getBoundingClientRect();
    // Extend hit area 80px to the right to catch dragging past last cell
    if (e.clientX >= r.left && e.clientX <= r.right + 80 && e.clientY >= r.top - 10 && e.clientY <= r.bottom + 10) {
      activeGrid = g; break;
    }
  }
  if (!activeGrid) { hideInsertLine(); return; }

  const cells = Array.from(activeGrid.querySelectorAll('.ts-cell[data-tskey]'))
    .filter(c => c.dataset.tskey !== _tsDragKey);
  if (!cells.length) { hideInsertLine(); return; }

  const mx = e.clientX;
  const my = e.clientY;

  // Find the row the mouse is closest to vertically, then find insert position within that row
  // Group cells by their vertical midpoint (row)
  const rowMap = new Map();
  cells.forEach((cell, i) => {
    const r = cell.getBoundingClientRect();
    const rowMid = Math.round(r.top + r.height / 2);
    // Bucket into rows with 10px tolerance
    let rowKey = null;
    for (const k of rowMap.keys()) {
      if (Math.abs(k - rowMid) < 10) { rowKey = k; break; }
    }
    if (rowKey === null) { rowKey = rowMid; rowMap.set(rowKey, []); }
    rowMap.get(rowKey).push({ cell, i });
  });

  // Find the closest row by vertical distance
  let closestRowKey = null, closestRowDist = Infinity;
  for (const k of rowMap.keys()) {
    const dist = Math.abs(k - my);
    if (dist < closestRowDist) { closestRowDist = dist; closestRowKey = k; }
  }
  const rowCells = rowMap.get(closestRowKey);

  // Within that row, find insert position by horizontal position
  let insertIdx = cells.length;
  // Default: after last cell in the row
  if (rowCells && rowCells.length > 0) {
    const lastInRow = rowCells[rowCells.length - 1];
    insertIdx = lastInRow.i + 1;
    for (const { cell, i } of rowCells) {
      const r = cell.getBoundingClientRect();
      if (mx < r.left + r.width / 2) { insertIdx = i; break; }
    }
  }
  _tsInsertIdx = insertIdx;

  let line = document.getElementById('ts-insert-line');
  if (!line) {
    line = document.createElement('div');
    line.id = 'ts-insert-line';
    line.className = 'ts-insert-line';
    document.body.appendChild(line);
  }

  let lineX, lineTop, lineHeight;
  if (insertIdx === 0) {
    const r = cells[0].getBoundingClientRect();
    lineX = r.left - 3; lineTop = r.top; lineHeight = r.height;
  } else if (insertIdx >= cells.length) {
    const r = cells[cells.length-1].getBoundingClientRect();
    lineX = r.right + 1; lineTop = r.top; lineHeight = r.height;
  } else {
    const rA = cells[insertIdx-1].getBoundingClientRect();
    const rB = cells[insertIdx].getBoundingClientRect();
    // If adjacent cells are on different rows, place line at end of rA's row
    if (Math.abs(rA.top - rB.top) > 10) {
      lineX = rA.right + 1; lineTop = rA.top; lineHeight = rA.height;
    } else {
      lineX = (rA.right + rB.left) / 2;
      lineTop = Math.min(rA.top, rB.top);
      lineHeight = Math.max(rA.height, rB.height);
    }
  }

  line.style.left = lineX + 'px';
  line.style.top = (lineTop + window.scrollY) + 'px';
  line.style.height = lineHeight + 'px';
  line.classList.add('visible');
}

document.addEventListener('dragover', _tsDragOverHandler);

function dropToSlot(group, key, col) { /* no-op in pack mode */ }

function dropInsert(group, key, insertIdx) {
  const fields = TEAM_STAT_FIELDS.filter(f => f.group === group);
  const ordered = getStatCellOrder(group, fields);
  const srcIdx = ordered.findIndex(f => f.key === key);
  if (srcIdx === -1) { onTsCellDragEnd(); return; }
  const [moved] = ordered.splice(srcIdx, 1);
  const tgtIdx = Math.max(0, Math.min(insertIdx, ordered.length));
  ordered.splice(tgtIdx, 0, moved);
  saveStatCellOrder(group, ordered.map(f => f.key));
  renderMain();
}

function onTsCellDrop(e, targetKey, group) {
  e.preventDefault();
  hideInsertLine();
  const grp = group || _tsDragGroup;
  if (!_tsDragKey || !grp) { onTsCellDragEnd(); return; }
  if (_tsDropSlot !== null) {
    dropToSlot(grp, _tsDragKey, _tsDropSlot);
  } else if (_tsInsertIdx !== null) {
    dropInsert(grp, _tsDragKey, _tsInsertIdx);
  }
  onTsCellDragEnd();
}

function hideInsertLine() {
  const line = document.getElementById('ts-insert-line');
  if (line) { line.classList.remove('visible'); }
}

function onTsCellDragEnd() {
  hideInsertLine();
  document.querySelectorAll('.ts-cell.ts-dragging').forEach(c => c.classList.remove('ts-dragging'));
  document.querySelectorAll('.ts-empty-slot').forEach(s => s.remove());
  _tsDragKey = null; _tsDragGroup = null; _tsInsertIdx = null; _tsDropSlot = null;
}

function renderMain() {
  if (!selectedTeam) return;
  const data = ensureTeam(selectedTeam);
  const main = document.getElementById("main");

  const locks = getTeamLocks(selectedTeam);
  const constrained = getComputedLocks(selectedTeam);
  const derived = calcTeamDerived(data.teamStats);
  const conflict = data.teamStats._totalPlaysConflict;

  const groups = [
    { key: "plays",   label: "Play Totals" },
    { key: "pass",    label: "Passing" },
    { key: "tgt",     label: "Target Distribution" },
    { key: "rush",    label: "Rushing" },
    { key: "summary", label: "Summary" },
  ];

  const leftGroups  = ["plays", "pass"];
  const rightGroups = ["tgt", "rush", "summary"];

  function renderTsGroup(grp) {
    const fields = getStatCellOrder(grp.key, TEAM_STAT_FIELDS.filter(f => f.group === grp.key));
    let html = `<div class="team-stats-grid ts-group-${grp.key}" ondragover="onTsCellDragOver(event,this)" ondrop="onTsCellDrop(event,'','${grp.key}')">`;
      html += fields.map(f => {
      const isDerived = !!f.derived;
      const isLock = !!locks[f.key];
      const isConflict = conflict && (f.key === "passPlays" || f.key === "rushPlays");

      // Split field — pass/rush rates in one cell
      if (f.split) {
        const passVal = data.teamStats.passRate !== undefined ? parseFloat(data.teamStats.passRate).toFixed(1) : "";
        const rushVal = data.teamStats.rushRate !== undefined ? parseFloat(data.teamStats.rushRate).toFixed(1) :
                        (passVal !== "" ? (100 - parseFloat(passVal)).toFixed(1) : "");
        const cls = ["ts-cell", "ts-split", isLock ? "ts-locked" : ""].filter(Boolean).join(" ");
        const lockBtn = `<span class="ts-lock-icon" title="${isLock ? 'Unlock' : 'Lock'}" onclick="toggleTeamLock('passRate');event.stopPropagation()">${isLock ? `<i data-lucide="lock" style="width:15px;height:15px;display:inline-block;vertical-align:middle;stroke-width:2;"></i>` : `${isLock ? '<i data-lucide="lock" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i>' : '<i data-lucide="lock-open" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i>'}`}</span>`;
        return `<div class="${cls}" data-tskey="${f.key}" draggable="true" style="grid-column:span ${f.span||2}" ondragstart="onTsCellDragStart(event,'${f.key}','${grp.key}')" ondragover="onTsCellDragOver(event,this)" ondrop="onTsCellDrop(event,'${f.key}','${grp.key}')" ondragend="onTsCellDragEnd()">
          <label onclick="openHistPanel('${f.key}');event.stopPropagation()" style="cursor:pointer;" title="View history">${f.label}${lockBtn}</label>
          <div style="text-align:center;"><div style="display:inline-flex;align-items:center;gap:0;font-family:var(--font-mono);font-size:13px;">
            <button onmousedown="event.preventDefault();nudgeSplit(0.1)" style="background:none;border:none;cursor:pointer;color:var(--text-3);font-size:11px;padding:0 2px 0 0;line-height:1;" title="More pass">◀</button>
            <input type="text" inputmode="decimal" placeholder="—"
              style="width:32px;flex-shrink:0;background:none;border:none;outline:none;font-family:var(--font-mono);font-size:13px;font-weight:500;color:var(--text);padding:0;text-align:right;"
              value="${passVal}"
              oninput="onSplitInput('passRate',this.value)"
              onblur="formatSplitInput(this,'passRate')">
            <span style="color:var(--text-3);font-size:11px;padding:0 3px;">/</span>
            <input type="text" inputmode="decimal" placeholder="—"
              style="width:32px;flex-shrink:0;background:none;border:none;outline:none;font-family:var(--font-mono);font-size:13px;font-weight:500;color:var(--text);padding:0;text-align:left;"
              value="${rushVal}"
              oninput="onSplitInput('rushRate',this.value)"
              onblur="formatSplitInput(this,'rushRate')">
            <button onmousedown="event.preventDefault();nudgeSplit(-0.1)" style="background:none;border:none;cursor:pointer;color:var(--text-3);font-size:11px;padding:0 0 0 2px;line-height:1;" title="More rush">▶</button>
          </div></div>
        </div>`;
      }
      const val = isDerived
        ? (derived[f.key] !== undefined ? derived[f.key] : "")
        : (data.teamStats[f.key] !== undefined ? data.teamStats[f.key] : "");
      const cls = [
        "ts-cell",
        isDerived ? "ts-derived" : "",
        f.span === 1 ? "ts-half" : "",
        isLock ? "ts-locked" : "",
        !isLock && constrained[f.key] ? "ts-constrained" : "",
        isConflict ? "ts-conflict" : "",
        histPanelKey === f.key ? "ts-hist-active" : "",
      ].filter(Boolean).join(" ");
      const expected = !isLock && constrained[f.key] ? getExpectedValue(f.key, data.teamStats) : null;
      const isErroneous = expected !== null && parseFloat(val) !== expected;
      const hintHtml = isErroneous ? `<div class="ts-expected">expected: ${expected}</div>` : "";
      const finalCls = isErroneous ? cls + " ts-erroneous" : cls;
      const lockBtn = !isDerived ? `<span class="ts-lock-icon" title="${isLock ? 'Unlock' : 'Lock'}" onclick="toggleTeamLock('${f.key}');event.stopPropagation()">
        ${isLock ? `<i data-lucide="lock" style="width:15px;height:15px;display:inline-block;vertical-align:middle;stroke-width:2;"></i>` : `${isLock ? '<i data-lucide="lock" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i>' : '<i data-lucide="lock-open" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i>'}`}</span>` : "";
      const spinnerHtml = !isDerived ? `<div class="ts-spinner">
          <button onmousedown="event.preventDefault();tsCellStep('${f.key}',1)" tabindex="-1">▲</button>
          <button onmousedown="event.preventDefault();tsCellStep('${f.key}',-1)" tabindex="-1">▼</button>
        </div>` : "";
      return `<div class="${finalCls}" data-tskey="${f.key}" draggable="true" style="grid-column:span ${f.span||2}" ondragstart="onTsCellDragStart(event,'${f.key}','${grp.key}')" ondragover="onTsCellDragOver(event,this)" ondrop="onTsCellDrop(event,'${f.key}','${grp.key}')" ondragend="onTsCellDragEnd()">
        <label onclick="openHistPanel('${f.key}');event.stopPropagation()" style="cursor:pointer;" title="View history">${f.label}${lockBtn}</label>
        <div class="ts-cell-body">
          <input type="number" min="0" placeholder="—"
            value="${val}"
            ${isDerived ? "readonly tabindex='-1'" : ""}
            oninput="onTeamStat('${f.key}', this.value)">
          ${spinnerHtml}
        </div>
        ${hintHtml}
      </div>`;
    }).join("") + '</div>';
    return html;
  }

  let tsHtml = `<div class="team-stats-grid-wrap">`;
  tsHtml += `<div class="ts-col-left">`;
  leftGroups.forEach(gKey => {
    const grp = groups.find(g => g.key === gKey);
    if (grp) tsHtml += renderTsGroup(grp);
  });
  tsHtml += `</div>`;
  tsHtml += `<div class="ts-col-right">`;
  rightGroups.forEach(gKey => {
    const grp = groups.find(g => g.key === gKey);
    if (grp) tsHtml += renderTsGroup(grp);
  });
  tsHtml += `</div>`;
  tsHtml += `</div>`;

  const isPass = projView === "pass";
  const cols = getOrderedCols(projView);
  const visiblePos = isPass ? ["QB","HYBRID"] : ["QB","RB","WR","TE"];

  // Filter out columns not applicable to any visible position
  // Filter cols to those needed by actual player positions (exclude HYBRID which is a col-group marker)
  const actualVisiblePos = visiblePos.filter(p => p !== "HYBRID");
  const visibleCols = cols.filter(c => !c.pos || c.pos.some(p => actualVisiblePos.includes(p)));

  const colHeaders = visibleCols.map((c, i) =>
    `<th class="col-draggable grp-${c.grp||'pass'}"
      draggable="true"
      ondragstart="onColDragStart(event,${i})"
      ondragover="onColDragOver(event,this,${i})"
      ondragleave="onColDragLeave()"
      ondrop="onColDrop(event,${i})"
      ondragend="onColDragEnd()"
    >${playerColLabel(c)}</th>`
  ).join("");

  const playerRows = buildGroupedPlayerRows(data, visiblePos, visibleCols, []);
  const teamColor = getTeamColor(selectedTeam);
  const logoFile = TEAM_LOGOS[selectedTeam];
  const logoHtml = logoFile ? `<img class="team-logo" src="Football logos/${logoFile}.png" alt="" 
    onload="autoCropLogo(this)" 
    onerror="this.style.display='none'"
    id="team-logo-img">` : "";

  const status = getTeamStatus(selectedTeam);
  const statusTitles = { none: "Not started — click to update", progress: "In progress — click to update", done: "Done — click to update" };

  main.innerHTML = `
    <div class="team-view">
      <div class="team-title-row">
        ${logoHtml}
        <div>
          <div class="team-title">${selectedTeam}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
            <span class="team-conf-badge">${TEAM_CONF[selectedTeam]} ${TEAM_DIV[selectedTeam]}</span>
            <button class="team-status-pill status-${status}" onclick="cycleTeamStatus('${selectedTeam}')" title="${statusTitles[status]}">
              <span class="pill-dot"></span>
            </button>
          </div>
        </div>
      </div>
      <div class="team-color-bar" style="background:${teamColor}"></div>

      <div class="section-title" onclick="toggleTeamStats('${selectedTeam}')" style="cursor:pointer;user-select:none;display:flex;align-items:center;gap:6px;">
        <span style="font-size:10px;color:var(--text-3);">${teamStatsCollapsed[selectedTeam] ? "▶" : "▼"}</span>
        Team projections
      </div>
      ${teamStatsCollapsed[selectedTeam] ? "" : tsHtml + buildHistPanel(selectedTeam)}
      <div class="section-title" style="margin-top:28px; margin-bottom:8px;">Player projections</div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div class="proj-view-toggle" style="margin-bottom:0;">
          <button class="proj-view-btn ${isPass ? 'active' : ''}" onclick="setProjView('pass')">Pass</button>
          <button class="proj-view-btn ${!isPass ? 'active' : ''}" onclick="setProjView('rushrec')">Rush / Rec</button>
        </div>
        ${!isPass ? `<div id="tgt-share-bar-wrap">${buildTgtShareBar(data)}</div>` : ''}
      </div>
      <div class="player-table-wrap">
        <table>
          <thead>
            <tr>
              <th class="col-del"></th>
              <th class="col-name">Name</th>
              <th class="col-pos">Pos</th>
              ${colHeaders}
            </tr>
          </thead>
          <tbody id="player-body">${playerRows}</tbody>
          <tfoot id="player-foot">${buildFooter(data)}</tfoot>
        </table>
      </div>
      <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">
        <div id="add-player-widget">${buildAddPlayerWidget(false)}</div>
        <button class="add-player-btn" style="color:var(--red); border-color:var(--red);" onclick="clearPlayerStats()">clear stats</button>
      </div>
    </div>
  `;

  // Trigger autocrop if image already cached (onload won't fire)
  requestAnimationFrame(() => {
    const img = document.getElementById("team-logo-img");
    if (img) {
      if (img.complete && img.naturalWidth > 0) {
        autoCropLogo(img);
      } else {
        img.addEventListener("load", () => autoCropLogo(img), { once: true });
      }
    }
    if (window.lucide) lucide.createIcons();
    attachTableWheelHandlers();
  });
}

const POS_COLOR_CLASS = { QB: "pos-label-qb", RB: "pos-label-rb", WR: "pos-label-wr", TE: "pos-label-te" };

function calcDerived(p, data) {
  const s = p.stats;
  const d = {};
  const att  = parseFloat(s.passAtt  || 0);
  const comp = parseFloat(s.passComp || 0);
  const yds  = parseFloat(s.passYds  || 0);
  const td   = parseFloat(s.passTD   || 0);
  const int_ = parseFloat(s.passInt  || 0);
  const car  = parseFloat(s.rushAtt  || 0);
  const rYds = parseFloat(s.rushYds  || 0);
  const tgt  = parseFloat(s.targets  || 0);
  const rec  = parseFloat(s.rec      || 0);
  const rYd2 = parseFloat(s.recYds   || 0);

  const teamPassAtt  = parseFloat(data.teamStats.passAtt  || 0);
  const teamRushAtt  = parseFloat(data.teamStats.rushPlays || 0);

  if (att > 0) {
    d.compPct  = (comp / att * 100).toFixed(1);
    d.ypa      = (yds  / att).toFixed(1);
    d.tdPct    = (td   / att * 100).toFixed(1);
    d.intPct   = (int_ / att * 100).toFixed(1);
  }
  if (car > 0)           d.ypc      = (rYds / car).toFixed(1);
  if (car > 0)           d.ypc_rush = (rYds / car).toFixed(1);
  if (teamRushAtt > 0)   d.rushShare= (car / teamRushAtt * 100).toFixed(1);
  if (teamPassAtt > 0)   d.tgtShare = (tgt / teamPassAtt * 100).toFixed(1);
  if (tgt > 0)           d.catchPct = (rec / tgt * 100).toFixed(1);
  if (tgt > 0)           d.ypr      = (rYd2 / tgt).toFixed(1);
  if (rec > 0)           d.ypc_rec  = (rYd2 / rec).toFixed(1);
  return d;
}

function buildGroupedPlayerRows(data, visiblePos, inputCols, derivedCols) {
  const cols = (inputCols && inputCols.length) ? inputCols : getOrderedCols(projView);
  const totalCols = cols.length + 3; // del + name + pos + stats
  let html = "";
  for (const pos of POS_ORDER) {
    if (!visiblePos.includes(pos)) continue;
    const named = data.players.filter(p => !p.misc && p.pos === pos);
    const misc  = data.players.filter(p =>  p.misc && p.pos === pos);
    if (named.length === 0 && misc.length === 0) continue;
    const grpCls = `grp-${pos.toLowerCase()}`;
    const totalCols = cols.length + 3;
    html += `<tr class="pos-group-header ${grpCls}">
      <td colspan="${totalCols}">
        <div class="pos-divider ${grpCls}">
          <div class="pos-divider-line"></div>
          <span class="pos-divider-label">${pos}</span>
          <div class="pos-divider-line"></div>
        </div>
      </td>
    </tr>`;
    named.forEach(p => { html += renderPlayerRow(p, data, cols); });
    misc.forEach(p  => { html += renderPlayerRow(p, data, cols); });
    html += buildPosTotal(data, pos, cols, grpCls);
  }
  return html;
}

function buildPosTotal(data, pos, cols, grpCls) {
  const allPlayers = data.players.filter(p => p.pos === pos);

  // Sum all input cols directly from player stats
  const sums = {};
  cols.forEach(c => { if (!c.derived) sums[c.key] = 0; });
  allPlayers.forEach(p => {
    cols.forEach(c => {
      if (!c.derived) {
        sums[c.key] = (sums[c.key] || 0) + parseFloat(p.stats[c.key] || 0);
      }
    });
  });

  const fakeP = { stats: sums };
  const derived = calcDerived(fakeP, data);

  const cells = cols.map(c => {
    if (c.key === "games") return `<td class="pos-total-cell" style="color:var(--text-3)">—</td>`;
    if (c.derived) {
      const v = derived[c.key];
      if (v === undefined || v === null) return `<td class="pos-total-cell derived">—</td>`;
      const suffix = c.label.endsWith("%") ? "%" : "";
      return `<td class="pos-total-cell derived">${v}${suffix}</td>`;
    }
    const v = sums[c.key];
    return `<td class="pos-total-cell">${v !== undefined ? Math.round(v) : "—"}</td>`;
  }).join("");

  return `<tr class="pos-total-row ${grpCls}">
    <td></td>
    <td class="pos-total-label pos-divider-label ${grpCls}">Total ${pos}</td>
    <td></td>
    ${cells}
  </tr>`;
}

function renderPlayerRow(p, data, cols) {
  const posOpts = POSITIONS.map(pos =>
    `<option value="${pos}" ${p.pos === pos ? "selected" : ""}>${pos}</option>`
  ).join("");

  const derived = calcDerived(p, data);

  const cells = cols.map(c => {
    // Hide columns not applicable to this player's position
    if (c.pos && !c.pos.includes(p.pos)) {
      return `<td class="stat-cell" style="background:var(--bg-3);"></td>`;
    }
    if (c.derived) {
      const v = derived[c.key];
      if (v === undefined || v === null) return `<td class="derived-cell" style="color:var(--text-3)">—</td>`;
      const suffix = c.label.endsWith("%") ? "%" : "";
      return `<td class="derived-cell">${v}${suffix}</td>`;
    }
    const val = p.stats[c.key] !== undefined ? p.stats[c.key] : "";
    const display = val !== "" ? val : "";
    // Games cell on misc rows is locked at 17
    if (c.key === "games" && p.misc) {
      return `<td class="stat-cell"><div class="stat-display" style="color:var(--text-3)">17</div></td>`;
    }
    return `<td class="stat-cell" data-player-id="${p.id}" data-key="${c.key}"
      onclick="onStatCellClick(event,this)"
      ondblclick="onStatCellDblClick(event,this)">
      <div class="stat-display">${display}</div>
    </td>`;
  }).join("");

  const nameCell = p.misc
    ? `<td><span class="misc-name">${p.name}</span></td>`
    : `<td><input type="text" value="${p.name}" placeholder="player name" spellcheck="false"
        oninput="onPlayerName('${p.id}',this.value)"></td>`;

  const posCell = p.misc
    ? `<td class="col-pos-cell"><span class="misc-pos">${p.pos}</span></td>`
    : `<td class="col-pos-cell"><select onchange="onPlayerPos('${p.id}',this.value)">${posOpts}</select></td>`;

  const delCell = p.misc
    ? `<td></td>`
    : `<td><button class="del-btn" title="Remove" onclick="deletePlayer('${p.id}')">×</button></td>`;

  const dragAttrs = p.misc ? "" : `draggable="true"
    ondragstart="onRowDragStart(event,'${p.id}')"
    ondragover="onRowDragOver(event,this)"
    ondragleave="onRowDragLeave(event)"
    ondrop="onRowDrop(event,this,'${p.id}')"
    ondragend="onRowDragEnd()"`;

  return `<tr data-id="${p.id}" class="${p.misc ? 'misc-row' : 'player-row'}" ${dragAttrs}${p.misc ? '' : ` oncontextmenu="showTradeMenu(event,'${p.id}')"`}>${delCell}${nameCell}${posCell}${cells}</tr>`;
}

function buildTgtShareBar(data) {
  const ts = data.teamStats;
  const players = data.players;

  const positions = [
    { pos: 'RB', cls: 'pos-rb', teamKey: 'rbTgt' },
    { pos: 'WR', cls: 'pos-wr', teamKey: 'wrTgt' },
    { pos: 'TE', cls: 'pos-te', teamKey: 'teTgt' },
  ];

  const pills = positions.map(({ pos, cls, teamKey }) => {
    const teamTgt = parseFloat(ts[teamKey] || 0);
    const allocated = players
      .filter(p => p.pos === pos)
      .reduce((sum, p) => sum + parseFloat(p.stats.targets || 0), 0);
    const remaining = Math.round(teamTgt - allocated);
    const remCls = remaining < 0 ? 'over' : remaining === 0 ? 'done' : 'under';
    const remText = remaining < 0 ? `${Math.abs(remaining)} over` : remaining === 0 ? '✓' : `${remaining} left`;

    return `<div class="tgt-share-pill${remaining === 0 ? ' done' : ''}">
      <span class="tgt-share-pos ${cls}">${pos}</span>
      <span class="tgt-share-nums">${Math.round(allocated)} / ${Math.round(teamTgt)}</span>
      <span class="tgt-share-rem ${remCls}">${remText}</span>
    </div>`;
  }).join('');

  return `<div class="tgt-share-bar">${pills}</div>`;
}

function buildFooter(data) {
  const isPass = projView === "pass";
  const fvPos = isPass ? ["QB"] : ["QB","RB","WR","TE"];
  const allCols = getOrderedCols(projView);
  const cols = allCols.filter(c => !c.pos || c.pos.some(p => fvPos.includes(p)));
  const inputOnly = cols.filter(c => !c.derived);
  // Merge derived team stats so footer can reference computed values like rushAtt
  const teamStatsWithDerived = Object.assign({}, data.teamStats, calcTeamDerived(data.teamStats));

  const sums = {};
  inputOnly.forEach(c => { sums[c.key] = 0; });
  data.players.forEach(p => {
    inputOnly.forEach(c => {
      sums[c.key] += parseFloat(p.stats[c.key] || 0);
    });
  });

  const totalCells = cols.map(c => {
    if (c.derived || c.key === "games") return `<td></td>`;
    const v = sums[c.key];
    return `<td data-total="${c.key}">${v > 0 ? Math.round(v) : ""}</td>`;
  }).join("");

  const deltaCells = cols.map(c => {
    if (c.derived || c.key === "games") return `<td></td>`;
    const teamKey = PLAYER_TO_TEAM[c.key];
    if (teamKey === null) return `<td class="d-empty">—</td>`;
    if (!teamKey) return `<td class="d-empty"></td>`;
    const rawTv = data.teamStats[teamKey];
    const tv = parseFloat((rawTv !== undefined && rawTv !== "") ? rawTv : (teamStatsWithDerived[teamKey] || 0));
    if (tv === 0) return `<td class="d-empty">—</td>`;
    const delta = Math.round(sums[c.key]) - Math.round(tv);
    const pct = Math.abs(delta) / Math.round(tv);
    if (Math.abs(delta) < 0.5) return `<td class="d-ok">✓</td>`;
    const cls = pct > 0.1 ? (delta > 0 ? "d-over" : "d-warn") : "d-ok";
    const sign = delta > 0 ? "+" : "";
    return `<td class="${cls}" title="${delta > 0 ? 'Over' : 'Under'} by ${Math.abs(Math.round(delta))}">${sign}${Math.round(delta)}</td>`;
  }).join("");

  const totalCols = cols.length + 3;
  return `
    <tr class="totals-divider-row">
      <td colspan="${totalCols}">
        <div class="pos-divider" style="--divider-color: var(--border-2);">
          <div class="pos-divider-line" style="background:var(--border-2)"></div>
          <span class="pos-divider-label" style="color:var(--text-3)">TOTAL</span>
          <div class="pos-divider-line" style="background:var(--border-2)"></div>
        </div>
      </td>
    </tr>
    <tr class="totals-row"><td></td><td>Player totals</td><td></td>${totalCells}</tr>
    <tr class="delta-row"><td></td><td>vs team total</td><td></td>${deltaCells}</tr>`;
}

function buildBudgetGrid(data) {
  return BUDGET_ITEMS.map(item => {
    const tv = parseFloat(data.teamStats[item.teamKey] || 0);
    let playerSum = 0;
    data.players.forEach(p => {
      item.playerCols.forEach(col => {
        const colDef = STAT_COLS.find(c => c.key === col);
        if (colDef && colDef.pos.includes(p.pos)) {
          playerSum += parseFloat(p.stats[col] || 0);
        }
      });
    });

    const pct = tv > 0 ? Math.min(playerSum / tv, 1.2) : 0;
    const over = playerSum > tv && tv > 0;
    const warn = tv > 0 && (playerSum / tv) < 0.85;
    const barCls = over ? "bar-over" : warn ? "bar-warn" : "bar-ok";
    const barW = Math.min(pct * 100, 100).toFixed(1);
    const deltaStr = tv > 0
      ? (playerSum > tv ? `+${Math.round(playerSum - tv)} over` : `${Math.round(tv - playerSum)} left`)
      : "no total set";
    const deltaColor = over ? "var(--red)" : warn ? "var(--amber)" : "var(--accent)";

    return `<div class="budget-item">
      <div class="budget-item-header">
        <span class="budget-item-label">${item.label}</span>
        <span class="budget-item-vals" style="color:${deltaColor}">${deltaStr}</span>
      </div>
      <div class="budget-bar-bg">
        <div class="budget-bar-fill ${barCls}" style="width:${barW}%"></div>
      </div>
    </div>`;
  }).join("");
}

function buildAddPlayerWidget(open) {
  if (!open) {
    return `<button class="add-player-btn" onclick="openAddPlayer()">+ add player</button>`;
  }
  const posOpts = POSITIONS.map(p => `<option value="${p}">${p}</option>`).join("");
  return `<div class="add-player-widget">
    <input type="text" id="new-player-name" placeholder="player name" spellcheck="false"
      onkeydown="onAddPlayerKey(event)">
    <select id="new-player-pos" onkeydown="onAddPlayerKey(event)">${posOpts}</select>
    <button class="add-player-cancel" onclick="closeAddPlayer()">✕</button>
  </div>`;
}

function openAddPlayer() {
  const w = document.getElementById("add-player-widget");
  if (w) {
    w.innerHTML = buildAddPlayerWidget(true);
    setTimeout(() => {
      const inp = document.getElementById("new-player-name");
      if (inp) inp.focus();
    }, 30);
  }
}

function closeAddPlayer() {
  const w = document.getElementById("add-player-widget");
  if (w) w.innerHTML = buildAddPlayerWidget(false);
}

function confirmAddPlayer() {
  const nameEl = document.getElementById("new-player-name");
  const posEl  = document.getElementById("new-player-pos");
  if (!nameEl || !nameEl.value.trim()) return;
  pushUndo();
  const data = ensureTeam(selectedTeam);
  const pos = posEl ? posEl.value : "WR";
  const newP = { id: `p_${Date.now()}`, name: nameEl.value.trim(), pos, misc: false, stats: {} };
  const miscIdx = data.players.findIndex(mp => mp.misc && mp.pos === pos);
  if (miscIdx === -1) data.players.push(newP);
  else data.players.splice(miscIdx, 0, newP);
  saveState();
  renderMain();
  openAddPlayer();
}

function onAddPlayerKey(e) {
  if (e.key === "Enter") confirmAddPlayer();
  if (e.key === "Escape") closeAddPlayer();
}

// ─── Event handlers ───
function tsCellStep(key, delta) {
  if (!selectedTeam) return;
  const data = ensureTeam(selectedTeam);
  const stored = data.teamStats[key];
  const derived = calcTeamDerived(data.teamStats);
  const current = parseFloat(stored !== undefined && stored !== "" ? stored : (derived[key] || 0));
  const isDecimal = key === "yardsPerSack";
  const step = isDecimal ? 0.1 : 1;
  const raw = Math.max(0, current + delta * step);
  const newVal = isDecimal ? parseFloat(raw.toFixed(1)) : Math.round(raw);
  onTeamStat(key, newVal);
}

function nudgeSplit(delta) {
  if (!selectedTeam) return;
  const data = ensureTeam(selectedTeam);
  const current = parseFloat(data.teamStats.passRate || 50);
  const newPass = Math.min(100, Math.max(0, Math.round((current + delta) * 10) / 10));
  onTeamStat('passRate', newPass.toFixed(1));
}

function onSplitInput(field, val) {
  const num = parseFloat(val);
  if (!isNaN(num) && num >= 0 && num <= 100) {
    onTeamStat(field, num.toFixed(1));
  }
}

function formatSplitInput(inp, field) {
  const num = parseFloat(inp.value);
  if (!isNaN(num)) {
    const clamped = Math.min(100, Math.max(0, num));
    inp.value = clamped.toFixed(1);
    onTeamStat(field, clamped.toFixed(1));
  }
}

function getExpectedValue(key, ts) {
  const totalPlays = parseFloat(ts.totalPlays || 0);
  const passRate   = parseFloat(ts.passRate   || 0);
  const passPlays  = parseFloat(ts.passPlays  || 0);
  const rushPlays  = parseFloat(ts.rushPlays  || 0);
  const passAtt    = parseFloat(ts.passAtt    || 0);
  const sacks      = parseFloat(ts.sacks      || 0);
  const targets    = parseFloat(ts.targets    || 0);
  const deadPlays  = parseFloat(ts.deadPassPlays || 0);
  // Tier 3: plays
  if (key === "passPlays" && totalPlays > 0) {
    if (rushPlays > 0) return Math.round(totalPlays - rushPlays);
    if (passRate > 0) return Math.round(totalPlays * passRate / 100);
  }
  if (key === "rushPlays" && totalPlays > 0) {
    if (passPlays > 0) return Math.round(totalPlays - passPlays);
    if (passRate > 0) return Math.round(totalPlays * (100 - passRate) / 100);
  }
  // Tier 2: passAtt + sacks = passPlays
  if (key === "passPlays" && ts.passAtt !== undefined && ts.passAtt !== "" &&
      ts.sacks !== undefined && ts.sacks !== "") return Math.round(passAtt + sacks);
  if (key === "passAtt" && ts.passPlays !== undefined && ts.passPlays !== "" &&
      ts.sacks !== undefined && ts.sacks !== "") return Math.round(passPlays - sacks);
  if (key === "sacks" && ts.passPlays !== undefined && ts.passPlays !== "" &&
      ts.passAtt !== undefined && ts.passAtt !== "") return Math.round(passPlays - passAtt);
  // Sack yards: sacks * yardsPerSack = sackYds
  const sackYds     = parseFloat(ts.sackYds      || 0);
  const yps         = parseFloat(ts.yardsPerSack  || 0);
  if (key === "sackYds" && sacks > 0 && ts.yardsPerSack !== undefined && ts.yardsPerSack !== "") return Math.round(sacks * yps * 10) / 10;
  if (key === "yardsPerSack" && sacks > 0 && ts.sackYds !== undefined && ts.sackYds !== "") return Math.round((sackYds / sacks) * 10) / 10;
  if (key === "sacks" && ts.sackYds !== undefined && ts.sackYds !== "" && ts.yardsPerSack !== undefined && ts.yardsPerSack !== "" && yps > 0) return Math.round(sackYds / yps);
  // Tier 1: targets + deadPassPlays = passAtt
  if (key === "passAtt" && ts.targets !== undefined && ts.targets !== "" &&
      ts.deadPassPlays !== undefined && ts.deadPassPlays !== "") return Math.round(targets + deadPlays);
  if (key === "targets" && ts.passAtt !== undefined && ts.passAtt !== "" &&
      ts.deadPassPlays !== undefined && ts.deadPassPlays !== "") return Math.round(passAtt - deadPlays);
  if (key === "deadPassPlays" && ts.passAtt !== undefined && ts.passAtt !== "" &&
      ts.targets !== undefined && ts.targets !== "") return Math.round(passAtt - targets);
  // Target group: wrTgt + teTgt + rbTgt = targets
  const wrTgt = parseFloat(ts.wrTgt || 0);
  const teTgt = parseFloat(ts.teTgt || 0);
  const rbTgt = parseFloat(ts.rbTgt || 0);
  const wrK = ts.wrTgt !== undefined && ts.wrTgt !== '';
  const teK = ts.teTgt !== undefined && ts.teTgt !== '';
  const rbK = ts.rbTgt !== undefined && ts.rbTgt !== '';
  if (key === 'wrTgt' && targets > 0 && teK && rbK) return Math.round(targets - teTgt - rbTgt);
  if (key === 'teTgt' && targets > 0 && wrK && rbK) return Math.round(targets - wrTgt - rbTgt);
  if (key === 'rbTgt' && targets > 0 && wrK && teK) return Math.round(targets - wrTgt - teTgt);
  if (key === 'targets' && wrK && teK && rbK) return Math.round(wrTgt + teTgt + rbTgt);
  return null;
}

function _hasVal(ts, key) { return ts[key] !== undefined && ts[key] !== ""; }

function getComputedLocks(teamName) {
  const locks = getTeamLocks(teamName);
  const constrained = {};
  // Tier 3: plays — only constrained when two neighbors are locked
  if (locks.totalPlays && locks.passRate) { constrained.passPlays = true; constrained.rushPlays = true; }
  if (locks.totalPlays && locks.passPlays) constrained.rushPlays = true;
  if (locks.totalPlays && locks.rushPlays) constrained.passPlays = true;
  // Tier 2: passAtt + sacks = passPlays — only constrained when two are locked
  if (locks.passAtt && locks.sacks)    constrained.passPlays = true;
  if (locks.passPlays && locks.sacks)  constrained.passAtt   = true;
  if (locks.passPlays && locks.passAtt) constrained.sacks    = true;
  // Sack yards: sacks * yardsPerSack = sackYds
  if (locks.sacks && locks.yardsPerSack) constrained.sackYds      = true;
  if (locks.sacks && locks.sackYds)      constrained.yardsPerSack = true;
  if (locks.sackYds && locks.yardsPerSack) constrained.sacks      = true;
  // Tier 1: targets + deadPassPlays = passAtt — only constrained when two are locked
  if (locks.targets && locks.deadPassPlays) constrained.passAtt       = true;
  if (locks.passAtt && locks.deadPassPlays) constrained.targets       = true;
  if (locks.passAtt && locks.targets)       constrained.deadPassPlays = true;
  // Target group: wrTgt + teTgt + rbTgt = targets
  if (locks.wrTgt && locks.teTgt)   constrained.rbTgt   = true;
  if (locks.wrTgt && locks.rbTgt)   constrained.teTgt   = true;
  if (locks.teTgt && locks.rbTgt)   constrained.wrTgt   = true;
  if (locks.wrTgt && locks.teTgt && locks.rbTgt) constrained.targets = true;
  if (locks.targets && locks.wrTgt && locks.teTgt) constrained.rbTgt = true;
  if (locks.targets && locks.wrTgt && locks.rbTgt) constrained.teTgt = true;
  if (locks.targets && locks.teTgt && locks.rbTgt) constrained.wrTgt = true;
  return constrained;
}

function toggleTeamLock(key) {
  if (!selectedTeam) return;
  // Save any unsaved value in the input before re-rendering
  const inp = document.querySelector(`.ts-cell input[oninput*="'${key}'"]`);
  if (inp && inp.value !== "" && document.activeElement !== inp) {
    cascadeTeamStat(selectedTeam, key, inp.value);
  } else if (inp && inp.value !== "") {
    cascadeTeamStat(selectedTeam, key, inp.value);
  }
  const locked = isLocked(selectedTeam, key);
  setTeamLock(selectedTeam, key, !locked);
  saveState();
  refreshTeamStatsGrid();
}

function onTeamStat(field, val) {
  pushUndo(true);
  cascadeTeamStat(selectedTeam, field, val);
  // Always re-run target group cascade to resolve any constrained cells
  const _d = ensureTeam(selectedTeam);
  const _locks = getTeamLocks(selectedTeam);
  _cascadeTargetGroup(_d.teamStats, _locks, field, parseFloat(val) || 0);
  saveState();
  refreshTeamStatsGrid();
  refreshFooter();
  refreshBudget();
  refreshSidebarDots();
}

function refreshTeamStatsGrid() {
  if (!selectedTeam) return;
  const data = ensureTeam(selectedTeam);
  const locks = getTeamLocks(selectedTeam);
  const constrained = getComputedLocks(selectedTeam);
  const derived = calcTeamDerived(data.teamStats);
  const conflict = data.teamStats._totalPlaysConflict;

  // Update split field inputs (pass/rush rate)
  const passVal = data.teamStats.passRate !== undefined ? parseFloat(data.teamStats.passRate).toFixed(1) : "";
  const rushVal = data.teamStats.rushRate !== undefined ? parseFloat(data.teamStats.rushRate).toFixed(1) :
                  (passVal !== "" ? (100 - parseFloat(passVal)).toFixed(1) : "");
  document.querySelectorAll(".ts-cell input").forEach(inp => {
    const oninput = inp.getAttribute("oninput") || "";
    if (document.activeElement === inp) return; // don't interrupt typing
    if (oninput.includes("onSplitInput('passRate'")) inp.value = passVal;
    if (oninput.includes("onSplitInput('rushRate'")) inp.value = rushVal;
    if (oninput.includes("onTeamStat('passPlays'")) inp.value = data.teamStats.passPlays !== undefined ? data.teamStats.passPlays : "";
    if (oninput.includes("onTeamStat('rushPlays'")) inp.value = data.teamStats.rushPlays !== undefined ? data.teamStats.rushPlays : "";
  });

  // Update lock state for the split cell
  const splitCell = document.querySelector('.ts-cell.ts-split');
  if (splitCell) {
    const splitLocked = !!locks['passRate'];
    splitCell.classList.toggle('ts-locked', splitLocked);
    const splitIcon = splitCell.querySelector('.ts-lock-icon');
    if (splitIcon) {
      splitIcon.innerHTML = splitLocked
        ? `<i data-lucide="lock" style="width:15px;height:15px;display:inline-block;vertical-align:middle;stroke-width:2;"></i>`
        : `<i data-lucide="lock-open" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i>`;
      if (window.lucide) lucide.createIcons();
    }
  }

  TEAM_STAT_FIELDS.forEach(f => {
    if (f.split) return; // handled above
    const cells = document.querySelectorAll(`.ts-cell`);
    cells.forEach(cell => {
      const inp = cell.querySelector("input");
      if (!inp) return;
      const oninput = inp.getAttribute("oninput") || "";
      if (!oninput.includes(`'${f.key}'`)) return;

      // Update value for derived fields (skip if actively being edited)
      if (document.activeElement === inp) return;
      if (f.derived && derived[f.key] !== undefined) {
        inp.value = derived[f.key];
      } else if (!f.derived) {
        const stored = data.teamStats[f.key];
        if (stored !== undefined && stored !== "") {
          inp.value = f.key === "yardsPerSack" ? parseFloat(stored).toFixed(1) : stored;
        }
      }

      // Update lock/conflict classes
      const isLock = !!locks[f.key];
      const isConflict = conflict && (f.key === "passPlays" || f.key === "rushPlays");
      const isConstrained = !isLock && !!constrained[f.key];
      const expected = isConstrained ? getExpectedValue(f.key, data.teamStats) : null;
      const storedVal = data.teamStats[f.key];
      const isErroneous = expected !== null && storedVal !== undefined && storedVal !== '' && Math.abs(parseFloat(storedVal) - expected) > 0.05;
      cell.classList.toggle("ts-locked", isLock);
      cell.classList.toggle("ts-constrained", isConstrained);
      cell.classList.toggle("ts-erroneous", isErroneous);
      cell.classList.toggle("ts-conflict", isConflict);
      // Update hint
      let hint = cell.querySelector(".ts-expected");
      if (isErroneous) {
        if (!hint) { hint = document.createElement("div"); hint.className = "ts-expected"; cell.appendChild(hint); }
        hint.textContent = `expected: ${expected}`;
      } else if (hint) {
        hint.remove();
      }

      // Update lock icon
      const icon = cell.querySelector(".ts-lock-icon");
      if (icon) {
        icon.innerHTML = isLock
          ? `<i data-lucide="lock" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i>`
          : `<i data-lucide="lock-open" style="width:15px;height:15px;display:inline-block;vertical-align:middle;"></i>`;
      }
    });
  });
  if (window.lucide) lucide.createIcons();
}

function onPlayerStat(id, key, val) {
  pushUndo(true);
  const data = ensureTeam(selectedTeam);
  const p = data.players.find(p => p.id == id);
  if (p) p.stats[key] = val === "" ? "" : parseFloat(val);
  refreshFooter();
  refreshBudget();
  saveState();
}

function onPlayerName(id, val) {
  const data = ensureTeam(selectedTeam);
  const p = data.players.find(p => p.id == id);
  if (p) { p.name = val; refreshSidebarDots(); saveState(); }
}

function onPlayerPos(id, val) {
  pushUndo();
  const data = ensureTeam(selectedTeam);
  const idx = data.players.findIndex(p => p.id == id);
  if (idx === -1) return;
  const p = data.players[idx];
  p.pos = val;
  data.players.splice(idx, 1);
  const miscIdx = data.players.findIndex(mp => mp.misc && mp.pos === val);
  if (miscIdx === -1) data.players.push(p);
  else data.players.splice(miscIdx, 0, p);
  saveState();
  renderMain();
}

function showTradeMenu(e, playerId) {
  e.preventDefault();
  e.stopPropagation();
  document.querySelectorAll('.trade-ctx-menu').forEach(m => m.remove());
  const data = ensureTeam(selectedTeam);
  const player = data.players.find(p => p.id === playerId);
  if (!player) return;

  const allTeams = [];
  for (const conf of ['AFC','NFC']) {
    for (const div of ['East','North','South','West']) {
      (TEAMS[conf]?.[div] || []).forEach(t => { if (t !== selectedTeam) allTeams.push(t); });
    }
  }

  const menu = document.createElement('div');
  menu.className = 'trade-ctx-menu';

  const label = document.createElement('div');
  label.className = 'trade-ctx-label';
  label.textContent = 'Trade ' + player.name + ' to...';
  menu.appendChild(label);

  const list = document.createElement('div');
  list.className = 'trade-ctx-list';
  allTeams.forEach(team => {
    const item = document.createElement('div');
    item.className = 'trade-ctx-item';
    item.textContent = TEAM_LOGOS[team] || team;
    item.title = team;
    item.onclick = () => { menu.remove(); tradePlayer(playerId, team); };
    list.appendChild(item);
  });
  menu.appendChild(list);
  document.body.appendChild(menu);

  const mh = Math.min(300, allTeams.length * 28 + 36);
  const mw = 180;
  menu.style.left = (e.clientX + mw > window.innerWidth ? e.clientX - mw : e.clientX) + 'px';
  menu.style.top  = (e.clientY + mh > window.innerHeight ? e.clientY - mh : e.clientY) + 'px';

  const close = ev => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('mousedown', close); } };
  setTimeout(() => document.addEventListener('mousedown', close), 0);
}

function tradePlayer(playerId, destTeam) {
  pushUndo();
  const srcData = ensureTeam(selectedTeam);
  const player = srcData.players.find(p => p.id === playerId);
  if (!player) return;
  srcData.players = srcData.players.filter(p => p.id !== playerId);
  const destData = ensureTeam(destTeam);
  const newId = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);
  destData.players.push({ id: newId, name: player.name, pos: player.pos, misc: false, stats: {} });
  saveState();
  renderMain();
}

function deletePlayer(id) {
  pushUndo();
  const data = ensureTeam(selectedTeam);
  data.players = data.players.filter(p => p.id != id);
  saveState();
  renderMain();
}

function clearPlayerStats() {
  if (!selectedTeam) return;
  if (!confirm(`Clear all player stats for ${selectedTeam}? Players will remain, only their numbers will be removed.`)) return;
  pushUndo();
  const data = ensureTeam(selectedTeam);
  data.players.forEach(p => {
    p.stats = p.misc ? { games: 17 } : {};
  });
  saveState();
  renderMain();
}

function refreshFooter() {
  if (!selectedTeam) return;
  const data = ensureTeam(selectedTeam);
  const cols = getOrderedCols(projView);

  const foot = document.getElementById("player-foot");
  if (foot) foot.innerHTML = buildFooter(data);

  const barWrap = document.getElementById("tgt-share-bar-wrap");
  if (barWrap) barWrap.innerHTML = buildTgtShareBar(data);

  // Only refresh derived cells if no cell is currently being edited
  // (rebuilding the DOM while editing destroys the active input)
  if (activeStatCell) return;

  data.players.forEach(p => {
    const row = document.querySelector(`tr[data-id="${p.id}"]`);
    if (!row) return;
    const derived = calcDerived(p, data);
    const derivedCols = cols.filter(c => c.derived);
    row.querySelectorAll("td.derived-cell").forEach((cell, i) => {
      const c = derivedCols[i];
      if (!c) return;
      const v = derived[c.key];
      const suffix = c.label.endsWith("%") ? "%" : "";
      cell.textContent = (v === undefined || v === null) ? "—" : `${v}${suffix}`;
    });
  });
}

function refreshBudget() {
  const bg = document.getElementById("budget-grid");
  if (!bg || !selectedTeam) return;
  bg.innerHTML = buildBudgetGrid(ensureTeam(selectedTeam));
}

// ─── Team color overrides (persisted) ───
function getTeamColor(team) {
  const overrides = JSON.parse(localStorage.getItem("ff_color_overrides") || "{}");
  return overrides[team] || (TEAM_COLORS[team] || {}).border || "#888888";
}

function setTeamColor(team, hex) {
  const overrides = JSON.parse(localStorage.getItem("ff_color_overrides") || "{}");
  overrides[team] = hex;
  localStorage.setItem("ff_color_overrides", JSON.stringify(overrides));
}

function resetTeamColor(team) {
  const overrides = JSON.parse(localStorage.getItem("ff_color_overrides") || "{}");
  delete overrides[team];
  localStorage.setItem("ff_color_overrides", JSON.stringify(overrides));
}

function applyTeamColor(team, hex) {
  const btn = document.querySelector(`.team-btn[data-team="${team}"]`);
  if (btn) btn.style.setProperty("--tc-bar", hex);
  if (selectedTeam === team) {
    const bar = document.querySelector(".team-color-bar");
    if (bar) bar.style.background = hex;
  }
}

// ─── Context menu ───
let ctxTeam = null;
const ctxMenu = document.getElementById("ctx-menu");
const ctxPicker = document.getElementById("ctx-picker");
const ctxHex = document.getElementById("ctx-hex");
const ctxReset = document.getElementById("ctx-reset");

function isValidHex(v) { return /^#[0-9a-fA-F]{6}$/.test(v); }

document.addEventListener("contextmenu", e => {
  const btn = e.target.closest(".team-btn");
  if (!btn) { closeCtxMenu(); return; }
  e.preventDefault();
  ctxTeam = btn.dataset.team;
  const color = getTeamColor(ctxTeam);
  document.getElementById("ctx-team-name").textContent = ctxTeam;
  ctxPicker.value = color;
  ctxHex.value = color.toUpperCase();
  const x = Math.min(e.clientX, window.innerWidth - 220);
  const y = Math.min(e.clientY, window.innerHeight - 160);
  ctxMenu.style.left = x + "px";
  ctxMenu.style.top = y + "px";
  ctxMenu.classList.add("visible");
});

document.addEventListener("click", e => {
  if (!ctxMenu.contains(e.target)) closeCtxMenu();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeCtxMenu();
});

function closeCtxMenu() { ctxMenu.classList.remove("visible"); ctxTeam = null; }

ctxPicker.addEventListener("input", () => {
  if (!ctxTeam) return;
  ctxHex.value = ctxPicker.value.toUpperCase();
});

ctxHex.addEventListener("input", () => {
  if (!ctxTeam) return;
  let v = ctxHex.value;
  if (!v.startsWith("#")) v = "#" + v;
  if (isValidHex(v)) ctxPicker.value = v;
});

document.getElementById("ctx-apply").addEventListener("click", () => {
  if (!ctxTeam) return;
  const hex = ctxPicker.value;
  setTeamColor(ctxTeam, hex);
  applyTeamColor(ctxTeam, hex);
  closeCtxMenu();
});

ctxReset.addEventListener("click", () => {
  if (!ctxTeam) return;
  resetTeamColor(ctxTeam);
  const def = (TEAM_COLORS[ctxTeam] || {}).border || "#888888";
  ctxPicker.value = def;
  ctxHex.value = def.toUpperCase();
  applyTeamColor(ctxTeam, def);
  closeCtxMenu();
});

function applyAllColorOverrides() {
  const overrides = JSON.parse(localStorage.getItem("ff_color_overrides") || "{}");
  for (const [team, hex] of Object.entries(overrides)) {
    applyTeamColor(team, hex);
  }
}

// ─── Column order (persisted per view) ───
function getColOrder(view, cols) {
  try {
    const saved = JSON.parse(localStorage.getItem(`ff_col_order_${view}`) || "null");
    if (!saved) return cols.map((_, i) => i);
    // Validate saved order covers all current cols
    if (saved.length === cols.length) return saved;
  } catch(e) {}
  return cols.map((_, i) => i);
}

function saveColOrder(view, order) {
  try { localStorage.setItem(`ff_col_order_${view}`, JSON.stringify(order)); } catch(e) {}
}

function getOrderedCols(view) {
  const cols = view === "pass" ? PASS_INPUT_COLS : RUSHREC_INPUT_COLS;
  const order = getColOrder(view, cols);
  return order.map(i => cols[i]);
}

let colDragSrcIdx = null;

function onColDragStart(e, idx) {
  colDragSrcIdx = idx;
  e.dataTransfer.effectAllowed = "move";
  setTimeout(() => {
    const ths = document.querySelectorAll("thead th.col-draggable");
    if (ths[idx]) ths[idx].classList.add("col-dragging");
  }, 0);
}

function onColDragOver(e, el, idx) {
  e.preventDefault();
  document.querySelectorAll(".col-drop-before,.col-drop-after").forEach(t => {
    t.classList.remove("col-drop-before","col-drop-after");
  });
  const rect = el.getBoundingClientRect();
  if (e.clientX < rect.left + rect.width / 2) el.classList.add("col-drop-before");
  else el.classList.add("col-drop-after");
}

function onColDragLeave() {
  document.querySelectorAll(".col-drop-before,.col-drop-after").forEach(t => {
    t.classList.remove("col-drop-before","col-drop-after");
  });
}

function onColDrop(e, targetIdx) {
  e.preventDefault();
  document.querySelectorAll(".col-dragging,.col-drop-before,.col-drop-after").forEach(t => {
    t.classList.remove("col-dragging","col-drop-before","col-drop-after");
  });
  if (colDragSrcIdx === null || colDragSrcIdx === targetIdx) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const dropBefore = e.clientX < rect.left + rect.width / 2;

  const cols = projView === "pass" ? PASS_INPUT_COLS : RUSHREC_INPUT_COLS;
  const order = getColOrder(projView, cols);
  const moved = order.splice(colDragSrcIdx, 1)[0];
  let insertAt = dropBefore ? targetIdx : targetIdx + 1;
  if (colDragSrcIdx < insertAt) insertAt--;
  order.splice(insertAt, 0, moved);
  saveColOrder(projView, order);
  colDragSrcIdx = null;
  renderMain();
}

function onColDragEnd() {
  document.querySelectorAll(".col-dragging,.col-drop-before,.col-drop-after").forEach(t => {
    t.classList.remove("col-dragging","col-drop-before","col-drop-after");
  });
  colDragSrcIdx = null;
}
let currentPage = "projections";
let rankPos = "QB";
let rankView = "stats";
let qbRecMode = false;
let skillPassMode = false; // RB/WR/TE passing stats toggle
let sortCol = null;
let sortAsc = false;

function switchPage(page) {
  currentPage = page;
  localStorage.setItem('ff_last_page', page);
  document.getElementById("nav-projections").classList.toggle("active", page === "projections");
  document.getElementById("nav-rankings").classList.toggle("active", page === "rankings");
  document.getElementById("nav-draft").classList.toggle("active", page === "draft");
  document.getElementById("nav-data").classList.toggle("active", page === "data");
  document.getElementById("nav-settings").classList.toggle("active", page === "settings");
  document.getElementById("nav-test").classList.toggle("active", page === "test");
  document.getElementById("sidebar-panel").style.display = page === "projections" ? "" : "none";
  document.getElementById("main").style.display = page === "projections" ? "" : "none";
  document.getElementById("rankings-page").style.display = page === "rankings" ? "" : "none";
  if (page === "rankings") {
    const qbToggle = document.getElementById('qb-rec-toggle');
    if (qbToggle) qbToggle.style.display = rankPos === 'QB' ? '' : 'none';
    const skillToggle = document.getElementById('skill-pass-toggle');
    if (skillToggle) skillToggle.style.display = ['RB','WR','TE'].includes(rankPos) ? '' : 'none';
    renderScoringPresetSelector();
  }
  document.getElementById("data-page").style.display = page === "data" ? "" : "none";
  document.getElementById("draft-page").style.display = page === "draft" ? "" : "none";
  document.getElementById("settings-page").style.display = page === "settings" ? "" : "none";
  document.getElementById("test-page").style.display = page === "test" ? "" : "none";
  if (page === "rankings") renderRankings();
  if (page === "settings") renderSettings();
  if (page === "data") renderDataPage();
  if (page === "draft") renderDraftPage();
  if (page === "test") renderTestPage();
}

function openLightbox(src, team, file) {
  document.getElementById("lightbox-img").src = src;
  document.getElementById("lightbox-name").textContent = team;
  document.getElementById("lightbox-file").textContent = `Football logos/${file}`;
  document.getElementById("logo-lightbox").classList.add("visible");
}

function closeLightbox(e) {
  document.getElementById("logo-lightbox").classList.remove("visible");
}

function exportData() {
  // Collect per-team locks
  const teamLocks = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("ff_locks_")) {
      try { teamLocks[k] = JSON.parse(localStorage.getItem(k) || "{}"); } catch(e) {}
    }
  }
  const payload = {
    version: "2",
    exportedAt: new Date().toISOString(),
    state,
    rankingsState:   JSON.parse(localStorage.getItem("ff_rankings_v1")          || "{}"),
    teamStatus:      JSON.parse(localStorage.getItem("ff_team_status")           || "{}"),
    colorOverrides:  JSON.parse(localStorage.getItem("ff_color_overrides")       || "{}"),
    draftState:      JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY)          || "null") || { leagues: [], activeLeague: 0 },
    scoringPresets:  JSON.parse(localStorage.getItem("ff_scoring_presets")       || "null"),
    activeScoringPreset: localStorage.getItem("ff_active_scoring_preset") || "0",
    colDisplay:      JSON.parse(localStorage.getItem("ff_col_display")           || "{}"),
    teamLocks,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ff_projections_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const payload = JSON.parse(ev.target.result);
        if (!payload.state) { alert("Invalid file — no projection data found."); return; }
        if (!confirm("This will replace your current projections, rankings, draft board, and settings. Are you sure?")) return;
        state = payload.state;
        if (payload.rankingsState)   localStorage.setItem("ff_rankings_v1",          JSON.stringify(payload.rankingsState));
        if (payload.teamStatus)      localStorage.setItem("ff_team_status",           JSON.stringify(payload.teamStatus));
        if (payload.colorOverrides)  localStorage.setItem("ff_color_overrides",       JSON.stringify(payload.colorOverrides));
        if (payload.draftState)      localStorage.setItem(DRAFT_STORAGE_KEY,          JSON.stringify(payload.draftState));
        if (payload.scoringPresets)  localStorage.setItem("ff_scoring_presets",       JSON.stringify(payload.scoringPresets));
        if (payload.activeScoringPreset !== undefined) localStorage.setItem("ff_active_scoring_preset", payload.activeScoringPreset);
        if (payload.colDisplay)      localStorage.setItem("ff_col_display",           JSON.stringify(payload.colDisplay));
        // Restore per-team locks
        if (payload.teamLocks) {
          Object.entries(payload.teamLocks).forEach(([k, v]) => {
            try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
          });
        }
        // Reconcile all teams after import so derived fields are filled in
        Object.keys(state).forEach(k => reconcileTeamStats(k.replace(/_/g, " ")));
        saveState();
        refreshSidebarDots();
        loadStatMap();
        applyAllColorOverrides();
        rankingsState = getRankingsState();
        draftState = loadDraftState();
        scoringPresets = JSON.parse(localStorage.getItem('ff_scoring_presets') || 'null') || DEFAULT_SCORING_PRESETS.map(p => ({...p}));
        activeScoringPreset = parseInt(localStorage.getItem('ff_active_scoring_preset') || '0');
        if (selectedTeam) renderMain();
        renderSettings();
        renderRankings();
        alert("Data imported successfully.");
      } catch(err) {
        alert("Failed to import — file may be corrupted.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function clearHistData() {
  if (!confirm('Clear all historical data? You will need to reimport your CSV.')) return;
  localStorage.removeItem('ff_hist_data');
  localStorage.removeItem('ff_hist_cols');
  HIST_DATA.length = 0;
  HIST_COLS.length = 0;
  location.reload();
}

function exportHistCSV() {
  if (!HIST_DATA || HIST_DATA.length === 0) { alert("No historical data to export."); return; }
  const cols = Object.keys(HIST_DATA[0]);
  const header = cols.map(c => `"${c}"`).join(",");
  const rows = HIST_DATA.map(r =>
    cols.map(c => {
      const v = r[c];
      if (v == null) return "";
      if (typeof v === "string") return `"${v.replace(/"/g,'""')}"`;
      return v;
    }).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ff_hist_data_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function importHistCSV() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".csv";
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const lines = ev.target.result.split("\n").filter(l => l.trim());
        if (lines.length < 2) { alert("CSV appears empty."); return; }

        // Parse header
        const rawHeaders = parseCSVRow(lines[0]);
        // Normalize: remove spaces before % (e.g. "TE TGT %" -> "TE TGT%")
        const headers = rawHeaders.map(h => h.replace(/\s+%/g, '%'));

        // Parse rows
        const newData = [];
        for (let i = 1; i < lines.length; i++) {
          const vals = parseCSVRow(lines[i]);
          if (vals.length !== headers.length) continue;
          const row = {};
          headers.forEach((h, j) => {
            const v = vals[j];
            row[h] = (v === "" || v == null) ? null : (isNaN(parseFloat(v)) ? v : v.trim());
          });
          newData.push(row);
        }

        if (newData.length === 0) { alert("No data rows found."); return; }
        if (!confirm(`Replace historical data with ${newData.length} rows from ${file.name}?`)) return;

        // Replace HIST_DATA in place
        HIST_DATA.length = 0;
        newData.forEach(r => HIST_DATA.push(r));

        // Update HIST_COLS to match new headers
        HIST_COLS.length = 0;
        headers.forEach(h => HIST_COLS.push(h));
        // HIST_COLS comes entirely from the CSV headers — no derived columns appended

        saveHistData();
        alert(`Imported ${newData.length} rows successfully.`);
        if (currentPage === "data") renderDataContent();
      } catch(err) {
        alert("Import failed: " + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function parseCSVRow(line) {
  const result = [];
  let cur = "", inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i+1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      result.push(cur.trim()); cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function buildStatMapTable() {
  const cols = Object.keys(COL_DISPLAY);
  if (cols.length === 0) {
    return '<p style="font-size:11px;color:var(--text-3);font-family:var(--font-mono);">No data imported yet. Import a CSV to see column display names here.</p>';
  }
  let html = '<p style="font-size:11px;color:var(--text-3);margin-bottom:8px;font-family:var(--font-mono);">To edit a column abbreviation, right-click its header in the Data tab.</p>';
  html += '<table class="stat-map-table"><thead><tr><th>Column Name</th><th>Displays As</th></tr></thead><tbody>';
  cols.forEach(col => {
    const abbr = COL_DISPLAY[col] || col;
    html += '<tr><td>' + col + '</td><td style="color:var(--accent);font-family:var(--font-mono);">' + abbr + '</td></tr>';
  });
  html += '</tbody></table>';
  return html;
}

function updateColDisplay(col, abbr) {
  COL_DISPLAY[col] = abbr.trim() || col;
  localStorage.setItem('ff_col_display', JSON.stringify(COL_DISPLAY));
  // Re-render data table headers if on data page, and projection table always
  if (currentPage === 'data') renderDataTable();
  if (selectedTeam) renderMain();
}

function updateStatMap(projKey, dataCol) {
  PROJ_TO_DATA[projKey] = dataCol.trim();
  // Not saved to localStorage — PROJ_TO_DATA is always defined in the file
}

function loadStatMap() {
  // PROJ_TO_DATA is always defined in the file — never override from localStorage
  // Only load COL_DISPLAY (user abbreviations) from localStorage
  // Load saved abbreviations
  const savedDisplay = localStorage.getItem('ff_col_display');
  if (savedDisplay) {
    try { Object.assign(COL_DISPLAY, JSON.parse(savedDisplay)); } catch(e) {}
  }
}

function buildScoringSettings() {
  const SCORING_FIELDS = [
    { key: "passYdsPer", label: "Pass Yds / Pt" },
    { key: "passTD",     label: "Pass TD" },
    { key: "passInt",    label: "Interception" },
    { key: "passComp",   label: "Completion" },
    { key: "passIncomp", label: "Incompletion" },
    { key: "rushYdsPer", label: "Rush Yds / Pt" },
    { key: "rushTD",     label: "Rush TD" },
    { key: "recYdsPer",  label: "Rec Yds / Pt" },
    { key: "recTD",      label: "Rec TD" },
    { key: "ppr",        label: "Reception (PPR)" },
    { key: "teBoost",    label: "TE Reception Boost" },
  ];

  const presetTabs = scoringPresets.map((p, i) =>
    `<button class="view-btn ${i === activeScoringPreset ? 'active' : ''}"
      onclick="setActiveScoringPreset(${i})">${p.name}</button>`
  ).join("");

  const sc = getActiveScoring();
  const fields = SCORING_FIELDS.map(f =>
    `<tr>
      <td style="padding:4px 8px;font-size:11px;color:var(--text-2);">${f.label}</td>
      <td style="padding:4px 8px;">
        <input type="number" step="0.5" value="${sc[f.key]}"
          style="width:60px;background:var(--bg-3);border:1px solid var(--border-2);border-radius:3px;padding:2px 4px;font-family:var(--font-mono);font-size:11px;color:var(--text);outline:none;"
          onchange="updateScoringField('${f.key}', this.value)"
          onblur="updateScoringField('${f.key}', this.value)">
      </td>
    </tr>`
  ).join("");

  return `
    <div class="view-toggle" style="margin-bottom:12px;flex-wrap:wrap;gap:4px;">
      ${presetTabs}
      <button class="view-btn" onclick="addScoringPreset()" style="color:var(--accent);">+ New</button>
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <input type="text" value="${sc.name}"
        style="background:var(--bg-3);border:1px solid var(--border-2);border-radius:3px;padding:3px 6px;font-size:11px;color:var(--text);outline:none;width:140px;"
        onchange="renameScoringPreset(this.value)"
        onblur="renameScoringPreset(this.value)">
      ${scoringPresets.length > 1 ? `<button class="add-player-btn" onclick="deleteScoringPreset()" style="font-size:11px;padding:4px 10px;color:var(--red);">Delete</button>` : ""}
    </div>
    <table style="border-collapse:collapse;">
      <tbody>${fields}</tbody>
    </table>`;
}

function setActiveScoringPreset(i) {
  activeScoringPreset = i;
  saveScoringPresets();
  renderSettings();
}

function updateScoringField(key, val) {
  scoringPresets[activeScoringPreset][key] = parseFloat(val) || 0;
  saveScoringPresets();
}

function renameScoringPreset(name) {
  scoringPresets[activeScoringPreset].name = name.trim() || "Preset";
  saveScoringPresets();
  renderSettings();
}

function addScoringPreset() {
  const base = {...getActiveScoring(), name: "New Preset"};
  scoringPresets.push(base);
  activeScoringPreset = scoringPresets.length - 1;
  saveScoringPresets();
  renderSettings();
}

function deleteScoringPreset() {
  if (scoringPresets.length <= 1) return;
  scoringPresets.splice(activeScoringPreset, 1);
  activeScoringPreset = Math.max(0, activeScoringPreset - 1);
  saveScoringPresets();
  renderSettings();
}

function renderSettings() {
  const page = document.getElementById("settings-page");

  const cards = Object.entries(TEAM_LOGOS).map(([team, file]) => {
    const short = team.replace(/^.+ /, "");
    const src = `Football logos/${file}.png`;
    return `<div class="logo-card">
      <img class="logo-card-img" src="${src}" alt="${short}" style="cursor:pointer"
        onclick="openLightbox('${src}','${team}','${file}.png')"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
        onload="this.nextElementSibling.style.display='none';">
      <div class="logo-card-missing" style="display:none;">?</div>
      <div class="logo-card-name">${short}</div>
      <div class="logo-card-file">${file}.png</div>
      <span class="logo-card-status found" id="logo-status-${file}">checking...</span>
    </div>`;
  }).join("");

  const activeTab = page.dataset.activeTab || 'scoring';

  page.innerHTML = `
    <h1>Settings</h1>
    <div class="settings-tabs">
      <button class="settings-tab ${activeTab === 'scoring' ? 'active' : ''}" onclick="switchSettingsTab('scoring')">Scoring</button>
      <button class="settings-tab ${activeTab === 'data' ? 'active' : ''}" onclick="switchSettingsTab('data')">Data</button>
      <button class="settings-tab ${activeTab === 'display' ? 'active' : ''}" onclick="switchSettingsTab('display')">Display</button>
      <button class="settings-tab ${activeTab === 'guide' ? 'active' : ''}" onclick="switchSettingsTab('guide')">Guide</button>
    </div>

    <div class="settings-tab-content ${activeTab === 'scoring' ? 'active' : ''}" id="stab-scoring">
      <div class="settings-section-title">Scoring Settings</div>
      ${buildScoringSettings()}
    </div>

    <div class="settings-tab-content ${activeTab === 'data' ? 'active' : ''}" id="stab-data">
      <div class="settings-section-title">Projections Data</div>
      <p style="font-size:11px;color:var(--text-3);margin-bottom:12px;font-family:var(--font-mono);">
        Export your projections and rankings as a JSON file to back up or share. Import to restore.
      </p>
      <div style="display:flex;gap:10px;margin-bottom:32px;">
        <button class="add-player-btn" onclick="exportData()" style="font-size:12px;padding:8px 16px;">↓ Export data</button>
        <button class="add-player-btn" onclick="importData()" style="font-size:12px;padding:8px 16px;">↑ Import data</button>
      </div>
      <div class="settings-section-title">Account</div>
      <p style="font-size:11px;color:var(--text-3);margin-bottom:12px;font-family:var(--font-mono);">
        Signed in as <strong>${currentUser?.email || '—'}</strong>. Your projections auto-save to the cloud.
      </p>
      <div style="display:flex;gap:10px;margin-bottom:32px;">
        <button class="add-player-btn" onclick="signOut()" style="font-size:12px;padding:8px 16px;color:var(--red,#ef4444);">Sign out</button>
      </div>
      <div class="settings-section-title">Historical Data</div>
      <p style="font-size:11px;color:var(--text-3);margin-bottom:12px;font-family:var(--font-mono);">
        Export historical data as CSV, edit column headers, then re-import to clean up naming conventions.
      </p>
      <div style="display:flex;gap:10px;margin-bottom:32px;">
        <button class="add-player-btn" onclick="exportHistCSV()" style="font-size:12px;padding:8px 16px;">↓ Export historical data (CSV)</button>
        <button class="add-player-btn" onclick="importHistCSV()" style="font-size:12px;padding:8px 16px;">↑ Import historical data (CSV)</button>
        <button class="add-player-btn" onclick="clearHistData()" style="font-size:12px;padding:8px 16px;color:var(--red);border-color:var(--red);">✕ Clear historical data</button>
      </div>
    </div>

    <div class="settings-tab-content ${activeTab === 'guide' ? 'active' : ''}" id="stab-guide">
      <div class="settings-section-title">What you need</div>
      <p style="font-size:11px;color:var(--text-3);margin-bottom:16px;font-family:var(--font-mono);">
        To set up this tool on a new machine, you need four things:
      </p>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:28px;">
        ${[
          { icon: "📄", name: "Z-Projections.html", desc: "The app itself. Open this file in any modern browser — no install required." },
          { icon: "🖼️", name: "Football logos/", desc: "Folder of team logo PNGs. Must sit in the same folder as the HTML file." },
          { icon: "📊", name: "Z-Historical Data.csv", desc: "Historical team stats. Import once via Settings → Data → Import historical data." },
          { icon: "💾", name: "ff_projections_YYYY-MM-DD.json", desc: "Your saved data — projections, rankings, draft board, scoring settings, and more." },
        ].map(f => `<div style="background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:14px 12px;">
          <div style="font-size:20px;margin-bottom:8px;">${f.icon}</div>
          <div style="font-family:var(--font-mono);font-size:10px;font-weight:700;color:var(--text-1);margin-bottom:6px;">${f.name}</div>
          <div style="font-size:10px;color:var(--text-3);font-family:var(--font-mono);line-height:1.5;">${f.desc}</div>
        </div>`).join("")}
      </div>

      <div class="settings-section-title">Setup order</div>
      <p style="font-size:11px;color:var(--text-3);margin-bottom:16px;font-family:var(--font-mono);">Follow these steps in order on a fresh install.</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:28px;">
        ${[
          ["1", "Put all four items in the same folder", "The HTML file, the <strong style='color:var(--text-2)'>Football logos/</strong> folder, and the CSV should all live together. The JSON can be anywhere — you'll browse to it."],
          ["2", "Open Z-Projections.html in your browser", "Double-click the file or drag it into Chrome/Firefox/Safari. No server needed."],
          ["3", "Import your JSON", "Go to <strong style='color:var(--text-2)'>Settings → Data → Import data</strong> and select your JSON file. This restores projections, rankings, draft board, scoring presets, and display settings all at once."],
          ["4", "Import the historical CSV", "Go to <strong style='color:var(--text-2)'>Settings → Data → Import historical data (CSV)</strong> and select the CSV. Only needed once — the data is stored in the browser after that."],
          ["5", "Check logos", "Go to <strong style='color:var(--text-2)'>Settings → Display</strong> and confirm logos show as <em>found</em>. If any are <em>missing</em>, make sure the <strong style='color:var(--text-2)'>Football logos/</strong> folder is in the same directory as the HTML."],
          ["6", "Getting future data updates", "As more teams are completed, updated JSON files will be made available. To load them, go to <strong style='color:var(--text-2)'>Settings → Data → Import data</strong> and select the new JSON — your rankings, projections, draft board, and tier breaks will all update. You don't need to re-import the historical CSV or logos."],
        ].map(([n, title, body]) => `<div style="display:flex;gap:12px;align-items:flex-start;">
          <div style="flex-shrink:0;width:22px;height:22px;border-radius:50%;background:var(--accent);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);margin-top:1px;">${n}</div>
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--text-1);font-family:var(--font-mono);margin-bottom:3px;">${title}</div>
            <div style="font-size:10px;color:var(--text-3);font-family:var(--font-mono);line-height:1.6;">${body}</div>
          </div>
        </div>`).join("")}
      </div>

      <div class="settings-section-title">Backing up your work</div>
      <p style="font-size:11px;color:var(--text-3);font-family:var(--font-mono);line-height:1.6;margin-bottom:8px;">
        Your data lives in the browser's localStorage — it's tied to this file on this machine. It does <strong style="color:var(--text-2)">not</strong> sync across devices or survive a browser data clear.
      </p>
      <p style="font-size:11px;color:var(--text-3);font-family:var(--font-mono);line-height:1.6;">
        Export a fresh JSON regularly via <strong style="color:var(--text-2)">Settings → Data → Export data</strong>. Think of it like hitting save. The JSON captures everything: team projections, player projections, rankings, tier breaks, draft board, scoring presets, cell locks, and column display names.
      </p>
    </div>

    <div class="settings-tab-content ${activeTab === 'display' ? 'active' : ''}" id="stab-display">
      <div class="settings-section-title">Column Display Names</div>
      ${buildStatMapTable()}
      <div class="settings-section-title" style="margin-top:32px;">Team Logos</div>
      <p style="font-size:11px;color:var(--text-3);margin-bottom:16px;font-family:var(--font-mono);">
        Place logo files in <strong style="color:var(--text-2)">Football logos/</strong> in your Downloads folder.
        Expected filename shown below each team.
      </p>
      <div class="logo-grid">${cards}</div>
    </div>
  `;

  // Check load status for each logo
  page.querySelectorAll(".logo-card").forEach(card => {
    const img = card.querySelector("img");
    const statusEl = card.querySelector(".logo-card-status");
    if (img.complete) {
      const loaded = img.naturalWidth > 0;
      statusEl.textContent = loaded ? "found" : "missing";
      statusEl.className = `logo-card-status ${loaded ? "found" : "missing"}`;
    } else {
      img.addEventListener("load",  () => { statusEl.textContent = "found";   statusEl.className = "logo-card-status found"; });
      img.addEventListener("error", () => { statusEl.textContent = "missing"; statusEl.className = "logo-card-status missing"; });
    }
  });
}

function switchSettingsTab(tab) {
  const page = document.getElementById('settings-page');
  page.dataset.activeTab = tab;
  renderSettings();
}

function renderScoringPresetSelector() {
  const el = document.getElementById('scoring-preset-selector');
  if (!el) return;
  const opts = scoringPresets.map((p, i) =>
    `<option value="${i}" ${i === activeScoringPreset ? 'selected' : ''}>${p.name}</option>`
  ).join("");
  el.innerHTML = `<select onchange="setActiveScoringPresetRankings(parseInt(this.value))"
    style="background:var(--bg-3);border:1px solid var(--border-2);border-radius:4px;
           padding:4px 8px;font-size:11px;color:var(--text);cursor:pointer;outline:none;">
    ${opts}
  </select>`;
}

function setActiveScoringPresetRankings(i) {
  activeScoringPreset = i;
  saveScoringPresets();
  renderScoringPresetSelector();
  renderRankings();
}

function setSkillPassMode(val) {
  skillPassMode = val;
  document.getElementById('skill-rushrec').classList.toggle('active', !val);
  document.getElementById('skill-pass').classList.toggle('active', val);
  renderRankings();
}

function setQbRecMode(val) {
  qbRecMode = val;
  document.getElementById('qbrec-pass').classList.toggle('active', !val);
  document.getElementById('qbrec-rec').classList.toggle('active', val);
  renderRankings();
}

function setRankPos(pos) {
  rankPos = pos;
  qbRecMode = false;
  sortCol = null;
  ["QB","RB","WR","TE"].forEach(p => {
    const btn = document.getElementById(`rtab-${p}`);
    btn.className = `pos-tab${pos === p ? ` active active-${p.toLowerCase()}` : ""}`;
  });
  const qbToggle = document.getElementById('qb-rec-toggle');
  if (qbToggle) qbToggle.style.display = pos === 'QB' ? '' : 'none';
  const passBtn = document.getElementById('qbrec-pass');
  const recBtn = document.getElementById('qbrec-rec');
  if (passBtn) passBtn.classList.add('active');
  if (recBtn) recBtn.classList.remove('active');
  const skillToggle = document.getElementById('skill-pass-toggle');
  if (skillToggle) skillToggle.style.display = ['RB','WR','TE'].includes(pos) ? '' : 'none';
  const skillRushRecBtn = document.getElementById('skill-rushrec');
  const skillPassBtn = document.getElementById('skill-pass');
  if (skillRushRecBtn) skillRushRecBtn.classList.add('active');
  if (skillPassBtn) skillPassBtn.classList.remove('active');
  skillPassMode = false;
  saveRankingsState();
  renderRankings();
}

function setRankView(view) {
  rankView = view;
  document.getElementById("vbtn-stats").classList.toggle("active", view === "stats");
  document.getElementById("vbtn-rankings").classList.toggle("active", view === "rankings");
  renderRankings();
}

// ─── Collect all players for a position across all teams ───
function getPlayersForPos(pos) {
  const players = [];
  for (const teamName of Object.keys(TEAMS).flatMap(conf =>
    Object.values(TEAMS[conf]).flat()
  )) {
    const k = tk(teamName);
    if (!state[k]) continue;
    state[k].players.forEach(p => {
      if (p.misc || p.pos !== pos) return;
      if (!p.name || p.name.trim() === "") return;
      players.push({ ...p, team: teamName });
    });
  }
  return players;
}

// ─── Stats columns per position ───
const SKILL_PASS_STAT_COLS = [
  { key: "games",    label: "GP",    grp: "meta" },
  { key: "passAtt",  label: "Att",   grp: "pass" },
  { key: "passComp", label: "Comp",  grp: "pass" },
  { key: "compPct",  label: "Comp%", grp: "pass" },
  { key: "passYds",  label: "P.Yds", grp: "pass" },
  { key: "ypa",      label: "YPA",   grp: "pass" },
  { key: "passTD",   label: "P.TD",  grp: "pass" },
  { key: "tdPct",    label: "TD%",   grp: "pass" },
  { key: "passInt",  label: "Int",   grp: "pass" },
  { key: "intPct",   label: "Int%",  grp: "pass" },
];

const QB_REC_STAT_COLS = [
  { key: "games",    label: "GP",      grp: "meta" },
  { key: "targets",  label: "Tgt",     grp: "recv" },
  { key: "tgtShare", label: "Tgt%",    grp: "recv" },
  { key: "rec",      label: "Rec",     grp: "recv" },
  { key: "catchPct", label: "Catch%",  grp: "recv" },
  { key: "recYds",   label: "Rec.Yds", grp: "recv" },
  { key: "ypr",      label: "Y/Tgt",   grp: "recv" },
  { key: "ypc_rec",  label: "Y/Rec",   grp: "recv" },
  { key: "recTD",    label: "Rec.TD",  grp: "recv" },
];

const POS_STAT_COLS = {
  QB: [
    { key: "games",    label: "GP",     grp: "meta" },
    { key: "passAtt",  label: "Att",    grp: "pass" },
    { key: "passComp", label: "Comp",   grp: "pass" },
    { key: "compPct",  label: "Comp%",  grp: "pass" },
    { key: "passYds",  label: "P.Yds",  grp: "pass" },
    { key: "ypa",      label: "YPA",    grp: "pass" },
    { key: "passTD",   label: "P.TD",   grp: "pass" },
    { key: "tdPct",    label: "TD%",    grp: "pass" },
    { key: "passInt",  label: "Int",    grp: "pass" },
    { key: "intPct",   label: "Int%",   grp: "pass" },
    { key: "rushAtt",  label: "Att",    grp: "rush" },
    { key: "rushYds",  label: "RYds", grp: "rush" },
    { key: "ypc",      label: "YPC",    grp: "rush" },
    { key: "rushShare",label: "Ru.Sh%", grp: "rush" },
    { key: "rushTD",   label: "RTD",  grp: "rush" },
  ],
  RB: [
    { key: "games",    label: "GP",      grp: "meta" },
    { key: "rushAtt",  label: "Att",     grp: "rush" },
    { key: "rushYds",  label: "RYds",  grp: "rush" },
    { key: "ypc",      label: "YPC",     grp: "rush" },
    { key: "rushShare",label: "Ru.Sh%",  grp: "rush" },
    { key: "rushTD",   label: "RTD",   grp: "rush" },
    { key: "targets",  label: "Tgt",     grp: "recv" },
    { key: "tgtShare", label: "Tgt%",    grp: "recv" },
    { key: "rec",      label: "Rec",     grp: "recv" },
    { key: "catchPct", label: "Catch%",  grp: "recv" },
    { key: "recYds",   label: "Rec.Yds", grp: "recv" },
    { key: "ypr",      label: "Y/Tgt",   grp: "recv" },
    { key: "ypc_rec",  label: "Y/Rec",   grp: "recv" },
    { key: "recTD",    label: "Rec.TD",  grp: "recv" },
  ],
  WR: [
    { key: "games",    label: "GP",      grp: "meta" },
    { key: "targets",  label: "Tgt",     grp: "recv" },
    { key: "tgtShare", label: "Tgt%",    grp: "recv" },
    { key: "rec",      label: "Rec",     grp: "recv" },
    { key: "catchPct", label: "Catch%",  grp: "recv" },
    { key: "recYds",   label: "Rec.Yds", grp: "recv" },
    { key: "ypr",      label: "Y/Tgt",   grp: "recv" },
    { key: "ypc_rec",  label: "Y/Rec",   grp: "recv" },
    { key: "recTD",    label: "Rec.TD",  grp: "recv" },
    { key: "rushAtt",  label: "Att",     grp: "rush" },
    { key: "rushYds",  label: "RYds",  grp: "rush" },
    { key: "ypc",      label: "YPC",     grp: "rush" },
    { key: "rushShare",label: "Ru.Sh%",  grp: "rush" },
    { key: "rushTD",   label: "RTD",   grp: "rush" },
  ],
  TE: [
    { key: "games",    label: "GP",      grp: "meta" },
    { key: "targets",  label: "Tgt",     grp: "recv" },
    { key: "tgtShare", label: "Tgt%",    grp: "recv" },
    { key: "rec",      label: "Rec",     grp: "recv" },
    { key: "catchPct", label: "Catch%",  grp: "recv" },
    { key: "recYds",   label: "Rec.Yds", grp: "recv" },
    { key: "ypr",      label: "Y/Tgt",   grp: "recv" },
    { key: "ypc_rec",  label: "Y/Rec",   grp: "recv" },
    { key: "recTD",    label: "Rec.TD",  grp: "recv" },
    { key: "rushAtt",  label: "Att",     grp: "rush" },
    { key: "rushYds",  label: "RYds",  grp: "rush" },
    { key: "ypc",      label: "YPC",     grp: "rush" },
    { key: "rushShare",label: "Ru.Sh%",  grp: "rush" },
    { key: "rushTD",   label: "RTD",   grp: "rush" },
  ],
};

function getTeamPassAtt(teamName) {
  const k = tk(teamName);
  if (!state[k]) return 0;
  return parseFloat(state[k].teamStats.passAtt || 0);
}

function enrichPlayer(p) {
  const data = ensureTeam(p.team);
  const derived = calcDerived(p, data);
  const stats = { ...p.stats, ...derived };
  return { ...p, stats };
}

// ─── Rankings state (order + tiers per position) ───
function getRankingsState() {
  try { return JSON.parse(localStorage.getItem("ff_rankings_v1") || "{}"); } catch(e) { return {}; }
}
function saveRankingsState() {
  try { localStorage.setItem("ff_rankings_v1", JSON.stringify(rankingsState)); } catch(e) {}
}
let rankingsState = getRankingsState();
// rankingsState[pos] = { order: [id, id, ...], tiers: [afterIndex, afterIndex, ...] }

function getRankOrder(pos, players) {
  const rs = rankingsState[pos];
  if (!rs || !rs.order) return players;
  const idMap = {};
  players.forEach(p => { idMap[p.id] = p; });
  const ordered = rs.order.map(id => idMap[id]).filter(Boolean);
  const ranked = new Set(rs.order);
  players.forEach(p => { if (!ranked.has(p.id)) ordered.push(p); });
  return ordered;
}

function getTiers(pos) {
  return (rankingsState[pos] && rankingsState[pos].tiers) ? [...rankingsState[pos].tiers] : [];
}

function setOrder(pos, ids) {
  if (!rankingsState[pos]) rankingsState[pos] = { order: [], tiers: [] };
  rankingsState[pos].order = ids;
  saveRankingsState();
}

function setTiers(pos, tiers) {
  if (!rankingsState[pos]) rankingsState[pos] = { order: [], tiers: [] };
  rankingsState[pos].tiers = tiers;
  saveRankingsState();
}

// ─── Render rankings page ───
function renderRankings() {
  const content = document.getElementById("rankings-content");
  const players = getPlayersForPos(rankPos).map(enrichPlayer);

  if (players.length === 0) {
    content.innerHTML = `<div class="no-players">No ${rankPos}s found — add players in the Projections page first.</div>`;
    return;
  }

  if (rankView === "stats") renderStatsView(content, players);
  else renderRankingsView(content, players);
}

// ─── Stats view ───
function renderStatsView(content, players) {
  const isSkill = ["RB","WR","TE"].includes(rankPos);
  const cols = (rankPos === "QB" && qbRecMode) ? QB_REC_STAT_COLS
    : (isSkill && skillPassMode) ? SKILL_PASS_STAT_COLS
    : POS_STAT_COLS[rankPos];
  if (!sortCol) sortCol = cols[0].key;

  const sorted = [...players].sort((a, b) => {
    const getVal = p => {
      if (sortCol === "fpts") return parseFloat(calcFpts(p).fpts || 0);
      if (sortCol === "fptsPerGame") { const v = calcFpts(p).fptsPerGame; return v === "—" ? 0 : parseFloat(v || 0); }
      return parseFloat(p.stats[sortCol] || 0);
    };
    return sortAsc ? getVal(a) - getVal(b) : getVal(b) - getVal(a);
  });

  const fptsCol = { key: "fpts", label: "Fpts" };
  const fptsPGCol = { key: "fptsPerGame", label: "Fpts/G" };
  const allCols = [...cols, fptsCol, fptsPGCol];

  const grpColor = { pass: "var(--blue)", recv: "var(--amber)", rush: "var(--accent)", meta: "var(--text-3)", fpts: "var(--accent)" };
  const headers = allCols.map(c => {
    const grp = c.key === "fpts" || c.key === "fptsPerGame" ? "fpts" : (c.grp || "meta");
    const color = grpColor[grp] || "";
    return `<th class="${sortCol === c.key ? (sortAsc ? "sorted asc" : "sorted") : ""}"
        style="${color ? "color:" + color + ";" : ""}"
        onclick="sortStats('${c.key}')">${c.label}</th>`;
  }).join("");

  const rows = sorted.map(p => {
    const { fpts, fptsPerGame } = calcFpts(p);
    const statsWithFpts = { ...p.stats, fpts, fptsPerGame };
    const cells = allCols.map(c => {
      const v = statsWithFpts[c.key];
      if (v === null || v === undefined || v === "") return `<td class="empty">—</td>`;
      const isFpts = c.key === "fpts" || c.key === "fptsPerGame";
      const isPct = c.key === "tgtShare" || c.key === "compPct" || c.key === "catchPct" || c.key === "tdPct" || c.key === "intPct" || c.key === "rushShare";
      const disp = isFpts ? parseFloat(v).toFixed(1) : isPct ? `${parseFloat(v).toFixed(1)}%` : Math.round(parseFloat(v));
      return `<td${isFpts ? ' style="font-weight:600;color:var(--accent);"' : ""}>${disp}</td>`;
    }).join("");
    const short = p.team.replace(/^.+ /, "");
    return `<tr><td>${p.name}</td><td>${short}</td>${cells}</tr>`;
  }).join("");

  content.innerHTML = `
    <div class="stats-table-wrap">
      <table class="stats-table">
        <thead><tr>
          <th>Player</th><th>Team</th>${headers}
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="sort-hint">Click any column header to sort</p>`;
}

function sortStats(col) {
  if (sortCol === col) sortAsc = !sortAsc;
  else { sortCol = col; sortAsc = false; }
  renderRankings();
}

// ─── Rankings view ───

function renderRankingsView(content, players) {
  const ordered = getRankOrder(rankPos, players);
  const tierIds = getTiers(rankPos); // player IDs that start a new tier
  const isSkill = ["RB","WR","TE"].includes(rankPos);
  const cols = (rankPos === "QB" && qbRecMode) ? QB_REC_STAT_COLS
    : (isSkill && skillPassMode) ? SKILL_PASS_STAT_COLS
    : POS_STAT_COLS[rankPos];

  const headerCols = [...cols, { key: "fpts", label: "Fpts", grp: "fpts" }, { key: "fptsPerGame", label: "Fpts/G", grp: "fpts" }];
  const rankGrpColor = { pass: "var(--blue)", recv: "var(--amber)", rush: "var(--accent)", meta: "var(--text-3)", fpts: "var(--accent)" };
  const headerCells = headerCols.map(c => {
    const color = rankGrpColor[c.grp || "meta"] || "var(--text-3)";
    return `<div class="rank-stat"><div class="rank-stat-lbl" style="color:${color};">${c.label}</div></div>`;
  }).join("");

  let html = `<div class="rankings-list" id="rankings-list">
    <div class="rank-row" style="cursor:default;background:var(--bg-3);border-bottom:1px solid var(--border-2);pointer-events:none;position:sticky;top:0;z-index:10;">
      <span class="rank-num"></span>
      <div style="flex:0 0 12%;font-size:10px;color:var(--text-3);letter-spacing:0.08em;text-transform:uppercase;">Player</div>
      <span class="rank-team" style="font-size:10px;color:var(--text-3);letter-spacing:0.08em;text-transform:uppercase;">Team</span>
      <div class="rank-stats">${headerCells}</div>
    </div>`;

  let tierCount = 1;

  ordered.forEach((p, i) => {
    const isTierLeader = tierIds.includes(p.id);
    if (isTierLeader) {
      tierCount++;
      html += `<div class="tier-divider" data-tier-player-id="${p.id}"
        draggable="true"
        ondragstart="onTierDragStart(event,'${p.id}')"
        ondragover="onDragOver(event,this,${i})"
        ondragleave="onDragLeave(event)"
        ondrop="onDrop(event,'tier',${i})"
        title="Drag to move tier break">
        <div class="tier-line"></div>
        <span class="tier-label">Tier ${tierCount}</span>
        <div class="tier-line"></div>
      </div>`;
    }

    const { fpts, fptsPerGame } = calcFpts(p);
    const statsWithFpts = { ...p.stats, fpts, fptsPerGame };
    const allStatCols = [...cols, { key: "fpts", label: "Fpts" }, { key: "fptsPerGame", label: "Fpts/G" }];
    const statCells = allStatCols.map(c => {
      const v = statsWithFpts[c.key];
      const isFpts = c.key === "fpts" || c.key === "fptsPerGame";
      const isPct = ["tgtShare","compPct","catchPct","tdPct","intPct","rushShare"].includes(c.key);
      const disp = (v === null || v === undefined || v === "") ? "—" :
        isFpts ? parseFloat(v).toFixed(1) :
        isPct ? `${parseFloat(v).toFixed(1)}%` : Math.round(parseFloat(v));
      const muted = disp === "—" ? "color:var(--text-3);" : "";
      const accent = isFpts ? "color:var(--accent);font-weight:500;" : "";
      return `<div class="rank-stat"><div class="rank-stat-val" style="${muted}${accent}">${disp}</div></div>`;
    }).join("");

    const short = p.team.replace(/^.+ /, "");
    html += `<div class="rank-row${isTierLeader ? ' tier-leader' : ''}" data-player-idx="${i}" data-player-id="${p.id}"
      draggable="true"
      ondragstart="onPlayerDragStart(event,${i})"
      ondragover="onDragOver(event,this,${i})"
      ondragleave="onDragLeave(event)"
      ondrop="onDrop(event,'player',${i})"
      ondragend="onDragEnd(event)">
      <span class="rank-num">${i + 1}</span>
      <div style="flex:0 0 12%;min-width:0;overflow:hidden;"><div class="rank-name">${p.name}</div></div>
      <span class="rank-team">${short}</span>
      <div class="rank-stats">${statCells}</div>
    </div>`;
  });

  html += `</div>
    <div style="padding:12px 10px 0;">
      <button class="add-player-btn" onclick="addTierAtEnd()">+ add tier break</button>
    </div>`;

  content.innerHTML = html;
}

function addTierAtEnd() {
  const players = getPlayersForPos(rankPos).map(enrichPlayer);
  const ordered = getRankOrder(rankPos, players);
  const tiers = getTiers(rankPos);
  if (ordered.length > 1) {
    const lastId = ordered[ordered.length - 1].id;
    if (!tiers.includes(lastId)) {
      tiers.push(lastId);
      setTiers(rankPos, tiers);
    }
  }
  renderRankings();
}

// ─── Rankings drag and drop ───
let _autoScrollInterval = null;

function _startAutoScroll(e) {
  const container = document.getElementById('rankings-content');
  if (!container) return;
  if (_autoScrollInterval) clearInterval(_autoScrollInterval);
  _autoScrollInterval = setInterval(() => {
    const rect = container.getBoundingClientRect();
    const zone = 60;
    const speed = 12;
    if (e.clientY < rect.top + zone) container.scrollTop -= speed;
    else if (e.clientY > rect.bottom - zone) container.scrollTop += speed;
  }, 16);
}

function _stopAutoScroll() {
  if (_autoScrollInterval) { clearInterval(_autoScrollInterval); _autoScrollInterval = null; }
}

let _dragSrcIdx = null;
let _dragSrcType = null; // "player" | "tier"
let _dragSrcTierId = null;
let _dropIndicatorEl = null;
let _dropIndicatorClass = null;

function _clearDropIndicator() {
  if (_dropIndicatorEl) {
    _dropIndicatorEl.classList.remove('drop-above', 'drop-below');
    _dropIndicatorEl = null;
    _dropIndicatorClass = null;
  }
}

function _setDropIndicator(el, cls) {
  if (_dropIndicatorEl === el && _dropIndicatorClass === cls) return;
  _clearDropIndicator();
  el.classList.add(cls);
  _dropIndicatorEl = el;
  _dropIndicatorClass = cls;
}

function onPlayerDragStart(e, idx) {
  _dragSrcIdx = idx;
  _dragSrcType = "player";
  e.dataTransfer.effectAllowed = "move";
  const el = e.currentTarget;
  const ghost = el.cloneNode(true);
  ghost.style.cssText = "opacity:0.25;position:absolute;top:-1000px;width:" + el.offsetWidth + "px;border-radius:4px;";
  document.body.appendChild(ghost);
  e.dataTransfer.setDragImage(ghost, e.offsetX, e.offsetY);
  setTimeout(() => { document.body.removeChild(ghost); el.classList.add("dragging"); }, 0);
}

function onTierDragStart(e, tierId) {
  _dragSrcTierId = tierId;
  _dragSrcType = "tier";
  e.dataTransfer.effectAllowed = "move";
}

function onDragOver(e, el, idx) {
  e.preventDefault();
  _startAutoScroll(e);
  e.dataTransfer.dropEffect = "move";
  const rect = el.getBoundingClientRect();
  const inTopHalf = e.clientY < rect.top + rect.height / 2;
  _setDropIndicator(el, inTopHalf ? "drop-above" : "drop-below");
}

function onDragLeave(e) {
  // Only clear if leaving to outside the rankings list
  const related = e.relatedTarget;
  const list = document.getElementById("rankings-list");
  if (!list || !list.contains(related)) _clearDropIndicator();
}

function onDrop(e, targetType, targetIdx) {
  e.preventDefault();
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const inTopHalf = e.clientY < rect.top + rect.height / 2;
  _clearDropIndicator();

  const players = getPlayersForPos(rankPos).map(enrichPlayer);
  const ordered = getRankOrder(rankPos, players);
  let tiers = getTiers(rankPos); // array of player IDs that start a tier

  if (_dragSrcType === "player" && _dragSrcIdx !== null) {
    const fromIdx = _dragSrcIdx;
    let toIdx = inTopHalf ? targetIdx : targetIdx + 1;
    if (toIdx === fromIdx || toIdx === fromIdx + 1) { renderRankings(); return; }

    const movedPlayer = ordered[fromIdx];
    const playerAfterMoved = ordered[fromIdx + 1]; // player behind moved player before move
    const originalTargetPlayer = ordered[targetIdx]; // player at drop target before move

    // Rule 1: if moved player was a tier leader, player behind them inherits the anchor
    let newTiers = [...tiers];
    if (newTiers.includes(movedPlayer.id)) {
      newTiers = newTiers.filter(id => id !== movedPlayer.id);
      if (playerAfterMoved && !newTiers.includes(playerAfterMoved.id)) {
        newTiers.push(playerAfterMoved.id);
      }
    }

    // Rule 2: if dropped before an existing tier leader, moved player becomes new tier leader
    if (inTopHalf && newTiers.includes(originalTargetPlayer.id)) {
      newTiers = newTiers.filter(id => id !== originalTargetPlayer.id);
      newTiers.push(movedPlayer.id);
    }

    // Apply the reorder
    ordered.splice(fromIdx, 1);
    if (fromIdx < toIdx) toIdx--;
    ordered.splice(toIdx, 0, movedPlayer);

    setOrder(rankPos, ordered.map(p => p.id));
    setTiers(rankPos, newTiers);

  } else if (_dragSrcType === "player" && targetType === "tier") {
    // Player dropped on tier divider — treat as drop on the player row above (bottom half)
    // i.e. insert after the last player in the tier above
    const fromIdx = _dragSrcIdx;
    let toIdx = inTopHalf ? targetIdx : targetIdx + 1;
    if (toIdx === fromIdx || toIdx === fromIdx + 1) { renderRankings(); return; }

    const movedPlayer = ordered[fromIdx];
    const playerAfterMoved = ordered[fromIdx + 1];
    const originalTargetPlayer = ordered[targetIdx];

    let newTiers = [...tiers];
    if (newTiers.includes(movedPlayer.id)) {
      newTiers = newTiers.filter(id => id !== movedPlayer.id);
      if (playerAfterMoved && !newTiers.includes(playerAfterMoved.id)) {
        newTiers.push(playerAfterMoved.id);
      }
    }
    if (inTopHalf && originalTargetPlayer && newTiers.includes(originalTargetPlayer.id)) {
      newTiers = newTiers.filter(id => id !== originalTargetPlayer.id);
      newTiers.push(movedPlayer.id);
    }

    ordered.splice(fromIdx, 1);
    if (fromIdx < toIdx) toIdx--;
    ordered.splice(toIdx, 0, movedPlayer);

    setOrder(rankPos, ordered.map(p => p.id));
    setTiers(rankPos, newTiers);

  } else if (_dragSrcType === "tier" && _dragSrcTierId !== null) {
    const newTiers = tiers.filter(id => id !== _dragSrcTierId);
    // Place tier break: if dropping before targetIdx player, that player starts new tier
    // if dropping after, the next player starts new tier
    const anchorIdx = inTopHalf ? targetIdx : targetIdx + 1;
    if (anchorIdx > 0 && anchorIdx < ordered.length) {
      const anchorId = ordered[anchorIdx].id;
      if (!newTiers.includes(anchorId)) newTiers.push(anchorId);
    }
    setTiers(rankPos, newTiers);
  }

  renderRankings();
}

function onDragEnd(e) {
  document.querySelectorAll(".dragging").forEach(el => el.classList.remove("dragging"));
  _clearDropIndicator();
  _stopAutoScroll();
  _dragSrcIdx = null;
  _dragSrcType = null;
  _dragSrcTierId = null;
}


function onRowDragStart(e, id) {
  rowDragId = id;
  e.dataTransfer.effectAllowed = "move";
  setTimeout(() => {
    const el = document.querySelector(`tr[data-id="${id}"]`);
    if (el) el.classList.add("row-dragging");
  }, 0);
}

function onRowDragOver(e, el) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  clearRowDropLines();
  const rect = el.getBoundingClientRect();
  if (e.clientY < rect.top + rect.height / 2) el.classList.add("row-drop-above");
  else el.classList.add("row-drop-below");
}

function onRowDragLeave(e) {
  clearRowDropLines();
}

function clearRowDropLines() {
  document.querySelectorAll(".row-drop-above,.row-drop-below").forEach(el => {
    el.classList.remove("row-drop-above","row-drop-below");
  });
}

function onRowDrop(e, el, targetId) {
  e.preventDefault();
  const rect = el.getBoundingClientRect();
  const dropBefore = e.clientY < rect.top + rect.height / 2;
  clearRowDropLines();
  if (!rowDragId || rowDragId === targetId) return;

  pushUndo();
  const data = ensureTeam(selectedTeam);
  const srcIdx = data.players.findIndex(p => p.id === rowDragId);
  const tgtIdx = data.players.findIndex(p => p.id === targetId);
  if (srcIdx === -1 || tgtIdx === -1) return;

  const srcPlayer = data.players[srcIdx];
  const tgtPlayer = data.players[tgtIdx];

  // Determine target position group
  const newPos = tgtPlayer.pos;

  // Remove from current position
  data.players.splice(srcIdx, 1);

  // Recalculate target index after removal
  const newTgtIdx = data.players.findIndex(p => p.id === targetId);
  const insertAt = dropBefore ? newTgtIdx : newTgtIdx + 1;

  // Update position if crossing groups
  srcPlayer.pos = newPos;

  data.players.splice(insertAt, 0, srcPlayer);
  saveState();
  renderMain();
}

function onRowDragEnd() {
  document.querySelectorAll(".row-dragging").forEach(el => el.classList.remove("row-dragging"));
  clearRowDropLines();
}

// ─── Cell navigation ───
// ─── Stat cell editing (div/input swap) ───
let activeStatCell = null;

function selectStatCell(td) {
  if (activeStatCell && activeStatCell !== td) commitStatCell(activeStatCell);
  document.querySelectorAll("td.stat-cell.cell-selected").forEach(c => c.classList.remove("cell-selected"));
  activeStatCell = td;
  td.classList.add("cell-selected");
}

function openStatCell(td, initialChar) {
  if (activeStatCell && activeStatCell !== td) commitStatCell(activeStatCell);
  document.querySelectorAll("td.stat-cell.cell-selected").forEach(c => c.classList.remove("cell-selected"));
  activeStatCell = td;
  td.classList.add("cell-selected");

  const playerId = td.dataset.playerId;
  const key = td.dataset.key;
  const data = ensureTeam(selectedTeam);
  const p = data.players.find(p => p.id === playerId);
  const currentVal = p ? (p.stats[key] !== undefined ? p.stats[key] : "") : "";

  const display = td.querySelector(".stat-display");
  display.style.display = "none";

  const input = document.createElement("input");
  input.type = "number";
  input.className = "stat-input";
  input.min = "0";
  input.value = initialChar !== undefined ? initialChar : currentVal;
  td.appendChild(input);
  input.focus();

  input.addEventListener("input", () => {
    onPlayerStat(playerId, key, input.value);
  });

  input.onblur = () => {
    commitStatCell(td);
  };

  input.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopImmediatePropagation();
      const val = input.value;
      const display = td.querySelector(".stat-display");
      input.onblur = null;
      input.remove();
      display.textContent = val;
      display.style.display = "";
      activeStatCell = td;
      td.classList.add("cell-selected");
      return;
    }
    if (e.key === "Enter") { e.preventDefault(); e.stopImmediatePropagation(); commitStatCell(td); navigateStatCell(td, e.shiftKey ? "up" : "down"); return; }
    if (e.key === "Tab")   { e.preventDefault(); e.stopImmediatePropagation(); commitStatCell(td); navigateStatCell(td, e.shiftKey ? "left" : "right"); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); e.stopImmediatePropagation(); commitStatCell(td); navigateStatCell(td, "down"); return; }
    if (e.key === "ArrowUp")   { e.preventDefault(); e.stopImmediatePropagation(); commitStatCell(td); navigateStatCell(td, "up"); return; }
  });
}

function commitStatCell(td) {
  const input = td.querySelector("input.stat-input");
  if (!input) return;

  const playerId = td.dataset.playerId;
  const key = td.dataset.key;
  onPlayerStat(playerId, key, input.value);

  const display = td.querySelector(".stat-display");
  display.textContent = input.value;
  display.style.display = "";

  input.onblur = null;
  input.remove();
  td.classList.remove("cell-selected");
  if (activeStatCell === td) activeStatCell = null;

  // Refresh pos total row for this player's position
  refreshPosTotalRow(playerId);
  // Refresh derived cells for this player's row
  refreshPlayerDerivedCells(playerId);
}

function refreshPlayerDerivedCells(playerId) {
  if (!selectedTeam) return;
  const data = ensureTeam(selectedTeam);
  const p = data.players.find(p => p.id === playerId);
  if (!p) return;
  const row = document.querySelector(`tr[data-id="${playerId}"]`);
  if (!row) return;
  const cols = getOrderedCols(projView);
  const derived = calcDerived(p, data);
  const derivedCols = cols.filter(c => c.derived);
  row.querySelectorAll("td.derived-cell").forEach((cell, i) => {
    const c = derivedCols[i];
    if (!c) return;
    const v = derived[c.key];
    const suffix = c.label.endsWith("%") ? "%" : "";
    cell.textContent = (v === undefined || v === null) ? "—" : `${v}${suffix}`;
  });
}

function refreshPosTotalRow(playerId) {
  if (!selectedTeam) return;
  const data = ensureTeam(selectedTeam);
  const p = data.players.find(p => p.id === playerId);
  if (!p) return;
  const allCols = getOrderedCols(projView);
  const actualVisiblePos = (projView === "pass" ? ["QB"] : ["QB","RB","WR","TE"]);
  const cols = allCols.filter(c => !c.pos || c.pos.some(pos => actualVisiblePos.includes(pos)));
  const grpCls = `grp-${p.pos.toLowerCase()}`;
  const newHtml = buildPosTotal(data, p.pos, cols, grpCls);
  // Find and replace the pos total row for this position
  const rows = document.querySelectorAll("tbody tr.pos-total-row");
  rows.forEach(row => {
    if (row.classList.contains(grpCls)) {
      row.outerHTML = newHtml;
    }
  });
}

function navigateStatCell(td, direction) {
  const currentRow = td.closest("tr");
  const tds = Array.from(currentRow.querySelectorAll("td"));
  const tdIdx = tds.indexOf(td);

  if (direction === "right" || direction === "left") {
    const rowCells = Array.from(currentRow.querySelectorAll("td.stat-cell"));
    const idx = rowCells.indexOf(td);
    const next = direction === "right" ? rowCells[idx + 1] : rowCells[idx - 1];
    if (next) { selectStatCell(next); return; }
  }

  const moveDown = direction === "down";
  let targetRow = moveDown ? currentRow.nextElementSibling : currentRow.previousElementSibling;
  while (targetRow && (
    targetRow.classList.contains("pos-group-header") ||
    targetRow.classList.contains("pos-total-row") ||
    targetRow.classList.contains("totals-divider-row")
  )) {
    targetRow = moveDown ? targetRow.nextElementSibling : targetRow.previousElementSibling;
  }
  if (!targetRow) return;
  const nextTds = Array.from(targetRow.querySelectorAll("td"));
  const targetTd = nextTds[tdIdx];
  if (targetTd && targetTd.classList.contains("stat-cell")) selectStatCell(targetTd);
}

function onStatCellClick(e, td) { selectStatCell(td); }
function onStatCellDblClick(e, td) {
  openStatCell(td, undefined);
}

// Keyboard when a cell is selected but not open
document.addEventListener("keydown", e => {
  if (!activeStatCell) return;
  if (activeStatCell.querySelector("input.stat-input")) return;

  if (e.key === "Escape") {
    if (activeStatCell && activeStatCell.querySelector("input.stat-input")) return; // let input handler deal with it
    activeStatCell.classList.remove("cell-selected");
    activeStatCell = null;
    return;
  }
  if (e.key === "Enter")  { e.preventDefault(); openStatCell(activeStatCell, undefined); return; }
  if (e.key === "Tab")    { e.preventDefault(); navigateStatCell(activeStatCell, e.shiftKey ? "left" : "right"); return; }
  if (e.key === "ArrowDown")  { e.preventDefault(); navigateStatCell(activeStatCell, "down"); return; }
  if (e.key === "ArrowUp")    { e.preventDefault(); navigateStatCell(activeStatCell, "up"); return; }
  if (e.key === "ArrowRight") { e.preventDefault(); navigateStatCell(activeStatCell, "right"); return; }
  if (e.key === "ArrowLeft")  { e.preventDefault(); navigateStatCell(activeStatCell, "left"); return; }
  if (e.key === "Delete" || e.key === "Backspace") {
    e.preventDefault();
    const playerId = activeStatCell.dataset.playerId;
    const key = activeStatCell.dataset.key;
    onPlayerStat(playerId, key, "");
    activeStatCell.querySelector(".stat-display").textContent = "";
    refreshPlayerDerivedCells(playerId);
    refreshPosTotalRow(playerId);
    return;
  }
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    openStatCell(activeStatCell, e.key);
  }
});

// Click outside → deselect
document.addEventListener("mousedown", e => {
  if (!activeStatCell) return;
  if (!e.target.closest("td.stat-cell")) {
    commitStatCell(activeStatCell);
    document.querySelectorAll("td.stat-cell.cell-selected").forEach(c => c.classList.remove("cell-selected"));
    activeStatCell = null;
  }
});

// ─── Logo auto-crop ───
function autoCropLogo(img) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let top = height, bottom = 0, left = width, right = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const a = data[idx + 3];
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        // Consider pixel "content" if it's not transparent and not near-white
        const isContent = a > 20 && !(r > 240 && g > 240 && b > 240);
        if (isContent) {
          if (y < top) top = y;
          if (y > bottom) bottom = y;
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }

    if (right <= left || bottom <= top) return; // nothing found

    const pad = 4; // small padding so logo doesn't touch edges
    top    = Math.max(0, top - pad);
    bottom = Math.min(height, bottom + pad);
    left   = Math.max(0, left - pad);
    right  = Math.min(width, right + pad);

    const cropW = right - left;
    const cropH = bottom - top;
    const cropped = document.createElement("canvas");
    cropped.width = cropW;
    cropped.height = cropH;
    cropped.getContext("2d").drawImage(canvas, left, top, cropW, cropH, 0, 0, cropW, cropH);
    img.src = cropped.toDataURL("image/png");
  } catch(e) {
    // Cross-origin or other error — leave as-is
  }
}


// ─── Historical data ───
const ABBR_TO_NICKNAME = {
  ARI:"Cardinals", ATL:"Falcons", BAL:"Ravens", BUF:"Bills",
  CAR:"Panthers", CHI:"Bears", CIN:"Bengals", CLE:"Browns",
  DAL:"Cowboys", DEN:"Broncos", DET:"Lions", GB:"Packers",
  HOU:"Texans", IND:"Colts", JAX:"Jaguars", KC:"Chiefs",
  LAC:"Chargers", LAR:"Rams", LV:"Raiders", MIA:"Dolphins",
  MIN:"Vikings", NE:"Patriots", NO:"Saints", NYG:"Giants",
  NYJ:"Jets", PHI:"Eagles", PIT:"Steelers", SEA:"Seahawks",
  SF:"49ers", TB:"Buccaneers", TEN:"Titans", WSH:"Commanders"
};
// Maps projection stat key -> HIST_DATA column name
const PROJ_TO_DATA = {
  totalPlays:    "Total Plays",
  passPlays:     "Pass Plays",
  rushPlays:     "Rush Plays",
  passRate:      "Pass Play%",
  rushRate:      "Rush Play%",
  targets:       "Targets",
  deadPassPlays: "Dead Plays",
  passAtt:       "Pass Attempts",
  sacks:         "Sacks",
  passComp:      "Completions",
  compPct:       "COMP%",
  passYds:       "Gross Pass Yards",
  yardsPerSack:  "Yards/Sack",
  sackYds:       "Sack Yards",
  netPassYds:    "Net Pass Yards",
  passTD:        "Pass Touchdowns",
  passInt:       "Interceptions",
  tdPct:         "Touchdown%",
  intPct:        "Interception%",
  ypa:           "YPA",
  tgtPct:        "Target%",
  wrTgt:         "WR Targets",
  wrTgtPct:      "WR TGT%",
  teTgt:         "TE Targets",
  teTgtPct:      "TE TGT%",
  rbTgt:         "RB Targets",
  rbTgtPct:      "RB TGT%",
  rushAtt:       "Rush Plays",  // same data as rush plays, different display name
  rushYds:       "Rush Yards",
  ypc:           "YPC",
  rushTD:        "Rush Touchdowns",
  grossTotalYds: "Gross Yards",
  totalYds:      "Net Yards",
  totalTD:       "TOTAL Touchdowns",
  nyTD:          "Net Yards/Touchdown",
};

// Groups of related stats to show as context in the history panel
const PROJ_STAT_GROUPS = {
  plays:   ["totalPlays","passPlays","rushPlays","passRate","rushRate"],
  pass:    ["passAtt","targets","deadPassPlays","sacks","passComp","compPct","passYds","yardsPerSack","sackYds","netPassYds","passTD","passInt","tdPct","intPct","ypa"],
  tgt:     ["tgtPct","wrTgt","wrTgtPct","teTgt","teTgtPct","rbTgt","rbTgtPct"],
  rush:    ["rushAtt","rushYds","ypc","rushTD"],
  summary: ["grossTotalYds","totalYds","totalTD","nyTD"],
};


const COL_KEY_MAP = {
  
};
function dataKey(col) { return COL_KEY_MAP[col] || col; }

const COL_DISPLAY = {};
function displayCol(col) { return COL_DISPLAY[col] || col; }

// Get display label for a player stat key — uses COL_DISPLAY via PROJ_TO_DATA if available
function playerColLabel(c) {
  if (c.key === "rushAtt") return c.label;
  const dataCol = PROJ_TO_DATA[c.key];
  if (dataCol && COL_DISPLAY[dataCol]) return COL_DISPLAY[dataCol];
  return c.label;
}

const HIST_COLS = [];
const HIST_DATA = [];

// ─── Data page state ───
let dataView = "table";
let dataYears = new Set();
let dataYearsNone = false; // true when user has explicitly deselected everything
let dataTeams = new Set();
let dataTeamsNone = false;
let histPanelKey = null; // currently open stat key

// ─── Scoring settings ───
const DEFAULT_SCORING_PRESETS = [
  {
    name: "Half PPR",
    passYdsPer: 25, passTD: 4, passInt: -2, passComp: 0, passIncomp: 0,
    rushYdsPer: 10, rushTD: 6,
    recYdsPer: 10, recTD: 6, ppr: 0.5, teBoost: 0,
  },
  {
    name: "Full PPR",
    passYdsPer: 25, passTD: 4, passInt: -2, passComp: 0, passIncomp: 0,
    rushYdsPer: 10, rushTD: 6,
    recYdsPer: 10, recTD: 6, ppr: 1, teBoost: 0,
  },
  {
    name: "Standard",
    passYdsPer: 25, passTD: 4, passInt: -2, passComp: 0, passIncomp: 0,
    rushYdsPer: 10, rushTD: 6,
    recYdsPer: 10, recTD: 6, ppr: 0, teBoost: 0,
  },
];
let scoringPresets = JSON.parse(localStorage.getItem('ff_scoring_presets') || 'null') || DEFAULT_SCORING_PRESETS.map(p => ({...p}));
let activeScoringPreset = parseInt(localStorage.getItem('ff_active_scoring_preset') || '0');

function getActiveScoring() { return scoringPresets[activeScoringPreset] || scoringPresets[0]; }

function calcFpts(p) {
  const s = p.stats;
  const sc = getActiveScoring();
  const games = parseFloat(s.games || 1);
  let pts = 0;
  pts += (parseFloat(s.passYds  || 0) / sc.passYdsPer);
  pts += (parseFloat(s.passTD   || 0) * sc.passTD);
  pts += (parseFloat(s.passInt  || 0) * sc.passInt);
  pts += (parseFloat(s.passComp || 0) * sc.passComp);
  const passAtt = parseFloat(s.passAtt || 0);
  const passComp = parseFloat(s.passComp || 0);
  pts += ((passAtt - passComp) * sc.passIncomp);
  pts += (parseFloat(s.rushYds  || 0) / sc.rushYdsPer);
  pts += (parseFloat(s.rushTD   || 0) * sc.rushTD);
  pts += (parseFloat(s.recYds   || 0) / sc.recYdsPer);
  pts += (parseFloat(s.recTD    || 0) * sc.recTD);
  const isTE = p.pos === "TE";
  pts += (parseFloat(s.rec || 0) * sc.ppr);
  if (isTE) pts += (parseFloat(s.rec || 0) * (sc.teBoost || 0));
  return { fpts: pts.toFixed(1), fptsPerGame: games > 0 ? (pts / games).toFixed(1) : "—" };
}

function saveScoringPresets() {
  localStorage.setItem('ff_scoring_presets', JSON.stringify(scoringPresets));
  localStorage.setItem('ff_active_scoring_preset', activeScoringPreset);
}
let teamStatsCollapsed = JSON.parse(localStorage.getItem("ff_ts_collapsed") || "{}");
let dataSortCol = "Year";
let dataSortAsc = true;
let hiddenDataCols = new Set(JSON.parse(localStorage.getItem('ff_hidden_data_cols') || '[]'));
let dataPerGame = false;
let colHighlights = JSON.parse(localStorage.getItem('ff_col_highlights') || '{}'); // col -> 'validated' | 'derived' | null
let scatterX = "Pass Attempts";
let scatterY = "Gross Pass Yards";
let scatterYear = "all";
let graphType = "scatter";
let barStat = "Rush Plays";
let barYear = "latest";
let lineStat = "Pass Attempts";
let lineHighlight = "all";

const YEAR_COLORS = {2021:"#4a90d9",2022:"#e05252",2023:"#3a9a5c",2024:"#c9a800",2025:"#9b59b6"};
const SCATTER_PRESETS = [
  { label: "Pass Volume",  x: "Pass Attempts",   y: "Gross Pass Yards"    },
  { label: "Rush Volume",  x: "Rush Plays",       y: "Rush Yards"          },
  { label: "Pass vs Rush", x: "Rush Plays",       y: "Pass Attempts"       },
  { label: "Tgt vs Att",   x: "Pass Attempts",    y: "Targets"             },
  { label: "Efficiency",   x: "Pass Attempts",    y: "Pass Touchdowns"     },
];


// Recalculate league averages from team data on load

function renderDataPage() {
  renderDataToolbar();
  renderDataContent();
}

// ─── Multi-select dropdown ───
function buildMultiSelect(id, label, options, selected, onChangeFn) {
  const allSelected = selected.size === 0;
  const triggerText = allSelected ? "All" : selected.size === 1 ? [...selected][0] : `${selected.size} selected`;
  const opts = options.map(o => `
    <div class="ms-option" onmousedown="event.preventDefault();${onChangeFn}('${o.value}')">
      <input type="checkbox" ${(allSelected || selected.has(o.value)) ? "checked" : ""}> ${o.label}
    </div>`).join("");
  return `<div class="ms-wrap" id="wrap-${id}">
    <div style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.05em;">${label}</div>
    <div style="position:relative;">
      <div class="ms-trigger" onclick="toggleMsDropdown('${id}')">${triggerText}</div>
      <div class="ms-dropdown" id="${id}">
        <div class="ms-option ms-all" onmousedown="event.preventDefault();${onChangeFn}('__all__')">
          <input type="checkbox" ${allSelected ? "checked" : ""}> All
        </div>
        ${opts}
      </div>
    </div>
  </div>`;
}

function toggleMsDropdown(id) {
  const el = document.getElementById(id);
  const wasOpen = el.classList.contains("open");
  document.querySelectorAll(".ms-dropdown.open").forEach(d => d.classList.remove("open"));
  if (!wasOpen) el.classList.add("open");
}

// Close dropdowns when clicking outside
document.addEventListener("click", e => {
  if (!e.target.closest(".ms-wrap")) {
    document.querySelectorAll(".ms-dropdown.open").forEach(d => d.classList.remove("open"));
  }
});

function toggleDataYear(val) {
  const allYears = [...new Set(HIST_DATA.map(r => r.Year))].sort();
  if (val === "__all__") {
    if (dataYears.size === 0 && !dataYearsNone) {
      // Currently all — uncheck all
      dataYearsNone = true;
    } else {
      // Some or none — check all
      dataYears.clear();
      dataYearsNone = false;
    }
  } else {
    const y = Number(val);
    if (dataYears.size === 0 && !dataYearsNone) {
      // All mode — deselect this one, switch to explicit mode
      allYears.forEach(yr => { if (yr !== y) dataYears.add(yr); });
    } else if (dataYears.has(y)) {
      dataYears.delete(y);
      if (dataYears.size === 0) dataYearsNone = true; // explicitly none
    } else {
      dataYearsNone = false;
      dataYears.add(y);
      if (dataYears.size === allYears.length) dataYears.clear(); // back to all
    }
  }
  const displaySelected = dataYearsNone ? new Set(["__none__"]) : new Set([...dataYears].map(String));
  rebuildDropdown("ms-years", allYears.map(y => ({value: String(y), label: String(y)})), new Set([...dataYears].map(String)), "toggleDataYear", dataYears.size === 0 && !dataYearsNone);
  renderDataContent();
}

function toggleDataTeam(val) {
  const allTeams = [...new Set(HIST_DATA.filter(r => r.Team !== "League AVG").map(r => r.Team))].sort();
  if (val === "__all__") {
    if (dataTeams.size === 0 && !dataTeamsNone) {
      // Currently all — uncheck all
      dataTeamsNone = true;
    } else {
      // Some or none — check all
      dataTeams.clear();
      dataTeamsNone = false;
    }
  } else {
    if (dataTeams.size === 0 && !dataTeamsNone) {
      allTeams.forEach(t => { if (t !== val) dataTeams.add(t); });
    } else if (dataTeams.has(val)) {
      dataTeams.delete(val);
      if (dataTeams.size === 0) dataTeamsNone = true;
    } else {
      dataTeamsNone = false;
      dataTeams.add(val);
      if (dataTeams.size === allTeams.length) dataTeams.clear();
    }
  }
  rebuildTeamDropdown();
  renderDataContent();
}

function rebuildTeamDropdown() {
  const dropdown = document.getElementById("ms-teams");
  const wrap = document.getElementById("wrap-ms-teams");
  if (!dropdown || !wrap) return;

  const allMode = dataTeams.size === 0 && !dataTeamsNone;
  const trigger = wrap.querySelector(".ms-trigger");
  if (trigger) {
    trigger.textContent = allMode ? "All teams" : dataTeamsNone ? "None" : dataTeams.size === 1 ? [...dataTeams][0] : `${dataTeams.size} teams`;
  }

  // Build nickname → abbr map
  const nicknameToAbbr = {};
  Object.entries(ABBR_TO_NICKNAME).forEach(([abbr, nick]) => { nicknameToAbbr[nick] = abbr; });

  let html = `<div class="ms-option ms-all" onmousedown="event.stopPropagation();event.preventDefault();toggleDataTeam('__all__')">
    <input type="checkbox" ${allMode ? "checked" : ""}> All teams
  </div>`;

  for (const conf of ["AFC", "NFC"]) {
    html += `<div class="ms-conf-section">
      <span class="ms-conf-label ${conf.toLowerCase()}">${conf}</span>
      <div class="ms-div-grid">`;
    for (const div of ["East", "North", "South", "West"]) {
      html += `<div class="ms-div-section"><div class="ms-div-label">${div}</div>`;
      for (const fullName of TEAMS[conf][div]) {
        const abbr = nicknameToAbbr[fullName.replace(/^.+ /, "")] || "";
        const checked = allMode || dataTeams.has(abbr);
        html += `<div class="ms-team-option" onmousedown="event.stopPropagation();event.preventDefault();toggleDataTeam('${abbr}')">
          <input type="checkbox" ${checked ? "checked" : ""}> ${fullName.replace(/^.+ /, "")}
        </div>`;
      }
      html += `</div>`;
    }
    html += `</div></div>`;
  }

  dropdown.innerHTML = html;
  // preserve open state — don't force open on rebuild
}

function rebuildDropdown(id, options, selected, onChangeFn, allMode) {
  const dropdown = document.getElementById(id);
  const wrap = document.getElementById("wrap-" + id);
  if (!dropdown || !wrap) return;
  const allSelected = allMode !== undefined ? allMode : selected.size === 0;
  const trigger = wrap.querySelector(".ms-trigger");
  if (trigger) {
    trigger.textContent = allSelected ? "All" : selected.size === 1 ? [...selected][0] : selected.size + " selected";
  }
  dropdown.innerHTML =
    `<div class="ms-option ms-all" onmousedown="event.preventDefault();event.stopPropagation();${onChangeFn}('__all__')">` +
    `<input type="checkbox" ${allSelected ? "checked" : ""}> All</div>` +
    options.map(o =>
      `<div class="ms-option" onmousedown="event.preventDefault();event.stopPropagation();${onChangeFn}('${o.value}')">` +
      `<input type="checkbox" ${(allSelected || selected.has(o.value)) ? "checked" : ""}> ${o.label}</div>`
    ).join("");
  // preserve open state — don't force open on rebuild
}

function updateMsTrigger(id, selected) {
  const wrap = document.getElementById("wrap-" + id);
  if (!wrap) return;

  const allSelected = selected.size === 0;

  const trigger = wrap.querySelector(".ms-trigger");
  if (trigger) {
    const text = allSelected ? "All" : selected.size === 1 ? [...selected][0] : `${selected.size} selected`;
    trigger.textContent = text;
  }

  const dropdown = document.getElementById(id);
  if (!dropdown) return;

  const allOption = dropdown.querySelector(".ms-all input");
  if (allOption) allOption.checked = allSelected;

  // Convert all selected values to strings for reliable comparison
  const selectedStrs = new Set([...selected].map(String));

  dropdown.querySelectorAll(".ms-option:not(.ms-all)").forEach(opt => {
    const cb = opt.querySelector("input[type='checkbox']");
    if (!cb) return;
    const onmd = opt.getAttribute("onmousedown") || "";
    const match = onmd.match(/'([^']+)'\s*\)\s*$/);
    if (match) {
      cb.checked = allSelected || selectedStrs.has(match[1]);
    }
  });
}

let dataEditMode = false;

function renderDataToolbar() {
  const years = [...new Set(HIST_DATA.map(r => r.Year))].sort();
  const teams = [...new Set(HIST_DATA.filter(r => r.Team !== "League AVG").map(r => r.Team))].sort();
  const yearOpts = years.map(y => ({ value: String(y), label: String(y) }));
  const teamOpts = teams.map(t => ({ value: t, label: ABBR_TO_NICKNAME[t] || t }));
  const selectedYearStrs = new Set([...dataYears].map(String));
  document.getElementById("data-toolbar").innerHTML = `
    <div class="view-toggle">
      <button class="view-btn ${dataView==="table"?"active":""}" onclick="setDataView('table')">Table</button>
      <button class="view-btn ${dataView==="graph"?"active":""}" onclick="setDataView('graph')">Graphs</button>
    </div>
    <div style="width:1px;height:20px;background:var(--border-2);margin:0 8px;"></div>
    ${buildMultiSelect("ms-years", "Year", yearOpts, selectedYearStrs, "toggleDataYear")}
    <div class="ms-wrap" id="wrap-ms-teams">
      <div style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.05em;">Team</div>
      <div style="position:relative;">
        <div class="ms-trigger" onclick="toggleMsDropdown('ms-teams')">${dataTeams.size === 0 && !dataTeamsNone ? "All teams" : dataTeamsNone ? "None" : dataTeams.size + " teams"}</div>
        <div class="ms-dropdown ms-teams-grid" id="ms-teams"></div>
      </div>
    </div>
    <div style="margin-left:auto;display:flex;align-items:center;gap:8px;">
      <div class="view-toggle">
        <button class="view-btn ${!dataPerGame?'active':''}" onclick="setDataPerGame(false)">Raw</button>
        <button class="view-btn ${dataPerGame?'active':''}" onclick="setDataPerGame(true)">Per Game</button>
      </div>
      <button class="data-edit-btn ${dataEditMode?'active':''}" onclick="toggleDataEditMode()">
        ${dataEditMode ? "✓ Done" : "Edit"}
      </button>
    </div>
  `;
  rebuildTeamDropdown();
}

function setDataPerGame(val) {
  dataPerGame = val;
  renderDataToolbar();
  renderDataTable();
}

function toggleDataEditMode() {
  dataEditMode = !dataEditMode;
  const table = document.getElementById("data-table");
  if (table) table.classList.toggle("edit-mode", dataEditMode);
  renderDataToolbar();
}

function saveHistData() {
  try {
    localStorage.setItem('ff_hist_data', JSON.stringify(HIST_DATA));
    localStorage.setItem('ff_hist_cols', JSON.stringify(HIST_COLS));
  } catch(e) {}
}

function loadHistEdits() {
  try {
    const savedData = JSON.parse(localStorage.getItem('ff_hist_data') || 'null');
    const savedCols = JSON.parse(localStorage.getItem('ff_hist_cols') || 'null');
    if (savedData && savedData.length > 0) {
      HIST_DATA.length = 0;
      savedData.forEach(r => HIST_DATA.push(r));
    }
    if (savedCols && savedCols.length > 0) {
      HIST_COLS.length = 0;
      savedCols.forEach(c => HIST_COLS.push(c));
    }
  } catch(e) {}
}

function onDataCellClick(e, td, rowIdx, col) {
  if (!dataEditMode) return;
  if (td.classList.contains("cell-editing")) return;

  // Close any other open editor
  document.querySelectorAll(".data-table td.cell-editing").forEach(c => commitDataCell(c));

  const currentVal = HIST_DATA[rowIdx][col] !== undefined ? HIST_DATA[rowIdx][col] : "";
  td.classList.add("cell-editing");
  td.innerHTML = `<input type="number" value="${currentVal}" step="any"
    onblur="commitDataCell(this.closest('td'))"
    onkeydown="onDataCellKey(event, this.closest('td'), ${rowIdx}, '${col}')">`;
  const inp = td.querySelector("input");
  inp.focus();
  // Place cursor at end, don't select all
  const len = String(inp.value).length;
  try { inp.setSelectionRange(len, len); } catch(e) {}
}

// Derived columns: display name → compute fn(row)
const PER_GAME_COLS = new Set([
  "Total Plays", "Rush Plays", "Pass Plays", "Pass Attempts", "Completions",
  "Gross Pass Yards", "Sacks", "Sack Yards", "Net Pass Yards",
  "Pass Touchdowns", "Interceptions", "Targets",
  "WR Targets", "TE Targets", "RB Targets", "Dead Pass Plays",
  "Rush Yards", "Rush Touchdowns", "Total Yards", "Net Yards", "Total TDs",
]);

const HIST_DERIVED = {
  // These columns are already in the raw data — pass through values as-is
  "Pass Play%":     r => r["Pass Play%"] ?? null,
  "Rush Play%":     r => r["Rush Play%"] ?? null,
  "COMP%":           r => r["COMP%"] ?? null,
  "Dead Plays":      r => r["Dead Plays"] ?? null,
  "Net Pass Yards":  r => r["Net Pass Yards"] ?? null,
  "Target%":        r => r["Target%"] ?? null,
  "WR TGT%":         r => r["WR TGT%"] ?? null,
  "TE TGT%":         r => r["TE TGT%"] ?? null,
  "RB TGT%":         r => r["RB TGT%"] ?? null,
  "YPC":             r => r["YPC"] ?? null,
  // These are genuinely computed — not in raw data
  "Yds/Sack":        r => (r["Sacks"] > 0 && r["Sack Yards"] != null ? r["Sack Yards"] / r["Sacks"] : null),
  "TD%":             r => (r["Pass Attempts"] > 0 && r["Pass TDS"] != null ? (r["Pass TDS"] / r["Pass Attempts"] * 100) : null),
  "YPA":             r => r["YPA"] ?? null,
  "INT%":            r => (r["Pass Attempts"] > 0 && r["INT"] != null ? (r["INT"] / r["Pass Attempts"] * 100) : null),
  "Total Yards":     r => (r["TOT Pass Yards"] != null && r["Rush Yards"] != null ? r["TOT Pass Yards"] + r["Rush Yards"] : null),
  "Net Yards":       r => r["Net Yards"] ?? null,
  "Total TDs":       r => (r["Pass TDS"] != null && r["Rush Touchdowns"] != null ? r["Pass TDS"] + r["Rush Touchdowns"] : null),
  "Net Yds/TD":      r => (r["Pass TDS"] != null && r["Rush Touchdowns"] != null && (r["Pass TDS"] + r["Rush Touchdowns"]) > 0 && r["TOT Pass Yards"] != null && r["Sack Yards"] != null && r["Rush Yards"] != null ? (r["TOT Pass Yards"] - r["Sack Yards"] + r["Rush Yards"]) / (r["Pass TDS"] + r["Rush Touchdowns"]) : null),
};

function recomputeDerivedCells(tr, rowIdx) {
  const row = HIST_DATA[rowIdx];
  if (!row) return;
  // Update derived values in the data object
  for (const [col, fn] of Object.entries(HIST_DERIVED)) {
    const val = fn(row);
    if (val !== null) row[col] = parseFloat(val.toFixed(2));
  }
  // Update the DOM cells — find non-editable tds with data-col or by position
  // Simpler: find all tds in the row and match by header position
  const table = document.getElementById("data-table");
  if (!table) return;
  const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim());
  const tds = Array.from(tr.querySelectorAll("td"));
  headers.forEach((col, i) => {
    if (!HIST_DERIVED[col]) return;
    const td = tds[i];
    if (!td || td.classList.contains("cell-editing")) return;
    const val = row[col];
    td.textContent = formatDataCell(val, col);
  });
}

function commitDataCell(td) {
  if (!td || !td.classList.contains("cell-editing")) return;
  const inp = td.querySelector("input");
  if (!inp) return;
  const rowIdx = parseInt(td.dataset.rowIdx);
  const col = td.dataset.col;
  const val = inp.value === "" ? "" : parseFloat(inp.value);
  HIST_DATA[rowIdx][col] = val;
  saveHistData();
  td.classList.remove("cell-editing");
  td.textContent = formatDataCell(val, col);
  // Recompute derived cells in the same row
  recomputeDerivedCells(td.closest("tr"), rowIdx);
}

// Columns that are always whole numbers
const INT_COLS = new Set([
  "Total Plays", "Rush Plays", "Pass Plays", "Pass Attempts",
  "Completions", "Gross Pass Yards", "Sacks", "Sack Yards", "Net Pass Yards",
  "Pass Touchdowns", "Interceptions", "Targets",
  "WR Targets", "TE Targets", "RB Targets",
  "Dead Plays", "Rush Yards", "Rush Touchdowns",
  "Gross Yards", "Net Yards", "TOTAL Touchdowns",
]);
// Columns that show 1 decimal
const ONE_DP_COLS = new Set([
  "Pass Play%", "Rush Play%", "YPC", "YPA", "Yards/Sack",
]);

function formatDataCell(v, col, isPerGame) {
  if (v === undefined || v === null || v === "") return "—";
  // Display the value as stored — preserves original formatting from CSV
  if (typeof v === "string" && !isNaN(parseFloat(v))) return v;
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  return v.toString();
}

function onDataCellKey(e, td, rowIdx, col) {
  if (e.key === "Enter") { e.preventDefault(); commitDataCell(td); navigateDataCell(td, "down"); }
  if (e.key === "Escape") { e.preventDefault(); commitDataCell(td); }
  if (e.key === "Tab") { e.preventDefault(); commitDataCell(td); navigateDataCell(td, e.shiftKey ? "left" : "right"); }
}

function navigateDataCell(td, direction) {
  const table = document.getElementById("data-table");
  if (!table) return;
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const cells = Array.from(td.closest("tr").querySelectorAll("td.editable"));
  const rowIdx = rows.indexOf(td.closest("tr"));
  const colIdx = cells.indexOf(td);

  if (direction === "right" || direction === "left") {
    const next = direction === "right" ? cells[colIdx + 1] : cells[colIdx - 1];
    if (next) next.click();
  } else {
    const nextRow = direction === "down" ? rows[rowIdx + 1] : rows[rowIdx - 1];
    if (!nextRow) return;
    const nextCells = Array.from(nextRow.querySelectorAll("td.editable"));
    if (nextCells[colIdx]) nextCells[colIdx].click();
  }
}

function setDataView(v) {
  dataView = v;
  localStorage.setItem('ff_last_data_view', v);
  renderDataToolbar();
  renderDataContent();
}

function getFilteredData() {
  return HIST_DATA.filter(r => {
    if (dataYearsNone) return false;
    if (dataYears.size > 0 && !dataYears.has(r.Year) && !dataYears.has(Number(r.Year))) return false;
    if (dataTeamsNone) return false;
    if (dataTeams.size > 0 && r.Team !== "League AVG" && !dataTeams.has(r.Team)) return false;
    return true;
  });
}

function renderDataContent() {
  if (dataView === "table") renderDataTable();
  else renderDataGraph();
}

let selectedDataRow = null; // { team, year }

function renderDataTable() {
  const rows = getFilteredData();
  const sortFn = HIST_DERIVED[dataSortCol];
  const sorted = [...rows].sort((a, b) => {
    const av = sortFn ? sortFn(a) : a[dataSortCol];
    const bv = sortFn ? sortFn(b) : b[dataSortCol];
    // League AVG always goes to bottom
    if (a.Team === "League AVG" && b.Team !== "League AVG") return 1;
    if (b.Team === "League AVG" && a.Team !== "League AVG") return -1;
    const an = parseFloat(av), bn = parseFloat(bv);
    if (!isNaN(an) && !isNaN(bn)) return dataSortAsc ? an - bn : bn - an;
    return dataSortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const allStatCols = HIST_COLS.filter(c => c !== "Team" && c !== "Year");

  // Build headers: skip hidden cols, insert sliver after each hidden group
  let headers = "";
  allStatCols.forEach((c, i) => {
    if (hiddenDataCols.has(c)) return;
    const sortCls = dataSortCol === c ? (dataSortAsc ? "sorted asc" : "sorted") : "";
    const hlCls = colHighlights[c] === "validated" ? "col-validated" : colHighlights[c] === "derived" ? "col-derived-verified" : "";
    const cls = [sortCls, hlCls].filter(Boolean).join(" ");
    const safeC = c.replace(/'/g, "\'");
    headers += `<th class="${cls}" draggable="true" data-col="${safeC}" onclick="sortData('${safeC}')" oncontextmenu="showColCtxMenu(event,'${safeC}',false)" ondragstart="onColDragStart(event,'${safeC}')" ondragover="onColDragOver(event)" ondrop="onColDrop(event,'${safeC}')" ondragend="onColDragEnd(event)" title="${c}">${displayCol(c)}</th>`;
    const hiddenGroup = [];
    let j = i + 1;
    while (j < allStatCols.length && hiddenDataCols.has(allStatCols[j])) { hiddenGroup.push(allStatCols[j]); j++; }
    if (hiddenGroup.length > 0) {
      const hgAttr = hiddenGroup.join('|').replace(/"/g, '&quot;');
      headers += `<th class="col-sliver" data-hidden="${hgAttr}" onclick="onSliverClick(event,this)" oncontextmenu="onSliverClick(event,this)" title="Hidden: ${hiddenGroup.join(', ')}"></th>`;
    }
  });

  const bodyRows = sorted.map((r) => {
    const isAvg = r.Team === "League AVG";
    const teamDisplay = isAvg ? "League AVG" : (ABBR_TO_NICKNAME[r.Team] || r.Team);
    const rowIdx = HIST_DATA.indexOf(r);
    let cells = "";
    allStatCols.forEach((c, i) => {
      if (hiddenDataCols.has(c)) return;
      const v = r[dataKey(c)];
      const display = formatDataCell(v, c);
      const isDerivedCol = !!HIST_DERIVED[c];
      let cellVal = isDerivedCol ? (HIST_DERIVED[c](r) ?? v) : v;
      const isPerGameCell = dataPerGame && PER_GAME_COLS.has(c);
      if (isPerGameCell && cellVal != null && cellVal !== "") cellVal = parseFloat(cellVal) / 17;
      const display2 = formatDataCell(cellVal, c, isPerGameCell);
      const editAttrs = (!isAvg && c !== "Team" && c !== "Year" && !isDerivedCol && !dataPerGame)
        ? `class="editable" data-row-idx="${rowIdx}" data-col="${dataKey(c).replace(/"/g,'&quot;')}" onclick="onDataCellClick(event,this,${rowIdx},'${dataKey(c).replace(/'/g,"\'")}')"`
        : "";
      cells += `<td ${editAttrs}>${display2}</td>`;
      const hiddenGroup = [];
      let j = i + 1;
      while (j < allStatCols.length && hiddenDataCols.has(allStatCols[j])) { hiddenGroup.push(allStatCols[j]); j++; }
      if (hiddenGroup.length > 0) cells += `<td class="col-sliver"></td>`;
    });
    return `<tr class="${isAvg?'league-avg':''}" data-team="${r.Team}" data-year="${r.Year}"><td>${teamDisplay}</td><td>${r.Year}</td>${cells}</tr>`;
  }).join("");

  document.getElementById("data-content").innerHTML = `
    <div class="data-table-wrap">
      <table class="data-table" id="data-table">
        <thead><tr>
          <th onclick="sortData('Team')" class="${dataSortCol==='Team'?(dataSortAsc?'sorted asc':'sorted'):''}">Team</th>
          <th onclick="sortData('Year')" class="${dataSortCol==='Year'?(dataSortAsc?'sorted asc':'sorted'):''}">Year</th>
          ${headers}
        </tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>`;

  document.getElementById("data-table").addEventListener("click", e => {
    const row = e.target.closest("tbody tr");
    if (!row) return;
    const wasSelected = row.classList.contains("row-selected");
    document.querySelectorAll("#data-table tbody tr.row-selected").forEach(r => r.classList.remove("row-selected"));
    if (!wasSelected) {
      row.classList.add("row-selected");
      selectedDataRow = { team: row.dataset.team, year: row.dataset.year };
    } else {
      selectedDataRow = null;
    }
  });

  if (dataEditMode) {
    const t = document.getElementById("data-table");
    if (t) t.classList.add("edit-mode");
  }

  // Restore previously selected row after re-render
  if (selectedDataRow) {
    const row = document.querySelector(`#data-table tbody tr[data-team="${selectedDataRow.team}"][data-year="${selectedDataRow.year}"]`);
    if (row) row.classList.add("row-selected");
  }
}

function updateColHighlightClass(col) {
  const table = document.getElementById('data-table');
  if (!table) return;
  const ths = Array.from(table.querySelectorAll('thead th'));
  const th = ths.find(t => t.textContent.trim() === displayCol(col) || t.textContent.trim() === col);
  if (!th) return;
  th.classList.remove('col-validated', 'col-derived-verified');
  if (colHighlights[col] === 'validated') th.classList.add('col-validated');
  else if (colHighlights[col] === 'derived') th.classList.add('col-derived-verified');
}

function onSliverClick(e, el) {
  e.preventDefault(); e.stopPropagation();
  const group = el.dataset.hidden.split('|');
  showColCtxMenu(e, group, true);
}

let _dragCol = null;

function onColDragStart(e, col) {
  _dragCol = col;
  e.dataTransfer.effectAllowed = 'move';
  e.target.classList.add('col-dragging');
}

function onColDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  document.querySelectorAll('.data-table thead th.col-drag-over').forEach(el => el.classList.remove('col-drag-over'));
  e.currentTarget.classList.add('col-drag-over');
}

function onColDrop(e, targetCol) {
  e.preventDefault();
  if (!_dragCol || _dragCol === targetCol) return;
  const fromIdx = HIST_COLS.indexOf(_dragCol);
  const toIdx = HIST_COLS.indexOf(targetCol);
  if (fromIdx === -1 || toIdx === -1) return;
  HIST_COLS.splice(fromIdx, 1);
  HIST_COLS.splice(toIdx, 0, _dragCol);
  saveHistData();
  renderDataTable();
}

function onColDragEnd(e) {
  _dragCol = null;
  document.querySelectorAll('.data-table thead th.col-dragging, .data-table thead th.col-drag-over')
    .forEach(el => el.classList.remove('col-dragging', 'col-drag-over'));
}

function showColCtxMenu(e, colOrGroup, isSliver) {
  e.preventDefault(); e.stopPropagation();
  document.querySelectorAll('.col-ctx-menu').forEach(m => m.remove());
  const menu = document.createElement('div');
  menu.className = 'col-ctx-menu';
  if (!isSliver) {
    const col = colOrGroup;

    // Full column name label
    const nameLabel = document.createElement('div');
    nameLabel.style.cssText = 'padding:6px 12px 4px;font-size:10px;font-weight:700;color:var(--text-3);border-bottom:1px solid var(--border);font-family:var(--font-mono);pointer-events:none;';
    nameLabel.textContent = col;
    menu.appendChild(nameLabel);

    // Editable abbreviation
    const abbrRow = document.createElement('div');
    abbrRow.style.cssText = 'padding:6px 12px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);';
    const abbrLabel = document.createElement('span');
    abbrLabel.style.cssText = 'font-size:10px;color:var(--text-3);font-family:var(--font-mono);flex-shrink:0;';
    abbrLabel.textContent = 'Display as:';
    const abbrInput = document.createElement('input');
    abbrInput.type = 'text';
    abbrInput.value = COL_DISPLAY[col] || col;
    abbrInput.style.cssText = 'flex:1;font-family:var(--font-mono);font-size:11px;padding:2px 6px;border:1px solid var(--border-2);border-radius:3px;background:var(--bg-3);color:var(--text);outline:none;min-width:0;';
    abbrInput.onclick = e => e.stopPropagation();
    abbrInput.onkeydown = e => { if (e.key === 'Enter') { updateColDisplay(col, abbrInput.value); menu.remove(); } if (e.key === 'Escape') menu.remove(); };
    abbrInput.onblur = () => updateColDisplay(col, abbrInput.value);
    abbrRow.appendChild(abbrLabel);
    abbrRow.appendChild(abbrInput);
    menu.appendChild(abbrRow);

    const hideItem = document.createElement('div');
    hideItem.textContent = 'Hide column';
    hideItem.onclick = () => { hiddenDataCols.add(col); localStorage.setItem('ff_hidden_data_cols', JSON.stringify([...hiddenDataCols])); menu.remove(); renderDataTable(); };
    menu.appendChild(hideItem);

    const isValidated = colHighlights[col] === 'validated';
    const validItem = document.createElement('div');
    validItem.textContent = isValidated ? '✓ Remove validated' : '✓ Mark as validated';
    validItem.style.color = isValidated ? 'var(--text-3)' : 'rgb(80,180,100)';
    validItem.onclick = () => {
      colHighlights[col] = isValidated ? null : 'validated';
      if (!colHighlights[col]) delete colHighlights[col];
      localStorage.setItem('ff_col_highlights', JSON.stringify(colHighlights));
      menu.remove(); updateColHighlightClass(col);
    };
    menu.appendChild(validItem);

    const isDerived = colHighlights[col] === 'derived';
    const derivedItem = document.createElement('div');
    derivedItem.textContent = isDerived ? '◆ Remove verified derived' : '◆ Mark as verified derived';
    derivedItem.style.color = isDerived ? 'var(--text-3)' : 'rgb(200,160,30)';
    derivedItem.onclick = () => {
      colHighlights[col] = isDerived ? null : 'derived';
      if (!colHighlights[col]) delete colHighlights[col];
      localStorage.setItem('ff_col_highlights', JSON.stringify(colHighlights));
      menu.remove(); updateColHighlightClass(col);
    };
    menu.appendChild(derivedItem);
  } else {
    const group = Array.isArray(colOrGroup) ? colOrGroup : [colOrGroup];
    group.forEach(col => {
      const item = document.createElement('div');
      item.textContent = `Show "${col}"`;
      item.onclick = () => { hiddenDataCols.delete(col); localStorage.setItem('ff_hidden_data_cols', JSON.stringify([...hiddenDataCols])); menu.remove(); renderDataTable(); };
      menu.appendChild(item);
    });
  }
  document.body.appendChild(menu);
  const mw = menu.offsetWidth || 160;
  const mh = menu.offsetHeight || 100;
  const left = (e.clientX + mw > window.innerWidth) ? e.clientX - mw : e.clientX;
  const top  = (e.clientY + mh > window.innerHeight) ? e.clientY - mh : e.clientY;
  menu.style.left = left + 'px';
  menu.style.top  = top  + 'px';
  const close = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('mousedown', close); } };
  setTimeout(() => document.addEventListener('mousedown', close), 0);
}

function sortData(col) {
  if (dataSortCol === col) dataSortAsc = !dataSortAsc;
  else { dataSortCol = col; dataSortAsc = false; }
  const wrap = document.querySelector(".data-table-wrap");
  const scrollLeft = wrap ? wrap.scrollLeft : 0;
  renderDataTable();
  requestAnimationFrame(() => {
    const w = document.querySelector(".data-table-wrap");
    if (w) w.scrollLeft = scrollLeft;
  });
}

function getAllTeams() {
  const teams = [];
  for (const conf of Object.values(TEAMS)) {
    for (const divTeams of Object.values(conf)) {
      divTeams.forEach(t => teams.push(t));
    }
  }
  return teams;
}

function getTeamProjValueForCol(team, dataCol) {
  if (!state[team]) return null;
  const ts = (state[team].teamStats) || {};
  const derived = calcTeamDerived(ts);
  for (const [projKey, mappedCol] of Object.entries(PROJ_TO_DATA)) {
    if (mappedCol === dataCol) {
      const v = derived[projKey] !== undefined ? derived[projKey]
              : ts[projKey] !== undefined ? ts[projKey] : undefined;
      if (v !== undefined && v !== "" && !isNaN(parseFloat(v))) return parseFloat(v);
    }
  }
  return null;
}

let _graphPoints = [];

function drawGraph() {
  if (graphType === "scatter") drawScatter();
  else if (graphType === "bar") drawBar();
  else drawLine();
}

function renderDataGraph() {
  const numCols = HIST_COLS.filter(c => c !== "Team" && c !== "Year");
  if (!numCols.length) {
    document.getElementById("data-content").innerHTML = `<div style="padding:40px;color:var(--text-3);font-size:11px;">No data loaded — import a CSV on the Data tab first.</div>`;
    return;
  }
  const years = [...new Set(HIST_DATA.map(r => r.Year))].sort();
  const latestYear = years[years.length - 1] || "";
  const axisOpts = (sel) => numCols.map(c => `<option value="${c}" ${sel===c?"selected":""}>${c}</option>`).join("");
  const yearOpts = `<option value="all">All years</option>` + years.map(y => `<option value="${y}" ${scatterYear==y?"selected":""}>${y}</option>`).join("");
  const barYearOpts = `<option value="latest">Latest${latestYear?" ("+latestYear+")":""}</option><option value="all">Average</option>` +
    years.map(y => `<option value="${y}" ${barYear==y?"selected":""}>${y}</option>`).join("");
  const presetBtns = SCATTER_PRESETS.map(p => {
    const active = p.x === scatterX && p.y === scatterY;
    return `<button class="graph-preset-btn${active?" active":""}" onclick="scatterX='${p.x}';scatterY='${p.y}';renderDataGraph()">${p.label}</button>`;
  }).join("");
  const typeToggle = ["scatter","bar","line"].map(t =>
    `<button class="graph-type-btn${graphType===t?" active":""}" onclick="graphType='${t}';renderDataGraph()">${t.charAt(0).toUpperCase()+t.slice(1)}</button>`
  ).join("");
  let controls = "";
  if (graphType === "scatter") {
    controls = `
      <div class="graph-presets">${presetBtns}</div>
      <div class="graph-controls">
        <label>X</label><select onchange="scatterX=this.value;drawGraph()">${axisOpts(scatterX)}</select>
        <label>Y</label><select onchange="scatterY=this.value;drawGraph()">${axisOpts(scatterY)}</select>
        <label>Hist. Year</label><select onchange="scatterYear=this.value;drawGraph()">${yearOpts}</select>
      </div>`;
  } else if (graphType === "bar") {
    controls = `
      <div class="graph-controls">
        <label>Stat</label><select onchange="barStat=this.value;drawGraph()">${axisOpts(barStat)}</select>
        <label>Hist. Year</label><select onchange="barYear=this.value;drawGraph()">${barYearOpts}</select>
      </div>`;
  } else {
    const allTeams = getAllTeams();
    const teamOpts = `<option value="all">All teams</option>` +
      allTeams.map(t => `<option value="${t}" ${lineHighlight===t?"selected":""}>${t}</option>`).join("");
    controls = `
      <div class="graph-controls">
        <label>Stat</label><select onchange="lineStat=this.value;drawGraph()">${axisOpts(lineStat)}</select>
        <label>Highlight</label><select onchange="lineHighlight=this.value;drawGraph()">${teamOpts}</select>
      </div>`;
  }
  document.getElementById("data-content").innerHTML = `
    <div class="data-graph-wrap">
      <div class="graph-type-toggle">${typeToggle}</div>
      ${controls}
      <div class="graph-canvas-wrap" id="graph-canvas-wrap">
        <canvas id="graph-canvas" height="500"></canvas>
        <div class="graph-tooltip" id="graph-tooltip"></div>
      </div>
      <div class="graph-legend" id="graph-legend"></div>
    </div>`;
  const wrap = document.getElementById("graph-canvas-wrap");
  const canvas = document.getElementById("graph-canvas");
  if (wrap && canvas) canvas.width = Math.max(wrap.clientWidth - 2, 600);
  attachGraphHover();
  drawGraph();
}

function attachGraphHover() {
  const canvas = document.getElementById("graph-canvas");
  const tooltip = document.getElementById("graph-tooltip");
  if (!canvas || !tooltip) return;
  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    let closest = null, minDist = Infinity;
    for (const pt of _graphPoints) {
      const d = Math.hypot(pt.px - mx, pt.py - my);
      if (d < minDist) { minDist = d; closest = pt; }
    }
    if (closest && minDist < 18) {
      const yearLabel = closest.isProj ? "2025 Proj" : String(closest.year);
      let html = `<b>${closest.team}</b> · ${yearLabel}`;
      if (closest.xVal !== undefined && closest.xKey) html += `<br>${closest.xKey}: <b>${closest.xVal}</b>`;
      if (closest.yVal !== undefined && closest.yKey) html += `<br>${closest.yKey}: <b>${closest.yVal}</b>`;
      if (closest.val !== undefined && closest.statKey) html += `<br>${closest.statKey}: <b>${closest.val}</b>`;
      tooltip.innerHTML = html;
      tooltip.style.display = "block";
      const tipW = tooltip.offsetWidth || 160;
      const tipH = tooltip.offsetHeight || 60;
      let tx = (closest.px / scaleX) + 12;
      let ty = (closest.py / scaleY) - tipH - 8;
      if (tx + tipW > rect.width - 4) tx = (closest.px / scaleX) - tipW - 12;
      if (ty < 4) ty = (closest.py / scaleY) + 12;
      tooltip.style.left = tx + "px";
      tooltip.style.top = ty + "px";
    } else {
      tooltip.style.display = "none";
    }
  };
  canvas.onmouseleave = () => { if (tooltip) tooltip.style.display = "none"; };
}

function drawScatter() {
  const canvas = document.getElementById("graph-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const pad = { left: 68, right: 24, top: 24, bottom: 52 };
  _graphPoints = [];

  const histRows = HIST_DATA.filter(r => {
    if (r.Team === "League AVG") return false;
    if (scatterYear !== "all" && r.Year != scatterYear) return false;
    return true;
  });
  const projRows = getAllTeams().map(t => {
    const xv = getTeamProjValueForCol(t, scatterX);
    const yv = getTeamProjValueForCol(t, scatterY);
    if (xv === null || yv === null) return null;
    return { Team: t, isProj: true, [scatterX]: xv, [scatterY]: yv };
  }).filter(Boolean);

  const xs = [...histRows, ...projRows].map(r => parseFloat(r[scatterX])).filter(v => !isNaN(v));
  const ys = [...histRows, ...projRows].map(r => parseFloat(r[scatterY])).filter(v => !isNaN(v));
  if (!xs.length || !ys.length) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#aaa"; ctx.font = "11px JetBrains Mono, monospace"; ctx.textAlign = "center";
    ctx.fillText("No data for selected axes", W/2, H/2);
    return;
  }

  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const xPad = (xMax - xMin) * 0.08 || 10;
  const yPad = (yMax - yMin) * 0.08 || 10;
  const toX = v => pad.left + ((v - (xMin - xPad)) / ((xMax + xPad) - (xMin - xPad))) * (W - pad.left - pad.right);
  const toY = v => H - pad.bottom - ((v - (yMin - yPad)) / ((yMax + yPad) - (yMin - yPad))) * (H - pad.top - pad.bottom);

  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = "#e0ddd8"; ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const gy = pad.top + (H - pad.top - pad.bottom) * i / 5;
    ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(W - pad.right, gy); ctx.stroke();
    const gx = pad.left + (W - pad.left - pad.right) * i / 5;
    ctx.beginPath(); ctx.moveTo(gx, pad.top); ctx.lineTo(gx, H - pad.bottom); ctx.stroke();
  }

  ctx.fillStyle = "#aaa"; ctx.font = "9px JetBrains Mono, monospace";
  for (let i = 0; i <= 5; i++) {
    const xv = (xMin - xPad) + ((xMax + xPad) - (xMin - xPad)) * i / 5;
    const gx = pad.left + (W - pad.left - pad.right) * i / 5;
    ctx.textAlign = "center";
    ctx.fillText(Math.round(xv), gx, H - pad.bottom + 14);
    const yv = (yMax + yPad) - ((yMax + yPad) - (yMin - yPad)) * i / 5;
    const gy = pad.top + (H - pad.top - pad.bottom) * i / 5;
    ctx.textAlign = "right";
    ctx.fillText(Math.round(yv), pad.left - 6, gy + 3);
  }

  ctx.fillStyle = "#aaa"; ctx.font = "10px JetBrains Mono, monospace"; ctx.textAlign = "center";
  ctx.fillText(scatterX, W / 2, H - 6);
  ctx.save(); ctx.translate(13, H / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(scatterY, 0, 0); ctx.restore();

  histRows.forEach(r => {
    const x = parseFloat(r[scatterX]), y = parseFloat(r[scatterY]);
    if (isNaN(x) || isNaN(y)) return;
    const px = toX(x), py = toY(y);
    ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(155,151,143,0.45)"; ctx.fill();
    _graphPoints.push({ px, py, team: r.Team, year: r.Year, xVal: Math.round(x*10)/10, yVal: Math.round(y*10)/10, xKey: scatterX, yKey: scatterY, isProj: false });
  });

  projRows.forEach(r => {
    const x = parseFloat(r[scatterX]), y = parseFloat(r[scatterY]);
    if (isNaN(x) || isNaN(y)) return;
    const px = toX(x), py = toY(y);
    const tc = (TEAM_COLORS[r.Team] || {}).border || "#3a7d0a";
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = tc; ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
    _graphPoints.push({ px, py, team: r.Team, year: "Proj", xVal: Math.round(x*10)/10, yVal: Math.round(y*10)/10, xKey: scatterX, yKey: scatterY, isProj: true, color: tc });
  });

  const legendEl = document.getElementById("graph-legend");
  if (legendEl) {
    legendEl.innerHTML = `
      <div class="legend-item"><svg width="10" height="10" style="flex-shrink:0"><circle cx="5" cy="5" r="4" fill="rgba(155,151,143,0.5)"/></svg> Historical${scatterYear !== "all" ? " ("+scatterYear+")" : ""} (${histRows.length})</div>
      ${projRows.length ? `<div class="legend-item"><svg width="10" height="10" style="flex-shrink:0"><circle cx="5" cy="5" r="5" fill="var(--accent)"/></svg> 2025 Projections (${projRows.length} teams)</div>` : ""}
    `;
  }
}


function drawBar() {
  const canvas = document.getElementById("graph-canvas");
  if (!canvas) return;
  const allTeams = getAllTeams();
  const years = [...new Set(HIST_DATA.map(r => r.Year))].sort();
  const histYear = barYear === "latest" ? (years[years.length-1] || null) : (barYear === "all" ? null : barYear);
  const teamData = allTeams.map(team => {
    const abbr = TEAM_ABBR[team];
    let histVal = null;
    if (barYear === "all") {
      const rows = HIST_DATA.filter(r => r.Team === abbr && !isNaN(parseFloat(r[barStat])));
      if (rows.length) histVal = rows.reduce((s, r) => s + parseFloat(r[barStat]), 0) / rows.length;
    } else if (histYear) {
      const row = HIST_DATA.find(r => r.Team === abbr && String(r.Year) === String(histYear));
      if (row && !isNaN(parseFloat(row[barStat]))) histVal = parseFloat(row[barStat]);
    }
    const projVal = getTeamProjValueForCol(team, barStat);
    return { team, histVal, projVal };
  }).filter(d => d.histVal !== null || d.projVal !== null);

  teamData.sort((a, b) => {
    const aV = a.projVal ?? a.histVal ?? 0;
    const bV = b.projVal ?? b.histVal ?? 0;
    return bV - aV;
  });

  const rowH = 18;
  const padLeft = 130, padRight = 50, padTop = 28, padBottom = 28;
  const H = rowH * teamData.length + padTop + padBottom;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  ctx.clearRect(0, 0, W, H);
  _graphPoints = [];

  const allVals = teamData.flatMap(d => [d.histVal, d.projVal]).filter(v => v !== null);
  if (!allVals.length) return;
  const rawMax = Math.max(...allVals);
  const niceMax = Math.ceil(rawMax / 50) * 50 || rawMax * 1.1;
  const bW = W - padLeft - padRight;
  const toX = v => padLeft + (v / niceMax) * bW;

  ctx.fillStyle = "#aaa"; ctx.font = "10px JetBrains Mono, monospace"; ctx.textAlign = "center";
  ctx.fillText(barStat, W / 2, 14);

  for (let i = 0; i <= 5; i++) {
    const v = niceMax * i / 5;
    const px = toX(v);
    ctx.strokeStyle = "#e0ddd8"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, padTop); ctx.lineTo(px, H - padBottom); ctx.stroke();
    ctx.fillStyle = "#bbb"; ctx.font = "8px JetBrains Mono, monospace"; ctx.textAlign = "center";
    ctx.fillText(Math.round(v), px, H - padBottom + 12);
  }

  teamData.forEach((d, i) => {
    const y = padTop + i * rowH;
    const cy = y + rowH / 2;
    const tc = (TEAM_COLORS[d.team] || {}).border || "#3a7d0a";
    const shortName = d.team.split(" ").slice(-1)[0];
    ctx.fillStyle = "#777"; ctx.font = "9px JetBrains Mono, monospace"; ctx.textAlign = "right";
    ctx.fillText((i+1) + ". " + shortName, padLeft - 6, cy + 3);

    if (d.histVal !== null) {
      const bx = toX(d.histVal);
      ctx.fillStyle = "rgba(160,156,148,0.3)";
      ctx.fillRect(padLeft, y + rowH * 0.3, bx - padLeft, rowH * 0.4);
      _graphPoints.push({ px: bx, py: cy, team: d.team, year: histYear || "avg", val: Math.round(d.histVal*10)/10, statKey: barStat, isProj: false });
    }

    if (d.projVal !== null) {
      const px = toX(d.projVal);
      ctx.beginPath(); ctx.arc(px, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = tc; ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
      _graphPoints.push({ px, py: cy, team: d.team, year: "Proj", val: Math.round(d.projVal*10)/10, statKey: barStat, isProj: true, color: tc });
    }
  });

  const legendEl = document.getElementById("graph-legend");
  if (legendEl) {
    const histLabel = barYear === "all" ? "Historical avg" : `Historical (${histYear})`;
    legendEl.innerHTML = `
      <div class="legend-item"><div style="width:20px;height:8px;background:rgba(160,156,148,0.4);border-radius:2px;flex-shrink:0;"></div> ${histLabel}</div>
      <div class="legend-item"><svg width="10" height="10" style="flex-shrink:0"><circle cx="5" cy="5" r="5" fill="var(--accent)"/></svg> 2025 Projection · sorted by proj value</div>
    `;
  }
}

function drawLine() {
  const canvas = document.getElementById("graph-canvas");
  if (!canvas) return;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const pad = { left: 65, right: 24, top: 24, bottom: 52 };
  _graphPoints = [];

  const allTeams = getAllTeams();
  const histYears = [...new Set(HIST_DATA.map(r => r.Year))].sort();
  if (!histYears.length) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#aaa"; ctx.font = "11px JetBrains Mono, monospace"; ctx.textAlign = "center";
    ctx.fillText("No historical data loaded", W/2, H/2);
    return;
  }

  const projYear = Math.max(...histYears.map(Number)) + 1;
  const allXYears = [...histYears, projYear];

  const allVals = [];
  allTeams.forEach(team => {
    const abbr = TEAM_ABBR[team];
    histYears.forEach(y => {
      const row = HIST_DATA.find(r => r.Team === abbr && String(r.Year) === String(y));
      if (row) { const v = parseFloat(row[lineStat]); if (!isNaN(v)) allVals.push(v); }
    });
    const pv = getTeamProjValueForCol(team, lineStat);
    if (pv !== null) allVals.push(pv);
  });

  if (!allVals.length) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#aaa"; ctx.font = "11px JetBrains Mono, monospace"; ctx.textAlign = "center";
    ctx.fillText("No data for selected stat", W/2, H/2);
    return;
  }

  const yMin = Math.min(...allVals), yMax = Math.max(...allVals);
  const yPad = (yMax - yMin) * 0.1 || 10;
  const toX = (year) => pad.left + (allXYears.indexOf(year) / (allXYears.length - 1)) * (W - pad.left - pad.right);
  const toY = v => H - pad.bottom - ((v - (yMin - yPad)) / ((yMax + yPad) - (yMin - yPad))) * (H - pad.top - pad.bottom);

  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = "#e0ddd8"; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const gy = pad.top + (H - pad.top - pad.bottom) * i / 4;
    ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(W - pad.right, gy); ctx.stroke();
    const yv = (yMax + yPad) - ((yMax + yPad) - (yMin - yPad)) * i / 4;
    ctx.fillStyle = "#aaa"; ctx.font = "9px JetBrains Mono, monospace"; ctx.textAlign = "right";
    ctx.fillText(Math.round(yv), pad.left - 6, gy + 3);
  }

  allXYears.forEach(y => {
    const gx = toX(y);
    ctx.fillStyle = y === projYear ? "#3a7d0a" : "#aaa";
    ctx.font = "9px JetBrains Mono, monospace"; ctx.textAlign = "center";
    ctx.fillText(y === projYear ? "Proj" : String(y), gx, H - pad.bottom + 14);
  });

  const projX = toX(projYear);
  ctx.strokeStyle = "#c8c5be"; ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(projX, pad.top); ctx.lineTo(projX, H - pad.bottom); ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#aaa"; ctx.font = "10px JetBrains Mono, monospace"; ctx.textAlign = "center";
  ctx.save(); ctx.translate(13, H / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(lineStat, 0, 0); ctx.restore();

  allTeams.forEach(team => {
    const abbr = TEAM_ABBR[team];
    const isHL = lineHighlight !== "all" && lineHighlight === team;
    const tc = (TEAM_COLORS[team] || {}).border || "#3a7d0a";
    const pts = [];
    histYears.forEach(y => {
      const row = HIST_DATA.find(r => r.Team === abbr && String(r.Year) === String(y));
      if (row) { const v = parseFloat(row[lineStat]); if (!isNaN(v)) pts.push({ year: y, val: v }); }
    });

    if (pts.length >= 2 || isHL) {
      ctx.beginPath();
      pts.forEach((pt, idx) => {
        const px = toX(pt.year), py = toY(pt.val);
        if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = isHL ? tc : "rgba(160,156,148,0.3)";
      ctx.lineWidth = isHL ? 2 : 1;
      ctx.stroke();
    }

    pts.forEach(pt => {
      if (isHL) {
        const px = toX(pt.year), py = toY(pt.val);
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = tc; ctx.fill();
      }
      _graphPoints.push({ px: toX(pt.year), py: toY(pt.val), team, year: pt.year, val: Math.round(pt.val*10)/10, statKey: lineStat, isProj: false });
    });

    const pv = getTeamProjValueForCol(team, lineStat);
    if (pv !== null) {
      const px = toX(projYear), py = toY(pv);
      if (pts.length > 0) {
        const lastPt = pts[pts.length - 1];
        ctx.beginPath(); ctx.moveTo(toX(lastPt.year), toY(lastPt.val)); ctx.lineTo(px, py);
        ctx.strokeStyle = isHL ? tc : "rgba(160,156,148,0.2)";
        ctx.lineWidth = isHL ? 2 : 0.8;
        ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.beginPath(); ctx.arc(px, py, isHL ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = tc; ctx.fill();
      if (isHL) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke(); }
      _graphPoints.push({ px, py, team, year: "Proj", val: Math.round(pv*10)/10, statKey: lineStat, isProj: true, color: tc });
    }
  });

  const legendEl = document.getElementById("graph-legend");
  if (legendEl) {
    legendEl.innerHTML = `
      <div class="legend-item"><svg width="20" height="8" style="flex-shrink:0"><line x1="0" y1="4" x2="20" y2="4" stroke="rgba(160,156,148,0.5)" stroke-width="1.5"/></svg> Historical</div>
      <div class="legend-item"><svg width="10" height="10" style="flex-shrink:0"><circle cx="5" cy="5" r="4" fill="var(--accent)"/></svg> 2025 Projection</div>
      ${lineHighlight !== "all" ? `<div class="legend-item"><svg width="20" height="8" style="flex-shrink:0"><line x1="0" y1="4" x2="20" y2="4" stroke="${(TEAM_COLORS[lineHighlight]||{}).border||"#888"}" stroke-width="2"/></svg> ${lineHighlight.split(" ").slice(-1)[0]} highlighted</div>` : ""}
    `;
  }
}

// ─── Draft page ───────────────────────────────────────────────────────────────

const DRAFT_STORAGE_KEY = 'ff_draft_v1';
const DRAFT_ROSTER_SLOTS = ['QB','RB','RB','WR','WR','TE','K','D/ST'];
const DRAFT_POS_COLORS = { QB:'#e05252', RB:'#3a9a5c', WR:'#4a90d9', TE:'#c9a800', K:'#888', 'D/ST':'#888' };
const DRAFT_POS_BG = { QB:'#f0c8c8', RB:'#c0e8cc', WR:'#c0d8f0', TE:'#f0e094', K:'#d8d8d8', 'D/ST':'#d8d8d8' };
const DRAFT_POS_BG_BOLD = { QB:'#e05252', RB:'#3a9a5c', WR:'#4a90d9', TE:'#c9a800', K:'#888', 'D/ST':'#888' };

function loadDraftState() {
  try { return JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || 'null') || { leagues: [], activeLeague: 0 }; }
  catch(e) { return { leagues: [], activeLeague: 0 }; }
}
function saveDraftState() { localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftState)); }
let draftState = loadDraftState();
function getActiveLeague() { return draftState.leagues[draftState.activeLeague] || null; }

function buildPickOrder(numTeams, numRounds) {
  const picks = [];
  for (let r = 0; r < numRounds; r++) {
    const ltr = r % 2 === 0;
    for (let i = 0; i < numTeams; i++) {
      picks.push({ round: r + 1, pick: r * numTeams + i + 1, teamIdx: ltr ? i : (numTeams - 1 - i) });
    }
  }
  return picks;
}

// Returns { QB: [...], RB: [...], WR: [...], TE: [...] }
// Each array is ordered by rankings with tier info, fpts attached
function getDraftPoolByPos() {
  const result = { QB: [], RB: [], WR: [], TE: [] };
  ['QB','RB','WR','TE'].forEach(pos => {
    const players = getPlayersForPos(pos).map(enrichPlayer);
    const ordered = getRankOrder(pos, players);
    const tierIds = getTiers(pos);
    let tierNum = 1;
    ordered.forEach((p, i) => {
      if (i > 0 && tierIds.includes(p.id)) tierNum++;
      const { fpts } = calcFpts(p);
      result[pos].push({ ...p, posTier: tierNum, tierBreak: i > 0 && tierIds.includes(p.id), fpts: parseFloat(fpts) });
    });
  });
  return result;
}

function formatInitialLast(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return name;
  return parts[0][0] + '. ' + parts.slice(1).join(' ');
}

function splitFirstLast(name) {
  if (!name) return { first: '', last: '' };
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { first: '', last: name };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

function renderDraftPage() {
  const page = document.getElementById('draft-page');
  if (!page) return;
  if (draftState.leagues.length === 0) { renderDraftSetupPrompt(page); return; }
  renderDraftFull(page);
}

function renderDraftSetupPrompt(page) {
  page.innerHTML = '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--text-3);height:100%;"><div style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--border-2);">DRAFT BOARD</div><p style="font-size:11px;letter-spacing:0.08em;">No leagues configured yet</p><button class="draft-btn-primary" style="margin-top:8px;" onclick="openDraftSetupModal()">+ Create League</button></div>';
}

function renderDraftFull(page) {
  const league = getActiveLeague();
  if (!league) { renderDraftSetupPrompt(page); return; }
  const pickOrder = buildPickOrder(league.numTeams, league.numRounds);
  const currentPickIdx = getNextPickIdx(league, buildPickOrder(league.numTeams, league.numRounds));
  const onClockPick = pickOrder[currentPickIdx] || null;
  const isMyPick = onClockPick && onClockPick.teamIdx === (league.myPick - 1);

  const tabs = draftState.leagues.map((lg, i) =>
    '<button class="draft-league-tab' + (i === draftState.activeLeague ? ' active' : '') + '" onclick="setActiveDraftLeague(' + i + ')">' + lg.name + '</button>'
  ).join('');

  const clockBar = onClockPick
    ? '<div class="draft-clock-bar"><span class="draft-clock-pick">Pick ' + onClockPick.pick + '</span><span style="color:var(--text-3);font-size:10px;">Round ' + onClockPick.round + '</span><span class="draft-clock-team ' + (isMyPick ? 'draft-clock-my' : '') + '">' + (isMyPick ? '★ YOUR PICK' : (league.teamNames[onClockPick.teamIdx] || 'Team ' + (onClockPick.teamIdx + 1))) + '</span><div class="draft-clock-spacer"></div>' + (currentPickIdx > 0 ? '<button class="draft-undo-btn" onclick="undraftLastPick()">↩ Undo</button>' : '') + '<button class="draft-reset-btn" onclick="resetDraft()">Reset Draft</button></div>'
    : '<div class="draft-clock-bar"><span style="color:var(--accent);font-weight:600;">✓ Draft Complete</span><div class="draft-clock-spacer"></div><button class="draft-reset-btn" onclick="resetDraft()">Reset Draft</button></div>';

  page.innerHTML =
    '<div class="draft-toolbar"><div style="display:flex;gap:4px;">' + tabs + '</div>' +
    '<button class="draft-league-tab" onclick="openDraftSetupModal()" style="color:var(--accent);border-style:dashed;">+ League</button>' +
    '<div class="draft-toolbar-sep"></div>' +
    '<span style="font-family:var(--font-mono);font-size:10px;color:var(--text-3);">' + league.numTeams + ' teams · ' + league.numRounds + ' rounds · Pick #' + league.myPick + '</span></div>' +
    clockBar +
    '<div class="draft-body">' +
      '<div class="draft-pool" id="draft-pool-panel"></div>' +
      '<div class="draft-main"><div class="draft-main-scroll" id="draft-main-scroll">' +
        '<div class="draft-section-title">DRAFT BOARD</div>' +
        '<div id="draft-board-wrap"></div>' +
        '<div id="draft-rosters-wrap"></div>' +
      '</div></div>' +
    '</div>';

  renderDraftPool(league, onClockPick, window._draftSearchQuery || '');
  renderDraftBoard(league, pickOrder, currentPickIdx, onClockPick);
  renderDraftRosters(league, pickOrder);
}

// ─── 4-column player pool ───
function renderDraftPool(league, onClockPick, searchQuery) {
  const panel = document.getElementById('draft-pool-panel');
  if (!panel) return;
  const byPos = getDraftPoolByPos();
  const draftedIds = new Set((league.picks || []).map(pk => pk.playerId));
  const canDraft = onClockPick !== null;
  const total = Object.values(byPos).flat().length;
  const available = Object.values(byPos).flat().filter(p => !draftedIds.has(p.id)).length;

  // My picks per position
  const myPicksList = (league.picks || []).filter(pk => {
    const idx = pk.pickIndex !== undefined ? pk.pickIndex : pk.pickNum - 1;
    const po = buildPickOrder(league.numTeams, league.numRounds)[idx];
    return po && po.teamIdx === league.myPick - 1;
  });
  const myPosCounts = {};
  myPicksList.forEach(pk => { myPosCounts[pk.pos] = (myPosCounts[pk.pos] || 0) + 1; });

  // Starter slot counts per position
  const slotCounts = {};
  (league.rosterSlots || DRAFT_ROSTER_SLOTS).forEach(s => {
    if (['QB','RB','WR','TE','K','D/ST'].includes(s)) slotCounts[s] = (slotCounts[s] || 0) + 1;
  });

  const posOrder = ['QB','RB','WR','TE'];
  const posClass = { QB:'pos-qb', RB:'pos-rb', WR:'pos-wr', TE:'pos-te' };

  let colsHtml = '';
  posOrder.forEach(pos => {
    const players = byPos[pos];
    // My picks count for this pos
    const myCount = myPosCounts[pos] || 0;
    const slotCount = slotCounts[pos] || 0;
    const needsBadge = slotCount > 0 ? '<span style="font-size:9px;font-weight:600;opacity:0.85;">' + myCount + '/' + slotCount + '</span>' : '';
    const q = (searchQuery || '').toLowerCase().trim();
    let colHtml = '<div class="draft-pos-col"><div class="draft-pos-col-header ' + posClass[pos] + '"><span>' + pos + '</span>' + needsBadge + '</div><div class="draft-pos-col-scroll">';
    let lastTier = null;
    players.forEach(p => {
      if (p.posTier !== lastTier) {
        colHtml += '<div class="draft-tier-label">Tier ' + p.posTier + '</div>';
        lastTier = p.posTier;
      }
      if (q && !p.name.toLowerCase().includes(q) && !p.team.toLowerCase().includes(q)) return;
      const isDrafted = draftedIds.has(p.id);
      const short = p.team.replace(/^.+ /, '');
      const displayName = formatInitialLast(p.name);
      const fptsDisp = isNaN(p.fpts) ? '—' : p.fpts.toFixed(0);
      const safeId = p.id.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      colHtml += '<div class="draft-player-row' + (isDrafted ? ' drafted' : '') + '" data-player-id="' + p.id + '" data-name="' + p.name.replace(/"/g,'&quot;') + '"' +
        (isDrafted ? ' onclick="highlightBoardPick(this)" oncontextmenu="draftCtxFromEl(event,this)" title="Click to locate on board"' :
          (canDraft ? ' onclick="draftPlayer(\'' + safeId + '\')" title="Draft ' + p.name + '"' : '')) + '>' +
        '<div class="draft-player-name">' + displayName + '</div>' +
        '<div class="draft-player-meta"><span>' + short + '</span><span>' + fptsDisp + '</span></div>' +
        '</div>';
    });
    if (players.length === 0) colHtml += '<div style="padding:12px 6px;text-align:center;color:var(--text-3);font-size:10px;">No players</div>';
    colHtml += '</div></div>';
    colsHtml += colHtml;
  });

  const qGlobal = (searchQuery || '').replace(/"/g,'&quot;');
  panel.innerHTML =
    '<div class="draft-pool-header"><span class="draft-pool-title">Available Players</span><span class="draft-pool-count">' + available + ' / ' + total + '</span></div>' +
    '<div class="draft-pool-search"><input type="text" id="draft-search" placeholder="Search players or teams..." value="' + qGlobal + '" oninput="onDraftSearch(this.value)" autocomplete="off"><button class="draft-search-clear' + (qGlobal ? ' visible' : '') + '" onclick="clearDraftSearch()" tabindex="-1">&times;</button></div>' +
    '<div class="draft-pool-cols">' + colsHtml + '</div>';
}

// ─── Draft board ───
function renderDraftBoard(league, pickOrder, currentPickIdx, onClockPick) {
  const wrap = document.getElementById('draft-board-wrap');
  if (!wrap) return;
  const draftedMap = {};
  (league.picks || []).forEach(pk => { draftedMap[pk.pickIndex !== undefined ? pk.pickIndex : pk.pickNum - 1] = pk; });

  // Build positional pick order: for each pick, how many of that pos were drafted before it
  const posCounts = {};
  const posPickNum = {}; // pickIndex -> positional pick number
  // Sort picks by pickIndex to count in draft order
  const sortedPicks = [...(league.picks || [])].sort((a, b) => {
    const ai = a.pickIndex !== undefined ? a.pickIndex : a.pickNum - 1;
    const bi = b.pickIndex !== undefined ? b.pickIndex : b.pickNum - 1;
    return ai - bi;
  });
  sortedPicks.forEach(pk => {
    const idx = pk.pickIndex !== undefined ? pk.pickIndex : pk.pickNum - 1;
    posCounts[pk.pos] = (posCounts[pk.pos] || 0) + 1;
    posPickNum[idx] = posCounts[pk.pos];
  });

  let html = '<table class="draft-board"><thead><tr><th class="round-label-th"></th>';
  for (let t = 0; t < league.numTeams; t++) {
    const isMine = t === league.myPick - 1;
    html += '<th class="' + (isMine ? 'my-team-col' : '') + '" ondblclick="startTeamNameEdit(' + t + ', this, event)" title="Double-click to rename">' + (league.teamNames[t] || 'Team ' + (t+1)) + '</th>';
  }
  html += '</tr></thead><tbody>';

  for (let r = 0; r < league.numRounds; r++) {
    const ltr = r % 2 === 0;
    html += '<tr><td class="round-label">R' + (r+1) + '</td>';
    for (let col = 0; col < league.numTeams; col++) {
      const teamIdx = ltr ? col : (league.numTeams - 1 - col);
      const globalIdx = r * league.numTeams + (ltr ? col : (league.numTeams - 1 - col));
      const isMine = col === league.myPick - 1;
      const isClock = onClockPick && globalIdx === currentPickIdx;
      const filled = draftedMap[globalIdx];
      const cls = (isMine ? ' my-pick-slot' : '') + (isClock ? ' clock-slot' : '');
      if (filled) {
        const color = DRAFT_POS_COLORS[filled.pos] || '#888';
        const short = TEAM_ABBR[filled.team] || (filled.team || '').replace(/^.+ /, '');
        const names = splitFirstLast(filled.name);
        const bg = DRAFT_POS_BG[filled.pos] || '#f0f0f0';
        const overallPick = globalIdx + 1;
        const posPick = posPickNum[globalIdx] || '';
        const teamNickname = (filled.team || '').replace(/^.+ /, '');
        html += '<td class="' + cls + '" data-player-id="' + filled.playerId + '" data-name="' + filled.name.replace(/"/g,'&quot;') + '" data-pos="' + filled.pos + '" oncontextmenu="draftCtxFromEl(event,this)" style="background:' + bg + ' !important;">' +
          '<div class="draft-slot-filled">' +
          '<div class="draft-slot-first">' + names.first + '</div>' +
          '<div class="draft-slot-last">' + names.last + '</div>' +
          '<div class="draft-slot-meta"><span class="draft-slot-meta-team">' + teamNickname + '</span><span class="draft-slot-meta-picks">' + overallPick + '/' + posPick + '</span></div>' +
          '</div></td>';
      } else {
        html += '<td class="' + cls + '"><div class="draft-slot-empty' + (isClock ? ' is-clock' : '') + '">' + (isClock ? '●' : '') + '</div></td>';
      }
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

// ─── Roster view ───
function getRosterSlotStyle(slot) {
  const styles = {
    QB:   'color:#b03030;background:#f0c8c8;border-color:#e05252;',
    RB:   'color:#237040;background:#c0e8cc;border-color:#3a9a5c;',
    WR:   'color:#2060a0;background:#c0d8f0;border-color:#4a90d9;',
    TE:   'color:#8a6800;background:#f0e094;border-color:#c9a800;',
    K:    'color:#6a2d9a;background:#e0d0f0;border-color:#9b59b6;',
    'D/ST': 'color:#5a2d0c;background:#e8d4c0;border-color:#8B4513;',
    FLEX: 'color:#333;background:linear-gradient(to right,#5a8abf 33.3%,#90d4a0 33.3%,#90d4a0 66.6%,#e8d060 66.6%);border-color:#999;',
    SFLX: 'color:#333;background:linear-gradient(#5a8abf 0%,#5a8abf 100%) top left/50% 50% no-repeat,linear-gradient(#90d4a0 0%,#90d4a0 100%) top right/50% 50% no-repeat,linear-gradient(#e8d060 0%,#e8d060 100%) bottom left/50% 50% no-repeat,linear-gradient(#e89090 0%,#e89090 100%) bottom right/50% 50% no-repeat;border-color:#999;',
    BN:   'color:var(--text-3);background:var(--bg-3);border-color:var(--border);',
  };
  return styles[slot] || 'color:var(--text-3);background:var(--bg-3);';
}

function renderDraftRosters(league, pickOrder) {
  const wrap = document.getElementById('draft-rosters-wrap');
  if (!wrap) return;
  const teamPicks = Array.from({ length: league.numTeams }, () => []);
  (league.picks || []).forEach(pk => { const idx = pk.pickIndex !== undefined ? pk.pickIndex : pk.pickNum - 1; const po = pickOrder[idx]; if (po) teamPicks[po.teamIdx].push(pk); });
  const slots = league.rosterSlots || DRAFT_ROSTER_SLOTS;

  let header = '';
  let html = '<table class="draft-rosters"><thead><tr><th class="round-label-th"></th>';
  for (let t = 0; t < league.numTeams; t++) {
    const isMine = t === league.myPick - 1;
    html += '<th class="' + (isMine ? 'my-team-col' : '') + '">' + (league.teamNames[t] || 'Team ' + (t+1)) + '</th>';
  }
  html += '</tr></thead><tbody>';
  slots.forEach((slot, slotIdx) => {
    html += '<tr><td class="slot-label" style="' + getRosterSlotStyle(slot) + '">' + slot + '</td>';
    for (let t = 0; t < league.numTeams; t++) {
      const isMine = t === league.myPick - 1;
      const usedSet = getUsedForTeam(teamPicks[t], slots, slotIdx);
      const match = teamPicks[t].filter(pk => matchesRosterSlot(pk.pos, slot)).find(pk => !usedSet.has(pk.playerId));
      const cls = isMine ? ' my-pick-slot' : '';
      if (match) {
        const color = DRAFT_POS_COLORS[match.pos] || '#888';
        const displayName = formatInitialLast(match.name);
        html += '<td class="' + cls + '"><div class="roster-slot-name"><span class="draft-slot-pos-dot" style="background:' + color + ';"></span>' + displayName + '</div></td>';
      } else {
        html += '<td class="' + cls + '"><span class="roster-slot-empty">—</span></td>';
      }
    }
    html += '</tr>';
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

function matchesRosterSlot(pos, slot) {
  if (slot === 'BN') return true;
  if (slot === 'FLEX') return ['RB','WR','TE'].includes(pos);
  if (slot === 'SFLX') return ['QB','RB','WR','TE'].includes(pos);
  if (slot === 'D/ST' || slot === 'DST') return ['D/ST','DST','DEF'].includes(pos);
  return pos === slot;
}

function getUsedForTeam(teamPicksList, slots, currentSlotIdx) {
  const used = new Set();
  for (let i = 0; i < currentSlotIdx; i++) {
    const match = teamPicksList.filter(pk => matchesRosterSlot(pk.pos, slots[i])).find(pk => !used.has(pk.playerId));
    if (match) used.add(match.playerId);
  }
  return used;
}

function getNextPickIdx(league, pickOrder) {
  const filled = new Set((league.picks || []).map(pk => pk.pickIndex !== undefined ? pk.pickIndex : pk.pickNum - 1));
  for (let i = 0; i < pickOrder.length; i++) {
    if (!filled.has(i)) return i;
  }
  return pickOrder.length; // draft complete
}

function clearDraftSearch() {
  window._draftSearchQuery = '';
  const league = getActiveLeague();
  if (!league) return;
  const pickOrder = buildPickOrder(league.numTeams, league.numRounds);
  const currentPickIdx = getNextPickIdx(league, pickOrder);
  const onClockPick = pickOrder[currentPickIdx] || null;
  renderDraftPool(league, onClockPick, '');
  const input = document.getElementById('draft-search');
  if (input) input.focus();
}

function onDraftSearch(val) {
  window._draftSearchQuery = val;
  const league = getActiveLeague();
  if (!league) return;
  const pickOrder = buildPickOrder(league.numTeams, league.numRounds);
  const currentPickIdx = getNextPickIdx(league, pickOrder);
  const onClockPick = pickOrder[currentPickIdx] || null;
  renderDraftPool(league, onClockPick, val);
  const input = document.getElementById('draft-search');
  if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  const clearBtn = document.querySelector('.draft-search-clear');
  if (clearBtn) clearBtn.classList.toggle('visible', !!val);
}

function renderDraftFullPreserveScroll() {
  // Save scroll positions of all scrollable containers
  const scrollIds = ['draft-main-scroll'];
  const saved = {};
  scrollIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) saved[id] = { top: el.scrollTop, left: el.scrollLeft };
  });
  // Save individual pos column scrolls by index
  document.querySelectorAll('.draft-pos-col-scroll').forEach((el, i) => {
    saved['col-' + i] = { top: el.scrollTop };
  });

  renderDraftFull(document.getElementById('draft-page'));

  // Restore scroll positions
  scrollIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && saved[id]) { el.scrollTop = saved[id].top; el.scrollLeft = saved[id].left; }
  });
  document.querySelectorAll('.draft-pos-col-scroll').forEach((el, i) => {
    if (saved['col-' + i]) el.scrollTop = saved['col-' + i].top;
  });
}

function draftPlayer(playerId) {
  const league = getActiveLeague();
  if (!league) return;
  const pickOrder = buildPickOrder(league.numTeams, league.numRounds);
  const currentPickIdx = getNextPickIdx(league, buildPickOrder(league.numTeams, league.numRounds));
  if (currentPickIdx >= pickOrder.length) return;
  const byPos = getDraftPoolByPos();
  const allPlayers = Object.values(byPos).flat();
  const player = allPlayers.find(p => p.id === playerId);
  if (!player) return;
  if (!league.picks) league.picks = [];
  league.picks.push({ playerId, name: player.name, pos: player.pos, team: player.team, pickNum: currentPickIdx + 1, pickIndex: currentPickIdx });
  saveDraftState();
  renderDraftFullPreserveScroll();
}

function undraftLastPick() {
  const league = getActiveLeague();
  if (!league || !league.picks || league.picks.length === 0) return;
  if (!confirm('Undo the last pick?')) return;
  league.picks.pop();
  saveDraftState();
  renderDraftFullPreserveScroll();
}

function resetDraft() {
  const league = getActiveLeague();
  if (!league) return;
  if (!confirm('Reset all picks for "' + league.name + '"?')) return;
  league.picks = [];
  window._draftSearchQuery = '';
  saveDraftState();
  renderDraftFull(document.getElementById('draft-page'));
}

function setActiveDraftLeague(i) {
  if (i === draftState.activeLeague) {
    openDraftSetupModal(i);
    return;
  }
  draftState.activeLeague = i;
  window._draftSearchQuery = '';
  saveDraftState();
  renderDraftPage();
}

function startTeamNameEdit(teamIdx, th, e) {
  e.stopPropagation();
  const league = getActiveLeague();
  if (!league) return;
  const current = league.teamNames[teamIdx] || ('Team ' + (teamIdx + 1));
  const input = document.createElement('input');
  input.style.cssText = 'background:none;border:none;outline:none;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:inherit;text-align:center;width:100%;cursor:text;padding:0;';
  input.value = current;
  th.innerHTML = '';
  th.appendChild(input);
  input.focus(); input.select();
  const commit = () => { const val = input.value.trim() || ('Team ' + (teamIdx + 1)); league.teamNames[teamIdx] = val; saveDraftState(); th.textContent = val; };
  input.onblur = commit;
  input.onkeydown = ev => { if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); } if (ev.key === 'Escape') { ev.preventDefault(); th.textContent = current; } };
}

function slotsToPosCounts(slots) {
  const counts = { QB:0, RB:0, WR:0, TE:0, FLEX:0, SFLX:0, K:0, 'D/ST':0 };
  (slots || DRAFT_ROSTER_SLOTS).forEach(s => { if (s in counts) counts[s]++; });
  return counts;
}

function posCountsToSlots(counts) {
  const order = ['QB','RB','WR','TE','FLEX','SFLX','K','D/ST'];
  const slots = [];
  order.forEach(pos => { for (let i = 0; i < (counts[pos]||0); i++) slots.push(pos); });
  return slots;
}

function stepperHtml(id, val, min) {
  return '<div class="draft-stepper">' +
    '<button type="button" onclick="dsStep(\'' + id + '\',-1,' + min + ')">&#8722;</button>' +
    '<input type="number" id="' + id + '" value="' + val + '" min="' + min + '" max="9" oninput="dsBenchUpdate()">' +
    '<button type="button" onclick="dsStep(\'' + id + '\',1,' + min + ')">+</button>' +
    '</div>';
}

function dsStep(id, delta, min) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = Math.max(min, Math.min(9, parseInt(el.value||0) + delta));
  dsBenchUpdate();
}

function dsBenchUpdate() {
  const rounds = parseInt(document.getElementById('ds-rounds').value) || 16;
  const ids = ['ds-pos-QB','ds-pos-RB','ds-pos-WR','ds-pos-TE','ds-pos-FLEX','ds-pos-SFLX','ds-pos-K','ds-pos-DST'];
  const starters = ids.reduce((s, id) => s + (parseInt(document.getElementById(id)?.value)||0), 0);
  const bench = Math.max(0, rounds - starters);
  const el = document.getElementById('ds-bench-summary');
  if (el) el.innerHTML = '<span>Starters</span> <strong>' + starters + '</strong> &nbsp;&middot;&nbsp; <span>Rounds</span> <strong>' + rounds + '</strong> &nbsp;&middot;&nbsp; <span>Bench</span> <strong>' + bench + '</strong>';
}

function openDraftSetupModal(editIdx) {
  const isEdit = editIdx !== undefined;
  const existing = isEdit ? draftState.leagues[editIdx] : null;
  const defTeams = existing ? existing.numTeams : 12;
  const defPick = existing ? existing.myPick : 1;
  const defRounds = existing ? existing.numRounds : 16;
  const pc = slotsToPosCounts(existing ? existing.rosterSlots : null);
  const starters = Object.values(pc).reduce((a,b)=>a+b,0);
  const bench = Math.max(0, defRounds - starters);
  const numTeamsOpts = [8,10,12,14].map(n => '<option value="' + n + '"' + (defTeams===n?' selected':'') + '>' + n + ' teams</option>').join('');
  const myPickOpts = Array.from({length:defTeams},(_,i) => '<option value="' + (i+1) + '"' + (defPick===i+1?' selected':'') + '>Pick ' + (i+1) + '</option>').join('');
  const numRoundsOpts = [14,15,16,17,18].map(n => '<option value="' + n + '"' + (defRounds===n?' selected':'') + '>' + n + ' rounds</option>').join('');
  const overlay = document.createElement('div');
  overlay.className = 'draft-setup-overlay';
  overlay.innerHTML =
    '<div class="draft-setup-modal" onclick="event.stopPropagation()" style="max-width:720px;">' +
    '<h2>' + (isEdit ? 'Edit League' : 'New League') + '</h2>' +
    '<div class="draft-setup-field"><label>League Name</label><input type="text" id="ds-name" value="' + (existing ? existing.name : 'My League') + '"></div>' +
    '<div class="draft-setup-field"><label>Teams</label><select id="ds-teams" onchange="updateMyPickOptions(this.value)">' + numTeamsOpts + '</select></div>' +
    '<div class="draft-setup-field"><label>Your Draft Position</label><select id="ds-mypick">' + myPickOpts + '</select></div>' +
    '<div class="draft-setup-field"><label>Rounds</label><select id="ds-rounds" onchange="dsBenchUpdate()">' + numRoundsOpts + '</select></div>' +
    '<div class="draft-setup-section-title">Roster Slots</div>' +
    '<div class="draft-roster-builder">' +
    '<div class="draft-roster-builder-cell"><span class="draft-pos-badge" style="background:#f0c8c8;color:#b03030;border:1px solid #e05252;">QB</span>' + stepperHtml('ds-pos-QB', pc.QB, 0) + '</div>' +
    '<div class="draft-roster-builder-cell"><span class="draft-pos-badge" style="background:#c0e8cc;color:#237040;border:1px solid #3a9a5c;">RB</span>' + stepperHtml('ds-pos-RB', pc.RB, 0) + '</div>' +
    '<div class="draft-roster-builder-cell"><span class="draft-pos-badge" style="background:#c0d8f0;color:#2060a0;border:1px solid #4a90d9;">WR</span>' + stepperHtml('ds-pos-WR', pc.WR, 0) + '</div>' +
    '<div class="draft-roster-builder-cell"><span class="draft-pos-badge" style="background:#f0e094;color:#8a6800;border:1px solid #c9a800;">TE</span>' + stepperHtml('ds-pos-TE', pc.TE, 0) + '</div>' +
    '<div class="draft-roster-builder-cell"><span class="draft-pos-badge draft-pos-badge-flex" title="FLEX (RB/WR/TE)"><span class="draft-pos-badge-label">WRT</span></span>' + stepperHtml('ds-pos-FLEX', pc.FLEX||0, 0) + '</div>' +
    '<div class="draft-roster-builder-cell"><span class="draft-pos-badge draft-pos-badge-sflx" title="SUPERFLEX (QB/RB/WR/TE)"><span class="draft-pos-badge-label" style="line-height:1.1;">WR<br>TQ</span></span>' + stepperHtml('ds-pos-SFLX', pc.SFLX||0, 0) + '</div>' +
    '<div class="draft-roster-builder-cell"><span class="draft-pos-badge" style="background:#e0d0f0;color:#6a2d9a;border:1px solid #9b59b6;">K</span>' + stepperHtml('ds-pos-K', pc.K, 0) + '</div>' +
    '<div class="draft-roster-builder-cell"><span class="draft-pos-badge" style="background:#e8d4c0;color:#5a2d0c;border:1px solid #8B4513;">D/ST</span>' + stepperHtml('ds-pos-DST', pc["D/ST"], 0) + '</div>' +
    '</div>' +
    '<div class="draft-bench-summary" id="ds-bench-summary"><span>Starters</span> <strong>' + starters + '</strong> &nbsp;&middot;&nbsp; <span>Rounds</span> <strong>' + defRounds + '</strong> &nbsp;&middot;&nbsp; <span>Bench</span> <strong>' + bench + '</strong></div>' +
    '<div class="draft-setup-actions">' +
    (isEdit ? '<button class="draft-btn-secondary" style="color:var(--red);border-color:var(--red);margin-right:auto;" onclick="deleteDraftLeague(' + editIdx + ')">Delete</button>' : '') +
    '<button class="draft-btn-secondary" onclick="this.closest(\'.draft-setup-overlay\').remove()">Cancel</button>' +
    '<button class="draft-btn-primary" onclick="saveDraftLeague(' + (isEdit ? editIdx : 'null') + ')">' + (isEdit ? 'Save' : 'Create') + '</button>' +
    '</div></div>';
  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}

function updateMyPickOptions(numTeams) {
  const sel = document.getElementById('ds-mypick');
  if (!sel) return;
  const cur = parseInt(sel.value);
  sel.innerHTML = Array.from({length:parseInt(numTeams)},(_,i) => '<option value="' + (i+1) + '"' + (cur===i+1?' selected':'') + '>Pick ' + (i+1) + '</option>').join('');
}

function saveDraftLeague(editIdx) {
  const name = (document.getElementById('ds-name').value || '').trim() || 'My League';
  const numTeams = parseInt(document.getElementById('ds-teams').value);
  const myPick = parseInt(document.getElementById('ds-mypick').value);
  const numRounds = parseInt(document.getElementById('ds-rounds').value);
  const pc = {
    QB: parseInt(document.getElementById('ds-pos-QB')?.value)||0,
    RB: parseInt(document.getElementById('ds-pos-RB')?.value)||0,
    WR: parseInt(document.getElementById('ds-pos-WR')?.value)||0,
    TE: parseInt(document.getElementById('ds-pos-TE')?.value)||0,
    FLEX: parseInt(document.getElementById('ds-pos-FLEX')?.value)||0,
    SFLX: parseInt(document.getElementById('ds-pos-SFLX')?.value)||0,
    K:  parseInt(document.getElementById('ds-pos-K')?.value)||0,
    'D/ST': parseInt(document.getElementById('ds-pos-DST')?.value)||0,
  };
  const starterSlots = posCountsToSlots(pc);
  const benchCount = Math.max(0, numRounds - starterSlots.length);
  const rosterSlots = [...starterSlots, ...Array(benchCount).fill('BN')];
  const isEdit = editIdx !== null && editIdx !== 'null' && editIdx !== undefined;
  if (isEdit) {
    const ex = draftState.leagues[editIdx];
    ex.name = name; ex.numTeams = numTeams; ex.myPick = myPick; ex.numRounds = numRounds;
    ex.rosterSlots = rosterSlots;
    if (!ex.teamNames) ex.teamNames = [];
    while (ex.teamNames.length < numTeams) ex.teamNames.push('Team ' + (ex.teamNames.length + 1));
    ex.teamNames.length = numTeams;
  } else {
    draftState.leagues.push({ name, numTeams, myPick, numRounds, teamNames: Array.from({length:numTeams},(_,i)=>'Team '+(i+1)), picks: [], rosterSlots });
    draftState.activeLeague = draftState.leagues.length - 1;
  }
  saveDraftState();
  document.querySelector('.draft-setup-overlay').remove();
  renderDraftPage();
}
function deleteDraftLeague(idx) {
  if (!confirm('Delete "' + draftState.leagues[idx].name + '"?')) return;
  draftState.leagues.splice(idx, 1);
  draftState.activeLeague = Math.max(0, Math.min(draftState.activeLeague, draftState.leagues.length - 1));
  saveDraftState();
  document.querySelector('.draft-setup-overlay').remove();
  renderDraftPage();
}

function highlightBoardPick(el) {
  const playerId = el.dataset.playerId;
  // Clear any previous highlight
  document.querySelectorAll('.draft-board td.pick-highlight').forEach(e => {
    e.classList.remove('pick-highlight');
    const pos = e.dataset.pos;
    e.style.background = (DRAFT_POS_BG[pos] || '#f0f0f0');
  });
  const td = document.querySelector('.draft-board td[data-player-id="' + playerId + '"]');
  if (!td) return;
  const pos = td.dataset.pos;
  const boldBg = DRAFT_POS_BG_BOLD[pos] || '#d0d0d0';
  td.classList.add('pick-highlight');
  td.style.background = boldBg;
  td.querySelectorAll('.draft-slot-first,.draft-slot-last,.draft-slot-meta-team,.draft-slot-meta-picks').forEach(el => el.style.color = '#000');
  td.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  setTimeout(() => {
    td.classList.remove('pick-highlight');
    td.style.background = DRAFT_POS_BG[pos] || '#f0f0f0';
    td.querySelectorAll('.draft-slot-first,.draft-slot-last,.draft-slot-meta-team,.draft-slot-meta-picks').forEach(el => el.style.color = '');
  }, 2000);
}

function draftCtxFromEl(e, el) {
  showDraftCtxMenu(e, el.dataset.playerId, el.dataset.name);
}

function showDraftCtxMenu(e, playerId, playerName) {
  e.preventDefault();
  e.stopPropagation();
  document.querySelectorAll('.draft-ctx-menu').forEach(m => m.remove());
  const menu = document.createElement('div');
  menu.className = 'draft-ctx-menu';

  // Label
  const label = document.createElement('div');
  label.style.cssText = 'padding:5px 14px 4px;font-size:10px;color:var(--text-3);letter-spacing:0.06em;text-transform:uppercase;border-bottom:1px solid var(--border);margin-bottom:3px;';
  label.textContent = playerName;
  menu.appendChild(label);

  const onlyItem = document.createElement('div');
  onlyItem.className = 'danger';
  onlyItem.textContent = 'Undraft this pick only';
  onlyItem.onclick = () => { menu.remove(); undraftPlayer(playerId, false); };
  menu.appendChild(onlyItem);

  const allItem = document.createElement('div');
  allItem.className = 'danger';
  allItem.textContent = 'Undraft this and all after';
  allItem.onclick = () => { menu.remove(); undraftPlayer(playerId, true); };
  menu.appendChild(allItem);

  document.body.appendChild(menu);
  const mw = menu.offsetWidth || 180, mh = menu.offsetHeight || 80;
  menu.style.left = (e.clientX + mw > window.innerWidth ? e.clientX - mw : e.clientX) + 'px';
  menu.style.top  = (e.clientY + mh > window.innerHeight ? e.clientY - mh : e.clientY) + 'px';
  const close = ev => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('mousedown', close); } };
  setTimeout(() => document.addEventListener('mousedown', close), 0);
}

function undraftPlayer(playerId, andAllAfter) {
  const league = getActiveLeague();
  if (!league || !league.picks) return;
  const idx = league.picks.findIndex(pk => pk.playerId === playerId);
  if (idx === -1) return;
  if (andAllAfter) {
    league.picks.splice(idx);
  } else {
    league.picks.splice(idx, 1);
  }
  saveDraftState();
  renderDraftFullPreserveScroll();
}

// ─── End draft page ───────────────────────────────────────────────────────────
let _booted = false;
function bootApp() {
  if (_booted) return;
  _booted = true;
  loadStatMap();
  loadHistEdits();
  buildSidebar();
  if (selectedTeam) {
    refreshSidebarDots();
    renderMain();
  }
  loadStatMap();
  applyAllColorOverrides();
}

initAuth();

// Forward vertical wheel events from inner scroll containers to the right scroll parent
(function() {
  let _scrollTarget = null;
  let _pending = 0;
  let _rafId = null;

  function _flush() {
    if (!_scrollTarget || _pending === 0) { _rafId = null; return; }
    const step = _pending * 0.3;
    _scrollTarget.scrollTop += step;
    _pending -= step;
    if (Math.abs(_pending) < 0.5) { _scrollTarget.scrollTop += _pending; _pending = 0; _rafId = null; }
    else { _rafId = requestAnimationFrame(_flush); }
  }

  window.attachTableWheelHandlers = function() {
    document.querySelectorAll('.player-table-wrap, .stats-table-wrap').forEach(el => {
      if (el._wheelAttached) return;
      el._wheelAttached = true;
      el.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          _scrollTarget = document.getElementById('main');
          const lineHeight = 16;
          const pageHeight = _scrollTarget ? _scrollTarget.clientHeight : 800;
          const pixels = e.deltaMode === 1 ? e.deltaY * lineHeight
                       : e.deltaMode === 2 ? e.deltaY * pageHeight
                       : e.deltaY;
          _pending += pixels;
          if (!_rafId) _rafId = requestAnimationFrame(_flush);
        }
      }, { passive: false, capture: true });
    });
  };
})();

(function restoreSession() {
  const lastPage = localStorage.getItem('ff_last_page');
  const lastTeam = localStorage.getItem('ff_last_team');
  const lastDataView = localStorage.getItem('ff_last_data_view');
  if (lastDataView) dataView = lastDataView;
  if (lastPage && lastPage !== 'projections') {
    switchPage(lastPage);
  } else {
    if (lastTeam) selectTeam(lastTeam);
    else switchPage('projections');
  }
})();

// ─── Test / Sandbox page ───────────────────────────────────────────────────

const TEST_NODES_DEFAULT = [
  { key: "totalPlays", label: "Total Plays", grp: "plays", x: 430, y: 52,  val: 1000, locked: false },
  { key: "passPlays",  label: "Pass Plays",  grp: "plays", x: 255, y: 155, val: 600,  locked: false },
  { key: "rushPlays",  label: "Rush Plays",  grp: "plays", x: 605, y: 155, val: 400,  locked: false },
  { key: "passAtt",    label: "Pass Att",    grp: "pass",  x: 185, y: 268, val: 570,  locked: false },
  { key: "passYds",    label: "Pass Yds",    grp: "pass",  x: 65,  y: 388, val: 4200, locked: false },
  { key: "passTD",     label: "Pass TD",     grp: "pass",  x: 195, y: 388, val: 30,   locked: false },
  { key: "targets",    label: "Targets",     grp: "pass",  x: 330, y: 388, val: 580,  locked: false },
  { key: "rushAtt",    label: "Rush Att",    grp: "rush",  x: 610, y: 268, val: 400,  locked: false },
  { key: "rushYds",    label: "Rush Yds",    grp: "rush",  x: 520, y: 388, val: 1700, locked: false },
  { key: "rushTD",     label: "Rush TD",     grp: "rush",  x: 670, y: 388, val: 18,   locked: false },
];

const TEST_GRP_COLOR = { plays: "#3a7d0a", pass: "#1258a8", rush: "#9a5500" };

const TEST_EDGES = [
  { a: "totalPlays", b: "passPlays",  type: "split" },
  { a: "totalPlays", b: "rushPlays",  type: "split" },
  { a: "rushPlays",  b: "rushAtt",    type: "equal" },
  { a: "passPlays",  b: "passAtt",    type: "loose" },
  { a: "passAtt",    b: "targets",    type: "loose" },
  { a: "passAtt",    b: "passYds",    type: "loose" },
  { a: "passAtt",    b: "passTD",     type: "loose" },
  { a: "rushAtt",    b: "rushYds",    type: "loose" },
  { a: "rushAtt",    b: "rushTD",     type: "loose" },
];

let testNodes = null;
let testDrag = null;
let testRafPending = false;

function initTestNodes() {
  testNodes = TEST_NODES_DEFAULT.map(n => ({ ...n }));
}

function getTestNode(key) {
  return testNodes.find(n => n.key === key);
}

function applyTestConstraint(changedKey, oldVal, newVal) {
  const delta = newVal - oldVal;
  if (delta === 0) return;
  const node = getTestNode(changedKey);
  node.val = newVal;

  if (changedKey === "passPlays") {
    const tp = getTestNode("totalPlays");
    const rp = getTestNode("rushPlays");
    if (!rp.locked) {
      if (!tp.locked) rp.val = Math.max(0, tp.val - newVal);
      else rp.val = Math.max(0, rp.val - delta);
    }
  } else if (changedKey === "rushPlays") {
    const tp = getTestNode("totalPlays");
    const pp = getTestNode("passPlays");
    if (!pp.locked) {
      if (!tp.locked) pp.val = Math.max(0, tp.val - newVal);
      else pp.val = Math.max(0, pp.val - delta);
    }
    const ra = getTestNode("rushAtt");
    if (!ra.locked) ra.val = newVal;
  } else if (changedKey === "totalPlays") {
    const pp = getTestNode("passPlays");
    const rp = getTestNode("rushPlays");
    if (!pp.locked && !rp.locked) {
      const ratio = (pp.val + rp.val) > 0 ? pp.val / (pp.val + rp.val) : 0.6;
      pp.val = Math.round(newVal * ratio);
      rp.val = newVal - pp.val;
      const ra = getTestNode("rushAtt");
      if (!ra.locked) ra.val = rp.val;
    } else if (!pp.locked) {
      pp.val = Math.max(0, newVal - rp.val);
    } else if (!rp.locked) {
      rp.val = Math.max(0, newVal - pp.val);
      const ra = getTestNode("rushAtt");
      if (!ra.locked) ra.val = rp.val;
    }
  } else if (changedKey === "rushAtt") {
    const rp = getTestNode("rushPlays");
    if (!rp.locked) {
      rp.val = newVal;
      const tp = getTestNode("totalPlays");
      const pp = getTestNode("passPlays");
      if (!pp.locked && !tp.locked) pp.val = Math.max(0, tp.val - newVal);
    }
  }
}

function renderTestPage() {
  const container = document.getElementById("test-page");
  if (!testNodes) initTestNodes();
  container.innerHTML = `
    <div class="test-header">
      <span style="font-family:var(--font-display);font-size:13px;font-weight:700;letter-spacing:0.05em;">Constraint Web</span>
      <span class="test-badge">SANDBOX</span>
      <span class="test-hint">Drag nodes up/down to scrub &nbsp;·&nbsp; Click lock icon to pin</span>
      <button class="test-reset-btn" id="test-reset-btn">Reset</button>
    </div>
    <svg class="test-svg" id="test-svg" viewBox="0 0 860 480" preserveAspectRatio="xMidYMid meet"></svg>
  `;
  document.getElementById("test-reset-btn").addEventListener("click", () => { initTestNodes(); drawTestGraph(); });
  drawTestGraph();
  document.addEventListener("mousemove", testOnMouseMove);
  document.addEventListener("mouseup", testOnMouseUp);
}

function drawTestGraph() {
  const svg = document.getElementById("test-svg");
  if (!svg || !testNodes) return;
  const isDark = document.documentElement.getAttribute("data-theme") !== "light";
  const edgeLoose = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  const edgeSplit  = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
  const textMain   = isDark ? "#e8e8e8" : "#111";
  const textSub    = isDark ? "#888" : "#666";
  const nodeBg     = isDark ? "#1e1e1e" : "#f4f4f4";
  const lockOn     = isDark ? "#ffcc44" : "#cc8800";
  const lockOff    = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.22)";
  const R = 42;

  function fmt(key, val) {
    if (["passYds","rushYds"].includes(key)) return val >= 1000 ? (val/1000).toFixed(1)+"k" : String(Math.round(val));
    return String(Math.round(val));
  }

  let out = "";

  // edges
  for (const e of TEST_EDGES) {
    const a = testNodes.find(n => n.key === e.a);
    const b = testNodes.find(n => n.key === e.b);
    const isSplit = e.type === "split";
    const stroke = isSplit ? edgeSplit : edgeLoose;
    const dash = e.type === "loose" ? ' stroke-dasharray="5,4"' : '';
    const width = isSplit ? 2 : 1.5;
    out += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${stroke}" stroke-width="${width}"${dash}/>`;
  }

  // group labels
  out += `<text x="430" y="14" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="0.12em" fill="${TEST_GRP_COLOR.plays}" font-family="var(--font-display)" opacity="0.65">PLAYS</text>`;
  out += `<text x="155" y="230" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="0.12em" fill="${TEST_GRP_COLOR.pass}" font-family="var(--font-display)" opacity="0.65">PASSING</text>`;
  out += `<text x="660" y="230" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="0.12em" fill="${TEST_GRP_COLOR.rush}" font-family="var(--font-display)" opacity="0.65">RUSHING</text>`;

  // nodes
  for (const n of testNodes) {
    const c = TEST_GRP_COLOR[n.grp];
    const sw = n.locked ? 2.5 : 1.5;
    const lockFill = n.locked ? lockOn : lockOff;
    const lockGlyph = n.locked ? "🔒" : "🔓";
    out += `<circle cx="${n.x}" cy="${n.y}" r="${R}" fill="${nodeBg}" stroke="${c}" stroke-width="${sw}" class="test-node" data-key="${n.key}" style="cursor:ns-resize;"/>`;
    out += `<text x="${n.x}" y="${n.y-10}" text-anchor="middle" font-size="9" fill="${textSub}" font-family="var(--font-mono)" pointer-events="none">${n.label}</text>`;
    out += `<text x="${n.x}" y="${n.y+7}" text-anchor="middle" font-size="14" font-weight="700" fill="${textMain}" font-family="var(--font-mono)" pointer-events="none">${fmt(n.key, n.val)}</text>`;
    out += `<text x="${n.x+30}" y="${n.y-26}" font-size="11" fill="${lockFill}" text-anchor="middle" class="test-lock" data-key="${n.key}" style="cursor:pointer;">${lockGlyph}</text>`;
  }

  svg.innerHTML = out;

  svg.querySelectorAll(".test-lock").forEach(el => {
    el.addEventListener("click", ev => {
      const nd = getTestNode(el.getAttribute("data-key"));
      if (nd) { nd.locked = !nd.locked; drawTestGraph(); }
      ev.stopPropagation();
    });
  });
  svg.querySelectorAll(".test-node").forEach(el => {
    el.addEventListener("mousedown", testOnMouseDown);
  });
}

function testOnMouseDown(e) {
  const key = e.currentTarget.getAttribute("data-key");
  const node = getTestNode(key);
  if (!node || node.locked) return;
  const sensitivity = Math.max(0.3, node.val / 100);
  testDrag = { key, startY: e.clientY, startVal: node.val, sensitivity };
  e.preventDefault();
}

function testOnMouseMove(e) {
  if (!testDrag || testRafPending) return;
  testRafPending = true;
  requestAnimationFrame(() => {
    testRafPending = false;
    if (!testDrag) return;
    const dy = testDrag.startY - e.clientY;
    const newVal = Math.max(0, Math.round(testDrag.startVal + dy * testDrag.sensitivity));
    const node = getTestNode(testDrag.key);
    if (!node || node.locked) return;
    applyTestConstraint(testDrag.key, node.val, newVal);
    drawTestGraph();
  });
}

function testOnMouseUp() {
  testDrag = null;
}
