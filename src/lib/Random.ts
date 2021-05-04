export const randomNumber = (min: number, max: number, dp: number) => {
    var rand = Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);  // could be min or max or anything in between
    var power = Math.pow(10, dp);
    return Math.floor(rand*power) / power;
}