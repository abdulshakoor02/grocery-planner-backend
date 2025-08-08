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
        with_payload: true,
        score_threshold: 0.50,
      });
      return searchResult.points;
    } catch (error) {
      console.error(`Error searching points in '${collectionName}':`, error);
      return null;
    }
  }

  /**
   * Fetches products ensuring diversity from different sources using Qdrant's native queryGroups functionality
   * @param collectionName The name of the collection to search in
   * @param vector The query vector
   * @param limit The number of results to return (will try to get from different sources)
   * @returns Array of points with diverse sources
   */
  public async queryPointsFromDiverseSources(
    collectionName: string,
    vector: number[],
    limit: number = 5,
  ) {
    try {
      // Use Qdrant's native queryGroups functionality to get diverse results from different sources
      const searchResult = await this.client.queryGroups(collectionName, {
        query: vector,
        limit: limit, // Number of groups (sources) to return
        group_by: 'source', // Group by the source field in payload
        group_size: 1, // One result per group (source)
        with_payload: true,
        score_threshold: 0.50,
      });

      // Flatten the grouped results to match the expected return format
      const diversePoints: any[] = [];
      if (searchResult.groups) {
        for (const group of searchResult.groups) {
          if (group.hits && group.hits.length > 0) {
            // Take the first (highest scoring) hit from each group
            diversePoints.push(group.hits[0]);
          }
        }
      }
      const parsedProds: any[] = []
      for (const prod of diversePoints) {
        parsedProds.push({ name: prod.payload.name, price: prod.payload.price, source: prod.payload.source })
      }

      return parsedProds;
    } catch (error) {
      console.error(`Error searching points in '${collectionName}':`, error);
      return [];
    }
  }

  /**
   * Search points by matching a specific payload key-value pair
   * @param collectionName The name of the collection to search in
   * @param key The payload key to match against
   * @param value The value to match
   * @param limit The maximum number of results to return
   * @returns Array of matching points
   */
  public async searchByPayloadMatch(
    collectionName: string,
    key: string,
    value: string,
    limit: number = 10,
  ) {
    try {
      const searchResult = await this.client.query(collectionName, {
        filter: {
          must: [
            {
              key,
              match: {
                phrase: value,
              },
            },
          ],
        },
        limit: limit,
        with_payload: true,
      });

      return searchResult.points || [];
    } catch (error) {
      console.error(`Error searching points in '${collectionName}':`, error);
      return [];
    }
  }
}
