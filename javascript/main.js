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

var NODE_TEXT_WIDTH = 35;


var r;     // stores Raphael
var nodes; // store the nodes

window.onload = function() {

    r = Raphael("nodes", screen.width, screen.height);
    nodes = Array();

    node.add(10,10,1,"This is a sample argument, I can have up to 140 characters." +
        "In future, these arguments might also include #hashtags, and might" +
        "integrate with Twitter.", 2);

    node.add(410,10,1,"This is a sample argument, I can have up to 140 characters." +
        "In future, these arguments might also include #hashtags, and might" +
        "integrate with Twitter.", 1);

    node.add(810,10,1,"This is a sample argument, I can have up to 140 characters." +
        "In future, these arguments might also include #hashtags, and might" +
        "integrate with Twitter.", 0);
};

var node = {
    // add a new node to the raphael canvas
    add: function(x, y, id, text, status) {
        status = status === null ? 1 : status; // if status was not provided set status to 1
        var colors = this.getColorByStatus(status);

        // --- Node ---

        var n = r.rect(x, y, NODE_WIDTH, NODE_HEIGHT, 5); // create the node
        n.attr("fill",  colors["background"]); // node background color
        n.attr("stroke",  colors["border"]);   // node border color

        // --- Text ---

        var text_wrapped = ""; // the text wrapped at TEXT_WIDTH characters
        var inword;  // is the pointer inside a word
        var a = 0;   // is it time for another line break
        for (var i = 0; i < text.length; i++, a++) {
            if (text[i] === " ") inword = false; // if the next character is a space, we are in a word
            else inword = true; // we are not in word

            text_wrapped += text[i]; // add the next character to the wrapped

            if (a >= NODE_TEXT_WIDTH && inword === false) {
                text_wrapped += "\n";
                a = 0;
            }
        }

        var t = r.text(x+25, y + (NODE_HEIGHT - 20) / 2, text_wrapped); // create the text element
        t.attr("font-size", 14);        // set text size
        t.attr("font-family", "Lato");  // set font
        t.attr("text-anchor", "start"); // set the anchor
        t.attr("fill", "#ffffff");      // set text color

        // --- Buttons ---
         
        var button_x = x + NODE_WIDTH - 35;
        var button_y = y + NODE_HEIGHT - 35;

        var accept_background = r.rect(0,0,30,30);
        accept_background.attr("fill", "rgba(0,0,0,0)");     // fill color of the check mark
        accept_background.attr("stroke", "rgba(0,0,0,0)");     // fill color of the check mark
        accept_background.attr("cursor", "pointer");   // change the cursor while hovering
        accept_background.translate(button_x - 30, button_y);

        var accept = r.path("M2.379,14.729 5.208,11.899 12.958,19.648" +
            " 25.877,6.733 28.707,9.561 12.958,25.308z"); // draws a check mark
        accept.attr("fill", "#ffffff");     // fill color of the check mark
        accept.attr("stroke", "#ffffff");   // border color of the check mark
        accept.attr("cursor", "pointer");   // change the cursor while hovering
        accept.translate(button_x - 30, button_y); // position the check mark

        var accept_button = r.set(); // create a set to hold the checkmark and its background
        accept_button.push(accept_background, accept);  // add the checkmark and the button

        var reject_background = r.rect(0,0,30,30);
        reject_background.attr("fill", "rgba(0,0,0,0)");    // fill color of the check mark
        reject_background.attr("stroke", "rgba(0,0,0,0)");  // fill color of the check mark
        reject_background.attr("cursor", "pointer");        // change the cursor while hovering
        reject_background.translate(button_x, button_y);    // 

        // draws an x cross
        var reject = r.path("M24.778,21.419 19.276,15.917 24.777,10.415" +
            " 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618," +
            "15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z");
        reject.attr("fill", "#ffffff");   // fill color of the cross
        reject.attr("stroke", "#ffffff"); // stroke color of the cross
        reject.attr("cursor", "pointer"); // change the cursor while hovering
        reject.translate(button_x, button_y); // position the cross

        var reject_button = r.set(); // create a set to hold the checkmark and its background
        reject_button.push(reject_background, reject);  // add the checkmark and the button

        var set = r.set(); // create a set to hold the node and its text
        set.push(n, t);    // add the node and the text to the set
        set.push(accept_button, reject_button); // add the buttons t

        nodes[id] = set; // store the node in an array

        // TODO: notify firebase

    },
    // remove the node at the given id from both the canvas and the array
    remove: function(id) {
        nodes[id].remove();  // remove the node from the canvas
        nodes.splice(id, 1); // remove the element from the nodes array

        // TODO: notify firebase

    },
    // move the given node to the given x, y coordinates
    move: function(id, x, y) {
        nodes[n].attr("x", x); // update the x coordinate
        nodes[n].attr("y", y); // update the y coordinate
    },
    // change the status of the node by changing its colors
    changeStatus: function(id, status) {
        colors = this.getColorByStatus(status);

        nodes[id].attr("fill", colors["background"]); // node background
        nodes[id].attr("stroke", colors["border"]);   // node border

        // TODO: notify firebase

    },
    // get the color of the node from the given status
    getColorByStatus: function(status) {
        switch (status) {
            case NODE_AGREE: // change status to agree
                background = NODE_AGREE_BACKGROUND;
                border = NODE_AGREE_BORDER;
                break;
            case NODE_DISAGREE: // change status to disagree
                background = NODE_DISAGREE_BACKGROUND;
                border = NODE_DISAGREE_BORDER;
                break;
            default:  // change status to undecided
                background = NODE_UNDECIDED_BACKGROUND;
                border = NODE_UNDECIDED_BORDER;
        }

        var colors = {
            "background": background,
            "border": border
        };

        return colors;
    }


};