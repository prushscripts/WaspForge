import { useState, useEffect, useRef, useCallback } from “react”;

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
bg0: “#0a0c10”,
bg1: “#0d1117”,
bg2: “#161b22”,
bg3: “#1c2333”,
bg4: “#21262d”,
border: “#30363d”,
borderBright: “#444c56”,
accent: “#f78166”,
accentBlue: “#79c0ff”,
accentGreen: “#56d364”,
accentYellow: “#e3b341”,
accentPurple: “#bc8cff”,
accentOrange: “#ffa657”,
text0: “#e6edf3”,
text1: “#c9d1d9”,
text2: “#8b949e”,
text3: “#484f58”,
red: “#ff6b6b”,
yellow: “#f0d060”,
green: “#3fb950”,
};

const styles = `
@import url(‘https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap’);

- { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg0}; color: ${T.text0}; font-family: ‘Syne’, sans-serif; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${T.bg1}; }
  ::-webkit-scrollbar-thumb { background: ${T.bg4}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${T.borderBright}; }

.wf-root { display: flex; flex-direction: column; height: 100vh; background: ${T.bg0}; overflow: hidden; }

/* HEADER */
.wf-header {
display: flex; align-items: center; justify-content: space-between;
padding: 0 20px; height: 52px; background: ${T.bg1};
border-bottom: 1px solid ${T.border}; flex-shrink: 0; z-index: 100;
}
.wf-logo { display: flex; align-items: center; gap: 10px; }
.wf-logo-icon {
width: 28px; height: 28px; background: linear-gradient(135deg, ${T.accent}, ${T.accentPurple});
border-radius: 7px; display: flex; align-items: center; justify-content: center;
font-size: 14px; flex-shrink: 0;
}
.wf-logo-name { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; color: ${T.text0}; }
.wf-logo-ver { font-size: 11px; color: ${T.text2}; margin-top: 1px; font-family: ‘JetBrains Mono’, monospace; }
.wf-header-actions { display: flex; gap: 8px; align-items: center; }
.wf-btn { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 6px;
border: 1px solid ${T.border}; background: ${T.bg3}; color: ${T.text1};
font-size: 12px; font-family: ‘Syne’, sans-serif; cursor: pointer; transition: all 0.15s;
font-weight: 500; white-space: nowrap; }
.wf-btn:hover { border-color: ${T.borderBright}; background: ${T.bg4}; color: ${T.text0}; }
.wf-btn-primary { background: ${T.accent}; border-color: ${T.accent}; color: #000; font-weight: 700; }
.wf-btn-primary:hover { background: #ff8f7a; border-color: #ff8f7a; }
.wf-btn-green { background: ${T.accentGreen}; border-color: ${T.accentGreen}; color: #000; font-weight: 700; }
.wf-btn-green:hover { background: #4dda5d; }
.wf-btn-ghost { background: transparent; border-color: transparent; }
.wf-btn-ghost:hover { background: ${T.bg3}; border-color: ${T.border}; }
.wf-btn-danger { background: transparent; border-color: #ff6b6b44; color: ${T.red}; }
.wf-btn-danger:hover { background: #ff6b6b22; border-color: ${T.red}; }
.wf-btn-sm { padding: 3px 8px; font-size: 11px; }
.wf-btn-icon { padding: 5px; width: 28px; justify-content: center; }

/* TABS */
.wf-tabs { display: flex; align-items: center; gap: 2px; padding: 0 4px;
border-bottom: 1px solid ${T.border}; background: ${T.bg1}; flex-shrink: 0; }
.wf-tab { padding: 8px 16px; font-size: 12px; font-weight: 600; cursor: pointer;
color: ${T.text2}; border-bottom: 2px solid transparent; transition: all 0.15s;
display: flex; align-items: center; gap: 6px; letter-spacing: 0.3px; }
.wf-tab:hover { color: ${T.text1}; }
.wf-tab.active { color: ${T.text0}; border-bottom-color: ${T.accent}; }
.wf-tab-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

/* MAIN LAYOUT */
.wf-main { display: flex; flex: 1; overflow: hidden; }
.wf-left { width: 340px; flex-shrink: 0; border-right: 1px solid ${T.border};
display: flex; flex-direction: column; background: ${T.bg1}; overflow: hidden; }
.wf-right { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* SECTION HEADERS */
.wf-section-header { padding: 10px 14px 8px; border-bottom: 1px solid ${T.border};
display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.wf-section-title { font-size: 11px; font-weight: 700; letter-spacing: 1px;
text-transform: uppercase; color: ${T.text2}; }

/* SCRIPT META */
.wf-meta { padding: 12px 14px; border-bottom: 1px solid ${T.border}; display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
.wf-field { display: flex; flex-direction: column; gap: 4px; }
.wf-label { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: ${T.text2}; }
.wf-input { background: ${T.bg0}; border: 1px solid ${T.border}; border-radius: 6px;
padding: 7px 10px; color: ${T.text0}; font-size: 13px; font-family: ‘JetBrains Mono’, monospace;
outline: none; transition: border-color 0.15s; width: 100%; }
.wf-input:focus { border-color: ${T.accentBlue}; }
.wf-select { background: ${T.bg0}; border: 1px solid ${T.border}; border-radius: 6px;
padding: 7px 10px; color: ${T.text0}; font-size: 12px; font-family: ‘Syne’, sans-serif;
outline: none; cursor: pointer; width: 100%; }
.wf-meta-row { display: flex; gap: 8px; }
.wf-meta-row .wf-field { flex: 1; }

/* ACTION CARDS */
.wf-actions-scroll { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 6px; }
.wf-empty-state { flex: 1; display: flex; flex-direction: column; align-items: center;
justify-content: center; gap: 12px; color: ${T.text3}; padding: 20px; text-align: center; }
.wf-empty-icon { font-size: 32px; opacity: 0.4; }
.wf-empty-text { font-size: 12px; line-height: 1.6; }

.wf-card { background: ${T.bg2}; border: 1px solid ${T.border}; border-radius: 8px;
overflow: hidden; transition: border-color 0.15s; }
.wf-card:hover { border-color: ${T.borderBright}; }
.wf-card.active { border-color: ${T.accentBlue}44; }
.wf-card-header { display: flex; align-items: center; gap: 8px; padding: 8px 10px;
background: ${T.bg3}; cursor: pointer; }
.wf-traffic { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; transition: background 0.3s; }
.wf-traffic.red { background: ${T.red}; box-shadow: 0 0 6px ${T.red}88; }
.wf-traffic.yellow { background: ${T.yellow}; box-shadow: 0 0 6px ${T.yellow}88; }
.wf-traffic.green { background: ${T.green}; box-shadow: 0 0 6px ${T.green}88; }
.wf-card-type { flex: 1; font-size: 11px; font-weight: 700; color: ${T.text1};
text-transform: uppercase; letter-spacing: 0.5px; }
.wf-card-actions { display: flex; gap: 2px; }
.wf-card-body { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
.wf-field-row { display: flex; gap: 6px; align-items: flex-end; }
.wf-field-row .wf-field { flex: 1; }
.wf-grab-btn { padding: 7px 10px; background: ${T.bg3}; border: 1px solid ${T.border};
border-radius: 6px; color: ${T.accentBlue}; font-size: 11px; font-weight: 700;
cursor: pointer; white-space: nowrap; font-family: ‘Syne’, sans-serif; transition: all 0.15s;
display: flex; align-items: center; gap: 4px; }
.wf-grab-btn:hover { background: ${T.accentBlue}22; border-color: ${T.accentBlue}; }
.wf-state-badge { display: inline-flex; align-items: center; padding: 2px 6px;
border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; font-family: ‘JetBrains Mono’, monospace; }

/* ADD ACTION BAR */
.wf-add-bar { padding: 10px 14px; border-top: 1px solid ${T.border}; flex-shrink: 0; }
.wf-action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 8px; }
.wf-action-chip { padding: 6px 8px; background: ${T.bg3}; border: 1px solid ${T.border};
border-radius: 6px; font-size: 11px; cursor: pointer; color: ${T.text1};
font-family: ‘Syne’, sans-serif; transition: all 0.15s; text-align: center; font-weight: 500; }
.wf-action-chip:hover { border-color: ${T.accent}; color: ${T.accent}; background: ${T.accent}11; }

/* CODE PANEL */
.wf-code-header { padding: 8px 14px; border-bottom: 1px solid ${T.border};
display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
background: ${T.bg1}; }
.wf-code-meta { display: flex; align-items: center; gap: 12px; }
.wf-code-stat { font-size: 11px; color: ${T.text2}; font-family: ‘JetBrains Mono’, monospace; }
.wf-code-actions { display: flex; gap: 6px; }
.wf-code-wrap { flex: 1; overflow: hidden; display: flex; position: relative; }
.wf-line-nums { padding: 14px 0; background: ${T.bg1}; border-right: 1px solid ${T.border};
text-align: right; font-family: ‘JetBrains Mono’, monospace; font-size: 12px;
color: ${T.text3}; line-height: 1.7; flex-shrink: 0; min-width: 48px;
overflow: hidden; user-select: none; }
.wf-line-num { padding: 0 10px; }
.wf-code-content { flex: 1; overflow: auto; padding: 14px 16px;
font-family: ‘JetBrains Mono’, monospace; font-size: 12px; line-height: 1.7;
white-space: pre; background: ${T.bg1}; }

/* SYNTAX COLORS */
.syn-kw { color: #ff7b72; }
.syn-type { color: #79c0ff; }
.syn-fn { color: #d2a8ff; }
.syn-str { color: #a5d6ff; }
.syn-num { color: #f2cc60; }
.syn-comment { color: #8b949e; font-style: italic; }
.syn-directive { color: #ffa657; }
.syn-op { color: #ff7b72; }
.syn-plain { color: #e6edf3; }

/* STATUS BAR */
.wf-status { display: flex; align-items: center; gap: 16px; padding: 4px 14px;
background: ${T.bg0}; border-top: 1px solid ${T.border}; flex-shrink: 0; }
.wf-status-item { font-size: 10px; color: ${T.text2}; font-family: ‘JetBrains Mono’, monospace;
display: flex; align-items: center; gap: 5px; }
.wf-status-dot { width: 6px; height: 6px; border-radius: 50%; background: ${T.green}; }

/* AI PANEL */
.wf-ai-panel { padding: 16px; display: flex; flex-direction: column; gap: 12px; height: 100%; overflow-y: auto; }
.wf-ai-header { display: flex; align-items: center; gap: 10px; }
.wf-ai-badge { padding: 3px 8px; background: linear-gradient(135deg, ${T.accentPurple}33, ${T.accentBlue}33);
border: 1px solid ${T.accentPurple}55; border-radius: 20px; font-size: 11px;
color: ${T.accentPurple}; font-weight: 700; }
.wf-ai-textarea { background: ${T.bg0}; border: 1px solid ${T.border}; border-radius: 8px;
padding: 12px; color: ${T.text0}; font-size: 13px; font-family: ‘JetBrains Mono’, monospace;
resize: none; outline: none; height: 100px; transition: border-color 0.15s; }
.wf-ai-textarea:focus { border-color: ${T.accentPurple}; }
.wf-ai-examples { display: flex; flex-direction: column; gap: 6px; }
.wf-ai-example { padding: 8px 12px; background: ${T.bg3}; border: 1px solid ${T.border};
border-radius: 6px; font-size: 12px; color: ${T.text2}; cursor: pointer;
font-family: ‘JetBrains Mono’, monospace; transition: all 0.15s; }
.wf-ai-example:hover { border-color: ${T.accentPurple}; color: ${T.accentPurple}; background: ${T.accentPurple}11; }
.wf-ai-result { background: ${T.bg0}; border: 1px solid ${T.accentPurple}44;
border-radius: 8px; padding: 12px; font-size: 12px; color: ${T.text1};
font-family: ‘JetBrains Mono’, monospace; line-height: 1.6; }
.wf-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid ${T.border};
border-top-color: ${T.accentPurple}; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* SETTINGS PANEL */
.wf-settings { padding: 16px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
.wf-settings-section { background: ${T.bg2}; border: 1px solid ${T.border}; border-radius: 8px; overflow: hidden; }
.wf-settings-section-header { padding: 10px 14px; background: ${T.bg3}; font-size: 11px;
font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: ${T.text2};
display: flex; align-items: center; gap: 8px; }
.wf-settings-body { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.wf-settings-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* CONSOLE PANEL */
.wf-console { flex: 1; overflow-y: auto; padding: 10px 14px;
font-family: ‘JetBrains Mono’, monospace; font-size: 11px; line-height: 1.8;
background: ${T.bg0}; }
.wf-console-line { display: flex; gap: 10px; }
.wf-console-time { color: ${T.text3}; flex-shrink: 0; }
.wf-console-msg { color: ${T.text1}; }
.wf-console-msg.info { color: ${T.accentBlue}; }
.wf-console-msg.success { color: ${T.accentGreen}; }
.wf-console-msg.warn { color: ${T.accentYellow}; }
.wf-console-msg.error { color: ${T.red}; }

/* GRAB MODAL */
.wf-modal-overlay { position: fixed; inset: 0; background: #00000088; z-index: 200;
display: flex; align-items: center; justify-content: center; }
.wf-modal { background: ${T.bg2}; border: 1px solid ${T.border}; border-radius: 12px;
padding: 24px; width: 400px; display: flex; flex-direction: column; gap: 16px; }
.wf-modal-title { font-size: 16px; font-weight: 700; }
.wf-modal-body { font-size: 13px; color: ${T.text1}; line-height: 1.6; }
.wf-modal-result { background: ${T.bg0}; border: 1px solid ${T.accentGreen}44; border-radius: 8px;
padding: 12px; font-family: ‘JetBrains Mono’, monospace; font-size: 12px; color: ${T.accentGreen}; }
.wf-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

/* TOOLTIP */
.wf-tooltip { position: relative; }
.wf-tooltip:hover::after {
content: attr(data-tip); position: absolute; bottom: calc(100% + 6px); left: 50%;
transform: translateX(-50%); background: ${T.bg4}; color: ${T.text0};
padding: 4px 8px; border-radius: 4px; font-size: 11px; white-space: nowrap;
border: 1px solid ${T.border}; pointer-events: none; z-index: 500; }

/* CHUNK SELECTOR */
.wf-chunks { display: flex; flex-wrap: wrap; gap: 4px; padding: 10px 0; }
.wf-chunk-tag { padding: 3px 8px; background: ${T.bg3}; border: 1px solid ${T.border};
border-radius: 4px; font-size: 11px; color: ${T.text2}; cursor: pointer;
font-family: ‘JetBrains Mono’, monospace; display: flex; align-items: center; gap: 4px;
transition: all 0.15s; }
.wf-chunk-tag:hover { border-color: ${T.red}; color: ${T.red}; }
.wf-chunk-tag.selected { background: ${T.accentGreen}22; border-color: ${T.accentGreen}; color: ${T.accentGreen}; }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ACTION_CATALOG = [
{ id: “WALK_TO”, name: “Walk To”, cat: “Movement”, color: T.accentBlue,
inputs: [{ id: “destination”, label: “Destination Tile”, type: “coord”, grab: true },
{ id: “min_dist”, label: “Min Distance (tiles)”, type: “number”, default: “5” }] },
{ id: “USE_FAIRY_RING”, name: “Use Fairy Ring”, cat: “Movement”, color: T.accentBlue,
inputs: [{ id: “code”, label: “Fairy Ring Code”, type: “text”, placeholder: “DKS” },
{ id: “approach_tile”, label: “Approach Tile”, type: “coord”, grab: true }] },
{ id: “USE_TELEPORT_SPELL”, name: “Teleport Spell”, cat: “Movement”, color: T.accentBlue,
inputs: [{ id: “spell”, label: “Spell Name”, type: “text”, placeholder: “Lumbridge Home Teleport” }] },
{ id: “USE_TELEPORT_ITEM”, name: “Teleport Item”, cat: “Movement”, color: T.accentBlue,
inputs: [{ id: “item_name”, label: “Item Name”, type: “text”, placeholder: “Amulet of glory” },
{ id: “action”, label: “Action”, type: “text”, placeholder: “Rub” }] },
{ id: “OPEN_BANK”, name: “Open Bank”, cat: “Banking”, color: T.accentYellow, inputs: [] },
{ id: “DEPOSIT_ALL”, name: “Deposit All”, cat: “Banking”, color: T.accentYellow, inputs: [] },
{ id: “DEPOSIT_ITEMS”, name: “Deposit Items”, cat: “Banking”, color: T.accentYellow,
inputs: [{ id: “items_list”, label: “Items (comma separated)”, type: “text”, placeholder: “Logs, Oak logs” }] },
{ id: “WITHDRAW_ITEMS”, name: “Withdraw Items”, cat: “Banking”, color: T.accentYellow,
inputs: [{ id: “item_name”, label: “Item Name”, type: “text”, placeholder: “Magic logs” },
{ id: “quantity”, label: “Quantity”, type: “number”, default: “14” }] },
{ id: “CLOSE_BANK”, name: “Close Bank”, cat: “Banking”, color: T.accentYellow, inputs: [] },
{ id: “INTERACT_OBJECT”, name: “Interact Object”, cat: “Interaction”, color: T.accentGreen,
inputs: [{ id: “object_name”, label: “Object Name”, type: “text”, grab: true, grabType: “object”, placeholder: “Willow tree” },
{ id: “action”, label: “Action”, type: “text”, placeholder: “Chop” },
{ id: “destination”, label: “Walk-To Tile”, type: “coord”, grab: true }] },
{ id: “INTERACT_NPC”, name: “Interact NPC”, cat: “Interaction”, color: T.accentGreen,
inputs: [{ id: “npc_name”, label: “NPC Name”, type: “text”, grab: true, grabType: “npc”, placeholder: “Bank Teller” },
{ id: “action”, label: “Action”, type: “text”, placeholder: “Talk-to” }] },
{ id: “USE_ITEM_ON_OBJECT”, name: “Use Item on Object”, cat: “Interaction”, color: T.accentGreen,
inputs: [{ id: “item_name”, label: “Inventory Item”, type: “text”, placeholder: “Tinderbox” },
{ id: “object_name”, label: “Target Object”, type: “text”, grab: true, grabType: “object”, placeholder: “Logs” }] },
{ id: “CLICK_TILE”, name: “Click Tile”, cat: “Interaction”, color: T.accentGreen,
inputs: [{ id: “destination”, label: “Tile”, type: “coord”, grab: true },
{ id: “action”, label: “Action (optional)”, type: “text”, placeholder: “Mine” }] },
{ id: “ATTACK_NPC”, name: “Attack NPC”, cat: “Combat”, color: T.red,
inputs: [{ id: “npc_name”, label: “NPC Name”, type: “text”, grab: true, grabType: “npc”, placeholder: “Sand Crab” }] },
{ id: “EAT_FOOD”, name: “Eat Food”, cat: “Combat”, color: T.red,
inputs: [{ id: “item_name”, label: “Food Item”, type: “text”, placeholder: “Shark” },
{ id: “hp_threshold”, label: “Eat below HP%”, type: “number”, default: “50” }] },
{ id: “DRINK_POTION”, name: “Drink Potion”, cat: “Combat”, color: T.red,
inputs: [{ id: “item_name”, label: “Potion Name”, type: “text”, placeholder: “Super combat potion” }] },
{ id: “ENABLE_PRAYER”, name: “Enable Prayer”, cat: “Combat”, color: T.red,
inputs: [{ id: “prayer”, label: “Prayer Name”, type: “text”, placeholder: “PROTECT_FROM_MELEE” }] },
{ id: “LOOT_ITEM”, name: “Loot Item”, cat: “Combat”, color: T.red,
inputs: [{ id: “item_name”, label: “Item to Loot”, type: “text”, placeholder: “Dragon bones” }] },
{ id: “DROP_ITEMS”, name: “Drop Items”, cat: “Inventory”, color: T.accentOrange,
inputs: [{ id: “items_list”, label: “Items to Drop (comma separated)”, type: “text”, placeholder: “Logs, Oak logs” }] },
{ id: “WAIT_XP”, name: “Wait for XP”, cat: “Utility”, color: T.accentPurple,
inputs: [{ id: “timeout”, label: “Timeout (ms)”, type: “number”, default: “30000” }] },
];

const CATEGORIES = [“Movement”, “Banking”, “Interaction”, “Combat”, “Inventory”, “Utility”];
const CAT_COLORS = {
Movement: T.accentBlue, Banking: T.accentYellow, Interaction: T.accentGreen,
Combat: T.red, Inventory: T.accentOrange, Utility: T.accentPurple,
};

const COMMON_CHUNKS = [
“VARROCK”, “LUMBRIDGE”, “DRAYNOR_VILLAGE”, “FALADOR”, “GRAND_EXCHANGE”,
“EDGEVILLE”, “CATHERBY”, “ARDOUGNE”, “SEERS_VILLAGE”, “CAMELOT”,
“BARBARIAN_VILLAGE”, “PORT_SARIM”, “TAVERLEY”, “RIMMINGTON”,
“SAND_CRABS”, “ROCK_CRABS”, “CANIFIS”, “BARROWS”, “MOTHERLOAD_MINE”,
];

// ─── SYNTAX HIGHLIGHTER ───────────────────────────────────────────────────────
function highlightPascal(code) {
const lines = code.split(”\n”);
return lines.map((line, li) => {
let result = [];
let i = 0;
const push = (cls, text) => result.push({ cls, text });

```
while (i < line.length) {
  // Comment
  if (line[i] === "/" && line[i+1] === "/") {
    push("comment", line.slice(i)); i = line.length; continue;
  }
  // Directive {$...}
  if (line[i] === "{" && line[i+1] === "$") {
    let end = line.indexOf("}", i); if (end < 0) end = line.length - 1;
    push("directive", line.slice(i, end+1)); i = end+1; continue;
  }
  // Comment (*...*)
  if (line[i] === "(" && line[i+1] === "*") {
    push("comment", line.slice(i)); i = line.length; continue;
  }
  // String
  if (line[i] === "'") {
    let j = i+1;
    while (j < line.length && line[j] !== "'") j++;
    push("str", line.slice(i, j+1)); i = j+1; continue;
  }
  // Number
  if (/\d/.test(line[i]) && (i===0 || /\W/.test(line[i-1]))) {
    let j = i;
    while (j < line.length && /[\d.]/.test(line[j])) j++;
    push("num", line.slice(i,j)); i = j; continue;
  }
  // Word
  if (/[a-zA-Z_]/.test(line[i])) {
    let j = i;
    while (j < line.length && /\w/.test(line[j])) j++;
    const word = line.slice(i,j);
    const kws = ["procedure","function","type","record","var","begin","end","if","then",
      "else","for","to","do","while","repeat","until","case","of","not","and","or",
      "in","out","override","overload","inherited","uses","const","true","false","nil",
      "array","string","integer","boolean","char","exit","result","break","continue"];
    const types = ["TPoint","TBox","TString","TColor","ELazAlign","ELazFontStyles",
      "TLazForm","TLazPanel","TLazButton","TLazEdit","TLazLabel","TLazMemo",
      "TLazComboBox","TLazListBox","TLazTabSheet","TLazScrollBox","String","Integer",
      "Boolean","UInt64","Single","Double"];
    if (kws.includes(word.toLowerCase())) push("kw", word);
    else if (types.includes(word)) push("type", word);
    else if (j < line.length && line[j] === "(") push("fn", word);
    else push("plain", word);
    i = j; continue;
  }
  // Operator
  if (":=+-><=*/[]@^".includes(line[i])) { push("op", line[i]); i++; continue; }
  push("plain", line[i]); i++;
}
return { key: li, tokens: result };
```

});
}

// ─── CODE GENERATOR ───────────────────────────────────────────────────────────
function generateScript(project) {
const { name, mode, actions, chunks, breakInterval, breakLength, sleepTime } = project;
const safeName = name.replace(/\s+/g, “”) || “MyScript”;

const stateNames = [“LOGIN”, “LEVEL_UP”,
…actions.map((a, i) => `${a.id}_${i + 1}`),
“END_SCRIPT”
];

const chunkList = chunks.length > 0
? chunks.map(c => `ERSChunk.${c}`).join(”, “)
: “ERSChunk.LUMBRIDGE {// UPDATE ME}”;

let code = `{$I WaspLib/osrs.simba}\n`;
code += `\n(*\n  ${safeName}\n  Generated by WaspForge — waspscripts.com\n*)\n\n`;

// State enum
code += `type\n  E${safeName}State = enum(\n`;
code += stateNames.map(s => `    ${s}`).join(”,\n”);
code += `\n  );\n\n`;

// Record
code += `  T${safeName} = record\n    Actions: UInt64;\n    StartXP: UInt64;\n  end;\n\n`;

// DoXxx procedures
actions.forEach((a, i) => {
const stateName = `${a.id}_${i + 1}`;
const catalog = ACTION_CATALOG.find(c => c.id === a.id);
code += `procedure T${safeName}.Do${stateName}();\n`;
code += `begin\n  Logger.Info('${catalog?.name || a.id}...');\n`;

```
switch (a.id) {
  case "WALK_TO":
    code += `  Map.Walker.WebWalk(${a.values?.destination || "[0, 0]"}, ${a.values?.min_dist || 5} * 4, 0.2);\n`;
    break;
  case "OPEN_BANK":
    code += `  Bank.Open();\n  Bank.WaitOpen(5000);\n`;
    break;
  case "DEPOSIT_ALL":
    code += `  Bank.DepositInventory();\n  Sleep(RandomMode(400, 200, 800));\n`;
    break;
  case "WITHDRAW_ITEMS":
    code += `  Bank.Withdraw(['${a.values?.item_name || "Item"}', ${a.values?.quantity || 14}], True);\n`;
    code += `  SleepUntil(Inventory.Items.Contains('${a.values?.item_name || "Item"}'), 100, 5000);\n`;
    break;
  case "CLOSE_BANK":
    code += `  Bank.Close(0.5);\n  Sleep(RandomMode(300, 150, 600));\n`;
    break;
  case "INTERACT_OBJECT":
    code += `  Map.Walker.WebWalk(${a.values?.destination || "[0, 0]"}, 20, 0.2);\n`;
    break;
  case "ATTACK_NPC":
    code += `  // Attack '${a.values?.npc_name || "NPC"}' — wire to RSEntity\n`;
    break;
  case "EAT_FOOD":
    code += `  if Combat.GetHPPercent() < ${a.values?.hp_threshold || 50} then\n`;
    code += `    Inventory.Items.Interact('${a.values?.item_name || "Food"}', 'Eat');\n`;
    break;
  case "WAIT_XP":
    code += `  XPBar.WaitXP(${a.values?.timeout || 30000});\n`;
    break;
  default:
    code += `  // TODO: implement ${a.id}\n`;
}
code += `end;\n\n`;
```

});

// GetState
code += `function T${safeName}.GetState(): E${safeName}State;\n`;
code += `begin\n`;
code += `  if Activity.IsFinished then Exit(E${safeName}State.END_SCRIPT);\n`;
code += `  if not RSClient.IsLoggedIn() then Exit(E${safeName}State.LOGIN);\n`;
code += `  if Chat.LeveledUp() then Exit(E${safeName}State.LEVEL_UP);\n`;
if (actions.some(a => a.id === “OPEN_BANK”)) {
code += `  if Bank.IsOpen() then Exit(E${safeName}State.OPEN_BANK_${actions.findIndex(a => a.id === "OPEN_BANK") + 1});\n`;
}
actions.forEach((a, i) => {
code += `  // State: ${a.id}_${i+1}\n`;
});
code += `  Result := E${safeName}State.END_SCRIPT;\n`;
code += `end;\n\n`;

