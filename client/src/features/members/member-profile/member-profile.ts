import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/service/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/service/toast-service';
import { AccountService } from '../../../core/service/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe,FormsModule,TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit,OnDestroy {
 
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService)
  // private route = inject(ActivatedRoute);
  // protected member = signal<Member | undefined>(undefined);
  protected editableMember :  EditableMember= {
    displayName: '',
    description: '',
    city: '',
    country: '' 
  }
  private toast = inject(ToastService);
 
  ngOnInit(): void {
    // this.route.parent?.data.subscribe(data =>{
    //   this.member.set(data['member']);
    // });
    this.editableMember = {
      // displayName: this.member()?.displayName || '',
      // description: this.member()?.description || '',
      // city: this.member()?.city || '',
      // country: this.member()?.country || ''
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || ''
    };
  }

  updateProfile(){
    // if(!this.member()) return;
    // const updatedMember = { ...(this.member() ?? {}), ...(this.editableMember ?? {}) };
     if(!this.memberService.member()) return;
    const updatedMember = { ...(this.memberService.member() ?? {}), ...(this.editableMember ?? {}) };
    console.log(updatedMember);
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if(currentUser && (currentUser.displayName !== updatedMember.displayName)){
          this.accountService.setCurrentUser({...currentUser, displayName: updatedMember.displayName});
        }
        this.toast.success('Profile updated successfully');
        this.memberService.editMode.set(false);   
        this.memberService.member.set(updatedMember as Member);
        this.editForm?.reset(this.editableMember);
      }
    })
    // this.toast.success('Profile updated successfully');
    // this.memberService.editMode.set(false);   
  }

   ngOnDestroy(): void {
    if(this.memberService.editMode()){
      this.memberService.editMode.set(false);
    }
  }

}
