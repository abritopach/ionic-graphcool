import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';  
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';

/**
 * Generated class for the ItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {

  items$: Observable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public shoppingList: ShoppingListProvider) {

    const category = navParams.get("category");

    if (category) {
      this.items$ = shoppingList.getItems(category);
    }
    else {
      this.items$ = shoppingList.getAllItems()
    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsPage');
  }

}
