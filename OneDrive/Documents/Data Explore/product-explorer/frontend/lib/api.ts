const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/* =======================
   NAVIGATION
======================= */
export async function fetchNavigation() {
  const res = await fetch(`${API_BASE}/api/v1/navigation`);
  if (!res.ok) throw new Error('Failed to fetch navigation');
  return res.json();
}

/* =======================
   CATEGORIES
======================= */
export async function fetchCategories(navigationSlug: string) {
  const res = await fetch(
    `${API_BASE}/api/v1/categories/${navigationSlug}`,
  );
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

/* =======================
   PRODUCTS (GRID)
======================= */
export async function fetchProducts(
  categorySlug: string,
  page = 1,
  limit = 12,
) {
  const res = await fetch(
    `${API_BASE}/api/v1/products?categorySlug=${categorySlug}&page=${page}&limit=${limit}`,
  );
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

/* =======================
   PRODUCT DETAIL (PHASE F2)
======================= */
export async function fetchProductDetail(productId: string) {
  const res = await fetch(
    `${API_BASE}/api/v1/products/${productId}`,
  );

  if (!res.ok) {
    throw new Error('Failed to fetch product detail');
  }

  return res.json();
}
