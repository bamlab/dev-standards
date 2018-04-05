# Back-end performance tools and technics

- **Owner:** [Xavier Lefèvre](https://www.github.com/xavierlefevre)
- **Last update date:** 3rd of April 2018

## K6: Load-test your back-end with JavaScript written tests
[K6 official website](https://k6.io/)
Describe your routes test in JS and run them with simultaneous calls.

## Postman: Document and test the global performance of your routes with an interface
[Our BNP AM Postman configuration](https://github.com/theodo/bnp-postman)
Test your routes from always the same software and network, to have a point of comparison.

### iPhone: Simulate a network like LTE, 3G or Edge
- Make sure you iPhone is connected to the Wifi network
- Connect your computer to your iPhone via hotspot
- Go to the iPhone settings
- Then select: Developer > Network Link Conditioner
- Enable
- Select your desired network quality: LTE, 3G or Edge for instance
- Test your requests in Postman and see the result on the performance
> source: https://www.natashatherobot.com/simulate-bad-network-ios-simulator/

## Python: Simple and quick investigation of a function execution time
By using timer functions you can see how long takes the execution:
```python
import time
import logging

def retrieve_data(self, ids):
    # Start your time recording
    start_time = time.time()

    datas = Repository().get_data(ids).all()

    # First stop, to see how long took "get_data"
    first_record_time = time.time()
    logging.info('After getting datas: %s' %
                  str(first_record_time - start_time))

    answer = [{
        'id': str(data.id),
        'related_data': data.relation.to_dict() if data.relation else {}
    } for data in datas]

    # Second stop, to see how long took the answer construction
    second_record_time = time.time()
    logging.info('After building the final answer: %s' % str(second_record_time - first_record_time))

    return answer
```

## Python: More advanced solution to profile the execution of a function and its children
- https://blog.sicara.com/profile-surgical-time-tracking-python-db1e0a5c06b6

## Python: Further performance analysis tools
You can also profile with the below tool:
- https://docs.python.org/3/library/profile.html

## Python/SQL Alchemy: Output the ORM final query to analyse it
If your performance issues seem to come from your SQL queries, you should take a look at the output of SQL Alchemy:
- Log/print the SQL Alchemy query:
    ```python
    logging.info(self.session.query(
        Revision.portfolio_id,
        func.max(Revision.valuation_date).label('max_date')
    ))
    ```
- Retrieve what's printed in your logs and format it: https://sqlformat.org/
- Test the query against the database to see how to optimize it
