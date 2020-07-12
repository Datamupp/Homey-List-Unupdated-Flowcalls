/*
When a flow is renamed and the flow is linked from another flow the NAME is not updated in the flowcards.
The flow still works though. Why athom use both ID and NAME instead of just ID is a mystery to me.
This script lists all flows containing unupdated connections to other flows so it's easier for you to
find out which one to update.

When creating this script I found out that there is a difference in how the different methods in renaming
a flow handles spaces.  On flow.homey.app they use regular spaces (#32) but in the iOS-app they use
non-breakable spaces (#160).  So if you work in both systems it could be that this script finds a 
difference in the naming which looks correct to you.

Maybe someday I'll have the script to rename the flowcalls automatically, right now I simply don't
know how to do it :)

Håkan Bergström
https://github.com/Datamupp
*/

var flowDict = {};
var x;
var unupdatedCards = 0;

let allFlows = await Homey.flow.getFlows();

_.forEach(allFlows, currentFlow => {
    //Create a list of all flows with their ID and NAME for easier access later
    flowDict[currentFlow.id] = currentFlow.name;
})

_.forEach(allFlows, currentFlow => {

  for (x of currentFlow.conditions) {
    if (x != null) {
      if (x.uri == 'homey:manager:flow') {
        if (x.args.flow.name != flowDict[x.args.flow.id]) {
          unupdatedCards++;
          console.log('Conditioncard in flow "' + flowDict[currentFlow.id] + '"\nis refering to "' + flowDict[x.args.flow.id] + '" as "' + x.args.flow.name + '"\n');
        }
      }
    }
  }
 
  for (x of currentFlow.actions) {
    if (x != null) {
      if (x.uri == 'homey:manager:flow'){
        if (x.args.flow.name != flowDict[x.args.flow.id]) {
          unupdatedCards++;
          console.log('Actioncard in flow "' + flowDict[currentFlow.id] + '"\nis refering to "' + flowDict[x.args.flow.id] + '" as "' + x.args.flow.name + '"\n');
        }
      }
    }
  }
})

if (unupdatedCards == 0) {
  console.log('Great!  No unupdated flowcalls found!');
}
else
{
  console.log('Found ' + unupdatedCards + ' unupdated flowcalls!')
}

return;