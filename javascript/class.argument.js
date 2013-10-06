var argument = {
    // intialize an empty arguemnt
    initialize: function(subject) {
        var a = {}; // create an empty object to store the arguments details

        // get the current date
        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + ' ' +
            ('00' + date.getUTCHours()).slice(-2) + ':' +
            ('00' + date.getUTCMinutes()).slice(-2) + ':' +
            ('00' + date.getUTCSeconds()).slice(-2);
        
        a.subject = subject;
        a.created = date;

        argumentbase.push(a);
    },
    // add a new point to the discussion
    add: function(text) {
        var n = {};

        n.user = USER_ID; // set the author's id
        n.text = text;    // set the text of the node
        n.status = NODE_UNDECIDED; // default status is undecided
        n.votes = {};     // will store users' votes
        n.votes[USER_ID] = NODE_UNDECIDED; // default vote is undecided

        nodebase.push(n); // add the node to the nodes of current argument
    },
    // handles the vote function of the current user
    vote: function(id, new_status) {
        // get the reference point for the vote
        var voteRef = new Firebase(FIREBASE_URL + "/arguments/" +
            ARGUMENT_ID + "/nodes/" + id + "/votes");

        if (voteRef.child(USER_ID) !== null) {
            voteRef.child(USER_ID).set(new_status); // update the vote for current user
        } else {
            var vote = {};
            vote[USER_ID] = new_status; // assign the new status to current user
            voteRef.push(vote); // create a new vote for the current user
        }
    }
};