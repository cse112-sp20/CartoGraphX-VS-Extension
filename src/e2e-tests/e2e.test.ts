// import the webdriver and the high level browser wrapper

//import { VSBrowser, WebDriver, Workbench, NotificationType, InputBox } from 'vscode-extension-tester';
import * as extest from "vscode-extension-tester";
import * as assert from "assert";
import * as firebase from "firebase";
import { firebaseConfig } from "../config";

// Create a Mocha suite
describe('E2E tests', () => {
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

  
  // test whatever we want using webdriver, here we are just checking the page title
  it('Checking to see if CartoGraphX is Active!', async () => {
    const notifCenter = await new extest.Workbench().openNotificationsCenter();
    const notifications = await notifCenter.getNotifications(extest.NotificationType.Any);
  
    const notification2 = notifications[1];
    const message2 = await notification2.getMessage();
    assert.equal(message2, 'CartoGraphX is now active!');

    notifCenter.close();
  });

  it('Testing Sign in', async () => {

    //this block activates the vscode extension
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();

    //Clicking Sign In and inputting credentials
    await input.selectQuickPick('Sign In');
    await input.setText(testUser.email);
    await input.confirm();
    await input.setText(testUser.password);
    await input.confirm();

    await delay(400);

  });    

  // getting user info  
  it('Testing get user info', async () => {
    await delay(100);
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();

    await input.selectQuickPick('Get user info');


    //not sure why this isnt working??
    assert.equal(testUser.email, auth.currentUser?.email);



  });

  it('Testing Sign out', async () => {
    const workbench = new extest.Workbench();
    await workbench.executeCommand(command);
    let input = new extest.InputBox();

    
    await input.selectQuickPick('Sign out');

    
    assert.equal(null, auth.currentUser);
  });

  it('Asserting notification window for sign in and get user info', async() => {
    const notifCenter = await new extest.Workbench().openNotificationsCenter();
    const notifications = await notifCenter.getNotifications(extest.NotificationType.Any);
    const signedOut = notifications[0];
    const userInfo = notifications[1];
    const signedIn = notifications[2];

    const signedOutT = await signedOut.getMessage();
    assert.equal(signedOutT, 'You are now signed out of CartoGraphX!');

    const userInfoT = await userInfo.getMessage();
    assert.equal(userInfoT, 'Signed in as: test@mail.com');

    const signedInT = await signedIn.getMessage();
    assert.equal(signedInT, 'You are now signed in to CartoGraphX as: test@mail.com');


    await notifCenter.close();


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

    await delay(500);

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

    await delay(500);

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

    await delay(500);
  });

  it('Asserting notification window', async () =>{

    await delay(500);

    //open the notification center
    const notifCenter = await new extest.Workbench().openNotificationsCenter();
    const notifications = await notifCenter.getNotifications(extest.NotificationType.Any);
    const alreadyExists = notifications[0];
    const badPW = notifications[1];
    const badEmail = notifications[2];



    const alreadyExistsT = await alreadyExists.getMessage();
    assert.equal(alreadyExistsT, 'The email address is already in use by another account.');

    const badPWT = await badPW.getMessage();
    assert.equal(badPWT, 'The password is invalid or the user does not have a password.');

    const badEmailT = await badEmail.getMessage();
    assert.equal(badEmailT, 'The email address is badly formatted.');
  });


});