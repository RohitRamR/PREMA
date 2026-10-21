// One place for "something went wrong, but the screen kept working" errors.
//
// Code that recovers from an error (returns a fallback instead of crashing)
// calls reportError() so we still find out about it. The app registers Sentry
// as the reporter at startup (app/_layout.tsx); in tests and plain Node nothing
// is registered and reportError() only logs in development.
//
// Keep `context` free of personal data (no names, birth details or messages):
// ids and short labels only.

export type ErrorContext = Record<string, string | number | boolean | null | undefined>;
export type ErrorReporter = (error: unknown, context: ErrorContext) => void;

let reporter: ErrorReporter | null = null;

export function setErrorReporter(next: ErrorReporter | null): void {
  reporter = next;
}

export function reportError(error: unknown, context: ErrorContext = {}): void {
  try {
    if (reporter) reporter(error, context);
    else if (typeof __DEV__ !== 'undefined' && __DEV__) console.warn('[reportError]', context, error);
  } catch {
    // Reporting must never be the thing that crashes the app.
  }
}
