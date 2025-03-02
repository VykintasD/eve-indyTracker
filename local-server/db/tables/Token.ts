import { AuthToken } from '../../src/types/types';
import { TableError } from '../../src/types/errors';

export default class Token implements AuthToken {
  accesstoken: string;
  expiresat: number;
  tokentype: string;
  refreshtoken: string;
  characterid: number;

  constructor(props: {
    accesstoken: string;
    expiresat: number;
    tokentype: string;
    refreshtoken: string;
    characterid: number;
  }) {
    this.accesstoken = props.accesstoken;
    this.expiresat = props.expiresat;
    this.tokentype = props.tokentype;
    this.refreshtoken = props.refreshtoken;
    this.characterid = props.characterid;
  }

  validate() {
    if (
      !this.accesstoken.length ||
      !this.expiresat ||
      !this.refreshtoken.length ||
      !this.characterid
    ) {
      throw new TableError('Invalid auth token');
    }
    return this;
  }
}
