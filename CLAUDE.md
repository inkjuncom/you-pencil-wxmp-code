# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个用于处理 Markdown 代码块的工具，使其可以复制到微信公众号，并自动处理好高亮和空格、tab 相关逻辑。

- 输入：一个字符串，包含 JavaScript 代码
- 输出：高亮好的 HTML

## 项目结构

```
/
├── lib/              # 源代码目录
│   └── index.js      # 主入口文件
├── test/             # 测试目录
│   └── index.test.js # 测试文件
└── package.json      # Node.js 包配置
```

## 开发命令

- `npm test`: 运行测试（使用 Jest）

## 模块系统

本项目使用 ES Modules (ESM)，在 package.json 中通过 `"type": "module"` 指定。

## 测试用例特点

### 测试框架
- 使用 Jest 作为测试框架

### 测试示例
- **输入**：`const str = "Hello World";`
- **输出**：高亮后的 HTML，包含 highlight.js 样式类

### 空格处理规则
- **空格与后一个非空格字符串同组**：如果一行中以不定长的空格分割，空格总是和它的后一个非空格的字符串在同一个 span 中
- **末尾空格不处理**：末尾的空格不做特殊处理

### 输出结构示例
输入：`<span>const str = "Hello World";</span>`

输出分为4个 span：
1. `<span class="hljs-keyword">const</span>` - 关键字单独一个 span
2. `<span> str=</span>` - 空格 + "str=" 在同一个 span
3. `<span class="hljs-string"> "Hello World"</span>` - 空格 + 字符串在同一个 span
4. `<span>;</span>` - 分号单独一个 span

### 测试内容
1. 验证关键字（如 `const`）被正确识别并添加 `hljs-keyword` 类
2. 验证字符串（如 `"Hello World"`）被正确识别并添加 `hljs-string` 类
3. 验证代码内容完整性不丢失
4. 验证空格处理规则正确应用

### 依赖库
- 使用 lowlight 进行代码语法高亮（基于 highlight.js）

## 开发经验

### lowlight 库使用

1. **导入方式**：
   ```javascript
   import { createLowlight, common } from 'lowlight';
   const lowlight = createLowlight(common);
   ```

2. **API 调用**：
   ```javascript
   const tree = lowlight.highlight('javascript', code);
   ```

3. **返回的树结构**：
   - `tree.type`: "root"
   - `tree.children`: 数组，包含元素节点和文本节点
   - 元素节点：`{ type: 'element', tagName: 'span', properties: { className: ['hljs-keyword'] }, children: [{ type: 'text', value: 'const' }] }`
   - 文本节点：`{ type: 'text', value: ' str = ' }`

### 空格处理实现要点

1. **拆分逻辑**：对于 ` str = ` 这样的文本，需要：
   - 使用正则 `^(\s+\w+\s*=)\s*(\s+)(.*)$` 匹配
   - 将等号前的空格和变量名+等号组合（如 ` str=`）
   - 将等号后的空格分离出来，与后面的字符串组合

2. **合并逻辑**：需要把前一个普通文本节点的尾部空格移到后面的字符串节点前

3. **空内容过滤**：处理过程中可能产生空字符串，需要在生成 HTML 前过滤掉

### 调试技巧

- 使用 `JSON.stringify(tree, null, 2)` 查看 lowlight 返回的完整树结构
- 分步调试：先查看初始节点列表，再查看每一步处理后的结果
