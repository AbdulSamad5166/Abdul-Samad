# Week 5 Revision Checklist & Knowledge Map

**Author:** Abdul Samad  
**Course Stage:** Week 5 Complete (Day 1 to Day 4 synthesis on top of Weeks 1 to 4)

This checklist maps each required conceptual topic to its exact implementation file and location within this project codebase.

---

## 1. Client-Side Routing & React Router (Week 5 Day 1)
- [x] **`Routes` and `Route` configuration**: Configured in `/src/App.tsx` defining public and protected paths.
- [x] **Nested Routes & Layout Component**: `/src/components/layout/Layout.tsx` uses `<Outlet />` to render child pages inside a common shell with `Sidebar` and `Navbar`.
- [x] **Route Parameters**: Implemented in `/src/pages/ProductDetailPage.tsx` and `/src/pages/ProductEditPage.tsx` using `useParams<{ id: string }>()` to target specific products (`/products/:id`).
- [x] **Active Navigation (`NavLink`)**: `/src/components/layout/Sidebar.tsx` utilizes `NavLink` with functional `className={({ isActive }) => ...}` to highlight the current section.
- [x] **Protected Routes Concept**: `/src/components/layout/ProtectedRoute.tsx` verifies bearer token presence in Local Storage and redirects unauthorized visits to `/login` with `from` history preservation.
- [x] **404 Catch-All Page**: `/src/pages/NotFoundPage.tsx` handles wildcard `path="*"` with clean redirection options.

---

## 2. REST Concepts, HTTP Methods & Axios (Week 5 Day 2)
- [x] **Axios Instance**: Configured in `/src/api/client.ts` with `baseURL: 'https://dummyjson.com'`, default headers, and request timeout.
- [x] **HTTP Headers & Bearer Token**: Request interceptor in `/src/api/client.ts` automatically extracts the token from Local Storage and sets `Authorization: Bearer <token>`.
- [x] **HTTP Methods Implemented**:
  - `GET`: `/products`, `/products/categories`, `/products/:id`, `/users` (in `/src/api/productsApi.ts` & `/src/api/usersApi.ts`)
  - `POST`: `/auth/login`, `/users/add`, `/products/add` (in `/src/api/authApi.ts` & `/src/api/productsApi.ts`)
  - `PUT`: `/products/:id` (in `/src/api/productsApi.ts`)
  - `DELETE`: `/products/:id` (in `/src/api/productsApi.ts`)
- [x] **HTTP Status Codes & Error Handling**: `/src/api/client.ts` (`parseApiError`) translates HTTP 400, 401, 403, 404, 429, 500, and network disconnects into readable feedback.

---

## 3. Server State & TanStack Query (Week 5 Day 3)
- [x] **`QueryClient` and `QueryClientProvider`**: Initialized in `/src/main.tsx` with default `staleTime: 5 mins` and `gcTime: 15 mins`.
- [x] **Query Keys Factory**: `/src/hooks/useProducts.ts` defines deterministic query keys like `['products', 'list', params]`, `['products', 'detail', id]`, and `['categories']`.
- [x] **`useQuery` Hooks**:
  - `useProducts`: fetches products with pagination parameters and search filters.
  - `useProduct`: fetches single product data enabled only when ID is present.
  - `useCategories`: caches product categories for 10 minutes.
  - `useUsers`: manages user directory data.
- [x] **Loading, Error & Refetching States**: Used across `/src/pages/DashboardPage.tsx`, `/src/pages/ProductsPage.tsx`, and `/src/pages/ProductDetailPage.tsx` with `SkeletonTable` and `ErrorState` with retry buttons.
- [x] **`useMutation` & Query Invalidation**: Implemented in `/src/hooks/useProducts.ts` (`useAddProduct`, `useUpdateProduct`, `useDeleteProduct`), triggering `queryClient.invalidateQueries({ queryKey: productKeys.all })` upon completion.
- [x] **Modal Confirmation for Mutations**: `/src/components/products/DeleteConfirmModal.tsx` prompts for user consent before executing destructive DELETE calls.

---

## 4. Advanced Forms, Controlled Inputs & Zod Validation (Week 5 Day 4)
- [x] **Controlled Inputs & Form State**: `/src/components/products/ProductForm.tsx`, `/src/pages/LoginPage.tsx`, and `/src/pages/RegisterPage.tsx` manage field state with controlled React inputs.
- [x] **Zod Validation Schemas**:
  - `loginSchema`: requires username (min 3 chars) and password (min 6 chars) in `/src/schemas/authSchema.ts`.
  - `registerSchema`: validates email format and enforces `passwords must match` via `.refine()` in `/src/schemas/authSchema.ts`.
  - `productFormSchema`: validates title length, numerical price (>0), non-negative integer stock, brand, and category in `/src/schemas/productSchema.ts`.
  - `profileSchema`: validates name and email in `/src/schemas/profileSchema.ts`.
- [x] **User Session & Token Concept (No Context API)**:
  - Token and user session saved and removed via `/src/hooks/useAuth.ts` and `/src/utils/storage.ts`.
  - `ProtectedRoute` reads token directly from Local Storage.
  - Navbar Logout button clears session storage and navigates to `/login`.

---

## 5. UI Architecture & Reusable Components (Weeks 1 to 4)
- [x] Reusable, fully typed components in `/src/components/ui/`: `Button`, `Card`, `Badge`, `Input`, `Select`, `Modal`, `Alert`, `Skeleton`, `StatCard`, `Pagination`, `SearchBar`, `EmptyState`, `ErrorState`.
- [x] Dark mode toggle with persistent Local Storage in `/src/hooks/useDarkMode.ts`.
- [x] Responsive layout with mobile hamburger navigation and desktop persistent sidebar.
- [x] Footer credit displayed in `/src/components/layout/Sidebar.tsx` and in `README.md`.
