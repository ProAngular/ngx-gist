import * as io from 'io-ts';

import { GistFileFilterPipe } from './ngx-gist-file-filter.pipe';
import { NgxGist } from './ngx-gist.model';
import {
  dateCodec,
  decodeValueElseNull,
  isNonEmptyString,
  isNonEmptyValue,
  isStringArray,
  parsedJsonFromStringCodec,
} from './ngx-gist.utilities';

describe('ngx-gist utilities', () => {
  it('isNonEmptyString', () => {
    expect(isNonEmptyString('a')).toBe(true);
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString('   ')).toBe(false);
    expect(isNonEmptyString(1)).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
  });

  it('isStringArray', () => {
    expect(isStringArray(['a', 'b'])).toBe(true);
    expect(isStringArray([])).toBe(true);
    expect(isStringArray(['a', 1])).toBe(false);
    expect(isStringArray('a')).toBe(false);
  });

  it('isNonEmptyValue', () => {
    expect(isNonEmptyValue(0)).toBe(true);
    expect(isNonEmptyValue('')).toBe(true);
    expect(isNonEmptyValue(null)).toBe(false);
    expect(isNonEmptyValue(undefined)).toBe(false);
  });

  describe('dateCodec', () => {
    it('accepts Date instances only', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      expect(dateCodec.decode(date)._tag).toBe('Right');
      expect(dateCodec.decode('2024-01-01')._tag).toBe('Left');
      expect(dateCodec.decode(null)._tag).toBe('Left');
      expect(dateCodec.encode(date)).toBe(date);
    });
  });

  describe('parsedJsonFromStringCodec', () => {
    it('parses valid JSON', () => {
      const result = parsedJsonFromStringCodec.decode('{"a":1}');
      expect(result._tag === 'Right' && result.right).toEqual({ a: 1 });
    });

    it('fails on invalid JSON', () => {
      expect(parsedJsonFromStringCodec.decode('{oops')._tag).toBe('Left');
    });

    it('encodes back to a string', () => {
      expect(parsedJsonFromStringCodec.encode({ a: 1 })).toBe('{"a":1}');
    });
  });

  describe('decodeValueElseNull', () => {
    it('returns the value or null', () => {
      const decode = decodeValueElseNull(io.number);
      expect(decode(5)).toBe(5);
      expect(decode('5' as unknown as number)).toBeNull();
    });
  });
});

describe('GistFileFilterPipe', () => {
  const pipe = new GistFileFilterPipe();
  const files = NgxGist.create({
    files: [
      { content: 'a', filename: 'a.ts' },
      { content: 'b', filename: 'b.ts' },
      { content: 'c', filename: 'c.ts' },
    ],
  }).highlightedFiles;
  const names = (value: typeof files): string[] =>
    value.map((file) => file.filename);

  it('returns an empty list without files', () => {
    expect(pipe.transform(null, 'a.ts')).toEqual([]);
  });

  it('returns every file without a filter', () => {
    expect(names(pipe.transform(files))).toEqual(['a.ts', 'b.ts', 'c.ts']);
    expect(names(pipe.transform(files, ''))).toEqual(['a.ts', 'b.ts', 'c.ts']);
  });

  it('filters by one file name', () => {
    expect(names(pipe.transform(files, 'b.ts'))).toEqual(['b.ts']);
  });

  it('filters by many file names', () => {
    expect(names(pipe.transform(files, ['a.ts', 'c.ts']))).toEqual([
      'a.ts',
      'c.ts',
    ]);
  });

  it('returns nothing when no file name matches', () => {
    expect(pipe.transform(files, 'missing.ts')).toEqual([]);
  });
});
