import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/service/member-service';
import { Observable } from 'rxjs';
import { Member, MemberParams } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResponse } from '../../../types/pagination';
import { Paginator } from '../../../shared/paginator/paginator';
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe, MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') filterModalRef!: FilterModal;
  private memberService = inject(MemberService);
  // protected paginatedResponse$?: Observable<PaginatedResponse<Member>>;
  protected paginatedResponse = signal<PaginatedResponse<Member> | null>(null);
  protected memberParams = new MemberParams();
  private updatedParams = new MemberParams();
  // constructor() {
  //   this.loadMembers();
  // }
  constructor() {
    const filter = localStorage.getItem('filters');
    if (filter) {
      this.memberParams = JSON.parse(filter);
      this.updatedParams = JSON.parse(filter);
    } 
    
  }
  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers() {
    // this.paginatedResponse$ = this.memberService.getMembers(this.pageNumber, this.pageSize);
    this.memberService.getMembers(this.memberParams).subscribe({
      next: (response) => {
        this.paginatedResponse.set(response);
      }
    });
  }
  onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }
  openFilterModal() {
    this.filterModalRef.open();
  }
  onFilterSubmit(params: MemberParams) {
    this.memberParams = params;
    this.updatedParams = params;
    this.loadMembers();
    console.log('Filter submitted with params:', params);
  }
  onFilterClose() {    // Handle any actions needed when the filter modal is closed without submitting
    console.log('Filter modal closed without submitting');
  } 
  resetFilters() {
    this.memberParams = new MemberParams();
    this.loadMembers();
  }

  get displayMessages() : string{
    const defaultParams = new MemberParams();
    const filters: string[] = [];

    if(this.updatedParams.gender){
      filters.push(this.updatedParams.gender + 's');
    }else{
      filters.push('Males and Females');
    }

    if(this.updatedParams.minAge !== defaultParams.minAge || this.updatedParams.maxAge !== defaultParams.maxAge){
      filters.push(`ages ${this.updatedParams.minAge} - ${this.updatedParams.maxAge}`);
    }

    filters.push(this.updatedParams.orderBy === 'lastActive' ? 'last active' : 'creation date');

    return filters.length > 0 ? `Filtering by ${filters.join(' | ')}` : 'No filters applied';
  }
}
