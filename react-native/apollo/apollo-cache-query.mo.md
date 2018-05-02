# [MO] Make an query into Apollo Cache _(~35 min)_

## Owner: Arthur Levoyer https://github.com/Arlevoy

## When do I need this?

You are using apollo with graph-ql and you want to do a query using data in your cache. (not provided by your Apollo client in the first place)

## Prerequisites _(~20 min)_

* [ ] Have setup an Apollo cache in your apollo client configuration:

```javascript
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";

const httpLink = new HttpLink({
  uri: YOUR_API_ENDPOINT
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache
});

export default client;
```

* [ ] Having made a first query through network

You want to have get all the books in your collections.

You do the following query using graph-gql:

```javascript
Query allMyBooks {
    books {
          id
          name
          author {
            id
            name
          }
      }
}
```

Apollo checks if the data is already there in the cache. As this the first time you're doing this request, Apollo does the request through network. In case of success the following array is returned:

```javascript
[
  {
    id: 1,
    name: "The Jungle Book",
    author: {
      id: 3,
      name: "Disney",
      __typename: "Author"
    },
    __typename: "Book"
  },
  {
    id: 2,
    name: "Cinderella",
    author: {
      id: 3,
      name: "Disney",
      __typename: "Author"
    },
    __typename: "Book"
  }
];
```

Apollo is then registrering the following into cache:

books(): [1, 2]
'Book:1': {
id: 1,
name: "The Jungle Book",
author: 'Author:3'
\_\_typename: 'Book'
}
'Book:2': {
id: 2,
name: "Cinderella",
author: 'Author:3'
\_\_typename: 'Book'
}
'Author:3': {
id: 3,
name: 'Disney',
\_\_typename: 'Author'
}

In other word, it denormalizes the cache and will allow us in the future to quickly modify it.

Next time this request is done, Apollo will return data from cache (no network query): by default, Apollo does a 'cache-first' query.
If you want to force Apollo to do query through network, use the 'newtork-first' option.

* [] Make sure you have read the following
* [] Make sure the query you want to do in cache uses properties that were already requested through network (if you never asked for an author's book in the first place, there is no way you will be able to get it in the cache)

## Steps _(~15 min)_

Doing a query within Apollo cache

You now want to request datas that are stored in your cache with a customize query not known by the Apollo Client, in this example you want to be able to require one book by its Id.
In order to do so, you can use cacheResolvers. In your client.js file, add the following to your InMemoryCache:

```javascript
import { toIdValue } from "apollo-utilities";

const cache = new InMemoryCache({
  cacheResolvers: {
    Query: {
      book: (_, args) =>
        toIdValue(
          cache.config.dataIdFromObject({ __typename: "Book", id: args.id }) // return Book:xxxx-xxxx-xxxx-xxxx
        ) // return {generated:false, id:"Book:xxxx-xxxx-xxxx-xxxx", type:"id", typename:undefined}
    }
  }
});
```

In the resolver below, you are manipulating the type Book and creating a query that will return the book given an id. If you are used to Redux, it's very similar to selectors.

Which means in your application you will be allow to use the following:

```javascript
Query bookById($id) {
book (id: $id) {
id
name
}
}
```

Be careful though, as your API Apollo Client does not know this query, make sure to do pass 'cache-only' to your Query.
