declare namespace BiggestCommitCssModule {
  export interface IBiggestCommitCss {
    content: string
    paper: string
  }
}

declare const BiggestCommitCssModule: BiggestCommitCssModule.IBiggestCommitCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BiggestCommitCssModule.IBiggestCommitCss
}

export = BiggestCommitCssModule
