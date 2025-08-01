import { Injectable, OnModuleInit } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  public embedder: any;
  async onModuleInit(): Promise<void> {
    this.embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    );
    return;
  }
  public async getEmbeddings(text: string) {
    const output = await this.embedder(text, {
      pooling: 'mean',
      normalize: true,
    });
    // The output is typically a tensor; convert it to a plain array
    return Array.from(output.data);
  }
}
