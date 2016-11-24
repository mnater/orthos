process.on('message', function(m) {
    if (m === "SIGHUP") {
        process.exit(0);
    } else {
        process.stdout.write(m);
    }
});