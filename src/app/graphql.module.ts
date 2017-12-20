import { NgModule } from '@angular/core';  
import { HttpClientModule } from '@angular/common/http';  
import { ApolloModule, Apollo } from 'apollo-angular';  
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';  
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { getMainDefinition } from 'apollo-utilities';

const simpleAPI = 'https://api.graph.cool/simple/v1/cj7vob8gx0xoj0132ofwwqgil';
const SUBSCRIPTION_ENDPOINT = 'wss://subscriptions.us-west-2.graph.cool/v1/cj7vob8gx0xoj0132ofwwqgil';

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {  
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
  ) {

    const myHttpLink = httpLink.create({ uri: simpleAPI });

    const mySubscriptionLink = new WebSocketLink({
      uri: SUBSCRIPTION_ENDPOINT,
      options: {
        reconnect: true,
        /*
        connectionParams: {
          authToken: authToken || null
        }
        */
      }
    });

    const link = split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      mySubscriptionLink,
      myHttpLink
    );

    apollo.create({
      link: link/*httpLink.create({ uri: simpleAPI })*/,
      cache: new InMemoryCache()
    });
  }
}

