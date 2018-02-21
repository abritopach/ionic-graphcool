import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
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

  toggle(item) {  
    let loading = this.loadingCtrl.create({
      content: "Updating Item..."
    });
    loading.present();
    this.shoppingList.toggleItem(item).subscribe(response => {
      loading.dismiss();
      console.log(response.data);
    },
    error => {
      loading.dismiss();
      console.log('Mutation Error:', error)
    });
  }
  
  goToAddItem() {  
    const modal = this.modalCtrl.create('NewItemPage');
    modal.present();
  }
  
  delete(item) {  
    let loading = this.loadingCtrl.create({
      content: "Deleting Item..."
    });
    loading.present();
    this.shoppingList.deleteItem(item).subscribe(response => {
      loading.dismiss();
      console.log(response.data)
    },
    error => {
      loading.dismiss();
      console.log('Mutation Error:', error)
    }
    )}
}
