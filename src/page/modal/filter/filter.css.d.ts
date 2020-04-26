declare namespace FilterCssModule {
  export interface IFilterCss {
    checkbox: string
    listItem: string
  }
}

declare const FilterCssModule: FilterCssModule.IFilterCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FilterCssModule.IFilterCss
}

export = FilterCssModule
