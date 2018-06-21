# [MO] Minimize your number of SQL queries

## Owner: [Xavier Lefevre](https://github.com/xavierlefevre)

## Control points

* [ ] you don't lazy load data that you need to access directly

## Why

SQL is extremely powerful to retrieve and manipulate big chunks of data, but not powerful if you want to access data 1000 times in a row

## Steps

- By default some ORMs lazy load relations: meaning that it will load the model you want but keep references of the relations
  - If you want to access those relations, it will only re-query the database later, in a loop for instance, it might send thousants of queries to retrieve relations
  - By join-loading the main SQL query, you make sure that you retrieve the relation directly, the ORM will join the model and its relations from the main first query
  - Then if you access one of the relation, it will already be available in the response object
  - See an example with SQL Alchemy: http://docs.sqlalchemy.org/en/latest/orm/loading_relationships.html

{% hint style='warning' %}

**TODO**

If you fall on this method of operation and want to fill it don't hesitate! It will help others.
You ca for instance, look at this article https://medium.com/about-developer-blog/varnish-58c5d8269269 and convert it to a M33 like steps (short steps and check after after each steps) when you use it.

A good MO example: [Setup HTTPS on your docker environment](../../ops/docker/deploy-with-https.mo.md)

{% endhint %}
