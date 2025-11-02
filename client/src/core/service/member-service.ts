import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Member, Photo } from '../../types/member';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private  accountService = inject(AccountService);

  getMembers() {
    // return this.http.get<Member[]>(this.baseUrl + 'members',this.getHttpOptions());
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMember(id:string) {
    // return this.http.get<Member>(this.baseUrl + 'members/' + id,this.getHttpOptions());
    return this.http.get<Member>(this.baseUrl + 'members/' + id);
  }
  getMemberPhotos(id:string) {
    // return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos',this.getHttpOptions());
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }
  // private getHttpOptions() {
  //   return {
  //     headers: {
  //       Authorization: `Bearer ${this.accountService.currentUser()?.token}`
  //     }
  //   };
  // }
}
