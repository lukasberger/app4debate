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

var USER_ID = 1; // the user's unique identifier
var ARGUMENT_ID = "-J5BZ3i45H-7GVO5ZGiC"; // the argments unique identifier


var r;                              // stores Raphael
var nodes = Array();                // stores the displayed nodes
var nodes_by_status = Array(0,0,0); // stores the number of the nodes in a
                                    // column based on status


// intitalize Firebase
var argumentbase = new Firebase(FIREBASE_URL + "/arguments");
var nodebase = argumentbase.child(ARGUMENT_ID).child("nodes");
