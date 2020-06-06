# CartoGraphX VS Code extension

The CartoGraphX VS Code extension is used to track and share user-metrics inside a team workspace to be viewed on the interactive source-code map displayed on our website. This tool will greatly increase accountability because each developer’s work will be visible in real time.

## Running the extension

To run the extension you have clone the repo and open the extension folder in VS Code.    
``git clone https://github.com/cse112-sp20/CartoGraphX-VS-Extension.git``   
``cd CartoGraphX-VS-Extension``	
``npm i``    
``code .``    



Then, press F5 to open a new window with your extension loaded.  
Open one of your workspaces.  
Run the extension command by pressing the CGphX button on your status bar (bottom bar). 

## Features
<img align="right" src="https://github.com/cse112-sp20/CartoGraphX-VS-Extension/blob/master/readme.img/CGphx_proto.png" alt="prototypes"
	title="CartoGraphX" width="50%" />
To view the extension commands, press the CGphX button on your status bar (bottom bar). This will prompt a dropdown menu in your IDE providing you with the available commands.  


CartoGraphX provides commands to sign up/in/out of the service using email and password. The color of the CGphX button indicates wether the extension is active or not.   

When signed in, you have the ability to check user credentials, as well as running the displayCurrentWorkingFile() command.

## Testing

To run the unit tests, first run the command:  
``npm run pretest``  

Then, through the "Run & Debug" window choose "Extension Tests" and press the start debugging button. 

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.
