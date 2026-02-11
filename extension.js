const vscode = require('vscode');

// MoonLang 关键字
const keywords = [
    'function', 'end', 'class', 'extends', 'new', 'self', 'super',
    'if', 'elif', 'else', 'for', 'in', 'while', 'break', 'continue', 'return',
    'try', 'catch', 'finally', 'throw',
    'import', 'from', 'as', 'export',
    'and', 'or', 'not',
    'true', 'false', 'null', 'nil',
    'switch', 'case', 'default',
    'chan', 'send', 'recv', 'async', 'await'
];

// 内置函数
const builtinFunctions = [
    // IO
    { name: 'print', signature: 'print(value, ...)', desc: '打印输出' },
    { name: 'println', signature: 'println(value, ...)', desc: '打印输出并换行' },
    { name: 'input', signature: 'input(prompt?)', desc: '读取用户输入' },
    
    // 类型
    { name: 'type', signature: 'type(value)', desc: '获取值的类型' },
    { name: 'typeof', signature: 'typeof(value)', desc: '获取值的类型字符串' },
    { name: 'str', signature: 'str(value)', desc: '转换为字符串' },
    { name: 'int', signature: 'int(value)', desc: '转换为整数' },
    { name: 'float', signature: 'float(value)', desc: '转换为浮点数' },
    { name: 'bool', signature: 'bool(value)', desc: '转换为布尔值' },
    { name: 'list', signature: 'list(iterable?)', desc: '创建列表' },
    { name: 'dict', signature: 'dict()', desc: '创建字典' },
    
    // 集合操作
    { name: 'len', signature: 'len(collection)', desc: '获取长度' },
    { name: 'append', signature: 'append(list, item)', desc: '添加元素到列表末尾' },
    { name: 'pop', signature: 'pop(list)', desc: '移除并返回最后一个元素' },
    { name: 'push', signature: 'push(list, item)', desc: '添加元素到列表末尾' },
    { name: 'slice', signature: 'slice(list, start, end?)', desc: '切片' },
    { name: 'range', signature: 'range(start, end?, step?)', desc: '生成数字序列' },
    { name: 'keys', signature: 'keys(dict)', desc: '获取字典所有键' },
    { name: 'values', signature: 'values(dict)', desc: '获取字典所有值' },
    { name: 'has_key', signature: 'has_key(dict, key)', desc: '检查键是否存在' },
    { name: 'sort', signature: 'sort(list)', desc: '排序列表' },
    { name: 'reverse', signature: 'reverse(list)', desc: '反转列表' },
    { name: 'first', signature: 'first(list)', desc: '获取列表第一个元素' },
    { name: 'last', signature: 'last(list)', desc: '获取列表最后一个元素' },
    { name: 'unique', signature: 'unique(list)', desc: '去除重复元素' },
    { name: 'flatten', signature: 'flatten(list)', desc: '展平嵌套列表' },
    { name: 'zip', signature: 'zip(list1, list2)', desc: '合并两个列表为元组列表' },
    { name: 'enumerate', signature: 'enumerate(list)', desc: '返回索引和元素的元组列表' },
    { name: 'insert', signature: 'insert(list, index, item)', desc: '在指定位置插入元素' },
    { name: 'remove', signature: 'remove(list, item)', desc: '移除第一个匹配的元素' },
    { name: 'index', signature: 'index(list, item)', desc: '返回元素的索引' },
    { name: 'count', signature: 'count(list, item)', desc: '统计元素出现次数' },
    { name: 'clear', signature: 'clear(list)', desc: '清空列表' },
    { name: 'copy', signature: 'copy(list)', desc: '浅拷贝列表' },
    { name: 'extend', signature: 'extend(list1, list2)', desc: '扩展列表' },
    
    // 高阶函数
    { name: 'map', signature: 'map(fn, list)', desc: '对列表每个元素应用函数' },
    { name: 'filter', signature: 'filter(fn, list)', desc: '过滤列表' },
    { name: 'reduce', signature: 'reduce(fn, list, initial)', desc: '归约列表' },
    { name: 'each', signature: 'each(fn, list)', desc: '遍历列表' },
    { name: 'find', signature: 'find(fn, list)', desc: '查找元素' },
    { name: 'any', signature: 'any(fn, list)', desc: '是否存在满足条件的元素' },
    { name: 'all', signature: 'all(fn, list)', desc: '是否所有元素满足条件' },
    { name: 'sum', signature: 'sum(list)', desc: '求和' },
    
    // 字符串
    { name: 'split', signature: 'split(str, delimiter)', desc: '分割字符串' },
    { name: 'join', signature: 'join(list, delimiter)', desc: '连接字符串' },
    { name: 'replace', signature: 'replace(str, old, new)', desc: '替换字符串' },
    { name: 'upper', signature: 'upper(str)', desc: '转大写' },
    { name: 'lower', signature: 'lower(str)', desc: '转小写' },
    { name: 'trim', signature: 'trim(str)', desc: '去除首尾空白' },
    { name: 'starts_with', signature: 'starts_with(str, prefix)', desc: '是否以前缀开头' },
    { name: 'ends_with', signature: 'ends_with(str, suffix)', desc: '是否以后缀结尾' },
    { name: 'contains', signature: 'contains(str, substr)', desc: '是否包含子串' },
    { name: 'index_of', signature: 'index_of(str, substr)', desc: '查找子串位置' },
    { name: 'substring', signature: 'substring(str, start, length)', desc: '截取子串' },
    { name: 'pad_left', signature: 'pad_left(str, width, fillchar)', desc: '左填充' },
    { name: 'pad_right', signature: 'pad_right(str, width, fillchar)', desc: '右填充' },
    
    // 数学
    { name: 'abs', signature: 'abs(n)', desc: '绝对值' },
    { name: 'min', signature: 'min(a, b, ...)', desc: '最小值' },
    { name: 'max', signature: 'max(a, b, ...)', desc: '最大值' },
    { name: 'floor', signature: 'floor(n)', desc: '向下取整' },
    { name: 'ceil', signature: 'ceil(n)', desc: '向上取整' },
    { name: 'round', signature: 'round(n)', desc: '四舍五入' },
    { name: 'sqrt', signature: 'sqrt(n)', desc: '平方根' },
    { name: 'pow', signature: 'pow(base, exp)', desc: '幂运算' },
    { name: 'random', signature: 'random()', desc: '随机数 0-1' },
    { name: 'random_int', signature: 'random_int(min, max)', desc: '随机整数' },
    
    // 时间
    { name: 'time', signature: 'time()', desc: '当前时间戳' },
    { name: 'sleep', signature: 'sleep(ms)', desc: '暂停执行' },
    { name: 'now', signature: 'now()', desc: '当前日期时间' },
    
    // JSON
    { name: 'json_encode', signature: 'json_encode(value)', desc: '编码为 JSON' },
    { name: 'json_decode', signature: 'json_decode(str)', desc: '解码 JSON' },
    
    // 文件
    { name: 'file_read', signature: 'file_read(path)', desc: '读取文件' },
    { name: 'file_write', signature: 'file_write(path, content)', desc: '写入文件' },
    { name: 'file_exists', signature: 'file_exists(path)', desc: '文件是否存在' },
    
    // 正则
    { name: 'regex_match', signature: 'regex_match(pattern, str)', desc: '正则匹配' },
    { name: 'regex_find', signature: 'regex_find(pattern, str)', desc: '正则查找' },
    { name: 'regex_replace', signature: 'regex_replace(pattern, str, replacement)', desc: '正则替换' },
    
    // 异步
    { name: 'set_timeout', signature: 'set_timeout(fn, ms)', desc: '延时执行' },
    { name: 'set_interval', signature: 'set_interval(fn, ms)', desc: '定时执行' },
    { name: 'clear_timer', signature: 'clear_timer(id)', desc: '取消定时器' },
];

