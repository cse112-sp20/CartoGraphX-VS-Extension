# CartoGraphX VS Code extension

The CartoGraphX VS Code extension is used to track and share user-metrics inside a team workspace to be viewed on the interactive source-code map displayed on our website. This tool will greatly increase accountability because each developer’s work will be visible in real time.

## What is CartoGraphX?
CartoGraphX is a web application that allows software developers to make a map out of the files in their coding project! In CartoGraphX, we use VSCode to track metrics such as the number of lines in a file as well as where each member of the team is on the map in real time. This map can be viewed by anyone on the team at any given moment. CartoGraphX was designed to help promote a more productive workplace environment by giving engineers the ability to visualize the code they write and track the live progress of their team. This provides extra motivation to software developers to help them write better code that’s easier to understand and to compete with their peers. 

## Who is CartoGraphX for?
We created CartoGraphX for software development teams. Our application is intended to help foster and grow a team environment through the use of code visualization. 

## Why do you need CartoGraphX?

**1. How long do you spend trying to understand the files in a project before you actually begin working?** <br/> A visualized map of the source code rather than a high level description design document might make your life easier.

**2. How long do you spend trying to understand code you didn’t write?** <br/> Knowing exactly who worked on which file and when would be nice wouldn’t it? We did that for you.

**3. How often are you actually collaborating with your team in a remote setting?** <br/> Our platform allows you to take full advantage of your teammates, increasing general productivity.

## What Inspired CartoGraphX?
Like any solution, CartoGraphX is a response to a problem, or rather a series of problems. The developers here at CartoGraphX got inspiration both from issues that have been affecting software development teams for a long time as well as other problems that have recently come to light with our current global situation. The problems that CartoGraphX hopes to mitigate are:

**1.** Developers often don’t understand the full scope of the projects they work on. Instead, they focus just on the area of the project where they write code and don’t pay much attention to the rest of the project. This is problematic because developers today are essentially trying to solve a problem with partial information. Our map provides software teams with an easier way of understanding the full scope of a project.

**2.** Remote work has led to a lack of accountability where developers are left to manage their own time without much supervision. Additionally, with people now having to work from home, there are many more distractions that lead to a fall in productivity. In order to address these issues, our platform keeps track of where coders are working in real time. This helps software developers to remain on task as seeing what their peers are doing will help them to maintain accountability. At the same time, this also helps team managers to monitor their developer’s behavior as well as help them to assess team progress throughout the development cycle. 

**3.** Software developers often have a hard time resolving bugs because they deal with code they didn’t write and therefore don’t completely understand. Our map keeps track of who worked in each file. This means that if a coder runs into an issue in a file or area of the program they don’t fully understand, they can easily see who worked on these files last and can contact them to get help!

**4.** Remote working has decreased team interaction further because people are no longer forced to see each other everyday. This is problematic because it affects team morale and reduces team communication in general. CartoGraphX aims to help keep teams connected by providing a platform where teams can work simultaneously.







## Features

<img align="right" src="https://github.com/cse112-sp20/CartoGraphX-VS-Extension/blob/features-readme/readme.img/InkedCGphx_proto%20(1)_LI.jpg" width=50% >
To view the extension commands, press the CGphX button on your status bar (bottom bar). This will prompt a dropdown menu in your IDE providing you with the available commands.

CartoGraphX provides commands to sign up/in/out of the service using email and password. The color grey indicates that the user is not logged in while the color of white means that the user is logged in.

When signed in, you have the ability to do a variety of features. To access those features, hit the CGphX button again once logged in. The features and their descriptions are found below:

**1. Display Current Working File:** This command gives the user the ability to see which file the user is currently working in. This will display a window in the middle of the screen and match the open file that the user is currently working in. At the same time, the window displays the number of lines inside the file.

**2. Get User Info:** This command verifies the user of who is logged in. A VSCode window appears on the bottom right of the screen saying which email is signed in. This is especially helpful for those who have multiple accounts to make sure they are logged into the right place for the project they wish to work on.

**3. Sign Out:** This command will allow for the person to sign out of their CartoGraphX account.

**4. Create Map:** The Create Map button is the first step to creating a visualized map of any GitHub project, no matter how big or small. First, make sure that the user is also logged onto their GitHub and inside the repository they wish to use for their map. The button will first ask the user to provide a map name. This name could be the name of your GitHub project or whatever the user wants! Once a valid name has been entered, a map will appear in a newly created tab on the rightmost side of the tab view that models the project's GitHub master branch. To view the newly created map, simply go to that tab and hit "Display Map." At the same time, a popup window will appear containing that map's key. Save this key and use it to invite your teammate(s) to the map (see load map below). After that, CartoGraphX is good to go! Feel free to work on your project base and see how the map updates over time.

**5. Load Map:** Load Map allows you to jump into an existing map right where it left off! Simply take the Map Key either that was created for you when you created a map (see create map above) or was given to you by a teammate. Make sure first that you are logged into your GitHub account as it will not work otherwise. Next, in the text field that is generated by the command, enter in the map key that either your teammate invited you to or you have saved on your computer. From there, a new tab will pop up in VSCode containing your map. You can navigate to that tab to view the map. Once the steps above have been completed, CartoGraphX is good to go! Feel free to work on your project base and see how the map updates over time.
