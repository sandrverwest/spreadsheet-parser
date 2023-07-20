export interface Range {
  majorDimension: string
  range: string
  values: []
}

export interface ParsedSheet {
  spreadsheetId: string,
  valueRanges: []
}

export interface StorageData {
  urlsField: string | null
  valueRenderOption: string
  ranges: [{
    tabName: string | null
    range: string | null
  }]
}

export interface StorageTitles {
  titlesArray: [
    {name: string}
  ]
}
