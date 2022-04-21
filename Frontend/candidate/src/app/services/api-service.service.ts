import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../shared/model/candidateDetail.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  baseUrl: string = environment.baseUrl;
  country = '';

  constructor(private http: HttpClient) {
    this.getCountry().subscribe((res: any)=> {
      this.country = res.country;
    })
  }

  saveCandidate(candidateDetails: UserModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, candidateDetails)

  }

  updateCandidate(candidateDetails: UserModel, id?: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${id}`, candidateDetails)

  }

  getAllCandidates(action: {filterValue: string, selectedPage: number, pageSize: number}): Observable<any> {
    return this.http.get(`${this.baseUrl}/users?search=${action.filterValue}&page=${action.selectedPage+1}&limit=${action.pageSize}`)

  }

  getCountry() {
    return this.http.get('https://ipapi.co/json/')
  }

  getCountryState() {
    return this.http.get('assets/country-states.json')
  }

  deleteCandidate(id?: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`)
  }
}
