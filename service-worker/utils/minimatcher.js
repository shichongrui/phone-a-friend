import minimatch from 'minimatch'

export default function minimatcher (file, patterns) {
  return patterns.some((pattern) => {
    return minimatch(file, pattern)
  })
}
