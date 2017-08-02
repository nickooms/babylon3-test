import GEOObject from './GEOObject.js';

export default class Street extends GEOObject {
  constructor({ id = 7338 }) {
    super({ id, name: 'street' });
  }

  async houseNumbers() {
    return await this.get('houseNumbers');
  }

  async buildings() {
    return await this.get('buildings');
  }

  async plots() {
    return await this.get('plots');
  }
}
