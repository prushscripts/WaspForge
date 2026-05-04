# WaspForge — Complete Project Roadmap

## AI-Powered Script Factory for WaspScripts 2.0 / Simba 2.0

-----

## PROJECT OVERVIEW

WaspForge is a Simba-native ScriptForm application that allows users to build
fully functional WaspLib 2.0 scripts through a GUI without writing code manually.
It uses live in-game data grabbers, an AI planner, and a real-time code generator
to produce complete, valid, ready-to-run .simba scripts.

**Two modes:**

1. Loop Script Mode — standard skilling/farming FSM scripts
1. Sequential Quest Mode — WaspQuests 2.0 step-by-step quest scripts

**Delivery format:** Simba-native ScriptForm (Option A). Everything runs inside
Simba. Grabbers call WaspLib functions directly. No external dependencies.

**Language:** Pascal (Simba 2.0 scripting language)
**Framework:** WaspLib 2.0 ({$I WaspLib/osrs.simba})
**AI integration:** WaspLib’s built-in TLLMClient

-----

## REPOSITORY STRUCTURE

```
WaspForge/
├── WaspForge.simba              ← Main entry point, run this in Simba
├── ROADMAP.md                   ← This file
├── README.md                    ← User-facing documentation
├── BUILD_SUMMARY.md             ← Session handoff document (keep updated)
├── deploy.bat                   ← Double-click to push all changes to GitHub
│
├── core/
│   ├── types.simba              ← All shared types/enums (no dependencies) ✅ DONE
│   ├── actions_catalog.simba    ← Action catalog loader (reads actions.json)
│   ├── code_generator.simba     ← Takes TActionArray → produces Pascal string
│   ├── coord_library.simba      ← Persistent coordinate name→TPoint store
│   └── project_file.simba       ← Save/load .wfproj JSON files
│
├── grabbers/
│   ├── grabber_base.simba       ← Shared grabber types and helpers
│   ├── grab_coordinate.simba    ← Map.Position() + chunk detection
│   ├── grab_objects.simba       ← RSObjects within radius
│   ├── grab_npcs.simba          ← RSEntities within radius
│   └── grab_color.simba         ← CTS2 color at mouse position
│
├── gui/
│   ├── forge_form.simba         ← Main TScriptForm definition
│   ├── action_panel.simba       ← Left panel: action card list
│   ├── code_panel.simba         ← Right panel: live code preview
│   ├── action_card.simba        ← Individual action card (inputs + traffic light)
│   └── ai_planner_panel.simba   ← AI text input panel
│
├── generator/
│   ├── templates.simba          ← Pascal code snippet templates per action
│   ├── state_builder.simba      ← Builds EState enum from action list
│   ├── getstate_builder.simba   ← Builds GetState() function
│   ├── init_builder.simba       ← Builds Init() with Map.Setup, antiban, etc.
│   └── loop_builder.simba       ← Builds the Run() loop
│
├── ai/
│   ├── planner.simba            ← TLLMClient wrapper for WaspForge
│   └── planner_prompt.txt       ← System prompt for AI action planning
│
├── atlas/
│   ├── WaspAtlas.simba          ← Main include: {$I WaspForge/atlas/WaspAtlas.simba}
│   ├── atlas_types.simba        ← TAtlasRegion, TRSAtlas, atlas enums
│   ├── atlas_chunks.simba       ← Master chunk registry (all planes, all regions)
│   ├── atlas_surface.simba      ← Surface (plane 0) chunk constants + setup
│   ├── atlas_underground.simba  ← Underground/dungeon chunk setup
│   ├── atlas_upstairs.simba     ← Upper floors (plane 1+) chunk setup
│   └── atlas_loader.simba       ← TRSAtlas.Setup(), Position(), WalkTo()
│
├── data/
│   ├── actions.json             ← THE action catalog (source of truth) ✅ DONE
│   ├── coords.json              ← Persistent coordinate library (grows over time)
│   └── chunk_bounds.json        ← ERSChunk name → coordinate bounds ✅ DONE
│
└── tests/
    ├── test_code_generator.simba ← Feed hardcoded actions, verify output compiles
    ├── test_grabbers.simba       ← Test each grabber against live client
    └── test_coord_library.simba  ← Test save/load of coord library
```

