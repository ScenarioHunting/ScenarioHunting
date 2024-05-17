const fileTypes = {
  css: 'css',
  js: 'javascript',
  json: 'json',
  md: 'markdown',
  mjs: 'javascript',
  ts: 'typescript',
  cs: 'csharp',
  abap: 'abap',
  aes: 'aes',//?
  cls: 'apex',
  // : 'azcli',//?
  bat: 'bat',
  c: 'c',
  // : 'cameligo',
  clj: 'clojure',
  boot: 'clojure',
  cl2: 'clojure',
  cljc: 'clojure',
  'cljs.hl': 'clojure',
  cljs: 'clojure',
  cljscm: 'clojure',
  cljx: 'clojure',
  hic: 'clojure',
  coffee: 'coffeescript',
  _coffee: 'coffeescript',
  cake: 'coffeescript',
  cjsx: 'coffeescript',
  cson: 'coffeescript',
  iced: 'coffeescript',
  'cpp': 'cpp',
  'c++': 'cpp',
  'cc': 'cpp',
  'cp': 'cpp',
  'cxx': 'cpp',
  'h': 'cpp',
  'h++': 'cpp',
  'hh': 'cpp',
  'hpp': 'cpp',
  'hxx': 'cpp',
  'inc': 'cpp',
  'inl': 'cpp',
  'ipp': 'cpp',
  'tcc': 'cpp',
  'tpp': 'cpp',
  // "": 'csp',
  dart: 'dart',
  dockerfile: 'dockerfile',
  ecl: 'ecl',
  eclxml: 'ecl',
  fs: 'fsharp',
  go: 'go',
  graphql: 'graphql',
  hbs: 'handlebars',
  hcl: 'hcl',
  tf: 'hcl',
  html: 'html',
  htm: 'html',
  ini: 'ini',
  java: 'java',
  _js: 'javascript',
  bones: 'javascript',
  es: 'javascript',
  es6: 'javascript',
  frag: 'javascript',
  gs: 'javascript',
  jake: 'javascript',
  jsb: 'javascript',
  jscad: 'javascript',
  jsfl: 'javascript',
  jsm: 'javascript',
  jss: 'javascript',
  njs: 'javascript',
  pac: 'javascript',
  sjs: 'javascript',
  ssjs: 'javascript',
  'sublime-build': 'javascript',
  'sublime-commands': 'javascript',
  'sublime-completions': 'javascript',
  'sublime-keymap': 'javascript',
  'sublime-macro': 'javascript',
  'sublime-menu': 'javascript',
  'sublime-mousemap': 'javascript',
  'sublime-project': 'javascript',
  'sublime-settings': 'javascript',
  'sublime-theme': 'javascript',
  'sublime-workspace': 'javascript',
  'sublime_metrics': 'javascript',
  'sublime_session': 'javascript',
  xsjs: 'javascript',
  xsjslib: 'javascript',
  jl: 'julia',
  kt: 'kotlin',
  ktm: 'kotlin',
  kts: 'kotlin',
  less: 'less',
  // : 'lexon',
  lua: 'lua',
  fcgi: 'lua',
  nse: 'lua',
  pd_lua: 'lua',
  rbxs: 'lua',
  wlua: 'lua',
  // : 'm3',
  markdown: 'markdown',
  mkd: 'markdown',
  mkdn: 'markdown',
  mkdown: 'markdown',
  ron: 'markdown',
  // : 'mips',
  // : 'msdax',
  // sql: 'mysql',
  pas: 'pascal',
  dfm: 'pascal',
  dpr: 'pascal',
  lpr: 'pascal',
  pp: 'pascal',
  // : 'pascaligo',
  pl: 'perl',
  al: 'perl',
  cgi: 'perl',
  perl: 'perl',
  ph: 'perl',
  plx: 'perl',
  pm: 'perl',
  pod: 'perl',
  psgi: 'perl',
  t: 'perl',
  // : 'pgsql',
  php: 'php',
  txt: 'plaintext',
  // : 'postiats',
  // : 'powerquery',
  ps1: 'powershell',
  psd1: 'powershell',
  psm: 'powershell',
  // : 'pug',
  py: 'python',
  bzl: 'python',
  gyp: 'python',
  lmi: 'python',
  pyde: 'python',
  pyp: 'python',
  pyt: 'python',
  pyw: 'python',
  rpy: 'python',
  tac: 'python',
  wsgi: 'python',
  xpy: 'python',
  r: 'r',
  rd: 'r',
  rsx: 'r',
  // razor: 'razor',
  // : 'redis',
  // : 'redshift',
  rst: 'restructuredtext',
  rest: 'restructuredtext',
  'rest.txt': 'restructuredtext',
  'rst.txt': 'restructuredtext',
  rb: 'ruby',
  builder: 'ruby',
  gemspec: 'ruby',
  god: 'ruby',
  irbrc: 'ruby',
  jbuilder: 'ruby',
  mspec: 'ruby',
  pluginspec: 'ruby',
  podspec: 'ruby',
  rabl: 'ruby',
  rake: 'ruby',
  rbuild: 'ruby',
  rbw: 'ruby',
  rbx: 'ruby',
  ru: 'ruby',
  ruby: 'ruby',
  thor: 'ruby',
  watchr: 'ruby',
  rs: 'rust',
  'rs.in': 'rust',
  // : 'sb',
  sbt: 'scala',
  sc: 'scala',
  scm: 'scheme',
  sld: 'scheme',
  sls: 'scheme',
  sps: 'scheme',
  ss: 'scheme',
  scss: 'scss',
  sh: 'shell',
  bash: 'shell',
  bats: 'shell',
  command: 'shell',
  ksh: 'shell',
  shin: 'shell',
  tmux: 'shell',
  tool: 'shell',
  zsh: 'shell',
  // : 'sol',
  sql: 'sql',
  cql: 'sql',
  ddl: 'sql',
  prc: 'sql',
  tab: 'sql',
  udf: 'sql',
  viw: 'sql',
  // : 'st',
  swift: 'swift',
  sv: 'systemverilog',
  svh: 'systemverilog',
  vh: 'systemverilog',
  tcl: 'tcl',
  adp: 'tcl',
  tm: 'tcl',
  twig: 'twig',
  tsx: 'typescript',
  vb: 'vb',
  bas: 'vb',
  frm: 'vb',
  frx: 'vb',
  vba: 'vb',
  vbhtml: 'vb',
  vbs: 'vb',
  v: 'verilog',
  veo: 'verilog',
  xml: 'xml',
  ant: 'xml',
  axml: 'xml',
  ccxml: 'xml',
  clixml: 'xml',
  cproject: 'xml',
  csl: 'xml',
  csproj: 'xml',
  ct: 'xml',
  dita: 'xml',
  ditamap: 'xml',
  ditaval: 'xml',
  'dll.config': 'xml',
  dotsettings: 'xml',
  filters: 'xml',
  fsproj: 'xml',
  fxml: 'xml',
  glade: 'xml',
  gml: 'xml',
  grxml: 'xml',
  iml: 'xml',
  ivy: 'xml',
  jelly: 'xml',
  jsproj: 'xml',
  kml: 'xml',
  launch: 'xml',
  mdpolicy: 'xml',
  mm: 'xml',
  mod: 'xml',
  mxml: 'xml',
  nproj: 'xml',
  nuspec: 'xml',
  odd: 'xml',
  osm: 'xml',
  plist: 'xml',
  props: 'xml',
  ps1xml: 'xml',
  psc1: 'xml',
  pt: 'xml',
  rdf: 'xml',
  rss: 'xml',
  scxml: 'xml',
  srdf: 'xml',
  storyboard: 'xml',
  stTheme: 'xml',
  'sublime-snippet': 'xml',
  targets: 'xml',
  tmCommand: 'xml',
  tml: 'xml',
  tmLanguage: 'xml',
  tmPreferences: 'xml',
  tmSnippet: 'xml',
  tmTheme: 'xml',
  // ts: 'xml',
  // tsx: 'xml',
  ui: 'xml',
  urdf: 'xml',
  ux: 'xml',
  vbproj: 'xml',
  vcxproj: 'xml',
  vssettings: 'xml',
  vxml: 'xml',
  wsdl: 'xml',
  wsf: 'xml',
  wxi: 'xml',
  wxl: 'xml',
  wxs: 'xml',
  x3d: 'xml',
  xacro: 'xml',
  xaml: 'xml',
  xib: 'xml',
  xlf: 'xml',
  xliff: 'xml',
  xmi: 'xml',
  'xml.dist': 'xml',
  xproj: 'xml',
  xsd: 'xml',
  xul: 'xml',
  zcml: 'xml',
  yml: 'yaml',
  reek: 'yaml',
  rviz: 'yaml',
  sublimesyntax: 'yaml',
  syntax: 'yaml',
  yaml: 'yaml',
  'yaml-tmlanguage': 'yaml',
};

export function getLanguageForExtension(extension) {
  
  let language = fileTypes[extension];
  if (!language) {
    language = 'handlebars';
  }
  return language;
}