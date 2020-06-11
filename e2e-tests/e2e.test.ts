// import the webdriver and the high level browser wrapper

//import { VSBrowser, WebDriver, Workbench, NotificationType, InputBox } from 'vscode-extension-tester';
import * as extest from "vscode-extension-tester";
import * as assert from "assert";
import * as firebase from "firebase";
import { firebaseConfig } from "../src/config";

// Create a Mocha suite
describe('E2E UI tests', function() {
  this.timeout(60000);
  // helper function to delay the test to wait for database
  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms));
  }

  


  let browser: extest.VSBrowser;
  let driver: extest.WebDriver;

  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }
  const auth = firebase.auth();
  const testUser = {
      email: "test@mail.com",
      password: "testPassword"
  };
  const command = 'CGphX commands';
  
  // initialize the browser and webdriver
  before(async () => {
    browser = extest.VSBrowser.instance;
    driver = browser.driver;
  });


  it('Testing Sign in', async () => {

    //this block activates the vscode extension
    const workbench = new extest.Workbench();
    await delay(60000)

    await workbench.executeCommand(command);
    await delay(1000);
    let input = new extest.InputBox();

    //Clicking Sign In and inputting credentials
    await input.selectQuickPick('Sign In');
    await delay(1000);
    await input.setText(testUser.email);
    await delay(1000);
    await input.confirm();
    await delay(1000);
    await input.setText(testUser.password);
    await delay(1000);
    await input.confirm();
    await delay(1000);

    const notification = await driver.wait(() => { return notificationExists('You are now signed in to CartoGraphX as: ' + testUser.email); }, 10000) as extest.Notification;
    const message = await notification.getMessage();
    assert.equal(message, 'You are now signed in to CartoGraphX as: ' + testUser.email);

  });    

  // getting user info  
  it('Testing get user info', async () => {
    await delay(100);
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();

    await input.selectQuickPick('Get user info');

    const notification = await driver.wait(() => { return notificationExists('Signed in as: ' + testUser.email); }, 10000) as extest.Notification;
    const message = await notification.getMessage();
    assert.equal(message, 'Signed in as: ' + testUser.email);
  });

  it('Testing Create Map', async () => {
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();
    await input.selectQuickPick('Create map');
    await input.setText('test map');
    await input.confirm();
  });

  it('Testing Load Map', async () => {
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();
    await input.selectQuickPick('Load map');
    await input.setText('TestMapKey');
    await input.confirm();
  })

  it('Testing Sign out', async () => {
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();

    
    await input.selectQuickPick('Sign out');

    const notification = await driver.wait(() => { return notificationExists('You are now signed out of CartoGraphX!'); }, 10000) as extest.Notification;
    const message = await notification.getMessage();
    assert.equal(message, 'You are now signed out of CartoGraphX!');

    assert.equal(null, auth.currentUser);
  });


  it('Testing sign in with bad email', async () =>{
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();

    //Clicking Sign In and inputting bad email
    await input.selectQuickPick('Sign In');
    await input.setText('noatsignemailisbad');
    await input.confirm();
    await input.setText('random password');
    await input.confirm();

    const notification = await driver.wait(() => { return notificationExists('The email address is badly formatted.'); }, 10000) as extest.Notification;
    const message = await notification.getMessage();
    assert.equal(message, 'The email address is badly formatted.');

  });

  it('Testing sign in with bad password', async () =>{
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();

    //Clicking Sign In and inputting bad password
    await input.selectQuickPick('Sign In');
    await input.setText(testUser.email);
    await input.confirm();
    await input.setText('randompassword');
    await input.confirm();

    const notification = await driver.wait(() => { return notificationExists('The password is invalid or the user does not have a password.'); }, 10000) as extest.Notification;
    const message = await notification.getMessage();
    assert.equal(message, 'The password is invalid or the user does not have a password.');
  });

  it('Testing signUp with a user that already exists', async () => {
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();

    await input.selectQuickPick('Sign Up');
    await input.setText(testUser.email);
    await input.confirm();
    await input.setText(testUser.password);
    await input.confirm();

    const notification = await driver.wait(() => { return notificationExists('The email address is already in use by another account.'); }, 10000) as extest.Notification;
    const message = await notification.getMessage();
    assert.equal(message, 'The email address is already in use by another account.');
  });


});

//helper function that waits until a notification with text: string exists
async function notificationExists(text: string): Promise<extest.Notification | undefined> {
  const notifications = await new extest.Workbench().getNotifications();
  for (const notification of notifications) {
      const message = await notification.getMessage();
      if (message.indexOf(text) >= 0) {
          return notification;
      }
  }
}