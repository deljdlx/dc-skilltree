class LocalStorage extends Storage
{
  get() {
    const data = localStorage.getItem(this.key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  set(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
    return data;
  }

  remove() {
    localStorage.removeItem(this.key);
  }

  clear() {
    localStorage.clear();
  }
}