-----

## COMPLETED STEPS

- ✅ Step 1 — Repository skeleton (all placeholder files created)
- ✅ Step 2 — data/actions.json (21 actions, all APIs verified against WaspLib source)
- ✅ Step 3 — data/chunk_bounds.json (all ERSChunk values with coordinate bounds)
- ✅ Step 4 — core/types.simba (full Phase 0.1 type definitions)

-----

## PHASE 0 — FOUNDATION (COMPLETE)

### 0.1 — Core Type Definitions (core/types.simba) ✅

```pascal
{$DEFINE WF_TYPES_INCLUDED}

type
  ETrafficLight = enum(RED, YELLOW, GREEN);
  EForgeMode    = enum(LOOP_SCRIPT, SEQUENTIAL_QUEST);

  EInputType = enum(
    COORDINATE, ITEM_NAME, NPC_NAME, OBJECT_NAME, ACTION_TEXT,
    INTEGER_VAL, BOOL_VAL, PRAYER_SELECT, SPELL_SELECT, CHUNK_SELECT
  );

  TForgeInput = record
    ID:          String;
    Label_:      String;
    InputType:   EInputType;
    Value:       String;
    IsRequired:  Boolean;
    IsGrabbed:   Boolean;
    GrabHint:    String;
  end;

  TForgeInputArray = array of TForgeInput;

  TForgeAction = record
    InstanceID:   String;
    CatalogID:    String;
    DisplayName:  String;
    Category:     String;
    Inputs:       TForgeInputArray;
    TrafficLight: ETrafficLight;
    Enabled:      Boolean;
    Notes:        String;
  end;

  TForgeActionArray = array of TForgeAction;

  TForgeProject = record
    Name:          String;
    Mode:          EForgeMode;
    Actions:       TForgeActionArray;
    MapChunks:     TStringArray;
    QuestName:     String;
    BreakInterval: Integer;
    BreakLength:   Integer;
    SleepTime:     String;
    AIAPIKey:      String;
  end;

  TCoordEntry = record
    Name:      String;
    Point:     TPoint;
    ChunkName: String;
    AddedAt:   String;
  end;

  TCoordLibrary = record
    Entries: array of TCoordEntry;
    Path:    String;
  end;

  TGrabResult = record
    Success:    Boolean;
    Name:       String;
    Point:      TPoint;
    ChunkName:  String;
    UpText:     String;
    ActionText: String;
    Colors:     TColorArray;
    Distance:   Integer;
  end;

  TGrabResultArray = array of TGrabResult;
```

### 0.2 — actions.json Schema ✅

### 0.3 — Full v1 Action Catalog (21 actions) ✅

### 0.4 — chunk_bounds.json ✅

-----

## PHASE 1 — ACTION ENGINE & CODE GENERATOR

### 1.1 — core/actions_catalog.simba

```pascal
type
  TCatalogEntry = record
    ID:                String;
    DisplayName:       String;
    Category:          String;
    Description:       String;
    StateEnumName:     String;
    Inputs:            TForgeInputArray;
    TerminalCondition: String;
    DoActionTemplate:  TStringArray;
    GetStateCondition: String;
  end;

  TActionsCatalog = record
    Entries: array of TCatalogEntry;
    Path:    String;
  end;

procedure TActionsCatalog.Load(path: String);
function  TActionsCatalog.GetByID(id: String): TCatalogEntry;
function  TActionsCatalog.GetByCategory(cat: String): array of TCatalogEntry;
function  TActionsCatalog.IsValidID(id: String): Boolean;
```

Use WaspLib TJSONObject/TJSONParser for JSON parsing.
Reference: WaspGod/WaspLib/utils/clients/llmclient.simba for patterns.

### 1.2 — core/coord_library.simba

```pascal
procedure TCoordLibrary.Load(path: String);
procedure TCoordLibrary.Save();
procedure TCoordLibrary.Add(name: String; point: TPoint; chunkName: String);
function  TCoordLibrary.Find(name: String; out point: TPoint): Boolean;
function  TCoordLibrary.FindNearest(point: TPoint): TCoordEntry;
function  TCoordLibrary.GetAllNames(): TStringArray;
procedure TCoordLibrary.AutoSave(action: TForgeAction);
```

