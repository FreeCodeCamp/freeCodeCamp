/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* global expect */

import { injectConditionalTags } from './tags';

describe('Tags', () => {
  it('injectConditionalTags should inject gap dev homelocation', () => {
    const injectedTags: any = injectConditionalTags(
      [],
      'https://www.freecodecamp.dev'
    );
    expect(injectedTags.length === 1).toBeTruthy();
    expect(injectedTags[0].props.id === 'gap-dev').toBeTruthy();
  });
  it('injectConditionalTags should inject gap for english homeLocation', () => {
    const injectedTags: any = injectConditionalTags(
      [],
      'https://www.freecodecamp.org'
    );
    expect(injectedTags.length === 1).toBeTruthy();
    expect(injectedTags[0].props.id === 'gap-org').toBeTruthy();
  });
  it('injectConditionalTags should inject gap for espanol homeLocation', () => {
    const injectedTags: any = injectConditionalTags(
      [],
      'https://www.freecodecamp.org/espanol'
    );
    expect(injectedTags.length === 1).toBeTruthy();
    expect(injectedTags[0].props.id === 'gap-org').toBeTruthy();
  });
  it('injectConditionalTags should inject cap and chinese gap for chinese homeLocation', () => {
    const injectedTags: any = injectConditionalTags(
      [],
      'https://chinese.freecodecamp.org'
    );
    expect(injectedTags.length === 2).toBeTruthy();
    expect(injectedTags[0].props.id === 'cap').toBeTruthy();
    expect(injectedTags[1].props.id === 'gap-org-chinese').toBeTruthy();
  });
  it('injectConditionalTags should not inject tags for localhost homeLocation', () => {
    const injectedTags: any = injectConditionalTags(
      [],
      'http://localhost:8000/'
    );
    expect(injectedTags.length === 0).toBeTruthy();
  });
});
