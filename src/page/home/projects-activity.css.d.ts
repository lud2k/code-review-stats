declare namespace ProjectsActivityCssModule {
  export interface IProjectsActivityCss {
    paper: string
    table: string
  }
}

declare const ProjectsActivityCssModule: ProjectsActivityCssModule.IProjectsActivityCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProjectsActivityCssModule.IProjectsActivityCss
}

export = ProjectsActivityCssModule