### 1.3 — generator/templates.simba

```pascal
function ResolvePlaceholders(template: String; inputs: TForgeInputArray): String;
```

Replaces {{input_id}} tokens with actual input values.
Type coercion rules:

- COORDINATE → [x,y] literal
- ITEM_NAME / NPC_NAME / OBJECT_NAME → ‘quoted string’
- INTEGER_VAL → raw number
- Comma-separated item lists → ‘item1’, ‘item2’ for array literals

### 1.4 — generator/state_builder.simba

```pascal
function BuildStateEnum(actions: TForgeActionArray; scriptName: String): String;
```

Always includes LOGIN, LEVEL_UP, END_SCRIPT regardless of user actions.
Script name derives type name: “Woodcutter” → EWoodcutterState.

### 1.5 — generator/getstate_builder.simba

```pascal
function BuildGetState(actions: TForgeActionArray; scriptName: String): String;
```

Priority order (hardcoded, always first):

1. Activity.IsFinished → END_SCRIPT
1. not RSClient.IsLoggedIn() → LOGIN
1. Chat.LeveledUp() → LEVEL_UP
1. Interface states (Bank.IsOpen, Make.IsOpen)
1. User action conditions in their defined order

### 1.6 — generator/init_builder.simba

```pascal
function BuildInit(project: TForgeProject): String;
```

Produces:

- Logger.Setup(scriptName)
- ProgressReport.Setup(…)
- Map.Setup([ERSChunk.X, ERSChunk.Y, …]) from project.MapChunks
- Antiban.AddBreak / AddSleep from project break/sleep settings
- CollectionBox.Setup()

### 1.7 — generator/loop_builder.simba

```pascal
function BuildLoopRun(actions: TForgeActionArray; scriptName: String): String;
function BuildQuestSolve(actions: TForgeActionArray; questName: String): String;
```

Loop mode: standard FSM repeat/until False with case state of.
Quest mode: sequential step runner with retry logic, 5-attempt limit per step.

### 1.8 — core/code_generator.simba

```pascal
type
  TCodeGenerator = record
    Catalog: TActionsCatalog;
  end;

function TCodeGenerator.Generate(project: TForgeProject): String;
```

Full output structure:

```pascal
{$I WaspLib/osrs.simba}
// Generated by WaspForge
// Script: {{name}} | Generated: {{timestamp}}

const
  {{named coordinate constants}}

type
  {{EState enum}}
  {{TScript record with input fields}}

{{DoXxx() procedures}}

function TScript.GetState(): EState; ...
procedure TScript.Init(); ...
procedure TScript.Run(); ...

var Script: TScript;
begin Script.Run(); end.
```

### 1.9 — core/project_file.simba

```pascal
procedure TForgeProject.Save(path: String);
function  TForgeProject.Load(path: String): Boolean;
function  TForgeProject.ToJSON(): String;
function  TForgeProject.FromJSON(json: String): Boolean;
```

### 1.10 — tests/test_code_generator.simba

QUALITY GATE — must pass before any GUI work begins.

Test 1 (simple): Walk → Chop tree → Walk to bank → Deposit all → repeat
Test 2 (medium): Combat with food eating and loot pickup
Test 3 (complex): Multi-skill with banking, level checks, prayer

For each: print output, paste into Simba, verify zero compile errors.

-----

## PHASE 2 — GRABBERS

### 2.1 — grabbers/grabber_base.simba

```pascal
type
  TGrabberBase = record
    FormHandle: NativeInt;
  end;

procedure TGrabberBase.MinimizeForm();
procedure TGrabberBase.RestoreForm();
```

### 2.2 — grabbers/grab_coordinate.simba

```pascal
function GrabCoordinate(): TGrabResult;
function DetectChunk(point: TPoint): String;
```

DetectChunk loads chunk_bounds.json and finds which chunk bounds contain the point.

### 2.3 — grabbers/grab_objects.simba

```pascal
function GrabObjectsInRadius(radiusTiles: Integer; nameFilter: String = ''): TGrabResultArray;
```

Uses ObjectsJSON (loaded by Map.Setup). Sorted by distance ascending.

### 2.4 — grabbers/grab_npcs.simba

