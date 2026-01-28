/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/groqVoice.service.ts

interface TranscriptionResult {
    success: boolean;
    extractedText: string;
    error?: string;
  }
  
  /**
   * Transcribe audio to text using Groq's Whisper model
   * @param audioFile - The audio file to transcribe
   * @returns Promise with transcribed text or error
   */
  export async function extractTextFromAudio(audioFile: File): Promise<TranscriptionResult> {
    try {
      // Prepare the API request with FormData
      const apiKey =  process.env.NEXT_PUBLIC_GROQ_API_KEY ;
      
      if (!apiKey) {
        throw new Error('GROQ_API_KEY is not configured');
      }
  
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', 'whisper-large-v3-turbo'); // Best balance of speed, accuracy, and cost
      formData.append('temperature', '0'); // Low temperature for more consistent transcription
      formData.append('response_format', 'json'); // Get JSON response with text
      formData.append('language', 'en'); // Set to 'en' for English, or remove for auto-detection
  
      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      const extractedText = data.text?.trim() || '';
  
      if (!extractedText) {
        return {
          success: false,
          extractedText: '',
          error: 'No speech was detected in the audio. Please ensure the audio contains clear speech.',
        };
      }
  
      return {
        success: true,
        extractedText,
      };
    } catch (error) {
      console.error('Voice transcription error:', error);
      return {
        success: false,
        extractedText: '',
        error: error instanceof Error ? error.message : 'Failed to transcribe audio',
      };
    }
  }
  
  /**
   * Validate audio file before transcription
   */
  export function validateAudioForTranscription(file: File): { valid: boolean; error?: string } {
    // Supported audio formats by Whisper
    const supportedFormats = [
      'audio/mpeg',        // mp3
      'audio/mp4',         // m4a
      'audio/wav',         // wav
      'audio/webm',        // webm
      'audio/ogg',         // ogg
      'audio/flac',        // flac
    ];
  
    // Check file type
    const isSupported = supportedFormats.some(format => file.type.includes(format.split('/')[1]));
    
    if (!isSupported && !file.type.startsWith('audio/')) {
      return {
        valid: false,
        error: 'Please upload a valid audio file (MP3, WAV, M4A, WEBM, OGG, or FLAC)',
      };
    }
  
    // Check file size (max 25MB for Whisper)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Audio file is too large. Please upload an audio file smaller than 25MB',
      };
    }
  
    return { valid: true };
  }
  
  /**
   * Record audio from microphone and return as File
   * Utility function for browser-based recording
   */
  export class AudioRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private stream: MediaStream | null = null;
  
    async startRecording(): Promise<void> {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.audioChunks = [];
  
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
  
        this.mediaRecorder.start();
      } catch (error) {
        throw new Error('Failed to access microphone. Please ensure microphone permissions are granted.');
      }
    }
  
    async stopRecording(): Promise<File> {
      return new Promise((resolve, reject) => {
        if (!this.mediaRecorder) {
          reject(new Error('Recording was not started'));
          return;
        }
  
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], `recording_${Date.now()}.webm`, {
            type: 'audio/webm',
          });
  
          // Stop all tracks to release microphone
          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
          }
  
          resolve(audioFile);
        };
  
        this.mediaRecorder.stop();
      });
    }
  
    isRecording(): boolean {
      return this.mediaRecorder?.state === 'recording';
    }
  
    cancelRecording(): void {
      if (this.mediaRecorder && this.isRecording()) {
        this.mediaRecorder.stop();
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }
      }
      this.audioChunks = [];
    }
  }