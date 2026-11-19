/**
 * Minimal GitHub gist API response used by the specs. No network involved.
 */
export function gistResponse(id = 'abc123'): Record<string, unknown> {
  const base = `https://api.github.com/gists/${id}`;
  return {
    comments: 0,
    comments_url: `${base}/comments`,
    commits_url: `${base}/commits`,
    created_at: '2024-01-01T00:00:00.000Z',
    description: 'Test gist',
    files: {
      'hello.ts': {
        content: 'const hello: string = "world";',
        filename: 'hello.ts',
        language: 'TypeScript',
        raw_url: `https://gist.githubusercontent.com/raw/${id}/hello.ts`,
        size: 30,
        truncated: false,
        type: 'application/typescript',
      },
      'style.css': {
        content: '.hello { color: red; }',
        filename: 'style.css',
        language: 'CSS',
        raw_url: `https://gist.githubusercontent.com/raw/${id}/style.css`,
        size: 22,
        truncated: false,
        type: 'text/css',
      },
    },
    forks: [],
    forks_url: `${base}/forks`,
    git_pull_url: `https://gist.github.com/${id}.git`,
    git_push_url: `https://gist.github.com/${id}.git`,
    history: [],
    html_url: `https://gist.github.com/${id}`,
    id,
    node_id: 'G_test',
    public: true,
    truncated: false,
    updated_at: '2024-01-02T00:00:00.000Z',
    url: base,
  };
}
