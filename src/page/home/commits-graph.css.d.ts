declare namespace CommitsGraphCssModule {
  export interface ICommitsGraphCss {
    svg: string
    tooltip: string
  }
}

declare const CommitsGraphCssModule: CommitsGraphCssModule.ICommitsGraphCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CommitsGraphCssModule.ICommitsGraphCss
}

export = CommitsGraphCssModule
