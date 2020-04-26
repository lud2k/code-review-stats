declare namespace ProjectReviewsCssModule {
  export interface IProjectReviewsCss {
    table: string
  }
}

declare const ProjectReviewsCssModule: ProjectReviewsCssModule.IProjectReviewsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProjectReviewsCssModule.IProjectReviewsCss
}

export = ProjectReviewsCssModule
