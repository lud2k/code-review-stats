declare namespace MostReviewsUserCssModule {
  export interface IMostReviewsUserCss {
    content: string
    paper: string
  }
}

declare const MostReviewsUserCssModule: MostReviewsUserCssModule.IMostReviewsUserCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MostReviewsUserCssModule.IMostReviewsUserCss
}

export = MostReviewsUserCssModule