```pascal
function GrabNPCsInRadius(radiusTiles: Integer; nameFilter: String = ''): TGrabResultArray;
```

### 2.5 — grabbers/grab_color.simba

```pascal
function GrabColorAtMouse(): TGrabResult;
```

### 2.6 — tests/test_grabbers.simba

Stand in Varrock. Run all grabbers. Coordinate must match map.waspscripts.com.
Object grabber must return “Bank booth”, nearby NPCs, etc.

-----

## PHASE 3 — THE GUI

### Layout

```
╔══════════════════════════════════════════════════════════════════════════╗
║  🔥 WaspForge                          [Loop Script ▼] [Save] [Load]    ║
╠═══════════════════════════╦════════════════════════════════════════════╣
║  SCRIPT BUILDER           ║  LIVE CODE PREVIEW                         ║
║                           ║                                            ║
║  Name: [____________]     ║  {$I WaspLib/osrs.simba}                   ║
║                           ║                                            ║
║  ┌───────────────────┐    ║  type                                      ║
║  │🟢 WALK_TO   [▲▼✕] │    ║    EWoodcutterState = enum(                ║
║  │ Dest: [3085,3237] │    ║      LOGIN, LEVEL_UP,                      ║
║  │        [ Grab ]   │    ║      WALK_TO_TREES, INTERACT_OBJECT,       ║
║  └───────────────────┘    ║      OPEN_BANK, DEPOSIT_ALL,               ║
║                           ║      CLOSE_BANK, END_SCRIPT                ║
║  ┌───────────────────┐    ║    );                                      ║
║  │🔴 INTERACT  [▲▼✕] │    ║                                            ║
║  │ Object: [_______] │    ║  procedure TScript.DoWalkTo();             ║
║  │         [ Grab ]  │    ║  begin                                     ║
║  └───────────────────┘    ║    Map.Walker.WebWalk([3085,3237],20,0.2); ║
║                           ║  end;                                      ║
║  [+ Add Action]           ║                                            ║
║                           ║  function TScript.GetState(): EState;      ║
║  ── ANTIBAN ──────────    ║  begin                                     ║
║  Break: [30] min          ║    if Activity.IsFinished then             ║
║  Length: [5] min          ║      Exit(EState.END_SCRIPT);              ║
║  Sleep: [00:30:00]        ║    ...                                     ║
║                           ║  end;                                      ║
║  ── MAP CHUNKS ───────    ║                                            ║
║  [varrock__] [+ Add]      ║  ────────────────────────────────────────  ║
║  Results: VARROCK ✓       ║  [Copy]  [Save .simba]                     ║
║                           ║  Lines: 87 | 🟢 5 GREEN 🔴 1 RED           ║
╠═══════════════════════════╩════════════════════════════════════════════╣
║  🤖 AI: [Chop willows at Draynor, bank logs____________] [Generate]    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

Traffic lights:

- 🔴 RED = required input empty or NEEDS_GRAB
- 🟡 YELLOW = all filled, COORDINATE not grabbed live from game
- 🟢 GREEN = all inputs filled, all COORDINATEs grabbed via grabber

### 3.1 — gui/forge_form.simba

Main TWaspForge extending TScriptForm.
UpdateCodePreview() called after EVERY state change. Must run under 100ms.
Hosts project state, catalog, coord library, generator instances.

### 3.2 — gui/action_card.simba

Dynamic panel per action. Input controls created once, shown/hidden by action type.
Grab button: minimize form → call grabber → restore form → populate field.
Validate() returns RED/YELLOW/GREEN. Updates traffic light shape color.

Traffic light color constants:

```pascal
const
  TL_RED    = $0000CC;
  TL_YELLOW = $00AACC;
  TL_GREEN  = $00AA00;