// GUI 类和函数
const guiItems = [
    { name: 'Window', signature: 'new Window(title, width, height)', desc: 'GUI 窗口类', kind: vscode.CompletionItemKind.Class },
    { name: 'Tray', signature: 'new Tray(icon, tooltip)', desc: '系统托盘类', kind: vscode.CompletionItemKind.Class },
    { name: 'gui_init', signature: 'gui_init()', desc: '初始化 GUI' },
    { name: 'gui_run', signature: 'gui_run()', desc: '运行 GUI 主循环' },
];

// 网络类
const networkItems = [
    { name: 'HttpServer', signature: 'new HttpServer(port)', desc: 'HTTP 服务器类', kind: vscode.CompletionItemKind.Class },
    { name: 'TcpServer', signature: 'new TcpServer(port)', desc: 'TCP 服务器类', kind: vscode.CompletionItemKind.Class },
    { name: 'TcpClient', signature: 'new TcpClient()', desc: 'TCP 客户端类', kind: vscode.CompletionItemKind.Class },
    { name: 'http_get', signature: 'http_get(url)', desc: 'HTTP GET 请求' },
    { name: 'http_post', signature: 'http_post(url, data)', desc: 'HTTP POST 请求' },
];

// HAL 嵌入式
const halItems = [
    // 类
    { name: 'GPIO', signature: 'new GPIO(pin, mode)', desc: 'GPIO 引脚类', kind: vscode.CompletionItemKind.Class },
    { name: 'PWM', signature: 'new PWM(pin, freq)', desc: 'PWM 类', kind: vscode.CompletionItemKind.Class },
    { name: 'I2C', signature: 'new I2C(sda, scl)', desc: 'I2C 总线类', kind: vscode.CompletionItemKind.Class },
    { name: 'SPI', signature: 'new SPI(mosi, miso, sck)', desc: 'SPI 总线类', kind: vscode.CompletionItemKind.Class },
    { name: 'UART', signature: 'new UART(tx, rx, baud)', desc: 'UART 串口类', kind: vscode.CompletionItemKind.Class },
    { name: 'ADC', signature: 'new ADC(pin)', desc: 'ADC 模数转换类', kind: vscode.CompletionItemKind.Class },
    { name: 'DHT', signature: 'new DHT(pin, type)', desc: 'DHT 温湿度传感器类', kind: vscode.CompletionItemKind.Class },
    { name: 'OLED', signature: 'new OLED(width, height)', desc: 'OLED 显示屏类', kind: vscode.CompletionItemKind.Class },
    { name: 'Servo', signature: 'new Servo(pin)', desc: '舵机类', kind: vscode.CompletionItemKind.Class },
    { name: 'NeoPixel', signature: 'new NeoPixel(pin, count)', desc: 'RGB LED 灯带类', kind: vscode.CompletionItemKind.Class },
    { name: 'Stepper', signature: 'new Stepper(pins, steps)', desc: '步进电机类', kind: vscode.CompletionItemKind.Class },
    { name: 'Buzzer', signature: 'new Buzzer(pin)', desc: '蜂鸣器类', kind: vscode.CompletionItemKind.Class },
    { name: 'Ultrasonic', signature: 'new Ultrasonic(trig, echo)', desc: '超声波传感器类', kind: vscode.CompletionItemKind.Class },
    // 常量
    { name: 'INPUT', signature: 'INPUT', desc: '输入模式', kind: vscode.CompletionItemKind.Constant },
    { name: 'OUTPUT', signature: 'OUTPUT', desc: '输出模式', kind: vscode.CompletionItemKind.Constant },
    { name: 'INPUT_PULLUP', signature: 'INPUT_PULLUP', desc: '上拉输入模式', kind: vscode.CompletionItemKind.Constant },
    { name: 'INPUT_PULLDOWN', signature: 'INPUT_PULLDOWN', desc: '下拉输入模式', kind: vscode.CompletionItemKind.Constant },
    { name: 'HIGH', signature: 'HIGH', desc: '高电平', kind: vscode.CompletionItemKind.Constant },
    { name: 'LOW', signature: 'LOW', desc: '低电平', kind: vscode.CompletionItemKind.Constant },
    { name: 'PULL_UP', signature: 'PULL_UP', desc: '上拉电阻', kind: vscode.CompletionItemKind.Constant },
    { name: 'PULL_DOWN', signature: 'PULL_DOWN', desc: '下拉电阻', kind: vscode.CompletionItemKind.Constant },
    // 初始化函数
    { name: 'hal_init', signature: 'hal_init()', desc: '初始化 HAL 层' },
    { name: 'gpio_init', signature: 'gpio_init(pin, mode)', desc: '初始化 GPIO 引脚' },
    { name: 'adc_init', signature: 'adc_init(pin)', desc: '初始化 ADC 通道' },
    { name: 'uart_init', signature: 'uart_init(tx, rx, baud)', desc: '初始化 UART 串口' },
    { name: 'i2c_init', signature: 'i2c_init(sda, scl, freq?)', desc: '初始化 I2C 总线' },
    { name: 'spi_init', signature: 'spi_init(mosi, miso, sck, freq?)', desc: '初始化 SPI 总线' },
    { name: 'pwm_init', signature: 'pwm_init(pin, freq)', desc: '初始化 PWM 输出' },
    // GPIO 操作
    { name: 'gpio_read', signature: 'gpio_read(pin)', desc: '读取 GPIO 电平' },
    { name: 'gpio_write', signature: 'gpio_write(pin, value)', desc: '写入 GPIO 电平' },
    { name: 'gpio_toggle', signature: 'gpio_toggle(pin)', desc: '切换 GPIO 电平' },
    // ADC 操作
    { name: 'adc_read', signature: 'adc_read(pin)', desc: '读取 ADC 值 (0-4095)' },
    { name: 'adc_read_voltage', signature: 'adc_read_voltage(pin)', desc: '读取 ADC 电压值' },
    // UART 操作
    { name: 'uart_write', signature: 'uart_write(data)', desc: '串口发送数据' },
    { name: 'uart_read', signature: 'uart_read()', desc: '串口接收数据' },
    { name: 'uart_available', signature: 'uart_available()', desc: '串口可读字节数' },
    // I2C 操作
    { name: 'i2c_write', signature: 'i2c_write(addr, data)', desc: 'I2C 写入数据' },
    { name: 'i2c_read', signature: 'i2c_read(addr, len)', desc: 'I2C 读取数据' },
    // PWM 操作
    { name: 'pwm_set_duty', signature: 'pwm_set_duty(pin, duty)', desc: '设置 PWM 占空比' },
    // 定时函数
    { name: 'delay_ms', signature: 'delay_ms(ms)', desc: '延时毫秒' },
    { name: 'delay_us', signature: 'delay_us(us)', desc: '延时微秒' },
    { name: 'millis', signature: 'millis()', desc: '获取运行毫秒数' },
    { name: 'micros', signature: 'micros()', desc: '获取运行微秒数' },
];

