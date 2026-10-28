# Friday Presentation: Project Demonstration Script

**Project Title:** Product Management Dashboard  
**Presenter:** Abdul Samad  
**Duration:** ~3 to 5 minutes  

---

## Preparation Before You Present
1. Open the application in your browser.
2. If already logged in, click **Logout** in the top-right navbar so you start on `/login`.
3. Have your browser console open if you want to show network requests and TanStack Query cache activity.

---

## Step-by-Step Presentation Script

### Step 1: Introduction & Technology Stack
- **Action:** Show the `/login` screen.
- **What to Say:**
  > *"Good morning everyone! My name is Abdul Samad, and today I am excited to present my Week 5 Day 5 Project: the **Product Management Dashboard**.*  
  > *This application is built entirely using **React, TypeScript, Vite, Tailwind CSS, React Router v7, TanStack Query, Axios, and Zod** for schema validation. It strictly follows modern best practices without unnecessary state bloat, connecting directly to the RESTful DummyJSON API."*

---

### Step 2: Authentication & Zod Form Validation
- **Action:** 
  1. Click **Sign In** with blank fields to show Zod inline error messages.
  2. Click the **Auto-fill** button (which populates `emilys` / `emilyspass`).
  3. Show the loading spinner state on the **Sign In** button when submitted.
- **What to Say:**
  > *"Here on the login screen, we implemented controlled form state with Zod schema validation. If I attempt to submit empty or invalid fields, descriptive validation errors appear immediately without unnecessary server calls.*  
  > *Let's click 'Auto-fill' with test credentials for Emily Johnson, then submit. The app performs a POST request to `/auth/login`, receives a Bearer JWT token, stores it securely in Local Storage via our custom `useAuth` hook, and redirects us to our protected dashboard."*

---

### Step 3: Protected Routes & Dashboard Overview
- **Action:** 
  1. Point out the Sidebar with active navigation links and footer credit: *"Created by Abdul Samad"*.
  2. Highlight the 4 StatCards: Total Products, Categories, Registered Users, and Average Unit Price.
  3. Show the "Latest Products" table.
- **What to Say:**
  > *"Notice that all routes inside `/dashboard`, `/products`, and `/users` are protected. If a user doesn't have an authentication token, `ProtectedRoute` intercepts the navigation and bounces them back to `/login`.*  
  > *On our dashboard, we use TanStack Query `useQuery` hooks with automated caching (`staleTime: 5 mins`). These four metric cards calculate live statistics directly from API data: total catalog items, available categories, user accounts, and average price. Below is our 'Latest Products' summary."*

---

### Step 4: Product Catalog, Search, Filtering & Pagination
- **Action:** 
  1. Click **Products** in the sidebar.
  2. Type a query into the Search Bar (e.g. `phone` or `laptop`) and hit Enter or watch results update.
  3. Change the Category dropdown (e.g. `beauty` or `fragrances`).
  4. Change the Sort dropdown (e.g. `Price: High to Low`).
  5. Click pagination controls at the bottom to transition between pages.
- **What to Say:**
  > *"In the Products view, we implemented server-side queries combined with reactive UI controls. Notice how page, category, and search terms are embedded directly into the TanStack Query key `['products', page, category, search]`. When we paginate or filter, cached data displays instantaneously, while network queries stay synchronized in the background without layout shifts."*

---

### Step 5: Product Details & Modal Deletion
- **Action:** 
  1. Click the **Eye icon** or product title to open `/products/:id`.
  2. Show specifications, reviews, and gallery thumbnails.
  3. Click **Delete**, show the accessible confirm dialog modal, then confirm.
- **What to Say:**
  > *"Here on the product details page, we extract the `:id` param from the URL using React Router `useParams`. We display detailed specs, image carousels, customer reviews, and stock badges.*  
  > *When I click 'Delete', an accessible confirmation modal prevents accidental deletions. Confirming triggers a `useMutation` hook performing a DELETE request to DummyJSON. Once complete, `invalidateQueries` is called to refresh our cache, and a status message confirms the operation."*

---

### Step 6: Product Form (Nested Routes & Mutation)
- **Action:** 
  1. Click **Add Product** in the sidebar or top bar to navigate to `/products/new`.
  2. Demonstrate validation by typing an invalid price or empty title.
  3. Fill in product details and click **Create Product**.
- **What to Say:**
  > *"Both `/products/new` and `/products/:id/edit` share a single, reusable `ProductForm` component. It provides full Zod validation on title length, numbers, and categories. When submitted, our `useAddProduct` mutation sends a POST to `/products/add`, provides immediate feedback, invalidates our product cache, and routes back to the list."*

---

### Step 7: Users Directory & Settings (Dark Mode)
- **Action:** 
  1. Click **Users** to view the user table fetched from `/users`.
  2. Click **Settings** to show the Profile form and click the **Dark Mode** toggle.
- **What to Say:**
  > *"The Users page fetches directory data from `/users` with search capabilities and contact info badges.*  
  > *Finally, in Settings, we have user profile customization and a dark mode toggle persisted in Local Storage via our custom `useDarkMode` hook. Notice the smooth color transition across the entire interface."*

---

### Step 8: Conclusion & Q&A
- **Action:** Click **Logout** to cleanly conclude the demo.
- **What to Say:**
  > *"Logging out clears the Local Storage token, tears down the session, and redirects us back to the login page.*  
  > *Thank you so much! I am now happy to answer any questions about the code, architecture, or TanStack Query implementation."*
