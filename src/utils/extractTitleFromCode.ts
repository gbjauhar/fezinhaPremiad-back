export function extractTitleFromCode(
  code: string,
  editionDigits = 3,
  stepDigits = 2,
) {
  const titleName = code.slice(0, -stepDigits).slice(-editionDigits);

  return titleName;
}
