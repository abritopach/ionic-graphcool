import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';  
import { Subscription } from 'rxjs/Subscription';
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';
import { QueryRef } from 'apollo-angular/QueryRef';
import { ItemModel } from '../../models/item.model';

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
  //items: ItemModel[] = [];
  queryAllItems: QueryRef<any>;
  itemSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public shoppingList: ShoppingListProvider,
              public modalCtrl: ModalController, public loadingCtrl: LoadingController) {

    const category = navParams.get("category");

    if (category) {
      this.items$ = this.shoppingList.getItems(category);
    }
    else {

      let loading = this.loadingCtrl.create({
        content: "Loading Items..."
      });

      loading.present();

      this.items$ = this.shoppingList.getAllItems();
      this.items$.subscribe(
        data => {
            loading.dismiss();
        },
        error => {
            console.log(<any>error);
            loading.dismiss();
        }
      );
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsPage');

    this.queryAllItems = this.shoppingList.queryAllItems();

    this.itemSubscription = this.queryAllItems.valueChanges.subscribe(
        ({ data }) => {
          //console.log(data);
          //this.x = [...data.allItems];
          //console.log(this.x);
        }
      );

      this.shoppingList.subscribeToNewItem(this.queryAllItems);

    /*
    this.itemSubscription = this.shoppingList.subscriptionNewItem()
      .subscribe(({ data }) => {
        console.log(data);
      });
      */
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload ItemsPage');
    this.itemSubscription.unsubscribe();
  }

  toggle(item) {  
    this.shoppingList.toggleItem(item).subscribe(response => console.log(response.data),
    error => console.log('Mutation Error:', error));
  }
  
  goToAddItem() {  
    const modal = this.modalCtrl.create('NewItemPage');
    modal.present();
  }
  
  delete(item) {  
    this.shoppingList.deleteItem(item).subscribe(response => console.log(response.data),
    error => console.log('Mutation Error:', error));
  }

}
