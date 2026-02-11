# MoonLang VSCode Extension 开发指南

## 目录结构

```
moonscript-vscode/
├── package.json                    # 扩展配置清单
├── extension.js                    # 扩展主入口 (智能感知/格式化/悬停提示)
├── language-configuration.json     # 语言配置 (括号/注释/折叠)
├── syntaxes/
│   └── moonlang.tmLanguage.json   # TextMate 语法高亮规则
├── snippets/
│   └── moonlang.json              # 代码片段
├── icons/
│   └── moonlang-file-icon-theme.json  # 文件图标主题
├── images/
│   ├── moonlang-icon.png          # 扩展图标 (PNG)
│   └── moonlang-icon.svg          # 扩展图标 (SVG)
├── install.bat                    # VSCode 安装脚本
├── install_cursor.bat             # Cursor 安装脚本
├── install.ps1                    # PowerShell 安装脚本
└── README.md                      # 扩展说明
```

---

## 文件详解

### 1. package.json - 扩展清单

核心配置文件，定义扩展的元数据和贡献点。

```json
{
    "name": "moonlang",           // 扩展 ID
    "displayName": "MoonLang",    // 显示名称
    "version": "1.8.0",           // 版本号
    "main": "./extension.js",     // 入口文件
    "engines": {
        "vscode": "^1.50.0"       // 最低 VSCode 版本
    },
    "activationEvents": [
        "onLanguage:moonlang"     // 打开 .moon 文件时激活
    ],
    "contributes": {
        "languages": [...],       // 语言定义
        "grammars": [...],        // 语法高亮
        "snippets": [...],        // 代码片段
        "iconThemes": [...]       // 图标主题
    }
}
```

**关键配置说明：**
- `engines.vscode`: 指定兼容的 VSCode 最低版本
- `activationEvents`: 扩展激活时机，`onLanguage:moonlang` 表示打开 MoonLang 文件时激活
- `contributes.languages`: 注册 `.moon` 和 `.mn` 文件扩展名
- `contributes.grammars`: 关联语法高亮文件

---

### 2. extension.js - 扩展主逻辑

提供智能感知功能，包含以下组件：

#### 2.1 数据定义
```javascript
// 关键字列表
const keywords = ['function', 'end', 'class', 'if', 'for', ...];

// 内置函数定义 (名称/签名/描述)
const builtinFunctions = [
    { name: 'print', signature: 'print(value, ...)', desc: '打印输出' },
    { name: 'len', signature: 'len(collection)', desc: '获取长度' },
    // ...
];

// GUI/网络/HAL 类和函数
const guiItems = [...];
const networkItems = [...];
const halItems = [...];
```

#### 2.2 补全提供器 (CompletionProvider)
```javascript
vscode.languages.registerCompletionItemProvider('moonlang', {
    provideCompletionItems(document, position) {
        // 返回关键字、函数、代码片段等补全项
    }
}, '.', '(');  // 触发字符
```
- 提供关键字补全
- 提供内置函数补全 (带签名和文档)
- 提供代码片段补全

#### 2.3 格式化提供器 (FormattingProvider)
```javascript
vscode.languages.registerDocumentFormattingEditProvider('moonlang', {
    provideDocumentFormattingEdits(document) {
        return formatMoonLang(document.getText());
    }
});
```
- 自动缩进
- 处理 `function`, `if`, `for` 等增加缩进
- 处理 `end`, `else`, `elif` 等减少缩进

#### 2.4 悬停提供器 (HoverProvider)
```javascript
vscode.languages.registerHoverProvider('moonlang', {
    provideHover(document, position) {
        // 鼠标悬停时显示函数签名和文档
    }
});
```

#### 2.5 符号提供器 (DocumentSymbolProvider)
```javascript
vscode.languages.registerDocumentSymbolProvider('moonlang', {
    provideDocumentSymbols(document) {
        // 提供大纲视图 (函数和类定义)
    }
});
```

---

### 3. language-configuration.json - 语言配置

定义编辑器行为：

```json
{
    "comments": {
        "lineComment": "#",           // 行注释
        "blockComment": ["#[[", "]]"] // 块注释
    },
    "brackets": [...],                // 括号配对
    "autoClosingPairs": [...],        // 自动闭合
    "folding": {
        "markers": {
            "start": "function|class|if...",  // 折叠开始
            "end": "end"                       // 折叠结束
        }
    },
    "indentationRules": {
        "increaseIndentPattern": "...",  // 增加缩进的模式
        "decreaseIndentPattern": "..."   // 减少缩进的模式
    }
}
```

---

### 4. syntaxes/moonlang.tmLanguage.json - 语法高亮

TextMate 语法定义，使用正则表达式匹配并着色：

