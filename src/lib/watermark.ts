/**
 * @file watermark.ts
 * @copyright 2024 Abhinand. All rights reserved.
 * @license Proprietary
 */

export const WATERMARK = {
  version: '1.0.0',
  timestamp: Date.now(),
  owner: 'Abhinand',
  trackingId: 'VOYAGEX-' + Math.random().toString(36).substring(2, 15),
  checksum: 'protected',
  domain: 'voyage-X1',
  copyright: '© 2024 Abhinand. All rights reserved.'
};

export function embedWatermark(code: string): string {
  const watermark = `
    /* 
     * ${WATERMARK.copyright}
     * Tracking ID: ${WATERMARK.trackingId}
     * Version: ${WATERMARK.version}
     * Domain: ${WATERMARK.domain}
     * Timestamp: ${WATERMARK.timestamp}
     */
    ${code}
  `;
  return watermark;
}

export function verifyWatermark(code: string): boolean {
  return code.includes(WATERMARK.trackingId) && 
         code.includes(WATERMARK.domain) && 
         code.includes(WATERMARK.copyright);
} 