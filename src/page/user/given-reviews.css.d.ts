declare namespace GivenReviewsCssModule {
  export interface IGivenReviewsCss {
    table: string
  }
}

declare const GivenReviewsCssModule: GivenReviewsCssModule.IGivenReviewsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GivenReviewsCssModule.IGivenReviewsCss
}

export = GivenReviewsCssModule
