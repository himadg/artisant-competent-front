import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

const MAX_DURATION_SECONDS = 120;

@Component({
  selector: 'story-recorder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './story-recorder.html',
  styleUrl: './story-recorder.scss',
})
export class StoryRecorder implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  closeModal = output<void>();
  fileReady = output<File>();

  @ViewChild('liveVideo') liveVideoRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('previewVideo') previewVideoRef?: ElementRef<HTMLVideoElement>;

  readonly cameraError = signal<string | null>(null);
  readonly recording = signal(false);
  readonly elapsedSeconds = signal(0);
  readonly previewUrl = signal<string | null>(null);

  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];
  private timerId: ReturnType<typeof setInterval> | null = null;
  private recordedBlob: Blob | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) this.startCamera();
  }

  ngOnDestroy() {
    this.releaseCamera();
    this.clearTimer();
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
  }

  private async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      queueMicrotask(() => {
        if (this.liveVideoRef) this.liveVideoRef.nativeElement.srcObject = this.stream;
      });
    } catch {
      this.cameraError.set("Impossible d'accéder à la caméra. Vous pouvez importer un fichier à la place.");
    }
  }

  private releaseCamera() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  private clearTimer() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
  }

  startRecording() {
    if (!this.stream) return;
    this.chunks = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
      ? 'video/webm;codecs=vp8,opus'
      : 'video/webm';
    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.mediaRecorder.onstop = () => this.onRecordingStopped();
    this.mediaRecorder.start();
    this.recording.set(true);
    this.elapsedSeconds.set(0);
    this.timerId = setInterval(() => {
      this.elapsedSeconds.update((s) => s + 1);
      if (this.elapsedSeconds() >= MAX_DURATION_SECONDS) this.stopRecording();
    }, 1000);
  }

  stopRecording() {
    this.clearTimer();
    this.mediaRecorder?.stop();
    this.recording.set(false);
  }

  private onRecordingStopped() {
    this.recordedBlob = new Blob(this.chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(this.recordedBlob);
    this.previewUrl.set(url);
    queueMicrotask(() => {
      if (this.previewVideoRef) this.previewVideoRef.nativeElement.src = url;
    });
  }

  retake() {
    if (this.previewUrl()) URL.revokeObjectURL(this.previewUrl()!);
    this.previewUrl.set(null);
    this.recordedBlob = null;
    this.elapsedSeconds.set(0);
    queueMicrotask(() => {
      if (this.liveVideoRef) this.liveVideoRef.nativeElement.srcObject = this.stream;
    });
  }

  confirm() {
    if (!this.recordedBlob) return;
    const file = new File([this.recordedBlob], `story-${Date.now()}.webm`, { type: 'video/webm' });
    this.fileReady.emit(file);
  }

  onFileChosen(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.fileReady.emit(file);
  }

  close() {
    this.closeModal.emit();
  }
}
