nodebase.on("child_added", function(snapshot) {
    var n = snapshot.val();  // get the data of the new child
    nodes_by_status[n.status]++; // keep track of the number of nodes with each status

    // add the node to the site
    node.add(snapshot.name(), n.status * 350 + 100, nodes_by_status[n.status] * 140 - 90, n.text, n.status);
});

nodebase.on("child_changed", function(snapshot) {
    // since the node cannot be updated by user, assume vote change
    var n = snapshot.val(); // get the updated data for the child
    var a = Array(0,0,0);   // set up array to keep track of votes
    var l = 0;              // length of the array

    // go through the array and add up all the votes by status
    for(var v in n.votes) {
        a[n.votes[v]]++;   // update the number of votes for the status
        l++;               // increment length by 1
    }

    if (l > 0 && (a[0] == l || a[1] == l || a[2] == l)) {

        if (a[0] == l && n.status !== 0) {
            nodebase.child(snapshot.name()).child("status").set(0);
            node.changeStatus(snapshot.name(), 0);
        } else if (a[2] == l && n.status !== 2) {
            nodebase.child(snapshot.name()).child("status").set(2);
            node.changeStatus(snapshot.name(), 2);
        }

    } else if (n.status !== 1) {
        nodebase.child(snapshot.name()).child("status").set(1);
        node.changeStatus(snapshot.name(), 1);
    }

});


