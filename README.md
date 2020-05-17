# ChartGraphX VS Code extension

This is the VS code extension used to track the data needed for the Interactive source code map displayed on our website. 

## Running the extension

To run the extension you have clone the repo and open the extension folder in VS Code.    
``git clone https://github.com/cse112-sp20/ChartGraphX-MVP-Mini-Project-2-.git``   
``cd ChartGraphX-MVP-Mini-Project-2-/extension``   
``npm i``  
``code .``    



Then, press F5 to open a new window with your extension loaded.  
Open one of your workspaces.  
Run the extension command by pressing the CGphX button on your status bar (bottom bar). 

## Features
<img align="right" src="/readme.img/CGphx_proto.png" alt="prototypes"
	title="GhartGraphX extension" width="50%" />
To view the extension commands, press the CGphX button on your status bar (bottom bar). This will prompt a dropdown menu in your IDE providing you with the available commands.  


ChartGraphX provides commands to sign up/in/out of the service using email and password. The color of the CGphX button indicates wether the extension is active or not.   

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
