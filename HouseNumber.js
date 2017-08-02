import GEOObject from './GEOObject.js';

export default class HouseNumber extends GEOObject {
  constructor({ id }) {
    super({ id, name: 'housenumber' });
  }

  async buildings() {
    return await this.get('buildings');
  }
}
