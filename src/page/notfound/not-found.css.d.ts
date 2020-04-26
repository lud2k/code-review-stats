declare namespace NotFoundCssModule {
  export interface INotFoundCss {
    notFound: string
  }
}

declare const NotFoundCssModule: NotFoundCssModule.INotFoundCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NotFoundCssModule.INotFoundCss
}

export = NotFoundCssModule
