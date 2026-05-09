-----

## name: waspforge
description: >
Use this skill for anything related to the WaspForge project, WaspLib 2.0 scripting,
OSRS bot scripting in Simba/Pascal, WaspQuests, map coordinates, or the map_objects.json
database. Triggers on: “WaspForge”, “WaspLib”, “Simba script”, “OSRS bot”, “map coordinate”,
“bank booth coordinate”, “WaspScripts”, “ERSChunk”, “Pascal script”, “WaspQuests”,
“map_objects”, “object coordinate”, or any OSRS scripting task.

# WaspForge — Complete Project Knowledge

## PROJECT IDENTITY

**WaspForge** is an AI-powered OSRS script factory built by James (Prush).

- Repo: https://github.com/prushscripts/WaspForge (branch: master)
- Local: `C:\Users\James\Documents\WaspGod\WaspForge\`
- Simba symlink: `C:\Users\James\AppData\Local\com.wasp-launcher.app\Simba\Includes\WaspForge`
- Tailscale PC IP: `100.103.210.69` → iPhone: `http://100.103.210.69:7734`
- Architecture: React web UI at `localhost:7734` + Simba file bridge
- Bridge files: `web/bridge/command.json` (browser→Simba) and `web/bridge/result.json` (Simba→browser)

## WASPLIB 2.0 CORE RULES

**Include:** `{$I WaspLib/osrs.simba}`

**Critical Simba 2.0 syntax rules (NEVER break these):**

- String methods ON the string: `str.SplitLines()`, `str.Contains()`, `str.Lower()`
- `StrToInt(str, default)` NOT `StrToIntDef`
- `ToStr(value)` NOT `IntToStr`
- Time constants: `ONE_MINUTE`, `ONE_HOUR` (not `TIME_SHORT`, `TIME_DATE`)
- Event handlers: `procedure Handler(sender: TLazObject)` — always this exact signature
- Global var declared BEFORE procedures that reference it
- Event wiring: `@GlobalVarName.Handler` NOT `@Self.Handler`
- Path macro: `{$MACRO DIR}` for current file’s directory
- `URLOpenInBrowser('http://localhost:7734')` to open browser
- NO Unicode characters in Pascal — ASCII only
- Form controls: include guard `{$IFNDEF WL_OSRS}{$I WaspLib/osrs.simba}{$ENDIF}` in every gui/ file
- Left/right panel split: left panel `ELazAlign.Left` with fixed width, right `ELazAlign.Client`
- Enum syntax: `type EFoo = enum(A, B, C);`
- Records can have methods
- `SleepUntil(condition, interval, timeout)` built-in
- Array literals: `['item1', 'item2']`

**Key global singletons:**
`Map`, `Walker`, `Antiban`, `Bank`, `Inventory`, `Equipment`, `Chat`, `GrandExchange`,
`Stats`, `Combat`, `Magic`, `Prayer`, `Minimap`, `Login`, `Lobby`, `Options`, `XPBar`,
`ColorFinder`, `ItemFinder`, `MainScreen`, `ObjectsJSON`, `NPCsJSON`

**Script structure pattern:**

1. `{$I WaspLib/osrs.simba}` include
1. Define a `TScript` record with fields
1. Override `Init()` to setup `Map.Setup([ERSChunk.X])`, Antiban tasks/breaks/sleeps, ScriptForm
1. Main loop calls `Antiban.DoAntiban()`
1. Walking: `Map.Walker.WebWalk(point, minDist, randomness)`

**Official script template pattern:**

```pascal
type ETemplateState = enum(LOGIN, LEVEL_UP, WAIT_STATE, END_SCRIPT);

type TTemplate = record(TBaseScript)
  // fields
end;

function TTemplate.GetState(): ETemplateState;
begin
  if Activity.IsFinished then Exit(ETemplateState.END_SCRIPT);
  if not RSClient.IsLoggedIn() then Exit(ETemplateState.LOGIN);
  if Chat.LeveledUp() then Exit(ETemplateState.LEVEL_UP);
  // user states
end;

procedure TTemplate.Run();
var state: ETemplateState;
begin
  Self.Init();
  repeat
    state := Self.GetState();
    case state of
      ETemplateState.LOGIN: Login.LoginPlayer();
      ETemplateState.LEVEL_UP: Chat.HandleLevelUp();
      ETemplateState.END_SCRIPT: Break;
    end;
    Antiban.DoAntiban();
  until False;
end;
```

