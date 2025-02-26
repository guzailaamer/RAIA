class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const inputChannel = input[0];
      
      // Convert float32 to int16
      const int16Data = new Int16Array(inputChannel.length);
      for (let i = 0; i < inputChannel.length; i++) {
        int16Data[i] = Math.max(-32768, Math.min(32767, inputChannel[i] * 32768));
      }

      // Send the processed data back to the main thread
      this.port.postMessage(int16Data);
    }
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor); 