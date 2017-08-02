import GEOObject from './GEOObject.js';

export default class Building extends GEOObject {
  constructor({ id }) {
    super({ id, name: 'building' });
  }
}
