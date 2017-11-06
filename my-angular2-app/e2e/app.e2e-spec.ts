import { MyAngular2AppPage } from './app.po';

describe('my-angular2-app App', () => {
  let page: MyAngular2AppPage;

  beforeEach(() => {
    page = new MyAngular2AppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
