export interface FileType {
  /** File Name */
  name?: string;
  /** File unique identifier */
  fileKey?: number | string;
  /** https://developer.mozilla.org/zh-CN/docs/Web/API/File */
  blobFile?: File;

  /** File upload status */
  status?: 'inited' | 'uploading' | 'error' | 'finished';

  /** File upload status */
  progress?: number;

  /** The url of the file can be previewed. */
  url?: string;
}
