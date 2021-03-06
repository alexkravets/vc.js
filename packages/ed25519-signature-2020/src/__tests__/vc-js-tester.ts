import * as fixtures from '../__fixtures__';
import { Ed25519Signature2020 } from '..';
const vc = require('vc-js');
const { documentLoader } = fixtures;

export const runTests = (suite: any) => {
  it('issue verifiableCredential', async () => {
    const verifiableCredential = await vc.issue({
      credential: { ...fixtures.vc_template_0 },
      suite,
      documentLoader,
    });
    expect(verifiableCredential).toEqual(fixtures.vc_0);
  });

  it('verify verifiableCredential', async () => {
    const result = await vc.verifyCredential({
      credential: { ...fixtures.vc_0 },
      suite: new Ed25519Signature2020({}),
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });

  it('createPresentation & signPresentation', async () => {
    const id = 'ebc6f1c2';
    const holder = 'did:ex:12345';
    const presentation = await vc.createPresentation({
      verifiableCredential: fixtures.vc_0,
      id,
      holder,
    });
    expect(presentation.type).toEqual(['VerifiablePresentation']);
    presentation['@context'].push('https://example.com/credentials/latest');
    const verifiablePresentation = await vc.signPresentation({
      presentation,
      suite,
      challenge: '123',
      documentLoader,
    });
    expect(verifiablePresentation).toEqual(fixtures.vp_0);
    expect(verifiablePresentation.proof).toBeDefined();
  });

  it('verify verifiablePresentation', async () => {
    const result = await vc.verify({
      presentation: { ...fixtures.vp_0 },
      challenge: '123',
      suite: new Ed25519Signature2020({}),
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });
};
