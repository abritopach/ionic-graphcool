import { Injectable } from '@angular/core'; 
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';

import { Apollo } from 'apollo-angular';  
import gql from 'graphql-tag';

const queryAllItems = gql`  
  query allItems {
    allItems {
      id
      name
      done
      category {
        id
      }
    }
  }
`;

const queryAllCategories = gql`  
  query allCategories {
    allCategories {
      id
      name
    }
  }
`;

/*
  Generated class for the ShoppingListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShoppingListProvider {

  constructor(private apollo: Apollo) {
    console.log('Hello ShoppingListProvider Provider');
  }

  public getAllItems(): Observable<any> {
    const queryWatcher = this.apollo.watchQuery<any>({
      query: queryAllItems
    });

    return queryWatcher.valueChanges
      .map(result => result.data.allItems);
  }

  public getAllCategories() : Observable<any> {  
    const queryWatcher = this.apollo.watchQuery<any>({
      query: queryAllCategories
    });
  
    return queryWatcher.valueChanges
      .map(result => result.data.allCategories);
  }

  public getItems(category: any): Observable<any> {  
    return this.getAllItems()
      .map(data => data.filter(i => i.category && i.category.id == category.id));
  }

}