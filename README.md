# RAIA - Real Time AI Interview Assistant

## Overview

This project is a web application that provides real-time transcription of audio using Amazon Transcribe. It features a video call interface, a live transcription card, and a chat section for user interaction. The application captures audio from the user's microphone and transcribes it in real-time, distinguishing between different speakers.

## Features

- **Video Call Interface**: A section for video calls.
- **Live Transcription**: Real-time transcription of audio with speaker diarization.
- **Chat Functionality**: A chat interface for user communication.
- **AWS Integration**: Utilizes Amazon Transcribe for audio transcription.

## Technologies Used

- **Frontend**: React, Next.js
- **Backend**: Node.js
- **Transcription Service**: Amazon Transcribe
- **Styling**: Tailwind CSS (or any other CSS framework you are using)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- AWS Account
- Git

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/your-repository-name.git
   cd your-repository-name
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root of the project and add your AWS credentials:

   ```plaintext
   AWS_ACCESS_KEY_ID=your_access_key_id_here
   AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
   AWS_REGION=your_preferred_region_here  # e.g., us-east-1
   ```

4. **Run the application**:

   ```bash
   npm run dev
   ```

   Open your browser and navigate to `http://localhost:3000`.

## Usage

- Start a video call and click on the "Start Transcription" button to begin capturing audio.
- Speak into the microphone to see the live transcription in the designated area.
- Use the chat section for communication during the session.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Amazon Transcribe](https://aws.amazon.com/transcribe/) for providing the transcription service.
- [Next.js](https://nextjs.org/) for the framework.
- [React](https://reactjs.org/) for building the user interface.
