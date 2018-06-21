# Python investigation tools

## Owner: [Xavier Lefevre](https://github.com/xavierlefevre)

## Steps

### Python: Simple and quick investigation of a function execution time

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

### Python: More advanced solution to profile the execution of a function and its children
- https://blog.sicara.com/profile-surgical-time-tracking-python-db1e0a5c06b6

### Python: Further performance analysis tools
You can also profile with the below tool:
- https://docs.python.org/3/library/profile.html
