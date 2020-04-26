declare namespace MostReviewsCssModule {
  export interface IMostReviewsCss {
    content: string
    paper: string
  }
}

declare const MostReviewsCssModule: MostReviewsCssModule.IMostReviewsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MostReviewsCssModule.IMostReviewsCss
}

export = MostReviewsCssModule
