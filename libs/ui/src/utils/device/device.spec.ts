import { detectAgent } from './index';

describe('device', () => {
  it('detects Android User-Agent', () => {
    const androidAgent =
      'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Mobile Safari/537.36';
    expect(detectAgent(androidAgent).device).toEqual('Android');
  });

  it('detects iOS User-Agent', () => {
    const iosAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    expect(detectAgent(iosAgent).device).toEqual('iOS');
  });

  it('detects is mobile', () => {
    const iosAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    expect(detectAgent(iosAgent).isMobile).toBeTruthy();
  });
});
