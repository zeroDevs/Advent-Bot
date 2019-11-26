exports.estDay = () => {
    // Outputs the day number
    // EST Timezone
    var dt = new Date();
    var offset = -300; //Timezone offset for EST in minutes.
    let d = new Date(dt.getTime() + offset * 60 * 1000);
    return d.getDate();
};

exports.estTime = () => {
    // time convertion to EST
    var dt = new Date();
    var offset = -300; //Timezone offset for EST in minutes.
    return new Date(dt.getTime() + offset * 60 * 1000);
};
