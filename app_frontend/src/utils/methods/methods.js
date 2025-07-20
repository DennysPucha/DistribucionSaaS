
require('dotenv').config();

export const API_URL = process.env.API_URL || 'http://localhost:8000/';
export async function GET(ruta, params = {}, token) {
  const url = new URL(API_URL + ruta);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error en GET: ${response.statusText}`);
  }
  return response.json();
}

export async function POST(ruta, data = {}, token) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(API_URL + ruta, options);
  if (!response.ok) {
    throw new Error(`Error en POST: ${response.statusText}`);
  }
  return response.json();
}
export async function PUT(ruta, data = {}, token) {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(API_URL + ruta, options);
  if (!response.ok) {
    throw new Error(`Error en PUT: ${response.statusText}`);
  }
  return response.json();
}

export async function DELETE(ruta, data = {}, token) {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(API_URL + ruta, options);
  if (!response.ok) {
    throw new Error(`Error en DELETE: ${response.statusText}`);
  }
  return response.json();
}