declare namespace ProjectsPieCssModule {
  export interface IProjectsPieCss {
    paper: string
    pieChart: string
  }
}

declare const ProjectsPieCssModule: ProjectsPieCssModule.IProjectsPieCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProjectsPieCssModule.IProjectsPieCss
}

export = ProjectsPieCssModule
