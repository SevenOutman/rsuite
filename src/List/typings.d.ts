export interface Payload {
  collection: string | number;
  node: HTMLElement;
  newIndex: number;
  oldIndex: number;
}

export interface PayloadCallback {
  (payload?: Payload, event?: MouseEvent): any;
}
