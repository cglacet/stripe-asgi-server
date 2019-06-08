"""This is a server that allows to use the Payment intents from Stripe.

Quickstart guide from Stipe can be found here (this server is an implementation of this quickstart guide):
    https://stripe.com/docs/payments/payment-intents/quickstart


While in developement, you can run::
    uvicorn server:app --reload

For production server, you may want to run something that look like::
    gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker

Author: `cglacet cglacet`_

.. _cglacet: https://github.com/cglacet
"""
from babel import numbers, Locale

from fastapi import FastAPI
from starlette.requests import Request
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from async_stripe import Stripe

DEFAULT_LOCALE = "fr_FR"

app = FastAPI()
stripe = Stripe()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.on_event("startup")
async def startup_event():
    await stripe.start_session()
    print("Stripe session opened.")

@app.on_event("shutdown")
async def shutdown_event():
    await stripe.close_session()
    print("Stripe session closed.")


@app.get('/checkout')
async def checkout(request: Request, amount: str, currency: str, receipt_email: str):
    params = {
        "amount": amount,
        "currency": currency,
        "receipt_email": receipt_email,
    }
    options = {
        "description": "Test payement",
        "statement_descriptor": "Kune.tech",
    }
    async with stripe.create_payment(**params, **options) as response:
        payment = await response.json()
        local_price_tag = stripe_price_tag(payment["amount"], payment["currency"])
        payment_client_info = ["client_secret"]  # You can add more values to be passed to the client, eg.  "amount", "currency", ...
        template_params = {
            "request": request,
            "local_price_tag": local_price_tag,
            **{k: payment[k] for k in payment_client_info}
        }
    return templates.TemplateResponse("checkout.html", template_params)

@app.get('/update/{payement_intent}')
async def update(payement_intent: str, amount: str, currency: str = None, order_id: str = None):
    params = {
        "amount": amount,
    }
    if order_id is not None:
        params["metadata"] = {
            "order_id": order_id,
        }
    if currency is not None:
        params["currency"] = currency
    async with stripe.modify_payment(payement_intent, **params) as response:
        payment = await response.json()
        payment_intent = payment["id"]
        print("Updated payment", payment["amount"], payment["currency"])


def _custom_format_currency(value, currency, locale):
    value = numbers.decimal.Decimal(value)
    locale = Locale.parse(locale)
    pattern = locale.currency_formats['standard']
    force_frac = ((0, 0) if value == int(value) else None)
    return pattern.apply(value, locale, currency=currency, force_frac=force_frac)

def stripe_price_tag(amount_cts, currency, locale=DEFAULT_LOCALE, **kwargs):
    """Format price according to an optional ``locale``.
    For example::

        >>> format_price(1000, "EUR")
        10 €
        >>> format_price(1050, "EUR")
        10,50 €
        >>> format_price(1050, "EUR", locale="en_US")
        €10.50
    """
    amount = amount_cts/100
    # http://babel.pocoo.org/en/latest/api/numbers.html#babel.numbers.format_currency:
    # return numbers.format_currency(amount, currency.upper(), locale=locale, decimal_quantization=False, **kwargs)
    # https://github.com/python-babel/babel/issues/478#issuecomment-290365787:
    return _custom_format_currency(amount, currency.upper(), locale)

if __name__ == "__main__":
    import uvicorn
    import os
    script_py_name = os.path.basename(__file__)
    script_name = os.path.splitext(script_py_name)[0]
    uvicorn.run(f"{script_name}:app", reload=True, debug=True, log_level="info")