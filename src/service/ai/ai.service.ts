import { Injectable, Inject } from '@nestjs/common';
import { LoggerService } from '../logger.service';
import { QdrantService } from '../qdrant/qdrant.service';
import { EmbeddingService } from '../embeddings/embeddings.service';
import OpenAI from 'openai';
import { env } from '../../env';

@Injectable()
export class AIService {
  private openai: OpenAI;
  constructor(
    @Inject(LoggerService) private readonly logger: LoggerService,
    private readonly qdrant: QdrantService,
    private readonly embed: EmbeddingService,
  ) {
    this.openai = new OpenAI({
      apiKey: env.openai.apiKey,
      baseURL: env.openai.baseUrl,
    });
  }

  public async productPrompt(prompt: string) {
    const startTime = Date.now();
    try {
      this.logger.info('Starting product prompt processing', { prompt });

      const products = await this.extractProducts(prompt);
      this.logger.debug('Extracted products', {
        products,
        duration: `${Date.now() - startTime}ms`,
      });

      const embedRequest = [] as any;
      for (const prod of products) {
        embedRequest.push(this.embed.getEmbeddings(prod));
      }
      const prodEmbed = await Promise.all(embedRequest);
      this.logger.debug('Generated embeddings', {
        count: prodEmbed.length,
        duration: `${Date.now() - startTime}ms`,
      });

      const fetchProducts = [] as any;
      for (const prod of prodEmbed) {
        fetchProducts.push(this.qdrant.queryPointsFromDiverseSources('products', prod));
      }
      const prodList = await Promise.all(fetchProducts);
      this.logger.debug('Fetched products from Qdrant', {
        count: prodList.length,
        duration: `${Date.now() - startTime}ms`,
      });

      let response = [] as any;
      for (const prod of prodList) {
        response = [...response, ...prod];
      }
      console.log(JSON.stringify(response))
      const duration = Date.now() - startTime;
      this.logger.info('Product prompt processing completed successfully', {
        prompt,
        resultCount: response.length,
        duration: `${duration}ms`,
      });

      const finalResponse = await this.analyseProducts(JSON.stringify(response))

      return finalResponse;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Product prompt processing failed', {
        prompt,
        error: error.message,
        duration: `${duration}ms`,
      });
      throw error;
    }
  }

  public async extractProducts(prompt: string) {
    const startTime = Date.now();
    try {
      this.logger.debug('Extracting products from prompt', { prompt });

      const history = [
        {
          role: 'system',
          content: 'You are an AI assitant.',
        },
      ] as any;
      history.push({
        role: 'user',
        content: `
Extract only product names from the query
Example:
Input: "I want to buy apple and banana"
Output:["apple","banana"]
Now process this query: "${prompt}"
and response only with product array
`,
      });
      // history.push({ role: 'user', content: prompt })
      const response = await this.openai.chat.completions.create({
        model: env.openai.model,
        messages: history,
        max_tokens: 4096,
      });

      const result = JSON.parse(
        response?.choices?.[0]?.message?.content as any,
      );
      const duration = Date.now() - startTime;
      this.logger.debug('Products extracted successfully', {
        prompt,
        result,
        duration: `${duration}ms`,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Product extraction failed', {
        prompt,
        error: error.message,
        duration: `${duration}ms`,
      });
      throw error;
    }
  }

  public async analyseProducts(prompt: string) {
    const startTime = Date.now();
    try {
      this.logger.debug('analysing products from prompt', { prompt });

      const history = [
        {
          role: 'system',
          content: 'You are an AI assitant.',
        },
      ] as any;
      history.push({
        role: 'user',
        content: `
        Given are json array of products each mentioned with different name, price and source ,
         i want you to group all the product by its source add the price by each source analyse and compare and tell me which source is cheapest :
         ${prompt}
         briefly explain and just give the Conclusion.
`,
      });
      // history.push({ role: 'user', content: prompt })
      const response = await this.openai.chat.completions.create({
        model: env.openai.model,
        messages: history,
        max_tokens: 4096,
      });

      const result = response?.choices?.[0]?.message?.content as any;
      const duration = Date.now() - startTime;
      this.logger.debug('Products extracted successfully', {
        prompt,
        result,
        duration: `${duration}ms`,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Product extraction failed', {
        prompt,
        error: error.message,
        duration: `${duration}ms`,
      });
      throw error;
    }
  }
}
