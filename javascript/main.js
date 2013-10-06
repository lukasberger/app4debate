var FIREBASE_URL = "https://app4debate.firebaseio.com";

var NODE_AGREE                = 2;
var NODE_AGREE_BACKGROUND     = "#2ecc71";
var NODE_AGREE_BORDER         = "#27ae60";

var NODE_UNDECIDED            = 1;
var NODE_UNDECIDED_BACKGROUND = "#f1c40f";
var NODE_UNDECIDED_BORDER     = "#f39c12";

var NODE_DISAGREE             = 0;
var NODE_DISAGREE_BACKGROUND  = "#e74c3c";
var NODE_DISAGREE_BORDER      = "#c0392b";

var NODE_WIDTH  = 300;
var NODE_HEIGHT = 110;
var NODE_RADIUS = 10;

var NODE_WIDTH_MIN  = 40;
var NODE_HEIGHT_MIN = 40;
var NODE_RADIUS_MIN = 20;

var NODE_TEXT_WIDTH = 35;

var USER_ID = 2; // the user's unique identifier
var ARGUMENT_ID = "-J5BZ3i45H-7GVO5ZGiC"; // the argments unique identifier

// intitalize Firebase
var argumentbase = new Firebase(FIREBASE_URL + "/arguments");
var nodebase = argumentbase.child(ARGUMENT_ID).child("nodes");

var r;         // stores Raphael
var nodes;     // store the displayed
var nodes_by_status; // store the number of the nodes in a column based on status

var gz;

// -- HANDLERS FOR FIREBASE EVENTS --

nodebase.on("child_added", function(snapshot) {
    var n = snapshot.val();  // get the data of the new child
    nodes_by_status[n.status]++; // keep track of the number of nodes with each status

    // add the node to the site
    node.add(snapshot.name(), n.status * 100, nodes_by_status[n.status] * 100, n.text, n.status);
});

nodebase.on("child_changed", function(snapshot) {
    // since the node cannot be updated by user, assume vote change
    var n = snapshot.val(); // get the updated data for the child
    var a = Array(0,0,0);   // set up array to keep track of votes
    var l = 0;              // length of the array

    gz = n;

    // go through the array and add up all the votes by status
    for(var v in n.votes) {
        a[n.votes[v]]++;   // update the number of votes for the status
        l++;               // increment length by 1
    }

    // check all the votes for an absolute vote (all users voted the same)
    for (var i = a.length - 1; i >= 0; i--) {
        // if a vote is absolute, change the status of the node
        if (a[i] === l && l > 0 && n.status !== i)  {
            nodebase.child(snapshot.name()).child("status").set(i);
            node.changeStatus(snapshot.name(), i);
        } else if (l > 0 && n.status !== 1) {
            nodebase.child(snapshot.name()).child("status").set(1);
            node.changeStatus(snapshot.name(), 1);
        }
    }
});



window.onload = function() {

    r = Raphael("nodes", screen.width, screen.height);
    nodes = Array();
    nodes_by_status = Array(0,0,0);

    // argument.add("This is a sample argument, I can have up to 140 characters." +
    //     " In future, these arguments might also include #hashtags, and might" +
    //     " integrate with Twitter.");

    // argument.add("Arguments may also be much shorter. I this case, the height" +
    //     " of the node will automatically adapt.");

    // argument.add("Arguments can also be VERY short.");

};