// This is used to normalize squad names
// so "Team Awesome", "team awesome ", "  TEAM   AWESOME", and "teamawesome" all normalize to the same value "teamawesome" for searching and duplicate prevention purposes.
export const normalizeName = (name: string) =>
  name.trim().toLowerCase().replace(/\s+/g, "");