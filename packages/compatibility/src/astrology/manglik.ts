/**
 * @file manglik.ts
 * @description Manglik dosha detection and compatibility logic.
 */

import type { AstroProfile, ManglikResult } from './astrology-types';

const METHODOLOGY = 'v1.0.0';

/**
 * Basic Manglik check. In V1 without a full chart, defaults to unknown unless specified.
 */
export function checkManglik(profile: AstroProfile): 'none' | 'mild' | 'strong' | 'unknown' {
    if (profile.isManglik === true) {
        return profile.manglikSeverity || 'strong';
    } else if (profile.isManglik === false) {
        return 'none';
    }
    return 'unknown';
}

/**
 * Evaluates Manglik compatibility between two users.
 */
export function checkManglikCompatibility(profileA: AstroProfile, profileB: AstroProfile): ManglikResult {
    const statusA = checkManglik(profileA);
    const statusB = checkManglik(profileB);

    let compatible = true;
    let explanation = 'Neither user is known to have Manglik Dosha.';
    let severity: 'none' | 'mild' | 'strong' = 'none';

    if (statusA === 'unknown' || statusB === 'unknown') {
        explanation = 'Manglik status is unknown for one or both users. Assuming baseline compatibility.';
        severity = 'none';
    } else if (statusA !== 'none' && statusB !== 'none') {
        explanation = 'Both users are Manglik. The dosha is canceled out, providing strong compatibility.';
        severity = 'none';
    } else if (statusA !== 'none' || statusB !== 'none') {
        compatible = false;
        severity = statusA !== 'none' ? (statusA as 'mild'|'strong') : (statusB as 'mild'|'strong');
        explanation = 'Only one user is Manglik. This can cause friction and requires careful consideration or astrological remedies.';
    }

    return {
        userAIsManglik: statusA !== 'none' && statusA !== 'unknown',
        userBIsManglik: statusB !== 'none' && statusB !== 'unknown',
        compatible,
        severity,
        explanation,
        cancellations: (statusA !== 'none' && statusB !== 'none') ? ['Mutual Manglik Cancellation'] : [],
        methodologyVersion: METHODOLOGY
    };
}
