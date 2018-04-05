# General learnings (from investigating backend performance issues)

- **Owner:** [Xavier Lefèvre](https://www.github.com/xavierlefevre)
- **Last update date:** 3rd of April 2018

## Cache your routes
- Use a tool like Varnish to cache stable routes and optimize the performance to response times below 0.1s

## Save and serve your images as static files
- Save and serve the image file on the server in a specific folder, and keep its URL in the database in order to access it from your front

## Reduce your number of SQL queries
- SQL is extremely powerful to retrieve and manipulate big chunks of data, but not so powerful if you want to access data 1000 times in one request
    - By default some ORMs will lazy load your model, meaning that it will load the model you want but keep references of the relations
    - If you want to access those relations, it will only re-query the database later, in a loop for instance, it might send thousants of queries to retrieve relations
    - By join-loading the main SQL query, you make sure that you retrieve the relation directly, the ORM will join the model and its relations from the main first query
    - Then if you access one of the relation, it will already be available in the response object
    - See an example with SQL Alchemy: http://docs.sqlalchemy.org/en/latest/orm/loading_relationships.html