```

### 3.3 — gui/code_panel.simba

Read-only TMemo. Updates via UpdateCodePreview() on every change.
Copy to clipboard button. Save .simba button.
Status bar: “Lines: N | Actions: N | 🟢 X GREEN 🔴 Y RED”

### 3.4 — gui/action_panel.simba

Scrollable left panel. Add Action button. Move up/down/delete per card.

### 3.5 — gui/ai_planner_panel.simba

Text input at bottom. Submit → TForgePlanner.Plan() → parse JSON →
validate IDs → load action cards → UpdateCodePreview().

### 3.6 — Map Chunk Selector (inside forge_form)

Searchable text field. User types location name.
Dropdown shows matching ERSChunk names from chunk_bounds.json.
Click to add to project.MapChunks list.
Generated Init() includes Map.Setup([ERSChunk.X, ERSChunk.Y, …]).
Multiple chunks supported.

-----

## PHASE 4 — AI PLANNER

### 4.1 — ai/planner_prompt.txt

Rules: only catalog IDs, JSON only, COORDINATE → NEEDS_GRAB,
exact OSRS names, no LOGIN/LEVEL_UP (auto-added by generator).
Full catalog JSON inserted at runtime.

### 4.2 — ai/planner.simba

```pascal
type
  TForgePlanner = record
    Client:    TLLMClient;
    PromptPath:String;
    Catalog:   TActionsCatalog;
    IsSetup:   Boolean;
    LastError: String;
  end;

procedure TForgePlanner.Setup(apiKey: String; catalog: TActionsCatalog);
function  TForgePlanner.Plan(userDescription: String): TForgeActionArray;
function  TForgePlanner.ParseResponse(json: String): TForgeActionArray;
function  TForgePlanner.ValidateActions(actions: TForgeActionArray): Boolean;
```

API key: {WLEnv.CacheDir}/waspforge/config.json — never in project files.

-----

## PHASE 5 — TRAFFIC LIGHT SYSTEM

RED: required input empty or NEEDS_GRAB
YELLOW: all inputs filled, COORDINATE input not yet grabbed live
GREEN: all inputs filled, all COORDINATEs grabbed via grabber

Save Script warns (not blocks) if any RED/YELLOW.
Status bar shows real-time count at all times.

-----

## PHASE 6 — WASPATLAS

WaspAtlas is the global positioning and navigation system for WaspLib 2.0.
It enables Map.Position() and Map.Walker.WebWalk() to work from any location
on the OSRS map without calling Map.Setup() with specific chunks first.

WaspAtlas is a SEPARATE include from WaspForge core:
{$I WaspForge/atlas/WaspAtlas.simba}

WaspForge loop scripts use the chunk selector (Phase 3.6).
WaspQuests 2.0 scripts use WaspAtlas.

### Why WaspAtlas Is Needed

Quest scripts traverse the entire OSRS map. They cannot know in advance
which chunks they will walk through. WaspAtlas loads comprehensive chunk
coverage so the walker works anywhere on the map.

WaspAtlas is NOT rebuilding the old WaspQuests overworldWalker from scratch.
WaspLib 2.0 already has minimap template matching, webgraph, collision data,
and door handling built in. WaspAtlas simply calls Map.Setup() with
comprehensive chunk coverage so WaspLib’s existing systems work everywhere.

### Coverage

**Surface (plane 0):**
All ERSChunk surface regions covering the accessible OSRS overworld.
Groups by geographic region for organized loading.

**Underground (plane 0, separate coordinate space):**
Major dungeons accessible during quests or training:

- Taverley Dungeon (blue dragons, water obelisk, Fishing Trawler)
- Edgeville Dungeon (earth/air obelisks, black demons)
- Brimhaven Dungeon (metal dragons)
- Catacombs of Kourend (broad slayer tasks)
- Dwarven Mine (mining, quest areas)
- Motherlode Mine
- Lumbridge Swamp Caves (slayer)
- Stronghold of Security (all 4 floors)
- TzHaar/Mor Ul Rek (fight cave, quests)
- Slayer Tower (all floors)

**Upper Floors (plane 1+):**
Quest-relevant buildings with accessible upper areas:

- Varrock Palace (various quest rooms)
- Lumbridge Castle (upstairs, Rat Catchers, etc.)
- Wizard Tower (entrance floor)
- Barbarian Outpost (upper floor)
- Miscellaneous quest buildings

### atlas/atlas_types.simba

```pascal
{$DEFINE WF_ATLAS_TYPES_INCLUDED}
{$IFNDEF WF_TYPES_INCLUDED}
  {$I WaspForge/core/types.simba}
{$ENDIF}

