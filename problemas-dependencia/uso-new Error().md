## Diferencias al usar throw new Error y solo throw,

cuando no queremos enviar el error al cliente.
```python

throw new Error('ERROR_USERID_FAIL');

        status: 406,
        error: 'CANNOT_PROCESS_REQUEST',
        message: 'ERROR_USERID_FAIL',

```


cuando se desea enviar el error al cliente.
```python

throw 'ERROR_USERID_FAIL'

        status: 406,
        error: 'ERROR_USERID_FAIL',
        message: 'ERROR_USERID_FAIL',

```