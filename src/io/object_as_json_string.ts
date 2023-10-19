export default function getObjectAsJsonString(obj: any): string {
  return JSON.stringify(obj, null, 2);
}
