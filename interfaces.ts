export interface Item extends Record<string, string | undefined> {
  key: string
  name?: string
}

export interface Section {
  title: string
  data: Item[]
}
