import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {CandidateDetailRequestModel} from "../shared/model/candidateDetail.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  saveCandidate(candidateDetails: CandidateDetailRequestModel): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, candidateDetails)

  }

  updateCandidate(candidateDetails: CandidateDetailRequestModel, id?: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${id}`, candidateDetails)

  }

  getAllCandidates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`)

  }

  getCountry() {
    return this.http.get('https://ipapi.co/json/')
  }

  getCountryState() {
    return this.http.get('assets/country-states.json')
  }
}
