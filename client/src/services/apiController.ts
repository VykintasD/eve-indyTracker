// import { endpoints } from '../../../local-server/src/config/shared';
// import Character from '../../../local-server/db/tables/Character';
// import { endpoints } from '../../../local-server/src/config/shared';

// Define the base URL for your API
const API_BASE_URL = `https://localhost:5000`

// Create a service class
class ApiService {
  async fetchCharacters() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/characters`)

      const parsed = await response.json()
      console.log(parsed)

      //   const characters: = [new Character({ id: 1, name: 'lala' })];
      return parsed
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }
  }

  async addCharacter() {
    try {
      console.log('addCharacter')
      window.location.href = `${API_BASE_URL}/auth`
      // const res = await fetch(`${API_BASE_URL}/auth`)

      // console.log(res)
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }
  }
}

export const apiService = new ApiService()
