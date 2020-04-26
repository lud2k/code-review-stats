declare namespace ProjectCssModule {
  export interface IProjectCss {
    content: string
  }
}

declare const ProjectCssModule: ProjectCssModule.IProjectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProjectCssModule.IProjectCss
}

export = ProjectCssModule
