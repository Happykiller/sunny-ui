// src\services\graphql\graphql.service.fetch.ts
import GraphqlService from "./graphql.service";

export interface GraphqlServiceConfig {
  apiUrl: string;
  storageName: string;
}

export class GraphqlServiceFetch implements GraphqlService {
  constructor(
    private inversify: any,
    private config: GraphqlServiceConfig
  ) {}

  async send(datas: any): Promise<any> {
    try {
      const storageRaw = localStorage.getItem(this.config.storageName);
      let token: string | undefined;

      if (storageRaw) {
        try {
          const storage = JSON.parse(storageRaw);
          token = storage?.state?.access_token;
        } catch (err) {
          this.inversify.loggerService.warn('GraphqlServiceFetch#send => Failed to parse localStorage');
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.config.apiUrl}/graphql`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers,
        body: JSON.stringify(datas),
      });

      return await response.json();
    } catch (e: any) {
      this.inversify.loggerService.error(`GraphqlServiceFetch#send => ${e.message}`);
    }
  }
}
