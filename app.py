from flask import Flask, request, jsonify
import stripe
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/integrate-stripe', methods=['POST'])
def integrate_stripe():
    data = request.get_json()

    stripe.api_key = data['stripe_secret_key'] # Set the stripe secret key

    # Create a new product
    product = stripe.Product.create(name=data['product_name'])

    # Create a price for the product
    if data['is_recurring']:
        price = stripe.Price.create(
            product=product.id,
            unit_amount=data['price_amount'],
            currency=data['price_currency'],
            recurring={"interval": "month"} # for example, this creates a monthly subscription
        )
    else:
        price = stripe.Price.create(
            product=product.id,
            unit_amount=data['price_amount'],
            currency=data['price_currency']
        )

     # Create a checkout session
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': price.id,
            'quantity': 1,
        }],
        mode='subscription' if data['is_recurring'] else 'payment',
        success_url=data['success_url'],
        cancel_url=data['cancel_url'],
    )

    # Generate the code needed to integrate a CheckoutSession
    checkout_session_code = f"""
    var stripe = Stripe('{data['stripe_publishable_key']}');

    stripe.redirectToCheckout({{
      sessionId: '{session.id}'
    }}).then(function (result) {{
      // If `redirectToCheckout` fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using `error.message`.
      if (result.error) {{
        alert(result.error.message);
      }}
    }}).catch(function (error) {{
      console.error("Error:", error);
    }});
    """
    
    return jsonify({'integration_code': checkout_session_code})

if __name__ == '__main__':
    app.run(debug=True)