**Antiban system:**

```pascal
Antiban.AddTask(@method, interval_ms, randomness);
Antiban.AddBreak(interval, length, randomness, logoutChance);
Antiban.AddSleep('HH:MM:SS', length_ms, randomness, logoutChance);
Antiban.DoAntiban(); // call in main loop
```

**Walker/Map:**

```pascal
Map.Setup([ERSChunk.CATHERBY]);          // set of ERSChunk, NOT single value
Map.Position()                            // returns TPoint
Map.Walker.WebWalk(pt, minDist, randomness)
Walker.WalkBlind(pt)
Walker.WalkPath(TPointArray)
Walker.InRange(pt, dist)
```

**Bank API:**

```pascal
Bank.Open()              // auto-finds nearest bank on loaded map
Bank.IsOpen()
Bank.WaitOpen(ms)
Bank.Close()
Bank.Withdraw(item, useQtyBtn, useCache)
Bank.Deposit(item)
Bank.DepositInventory()
Bank.DepositEquipment()
Bank.Search('name')
```

**Verified API names (these differ from what you might guess):**

- `FairyRing.Teleport(code)` NOT `FairyRing.Use`
- `Magic.Cast(ERSSpell.X)` NOT `Magic.CastSpell`
- `Prayer.Activate([ERSPrayer.X])` NOT `Prayer.ActivatePrayer`
- `TRSObject.WalkInteract` / `TRSEntity.WalkInteract` for interaction
- `Inventory.Items.Interact` for inventory item use
- `Bank.DepositInventory()` NOT `Bank.DepositAll()`
- `XPBar.EarnedXP()` for XP tracking
- `Chat.LeveledUp()` for level up detection
- `Chat.HandleLevelUp()` to handle level up dialog
- `Stats.GetLevel(ERSSkill.X)` for skill levels
- `Activity.IsFinished` for end condition
- `RSClient.IsLoggedIn()` for login check

-----

## MAP COORDINATE SYSTEM

### The Coordinate Formula (VERIFIED AND PROVEN)

WaspLib stores object coordinates in cache JSON files. The database values have an X offset that must be corrected:

```
True WaspLib X = DB_X - 4096     ← CRITICAL: subtract 4096 from DB value
True WaspLib Y = DB_Y            ← Y is already correct, no change
```

**Verified ground truth examples:**

|Object             |OSRS tile   |True WaspLib |DB raw        |
|-------------------|------------|-------------|--------------|
|NMZ Rewards Chest  |[2609, 3119]|[6340, 37954]|[10436, 37954]|
|Catherby Bank Booth|[2807, 3442]|[7132, 36662]|[11228, 36662]|
|Falador Bank Booth |[2807, 3441]|[7684, 36962]|[11780, 36962]|
|Varrock West Anvil |[2564, 3374]|[8656, 36746]|[12752, 36746]|

**OSRS tile → WaspLib conversion:**

```
WaspLib_X = OSRS_X * 4
WaspLib_Y = 50430 - (OSRS_Y * 4)
```

### Cache File Location and Format

WaspLib caches object JSON files at:

```
C:\Users\James\AppData\Local\com.wasp-launcher.app\Simba\Data\Cache\map\objects\
```

File naming: `{plane}-{chunkX}-{chunkY}.json`
Example: `0-43-53.json` = plane 0, chunk X=43, Y=53

Each file contains every object in that chunk with:

```json
{
  "id": 10355,
  "name": "Bank booth",
  "type": 10,
  "actions": ["Bank", "Collect"],
  "coordinates": [[11228, 36662], [11236, 36662]],
  "size": [1, 1, 1],
  "rotations": [2]
}
```

### map_objects.json Database

Location: `WaspForge/data/map_objects.json`
Size: 5.6MB, 45,179 objects, 3,080 unique names
Format: indexed by lowercase object name → array of entries

```json
{
  "bank booth": [
    {
      "id": 10355,
      "name": "Bank booth",
      "actions": ["Bank", "Collect"],
      "chunk": "0-43-53",
      "plane": 0,
      "coords": [[7132, 36662], [7140, 36662]]
    }
  ]
}
```

**The coords in map_objects.json are already corrected** (X - 4096 applied).

-----

## CONFIRMED OBJECT COORDINATES (verified against map.waspscripts.com)

