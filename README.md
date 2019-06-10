# ASGI Server for servers-side Stripe PaymentIntents API

In order to run this server, you need to set the environnement variable `STRIPE_KEY` set with your private stripe token:

```console
export STRIPE_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Running the server:

```console
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

Alternatively, while you're still in development you can simply run:

```console
python server/server.py
```

Which will enable auto-reload of your application every time a local change is detected.

## What is this server for?

When working with Stripe you need to perform some actions secretly (using your secret API token), in order to
keep these secret some requests to the Stripe API will be done on the server-side of your application. This is
where this service comes in.

The `stripe-asgi-server` is a minimal working server that will perform all secret actions
using the [`async-stripe`][async-stripe] module, for all the outgoing requests.

[async-stripe]: https://github.com/cglacet/async-stripe