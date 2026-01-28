import { sanitizeInput, MAX_SANITIZED_INPUT_LENGTH } from '@/lib/utils/security';

describe('sanitizeInput', () => {
  it('should return empty string for null or undefined', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
  });

  it('should strip HTML tags', () => {
    expect(sanitizeInput('Hello <b>World</b>')).toBe('Hello World');
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
  });

  it('should remove javascript: protocol', () => {
    expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
    expect(sanitizeInput('JAVASCRIPT:alert(1)')).toBe('alert(1)');
  });

  it('should remove data: protocol', () => {
    expect(sanitizeInput('data:text/html,<script>')).toBe('text/html,');
  });

  it('should remove event handlers', () => {
    expect(sanitizeInput('div onclick="alert(1)"')).toBe('div "alert(1)"');
    expect(sanitizeInput('img onerror=alert(1)')).toBe('img alert(1)');
  });

  it('should truncate input to MAX_SANITIZED_INPUT_LENGTH', () => {
    const longInput = 'a'.repeat(MAX_SANITIZED_INPUT_LENGTH + 10);
    expect(sanitizeInput(longInput).length).toBe(MAX_SANITIZED_INPUT_LENGTH);
  });

  it('should NOT encode HTML entities (React handles this)', () => {
    expect(sanitizeInput('B&W')).toBe('B&W');
    expect(sanitizeInput('John "Doe"')).toBe('John "Doe"');
  });
});