```json
{
    "scopeName": "source.moonlang",
    "patterns": [
        { "include": "#comments" },     // 注释
        { "include": "#strings" },      // 字符串
        { "include": "#numbers" },      // 数字
        { "include": "#keywords" },     // 关键字
        { "include": "#builtins" },     // 内置函数
        // ...
    ],
    "repository": {
        "comments": {
            "patterns": [
                { "name": "comment.line...", "match": "#.*$" }
            ]
        },
        // ...
    }
}
```

**主要作用域名称：**
| 作用域 | 用途 |
|--------|------|
| `keyword.control.*` | 控制流关键字 (if/for/while) |
| `keyword.declaration.*` | 声明关键字 (function/class) |
| `constant.numeric.*` | 数字 |
| `string.quoted.*` | 字符串 |
| `comment.*` | 注释 |
| `entity.name.function` | 函数名 |
| `entity.name.class` | 类名 |
| `support.function.builtin.*` | 内置函数 |
| `variable.parameter` | 参数 |

---

### 4.1 语法高亮配色原理

#### 配色工作流程

```
┌─────────────────────────────────────────────────────────────────┐
│  moonlang.tmLanguage.json                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 正则表达式匹配代码 → 分配作用域名称 (scope name)         │   │
│  │ 例: "\\bfunction\\b" → "keyword.declaration.function"    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  VSCode 主题 (如 Dark+, One Dark Pro)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 作用域名称 → 颜色                                        │   │
│  │ 例: "keyword.*" → #C586C0 (紫色)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  最终效果: function 关键字显示为紫色                            │
└─────────────────────────────────────────────────────────────────┘
```

**关键点：语法文件只定义作用域名称，不定义颜色。颜色由 VSCode 主题决定。**

#### TextMate 作用域命名规范

作用域名称遵循层级结构，用点号分隔。VSCode 主题从左到右匹配：

```
keyword.control.conditional.moonlang
   │       │         │         │
   │       │         │         └── 语言标识 (可选)
   │       │         └── 具体类型
   │       └── 子类型
   └── 顶级类型
```

**常用顶级作用域：**

| 顶级作用域 | 用途 | 典型颜色 |
|-----------|------|---------|
| `comment` | 注释 | 灰色/绿色 |
| `constant` | 常量 (数字/布尔/null) | 橙色/蓝色 |
| `entity` | 实体 (函数名/类名/标签) | 黄色/蓝色 |
| `invalid` | 无效/废弃代码 | 红色背景 |
| `keyword` | 关键字 | 紫色/粉色 |
| `markup` | 标记语言 (Markdown) | 各种 |
| `meta` | 元信息 (不直接着色) | 透明 |
| `punctuation` | 标点符号 | 白色/灰色 |
| `storage` | 存储类型 (var/let/const) | 蓝色 |
| `string` | 字符串 | 绿色/橙色 |
| `support` | 内置/库函数 | 青色/蓝色 |
| `variable` | 变量 | 浅蓝/白色 |

#### MoonLang 完整作用域列表

