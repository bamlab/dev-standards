# Output SQL Alchemy ORM query

## Owner: [Xavier Lefevre](https://github.com/xavierlefevre)

## Steps

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
