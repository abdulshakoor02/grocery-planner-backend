import { Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from '../../env';

@Injectable()
export class QdrantService {
  private client: QdrantClient;
  constructor() {
    this.client = new QdrantClient({
      url: env.qdrant.url,
      apiKey: env.qdrant.apiKey,
    });
  }

  public async queryPoints(
    collectionName: string,
    vector: number[],
    limit: number = 5,
  ) {
    try {
      const searchResult = await this.client.query(collectionName, {
        query: vector,
        limit: limit,
        params: { exact: true },
        with_payload: true,
        score_threshold: 0.75,
      });
      return searchResult.points;
    } catch (error) {
      console.error(`Error searching points in '${collectionName}':`, error);
      return null;
    }
  }
}
