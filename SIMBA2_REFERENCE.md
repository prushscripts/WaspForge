# SIMBA2_REFERENCE

This file is generated from local source inspection only.

Scan scope completed:
- `WaspGod/Simba/**/*.simba` (64 files)
- `WaspGod/WaspLib/**/*.simba` (155 files)
- Simba script API exports in `WaspGod/Simba/Source/script/imports/*.pas`

## Built-in Types
Core script-level built-ins from `Simba/Source/script/imports/simba.import_base.pas` and related imports:
- `Byte = UInt8`
- `Integer = Int32`
- `TColor = Int32`
- `TColorArray = array of TColor`
- `TPoint = record X, Y: Integer; end`
- `TPointArray = array of TPoint`
- `T2DPointArray = array of TPointArray`
- `TBox = record X1, Y1, X2, Y2: Integer; end`
- `TBoxArray = array of TBox`
- `TTriangle = record A, B, C: TPoint; end`
- `TTriangleArray = array of TTriangle`
- `TQuad = record Top, Right, Bottom, Left: TPoint; end`
- `TQuadArray = array of TQuad`
- `TSize = record Width, Height: Integer; end`
- `TByteArray = array of Byte`
- `TInt64Array = array of Int64`
- `TPointerArray = array of Pointer`
- `T2DStringArray`, `T2DIntegerArray`
- `TSingleMatrix`, `TDoubleMatrix`, `TByteMatrix`, `TIntegerMatrix`, `TBooleanMatrix`
- `TBaseClass`
- `TJSONItem`, `TJSONArray`, `TJSONObject`, `TJSONParser`
- `EJSONType = enum(UNKNOWN, INT, FLOAT, STR, BOOL, NULL, ARR, OBJ)`
- `EJSONFormatOption = enum(SINGLE_LINE_ARR, SINGLE_LINE_OBJ, NO_QUOTE_MEMBERS, USE_TABS, NO_WHITESPACE)`
- `EJSONFormatOptions = set of EJSONFormatOption`
- `SimbaEnv` record (constants): `SimbaPath`, `IncludesPath`, `PluginsPath`, `ScriptsPath`, `ScreenshotsPath`, `DataPath`, `TempPath`

## Built-in Functions
Confirmed exported signatures (selected high-use set, exact text from imports):
- `function FileRead(FileName: String): String`
- `function FileReadEx(FileName: String; Start, Stop: Integer): String`
- `function FileWrite(FileName: String; Text: String): Boolean`
- `function FileAppend(FileName: String; Text: String): Boolean`
- `function FileReadLines(FileName: String): TStringArray`
- `function FileReadBytes(FileName: String): TByteArray`
- `function FileReadBytesEx(FileName: String; Start, Stop: Integer): TByteArray`
- `function FileWriteBytes(FileName: String; Bytes: TByteArray): Boolean`
- `function FileAppendBytes(FileName: String; Bytes: TByteArray): Boolean`
- `function FileCopy(SourceFileName, DestFileName: String; OverwriteIfExists: Boolean = True): Boolean`
- `function FileRename(SourceFileName, DestFileName: String): Boolean`
- `function FileDelete(FileName: String): Boolean`
- `function FileCreate(FileName: String): Boolean`
- `function FileExists(FileName: String): Boolean`
- `function DirList(Path: String; Recursive: Boolean = False): TStringArray`
- `function DirSearch(Path: String; Mask: String; Recursive: Boolean = False): TStringArray`
- `function DirCreate(Path: String): Boolean`
- `function DirDelete(Path: String; OnlyChildren: Boolean): Boolean`
- `function DirExists(Path: String): Boolean`
- `function PathNormalize(Path: String): String`
- `function PathExtractDir(Path: String): String`
- `function PathExtractName(Path: String): String`
- `function PathJoin(Paths: TStringArray): String`
- `function PathIncludeTrailingSep(Path: String): String`
- `function PathExcludeTrailingSep(Path: String): String`
- `function GetTempFileName: String`
- `function GetTempDir: String`
- `function GetUserDir: String`
- `procedure Sleep(MilliSeconds: UInt32);`
- Math/random core from `simba.script_compiler.pas`: `Min`, `Max`, `EnsureRange`, `InRange`, `Abs`, `Sign`, `Power`, `Sqr`, `Sqrt`, `ArcTan`, `Ln`, `Sin`, `Cos`, `Exp`, `Hypot`, `Round`, `Frac`, `Int`, `Trunc`, `Ceil`, `Floor`, `Random`, `Randomize`.
- String core from `simba.script_compiler.pas`: `UpperCase`, `LowerCase`, `CompareStr`, `CompareText`, `SameText`, `Trim`, `TrimLeft`, `TrimRight`, `StringReplace`, `Pos`, `StrToInt`, `StrToFloat`, `StrToBool`, `BoolToStr`, `Format`, `FormatFloat`, `StringOfChar`.

