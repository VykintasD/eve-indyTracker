import { TableError } from '../../src/types/errors';

export default class Character {
  name: string;
  id: number;

  constructor(props: { id: number; name: string }) {
    this.name = props.name;
    this.id = props.id;
  }

  validate() {
    if (!this.name?.length || !this.id) {
      throw new TableError('Invalid character entity');
    }

    return this;
  }
}