// Init
code += `procedure T${safeName}.Init();\n`;
code += `begin\n`;
code += `  Logger.Setup('${safeName}');\n`;
code += `  Map.Setup([${chunkList}]);\n`;
if (breakInterval) code += `  Antiban.AddBreak(${breakInterval} * ONE_MINUTE, ${breakLength || 5} * ONE_MINUTE, 0.2, 0.33);\n`;
if (sleepTime) code += `  Antiban.AddSleep('${sleepTime}', 8 * ONE_HOUR, 0.1, 0.8);\n`;
code += `  Self.StartXP := XPBar.TotalEarnedXP(True);\n`;
code += `end;\n\n`;

// Run
code += `procedure T${safeName}.Run();\n`;
code += `var\n  state: E${safeName}State;\n`;
code += `begin\n  Self.Init();\n  repeat\n    state := Self.GetState();\n`;
code += `    ProgressReport.Print();\n    WaspClient.SubmitStats();\n`;
code += `    case state of\n`;
code += `      E${safeName}State.LOGIN: Login.DoLogin();\n`;
code += `      E${safeName}State.LEVEL_UP: Chat.HandleLevelUp();\n`;
actions.forEach((a, i) => {
code += `      E${safeName}State.${a.id}_${i+1}: Self.Do${a.id}_${i+1}();\n`;
});
code += `      E${safeName}State.END_SCRIPT: Break;\n`;
code += `    end;\n    Antiban.DoAntiban();\n  until False;\nend;\n\n`;