|Location         |Object          |ID   |WaspLib Coord|Actions      |
|-----------------|----------------|-----|-------------|-------------|
|Catherby         |Bank booth      |10355|[7132, 36662]|Bank, Collect|
|Catherby         |Bank Deposit Box|50902|[7136, 36718]|Deposit      |
|Catherby         |Yew tree        |10822|[6924, 36694]|Chop down    |
|Falador East     |Bank booth      |24101|[7684, 36962]|Bank, Collect|
|Falador          |Furnace         |24009|[7810, 36954]|Smelt        |
|Edgeville        |Bank booth      |24101|[7780, 36474]|Bank, Collect|
|Edgeville        |Furnace         |16469|[8344, 36434]|Smelt        |
|Varrock West     |Anvil           |2097 |[8656, 36746]|Smith        |
|Varrock West     |Anvil           |2097 |[8656, 36734]|Smith        |
|Varrock West     |Anvil           |2097 |[8656, 36726]|Smith        |
|NMZ/Yanille      |Rewards chest   |26273|[6340, 37954]|Search       |
|Barbarian Village|Barbarian anvil |25349|[8232, 36786]|Smith        |

### Falador Bank ↔ Furnace Walking Path

```pascal
// Bank [7684, 36962] → Furnace [7810, 36954] — ~32 tiles apart, same chunk 0-46-52

MAP_PATH_TO_FURNACE: TPointArray = [
  [7684, 36962],  // bank walk-to
  [7730, 36958],  // midpoint
  [7810, 36954],  // furnace
];
MAP_PATH_TO_BANK: TPointArray = [
  [7810, 36954],
  [7730, 36958],
  [7684, 36962],
];
```

-----

## ERSGROUP / CHUNK SYSTEM

**ERSChunk enum covers 31+ regions.** Map.Setup() takes a SET of ERSChunk:

```pascal
Map.Setup([ERSChunk.CATHERBY]);                    // single chunk
Map.Setup([ERSChunk.FALADOR, ERSChunk.EDGEVILLE]); // multiple chunks
```

**Chunk coordinate lookup:**
Files named `{plane}-{chunkX}-{chunkY}.json`. The ERSChunk enum maps to specific chunk ranges.
Use `map.waspscripts.com` to visually confirm chunk IDs — the popup shows `Chunk(X, Y, plane)`.

**Key chunk→location mapping (verified):**

|ERSChunk   |Chunk range       |Key objects                |
|-----------|------------------|---------------------------|
|CATHERBY   |cx=43-44, cy=52-55|Bank, yews, fishing        |
|FALADOR    |cx=44-48, cy=50-54|Bank east+west, furnace    |
|EDGEVILLE  |cx=46-49, cy=51-54|Bank, furnace              |
|VARROCK    |cx=48-52, cy=51-55|West bank, anvils, GE      |
|NMZ/YANILLE|cx=38-41, cy=46-50|Rewards chest              |
|LUMBRIDGE  |cx=48-50, cy=49-51|Castle bank, spinning wheel|

-----

## WASPFORGE ARCHITECTURE

### File Structure

```
WaspForge/
├── WaspForge.simba              ← Launcher: opens browser + starts bridge
├── WaspForge_Server.bat         ← Start npx serve on port 7734
├── deploy.bat                   ← Push to GitHub
├── ROADMAP.md                   ← Full project spec
├── core/
│   ├── types.simba              ← ✅ All shared types/enums
│   ├── actions_catalog.simba    ← Loads actions.json
│   ├── code_generator.simba     ← TActionArray → Pascal string
│   ├── coord_library.simba      ← Persistent coord name→TPoint store
│   └── project_file.simba       ← Save/load .wfproj JSON
├── generator/
│   ├── templates.simba          ← ResolvePlaceholders()
│   ├── state_builder.simba      ← BuildStateEnum()
│   ├── getstate_builder.simba   ← BuildGetState()
│   ├── init_builder.simba       ← BuildInit()
│   └── loop_builder.simba       ← BuildLoopRun() / BuildQuestSolve()
├── grabbers/
│   └── bridge.simba             ← File bridge: handles grab_coords, grab_objects, lookup_object
├── gui/                         ← ScriptForm panels
├── ai/
│   ├── planner.simba            ← TLLMClient wrapper
│   └── planner_prompt.txt       ← System prompt for AI planning
├── atlas/                       ← WaspAtlas global map (Phase 6)
│   └── WaspAtlas.simba          ← {$I WaspForge/atlas/WaspAtlas.simba}
├── data/
│   ├── actions.json             ← 21 verified actions
│   ├── coords.json              ← Coordinate library
│   ├── chunk_bounds.json        ← ERSChunk → coordinate bounds
│   └── map_objects.json         ← 45k+ OSRS objects with WaspLib coords
└── web/
    ├── index.html               ← Self-contained React app
    └── bridge/
        ├── command.json         ← Browser writes commands here
        └── result.json          ← Simba writes results here
```

