var node = {
    // add a new node to the raphael canvas
    add: function(id, x, y, text, status) {
        status = typeof status !== 'undefined' ? status : 1; // if status was not provided set status to 1
        var colors = this.getColorByStatus(status);


        // --- Text Wrap ---
        var text_wrapped = ""; // the text wrapped at TEXT_WIDTH characters
        var inword;    // is the pointer inside a word
        var a = 0;     // number of characters on current line
        var lines = 1; // number of lines the message spans
        for (var i = 0; i < text.length; i++, a++) {
            if (text[i] === " ") inword = false; // if the next character is a space, we are in a word
            else inword = true; // we are not in word

            text_wrapped += text[i]; // add the next character to the wrapped

            if (a >= NODE_TEXT_WIDTH && inword === false) {
                text_wrapped += "\n";
                a = 0;
                lines++;
            }
        }

        // --- Node ---
        var n = r.rect(0, 0, NODE_WIDTH, NODE_HEIGHT, NODE_RADIUS); // create the node
        n.attr("fill",  colors.background); // node background color
        n.attr("stroke",  colors.border);   // node border color

        n.click(function() {   // set up a click handler for the node
            node.maximize(id); // maximize the node if clicked
        });

        // --- Text ---
        var t = r.text(0, 0, text_wrapped); // create the text element
        t.attr("font-size", 14);        // set text size
        t.attr("font-family", "Lato");  // set font
        t.attr("text-anchor", "start"); // set the anchor
        t.attr("fill", "#ffffff");      // set text color
        t.translate(20, NODE_HEIGHT / 2 - 10);

        // --- Buttons ---
         
        var button_x = NODE_WIDTH - 35;
        var button_y = NODE_HEIGHT - 35;

        var accept_background = r.rect(0,0,30,30);
        accept_background.attr("fill", "rgba(0,0,0,0)");     // fill color of the check mark
        accept_background.attr("stroke", "rgba(0,0,0,0)");     // fill color of the check mark
        accept_background.attr("cursor", "pointer");   // change the cursor while hovering

        var accept = r.path("M2.379,14.729 5.208,11.899 12.958,19.648" +
            " 25.877,6.733 28.707,9.561 12.958,25.308z"); // draws a check mark
        accept.attr("fill", "#ffffff");     // fill color of the check mark
        accept.attr("stroke", "#ffffff");   // border color of the check mark
        accept.attr("cursor", "pointer");   // change the cursor while hovering

        var accept_button = r.set(); // create a set to hold the checkmark and its background
        accept_button.push(accept_background, accept);  // add the checkmark and the button

        var reject_background = r.rect(0,0,30,30);
        reject_background.attr("fill", "rgba(0,0,0,0)");    // fill color of the x
        reject_background.attr("stroke", "rgba(0,0,0,0)");  // fill color of the x
        reject_background.attr("cursor", "pointer");        // change the cursor while hovering

        // draws an x cross
        var reject = r.path("M24.778,21.419 19.276,15.917 24.777,10.415" +
            " 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618," +
            "15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z");
        reject.attr("fill", "#ffffff");   // fill color of the cross
        reject.attr("stroke", "#ffffff"); // stroke color of the cross
        reject.attr("cursor", "pointer"); // change the cursor while hovering

        var reject_button = r.set(); // create a set to hold the checkmark and its background
        reject_button.push(reject_background, reject);  // add the checkmark and the button


        // set up the click events for the buttons
        accept.click(function() {
            argument.vote(id, 2);
            node.minimize(id);
        });
        accept_background.click(function() {
            argument.vote(id, 2);
            node.minimize(id);
        });

        reject.click(function() {
            argument.vote(id, 0);
            node.minimize(id);
        });
        reject_background.click(function() {
            argument.vote(id, 0);
            node.minimize(id);
        });


        var set = r.set(); // create a set to hold the node and its text
        set.push(n, t);    // add the node and the text to the set
        set.push(accept_button, reject_button); // add the buttons t

        accept_button.translate(button_x - 30, button_y); // position the check button
        reject_button.translate(button_x, button_y); // position the check button

        set.translate(x, y);

        nodes[id] = set; // store the node in an array

        if (nodebase.child(id).child('votes').child(USER_ID) !== null) {
            node.minimize(id); // minimize the node at the beginning if voted already
        }


    },
    // remove the node at the given id from both the canvas and the array
    remove: function(id) {
        nodes[id].remove();  // remove the node from the canvas
        nodes.splice(id, 1); // remove the element from the nodes array

    },
    // move the given node to the given x, y coordinates
    move: function(id, x, y) {
        nodes[id].animate({"x": x, "y": y}, 500, "ease-in");

        // fix for the button animations

        // get the paths of the button symbols
        var path_check = nodes[id][2][1].attr("path").toString();
        var path_x     = nodes[id][3][1].attr("path").toString();

        // transform the paths by adding the translation
        var check_transformed = Raphael.transformPath(path_check, "T" + x + "," + y);
        var x_transformed = Raphael.transformPath(path_x, "T" + x + "," + y);

        // animate the paths
        nodes[id][2][1].animate({path: check_transformed}, 500, "ease-in");
        nodes[id][3][1].animate({path: x_transformed}, 500, "ease-in");

    },
    // change the status of the node by changing its colors
    changeStatus: function(id, status) {
        colors = this.getColorByStatus(status);

        nodes[id][0].attr("fill", colors["background"]); // node background
        nodes[id][0].attr("stroke", colors["border"]);   // node border

        nodes_by_status[status]++;

        var move_x = status * 350 + 100 + nodes[id][0].attr("x");
        var move_y = nodes_by_status[status] * 140 - 90;

        console.log(nodes[id][0].attr("x") + " " + move_y);

        node.move(id, move_x, move_y);


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
    },
    // minimize the node in to a circle
    minimize: function(id) {
        // hide the text
        nodes[id][1].animate({"opacity": 0}, 200, "linear",
           function() {
                this.hide(); // make the button unclickable
            });
        // hide the buttons
        nodes[id][2].animate({"opacity": 0}, 200, "linear",
            function() {
                this.hide(); // make the button unclickable
            });
        nodes[id][3].animate({"opacity": 0}, 200, "linear", function() {
            // make the button unclickable
            this.hide();
            // minimize the node
            nodes[id][0].animate({"width": NODE_WIDTH_MIN,
              "height": NODE_HEIGHT_MIN,
              "r": NODE_RADIUS_MIN}, 300);
        });
    },
    // maximize the given node
    maximize: function(id) {
        // maximize the node
        nodes[id][0].animate({"width": NODE_WIDTH,
            "height": NODE_HEIGHT,
            "r": NODE_RADIUS}, 300,
            "linear", function() {
                // unhide the text
                nodes[id][1].show().animate({"opacity": 100}, 200, "linear");
                // unhide the buttons
                nodes[id][2].show().animate({"opacity": 100}, 200, "linear");
                nodes[id][3].show().animate({"opacity": 100}, 200, "linear");
            });
    }
};