code += `var\n  Script: T${safeName};\nbegin\n  Script.Run();\nend.\n`;
return code;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function TrafficLight({ action }) {
const catalog = ACTION_CATALOG.find(c => c.id === action.id);
if (!catalog) return <span className="wf-traffic red" />;
const required = catalog.inputs.filter(i => i.type === “coord” || i.grab);
const filled = required.filter(i => action.values?.[i.id] && action.values[i.id] !== “”);
if (filled.length === 0 && required.length > 0) return <span className="wf-traffic red" />;
if (filled.length < required.length) return <span className="wf-traffic yellow" />;
return <span className="wf-traffic green" />;
}

function ActionCard({ action, index, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast, onGrab }) {
const catalog = ACTION_CATALOG.find(c => c.id === action.id);
const [expanded, setExpanded] = useState(true);

const updateValue = (inputId, val) => {
onUpdate(index, { …action, values: { …action.values, [inputId]: val } });
};

return (
<div className=“wf-card” style={{ borderColor: expanded ? `${catalog?.color || T.border}44` : T.border }}>
<div className=“wf-card-header” onClick={() => setExpanded(!expanded)}>
<TrafficLight action={action} />
<span className=“wf-card-type” style={{ color: catalog?.color || T.text1 }}>
{catalog?.name || action.id}
</span>
<span style={{ fontSize: 10, color: T.text3, fontFamily: “JetBrains Mono” }}>
#{index + 1}
</span>
<div className=“wf-card-actions” onClick={e => e.stopPropagation()}>
{!isFirst && <button className=“wf-btn wf-btn-ghost wf-btn-icon wf-btn-sm” onClick={() => onMoveUp(index)} title=“Move up”>↑</button>}
{!isLast && <button className=“wf-btn wf-btn-ghost wf-btn-icon wf-btn-sm” onClick={() => onMoveDown(index)} title=“Move down”>↓</button>}
<button className=“wf-btn wf-btn-danger wf-btn-icon wf-btn-sm” onClick={() => onDelete(index)} title=“Delete”>×</button>
</div>
</div>
{expanded && catalog?.inputs.length > 0 && (
<div className="wf-card-body">
{catalog.inputs.map(inp => (
<div key={inp.id} className="wf-field">
<label className="wf-label">{inp.label}</label>
<div className="wf-field-row">
<input
className=“wf-input”
type=“text”
placeholder={inp.placeholder || inp.default || “”}
value={action.values?.[inp.id] || “”}
onChange={e => updateValue(inp.id, e.target.value)}
/>
{inp.grab && (
<button className=“wf-grab-btn” onClick={() => onGrab(index, inp.id, inp.grabType || “coord”)}>
⌖ Grab
</button>
)}
</div>
</div>
))}
</div>
)}
</div>
);
}

