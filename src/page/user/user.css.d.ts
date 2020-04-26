declare namespace UserCssModule {
  export interface IUserCss {
    content: string
  }
}

declare const UserCssModule: UserCssModule.IUserCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserCssModule.IUserCss
}

export = UserCssModule