### Web UI / Bridge Architecture

- Browser runs React at `http://localhost:7734`
- Simba polls `web/bridge/command.json` every 500ms
- On command, Simba executes grab/lookup and writes to `web/bridge/result.json`
- Browser polls result.json and updates UI
- `WaspForge_Server.bat` starts `npx serve . -l 7734` in `web/` folder
- Tailscale makes it accessible at `http://100.103.210.69:7734` from iPhone

### Bridge command format:

```json
{"command":"lookup_object","payload":{"query":"bank booth","location":"falador"},"timestamp":1234}
```

### Path constants in Simba:

```pascal
const
  WF_MAP_OBJECTS = {$MACRO DIR} + 'data' + PATH_SEP + 'map_objects.json';
  WF_ACTIONS_JSON = {$MACRO DIR} + '..' + PATH_SEP + 'data' + PATH_SEP + 'actions.json';
  WF_COORDS_JSON = {$MACRO DIR} + '..' + PATH_SEP + 'data' + PATH_SEP + 'coords.json';
  WF_CHUNK_BOUNDS_JSON = {$MACRO DIR} + '..' + PATH_SEP + 'data' + PATH_SEP + 'chunk_bounds.json';
```

-----

## WASPFORGE CORE TYPES

```pascal
type
  ETrafficLight = enum(RED, YELLOW, GREEN);
  EForgeMode    = enum(LOOP_SCRIPT, SEQUENTIAL_QUEST);

  EInputType = enum(
    COORDINATE, ITEM_NAME, NPC_NAME, OBJECT_NAME, ACTION_TEXT,
    INTEGER_VAL, BOOL_VAL, PRAYER_SELECT, SPELL_SELECT, CHUNK_SELECT
  );

  TForgeInput = record
    ID:         String;
    Label_:     String;
    InputType:  EInputType;
    Value:      String;
    IsRequired: Boolean;
    IsGrabbed:  Boolean;
    GrabHint:   String;
  end;

  TForgeAction = record
    InstanceID:   String;
    CatalogID:    String;
    DisplayName:  String;
    Category:     String;
    Inputs:       array of TForgeInput;
    TrafficLight: ETrafficLight;
    Enabled:      Boolean;
    Notes:        String;
  end;

  TForgeProject = record
    Name:          String;
    Mode:          EForgeMode;
    Actions:       array of TForgeAction;
    MapChunks:     TStringArray;
    QuestName:     String;
    BreakInterval: Integer;
    BreakLength:   Integer;
    SleepTime:     String;
    AIAPIKey:      String;
  end;

  TGrabResult = record
    Success:    Boolean;
    Name:       String;
    Point:      TPoint;
    ChunkName:  String;
    UpText:     String;
    ActionText: String;
    Colors:     TCTS2ColorArray;
    Distance:   Integer;
  end;
```

-----

## 21 V1 ACTIONS (verified WaspLib APIs)

|ID                |WaspLib call                             |Category   |
|------------------|-----------------------------------------|-----------|
|WALK_TO           |Map.Walker.WebWalk(pt, dist*4, rng)      |movement   |
|USE_FAIRY_RING    |FairyRing.Teleport(code)                 |movement   |
|USE_TELEPORT_SPELL|Magic.Cast(ERSSpell.X)                   |movement   |
|USE_TELEPORT_ITEM |Inventory.Items.Interact(item, ‘Rub’)    |movement   |
|OPEN_BANK         |Bank.Open()                              |bank       |
|DEPOSIT_ALL       |Bank.DepositInventory()                  |bank       |
|DEPOSIT_ITEMS     |Bank.Deposit(item)                       |bank       |
|WITHDRAW_ITEMS    |Bank.Withdraw(item, qty, false, false)   |bank       |
|CLOSE_BANK        |Bank.Close()                             |bank       |
|INTERACT_OBJECT   |obj.WalkInteract([‘action’])             |interaction|
|INTERACT_NPC      |entity.WalkInteract([‘action’])          |interaction|
|USE_ITEM_ON_OBJECT|Inventory.Items.Interact then click obj  |interaction|
|USE_ITEM_ON_NPC   |Inventory.Items.Interact then click npc  |interaction|
|CLICK_TILE        |Walker.WalkSelectOption on coord         |interaction|
|DROP_ITEMS        |Inventory.Items.Drop(items)              |inventory  |
|EAT_FOOD          |Inventory.Items.Interact(food, ‘Eat’)    |inventory  |
|DRINK_POTION      |Inventory.Items.Interact(potion, ‘Drink’)|inventory  |
|ATTACK_NPC        |entity.WalkInteract([‘Attack’])          |combat     |
|ENABLE_PRAYER     |Prayer.Activate([ERSPrayer.X])           |combat     |
|LOOT_ITEM         |dot detection + right-click              |combat     |
|WAIT_XP           |XPBar.EarnedXP() monitoring              |utility    |

