import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { env } from '@/lib/env';

const EMBEDDING_MODEL_ID = 'amazon.titan-embed-text-v2:0';
const EMBEDDING_DIMENSIONS = 1024;

const bedrock =
  env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
    ? new BedrockRuntimeClient({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      })
    : null;

/**
 * Generate an embedding vector using Amazon Titan Embed Text V2 via Bedrock.
 * Returns a 1024-dimensional vector.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!bedrock) {
    throw new Error('AWS Bedrock not configured');
  }

  // Titan has a ~8k token limit; truncate long text
  const truncated = text.slice(0, 8000);

  const command = new InvokeModelCommand({
    modelId: EMBEDDING_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      inputText: truncated,
      dimensions: EMBEDDING_DIMENSIONS,
      normalize: true,
    }),
  });

  const response = await bedrock.send(command);
  const body = JSON.parse(new TextDecoder().decode(response.body));
  return body.embedding;
}

/**
 * Generate embeddings for multiple texts in sequence.
 * (Titan doesn't support batch natively)
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (const text of texts) {
    results.push(await generateEmbedding(text));
  }
  return results;
}

export { EMBEDDING_DIMENSIONS };
