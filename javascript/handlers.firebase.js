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


