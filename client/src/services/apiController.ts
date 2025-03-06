import Character from '../../../local-server/db/tables/Character';
import { SERVER_BASE_URL } from '@/config/shared';

class ApiService {
  async fetchCharacters(): Promise<Character[]> {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/characters`);

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * Should probably not use server redirects and instead redirect from here
   * Problem for future me
   */
  async addCharacter() {
    try {
      window.location.href = `${SERVER_BASE_URL}/auth`;
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async fetchPortrait(characterId: string): Promise<any> {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/esi/characters/${characterId}/portrait/`);

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }
}

export const apiService = new ApiService();