```json
// moonlang.tmLanguage.json 中定义的所有作用域

// 注释
comment.line.number-sign.moonlang        // # 行注释
comment.block.moonlang                   // #[[ 块注释 ]]

// 字符串
string.quoted.double.moonlang            // "双引号字符串"
string.quoted.single.moonlang            // '单引号字符串'
string.quoted.triple.moonlang            // """多行字符串"""
string.interpolated.moonlang             // 字符串插值 {expr}
constant.character.escape.moonlang       // 转义字符 \n \t

// 数字
constant.numeric.integer.moonlang        // 123
constant.numeric.float.moonlang          // 3.14
constant.numeric.hex.moonlang            // 0xFF
constant.numeric.binary.moonlang         // 0b1010
constant.numeric.octal.moonlang          // 0o777

// 布尔/空值
constant.language.boolean.true.moonlang  // true
constant.language.boolean.false.moonlang // false
constant.language.null.moonlang          // null, nil, none

// 关键字
keyword.control.conditional.moonlang     // if, elif, else, switch, case, default
keyword.control.loop.moonlang            // for, while, in, to, break, continue
keyword.control.flow.moonlang            // return, throw, yield
keyword.control.trycatch.moonlang        // try, catch, finally
keyword.control.block.moonlang           // end
keyword.control.import.moonlang          // import, from, as, export
keyword.declaration.function.moonlang    // function
keyword.declaration.class.moonlang       // class
keyword.other.new.moonlang               // new
keyword.other.extends.moonlang           // extends
keyword.other.async.moonlang             // async, await, chan, send, recv
keyword.operator.logical.moonlang        // and, or, not

// 操作符
keyword.operator.comparison.moonlang     // ==, !=, <, >, <=, >=
keyword.operator.arithmetic.moonlang     // +, -, *, /, %, **
keyword.operator.assignment.moonlang     // =
keyword.operator.assignment.compound.moonlang  // +=, -=, *=, /=
keyword.operator.bitwise.moonlang        // &, |, ^, ~, <<, >>

// 实体名称
entity.name.function.moonlang            // 函数名
entity.name.class.moonlang               // 类名
entity.other.inherited-class.moonlang    // 父类名

// 内置函数 (按类别)
support.function.builtin.io.moonlang     // print, input, file_read...
support.function.builtin.type.moonlang   // type, str, int, float...
support.function.builtin.collection.moonlang  // len, append, pop...
support.function.builtin.string.moonlang // replace, upper, trim...
support.function.builtin.math.moonlang   // abs, min, max, sqrt...
support.function.builtin.time.moonlang   // time, sleep, now...
support.function.builtin.json.moonlang   // json_encode, json_decode
support.function.builtin.regex.moonlang  // regex_match, regex_replace
support.function.builtin.system.moonlang // getenv, exec, exit...

// GUI/网络/HAL
support.class.gui.moonlang               // Window, Tray
support.function.gui.moonlang            // gui_init, gui_run...
support.class.network.moonlang           // HttpServer, TcpClient
support.function.network.moonlang        // http_get, tcp_connect...
support.class.hal.moonlang               // GPIO, PWM, I2C, SPI...
support.function.hal.moonlang            // gpio_read, gpio_write...
support.constant.hal.moonlang            // INPUT, OUTPUT, HIGH, LOW

// 变量
variable.language.this.moonlang          // self
variable.language.super.moonlang         // super
variable.parameter.moonlang              // 函数参数
variable.other.moonlang                  // 普通变量

// 标点
punctuation.definition.parameters.begin.moonlang  // (
punctuation.definition.parameters.end.moonlang    // )
punctuation.separator.parameter.moonlang          // ,
punctuation.accessor.moonlang                     // .
```

#### 自定义配色方法

**方法 1: 在 settings.json 中覆盖特定作用域**

```json
{
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "scope": "keyword.declaration.function.moonlang",
                "settings": {
                    "foreground": "#FF79C6",
                    "fontStyle": "bold"
                }
            },
            {
                "scope": "support.function.builtin.moonlang",
                "settings": {
                    "foreground": "#8BE9FD"
                }
            },
            {
                "scope": "entity.name.class.moonlang",
                "settings": {
                    "foreground": "#50FA7B",
                    "fontStyle": "bold underline"
                }
            }
        ]
    }
}
```

**方法 2: 只对 MoonLang 文件生效**

```json
{
    "[moonlang]": {
        "editor.tokenColorCustomizations": {
            "textMateRules": [
                {
                    "scope": "keyword",
                    "settings": { "foreground": "#C586C0" }
                }
            ]
        }
    }
}
```

**方法 3: 创建自定义主题**

在 `package.json` 中注册主题：
```json
{
    "contributes": {
        "themes": [
            {
                "label": "MoonLang Dark",
                "uiTheme": "vs-dark",
                "path": "./themes/moonlang-dark-theme.json"
            }
        ]
    }
}
```

创建 `themes/moonlang-dark-theme.json`：
```json
{
    "name": "MoonLang Dark",
    "type": "dark",
    "colors": {
        "editor.background": "#1E1E1E"
    },
    "tokenColors": [
        {
            "scope": ["keyword"],
            "settings": { "foreground": "#C586C0" }
        },
        {
            "scope": ["string"],
            "settings": { "foreground": "#CE9178" }
        },
        {
            "scope": ["comment"],
            "settings": { "foreground": "#6A9955", "fontStyle": "italic" }
        },
        {
            "scope": ["constant.numeric"],
            "settings": { "foreground": "#B5CEA8" }
        },
        {
            "scope": ["entity.name.function"],
            "settings": { "foreground": "#DCDCAA" }
        },
        {
            "scope": ["entity.name.class"],
            "settings": { "foreground": "#4EC9B0" }
        },
        {
            "scope": ["support.function.builtin"],
            "settings": { "foreground": "#4FC1FF" }
        }
    ]
}
```

#### 配色调试技巧

1. **查看当前 Token 的作用域**
   - `Ctrl+Shift+P` → "Developer: Inspect Editor Tokens and Scopes"
   - 点击代码中的任意位置
   - 查看 "textmate scopes" 列表

2. **实时预览配色修改**
   - 修改 settings.json 中的 `tokenColorCustomizations`
   - 保存后立即生效，无需重启

3. **参考流行主题的配色**
   - One Dark Pro: `~/.vscode/extensions/zhuangtongfa.material-theme-*/themes/`
   - Dracula: 紫色关键字，绿色字符串，橙色数字
   - Monokai: 粉色关键字，黄色函数名

