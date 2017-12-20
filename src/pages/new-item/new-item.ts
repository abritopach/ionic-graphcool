import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';  
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the NewItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-item',
  templateUrl: 'new-item.html',
})
export class NewItemPage {

  categories$: Observable<any>;
  name: string;
  categoryId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public shoppingList: ShoppingListProvider) {
      this.categories$ = this.shoppingList.getAllCategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewItemPage');
  }

  save(){
    this.shoppingList.createItem(this.name, this.categoryId);
    this.viewCtrl.dismiss();
  }

}