type
  EAtlasRegion = enum(SURFACE, UNDERGROUND, UPSTAIRS);

  TAtlasChunkEntry = record
    ChunkName: String;
    Plane:     Integer;
    Region:    EAtlasRegion;
    Notes:     String;
  end;

  TRSAtlas = record(TSRLBaseRecord)
    IsSetup:      Boolean;
    LoadedChunks: TStringArray;
    CurrentPlane: Integer;
  end;

var
  Atlas: TRSAtlas;
```

### atlas/atlas_surface.simba

Complete ERSChunk constants grouped by OSRS geographic region.

```pascal
const
  // Misthalin (Lumbridge, Varrock, Draynor, Edgeville area)
  ATLAS_MISTHALIN: set of ERSChunk = [
    ERSChunk.LUMBRIDGE,
    ERSChunk.DRAYNOR_VILLAGE,
    ERSChunk.VARROCK,
    ERSChunk.EDGEVILLE
    // all Misthalin-area chunks from rschunks.simba
  ];

  // Asgarnia (Falador, Port Sarim, Taverley, Burthorpe)
  ATLAS_ASGARNIA: set of ERSChunk = [
    ERSChunk.FALADOR,
    ERSChunk.PORT_SARIM,
    ERSChunk.TAVERLEY
    // all Asgarnia-area chunks
  ];

  // Kandarin (Ardougne, Seers Village, Catherby, Camelot)
  ATLAS_KANDARIN: set of ERSChunk = [
    ERSChunk.ARDOUGNE,
    ERSChunk.SEERS_VILLAGE,
    ERSChunk.CATHERBY
    // all Kandarin-area chunks
  ];

  // Morytania (Canifis, Barrows, Mort Myre)
  ATLAS_MORYTANIA: set of ERSChunk = [
    ERSChunk.CANIFIS,
    ERSChunk.BARROWS
    // all Morytania-area chunks
  ];

  // Feldip Hills / Karamja / South
  ATLAS_SOUTH: set of ERSChunk = [
    ERSChunk.KARAMJA,
    ERSChunk.FELDIP_HILLS
    // all southern chunks
  ];

  // Kourend / Zeah
  ATLAS_ZEAH: set of ERSChunk = [
    ERSChunk.KOUREND
    // all Zeah chunks
  ];

  // Wilderness
  ATLAS_WILDERNESS: set of ERSChunk = [
    // wilderness chunks — include these carefully
    // WebWalk should still work but adds PKer risk context
  ];

  // All surface chunks combined
  ATLAS_SURFACE_ALL: set of ERSChunk = (
    ATLAS_MISTHALIN +
    ATLAS_ASGARNIA +
    ATLAS_KANDARIN +
    ATLAS_MORYTANIA +
    ATLAS_SOUTH +
    ATLAS_ZEAH +
    ATLAS_WILDERNESS
  );
```

**Important:** Build the regional sets from the actual ERSChunk values in
WaspGod/WaspLib/utils/rschunks.simba. Do not invent chunk names.
Use only names that exist in the ERSChunk enum.

### atlas/atlas_underground.simba

```pascal
// Each procedure calls Map.Add() to append to the already-loaded surface map.
// Map.Add() is the WaspLib 2.0 method for adding chunks to an existing TRSMap.

procedure TRSAtlas.AddTaverleyDungeon();
procedure TRSAtlas.AddEdgevilleDungeon();
procedure TRSAtlas.AddBrimhavenDungeon();
procedure TRSAtlas.AddCatacombsOfKourend();
procedure TRSAtlas.AddDwarvenMine();
procedure TRSAtlas.AddMotherlodeMine();
procedure TRSAtlas.AddLumbridgeSwampCaves();
procedure TRSAtlas.AddStrongholdOfSecurity();
procedure TRSAtlas.AddTzHaar();
procedure TRSAtlas.AddSlayerTower();

procedure TRSAtlas.SetupUnderground();
begin
  Self.AddTaverleyDungeon();
  Self.AddEdgevilleDungeon();
  // ... etc
end;
```

### atlas/atlas_upstairs.simba

```pascal
procedure TRSAtlas.AddVarrockPalace();
procedure TRSAtlas.AddLumbridgeCastle();
procedure TRSAtlas.AddWizardTower();
// ... etc