/**
 * 激活扩展
 */
function activate(context) {
    console.log('MoonLang extension activated');

    // 获取配置
    const config = vscode.workspace.getConfiguration('moonlang');

    // 注册补全提供器
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'moonlang',
        {
            provideCompletionItems(document, position, token, context) {
                const completions = [];
                
                // 获取当前行文本
                const lineText = document.lineAt(position).text;
                const linePrefix = lineText.substring(0, position.character);
                
                // 关键字补全
                for (const kw of keywords) {
                    const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
                    item.detail = 'keyword';
                    completions.push(item);
                }
                
                // 内置函数补全
                for (const fn of builtinFunctions) {
                    const item = new vscode.CompletionItem(fn.name, vscode.CompletionItemKind.Function);
                    item.detail = fn.signature;
                    item.documentation = new vscode.MarkdownString(fn.desc);
                    // 添加函数调用片段
                    item.insertText = new vscode.SnippetString(fn.name + '($0)');
                    completions.push(item);
                }
                
                // GUI 补全
                for (const item of guiItems) {
                    const completion = new vscode.CompletionItem(item.name, item.kind || vscode.CompletionItemKind.Function);
                    completion.detail = item.signature;
                    completion.documentation = new vscode.MarkdownString(item.desc);
                    completions.push(completion);
                }
                
                // 网络补全
                for (const item of networkItems) {
                    const completion = new vscode.CompletionItem(item.name, item.kind || vscode.CompletionItemKind.Function);
                    completion.detail = item.signature;
                    completion.documentation = new vscode.MarkdownString(item.desc);
                    completions.push(completion);
                }
                
                // HAL 补全
                for (const item of halItems) {
                    const completion = new vscode.CompletionItem(item.name, item.kind || vscode.CompletionItemKind.Function);
                    completion.detail = item.signature;
                    completion.documentation = new vscode.MarkdownString(item.desc);
                    completions.push(completion);
                }
                
                // 代码片段补全 - 传统风格 (: end)
                const snippets = [
                    {
                        label: 'function',
                        detail: 'function definition (: end)',
                        insertText: new vscode.SnippetString('function ${1:name}(${2:params}):\n\t${3:# code}\nend'),
                    },
                    {
                        label: 'functionb',
                        detail: 'function definition ({ })',
                        insertText: new vscode.SnippetString('function ${1:name}(${2:params}) {\n\t${3:# code}\n}'),
                    },
                    {
                        label: 'class',
                        detail: 'class definition (: end)',
                        insertText: new vscode.SnippetString('class ${1:ClassName}:\n\tfunction init(${2:params}):\n\t\t${3:self.value = value}\n\tend\nend'),
                    },
                    {
                        label: 'classb',
                        detail: 'class definition ({ })',
                        insertText: new vscode.SnippetString('class ${1:ClassName} {\n\tfunction init(${2:params}) {\n\t\t${3:self.value = value}\n\t}\n}'),
                    },
                    {
                        label: 'if',
                        detail: 'if statement (: end)',
                        insertText: new vscode.SnippetString('if ${1:condition}:\n\t${2:# code}\nend'),
                    },
                    {
                        label: 'ifb',
                        detail: 'if statement ({ })',
                        insertText: new vscode.SnippetString('if ${1:condition} {\n\t${2:# code}\n}'),
                    },
                    {
                        label: 'for',
                        detail: 'for loop (: end)',
                        insertText: new vscode.SnippetString('for ${1:item} in ${2:collection}:\n\t${3:# code}\nend'),
                    },
                    {
                        label: 'forb',
                        detail: 'for loop ({ })',
                        insertText: new vscode.SnippetString('for ${1:item} in ${2:collection} {\n\t${3:# code}\n}'),
                    },
                    {
                        label: 'while',
                        detail: 'while loop (: end)',
                        insertText: new vscode.SnippetString('while ${1:condition}:\n\t${2:# code}\nend'),
                    },
                    {
                        label: 'whileb',
                        detail: 'while loop ({ })',
                        insertText: new vscode.SnippetString('while ${1:condition} {\n\t${2:# code}\n}'),
                    },
                    {
                        label: 'try',
                        detail: 'try-catch block (: end)',
                        insertText: new vscode.SnippetString('try:\n\t${1:# code}\ncatch ${2:e}:\n\t${3:print(e)}\nend'),
                    },
                    {
                        label: 'tryb',
                        detail: 'try-catch block ({ })',
                        insertText: new vscode.SnippetString('try {\n\t${1:# code}\n} catch ${2:e} {\n\t${3:print(e)}\n}'),
                    },
                    {
                        label: 'lambda',
                        detail: 'lambda expression',
                        insertText: new vscode.SnippetString('(${1:x}) => ${2:x * 2}'),
                    },
                ];
                
                for (const snippet of snippets) {
                    const item = new vscode.CompletionItem(snippet.label, vscode.CompletionItemKind.Snippet);
                    item.detail = snippet.detail;
                    item.insertText = snippet.insertText;
                    completions.push(item);
                }
                
                return completions;
            }
        },
        // 触发字符
        '.', '('
    );

    // 保存时自动格式化
    const formatOnSaveHandler = vscode.workspace.onWillSaveTextDocument(event => {
        const document = event.document;
        if (document.languageId !== 'moonlang') return;
        
        const config = vscode.workspace.getConfiguration('moonlang');
        if (!config.get('formatOnSave', true)) return;
        
        const text = document.getText();
        const formatted = formatMoonLang(text);
        
        if (formatted !== text) {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            event.waitUntil(Promise.resolve([vscode.TextEdit.replace(fullRange, formatted)]));
        }
    });

    // 注册格式化提供器
    const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
        'moonlang',
        {
            provideDocumentFormattingEdits(document) {
                const edits = [];
                const text = document.getText();
                const formatted = formatMoonLang(text);
                
                if (formatted !== text) {
                    const fullRange = new vscode.Range(
                        document.positionAt(0),
                        document.positionAt(text.length)
                    );
                    edits.push(vscode.TextEdit.replace(fullRange, formatted));
                }
                
                return edits;
            }
        }
    );

    // 注册悬停提供器
    const hoverProvider = vscode.languages.registerHoverProvider(
        'moonlang',
        {
            provideHover(document, position) {
                const wordRange = document.getWordRangeAtPosition(position);
                if (!wordRange) return null;
                
                const word = document.getText(wordRange);
                
                // 查找内置函数
                const fn = builtinFunctions.find(f => f.name === word);
                if (fn) {
                    const content = new vscode.MarkdownString();
                    content.appendCodeblock(fn.signature, 'moonlang');
                    content.appendText('\n\n' + fn.desc);
                    return new vscode.Hover(content);
                }
                
                // 查找关键字
                if (keywords.includes(word)) {
                    return new vscode.Hover(new vscode.MarkdownString(`**${word}** - MoonLang keyword`));
                }
                
                // GUI/网络/HAL
                const allItems = [...guiItems, ...networkItems, ...halItems];
                const item = allItems.find(i => i.name === word);
                if (item) {
                    const content = new vscode.MarkdownString();
                    content.appendCodeblock(item.signature, 'moonlang');
                    content.appendText('\n\n' + item.desc);
                    return new vscode.Hover(content);
                }
                
                return null;
            }
        }
    );

    // 注册符号提供器 (大纲视图)
    const symbolProvider = vscode.languages.registerDocumentSymbolProvider(
        'moonlang',
        {
            provideDocumentSymbols(document) {
                const symbols = [];
                const text = document.getText();
                const lines = text.split('\n');
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    
                    // 匹配函数定义
                    const funcMatch = line.match(/^\s*function\s+(\w+)\s*\(/);
                    if (funcMatch) {
                        const symbol = new vscode.DocumentSymbol(
                            funcMatch[1],
                            '',
                            vscode.SymbolKind.Function,
                            new vscode.Range(i, 0, i, line.length),
                            new vscode.Range(i, line.indexOf(funcMatch[1]), i, line.indexOf(funcMatch[1]) + funcMatch[1].length)
                        );
                        symbols.push(symbol);
                    }
                    
                    // 匹配类定义
                    const classMatch = line.match(/^\s*class\s+(\w+)/);
                    if (classMatch) {
                        const symbol = new vscode.DocumentSymbol(
                            classMatch[1],
                            '',
                            vscode.SymbolKind.Class,
                            new vscode.Range(i, 0, i, line.length),
                            new vscode.Range(i, line.indexOf(classMatch[1]), i, line.indexOf(classMatch[1]) + classMatch[1].length)
                        );
                        symbols.push(symbol);
                    }
                }
                
                return symbols;
            }
        }
    );

    // 注册运行 MoonLang 文件命令
    const runMoonLangCommand = vscode.commands.registerCommand('run.MoonLang', async (uri) => {
        let filePath;
        
        // 检查是否从文件浏览器右键菜单触发
        if (uri && uri.fsPath) {
            filePath = uri.fsPath;
        } else {
            // 从编辑器触发
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active file open');
                return;
            }
            filePath = editor.document.fileName;
        }

        // 验证文件扩展名
        if (!filePath.endsWith('.moon')) {
            vscode.window.showErrorMessage('Current file is not a MoonLang file');
            return;
        }

        const fileName = filePath.split('\\').pop();

        // 创建并显示终端
        const terminal = vscode.window.createTerminal(`MoonLang Terminal`);
        terminal.show();

        // 运行命令
        terminal.sendText(`moonc "${fileName}" -r`);
    });
    
    // 注册生成可执行文件命令
    const generateMoonLangCommand = vscode.commands.registerCommand('generate.MoonLang', async (uri) => {
        let filePath;
        
        // 检查是否从文件浏览器右键菜单触发
        if (uri && uri.fsPath) {
            filePath = uri.fsPath;
        } else {
            // 从编辑器触发
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active file open');
                return;
            }
            filePath = editor.document.fileName;
        }

        // 验证文件扩展名
        if (!filePath.endsWith('.moon')) {
            vscode.window.showErrorMessage('Current file is not a MoonLang file');
            return;
        }

        const fileName = filePath.split('\\').pop();

        // 创建并显示终端
        const terminal = vscode.window.createTerminal(`MoonLang Terminal`);
        terminal.show();

        // 运行命令
        const exeFileName = fileName.replace('.moon', '');
        terminal.sendText(`moonc "${fileName}" -o "${exeFileName}.exe"`);
    });

    context.subscriptions.push(
        completionProvider,
        formattingProvider,
        hoverProvider,
        symbolProvider,
        formatOnSaveHandler,
        runMoonLangCommand,
        generateMoonLangCommand
    );
}

