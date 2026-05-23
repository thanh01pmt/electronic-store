## ADDED Requirements

### Requirement: Auth Session Validation
The system SHALL validate user authentication state on protected routes (`/account`, `/checkout`, `/order-history`, `/order-status`) using Supabase Session.

#### Scenario: Valid Auth Session Allowed Access
- **WHEN** an authenticated user with a valid Supabase JWT requests `/account`
- **THEN** render the account page with status 200

#### Scenario: Missing Auth Session Redirected to Login
- **WHEN** an unauthenticated visitor requests `/checkout`
- **THEN** redirect to `/auth/login`

### Requirement: User Profile Persistence
The system SHALL automatically create a profile record in the database `users` table upon successful user registration via Supabase Auth.

#### Scenario: User Signup Syncs Profile
- **WHEN** a new user signs up using email/password
- **THEN** insert a record containing email, first_name, and last_name in the `users` table