procedure TRSAtlas.SetupUpstairs();
begin
  Self.AddVarrockPalace();
  Self.AddLumbridgeCastle();
  // ... etc
end;
```

### atlas/atlas_loader.simba

```pascal
procedure TRSAtlas.SetupSurface();
// Map.Setup(ATLAS_SURFACE_ALL, 8)
// Logs progress. First run: 30-60s. Subsequent: 2-5s from cache.

procedure TRSAtlas.Setup(region: EAtlasRegion = EAtlasRegion.SURFACE);
// SURFACE only: SetupSurface()
// UNDERGROUND: SetupSurface() then SetupUnderground()
// UPSTAIRS: SetupSurface() then SetupUpstairs()
// Can be called with multiple regions if needed

function TRSAtlas.Position(): TPoint;
// Wrapper: Map.Position()

function TRSAtlas.WalkTo(destination: TPoint; minDist: Integer = 8): Boolean;
// Wrapper: Map.Walker.WebWalk(destination, minDist * 4, 0.2)

function TRSAtlas.IsSetupFor(region: EAtlasRegion): Boolean;
// Returns true if the requested region is already loaded
```

### atlas/WaspAtlas.simba (main include)

```pascal
(*
  WaspAtlas — Global positioning and navigation for WaspLib 2.0.
  Enables Map.Position() and walking from any OSRS surface location.

  Usage:
    {$I WaspLib/osrs.simba}
    {$I WaspForge/atlas/WaspAtlas.simba}

    // In Init():
    Atlas.Setup(); // loads entire surface map

    // Then use normally:
    Map.Walker.WebWalk(destination, 32, 0.2);
    Map.Position();
*)
{$DEFINE WF_ATLAS_INCLUDED}
{$I WaspForge/atlas/atlas_types.simba}
{$I WaspForge/atlas/atlas_chunks.simba}
{$I WaspForge/atlas/atlas_surface.simba}
{$I WaspForge/atlas/atlas_underground.simba}
{$I WaspForge/atlas/atlas_upstairs.simba}
{$I WaspForge/atlas/atlas_loader.simba}
```

### WaspAtlas vs Chunk Selector comparison

|                 |WaspAtlas           |Chunk Selector        |
|-----------------|--------------------|----------------------|
|Used in          |WaspQuests 2.0      |WaspForge loop scripts|
|Loads            |Everything          |Only what script needs|
|First-run startup|30-60s (then cached)|<1s                   |
|Memory           |Higher              |Minimal               |
|Position accuracy|Full map            |Local area only       |
|Use when         |Quest traverses map |Skilling in fixed area|

-----

## PHASE 7 — WASPQUESTS 2.0 MODE

When user selects SEQUENTIAL_QUEST in WaspForge:

- “Quest Name” field appears (used for journal status detection)
- Actions become ordered steps, no looping
- Code preview switches to sequential step runner
- Generated Init() uses Atlas.Setup() instead of Map.Setup([chunks])
- Quest journal detection auto-added: Quests.GetQuestStatus(questName)
- 5-attempt limit per step before TerminateScript

-----

## PHASE 8 — POLISH AND RELEASE

- Error handling audit (every grabber, AI call, file operation)
- Performance: code generator under 100ms for 30-action scripts
- Undo system: TForgeProject snapshot stack (20 levels, Ctrl+Z)
- Export: .simba and .wfproj formats
- README.md with 5-minute quickstart
- Release on waspscripts.com as free community tool

-----

## CODING STANDARDS

**File headers:**

```pascal
(*
  WaspForge — [module purpose]
  Part of the WaspForge script factory system.
*)
{$DEFINE WF_[MODULENAME]_INCLUDED}
{$IFNDEF WF_TYPES_INCLUDED}
  {$I WaspForge/core/types.simba}
{$ENDIF}
```

**WaspLib wins over ROADMAP** for all API names and signatures.
**No WaspQuests overrides** — base WaspLib only.
**One file at a time** — complete before moving to next.
**Every failing function** returns Boolean or sets LastError.
**No magic numbers** — all constants named.
**UpdateCodePreview()** called after every GUI state change.

**Path constants:**

```pascal
const
  WF_PATH        = {Simba includes path} + 'WaspForge' + PATH_SEP;
  WF_DATA_PATH   = WF_PATH + 'data' + PATH_SEP;
  WF_ATLAS_PATH  = WF_PATH + 'atlas' + PATH_SEP;
  WF_CONFIG_PATH = WLEnv.CacheDir + 'waspforge' + PATH_SEP;
