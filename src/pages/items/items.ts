import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public shoppingList: ShoppingListProvider,
              public modalCtrl: ModalController) {

    const category = navParams.get("category");

    if (category) {
      this.items$ = this.shoppingList.getItems(category);
    }
    else {
      this.items$ = this.shoppingList.getAllItems();
      console.log("items$", this.items$);
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsPage');

    /*
    this.itemSubscription = this.shoppingList.subscriptionNewItem()
      .subscribe(({ data }) => {
        console.log(data);
      });
      */
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload ItemsPage');
    //this.itemSubscription.unsubscribe();
  }

  toggle(item) {  
    this.shoppingList.toggleItem(item);
  }
  
  goToAddItem() {  
    const modal = this.modalCtrl.create('NewItemPage');
    modal.present();
  }
  
  delete(item) {  
    this.shoppingList.deleteItem(item);
  }

}
