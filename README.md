# E Investment website

A responsive trading education/coaching website with:
- E Investment branding and responsive design
- Trading/coaching imagery
- Registration and login UI
- SQLite user storage
- Password hashing with bcrypt
- Email notifications for new registrations through SMTP
- Contact email: Pappymozzy@gmail.com
- Sample 5-star testimonials clearly marked as sample copy
- Risk disclosure so the site does not promise guaranteed returns

## Run locally

1. Install Node.js 18+.
2. Open this folder in a terminal.
3. Run:
   npm install
4. Copy `.env.example` to `.env`.
5. Enter your SMTP provider details in `.env`.
6. Run:
   npm start
7. Open http://localhost:3000

## Registration email

When SMTP is configured, every successful registration sends a notification to:
Pappymozzy@gmail.com

Do not put your SMTP password in frontend code. Keep it only in `.env` on the server.

## Before publishing

- Replace the sample testimonials with real, verified customer reviews.
- Replace the remote image URLs with properly licensed/owned images if required by your hosting or branding policy.
- Add your legal business details, terms, privacy policy and any financial-services disclosures required in your jurisdiction.
- Have the registration/login system reviewed and hardened for production (sessions, CSRF protection, rate limiting, HTTPS, account verification and password reset).
- Trading involves risk; do not advertise guaranteed returns or guaranteed passive income.
