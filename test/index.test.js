import { highlightCode } from '../lib/index.js';

describe('highlightCode', () => {
  it('should highlight code with specific span wrapping rules', () => {
    const input = 'const str = "Hello World";';
    const result = highlightCode(input);

    // 验证输出包含正确的 span 结构
    expect(result).toContain('<span class="hljs-keyword">const</span>');
    expect(result).toContain('<span> str=</span>');
    expect(result).toContain('<span class="hljs-string"> "Hello World"</span>');
    expect(result).toContain('<span>;</span>');
  });

  it('should preserve the code content', () => {
    const input = '<span>const str = "Hello World";</span>';
    const result = highlightCode(input);

    expect(result).toContain('const');
    expect(result).toContain('str');
    expect(result).toContain('Hello World');
  });

  it('should handle multi-line code', () => {
    const input = 'const str = "Hello World";\n  const num = 0;';
    const result = highlightCode(input);

    // 第一行
    expect(result).toContain('<span class="hljs-keyword">const</span>');
    expect(result).toContain('<span> str=</span>');
    expect(result).toContain('<span class="hljs-string"> "Hello World"</span>');
    expect(result).toContain('<span>;</span>');
    // 换行
    expect(result).toContain('<br />');
    // 第二行 - 带缩进的 const
    expect(result).toContain('<span class="hljs-keyword">  const</span>');
    expect(result).toContain('<span> num = </span>');
    expect(result).toContain('<span class="hljs-number">0</span>');
    expect(result).toContain('<span>;</span>');
  });
});
