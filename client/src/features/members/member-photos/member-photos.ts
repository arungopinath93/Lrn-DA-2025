import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/service/member-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Member, Photo } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { ImageUpload } from "../../../shared/image-upload/image-upload";
import { AccountService } from '../../../core/service/account-service';
import { User } from '../../../types/users';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe, ImageUpload],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  private accountService = inject(AccountService)
  private route = inject(ActivatedRoute);
  // protected photos$?: Observable<Photo[]>;
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);


  // constructor() {
  //   const memberId = this.route.parent?.snapshot.paramMap.get('id');
  //   if (memberId) {
  //     // this.photos$ = this.memberService.getMemberPhotos(memberId);
  //     this.memberService.getMemberPhotos(memberId).subscribe({
  //       next: photos => this.photos.set(photos)
  //     });
  //   }
  // }
  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      // this.photos$ = this.memberService.getMemberPhotos(memberId);
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      });
    }
  }

  // get photoMocks() {
  //   return Array.from({ length: 20 }, (_, i) => ({
  //     url: '/user.png'
  //   }));
  // }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.photos.update(photos => [...photos,photo]);
        this.loading.set(false);
        this.memberService.editMode.set(false);
      },
      error: err => {
        console.log(err);
        this.loading.set(false);
      }
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) {
          currentUser.imageUrl = photo.url;
          
        }
        this.accountService.setCurrentUser(currentUser as User);
        this.memberService.member.update(member => ({
          ...member,
          imageUrl: photo.url
        }) as Member);
      }
    });
  }

  deletePhoto(photo: Photo) {
    debugger;
    this.memberService.deletePhoto(photo.id).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(p => p.id !== photo.id));
      }
    });
  }
}   