import { MaterialTest1Page } from './app.po';

describe('material-test-1 App', function() {
  let page: MaterialTest1Page;

  beforeEach(() => {
    page = new MaterialTest1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
