<h2 align="center">MoonLang VSCode Extension</h2>

<p align="center">MoonLang 语言支持扩展，提供语法高亮、智能补全、代码格式化、保存时自动格式化等功能。</p>

<p align="center">
  <img src="https://img.shields.io/visual-studio-marketplace/d/moonlang-vsc?style=flat-square&color=red" alt="Downloads">
  <img src="https://img.shields.io/github/package-json/v/zpfz/moonlang-vsc?style=flat-square" alt="Version">
  <img src="https://img.shields.io/github/license/zpfz/moonlang-vsc?style=flat-square" alt="License">
</p>

## 更新日志

## v1.9.1
-[新增] VSCode 侧边栏（资源管理器）、编辑器标题栏快捷命令行：生成exe文件、运行 MoonLang 文件。


## 功能特性

### 语法高亮

- **关键字**: `function`, `class`, `if`, `else`, `for`, `while`, `return`, `end` 等
- **双语法风格**: 支持 `: end` 和 `{ }` 两种代码块风格
- **运算符**: 支持 `**` 幂运算、`&|^~<<>>` 位运算、`+= -= *= /= %=` 复合赋值
- **Lambda 表达式**: `(x) => x * 2` 箭头函数语法
- **闭包**: 完整支持外部变量捕获
- **类与继承**: `class`, `extends`, `super`, `self`
- **内置函数**: `print`, `map`, `filter`, `reduce` 等
- **GUI 函数**: `Window`, `gui_*` 系列函数
- **嵌入式 HAL**: `GPIO`, `PWM`, `I2C`, `SPI` 等
- **网络函数**: `HttpServer`, `TcpClient` 等

### 智能补全 (IntelliSense)

- **关键字补全**: 输入时自动提示关键字
- **内置函数补全**: 显示函数签名和说明
- **GUI/网络/HAL 类补全**: 支持所有内置类
- **代码片段**: 快速插入常用代码模式
- **悬停提示**: 鼠标悬停显示函数文档

### 代码格式化

- **自动缩进**: 根据代码块自动调整缩进
- **双风格支持**: 同时支持 `: end` 和 `{ }` 风格
- **保存时自动格式化**: 可在设置中开启/关闭 (`moonlang.formatOnSave`)
- **手动格式化**: `Shift+Alt+F` 或右键菜单选择 "Format Document"

### 设置选项

| 设置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `moonlang.formatOnSave` | boolean | `true` | 保存时自动格式化 |
| `moonlang.tabSize` | number | `4` | 缩进空格数 |
| `moonlang.insertSpaces` | boolean | `true` | 使用空格缩进 (false 使用 Tab) |

### 大纲视图

- 在资源管理器中显示函数和类定义
- 快速跳转到代码位置

### 代码片段

**传统风格 (`: end`)**

| 前缀 | 描述 |
|------|------|
| `fn` / `function` | 函数定义 |
| `class` | 类定义 |
| `classext` | 带继承的类 |
| `if` | if 语句 |
| `ife` | if-else 语句 |
| `ifee` | if-elif-else 语句 |
| `for` | for 循环 |
| `forr` | for range 循环 |
| `while` | while 循环 |
| `try` | try-catch 块 |

**大括号风格 (`{ }`)**

| 前缀 | 描述 |
|------|------|
| `fnb` / `functionb` | 函数定义 |
| `classb` | 类定义 |
| `classextb` | 带继承的类 |
| `ifb` | if 语句 |
| `ifeb` | if-else 语句 |
| `ifeeb` | if-elif-else 语句 |
| `forb` | for 循环 |
| `forrb` | for range 循环 |
| `whileb` | while 循环 |
| `tryb` | try-catch 块 |

**通用**

| 前缀 | 描述 |
|------|------|
| `lambda` / `=>` | Lambda 表达式 |
| `map` | map 函数 |
| `filter` | filter 函数 |
| `reduce` | reduce 函数 |
| `closure` | 闭包工厂模式 |
| `guiwin` | GUI 窗口 |
| `httpserver` | HTTP 服务器 |

## 安装方法

### 方法 1: VSIX 安装

1. 下载 `moonlang-1.9.0.vsix`
2. 打开 VSCode/Cursor
3. 按 `Ctrl+Shift+P` 打开命令面板
4. 输入 `Extensions: Install from VSIX...`
5. 选择下载的 `.vsix` 文件

### 方法 2: 命令行安装

```bash
# VSCode
code --install-extension moonlang-1.9.0.vsix

# Cursor
cursor --install-extension moonlang-1.9.0.vsix
```


## 使用技巧

### 触发补全

- 输入时自动显示补全列表
- 按 `Ctrl+Space` 手动触发补全
- 输入 `.` 或 `(` 触发成员/参数补全

### 格式化代码

```bash
# 快捷键
Shift+Alt+F

# 或在命令面板中
Format Document
```

### 查看函数文档

将鼠标悬停在函数名上，会显示函数签名和说明。

## 示例代码

**传统风格 (`: end`)**

```moon
# Hello World
print("Hello, MoonLang!")

# 类定义
class Calculator:
    function init(value):
        self.value = value
    end
    
    function add(n):
        self.value = self.value + n
        return self
    end
end

# Lambda 和闭包
multiplier = 3
result = map((x) => x * multiplier, [1, 2, 3, 4, 5])
print(result)  # [3, 6, 9, 12, 15]
```

**大括号风格 (`{ }`)**

```moon
# 类定义
class Calculator {
    function init(value) {
        self.value = value
    }
    
    function add(n) {
        self.value = self.value + n
        return self
    }
}

# 新运算符
x = 2 ** 10        # 幂运算: 1024
y = 0xFF & 0x0F    # 位与: 15
z = 5 << 2         # 左移: 20

# 复合赋值
count = 0
count += 1
count *= 2
```

## 更新日志

### v1.9.0 (2026-01-30)
- **新增保存时自动格式化** (`moonlang.formatOnSave` 设置)
- **新增大括号语法支持** (`{ }` 代码块风格)
- 新增大括号风格代码片段 (`fnb`, `ifb`, `forb`, `whileb`, `tryb` 等)
- 新增扩展运算符高亮 (`**` 幂运算、`&|^~<<>>` 位运算、`+=` 等复合赋值)
- 格式化器支持双语法风格
- 新增设置选项 (`tabSize`, `insertSpaces`)
- 更新折叠和缩进规则支持 `{ }`

### v1.8.0 (2026-01-25)
- 新增智能补全 (IntelliSense)
- 新增代码格式化
- 新增悬停文档提示
- 新增大纲视图支持
- 内置函数显示签名和说明

### v1.1.0 (2026-01-25)
- 增强语法高亮，添加更多颜色区分
- 添加 Lambda 表达式 (`=>`) 高亮
- 添加闭包支持相关高亮
- 添加 HAL/嵌入式函数高亮
- 添加网络函数高亮
- 新增代码片段

### v1.0.0
- 初始版本
- 基础语法高亮

## 相关链接

- [MoonLang 官网](https://moon-lang.com)
- [文档](https://moon-lang.com/docs)

## 许可证

MIT License
