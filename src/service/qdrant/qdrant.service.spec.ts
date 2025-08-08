import { Test, TestingModule } from '@nestjs/testing';
import { QdrantService } from './qdrant.service';

describe('QdrantService', () => {
  let service: QdrantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QdrantService],
    }).compile();

    service = module.get<QdrantService>(QdrantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('queryPointsFromDiverseSources', () => {
    it('should return diverse points from different sources', async () => {
      // Mock grouped data with points from different sources
      const mockGroupedResults = {
        groups: [
          {
            id: 'carrefour',
            hits: [
              {
                id: '1',
                version: 1,
                score: 0.95,
                payload: {
                  name: 'apple',
                  price: '1.20',
                  description: 'Fresh red apple',
                  source: 'carrefour'
                }
              }
            ]
          },
          {
            id: 'lulu',
            hits: [
              {
                id: '3',
                version: 1,
                score: 0.85,
                payload: {
                  name: 'apple',
                  price: '1.30',
                  description: 'Organic apple',
                  source: 'lulu'
                }
              }
            ]
          },
          {
            id: 'spinneys',
            hits: [
              {
                id: '4',
                version: 1,
                score: 0.80,
                payload: {
                  name: 'apple',
                  price: '1.00',
                  description: 'Regular apple',
                  source: 'spinneys'
                }
              }
            ]
          }
        ]
      };

      // Mock the client.queryGroups method
      (service as any).client = {
        queryGroups: jest.fn().mockResolvedValue(mockGroupedResults)
      };

      const result = await service.queryPointsFromDiverseSources('products', [0.1, 0.2, 0.3], 3);
      
      // Should return 3 points from 3 different sources
      expect(result).toHaveLength(3);
      
      // Check that we have points from different sources
      const sources = result.map(point => point.payload.source);
      expect(sources).toContain('carrefour');
      expect(sources).toContain('lulu');
      expect(sources).toContain('spinneys');
    });

    it('should handle cases where there are fewer sources than requested limit', async () => {
      // Mock grouped data with points from only 2 sources
      const mockGroupedResults = {
        groups: [
          {
            id: 'carrefour',
            hits: [
              {
                id: '1',
                version: 1,
                score: 0.95,
                payload: {
                  name: 'banana',
                  price: '0.50',
                  description: 'Yellow banana',
                  source: 'carrefour'
                }
              }
            ]
          },
          {
            id: 'lulu',
            hits: [
              {
                id: '3',
                version: 1,
                score: 0.85,
                payload: {
                  name: 'banana',
                  price: '0.60',
                  description: 'Organic banana',
                  source: 'lulu'
                }
              }
            ]
          }
        ]
      };

      // Mock the client.queryGroups method
      (service as any).client = {
        queryGroups: jest.fn().mockResolvedValue(mockGroupedResults)
      };

      const result = await service.queryPointsFromDiverseSources('products', [0.1, 0.2, 0.3], 5);
      
      // Should return 2 points (one from each available source)
      expect(result).toHaveLength(2);
      
      // Check that we have points from different sources
      const sources = result.map(point => point.payload.source);
      expect(sources).toContain('carrefour');
      expect(sources).toContain('lulu');
    });

    it('should handle empty results', async () => {
      // Mock empty grouped results
      const mockGroupedResults = {
        groups: []
      };

      // Mock the client.queryGroups method
      (service as any).client = {
        queryGroups: jest.fn().mockResolvedValue(mockGroupedResults)
      };

      const result = await service.queryPointsFromDiverseSources('products', [0.1, 0.2, 0.3], 5);
      
      // Should return empty array
      expect(result).toHaveLength(0);
    });

    it('should handle case with only one source available', async () => {
      // Mock grouped data with points from only 1 source
      const mockGroupedResults = {
        groups: [
          {
            id: 'carrefour',
            hits: [
              {
                id: '1',
                version: 1,
                score: 0.95,
                payload: {
                  name: 'apple',
                  price: '1.20',
                  description: 'Fresh red apple',
                  source: 'carrefour'
                }
              },
              {
                id: '2',
                version: 1,
                score: 0.90,
                payload: {
                  name: 'apple',
                  price: '1.10',
                  description: 'Fresh green apple',
                  source: 'carrefour'
                }
              }
            ]
          }
        ]
      };

      // Mock the client.queryGroups method
      (service as any).client = {
        queryGroups: jest.fn().mockResolvedValue(mockGroupedResults)
      };

      const result = await service.queryPointsFromDiverseSources('products', [0.1, 0.2, 0.3], 5);
      
      // Should return 1 point (one from the available source)
      expect(result).toHaveLength(1);
      expect(result[0].payload.source).toBe('carrefour');
    });
  });

  describe('searchByPayloadMatch', () => {
    it('should return points matching the payload key-value pair', async () => {
      // Mock data with points matching the filter
      const mockPoints = {
        points: [
          {
            id: '1',
            version: 1,
            score: 0.95,
            payload: {
              name: 'apple',
              price: '1.20',
              description: 'Fresh red apple',
              source: 'carrefour'
            }
          },
          {
            id: '2',
            version: 1,
            score: 0.90,
            payload: {
              name: 'apple',
              price: '1.10',
              description: 'Fresh green apple',
              source: 'lulu'
            }
          }
        ]
      };

      // Mock the client.query method
      (service as any).client = {
        query: jest.fn().mockResolvedValue(mockPoints)
      };

      const result = await service.searchByPayloadMatch('products', 'name', 'apple', 10);
      
      // Should return 2 points matching the name 'apple'
      expect(result).toHaveLength(2);
      
      // Check that all points have the correct name
      const names = result.map(point => point.payload.name);
      expect(names).toContain('apple');
      expect(names).toContain('apple');
    });

    it('should handle empty results when no matches found', async () => {
      // Mock empty results
      const mockPoints = {
        points: []
      };

      // Mock the client.query method
      (service as any).client = {
        query: jest.fn().mockResolvedValue(mockPoints)
      };

      const result = await service.searchByPayloadMatch('products', 'name', 'orange', 10);
      
      // Should return empty array
      expect(result).toHaveLength(0);
    });

    it('should respect the limit parameter', async () => {
      // Mock data with exactly 2 points (simulating the limit being applied by Qdrant)
      const mockPoints = {
        points: [
          {
            id: '1',
            version: 1,
            score: 0.95,
            payload: {
              name: 'mango',
              price: '2.20',
              description: 'Fresh mango',
              source: 'carrefour'
            }
          },
          {
            id: '2',
            version: 1,
            score: 0.90,
            payload: {
              name: 'mango',
              price: '2.10',
              description: 'Ripe mango',
              source: 'lulu'
            }
          }
        ]
      };

      // Mock the client.query method
      (service as any).client = {
        query: jest.fn().mockResolvedValue(mockPoints)
      };

      const result = await service.searchByPayloadMatch('products', 'name', 'mango', 2);
      
      // Should return only 2 points
      expect(result).toHaveLength(2);
    });
  });
});