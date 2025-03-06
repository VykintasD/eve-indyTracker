import { TableError } from '../../src/types/errors';

export default class Character {
  name: string;
  id: number;
  portrait_url?: string;

  constructor(props: { id: number; name: string; portrait_url?: string }) {
    this.name = props.name;
    this.id = props.id;
    this.portrait_url = props.portrait_url;
  }

  validate() {
    if (!this.name?.length || !this.id) {
      throw new TableError('Invalid character entity');
    }

    return this;
  }
}
