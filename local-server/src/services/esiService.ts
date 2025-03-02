import axios from 'axios';

export default class EsiService {
  async fetchWalletBalance(characterId: number, token: string) {
    console.log('charID:', characterId);
    console.log('token: ', token);
    const result = await axios
      .get(`https://esi.evetech.net/latest/characters/${characterId}/wallet/`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .catch(function (error) {
        if (error.response) {
          if (
            error.status == 403 &&
            error.response.data.error == 'token is expired'
          ) {
            // const;
          }
        }
      });

    console.log(result);
  }
}
