import { NgxGist, gistCodec } from './ngx-gist.model';
import { gistResponse } from './ngx-gist.testing';

describe('NgxGist', () => {
  describe('deserialize', () => {
    it('builds the model from an object', () => {
      const gist = NgxGist.deserialize(gistResponse());
      expect(gist).toBeInstanceOf(NgxGist);
      expect(gist?.id).toBe('abc123');
      expect(gist?.created_at.toISOString()).toBe('2024-01-01T00:00:00.000Z');
      expect(gist?.updated_at.toISOString()).toBe('2024-01-02T00:00:00.000Z');
      expect(gist?.highlightedFiles.map((file) => file.filename)).toEqual([
        'hello.ts',
        'style.css',
      ]);
      expect(gist?.highlightedFiles[0]?.highlightedContent).toContain('hello');
    });

    it('builds the model from a JSON string', () => {
      const gist = NgxGist.deserialize(JSON.stringify(gistResponse('xyz')));
      expect(gist?.id).toBe('xyz');
    });

    it('accepts Date instances for the date fields', () => {
      const gist = NgxGist.deserialize({
        ...gistResponse(),
        created_at: new Date('2023-05-05T00:00:00.000Z'),
      });
      expect(gist?.created_at.toISOString()).toBe('2023-05-05T00:00:00.000Z');
    });

    it('allows the optional owner to be missing', () => {
      expect(NgxGist.deserialize(gistResponse())?.owner).toBeUndefined();
    });

    it('returns null for invalid input', () => {
      const missingId = gistResponse();
      delete missingId['id'];
      const invalid: unknown[] = [
        null,
        undefined,
        42,
        '',
        '   ',
        'not json',
        '{"id":1}',
        {},
        missingId,
        { ...gistResponse(), comments: 'many' },
        { ...gistResponse(), created_at: 12345 },
        { ...gistResponse(), owner: { login: 'only-login' } },
      ];
      for (const value of invalid) {
        expect(NgxGist.deserialize(value)).toBeNull();
      }
    });
  });

  describe('create', () => {
    it('builds a local gist from files', () => {
      const gist = NgxGist.create({
        files: [
          { content: 'const a = 1;', filename: 'a.ts' },
          { content: 'p { margin: 0; }', filename: 'b.css' },
        ],
        languageOverride: 'typescript',
      });
      expect(Object.keys(gist.files)).toEqual(['a.ts', 'b.css']);
      expect(gist.highlightedFiles.length).toBe(2);
      expect(gist.description).toBe('');
      expect(gist.id).toBe('');
      expect(gist.languageOverride).toBe('typescript');
    });

    it('uses the optional description and created date', () => {
      const created = new Date('2020-02-02T00:00:00.000Z');
      const gist = NgxGist.create({
        created_at: created,
        description: 'Hello',
        files: [],
        languageOverride: undefined,
      });
      expect(gist.description).toBe('Hello');
      expect(gist.created_at.toISOString()).toBe(created.toISOString());
    });
  });

  describe('gistCodec', () => {
    it('decodes a valid response and rejects an invalid one', () => {
      expect(gistCodec.decode(gistResponse())._tag).toBe('Right');
      expect(gistCodec.decode({ ...gistResponse(), files: 'x' })._tag).toBe(
        'Left',
      );
    });
  });
});
