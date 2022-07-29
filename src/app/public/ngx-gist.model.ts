import * as io from 'io-ts';
import * as iot from 'io-ts-types';
import {
  decodeValueElseNull,
  isNonEmptyString,
  parsedJsonFromStringCodec,
} from './ngx-gist.utilities';
import { default as hljs } from 'highlight.js';

export class NgxGist implements Gist {
  public constructor(args: Gist & Pick<NgxGist, 'languageOverride'>) {
    this.comments = args.comments;
    this.comments_url = args.comments_url;
    this.commits_url = args.commits_url;
    this.created_at = new Date(args.created_at);
    this.description = args.description;
    this.files = args.files;
    this.forks = args.forks;
    this.forks_url = args.forks_url;
    this.git_pull_url = args.git_pull_url;
    this.git_push_url = args.git_push_url;
    this.history = args.history;
    this.html_url = args.html_url;
    this.id = args.id;
    this.node_id = args.node_id;
    this.owner = args.owner;
    this.public = args.public;
    this.truncated = args.truncated;
    this.updated_at = new Date(args.updated_at);
    this.url = args.url;
    this.user = args.user;

    // Additional properties
    this.languageOverride = args.languageOverride;
    const highlightedFiles: NgxGist['highlightedFiles'] = [];
    for (const key in this.files) {
      if (this.files[key]) {
        const file = this.files[key];
        highlightedFiles.push({
          ...file,
          highlightedContent: getHighlightedContent(file.content),
        });
      }
    }
    this.highlightedFiles = highlightedFiles;
  }

  /** Core gist properties */
  /* eslint-disable @typescript-eslint/naming-convention */
  public readonly comments: number;
  public readonly comments_url: string;
  public readonly commits_url: string;
  public readonly created_at: Date;
  public readonly description: string;
  public readonly files: io.TypeOf<typeof gistFilesCodec>;
  public readonly forks: unknown[];
  public readonly forks_url: string;
  public readonly git_pull_url: string;
  public readonly git_push_url: string;
  public readonly history: Array<io.TypeOf<typeof gistHistoryCodec>>;
  public readonly html_url: string;
  public readonly id: string;
  public readonly node_id: string;
  public readonly owner?: io.TypeOf<typeof gitHubUserCodec>;
  public readonly public: boolean;
  public readonly truncated: boolean;
  public readonly updated_at: Date;
  public readonly url: string;
  public readonly user?: unknown;
  /* eslint-enable @typescript-eslint/naming-convention */

  /** Additional properties */
  public readonly highlightedFiles: Array<
    io.TypeOf<typeof gistFilesContent> & HighlightedContent
  >;
  public readonly languageOverride?: string;

  /**
   * Create a local, static gist object. Do not use this for fetched data.
   * Used for creating and displaying local code samples.
   *
   * Use `deserialize` sibling function for remote "unknown" responses.
   *
   * @param args Minimally necessary paramaters for displaying local code.
   * @returns A 'partial' model in which unnecessary fields are dummny data.
   */
  public static create(
    args: Pick<Gist, 'files' | 'created_at' | 'description'> &
      Pick<NgxGist, 'languageOverride'>,
  ): NgxGist {
    return new NgxGist({
      // Properties with settable values. These are the mimimum values needed
      // for displaying non "remote".
      created_at: new Date(args.created_at),
      description: args.description,
      files: args.files,
      languageOverride: args.languageOverride,
      // Empty properties that aren't needed for displaying non "remote" gists
      comments: 0,
      comments_url: '',
      commits_url: '',
      forks: [],
      forks_url: '',
      git_pull_url: '',
      git_push_url: '',
      history: [],
      html_url: '',
      id: '',
      node_id: '',
      owner: undefined,
      public: true,
      truncated: false,
      updated_at: new Date(),
      url: '',
      user: undefined,
    });
  }

  /**
   * Deserialize and decode fetched/unknown data into the full model.
   *
   * @param value Unknown value, but expects a full model either by object or JSON string.
   * @returns Either the full model or null if deserialization fails.
   */
  public static deserialize(value: unknown): NgxGist | null {
    const decoded =
      // Decode as object or continue
      decodeValueElseNull(gistCodec)(value) ||
      // Decode as string or return null
      (isNonEmptyString(value)
        ? decodeValueElseNull(gistFromJsonStringCodec)(value)
        : null);
    return decoded
      ? new NgxGist({
          ...decoded,
          created_at: new Date(decoded.created_at),
          updated_at: new Date(decoded.updated_at),
        })
      : null;
  }
}

interface HighlightedContent {
  highlightedContent: string;
}

function getHighlightedContent(
  baseContent: string,
  languageOverride?: string,
): string {
  if (languageOverride) {
    return hljs.highlight(baseContent, { language: languageOverride }).value;
  }

  return hljs.highlightAuto(baseContent).value;
}

const gitHubUserCodec = io.readonly(
  io.type({
    avatar_url: io.string,
    events_url: io.string,
    followers_url: io.string,
    following_url: io.string,
    gists_url: io.string,
    gravatar_id: io.string,
    html_url: io.string,
    id: io.number,
    login: io.string,
    node_id: io.string,
    organizations_url: io.string,
    received_events_url: io.string,
    repos_url: io.string,
    site_admin: io.boolean,
    starred_url: io.string,
    subscriptions_url: io.string,
    type: io.string,
    url: io.string,
  }),
  'GitHubUser',
);

const gistHistoryChangeStatusCodec = io.readonly(
  io.type({
    additions: io.number,
    deletions: io.number,
    total: io.number,
  }),
  'GistChangeStatus',
);

const gistHistoryCodec = io.readonly(
  io.type({
    change_status: gistHistoryChangeStatusCodec,
    committed_at: io.union([iot.date, io.string]),
    url: io.string,
    user: gitHubUserCodec,
    version: io.string,
  }),
  'GistHistory',
);

const gistFilesContent = io.type({
  content: io.string,
  filename: io.string,
  language: io.string,
  raw_url: io.string,
  size: io.number,
  truncated: io.boolean,
  type: io.string,
});

const gistFilesCodec = io.record(io.string, gistFilesContent);

export const gistCodec = io.readonly(
  io.intersection([
    io.type({
      comments: io.number,
      comments_url: io.string,
      commits_url: io.string,
      created_at: io.union([iot.date, io.string]),
      description: io.string,
      files: gistFilesCodec,
      forks: io.UnknownArray,
      forks_url: io.string,
      git_pull_url: io.string,
      git_push_url: io.string,
      history: io.array(gistHistoryCodec),
      html_url: io.string,
      id: io.string,
      node_id: io.string,
      public: io.boolean,
      truncated: io.boolean,
      updated_at: io.union([iot.date, io.string]),
      url: io.string,
    }),
    io.partial({
      owner: io.union([gitHubUserCodec, io.undefined]),
      user: io.union([io.unknown, io.null, io.undefined]),
    }),
  ]),
  'Gist',
);

const gistFromJsonStringCodec = parsedJsonFromStringCodec.pipe(
  gistCodec,
  'GistFromJsonString',
);

/**
 * Official Gist object
 * https://docs.github.com/en/rest/gists
 */
type Gist = io.TypeOf<typeof gistCodec>;
