const stripe = Stripe('pk_test_6XtS5rPiYgsQvF6h872XpRjw00tTU6DCd0');

const stripeOptions = {
  "locale": "fr",
};

const elements = stripe.elements(stripeOptions);
const cardElement = elements.create('card');
cardElement.mount('#card-element');

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
  hide(failureDiv);
  hide(loading);
  show(successDiv);
  const {description, receipt_email, currency, amount} = paymentIntent;
  console.log(description, receipt_email, currency, amount);
}

function handleFailure(error){
  hide(successDiv);
  hide(loading);
  show(failureDiv);
  show(cardButton);
  failureReason.innerHTML = error.message; //JSON.stringify(error, null, '\t');
}

function hide(element){
  element.style.display = "none";
}

function show(element){
  element.style.display = "";
}

// // From : https://stripe.com/docs/stripe-js#elements

// // Create a Stripe client.
// var stripe = Stripe('pk_test_6XtS5rPiYgsQvF6h872XpRjw00tTU6DCd0');

// // Create an instance of Elements.
// var elements = stripe.elements();

// // Custom styling can be passed to options when creating an Element.
// // (Note that this demo uses a wider set of styles than the guide below.)
// var style = {
//   base: {
//     color: '#32325d',
//     fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//     fontSmoothing: 'antialiased',
//     fontSize: '16px',
//     '::placeholder': {
//       color: '#aab7c4'
//     }
//   },
//   invalid: {
//     color: '#fa755a',
//     iconColor: '#fa755a'
//   }
// };

// // Create an instance of the card Element.
// var card = elements.create('card', {style: style});

// // Add an instance of the card Element into the `card-element` <div>.
// card.mount('#card-element');

// // Handle real-time validation errors from the card Element.
// card.addEventListener('change', function(event) {
//   var displayError = document.getElementById('card-errors');
//   if (event.error) {
//     displayError.textContent = event.error.message;
//   } else {
//     displayError.textContent = '';
//   }
// });

// // Handle form submission.
// var form = document.getElementById('payment-form');
// form.addEventListener('submit', function(event) {
//   event.preventDefault();

//   stripe.createToken(card).then(function(result) {
//     if (result.error) {
//       // Inform the user if there was an error.
//       var errorElement = document.getElementById('card-errors');
//       errorElement.textContent = result.error.message;
//     } else {
//       // Send the token to your server.
//       stripeTokenHandler(result.token);
//     }
//   });
// });

// // Submit the form with the token ID.
// function stripeTokenHandler(token) {
//   // Insert the token ID into the form so it gets submitted to the server
//   var form = document.getElementById('payment-form');
//   var hiddenInput = document.createElement('input');
//   hiddenInput.setAttribute('type', 'hidden');
//   hiddenInput.setAttribute('name', 'stripeToken');
//   hiddenInput.setAttribute('value', token.id);
//   form.appendChild(hiddenInput);

//   // Submit the form
//   form.submit();
// }