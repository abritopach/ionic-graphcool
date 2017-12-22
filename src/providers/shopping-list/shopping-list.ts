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

// Mutation query update item.
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

// Mutation query create item.
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

// Mutation query delete item.
const mutationDeleteItem = gql`  
mutation($id: ID!) {  
  deleteItem(id: $id) {
    id
  }
}
`;

// SUBSCRIPTIONS

/*
Subscriptions are a powerful GraphQL feature that make it easy to receive updates from a backend server in real time using a technology like 
WebSockets on the frontend.
*/

/*
Subscription query that we’ll run to automatically receive new todos created on the server.
*/
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


  /*
    We don't need to manually update our in-memory cache because Apollo Client takes care of that for us. We defined in our mutation that the
    backend should send us back the id and the done properties. Apollo Client will automatically identify the item in the cache by the id and
    subsequently update the done property.
  */
  public toggleItem(item: any): Observable<any> {  
    return this.apollo.mutate({
      mutation: mutationToggleItem,
      variables: {
        id: item.id,
        done: !item.done
      }
    });
    /*
    this.apollo.mutate({
      mutation: mutationToggleItem,
      variables: {
        id: item.id,
        done: !item.done
      }
    })
    .subscribe(response => console.log(response.data),
               error => console.log('Mutation Error:', error));
               */
  }

  public createItem(name, categoryId): Observable<any> {  
    return this.apollo.mutate({
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
    /*
    .subscribe(response => console.log(response.data),
               error => console.log('Mutation Error:', error));
    */
  }

  /*
  Notice the update function where the cache is updated for the allItems query. We have to manually update the cache now to add the new item, 
  Apollo Client does not do that automatically for you in the case of an insert or delete.
  */
  public deleteItem(item: any): Observable<any> {  
    return this.apollo.mutate({
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
    /*
    .subscribe(response => console.log(response.data),
               error => console.log('Mutation Error:', error));
    */
  }

  /*
  subscriptionNewItem(): Observable<any> {
    return this.apollo
      .subscribe({
        query: subscriptionNewItem
      });
  }
  */


  /*
  subscribeToMore takes a query document (our subscription query), variables if needed and an update query function that gets the data from the
  previous query and an object that contains our subscription data (subscriptionData).
  */
  public subscribeToNewItem(queryWatcher: QueryRef<any>) {
    queryWatcher.subscribeToMore({
      document: subscriptionNewItem,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const newItem = subscriptionData.data.Item.node;

        // Add check to prevent double adding of items.
        if (!prev['allItems'].find((item) => item.name === newItem.name)) {
          return Object.assign({}, prev, {
            allItems: [...prev['allItems'], newItem]
          })
        } else {
          return prev;
        }
      }
    });
  }

}
