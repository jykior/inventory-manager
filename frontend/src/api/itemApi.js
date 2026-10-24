import { csrfFetch } from "./csrfApi";

const API_URL = import.meta.env.VITE_API_URL;

export const getItems = async () => {
  const response = await fetch(`${API_URL}/api/items`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("ITEMS_FETCH_FAILED");
  }
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/api/categories`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("CATEGORIES_FETCH_FAILED");
  }
  return response.json();
};

export const createItem = async (item) => {
  const response = await csrfFetch(`${API_URL}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("ITEM_NAME_ALREADY_EXISTS");
    } else if (response.status === 404) {
      throw new Error("CATEGORY_NOT_FOUND");
    } else if (response.status === 400) {
      throw new Error("ITEM_REQUEST_INVALID");
    } else {
      throw new Error("ITEM_REQUEST_FAILED");
    }
  }
  return response.json();
};

export const createCategory = async (category) => {
  const response = await csrfFetch(`${API_URL}/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
    } else if (response.status === 400) {
      throw new Error("CATEGORY_REQUEST_INVALID");
    } else {
      throw new Error("CATEGORY_REQUEST_FAILED");
    }
  }
  return response.json();
};

export const updateItem = async (item) => {
  const response = await csrfFetch(`${API_URL}/api/items/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("ITEM_NAME_ALREADY_EXISTS");
    } else if (response.status === 404) {
      throw new Error("ITEM_OR_CATEGORY_NOT_FOUND");
    } else if (response.status === 400) {
      throw new Error("ITEM_REQUEST_INVALID");
    } else {
      throw new Error("ITEM_REQUEST_FAILED");
    }
  }
  return response.json();
};

export const updateCategory = async (id, category) => {
  const response = await csrfFetch(`${API_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("CATEGORY_NAME_ALREADY_EXISTS");
    } else if (response.status === 404) {
      throw new Error("CATEGORY_NOT_FOUND");
    } else if (response.status === 400) {
      throw new Error("CATEGORY_REQUEST_INVALID");
    } else {
      throw new Error("CATEGORY_REQUEST_FAILED");
    }
  }
  return response.json();
};

export const updateStock = async (item, newStock) => {
  const response = await csrfFetch(`${API_URL}/api/items/${item.id}/stock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentStock: newStock,
    }),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("ITEM_NOT_FOUND");
    } else if (response.status === 400) {
      throw new Error("STOCK_REQUEST_INVALID");
    } else {
      throw new Error("STOCK_REQUEST_FAILED");
    }
  }
  return response.json();
};

export const deleteItem = async (id) => {
  const response = await csrfFetch(`${API_URL}/api/items/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("ITEM_NOT_FOUND");
    }
    throw new Error("ITEM_DELETE_REQUEST_FAILED");
  }
};

export const deleteCategory = async (id) => {
  const response = await csrfFetch(`${API_URL}/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("CATEGORY_HAS_ITEMS");
    } else if (response.status === 404) {
      throw new Error("CATEGORY_NOT_FOUND");
    } else {
      throw new Error("CATEGORY_DELETE_REQUEST_FAILED");
    }
  }
};
