import { Injectable } from '@angular/core'; 
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';

import { Apollo } from 'apollo-angular';  
import gql from 'graphql-tag';
import { Query } from '@angular/compiler/src/core';
import { QueryRef } from 'apollo-angular/QueryRef';

// QUERIES.

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

// MUTATIONS.

const mutationToggleItem = gql`  
  mutation($id: ID!, $done: Boolean) {
    updateItem(
      id: $id
      done: $done
    ) {
      id
      done
    }
  }
`;

const mutationCreateItem = gql`  
mutation($name: String!, $categoryId: ID) {  
  createItem(
    name: $name,
    done: false,
    categoryId: $categoryId
  ) {
    id,
    name,
    done,
    category {
      id
    }
  }
}
`;

const mutationDeleteItem = gql`  
mutation($id: ID!) {  
  deleteItem(id: $id) {
    id
  }
}
`;

// SUBSCRIPTIONS

const subscriptionNewItem = gql`
subscription newItem {
  Item(
    filter: {
      mutation_in: [CREATED]
    }
  ) {
    mutation
    node {
      id
      name
      done
      category {
        id
      }
    }
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

  public queryAllItems(): QueryRef<any> {
    const queryWatcher = this.apollo.watchQuery<any>({
      query: queryAllItems
    });
    return queryWatcher;
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

  public toggleItem(item: any): void {  
    this.apollo.mutate({
      mutation: mutationToggleItem,
      variables: {
        id: item.id,
        done: !item.done
      }
    })
    .subscribe(response => console.log(response.data),
               error => console.log('Mutation Error:', error));
  }

  public createItem(name, categoryId): void {  
    this.apollo.mutate({
      mutation: mutationCreateItem,
      variables: {
        name: name,
        categoryId: categoryId
      },
      update: (proxy, { data: { createItem } }) => {
  
        // Read the data from the cache for the allItems query
        const data: any = proxy.readQuery({ query: queryAllItems });
  
        // Add the new item to the data
        data.allItems.push(createItem);
  
        // Write the data back to the cache for the allItems query
        proxy.writeQuery({ query: queryAllItems, data });
      }
    })
    .subscribe(response => console.log(response.data),
               error => console.log('Mutation Error:', error));
  }

  public deleteItem(item: any): void {  
    this.apollo.mutate({
      mutation: mutationDeleteItem,
      variables: {
        id: item.id
      },
      update: (proxy, { data: { deleteItem } }) => {
        // Read the data from the cache for the allItems query
        let data: any = proxy.readQuery({ query: queryAllItems });
  
        // Remove the item from the data
        data.allItems = data.allItems.filter(i => i.id !== deleteItem.id);
  
        // Write the data back to the cache for the allItems query
        proxy.writeQuery({ query: queryAllItems, data });
      }
    })
    .subscribe(response => console.log(response.data),
               error => console.log('Mutation Error:', error));
  }

  /*
  subscriptionNewItem(): Observable<any> {
    return this.apollo
      .subscribe({
        query: subscriptionNewItem
      });
  }
  */

  public subscribeToNewItem(queryWatcher: QueryRef<any>) {
    queryWatcher.subscribeToMore({
      document: subscriptionNewItem,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const newItem = subscriptionData.data.Item.node;
        return Object.assign({}, prev, {
          allItems: [...prev['allItems'], newItem]
        })
      }
    });
  }

}
