import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {ParsedSheet, Range} from "../interfaces/interfaces";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor(private http: HttpClient) { }

  getSpreadSheet(spreadsheetId: string, range: string, accessToken:string):Observable<ParsedSheet[]> {
    return this.http
      .get<ParsedSheet>(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${range}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .pipe(
        map((result: ParsedSheet) => {
          const mergedArrays: any[] = []
          result.valueRanges.forEach((element: Range) => {
            const rangeValues:any[] = element.values.flat()
            mergedArrays.push(...rangeValues)
          })
          mergedArrays.push(spreadsheetId)
          return mergedArrays
        })
      )
  }

}
