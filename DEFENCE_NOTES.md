# PocketWise Defence Notes

## Project overview

**Title:** PocketWise — Personal Money Management Workspace  
**Problem:** People can receive money in different ways and still need a simple way to decide what it should do, track spending, handle upcoming payments and reach savings goals.  
**Aim:** Build a simple, secure and responsive application for recording money, planning spending and tracking savings.  
**Users:** Students, salary earners, freelancers, business owners, parents and other personal finance users. All amounts use Nigerian Naira.

## Objectives and features

- Authenticate each user with email and password.
- Record, edit, search, filter and delete income/expense transactions.
- Calculate balance as `total income - total expenses`.
- Compare current-month expenses with a monthly budget.
- Create and fund savings goals; calculate `current / target × 100`.
- Produce charts and transparent rule-based insights from real records only.
- Give a new account a deliberate zero/empty state.
- Work well from 320px mobile screens through desktop screens.

## Technologies

HTML provides semantic structure. CSS variables, Grid, Flexbox and media queries create the design system and responsive layout. Vanilla JavaScript provides routing, validation, calculations and CRUD interactions. Chart.js renders responsive charts. Supabase supplies managed authentication and a PostgreSQL database.

Vanilla JavaScript was chosen because the project is small, has no build step, stays lightweight, and is easier to explain during a student defence. The code remains separated into authentication, data, UI and application modules.

## Authentication and data flow

Supabase Auth securely handles registration, login, logout, password resets, token refresh and persisted sessions. The frontend never stores or hashes passwords. After authentication, PocketWise loads the user's profile, transactions, latest budget and goals. After every mutation it reloads relevant real records, so the interface remains consistent without a page refresh.

The core tables are `profiles`, `transactions`, `budgets`, and `savings_goals`. UUIDs identify records and connect each private row to `auth.users`. Foreign-key cascading removes owned records if an authentication user is deleted.

## Row Level Security

RLS is PostgreSQL protection that filters rows at the database level. Each policy compares `auth.uid()` with `user_id` (or profile `id`). Separate SELECT, INSERT, UPDATE and DELETE policies mean one user cannot read or change another user's financial data even if they manually call the API. Only the public anon key is used in the browser; the service-role key is never exposed.

## Calculations and charts

Dashboard totals are calculated only from authenticated database records. Monthly spending filters expense dates by the current `YYYY-MM`. Budget use is `monthly spending / budget × 100`. Savings progress is `current amount / target amount × 100`. Analytics are hidden until enough data exists, preventing meaningless zero charts. Insights are normal JavaScript rules, not AI.

## Responsive design and accessibility

Desktop uses a sidebar; mobile uses touch-friendly bottom navigation. Card grids collapse, transaction rows become compact cards, forms become one column, charts have bounded containers, and dialogs fit the dynamic viewport. Semantic elements, labels, keyboard focus, ARIA live feedback, contrast, and `prefers-reduced-motion` are supported.

## Animation approach

PocketWise uses lightweight CSS transitions and keyframes for hero entrances, card reveals, progress bars, buttons, and completion feedback. IntersectionObserver reveals landing-page sections only when they enter the viewport. Animations rely mainly on `opacity` and `transform` for good performance, and non-essential motion is disabled when the user enables reduced motion in their operating system.

The animation values on the authenticated dashboard always come from real Supabase records. Demonstration values exist only inside the clearly labelled landing-page product preview.

## Challenges

Main challenges were changing synchronous localStorage code to asynchronous database operations, protecting every account, keeping views synchronized after CRUD actions, creating intentional empty/loading/error states, and fitting financial information onto small screens. Centralized service modules and reusable render helpers reduced complexity.

## Future improvements

Possible future work includes custom categories, recurring transactions, offline read caching, CSV import, and optional reminders. Payment gateways, bank linking and investment features are intentionally outside the project scope.

## Likely defence questions

**Why Supabase?** It provides authentication and PostgreSQL together, supports RLS, has a simple JavaScript client, and is suitable for the project's scope.

**Why PostgreSQL?** Financial records are structured and related to users. PostgreSQL provides strong types, constraints, indexes and secure row policies.

**Why authentication?** It gives every user a private, persistent workspace that can be accessed again after logout or on another device.

**How is user data separated?** Every financial row stores the authenticated UUID. RLS checks that UUID against `auth.uid()` for every operation.

**What is CRUD?** Create, Read, Update and Delete—the four main database operations implemented for transactions and savings goals.

**How is balance calculated?** The app sums all income, sums all expenses, then subtracts expenses from income.

**How are empty accounts handled?** The database returns empty arrays and no budget. The UI shows zero totals and clear calls to add the first transaction, budget or goal; it never creates mock data.

**Why is the anon key visible?** Supabase's anon/publishable key identifies the project and is designed for frontend use. RLS controls access. The powerful service-role key is never included.

**How was responsiveness tested?** The layout uses content-aware grids and breakpoints, with dedicated mobile navigation and card presentation. It should be checked at 320, 360, 375, 390, 414, 480, 768, 1024, 1280 and 1440 pixels.

**Is PocketWise an AI application?** No. Insights use explainable calculations and simple JavaScript rules.