-----

## CODE GENERATOR OUTPUT STRUCTURE

```pascal
{$I WaspLib/osrs.simba}
// Generated by WaspForge
// Script: {{name}} | Generated: {{timestamp}}

const
  {{named coordinate constants for grabbed coords}}

type
  E{{ScriptName}}State = enum(
    LOGIN, LEVEL_UP,
    {{user_action_states}},
    END_SCRIPT
  );

  TScript = record(TBaseScript)
    {{fields for each action input}}
  end;

{{DoXxx() procedures for each action}}

function TScript.GetState(): E{{ScriptName}}State;
begin
  if Activity.IsFinished then Exit(E{{Name}}State.END_SCRIPT);
  if not RSClient.IsLoggedIn() then Exit(E{{Name}}State.LOGIN);
  if Chat.LeveledUp() then Exit(E{{Name}}State.LEVEL_UP);
  if Bank.IsOpen() then Exit(E{{Name}}State.OPEN_BANK);    // if bank action exists
  if Make.IsOpen() then Exit(E{{Name}}State.SELECT_MAKE);  // if make action exists
  {{user action conditions in order}}
end;

procedure TScript.Init();
begin
  Logger.Setup('{{ScriptName}}');
  Map.Setup([ERSChunk.{{chunk}}]);
  Antiban.AddBreak({{interval}} * ONE_MINUTE, {{length}} * ONE_MINUTE, 0.2, 0.33);
  Antiban.AddSleep('{{sleepTime}}', 8 * ONE_HOUR, 0.1, 0.8);
end;

procedure TScript.Run();
var state: E{{ScriptName}}State;
begin
  Self.Init();
  repeat
    state := Self.GetState();
    ProgressReport.Print();
    WaspClient.SubmitStats();
    case state of
      {{case arms}}
    end;
    Antiban.DoAntiban();
  until False;
end;

var Script: TScript;
begin Script.Run(); end.
```

**GetState() priority order (ALWAYS hardcoded first):**

1. `Activity.IsFinished` → END_SCRIPT
1. `not RSClient.IsLoggedIn()` → LOGIN
1. `Chat.LeveledUp()` → LEVEL_UP
1. Interface states (Bank.IsOpen, Make.IsOpen) → relevant state
1. User action conditions in their defined order

-----

## WASPQUESTS 1.x KNOWLEDGE

**Step types:** INTERACT_NPC, TALKTO, KILL, INTERACT_OBJECT, INTERACT_INVENTORY,
CONVERSATION, QUERY, COMBINE, LOOT, WALK, WAIT, CUTSCENE, BANK, CLICK_TILE,
USE_ON_NPC, USE_ON_OBJECT, GE_BUY, GE_SELL, CUSTOM

**Conversation system:**

- Conversation is array of Variant — integers select by index, strings use FindBestMatch
- `Chat.ChatToNumber(idx-1)` for index-based
- `Chat.GetOptions().ToStringArray` then `options.FindBestMatch(str, sim)`
- Dialog detection: `Chat.HasContinue()`, `Chat.GetChatTitle = 'Select an option'`

**Quest status detection:**

```pascal
// Colors: [255,65535,901389] = [not_started=blue, in_progress=yellow, complete=green]
Quests.GetQuestStatus(name): ERSQuestStatus  // NOT_STARTED/IN_PROGRESS/COMPLETED
```

**Quest runner:**

