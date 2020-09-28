interface Options {
  [key: string]: any
}

interface Pipeline {
  fun: string
  options: Options
}

export type { Options, Pipeline }
