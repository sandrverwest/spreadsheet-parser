import {Component, OnInit} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService} from "@abacritt/angularx-social-login";
import {HttpClient} from "@angular/common/http";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {forkJoin} from "rxjs";
import {ErrorsService} from "../../services/errors.service";
import {ParserService} from "../../services/parser.service";
import {ParsedSheet, StorageData, Range, StorageTitles} from "../../interfaces/interfaces";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.scss']
})
export class ParserComponent implements OnInit{
  parsingForm: FormGroup
  storageData: StorageData = {
    urlsField: null,
    valueRenderOption: 'FORMATTED_VALUE',
    ranges: [{
      tabName: null,
      range: null
    }]
  }
  storageTitles:StorageTitles
  titlesForm: FormGroup
  dataArray:ParsedSheet[][] = []

  private accessToken = ''

  constructor(
    private http: HttpClient,
    private authService: SocialAuthService,
    public errorService: ErrorsService,
    public parserService: ParserService,
    public loader: LoaderService
    ) { }

  ngOnInit() {
    // parsing form and its locale storage
    if(localStorage.getItem('formData')){
      this.storageData = JSON.parse(localStorage.getItem('formData')!)
    }

    this.parsingForm = new FormGroup({
      urlsField: new FormControl(this.storageData.urlsField, Validators.required),
      ranges: new FormArray([]),
      valueRenderOption: new FormControl(this.storageData.valueRenderOption, Validators.required)
    })

    this.loadRanges()
    if(this.ranges.length === 0) {
      this.anotherRange()
    }

    this.parsingForm.valueChanges.subscribe(parsingChanges => {
      localStorage.setItem('formData', JSON.stringify(parsingChanges))
    })

    // titles Form
    this.titlesForm = new FormGroup({
      titlesArray: new FormArray([])
    })

    this.titlesForm.valueChanges.subscribe(titlesChanges => {
      localStorage.setItem('titlesData', JSON.stringify(titlesChanges))
    })


    /// Access token
    if(localStorage.getItem('accessToken')){
      this.accessToken = localStorage.getItem('accessToken')!
    }
  }

  private loadRanges() {
    this.storageData.ranges.forEach( element => {
      const range = new FormGroup({
        tabName: new FormControl(element.tabName, Validators.required),
        range: new FormControl(element.range, [Validators.required, Validators.pattern('^([A-Z]+[0-9]+(:[A-Z]+[0-9]+)?)$')])
      })
      this.ranges.push(range)
    })
  }
  get ranges():FormArray {
    return this.parsingForm.get('ranges') as FormArray;
  }

  anotherRange() {
    const range = new FormGroup({
      tabName: new FormControl(null, Validators.required),
      range: new FormControl(null, [Validators.required, Validators.pattern('^([A-Z]+[0-9]+(:[A-Z]+[0-9]+)?)$')])
    })
    this.ranges.push(range)
  }

  removeRange(rangeIndex:number) {
    this.ranges.removeAt(rangeIndex)
    console.log(this.parsingForm.value)
  }

  parseUrls(links:string, parsedForm:FormGroup) {
    this.loader.showLoader()
    const spreadsheetIds = links
      .split(/\s+/)
      .filter((url: string) => url.trim() !== '')
      .map((url: string) => {
        const startIndex = url.indexOf('/d/') + 3 // Add 3 to skip '/d/'
        const endIndex = url.indexOf('/edit')
        return url.substring(startIndex, endIndex)
      })

    const rangeQueryString = parsedForm.get('ranges')!.value
      .map((range:{tabName:string, range:string}):string => `ranges=${encodeURIComponent(range.tabName)}!${encodeURIComponent(range.range)}`)
      .join('&')

    const queryString = `${rangeQueryString}&valueRenderOption=${encodeURIComponent(parsedForm.get('valueRenderOption')!.value)}`;

    const observables = spreadsheetIds.map((id:string) => this.parserService.getSpreadSheet(id, queryString, this.accessToken))

    forkJoin(observables).subscribe({
      next: (dataArray: ParsedSheet[][]) => {
        this.dataArray = dataArray

        if(localStorage.getItem('titlesData')){
          this.storageTitles = JSON.parse(localStorage.getItem('titlesData')!)
          this.titlesForm.get('titlesArray')?.patchValue([])
          if(this.storageTitles.titlesArray.length > 0 && this.titles.length < dataArray[0].length) {
            for(let i = 0; i < dataArray[0].length; i++) {
              if(this.storageTitles.titlesArray[i]?.name) {
                this.loadTitles(this.storageTitles.titlesArray[i].name)
              } else {
                this.generateTitles(i)
              }
            }
          }
        } else {
          dataArray[0].forEach((element, index) => this.generateTitles(index))
        }
        this.errorService.clearError()
        this.loader.hideLoader()
      },
      error: error => {
        this.errorService.setError(error?.error?.error)
        this.loader.hideLoader()
      }
    })
  }

  generateTitles(item:number) {
    const title = new FormGroup({
      name: new FormControl('title_'+item)
    })
    this.titles.push(title)
  }

  loadTitles(name:string) {
    const title = new FormGroup({
      name: new FormControl(name)
    })
    this.titles.push(title)
  }
  get titles():FormArray {
    return this.titlesForm.get('titlesArray') as FormArray;
  }

  get isHasToken():boolean {
    if(this.accessToken === '') {
      return true
    } else {
      return false
    }
  }

  getAccessToken(): void {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => {
      this.accessToken = accessToken
      localStorage.setItem('accessToken', accessToken)
      this.errorService.clearError()
    })
  }

}