## Path Handling
Known-correct patterns:
- Current include-file directory: `{$MACRO DIR}`
- Separator constant: `PATH_SEP`
- Script file path constant: `SCRIPT_FILE` (exported in `simba.import_misc.pas`)
- WaspLib env paths (`WaspLib/utils/env.simba`):
  - `WLEnv.ConfigsDir = SimbaEnv.SimbaPath + 'Configs' + PATH_SEP`
  - `WLEnv.CacheDir   = SimbaEnv.DataPath  + 'Cache'   + PATH_SEP`
  - `WLEnv.AssetsDir  = SimbaEnv.DataPath  + 'Assets'  + PATH_SEP`
  - `WLEnv.LogsDir    = SimbaEnv.DataPath  + 'Logs'    + PATH_SEP`
- WaspLib example of relative path by macro (`WaspLib/tools/run_tests.simba`):
  - `path := {$MACRO DIR} + '..' + PATH_SEP + 'tests' + PATH_SEP;`

## File I/O
Exact signatures (from `simba.import_file.pas`):
- `function FileRead(FileName: String): String`
- `function FileWrite(FileName: String; Text: String): Boolean`
- `function FileExists(FileName: String): Boolean`
- `function DirCreate(Path: String): Boolean`
- `function DirExists(Path: String): Boolean`

Additional exact signatures frequently used in this repo:
- `function FileReadLines(FileName: String): TStringArray`
- `function FileReadBytes(FileName: String): TByteArray`
- `function FileWriteBytes(FileName: String; Bytes: TByteArray): Boolean`

## JSON
Exact usage pattern from Simba tests and WaspLib:
- Parse string:
  - `parser := new TJSONParser;`
  - `parser.Parse('{...}');`
- Load file:
  - `parser := new TJSONParser();`
  - `parser.Load(path);`
- Validate:
  - `if parser.Typ <> EJSONType.ARR then Exit;`
  - `if item.Typ <> EJSONType.OBJ then Continue;`
- Access:
  - `parser.Item[i]`
  - `parser.Item['key']`
  - `parser.Key[i]`
  - `.AsString`, `.AsInt`, `.AsFloat`, `.AsBool`
  - `Has`, `GetString`, `GetInt`, `GetFloat`, `GetBool`, `GetArray`, `GetObject`
- Build:
  - `obj := new TJSONObject();`
  - `arr := new TJSONArray();`
  - `obj.AddString(...)`, `AddInt(...)`, `AddFloat(...)`, `AddBool(...)`, `AddArray(...)`, `AddObject(...)`
- Write/format:
  - `json.Format([EJSONFormatOption.SINGLE_LINE_OBJ, EJSONFormatOption.NO_WHITESPACE])`

## What Does NOT Exist in Simba 2.0
Checked against script exports in `Simba/Source/script/imports`:
- `ScriptPath` (not exported)
- `ExpandFileName` (not exported to scripts)
- `ExtractFilePath` (not exported to scripts)
- `FindFirst` / `FindNext` / `FindClose` (not exported to scripts)
- `FindColorTolerance` (not exported; color search is via `Target.FindColor(...)`, `TColorFinder`, etc.)

Use these instead:
- path ops: `PathNormalize`, `PathExtractDir`, `PathJoin`, etc.
- current context: `{$MACRO DIR}` and/or `SCRIPT_FILE`

## Record Methods
Supported syntax in Simba 2.0:
- `procedure TMyRecord.Setup();`
- `function TMyRecord.Build(value: String): String;`
- `property TMyRecord.Name: String;`

Examples in WaspLib:
- `procedure TLLMClient.Setup();`
- `function TLLMClient.Chat(user, message: String): String;`
- `property TLLMClient.APIKey: String;`

## Enum Syntax
Correct Simba 2.0 style used in this codebase:
- `type EFoo = enum(A, B, C);`

Examples:
- `ELLMService = enum(LOCAL, DEEPSEEK, OPENAI, OLLAMA);`
- `EJSONType = enum(UNKNOWN, INT, FLOAT, STR, BOOL, NULL, ARR, OBJ);`
