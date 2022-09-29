export default (section) => {
  const lines = section.split('\n');
  const trimLength = sectionTrimLength(lines);
  return lines.map((line) => line.slice(trimLength)).join('\n');
};

const sectionTrimLength = (lines) =>
  Math.min(
    ...lines
      .map((line) => [line.length, line.trimStart().length])
      .filter(([, trimmedLength]) => trimmedLength)
      .map(([length, trimmedLength]) => length - trimmedLength)
  );
