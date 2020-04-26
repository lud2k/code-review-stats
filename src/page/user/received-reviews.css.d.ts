declare namespace ReceivedReviewsCssModule {
  export interface IReceivedReviewsCss {
    table: string
  }
}

declare const ReceivedReviewsCssModule: ReceivedReviewsCssModule.IReceivedReviewsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ReceivedReviewsCssModule.IReceivedReviewsCss
}

export = ReceivedReviewsCssModule