/**
 * 格式化 MoonLang 代码
 * 支持两种代码块风格：: end 和 { }
 */
function formatMoonLang(text) {
    const lines = text.split('\n');
    const result = [];
    let indentLevel = 0;
    const config = vscode.workspace.getConfiguration('moonlang');
    const tabSize = config.get('tabSize', 4);
    const useSpaces = config.get('insertSpaces', true);
    const indentStr = useSpaces ? ' '.repeat(tabSize) : '\t';
    
    for (let line of lines) {
        // 去除原有缩进
        const trimmed = line.trim();
        
        // 空行保留
        if (trimmed === '') {
            result.push('');
            continue;
        }
        
        // 计算本行缩进调整
        let dedent = false;
        let indent = false;
        
        // 减少缩进的情况：
        // 1. 传统风格: end, else, elif, catch, finally, case, default
        // 2. 大括号风格: 以 } 开头的行
        if (/^(end|else|elif|catch|finally|case|default)\b/.test(trimmed) || /^\}/.test(trimmed)) {
            dedent = true;
        }
        
        // 增加缩进的情况：
        // 1. 传统风格: 以 : 结尾的行
        // 2. 大括号风格: 以 { 结尾的行
        if (/:$/.test(trimmed) || /\{$/.test(trimmed)) {
            indent = true;
        }
        
        // 先减少缩进（用于本行）
        if (dedent) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // 添加缩进
        const indentedLine = indentStr.repeat(indentLevel) + trimmed;
        result.push(indentedLine);
        
        // 后增加缩进（用于下一行）
        if (indent) {
            indentLevel++;
        }
    }
    
    // 确保文件以换行符结尾
    let formatted = result.join('\n');
    if (!formatted.endsWith('\n')) {
        formatted += '\n';
    }
    
    return formatted;
}

function deactivate() {
    console.log('MoonLang extension deactivated');
}

module.exports = {
    activate,
    deactivate
};
