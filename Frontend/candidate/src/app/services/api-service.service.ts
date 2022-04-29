import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../shared/model/candidateDetail.model";
import {Observable} from "rxjs";
import {Apollo, gql, QueryRef} from 'apollo-angular';
import {ActionType} from '../shared/model/action.modal';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  baseUrl: string = environment.baseUrl;
  location: any;

  private getUserQuery: QueryRef<any>;

  constructor(private apollo: Apollo,
              private http: HttpClient) {
    this.getCountry().subscribe((res: any) => {
      this.location = res;
    })


    this.getUserQuery = this.apollo.watchQuery({
      query: gql`query getUser($action: GetUserArgs){
        user(query: $action){
          items{
            _id
            identifierNumber
             lastName
            firstName
            emailAddress
            address{
            city,
            country
            }
            phoneNumber{
            countryCode,
            number
            }
          }
          total
        }
      }`,
      errorPolicy: 'all'
    });
  }

  async getAllCandidates(action: ActionType): Promise<any> {
    const result = await this.getUserQuery.refetch({action});
    return result;
  }


  async getCandidateDetails(id: string): Promise<any> {
    const result: any = await this.apollo.watchQuery({
      query: gql`query getUserById($payload: String!) {
      userById(id: $payload) {
          _id
          identifierNumber
          lastName
          firstName
          emailAddress
          phoneNumber {
            countryCode
            number
          }
          address {
            addressLine1
            addressLine2
            postalCode
            city
            country
            province
          }

          socialProfile {
            linkedin
            twitter
            facebook
          }
      }
    }`
    }).refetch({payload: id});
    return result.data.userById;
  }

  deleteCandidate(action: {ids: string[]}) {
    return this.apollo.mutate({
      mutation: gql`mutation deleteUser($action: DeleteUserArg!){
      deleteUser(data:$action){
      message
      }
      }`,
      variables: {
        action: {
          ids: action.ids
        }
      },
    });
  }

  saveCandidate(candidateDetails: UserModel): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`mutation create($userData: CreateUserArgs!){
      createUser(userData:$userData){
      _id
      identifierNumber
      lastName
      firstName
      emailAddress
      address{
       city,
       country
      }
      phoneNumber{
      countryCode,
      number
      }
      }
      }`,
      variables: {
        userData: candidateDetails
      },
    });
  }

  updateCandidate(candidateDetails: UserModel): Observable<any> {
    return  this.apollo.mutate(
      {
        mutation : gql`mutation UPDATE($userData: UpdateUserArgs!){
      updateUser(data:$userData){
        _id
      identifierNumber
      lastName
      firstName
      emailAddress
      address{
       city,
       country
      }
      phoneNumber{
      countryCode,
      number
      }
      }
    }`,
        variables: {
          userData: candidateDetails
        },
      }
    )
  }

  getCountry() {
    return this.http.get('https://ipapi.co/json/')
  }

  getCountryState() {
    return this.http.get('assets/country-states.json')
  }

}