- `TQuest.Solve()` loops steps by index
- Retries up to 5 times on failure then `TerminateScript`
- `Map.SetupChunks(Quest.region, 8, enableLadders)`

-----

## WASPATLAS (Phase 6)

WaspAtlas provides global positioning — loads all ERSChunk regions so `Map.Position()`
and `Map.Walker.WebWalk()` work anywhere without knowing chunks in advance.

**Used by:** WaspQuests 2.0 (quest scripts traverse unknown paths)
**NOT used by:** WaspForge loop scripts (use chunk selector instead)

```pascal
{$I WaspLib/osrs.simba}
{$I WaspForge/atlas/WaspAtlas.simba}

// In Init():
Atlas.Setup();  // loads entire OSRS surface, ~30-60s first run then cached

// Then use normally:
Map.Walker.WebWalk(destination, 32, 0.2);
Map.Position();
```

**Coverage:**

- Surface (plane 0): all 31+ ERSChunk regions
- Underground: Taverley, Edgeville, Brimhaven dungeons, Catacombs, MLM, etc.
- Upstairs (plane 1+): Varrock Palace, Lumbridge Castle, Wizard Tower

-----

## MAP OBJECT LOOKUP — HOW TO USE

When asked for coordinates of any OSRS object, I can query the map_objects.json database
(which I built from James’s WaspLib cache files — 2,641 JSON files, entire visited map).

**To find any object:**

1. Search by name (lowercase) in map_objects.json
1. Filter by location/chunk if specified
1. Apply coordinate correction: `True_X = DB_X - 4096`, `True_Y = DB_Y`
1. First coord in the array is the primary tile
1. Walk-to tile: typically 4 pixels south of object (`coord[1] + 4`)

**Location → chunk range reference:**

```
edgeville:    cx=46-49, cy=51-54
varrock:      cx=48-52, cy=51-55
lumbridge:    cx=48-50, cy=49-51
draynor:      cx=46-48, cy=50-53
falador:      cx=44-48, cy=50-54
catherby:     cx=41-45, cy=52-56
ardougne:     cx=38-42, cy=50-54
seers/camelot: cx=40-44, cy=53-57
yanille/nmz:  cx=38-41, cy=46-50
al kharid:    cx=49-52, cy=48-52
barbarian:    cx=46-49, cy=52-54
blast furnace: cx=27-30, cy=76-80
motherloade:  cx=56-59, cy=87-90
wintertodt:   cx=24-26, cy=60-64
```

**Always respond with this format when giving object data:**

```
Name:     Bank booth
ID:       10355
Actions:  ["Bank", "Collect"]
Chunk:    0-43-53 (CATHERBY)
WaspLib:  [7132, 36662]
Walk-to:  [7132, 36666]
```

-----

## DEPLOYMENT WORKFLOW

```
deploy.bat → git add -A → git commit → git push origin master
```

**Startup sequence:**

1. Double-click `WaspForge_Server.bat` (starts `npx serve . -l 7734`)
1. Browser opens at `http://localhost:7734`
1. iPhone: `http://100.103.210.69:7734` (Tailscale must be connected)
1. Open `WaspForge.simba` in Simba → hit Play (starts bridge)

-----

## BATTLESTAFF SCRIPT KNOWLEDGE (verified OSRS data)

Crafting levels required:

- Air battlestaff: 66 Crafting (Air orb on battlestaff)
- Water battlestaff: 54 Crafting (Water orb on battlestaff)
- Earth battlestaff: 58 Crafting (Earth orb on battlestaff)
- Fire battlestaff: 63 Crafting (Fire orb on battlestaff)

XP per staff: 137.5 Crafting XP
Make interface: `Make.IsOpen()`, `Make.SelectItem('Battlestaff')`, `Make.SelectQuantity(ERSItemQuantity.ALL)`

Workflow: Bank → Withdraw 14 battlestaffs + 14 orbs → Use orb on staff → Make all → wait for XP → bank

-----

## WASPFORGE WEB UI NOTES

The web UI moved from Simba ScriptForm to browser-based React after decision to prioritize
mobile/Tailscale access. Key decisions:

- React app is self-contained in `web/index.html` (no build step needed for serving)
- File bridge pattern chosen over local HTTP server for simplicity
- `npx serve . -l 7734` binds to 0.0.0.0 — accessible on Tailscale automatically
- No firewall changes needed — Tailscale handles routing

**Tailscale IPs:**

- PC: `100.103.210.69`
- iPhone: `100.93.239.79`