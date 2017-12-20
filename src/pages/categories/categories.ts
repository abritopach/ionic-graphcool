import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';  
import { ShoppingListProvider } from '../../providers/shopping-list/shopping-list';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  categories$: Observable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public shoppingList: ShoppingListProvider) {
    this.categories$ = shoppingList.getAllCategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  showItems(category) {
    this.navCtrl.push('ItemsPage', { category: category });
  }

}