function CodeView({ code }) {
const highlighted = highlightPascal(code);
const lineCount = highlighted.length;

return (
<div className="wf-code-wrap">
<div className="wf-line-nums">
{highlighted.map(({ key }) => (
<div key={key} className="wf-line-num">{key + 1}</div>
))}
</div>
<div className="wf-code-content">
{highlighted.map(({ key, tokens }) => (
<div key={key}>
{tokens.map((t, ti) => (
<span key={ti} className={`syn-${t.cls}`}>{t.text}</span>
))}
</div>
))}
</div>
</div>
);
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function WaspForge() {
const [activeTab, setActiveTab] = useState(“builder”);
const [rightTab, setRightTab] = useState(“code”);
const [showAddMenu, setShowAddMenu] = useState(false);
const [grabModal, setGrabModal] = useState(null);
const [aiLoading, setAiLoading] = useState(false);
const [aiResult, setAiResult] = useState(””);
const [aiInput, setAiInput] = useState(””);
const [consoleLogs, setConsoleLogs] = useState([
{ time: “00:00:00”, msg: “WaspForge initialized”, type: “success” },
{ time: “00:00:00”, msg: “Action catalog loaded — 20 actions available”, type: “info” },
{ time: “00:00:00”, msg: “Ready. Build your script using the action cards.”, type: “info” },
]);

const [project, setProject] = useState({
name: “”,
mode: “LOOP_SCRIPT”,
actions: [],
chunks: [],
breakInterval: “30”,
breakLength: “5”,
sleepTime: “00:30:00”,
});

const code = generateScript(project);
const lines = code.split(”\n”).length;
const chars = code.length;

const addLog = useCallback((msg, type = “info”) => {
const now = new Date();
const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
.map(n => String(n).padStart(2, “0”)).join(”:”);
setConsoleLogs(prev => […prev.slice(-100), { time, msg, type }]);
}, []);

const addAction = (actionId) => {
const catalog = ACTION_CATALOG.find(c => c.id === actionId);
const newAction = { id: actionId, values: {} };
catalog?.inputs.forEach(inp => { if (inp.default) newAction.values[inp.id] = inp.default; });
setProject(p => ({ …p, actions: […p.actions, newAction] }));
addLog(`Added action: ${catalog?.name || actionId}`, “success”);
setShowAddMenu(false);
};

const updateAction = (index, updated) => {
setProject(p => {
const actions = […p.actions];
actions[index] = updated;
return { …p, actions };
});
};

const deleteAction = (index) => {
setProject(p => ({ …p, actions: p.actions.filter((_, i) => i !== index) }));
addLog(“Action removed”, “warn”);
};

const moveUp = (index) => {
if (index === 0) return;
setProject(p => {
const a = […p.actions];
[a[index-1], a[index]] = [a[index], a[index-1]];
return { …p, actions: a };
});
};

const moveDown = (index) => {
setProject(p => {
if (index >= p.actions.length - 1) return p;
const a = […p.actions];
[a[index], a[index+1]] = [a[index+1], a[index]];
return { …p, actions: a };
});
};

const openGrab = (actionIndex, inputId, grabType) => {
setGrabModal({ actionIndex, inputId, grabType, result: null, loading: false });
addLog(`Grab started: stand on tile then click 'Capture' — or enter manually`, “warn”);
};

const simulateGrab = () => {
setGrabModal(m => ({ …m, loading: true }));
setTimeout(() => {
const coords = `[${3000 + Math.floor(Math.random() * 1000)}, ${3200 + Math.floor(Math.random() * 500)}]`;
setGrabModal(m => ({ …m, loading: false, result: coords }));
addLog(`Coordinates captured: ${coords}`, “success”);
}, 1200);
};

const confirmGrab = () => {
if (grabModal?.result) {
updateAction(grabModal.actionIndex, {
…project.actions[grabModal.actionIndex],
values: { …project.actions[grabModal.actionIndex].values, [grabModal.inputId]: grabModal.result }
});
addLog(`Value applied to action #${grabModal.actionIndex + 1}`, “success”);
}
setGrabModal(null);
};

const toggleChunk = (chunk) => {
setProject(p => ({
…p,
chunks: p.chunks.includes(chunk) ? p.chunks.filter(c => c !== chunk) : […p.chunks, chunk]
}));
};

const runAI = async () => {
if (!aiInput.trim()) return;
setAiLoading(true);
setAiResult(””);
addLog(“AI planner thinking…”, “info”);
try {
const resp = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({
model: “claude-sonnet-4-20250514”,
max_tokens: 1000,
messages: [{
role: “user”,
content: `You are WaspForge's AI script planner for Old School RuneScape automation. The user wants to build a bot script. Based on their description, output a JSON array of actions from this catalog: ${ACTION_CATALOG.map(a => `- ${a.id}: ${a.name} (${a.cat})`).join(”\n”)}

Output ONLY valid JSON array, no preamble. For coordinates use “NEEDS_GRAB”. Use exact OSRS names.
Always start with relevant bank/setup actions and end with looping back to the start.

User description: “${aiInput}”

Example output format:
[{“id”:“WALK_TO”,“values”:{“destination”:“NEEDS_GRAB”,“min_dist”:“5”}},{“id”:“OPEN_BANK”,“values”:{}}]` }] }) }); const data = await resp.json(); const text = data.content?.[0]?.text || "[]"; setAiResult(text); try { const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); if (Array.isArray(parsed)) { setProject(p => ({ ...p, actions: parsed })); addLog(`AI generated ${parsed.length} actions — fill in Grab fields`, “success”);
}
} catch { addLog(“AI response received — review and apply manually”, “warn”); }
} catch (e) {
addLog(“AI request failed — check network”, “error”);
setAiResult(“Error: “ + e.message);
}
setAiLoading(false);
};

