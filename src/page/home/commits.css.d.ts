declare namespace CommitsCssModule {
  export interface ICommitsCss {
    table: string
  }
}

declare const CommitsCssModule: CommitsCssModule.ICommitsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CommitsCssModule.ICommitsCss
}

export = CommitsCssModule
