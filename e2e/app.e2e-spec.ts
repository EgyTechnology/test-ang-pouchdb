import { TestAngPouchdbPage } from './app.po';

describe('test-ang-pouchdb App', () => {
  let page: TestAngPouchdbPage;

  beforeEach(() => {
    page = new TestAngPouchdbPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
