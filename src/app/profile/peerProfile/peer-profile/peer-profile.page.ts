import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { PopoverController } from '@ionic/angular';
import { WantListModal } from '../../../want_list_modal/want_list_modal.component';
import { AddListingModal } from '../../../add_listing_modal/add_listing_modal.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router'
import { _ } from 'underscore';

@Component({
  selector: 'app-peer-profile',
  templateUrl: './peer-profile.page.html',
  styleUrls: ['./peer-profile.page.scss'],
})
export class PeerProfilePage implements OnInit {
  img: string;
  me: any;
  peer: any;
  user: any;
  school: string;
  offers: object[];
  wants: any[];
  listings: any[];
  entireListings: any[];
  possibleBooks: any[] = [];

  constructor(private apiService: ApiService, public modal: ModalController, private router: Router,) {}

  getPeerBooks(id, callback) {
    this.apiService.getPeerProfile(id, callback);
  }

  getYourBooks() {
    this.apiService.renderListingsList(this.setYourBooks);
  }

  getYourWants() {
    this.apiService.renderWantList(this.setYourWants);
  }

  setYourBooks(data) {
    console.log(data);
    let lists = this.wants.map(list => list.title);
    console.log(lists);
    let xRefer = data.filter(piece => lists.includes(piece.book.title));
    this.possibleBooks.push(xRefer);
    console.log(this.possibleBooks);
  }

  setYourWants(data) {
    console.log(data);
    let wants = this.listings.map(want => want.title);
    console.log(wants);
    let xRefer = data.filter(piece => wants.includes(piece.title));
    this.possibleBooks.push(xRefer);
    console.log(this.possibleBooks);
  }

  async setBooks(data) {
    console.log(data);
    let temp = data.slice(0, 1)
    this.wants = temp;
    this.listings = data[1];
    this.entireListings = data[2];
    console.log(this.entireListings);
    this.getYourBooks();
    this.getYourWants();
  }

  makeOffer(bookWanted: any, myOffer: any) {
    let want = bookWanted.split('')
    want[0] = '';
    want[want.length - 1] = '';
    let newWant = want.join('');
    let off = myOffer.split('')
    off[0] = '';
    off[off.length - 1] = '';
    let newOff = off.join('');
    console.log(newOff);
    let wanted = _.filter(this.listings, list => list.title === newWant);
    let offered = this.possibleBooks[0].filter(book => newOff === book.book.title);
    console.log(wanted, offered);
    this.apiService.sendOffer({ 
      bookWanted: this.entireListings[0],
      bookOffering: offered[0].id_listing,
    });
  }

  setUser(data) {
    let user: any = JSON.parse(localStorage.getItem('selectedUser'));
    // console.log(data);
    this.user = data || user.nickname;
  }
  ngOnInit() {
    this.me = JSON.parse(localStorage.userid);
    this.peer = JSON.parse(localStorage.getItem('selectedUser'));

    this.wants = [
      {
        title: 'Computer science 101: how to be toxic on stack overflow',
        ISBN: 8675309
      },
      {
        title: 'Computer science 102: Why backbone is the best',
        ISBN: 5551234
      },
      {
        title: 'ZOMG! Those coding bootcamps steal jobs',
        ISBN: 8000000
      }
    ];
    this.setYourBooks = this.setYourBooks.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setBooks = this.setBooks.bind(this);
    this.getPeerBooks = this.getPeerBooks.bind(this);
    this.getPeerBooks(this.peer.listing.id_user, this.setBooks);
    this.setYourWants = this.setYourWants.bind(this);
    
  }

}
