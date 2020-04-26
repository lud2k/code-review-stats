declare module 'randomcolor' {
  function randomcolor(config: { luminosity: string; count: number; seed: number }): string[]
  namespace randomcolor {}
  export = randomcolor
}
