import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSessionId(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileTypeIcon(fileType: string): string {
  const fileTypeMap: Record<string, string> = {
    'image/': '🖼️',
    'application/pdf': '📄',
    'text/': '📝',
    'audio/': '🎵',
    'video/': '🎬',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📃',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📊',
    'application/zip': '🗜️',
  };

  for (const type in fileTypeMap) {
    if (fileType.startsWith(type)) {
      return fileTypeMap[type];
    }
  }

  return '📁';
}

export function getFileNameWithoutPath(filePath: string): string {
  return filePath.split('/').pop() || filePath;
}