const copyCode = () => {
navigator.clipboard?.writeText(code);
addLog(“Script copied to clipboard”, “success”);
};

const greenCount = project.actions.filter(a => {
const catalog = ACTION_CATALOG.find(c => c.id === a.id);
if (!catalog) return false;
const required = catalog.inputs.filter(i => i.type === “coord” || i.grab);
return required.every(i => a.values?.[i.id]);
}).length;
const redCount = project.actions.length - greenCount;

const tabs = [
{ id: “builder”, label: “Script Builder”, dot: T.accentBlue },
{ id: “settings”, label: “Settings”, dot: T.accentYellow },
{ id: “ai”, label: “AI Planner”, dot: T.accentPurple },
{ id: “console”, label: “Console”, dot: consoleLogs.some(l => l.type === “error”) ? T.red : T.accentGreen },
];

const rightTabs = [
{ id: “code”, label: “Generated Script” },
{ id: “outline”, label: “State Outline” },
];

return (
<>
<style>{styles}</style>
<div className="wf-root">
{/* HEADER */}
<div className="wf-header">
<div className="wf-logo">
<div className="wf-logo-icon">⚒</div>
<div>
<div className="wf-logo-name">WaspForge</div>
<div className="wf-logo-ver">v2.0 · Script Factory</div>
</div>
</div>
<div className="wf-header-actions">
<div style={{ fontSize: 11, color: T.text2, fontFamily: “JetBrains Mono” }}>
{greenCount > 0 && <span style={{ color: T.green }}>●{greenCount} ready </span>}
{redCount > 0 && <span style={{ color: T.red }}>●{redCount} pending</span>}
</div>
<button className="wf-btn" onClick={copyCode}>⎘ Copy Script</button>
<button className="wf-btn wf-btn-green">▶ Export .simba</button>
</div>
</div>

```
    {/* TABS */}
    <div className="wf-tabs">
      {tabs.map(t => (
        <div key={t.id} className={`wf-tab ${activeTab === t.id ? "active" : ""}`}
          onClick={() => setActiveTab(t.id)}>
          <span className="wf-tab-dot" style={{ background: t.dot }} />
          {t.label}
        </div>
      ))}
    </div>

    {/* MAIN */}
    <div className="wf-main" style={{ display: activeTab === "builder" ? "flex" : "block", overflow: "hidden", flex: 1 }}>

      {/* ── BUILDER TAB ── */}
      {activeTab === "builder" && (
        <>
          {/* LEFT PANEL */}
          <div className="wf-left">
            <div className="wf-section-header">
              <span className="wf-section-title">Script Details</span>
            </div>
            <div className="wf-meta">
              <div className="wf-field">
                <label className="wf-label">Script Name</label>
                <input className="wf-input" placeholder="MyWoodcutter"
                  value={project.name}
                  onChange={e => setProject(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="wf-meta-row">
                <div className="wf-field">
                  <label className="wf-label">Mode</label>
                  <select className="wf-select" value={project.mode}
                    onChange={e => setProject(p => ({ ...p, mode: e.target.value }))}>
                    <option value="LOOP_SCRIPT">Loop Script</option>
                    <option value="SEQUENTIAL_QUEST">Quest Script</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="wf-section-header">
              <span className="wf-section-title">Actions
                <span style={{ marginLeft: 8, color: T.text3, fontWeight: 400 }}>
                  {project.actions.length}
                </span>
              </span>
              <button className="wf-btn wf-btn-sm" onClick={() => setShowAddMenu(!showAddMenu)}>
                + Add
              </button>
            </div>

            {showAddMenu && (
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, background: T.bg0 }}>
                {CATEGORIES.map(cat => (
                  <div key={cat} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: CAT_COLORS[cat],
                      letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 4 }}>
                      {cat}
                    </div>
                    <div className="wf-action-grid">
                      {ACTION_CATALOG.filter(a => a.cat === cat).map(a => (
                        <button key={a.id} className="wf-action-chip"
                          style={{ "--hover-color": a.color }}
                          onClick={() => addAction(a.id)}>
                          {a.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="wf-actions-scroll">
              {project.actions.length === 0 ? (
                <div className="wf-empty-state">
                  <div className="wf-empty-icon">⚡</div>
                  <div className="wf-empty-text">
                    Click <strong style={{ color: T.accent }}>+ Add</strong> to add your first action.<br />
                    Or use the <strong style={{ color: T.accentPurple }}>AI Planner</strong> tab to generate states automatically.
                  </div>
                </div>
              ) : (
                project.actions.map((a, i) => (
                  <ActionCard key={`${a.id}-${i}`} action={a} index={i}
                    onUpdate={updateAction} onDelete={deleteAction}
                    onMoveUp={moveUp} onMoveDown={moveDown}
                    isFirst={i === 0} isLast={i === project.actions.length - 1}
                    onGrab={openGrab} />
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="wf-right">
            <div className="wf-code-header">
              <div style={{ display: "flex", gap: 2 }}>
                {rightTabs.map(t => (
                  <button key={t.id}
                    className={`wf-btn wf-btn-sm ${rightTab === t.id ? "" : "wf-btn-ghost"}`}
                    onClick={() => setRightTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="wf-code-meta">
                <span className="wf-code-stat">{lines} lines</span>
                <span className="wf-code-stat">{chars} chars</span>
                <span className="wf-code-stat" style={{ color: project.name ? T.accentGreen : T.text3 }}>
                  {project.name || "unnamed"}.simba
                </span>
              </div>
              <div className="wf-code-actions">
                <button className="wf-btn wf-btn-sm" onClick={copyCode}>⎘ Copy</button>
              </div>
            </div>

            {rightTab === "code" && <CodeView code={code} />}
            {rightTab === "outline" && (
              <div style={{ padding: 16, overflow: "auto", flex: 1, fontFamily: "JetBrains Mono", fontSize: 12 }}>
                <div style={{ color: T.text2, marginBottom: 12, fontSize: 11 }}>STATE MACHINE OUTLINE</div>
                {["LOGIN", "LEVEL_UP", ...project.actions.map((a,i) => `${a.id}_${i+1}`), "END_SCRIPT"].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0",
                    borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ color: T.text3, width: 24, textAlign: "right" }}>{i+1}</span>
                    <span style={{ color: ["LOGIN","LEVEL_UP","END_SCRIPT"].includes(s) ? T.accentOrange : T.accentBlue }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── SETTINGS TAB ── */}
      {activeTab === "settings" && (
        <div className="wf-settings">
          <div className="wf-settings-section">
            <div className="wf-settings-section-header">⏱ Antiban — Break Schedule</div>
            <div className="wf-settings-body">
              <div className="wf-settings-row">
                <div className="wf-field">
                  <label className="wf-label">Break every (minutes)</label>
                  <input className="wf-input" type="number" value={project.breakInterval}
                    onChange={e => setProject(p => ({ ...p, breakInterval: e.target.value }))} />
                </div>
                <div className="wf-field">
                  <label className="wf-label">Break length (minutes)</label>
                  <input className="wf-input" type="number" value={project.breakLength}
                    onChange={e => setProject(p => ({ ...p, breakLength: e.target.value }))} />
                </div>
              </div>
              <div className="wf-field">
                <label className="wf-label">Sleep at (HH:MM:SS) — overnight break</label>
                <input className="wf-input" placeholder="00:30:00" value={project.sleepTime}
                  onChange={e => setProject(p => ({ ...p, sleepTime: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="wf-settings-section">
            <div className="wf-settings-section-header">🗺 Map Chunks — Areas to Load</div>
            <div className="wf-settings-body">
              <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.6 }}>
                Select every OSRS area your script will visit. Only load what you need — reduces startup time.
              </div>
              {project.chunks.length > 0 && (
                <div style={{ padding: "6px 10px", background: T.bg0, borderRadius: 6,
                  border: `1px solid ${T.accentGreen}44`, fontFamily: "JetBrains Mono", fontSize: 11 }}>
                  <span style={{ color: T.text2 }}>Map.Setup([</span>
                  <span style={{ color: T.accentGreen }}>{project.chunks.map(c => `ERSChunk.${c}`).join(", ")}</span>
                  <span style={{ color: T.text2 }}>]);</span>
                </div>
              )}
              <div className="wf-chunks">
                {COMMON_CHUNKS.map(chunk => (
                  <button key={chunk} className={`wf-chunk-tag ${project.chunks.includes(chunk) ? "selected" : ""}`}
                    onClick={() => toggleChunk(chunk)}>
                    {project.chunks.includes(chunk) ? "✓ " : ""}{chunk}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AI PLANNER TAB ── */}
      {activeTab === "ai" && (
        <div className="wf-ai-panel">
          <div className="wf-ai-header">
            <span style={{ fontSize: 18, fontWeight: 800 }}>AI Script Planner</span>
            <span className="wf-ai-badge">Claude-powered</span>
          </div>
          <div style={{ fontSize: 13, color: T.text2, lineHeight: 1.7 }}>
            Describe what you want your script to do in plain English. The AI will generate the action states automatically.
            You can then fill in coordinates using the <strong style={{ color: T.accentBlue }}>Grab</strong> buttons.
          </div>
          <div className="wf-field">
            <label className="wf-label">Script Description</label>
            <textarea className="wf-ai-textarea"
              placeholder="e.g. Chop willow trees at Draynor Village, bank the logs, repeat until level 99 woodcutting"
              value={aiInput} onChange={e => setAiInput(e.target.value)} />
          </div>
          <div>
            <div className="wf-label" style={{ marginBottom: 6 }}>Quick Examples</div>
            <div className="wf-ai-examples">
              {["Mine iron ore at Varrock East mine, drop all ore, repeat",
                "Fish lobsters at Catherby, bank when full, repeat",
                "Kill sand crabs, eat shark below 50 HP, loot gold coins",
                "Craft battlestaves, bank for orbs and staves, repeat"].map(ex => (
                <button key={ex} className="wf-ai-example" onClick={() => setAiInput(ex)}>{ex}</button>
              ))}
            </div>
          </div>
          <button className="wf-btn wf-btn-primary" onClick={runAI} disabled={aiLoading}
            style={{ alignSelf: "flex-start", padding: "10px 20px", fontSize: 13 }}>
            {aiLoading ? <><span className="wf-spinner" /> Generating...</> : "⚡ Generate Script Actions"}
          </button>
          {aiResult && (
            <div>
              <div className="wf-label" style={{ marginBottom: 6 }}>AI Output</div>
              <div className="wf-ai-result">{aiResult}</div>
            </div>
          )}
        </div>
      )}

      {/* ── CONSOLE TAB ── */}
      {activeTab === "console" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className="wf-section-header">
            <span className="wf-section-title">Simba Console Mirror</span>
            <button className="wf-btn wf-btn-sm wf-btn-ghost"
              onClick={() => setConsoleLogs([])}>Clear</button>
          </div>
          <div className="wf-console">
            {consoleLogs.map((l, i) => (
              <div key={i} className="wf-console-line">
                <span className="wf-console-time">[{l.time}]</span>
                <span className={`wf-console-msg ${l.type}`}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* STATUS BAR */}
    <div className="wf-status">
      <div className="wf-status-item"><span className="wf-status-dot" />WaspForge Ready</div>
      <div className="wf-status-item">{project.actions.length} actions</div>
      <div className="wf-status-item">{lines} lines generated</div>
      <div className="wf-status-item" style={{ color: greenCount === project.actions.length && project.actions.length > 0 ? T.green : T.text3 }}>
        {greenCount}/{project.actions.length} complete
      </div>
      <div className="wf-status-item" style={{ marginLeft: "auto" }}>
        WaspLib 2.0 · Simba 2.0
      </div>
    </div>
  </div>

  {/* GRAB MODAL */}
  {grabModal && (
    <div className="wf-modal-overlay" onClick={() => setGrabModal(null)}>
      <div className="wf-modal" onClick={e => e.stopPropagation()}>
        <div className="wf-modal-title">
          {grabModal.grabType === "coord" ? "⌖ Grab Coordinates" :
           grabModal.grabType === "object" ? "📦 Grab Object" : "👤 Grab NPC"}
        </div>
        <div className="wf-modal-body">
          {grabModal.grabType === "coord"
            ? "Move your character to the desired tile in-game, then click Capture. The Simba script will call Map.Position() and return the coordinates."
            : `Stand near the ${grabModal.grabType} in-game, then click Capture. WaspForge will scan nearby ${grabModal.grabType}s and return the data.`}
        </div>
        {!grabModal.result ? (
          <button className="wf-btn wf-btn-primary" onClick={simulateGrab} disabled={grabModal.loading}>
            {grabModal.loading ? <><span className="wf-spinner" /> Capturing...</> : "⌖ Capture from Simba"}
          </button>
        ) : (
          <div className="wf-modal-result">{grabModal.result}</div>
        )}
        <div style={{ fontSize: 12, color: T.text2 }}>Or enter manually:</div>
        <input className="wf-input" placeholder="[3085, 3237]"
          value={grabModal.result || ""}
          onChange={e => setGrabModal(m => ({ ...m, result: e.target.value }))} />
        <div className="wf-modal-actions">
          <button className="wf-btn" onClick={() => setGrabModal(null)}>Cancel</button>
          <button className="wf-btn wf-btn-green" onClick={confirmGrab} disabled={!grabModal.result}>
            Apply Value
          </button>
        </div>
      </div>
    </div>
  )}
</>
```

);
}