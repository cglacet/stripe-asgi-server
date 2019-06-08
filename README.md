# ASGI Server for Strip Payments

Running the server:

```console
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

While you're still in development you can simply run:

```console
python server/server.py
```
