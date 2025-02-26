import {
  StartStreamTranscriptionCommand,
  TranscribeStreamingClient,
} from "@aws-sdk/client-transcribe-streaming";

export class TranscriptionService {
  private client: TranscribeStreamingClient;
  private isTranscribing: boolean = false;
  private audioStream: ReadableStream | null = null;

  constructor() {
    this.client = new TranscribeStreamingClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async startTranscription(audioStream: ReadableStream<Uint8Array>) {
    this.isTranscribing = true;
    this.audioStream = audioStream;
    try {
      const command = new StartStreamTranscriptionCommand({
        LanguageCode: "en-US",
        MediaEncoding: "pcm",
        MediaSampleRateHertz: 16000,
        EnableChannelIdentification: true,
        NumberOfChannels: 2, // For speaker separation
        AudioStream: this.createAsyncIterable(audioStream), // Convert to AsyncIterable
      });

      const response = await this.client.send(command);

      return response;
    } catch (error) {
      console.error("Transcription error:", error);
      throw error;
    }
  }

  public stopTranscription() {
    if (this.isTranscribing) {
      this.isTranscribing = false;
      this.audioStream = null;
    }
  }

  // Helper function to convert ReadableStream to AsyncIterable
  private async *createAsyncIterable(stream: ReadableStream<Uint8Array>): AsyncIterable<Uint8Array> {
    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value; // Ensure this yields Uint8Array
    }
  }
} 