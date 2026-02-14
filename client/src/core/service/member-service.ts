import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { EditableMember, Member, Photo } from '../../types/member';
import { AccountService } from './account-service';
import { tap } from 'rxjs';
import { PaginatedResponse } from '../../types/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private  accountService = inject(AccountService);
  editMode = signal(false);
  member = signal<Member | null>(null);
  getMembers(pageNumber:number, pageSize:number) {
    // return this.http.get<Member[]>(this.baseUrl + 'members',this.getHttpOptions());
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Member>>(this.baseUrl + 'members', { params });
  }

  getMember(id:string) {
    // return this.http.get<Member>(this.baseUrl + 'members/' + id,this.getHttpOptions());
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap(member => this.member.set(member))
    );
  }
  getMemberPhotos(id:string) {
    // return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos',this.getHttpOptions());
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }
  updateMember(member: EditableMember) {
    // return this.http.put(this.baseUrl + 'members', member,this.getHttpOptions());
    return this.http.put(this.baseUrl + 'members', member);
  }
  // private getHttpOptions() {
  //   return {
  //     headers: {
  //       Authorization: `Bearer ${this.accountService.currentUser()?.token}`
  //     }
  //   };
  // }
  uploadPhoto(file: File) {
    debugger;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photos', formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'members/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId);  
  }
}
