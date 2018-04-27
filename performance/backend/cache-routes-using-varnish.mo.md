# [MO] Cache your routes using varnish (~45 min)

## Owner: [Xavier Lefevre](https://github.com/xavierlefevre)

## Control points

{% hint style='success' %} 

If, _as an expert of caching_, you want to adapt the standard to the context of your project, you have to check that:

{% endhint %}

* [ ] if the data is not in cache, you redirect to the backend
* [ ] you don't cache authenticated requests
* [ ] you don't cache requests that mutate data on the server (POST/PUT/DELETE in REST)
* [ ] the cache duration is respecting business needs
  * example: a football game score can't be cached more than 1 min for a live match but can be cached forever for a finished game
* [ ] you respect cache headers, like [Cache-Control](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Cache-Control)

## Why

Using a tool like Varnish to cache routes in order to optimize the response performance below 0.1s.

## Steps

{% hint style='warning' %}

**TODO**

If you fall on this method of operation and want to fill it don't hesitate! It will help others.
You ca for instance, look at this article https://medium.com/about-developer-blog/varnish-58c5d8269269 and convert it to a M33 like steps (short steps and check after after each steps) when you use it.

A good MO example: [Setup HTTPS on your docker environment](../../ops/docker/deploy-with-https.mo.md)

{% endhint %}