```

-----

## BUILD ORDER (Strict — follow exactly)

### COMPLETED

1. ✅ data/actions.json
1. ✅ data/chunk_bounds.json
1. ✅ core/types.simba
1. ✅ All placeholder .simba files

### REMAINING (in strict order)

1. core/actions_catalog.simba
1. core/coord_library.simba
1. generator/templates.simba
1. generator/state_builder.simba
1. generator/getstate_builder.simba
1. generator/init_builder.simba
1. generator/loop_builder.simba
1. core/code_generator.simba
1. core/project_file.simba
1. tests/test_code_generator.simba  ← RUN AND PASS before GUI
1. grabbers/grabber_base.simba
1. grabbers/grab_coordinate.simba
1. grabbers/grab_objects.simba
1. grabbers/grab_npcs.simba
1. grabbers/grab_color.simba
1. tests/test_grabbers.simba        ← RUN AND PASS before GUI
1. gui/action_card.simba
1. gui/code_panel.simba
1. gui/action_panel.simba
1. gui/ai_planner_panel.simba
1. gui/forge_form.simba
1. ai/planner.simba
1. ai/planner_prompt.txt
1. WaspForge.simba                  ← wire everything together
1. atlas/atlas_types.simba
1. atlas/atlas_chunks.simba
1. atlas/atlas_surface.simba
1. atlas/atlas_underground.simba
1. atlas/atlas_upstairs.simba
1. atlas/atlas_loader.simba
1. atlas/WaspAtlas.simba            ← main atlas include

-----

## GIT / DEPLOYMENT

Repository: https://github.com/prushscripts/WaspForge
Branch: main

deploy.bat (in repo root):

```bat
@echo off
cd /d %~dp0
git add -A
git commit -m "WaspForge update - %date% %time%"
git push origin main
echo.
echo Push complete.
pause
```

Double-click deploy.bat after every session to push all changes.
Keep BUILD_SUMMARY.md updated at end of every session.

-----

## KEY EXTERNAL DEPENDENCIES

All API names verified against WaspLib 2.0 source in WaspGod/WaspLib/:

- {$I WaspLib/osrs.simba} — main WaspLib include
- TLLMClient (utils/clients/llmclient.simba) — AI planner
- TScriptForm (utils/forms/scriptform.simba) — GUI base
- Map.Setup / Map.Add / Map.Position (osrs/position/map/map.simba)
- Map.Walker.WebWalk / InRange (osrs/walker.simba)
- Bank.Open / Close / DepositInventory / Withdraw (osrs/interfaces/mainscreen/bank.simba)
- Inventory.Items.Interact / Contains / Combine (osrs/interfaces/gametabs/inventory.simba)
- FairyRing.Teleport (osrs/interfaces/mainscreen/fairyring.simba)
- Magic.Cast(ERSSpell) (osrs/interfaces/gametabs/magic.simba)
- Prayer.Activate([ERSPrayer]) (osrs/interfaces/gametabs/prayer.simba)
- TRSObject.WalkInteract / TRSEntity.WalkInteract (osrs/position/map/objects.simba)
- ObjectsJSON.GetByName / NPCsJSON.GetByName (osrs/position/map/mapjson.simba)
- XPBar.EarnedXP / WaitXP (osrs/interfaces/xpbar.simba)
- Chat.LeveledUp / HandleLevelUp (osrs/interfaces/chat/chatoptions.simba)
- Stats.GetLevel(ERSSkill) (osrs/interfaces/gametabs/stats.simba)
- Activity.IsFinished (osrs/overrides.simba)
- RSClient.IsLoggedIn (osrs/rsclient.simba)

-----

## VERSION HISTORY

v0.1 — WaspForge core (21 actions, loop script mode, all grabbers, AI planner, traffic lights)
v0.2 — WaspAtlas (global map coverage for quest scripts)
v0.3 — WaspQuests 2.0 sequential mode in WaspForge
v0.4 — Community release (polish, undo, docs, waspscripts.com)