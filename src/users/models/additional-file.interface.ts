export interface AdditionalFile {
  id: number
  name: string
  path: string
}

export interface AdditionalFileDto extends Omit<AdditionalFile, 'id'> {}