---

### 5. snippets/moonlang.json - 代码片段

定义快捷代码模板：

```json
{
    "Function": {
        "prefix": ["fn", "function"],  // 触发前缀
        "body": [
            "function ${1:name}(${2:params}):",
            "\t${3:# code}",
            "end"
        ],
        "description": "Define a function"
    }
}
```

**占位符语法：**
- `${1:name}`: 第 1 个占位符，默认值 "name"
- `${2:params}`: 第 2 个占位符
- `$0`: 最终光标位置
- `\t`: Tab 缩进

---

## 开发流程

### 1. 环境准备

```bash
# 安装 Node.js (推荐 v16+)
node --version

# 安装 vsce (VSCode Extension Manager)
npm install -g @vscode/vsce
```

### 2. 调试扩展

1. 在 VSCode 中打开 `moonscript-vscode` 文件夹
2. 按 `F5` 启动调试
3. 新窗口中打开 `.moon` 文件测试

### 3. 修改后测试

```bash
# 方式1: 按 F5 重新启动调试
# 方式2: 在调试窗口按 Ctrl+Shift+P -> "Developer: Reload Window"
```

---

## 打包 VSIX

### 方式 1: 使用 vsce 命令行

```bash
# 进入扩展目录
cd moonscript-vscode

# 打包 (生成 moonlang-x.x.x.vsix)
vsce package

# 指定版本打包
vsce package --no-git-tag-version
```

### 方式 2: 使用 npm 脚本

在 `package.json` 中添加：
```json
{
    "scripts": {
        "package": "vsce package"
    }
}
```

然后运行：
```bash
npm run package
```

### 打包输出

成功后生成 `moonlang-1.8.0.vsix` (版本号来自 package.json)

---

## 安装 VSIX

### VSCode

```bash
# 命令行安装
code --install-extension moonlang-1.8.0.vsix

# 或在 VSCode 中:
# 1. Ctrl+Shift+P -> "Extensions: Install from VSIX..."
# 2. 选择 .vsix 文件
```

### Cursor

```bash
# Windows (使用 install_cursor.bat)
install_cursor.bat

# 或手动复制到 Cursor 扩展目录
# Windows: %USERPROFILE%\.cursor\extensions\
# macOS: ~/.cursor/extensions/
# Linux: ~/.cursor/extensions/
```

---

## 版本发布

### 1. 更新版本号

修改 `package.json`:
```json
{
    "version": "1.9.0"
}
```

### 2. 更新 CHANGELOG (可选)

在 README.md 或单独的 CHANGELOG.md 中记录变更。

### 3. 打包发布

```bash
vsce package
```

### 4. 发布到 Marketplace (可选)

```bash
# 需要先获取 Personal Access Token
vsce publish
```

---

## 常见开发任务

### 添加新的内置函数

1. **extension.js** - 添加到 `builtinFunctions` 数组:
```javascript
{ name: 'new_func', signature: 'new_func(arg)', desc: '函数描述' },
```

2. **syntaxes/moonlang.tmLanguage.json** - 添加到 `builtins` 匹配规则:
```json
"match": "\\b(existing|new_func)(?=\\s*\\()"
```

### 添加新的关键字

1. **extension.js** - 添加到 `keywords` 数组
2. **syntaxes/moonlang.tmLanguage.json** - 添加到相应 `keywords` 模式

### 添加新的代码片段

在 **snippets/moonlang.json** 中添加:
```json
{
    "My Snippet": {
        "prefix": "mysnip",
        "body": ["line1", "line2"],
        "description": "描述"
    }
}
```

### 修改语法高亮颜色

颜色由 VSCode 主题控制，语法文件只定义作用域名称。
要测试不同作用域的效果，可以在 settings.json 中添加:
```json
{
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "scope": "support.function.builtin.moonlang",
                "settings": { "foreground": "#FF0000" }
            }
        ]
    }
}
```

---

## 调试技巧

### 查看 Token 作用域

1. 打开 `.moon` 文件
2. `Ctrl+Shift+P` -> "Developer: Inspect Editor Tokens and Scopes"
3. 点击任意代码查看其作用域

### 查看扩展日志

1. `Ctrl+Shift+P` -> "Developer: Toggle Developer Tools"
2. 切换到 Console 标签
3. 查看 `console.log` 输出

---

## 参考资源

- [VSCode Extension API](https://code.visualstudio.com/api)
- [TextMate Grammar](https://macromates.com/manual/en/language_grammars)
- [vsce Documentation](https://github.com/microsoft/vscode-vsce)
- [Snippet Guide](https://code.visualstudio.com/docs/editor/userdefinedsnippets)
