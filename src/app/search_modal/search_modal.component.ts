import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-modals',
  templateUrl: './search_modal.component.html',
  styleUrls: ['./search_modal.scss'],
})

export class SearchModal implements OnInit {
  isbnQuery: string = '';
  listings: any = [];

  constructor(public modal: ModalController, private http: HttpClient) { }

  async closeModal() {
    this.modal.dismiss();
  }

  // function that takes in isbn number from input field
  // and sends get req to api server /search/listing/isbn
    // returns all listings of book
  searchBooks() {
    console.log(this.isbnQuery)
    this.http.get(`ec2-18-188-132-186.us-east-2.compute.amazonaws.com:3000/search/listing/isbn?${this.isbnQuery}`)
    .subscribe((searchedListings: any) => {
      console.log(searchedListings, 'BOOKS USER HAS SEARCHED FOR');
      localStorage.setItem('searchedListings', searchedListings);
      console.log(localStorage);
    })

    this.closeModal();
  }


  ngOnInit() {

  }

}
