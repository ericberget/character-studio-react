# Stripe Payment Integration Setup Guide

## 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a new account or log in
3. Complete account verification (required for live payments)

## 2. Get API Keys

### Test Mode (Development)
1. In Stripe Dashboard, ensure you're in **Test mode** (toggle in top-left)
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### Live Mode (Production)
1. Switch to **Live mode** in Stripe Dashboard
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_live_`)
4. Copy your **Secret key** (starts with `sk_live_`)

## 3. Configure Environment Variables

### Frontend (.env file)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Backend (Netlify Environment Variables)
In your Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add these variables:
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 4. Create Products and Prices

### In Stripe Dashboard:
1. Go to **Products**
2. Click **Add product**

### Starter Plan ($5/month)
```
Product name: Character Studio Starter
Description: 200 tokens per month for character generation
Price: $5.00 USD
Billing period: Monthly
```

### Pro Plan ($20/month)
```
Product name: Character Studio Pro
Description: 800 tokens per month for character generation
Price: $20.00 USD
Billing period: Monthly
```

### Copy Price IDs
After creating products, copy the **Price IDs** (start with `price_`) and update them in:
`src/lib/stripe.ts` → `STRIPE_CONFIG.PRODUCTS`

## 5. Set Up Webhooks

### Create Webhook Endpoint
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Get Webhook Secret
1. After creating the webhook, click on it
2. Go to **Signing secret**
3. Copy the webhook secret (starts with `whsec_`)
4. Add it to your Netlify environment variables

## 6. Test the Integration

### Test Cards
Use these test card numbers in Stripe's test mode:

```
Successful payment: 4242 4242 4242 4242
Declined payment: 4000 0000 0000 0002
Requires authentication: 4000 0025 0000 3155
```

### Test Flow
1. Start your development server
2. Go to pricing page
3. Click "Get Started" on a paid plan
4. Use test card: 4242 4242 4242 4242
5. Complete checkout
6. Verify webhook events in Stripe Dashboard

## 7. Go Live

### Switch to Live Mode
1. Update environment variables with live keys
2. Update webhook endpoint URL to production domain
3. Test with real payment methods
4. Monitor webhook events and logs

## 8. Monitoring and Analytics

### Stripe Dashboard
- Monitor payments, subscriptions, and churn
- Set up alerts for failed payments
- Track revenue and customer metrics

### Webhook Monitoring
- Check webhook delivery logs
- Monitor failed webhook attempts
- Set up retry mechanisms for critical events

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**
   - Ensure webhook secret is correct
   - Check that raw body is passed to webhook handler

2. **Checkout session creation fails**
   - Verify API keys are correct
   - Check that price IDs exist and are active

3. **Payments not processing**
   - Ensure you're using the correct mode (test/live)
   - Check that webhook endpoint is accessible

### Debug Mode
Enable Stripe debug logging by adding to your environment:
```
STRIPE_DEBUG=true
```

## Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify webhook signatures** before processing
3. **Use HTTPS** for all webhook endpoints
4. **Validate webhook events** before updating database
5. **Implement rate limiting** on webhook endpoints

## Next Steps

1. **Set up database integration** to store subscription data
2. **Implement subscription management** (cancel, upgrade, downgrade)
3. **Add usage tracking** based on subscription limits
4. **Set up email notifications** for subscription events
5. **Implement dunning management** for failed payments
