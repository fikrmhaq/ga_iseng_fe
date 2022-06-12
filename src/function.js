export function calculate_sdm(frontend, backend, sdm) {

    return sdm.filter(a => a.role == "frontend").filter(b => b.skill >= frontend).length + sdm.filter(a => a.role == "backend").filter(b => b.skill >= backend).length
}

export function calculate_requirements(frontend, backend, sdm) {

    return (((sdm.filter(a => a.role == "frontend").filter(b => b.skill >= frontend).map(el => el.skill).reduce((partialSum, a) => partialSum + a, 0) + sdm.filter(a => a.role == "backend").filter(b => b.skill >= backend).map(el => el.skill).reduce((partialSum, a) => partialSum + a, 0)) - (frontend + backend)) / 10) + 0
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export function then_get(deadline) {
    const month = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Dec"]
    const d = new Date().addDays(deadline);


    return d.getDate() + " " + month[d.getMonth()]
}

export function calculate_day_of_year(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);

    return day
}