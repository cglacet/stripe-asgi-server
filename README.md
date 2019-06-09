# ASGI Server for Strip Payments

In order to run this server, you need to set the environnement variable `` set with your private stripe token:

```console
export STRIPE_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Running the server:

```console
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

While you're still in development you can simply run:

```console
python server/server.py
```

Using this second command will auto-reload your application every time a modification is detected.
