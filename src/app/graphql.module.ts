import { NgModule } from '@angular/core';  
import { HttpClientModule } from '@angular/common/http';  
import { ApolloModule, Apollo } from 'apollo-angular';  
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';  
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { getMainDefinition } from 'apollo-utilities';

const SIMPLE_API_ENDPOINT = 'https://api.graph.cool/simple/v1/cj7vob8gx0xoj0132ofwwqgil';
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

    const myHttpLink = httpLink.create({ uri: SIMPLE_API_ENDPOINT });

    const mySubscriptionLink = new WebSocketLink({
      uri: SUBSCRIPTION_ENDPOINT,
      options: {
        reconnect: true,
        /*
        connectionParams: {
          // You’ll need this if your server only accepts authenticated subscription requests.
          authToken: authToken || null
        }
        */
      }
    });

    /*
    Our app that has both GraphQL subscriptions as well as regular queries and mutations, so we’ll set things up with both a regular HTTP link 
    and a WebSocket link. 
    Split: an utility from the apollo-link package, will make it easy to direct requests to the correct link.
    split takes the query and returns a boolean. Here we check the query using another utility called getMainDefinition to extract the kind of query
    and operation name. From there, we can check if the query is a subscription and, if so, use the subscription link. Otherwise, the request will
    use the HTTP link.
    */
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

