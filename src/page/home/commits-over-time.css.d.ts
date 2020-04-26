declare namespace CommitsOverTimeCssModule {
  export interface ICommitsOverTimeCss {
    paper: string
  }
}

declare const CommitsOverTimeCssModule: CommitsOverTimeCssModule.ICommitsOverTimeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CommitsOverTimeCssModule.ICommitsOverTimeCss
}

export = CommitsOverTimeCssModule
