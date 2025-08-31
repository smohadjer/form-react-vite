export async function fetchJson(path: string) {
  const response = await fetch(path);
  const responseJson = await response.json();
  return responseJson;
}
