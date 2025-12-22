import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/service/member-service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Observable, single } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/service/account-service';

@Component({
  selector: 'app-member-details',
  imports: [AsyncPipe, RouterLink, RouterLinkActive,RouterOutlet,AgePipe],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css'
})
export class MemberDetails implements OnInit{
  
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private acccountService = inject(AccountService);
  // protected member$?: Observable<Member>;
  // protected member = signal<Member | undefined>(undefined);
  protected title = signal<string | undefined>('Profile');
  protected isCurrentUser = computed(()=>{
    debugger;
    return this.acccountService.currentUser()?.id  === String(this.route.snapshot.paramMap.get('id'));
  });

  ngOnInit(): void { 
    // this.member$ = this.loadMember();
    // this.route.data.subscribe({
    //   next: data => this.member.set(data['member'])
    // })
    this.title.set(this.route.firstChild?.snapshot?.title);

    // get route on changes to update title
    this.router.events.pipe(
      filter(event => event.constructor.name === "ActivationEnd")
    ).subscribe(() => {
      this.title.set(this.route.firstChild?.snapshot?.title);
    });
    
  }

  // loadMember(){
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if(!id) return;
  //   return this.memberService.getMember(id);
  // }
}
