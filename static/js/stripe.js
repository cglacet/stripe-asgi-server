const stripe = Stripe('pk_test_6XtS5rPiYgsQvF6h872XpRjw00tTU6DCd0');

const stripeOptions = {
  "locale": "fr",
};

const elements = stripe.elements(stripeOptions);
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const paymentForm = document.getElementById("payment");

const cardholderName = document.getElementById('cardholder-name');
const cardButton = document.getElementById('card-button');
const clientSecret = cardButton.dataset.secret;

const successDiv = document.getElementById("success");
const failureDiv = document.getElementById("failure");
const failureReason = document.querySelector("#failure .reason");

const loading = document.getElementById("loading");

cardButton.addEventListener('click', async (ev) => {

  hide(cardButton);
  show(loading);

  const {paymentIntent, error} = await stripe.handleCardPayment(
    clientSecret, cardElement, {
      payment_method_data: {
        billing_details: {name: cardholderName.value}
      }
    }
  );

  if (error) {
    handleFailure(error);
  } else {
    handleSucces(paymentIntent);
  }
});

function handleSucces(paymentIntent){
  hide(loading);
  invisible(failureDiv);
  show(successDiv);
  visible(successDiv);
  hide(paymentForm);
  const {description, receipt_email, currency, amount} = paymentIntent;
  console.log(description, receipt_email, currency, amount);
  // Add try catch
  onPaymentFinished(paymentIntent);
}

function handleFailure(error){
  hide(loading);
  show(cardButton);
  invisible(successDiv);
  visible(failureDiv);
  console.log("Error with payment: ", error);
  failureReason.innerHTML = error.message;
}

function hide(element){
  element.style.display = "none";
}

function show(element){
  element.style.display = "";
}

function invisible(element){
  element.style.opacity = 0;
}

function visible(element){
  element.style.opacity = 1;
}