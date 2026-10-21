// Errors the app recovers from must still reach the error reporter (Sentry in the app).
// Run: npm test (from apps/mobile)
import { afterEach, describe, expect, it, vi } from 'vitest';
import { reportError, setErrorReporter } from '../report-error';
import { myChartFor } from '../../features/compatibility';
import { getProfile, type Profile } from '../../store/profile';

afterEach(() => setErrorReporter(null));

describe('reportError', () => {
  it('passes the error and context to the registered reporter', () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);
    const error = new Error('boom');
    reportError(error, { where: 'test' });
    expect(reporter).toHaveBeenCalledWith(error, { where: 'test' });
  });

  it('does nothing without a reporter', () => {
    expect(() => reportError(new Error('boom'))).not.toThrow();
  });

  it('never throws when the reporter itself fails', () => {
    setErrorReporter(() => {
      throw new Error('reporter down');
    });
    expect(() => reportError(new Error('boom'))).not.toThrow();
  });

  it('is called when the engine recovers from bad profile data', () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);
    const me: Profile = { ...getProfile(), birth: { ...getProfile().birth, date: '1998-02-30' } };
    expect(myChartFor(me)).toBeNull();
    expect(reporter).toHaveBeenCalledTimes(1);
    expect(reporter.mock.calls[0]![1]).toEqual({ where: 'compatibility.myChart' });
  });
});
