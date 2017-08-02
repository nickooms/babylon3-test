import Symbols from './Symbols.js';

export default class GEOObject {
  constructor({ id, name }) {
    this.id = id;
    this[Symbols.name] = name;
  }

  url(url = '/') {
    return `${this[Symbols.name]}/${this.id}${url === '/' ? '' : `/${url}`}`;
  }

  async json(name = '/') {
    const result = await fetch(`data/${this.url(name === '/' ? '/' : name.toLowerCase())}.js`);
    return await result.json();
  }

  async get(name = '/') {
    const symbol = Symbols[name];
    if (this[symbol] === undefined) {
      this[symbol] = await this.json(name);
    }
    return this[symbol];
  }
}
