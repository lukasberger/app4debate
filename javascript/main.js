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
var NODE_HEIGHT = 90;

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

        var n = r.rect(x, y, NODE_WIDTH, NODE_HEIGHT, 5); // create the node
        n.attr("fill",  colors["background"]); // node background color
        n.attr("stroke",  colors["border"]);   // node border color

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

        var t = r.text(x+25, y + NODE_HEIGHT / 2, text_wrapped); // create the text element
        t.attr("font-size", 14);
        t.attr("font-family", "Lato");
        t.attr("text-anchor", "start");
        t.attr("fill", "#ffffff");

        var set = r.set(); // create a set to hold the node and its text
        set.push(n, t);    // add the node and the text to the set

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