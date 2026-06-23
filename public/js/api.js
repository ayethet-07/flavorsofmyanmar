const API_BASE_URL = typeof process !== 'undefined' && process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  }

  setToken(token) {
    this.token = token;
    if (token && typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    } else if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  getHeaders(contentType = 'application/json') {
    const headers = { 'Content-Type': contentType };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.contentType || 'application/json'),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async register(name, email, password, passwordConfirm) {
    return this.fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, passwordConfirm })
    });
  }

  async login(email, password) {
    const data = await this.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getCurrentUser() {
    return this.fetch('/auth/me', { method: 'GET' });
  }

  async logout() {
    this.setToken(null);
    return this.fetch('/auth/logout', { method: 'POST' });
  }

  async getRecipes(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.fetch(`/recipes?${params}`, { method: 'GET' });
  }

  async getRecipe(id) {
    return this.fetch(`/recipes/${id}`, { method: 'GET' });
  }

  async createRecipe(recipeData) {
    return this.fetch('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData)
    });
  }

  async updateRecipe(id, recipeData) {
    return this.fetch(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData)
    });
  }

  async deleteRecipe(id) {
    return this.fetch(`/recipes/${id}`, { method: 'DELETE' });
  }

  async getWorkshops(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.fetch(`/workshops?${params}`, { method: 'GET' });
  }

  async getWorkshop(id) {
    return this.fetch(`/workshops/${id}`, { method: 'GET' });
  }

  async createWorkshop(workshopData) {
    return this.fetch('/workshops', {
      method: 'POST',
      body: JSON.stringify(workshopData)
    });
  }

  async bookWorkshop(id) {
    return this.fetch(`/workshops/${id}/book`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  }

  async cancelWorkshopBooking(id) {
    return this.fetch(`/workshops/${id}/cancel`, { method: 'DELETE' });
  }

  async updateWorkshop(id, workshopData) {
    return this.fetch(`/workshops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workshopData)
    });
  }

  async subscribeToNewsletter(email, name = '') {
    return this.fetch('/ebook/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, name })
    });
  }

  async unsubscribeFromNewsletter(email) {
    return this.fetch('/ebook/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async getEbookDownloadLink(email) {
    return this.fetch(`/ebook/download?email=${email}`, { method: 'GET' });
  }

  async getVideos(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.fetch(`/videos?${params}`, { method: 'GET' });
  }

  async getVideo(id) {
    return this.fetch(`/videos/${id}`, { method: 'GET' });
  }

  async createVideo(videoData) {
    return this.fetch('/videos', {
      method: 'POST',
      body: JSON.stringify(videoData)
    });
  }

  async updateVideo(id, videoData) {
    return this.fetch(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(videoData)
    });
  }

  async deleteVideo(id) {
    return this.fetch(`/videos/${id}`, { method: 'DELETE' });
  }

  async getIngredients(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.fetch(`/ingredients?${params}`, { method: 'GET' });
  }

  async getIngredient(id) {
    return this.fetch(`/ingredients/${id}`, { method: 'GET' });
  }

  async createIngredient(ingredientData) {
    return this.fetch('/ingredients', {
      method: 'POST',
      body: JSON.stringify(ingredientData)
    });
  }

  async updateIngredient(id, ingredientData) {
    return this.fetch(`/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ingredientData)
    });
  }

  async deleteIngredient(id) {
    return this.fetch(`/ingredients/${id}`, { method: 'DELETE' });
  }
}

const api = new APIClient();