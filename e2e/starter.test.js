describe('雁宝AI - 核心功能测试', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('美颜面板应能正常折叠和展开', async () => {
    await element(by.id('camera-tab')).tap();
    await expect(element(by.id('beauty-panel'))).not.toBeVisible();
    await element(by.id('kuromi-beauty-button')).tap();
    await expect(element(by.id('beauty-panel'))).toBeVisible();
    await element(by.id('kuromi-beauty-button')).tap();
    await expect(element(by.id('beauty-panel'))).not.toBeVisible();
  });

  it('机位推荐应能正常显示', async () => {
    await element(by.id('home-tab')).tap();
    await element(by.id('kuromi-quick-menu')).tap();
    await element(by.id('spot-discovery-menu-item')).tap();
    await expect(element(by.id('spot-discovery-drawer'))).toBeVisible();
    await element(by.id('spot-drawer-close-button')).tap();
  });

  it('相册应能加载照片', async () => {
    await element(by.id('gallery-tab')).tap();
    await expect(element(by.id('photo-grid'))).toBeVisible();
  });

  it('设置页面署名应正确', async () => {
    await element(by.id('settings-tab')).tap();
    await expect(element(by.text('Made with 💜 by Jason Tsao who loves you the most'))).toBeVisible();
  });
});
});
